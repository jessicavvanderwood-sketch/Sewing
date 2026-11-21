'use strict';

const fittingRender = (() => {
  const focal = 3.7;
  const stride = 10;
  const noNormal = [0,0,0];
  let draw;

  function createRenderer() {
    const surface = document.createElement('canvas');
    const gl = surface.getContext('webgl', {alpha:true, antialias:true, depth:true});
    if (!gl) return null;

    const program = gl.createProgram();
    function attach(kind, source) {
      const shader = gl.createShader(kind);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(shader));
      gl.attachShader(program, shader);
      gl.deleteShader(shader);
    }
    attach(gl.VERTEX_SHADER, `
      attribute vec3 position;
      attribute vec3 normal;
      attribute vec4 material;
      uniform vec4 framing;
      uniform float focal;
      varying vec3 direction;
      varying vec4 color;
      void main() {
        float w = 1.0 - position.z / focal;
        // Near and far eye distances of 0.15 and 12 preserve depth precision.
        float depth = 1.02531646 * w - 0.30379747 / focal;
        gl_Position = vec4(position.x * framing.x + framing.z * w,
                          -position.y * framing.y + framing.w * w, depth, w);
        float magnitude = length(normal);
        direction = magnitude > 0.000000001 ? normal / magnitude : vec3(0.0, 0.0, 1.0);
        color = material;
      }
    `);
    attach(gl.FRAGMENT_SHADER, `
      precision mediump float;
      uniform float shading;
      varying vec3 direction;
      varying vec4 color;
      void main() {
        if (shading == 0.0) {
          gl_FragColor = color;
          return;
        }
        vec3 n = normalize(direction);
        if (shading == 1.0 && !gl_FrontFacing) n = -n;
        float key = max(0.0, dot(n, normalize(vec3(-.45, -.56, .7))));
        float fill = max(0.0, dot(n, normalize(vec3(.8, -.15, .35))));
        float rim = max(0.0, dot(n, normalize(vec3(.63, -.3, -.7))));
        float light = shading == 2.0
          ? .64 + .33 * key + .10 * fill + .11 * rim
          : .91 + .15 * key + .04 * fill;
        gl_FragColor = vec4(color.rgb * light, color.a);
      }
    `);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);

    const vertices = gl.createBuffer();
    const skinIndices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertices);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skinIndices);
    for (const [name, size, offset] of [['position', 3, 0], ['normal', 3, 3], ['material', 4, 6]]) {
      const location = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride * 4, offset * 4);
    }
    const framing = gl.getUniformLocation(program, 'framing');
    const shading = gl.getUniformLocation(program, 'shading');
    gl.uniform1f(gl.getUniformLocation(program, 'focal'), focal);
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    let cachedTopology, indices;
    const buffers = {};
    function buffer(name, length) {
      if (!buffers[name] || buffers[name].length < length) buffers[name] = new Float32Array(length);
      return buffers[name].subarray(0, length);
    }
    function drawArray(data, mode, lighting) {
      if (!data.length) return;
      gl.uniform1f(shading, lighting);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STREAM_DRAW);
      gl.drawArrays(mode, 0, data.length / stride);
    }
    function drawSkin(points, topology, skin) {
      if (!points?.length || !topology?.length) return;
      if (cachedTopology !== topology) {
        indices = new Uint16Array(topology.length / 4 * 6);
        for (let i = 0, j = 0; i < topology.length; i += 4, j += 6) {
          const a = topology[i], b = topology[i+1], c = topology[i+2], d = topology[i+3];
          indices.set([a,b,c,a,c,d], j);
        }
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        cachedTopology = topology;
      }

      const data = buffer('skin', points.length * stride);
      const color = rgba(skin);
      for (let i = 0; i < points.length; i++) writeVertex(data, i*stride, points[i], noNormal, color);
      for (let i = 0; i < indices.length; i+=3) {
        const a = indices[i], b = indices[i+1], c = indices[i+2];
        const [x,y,z] = normal(points[a],points[b],points[c]);
        for (let j = i; j < i+3; j++) {
          const base = indices[j]*stride+3;
          data[base] += x;
          data[base+1] += y;
          data[base+2] += z;
        }
      }
      gl.uniform1f(shading, 2);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STREAM_DRAW);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    }

    return (context, {faces, skinPoints, skinTopology, skinColor, width, height, cx, cy, scale, markings=[]}) => {
      if (gl.isContextLost() || !width || !height || !scale) return false;
      if (surface.width!==width) surface.width=width;
      if (surface.height!==height) surface.height=height;
      gl.viewport(0, 0, width, height);
      gl.depthMask(true);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform4f(framing, 2*scale/width, 2*scale/height, 2*cx/width-1, 1-2*cy/height);

      const toView = ([x,y,z], bias=0) => {
        const depth = z + bias;
        const pixel = (1-depth/focal)/scale;
        return [(x-cx)*pixel, (y-cy)*pixel, depth];
      };
      const opaque=[], translucent=[];
      const sampleByPoint=new Map();
      const colors=new Map();
      for (const face of faces) {
        if (face.skin && skinPoints?.length && skinTopology?.length) continue;
        if (face.points.length<3) continue;
        if (!colors.has(face.paint)) colors.set(face.paint, rgba(face.paint));
        const color=colors.get(face.paint);
        const entry={points:face.points, color, depth:face.depth, seam:face.seam};
        if (color[3]<1) {
          translucent.push(entry);
          continue;
        }
        const samples=face.points.map(point=>{
          if (!sampleByPoint.has(point)) sampleByPoint.set(point,{point:toView(point), normal:[0,0,0], sum:[0,0,0], count:0});
          return sampleByPoint.get(point);
        });
        // Shared positions retain the cloth's folds while interpolating swatch
        // lighting and fit-map color across adjacent faces.
        const rimNormal=normal(samples[0].point,samples[1].point,samples[2].point);
        for (const sample of samples) {
          for (let i=0;i<3;i++) {
            sample.normal[i]+=rimNormal[i];
            sample.sum[i]+=color[i];
          }
          sample.count++;
        }
        opaque.push({...entry,samples});
      }
      for (const sample of sampleByPoint.values()) {
        sample.color = [...sample.sum.map(value=>value/sample.count),1];
      }
      function triangles(entries, name, smooth=false) {
        const length=entries.reduce((total,entry)=>total+(entry.points.length-2)*3,0);
        const output=buffer(name,length*stride);
        let at=0;
        for (const entry of entries) {
          for (let i=1; i<entry.points.length-1; i++) {
            for (const index of [0,i,i+1]) {
              const sample=smooth?entry.samples[index]:null;
              const point=sample?sample.point:toView(entry.points[index]);
              let color=entry.color;
              if (sample) {
                // Preserve a strongly contrasting panel, while smoothing
                // small differences caused by adjacent angular samples.
                const contrast=sample.color.reduce((delta,value,k)=>Math.max(delta,Math.abs(value-color[k])),0);
                if (contrast<.20) color=sample.color;
              }
              writeVertex(output,at,point,sample?.normal||noNormal,color);
              at+=stride;
            }
          }
        }
        return output;
      }

      drawSkin(skinPoints, skinTopology, skinColor);
      drawArray(triangles(opaque,'cloth',true), gl.TRIANGLES, 1);

      const lines=[], circles=[];
      const seamColor=rgba('#28121f42');
      for (const face of opaque) {
        if (!face.seam) continue;
        const [a,b,c]=face.points;
        lines.push([b,Math.abs(a[1]-b[1])<.5?a:c,seamColor]);
      }
      for (const mark of markings) {
        const color=rgba(mark.style);
        if (mark.circle && Number.isFinite(mark.depth)) {
          const [x,y,radius]=mark.circle;
          for (let i=0;i<12;i++) {
            const a=i*Math.PI/6, b=(i+1)*Math.PI/6;
            circles.push({points:[[x,y,mark.depth],
              [x+radius*Math.cos(a),y+radius*Math.sin(a),mark.depth],
              [x+radius*Math.cos(b),y+radius*Math.sin(b),mark.depth]],color});
          }
        } else if (mark.points?.length>1) {
          for (let i=1;i<mark.points.length;i++) lines.push([mark.points[i-1],mark.points[i],color]);
          if (mark.closed) lines.push([mark.points.at(-1),mark.points[0],color]);
        }
      }
      if (circles.length) {
        for (const circle of circles) for (const point of circle.points) point[2]+=.0015;
        drawArray(triangles(circles,'buttons'), gl.TRIANGLES, 0);
      }
      gl.depthMask(false);
      const lineData=buffer('lines',lines.length*stride*2);
      for (let i=0;i<lines.length;i++) {
        const [a,b,color]=lines[i];
        writeVertex(lineData,i*stride*2,toView(a,.0015),noNormal,color);
        writeVertex(lineData,(i*2+1)*stride,toView(b,.0015),noNormal,color);
      }
      drawArray(lineData, gl.LINES, 0);
      translucent.sort((a,b)=>a.depth-b.depth);
      drawArray(triangles(translucent,'seat'), gl.TRIANGLES, 0);
      gl.depthMask(true);
      if (gl.isContextLost()) return false;
      context.drawImage(surface, 0, 0);
      return true;
    };
  }

  function normal(a,b,c) {
    const ux=b[0]-a[0], uy=b[1]-a[1], uz=b[2]-a[2];
    const vx=c[0]-a[0], vy=c[1]-a[1], vz=c[2]-a[2];
    return [uz*vy-uy*vz, ux*vz-uz*vx, uy*vx-ux*vy];
  }

  function writeVertex(data, i, point, normal, color) {
    data[i]=point[0]; data[i+1]=point[1]; data[i+2]=point[2];
    data[i+3]=normal[0]; data[i+4]=normal[1]; data[i+5]=normal[2];
    data[i+6]=color[0]; data[i+7]=color[1]; data[i+8]=color[2]; data[i+9]=color[3];
  }

  function rgba(paint) {
    if (Array.isArray(paint) && paint.length>=3) return [paint[0]/255,paint[1]/255,paint[2]/255,paint[3]??1];
    if (typeof paint==='string') {
      const rgb=paint.match(/^rgba?\(([^)]+)\)$/);
      if (rgb) return rgba(rgb[1].split(',').map(Number));
      if (/^#[a-f\d]{6}(?:[a-f\d]{2})?$/i.test(paint)) {
        const bytes=paint.slice(1).match(/../g).map(hex=>parseInt(hex,16));
        return [bytes[0]/255,bytes[1]/255,bytes[2]/255,(bytes[3]??255)/255];
      }
    }
    return [.84,.71,.62,1];
  }

  function paint(context, scene) {
    if (draw===undefined) {
      try { draw=createRenderer(); } catch { draw=null; }
    }
    if (!draw) return false;
    try { return draw(context,scene); } catch { return false; }
  }
  return {paint};
})();
