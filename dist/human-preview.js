'use strict';

const humanPreview = (() => {
  const unit = 2.368/168;
  const mix = (a,b,t)=>a+(b-a)*t;
  const ease = t=>{t=Math.min(1,Math.max(0,t));return t*t*(3-2*t);};
  const sections = [
    ['ankle',.05,1.015],['calf',.145,.76],['knee',.27,.655],
    ['thigh',.39,.32],['hip',.484,.16],['highHip',.53,-.04],
    ['waist',.581,-.25],['underbust',.655,-.36],['bust',.706,-.49],
    ['neck',.841,-.9]
  ];
  const topology=humanMeshData.faces;
  const profiles=humanMeshData.profiles.map((coordinates,index)=>{
    const points=Array.from({length:coordinates.length/3},(_,i)=>coordinates.slice(i*3,i*3+3));
    const bottom=Math.min(...points.map(p=>p[1]));
    const height=Math.max(...points.map(p=>p[1]))-bottom;
    const mesh=points.map(([x,y,z])=>[x,(y-bottom)/height,z]);
    const arm=humanMeshData.arms[index];
    return {mesh,height,bottom,arm,sections:sections.map(([key,y])=>section(mesh,key,y))};
  });

  function section(mesh,key,y) {
    const leg=y<.43;
    const points=[];
    for (let i=0;i<topology.length;i+=4) {
      for (let j=0;j<4;j++) {
        const a=mesh[topology[i+j]],b=mesh[topology[i+(j+1)%4]];
        if ((a[1]<y)===(b[1]<y)) continue;
        const t=(y-a[1])/(b[1]-a[1]);
        const x=mix(a[0],b[0],t);
        if (leg?x<=0:Math.abs(x)>(key==='neck'?1.1:2.2)) continue;
        points.push([x,mix(a[2],b[2],t)]);
      }
    }
    points.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
    const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
    const half=()=>{
      const hull=[];
      for (const p of points) {
        while (hull.length>=2 && cross(hull.at(-2),hull.at(-1),p)<=0) hull.pop();
        hull.push(p);
      }
      return hull.slice(0,-1);
    };
    const lower=half();
    points.reverse();
    const hull=lower.concat(half());
    const girth=hull.reduce((length,p,i)=>length+Math.hypot(p[0]-hull.at(i-1)[0],p[1]-hull.at(i-1)[1]),0);
    const center=leg && points.length?(points[0][0]+points.at(-1)[0])/2:0;
    return {girth,center};
  }

  function armShape(profile,body,cm,shoulderRatio) {
    const [shoulder,elbow,wrist]=profile.arm;
    const direction=(a,b)=>b.map((value,i)=>value-a[i]);
    const upper=direction(shoulder,elbow), lower=direction(elbow,wrist);
    const upperLength=Math.hypot(...upper), lowerLength=Math.hypot(...lower);
    const lengthRatio=body.arm?Math.max(.75,Math.min(1.3,body.arm/(cm*(upperLength+lowerLength)))):1;
    const up=upper.map(value=>value/upperLength), low=lower.map(value=>value/lowerLength);
    const dot=(a,b)=>a.reduce((sum,v,i)=>sum+v*b[i],0);
    const upperGirth=body.upperArm? Math.max(.72,Math.min(1.4,body.upperArm/(cm*1.8))) : 1;
    const wristGirth=body.wrist? Math.max(.72,Math.min(1.4,body.wrist/(cm*1.05))) : 1;
    const angle=.32, sin=Math.sin(angle), cos=Math.cos(angle);
    return (x,y,z)=>{
      const rawY=y*profile.height+profile.bottom;
      const relative=[x-shoulder[0],rawY-shoulder[1],z-shoulder[2]];
      const atElbow=direction(elbow,[x,rawY,z]);
      const start=dot(relative,up);
      const end=dot(atElbow,low);
      const forearm=ease((start-upperLength+.45)/.9);
      const along=relative.map((_,i)=>mix(up[i]*start,upper[i]+low[i]*Math.min(lowerLength,end),forearm));
      const trim=mix(upperGirth,wristGirth,ease((start-upperLength*.55)/(upperLength*.45+lowerLength)));
      const size=1+(trim-1)*ease(start/.8)*(1-ease((end-lowerLength+.1)/.45));
      const [dx,dy,dz]=relative.map((value,i)=>along[i]*lengthRatio+(value-along[i])*size);
      const cutoff=Math.min(shoulder[0]-.52,1.34)+Math.max(0,shoulder[1]-rawY)*.48;
      const weight=ease((x-cutoff)/.84)*ease((y-.46)/.08)*ease((shoulder[1]+.94-rawY)/.67);
      return {
        weight,
        x:shoulder[0]*shoulderRatio+dx*cos+dy*sin,
        y:dx*-sin+dy*cos,
        z:shoulder[2]+dz-.55*ease(end/lowerLength)
      };
    };
  }

  function fit(body) {
    const female=sewingModels.profileOf(body)==='female';
    const profile=profiles[female?0:1];
    const props=sewingModels.proportions(body);
    const geometry=sewingModels.bustGeometry(body,props);
    const cm=props.height/profile.height;
    const anchors=[[0,1,0],...sections.map(([key,y],i)=>{
      const {girth,center}=profile.sections[i];
      const ratio=body[key] && girth>0 ? Math.max(.65,Math.min(1.65,body[key]/(girth*cm))) : 1;
      return [y,ratio,center];
    }),[.89,1,0],[1,1,0]];
    // Monotone interpolation blends the measured cross sections without
    // introducing bulges between adjacent measurement levels.
    const slopes=anchors.map(([y,value],i)=>{
      if (i===0 || i===anchors.length-1) return 0;
      const [leftY,left]=anchors[i-1], [rightY,right]=anchors[i+1];
      const a=(value-left)/(y-leftY), b=(right-value)/(rightY-y);
      return a*b>0?2*a*b/(a+b):0;
    });
    const shoulderRatio=body.shoulder?Math.max(.73,Math.min(1.35,body.shoulder/(3.85*cm))):1;
    const bustMove=props.yAt(geometry.y)-props.yAt(-.49);
    const outline=body.scan?modelCamera.rings([
      [-.90,1,1],[-.79,1,1],[-.75,1,1],[-.63,1,1],[-.45,1,1],[-.25,1,1],[-.04,1,1],[.16,1,1],[.30,1,1]
    ],body.scan):null;
    const shapeArm=armShape(profile,body,cm,shoulderRatio);
    const shoulderY=props.yAt(-.73);
    const lengths=[[0,1.128],[.045,props.yAt(1.045)],[.27,props.yAt(.655)],
      [.435,props.yAt(.30)],[.581,props.yAt(-.25)],[.793,props.yAt(-.73)],
      [.875,props.yAt(-.986)],[1,props.yAt(-1.24)]];
    return profile.mesh.map(([x,y,z])=>{
      const sign=Math.sign(x);
      const index=Math.max(1,anchors.findIndex(([at])=>at>=y));
      const [a,b]=anchors.slice(index-1,index+1);
      const span=b[0]-a[0];
      const f=(y-a[0])/span;
      const t=ease(f);
      const ratio=mix(a[1],b[1],t)+span*f*(1-f)*((1-f)*slopes[index-1]-f*slopes[index]);
      const center=sign*mix(a[2],b[2],t);
      const arm=shapeArm(Math.abs(x),y,z);
      const shoulder=ease((y-.69)/.10)*ease((.87-y)/.064);
      const j=Math.max(1,lengths.findIndex(([at])=>at>=y));
      const [[ay,ah],[by,bh]]=lengths.slice(j-1,j+1);
      let vertical=mix(ah,bh,(y-ay)/(by-ay));
      const [scanWidth,scanDepth]=outline ? fabricFit.envelope(outline,props.baseAt((1.128-vertical)/unit)) : [1,1];
      const aspect=scanWidth && scanDepth ? Math.sqrt(scanWidth/scanDepth) : 1;
      const bustInfluence=female?Math.exp(-(((y-.706)/.055)**2))*ease((z-.47)/.88)*ease((1.92-Math.abs(x))/.45):0;
      vertical+=bustMove*bustInfluence;
      const sizedX=center+(x-center)*ratio*aspect+(shoulderRatio-1)*x*shoulder;
      const stance=sign*.49*ease((.425-y)/.29);
      const projected=female?(geometry.depth-4.5)/cm*bustInfluence*.25:0;
      const spacing=body.bustSpacing && female?(body.bustSpacing/2-9.5)*unit*bustInfluence*sign:0;
      return [
        (mix(sizedX,sign*arm.x,arm.weight)-stance)*cm*unit+spacing,
        mix(vertical,shoulderY-arm.y*cm*unit,arm.weight),
        (mix(z*ratio/aspect,arm.z,arm.weight)+projected-.34)*cm*unit
      ];
    });
  }

  let studio;
  function studioRenderer() {
    const surface=document.createElement('canvas');
    let gl;
    // Browsers without GPU acceleration continue to use the canvas renderer.
    if (typeof WebGLRenderingContext==='undefined') return null;
    try { gl=surface.getContext('webgl',{alpha:true,antialias:true}); } catch {return null;}
    if (!gl) return null;
    const shader=(kind,source)=>{
      const result=gl.createShader(kind);
      gl.shaderSource(result,source);
      gl.compileShader(result);
      if (!gl.getShaderParameter(result,gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(result));
      return result;
    };
    const program=gl.createProgram();
    gl.attachShader(program,shader(gl.VERTEX_SHADER,`
      attribute vec3 point;
      attribute vec3 normal;
      uniform vec2 framing;
      varying vec3 direction;
      void main() {
        direction=normal;
        float w=1.0-point.z*.25;
        gl_Position=vec4(point.x*framing.x,-point.y*framing.y-.03*w,-point.z*.25,w);
      }
    `));
    gl.attachShader(program,shader(gl.FRAGMENT_SHADER,`
      precision mediump float;
      varying vec3 direction;
      uniform vec3 skin;
      void main() {
        vec3 n=normalize(direction);
        float key=max(0.0,dot(n,normalize(vec3(-.45,-.56,.7))));
        float fill=max(0.0,dot(n,normalize(vec3(.8,-.15,.35))));
        float rim=max(0.0,dot(n,normalize(vec3(.63,-.3,-.7))));
        gl_FragColor=vec4(skin*(.64+.33*key+.10*fill+.11*rim),1.0);
      }
    `));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program,gl.LINK_STATUS)) return null;
    gl.useProgram(program);
    const triangles=new Uint16Array(topology.length/4*6);
    for (let i=0,j=0;i<topology.length;i+=4,j+=6) {
      const [a,b,c,d]=topology.slice(i,i+4);
      triangles.set([a,b,c,a,c,d],j);
    }
    const elements=gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,elements);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,triangles,gl.STATIC_DRAW);
    const buffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    for (const [name,offset] of [['point',0],['normal',12]]) {
      const location=gl.getAttribLocation(program,name);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location,3,gl.FLOAT,false,24,offset);
    }
    const framing=gl.getUniformLocation(program,'framing');
    const tint=gl.getUniformLocation(program,'skin');
    gl.enable(gl.DEPTH_TEST);
    return (context,points,skin,width,height,scale)=>{
      if (gl.isContextLost()) return false;
      if (surface.width!==width) surface.width=width;
      if (surface.height!==height) surface.height=height;
      const vertices=new Float32Array(points.length*6);
      points.forEach((point,i)=>vertices.set(point,i*6));
      for (let i=0;i<triangles.length;i+=3) {
        const a=points[triangles[i]],b=points[triangles[i+1]],c=points[triangles[i+2]];
        const u=b.map((value,j)=>value-a[j]),v=c.map((value,j)=>value-a[j]);
        const normal=[u[2]*v[1]-u[1]*v[2],u[0]*v[2]-u[2]*v[0],u[1]*v[0]-u[0]*v[1]];
        for (let j=0;j<3;j++) {
          const base=triangles[i+j]*6+3;
          for (let axis=0;axis<3;axis++) vertices[base+axis]+=normal[axis];
        }
      }
      gl.viewport(0,0,width,height);
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.DYNAMIC_DRAW);
      gl.uniform2f(framing,2*scale/width,2*scale/height);
      gl.uniform3f(tint,...skin.map(value=>value/255));
      gl.drawElements(gl.TRIANGLES,triangles.length,gl.UNSIGNED_SHORT,0);
      context.drawImage(surface,0,0);
      return true;
    };
  }

  function draw(canvas,body,angle) {
    const context=canvas.getContext('2d');
    const {width,height}=canvas;
    const scale=Math.min(height*.35/Math.max(1,(body.height||168)/170),width*.8);
    const sin=Math.sin(angle),cos=Math.cos(angle);
    const points=fit(body).map(([x,y,z])=>[x*cos-z*sin,y,x*sin+z*cos]);
    const skin=(body.skin||'#d7b69d').match(/[a-f\d]{2}/gi).map(value=>parseInt(value,16));
    context.clearRect(0,0,width,height);
    context.beginPath();
    context.ellipse(width/2,height*.515+1.128*scale,scale*.34,scale*.043,0,0,2*Math.PI);
    context.fillStyle='#3a1e271f';
    context.fill();
    if (studio===undefined) {
      try { studio=studioRenderer(); } catch { studio=null; }
    }
    if (studio?.(context,points,skin,width,height,scale)) return;
    const screen=points.map(([x,y,z])=>{
      const p=4/(4-z);
      return [width/2+x*scale*p,height*.515+y*scale*p];
    });
    const faces=[];
    for (let i=0;i<topology.length;i+=4) {
      const indices=topology.slice(i,i+4);
      const [a,b,c,d]=indices.map(index=>points[index]);
      const u=c.map((value,axis)=>value-a[axis]);
      const v=d.map((value,axis)=>value-b[axis]);
      const normal=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
      if (normal[2]>=0) continue;
      const norm=Math.hypot(...normal)||1;
      const light=.73+.31*Math.max(0,(.34*normal[0]+.42*normal[1]-.84*normal[2])/norm);
      const tone=skin.map(value=>Math.min(255,Math.round(value*light)));
      faces.push({indices,depth:(a[2]+b[2]+c[2]+d[2])/4,paint:'rgb('+tone.join(',')+')'});
    }
    context.lineWidth=.65;
    for (const face of faces.sort((a,b)=>a.depth-b.depth)) {
      context.beginPath();
      face.indices.forEach((index,i)=>i?context.lineTo(...screen[index]):context.moveTo(...screen[index]));
      context.closePath();
      context.fillStyle=context.strokeStyle=face.paint;
      context.fill();
      context.stroke();
    }
  }
  return {draw};
})();
