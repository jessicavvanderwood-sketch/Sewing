'use strict';

const humanPreview = (() => {
  const unit = 2.368/168;
  const floor = 1.128;
  const mix = (a,b,t)=>a+(b-a)*t;
  const clamp = (value,min,max)=>Math.min(max,Math.max(min,value));
  const ease = value=>{const t=clamp(value,0,1);return t*t*(3-2*t);};
  const topology=humanMeshData.faces;
  // Plane locations on the two source meshes. These identify the anatomy
  // being moved, independently of the heights entered in the editor.
  const surfaceLevels = [
    {ankle:.055,calf:.206,knee:.279,midThigh:.354,thigh:.43,crotch:.461,hip:.487,highHip:.553,waist:.634,
      underbust:.703,bust:.736,upperChest:.754,neck:.862,chin:.881},
    {ankle:.066,calf:.219,knee:.265,midThigh:.356,thigh:.446,crotch:.488,hip:.507,highHip:.564,waist:.623,
      underbust:.699,bust:.738,upperChest:.754,neck:.867,chin:.884}
  ];
  const legSections=['ankle','calf','knee','midThigh','thigh'];
  const torsoSections=['hip','highHip','waist','underbust','bust','upperChest','neck'];
  const direction=(a,b)=>b.map((value,i)=>value-a[i]);
  const dot=(a,b)=>a.reduce((sum,v,i)=>sum+v*b[i],0);
  const normalize=v=>{const norm=Math.hypot(...v)||1;return v.map(value=>value/norm);};
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];

  // Piecewise cubic interpolation with a shared tangent at each landmark.
  // A sign change stops the tangent at a local extremum rather than overshooting.
  function smoothCurve(knots) {
    const slopes=knots.map(([at,value],i)=>{
      if (i===0 || i===knots.length-1) return 0;
      const [leftX,left]=knots[i-1], [rightX,right]=knots[i+1];
      const h0=at-leftX, h1=rightX-at;
      const d0=(value-left)/h0, d1=(right-value)/h1;
      if (d0*d1<=0) return 0;
      return 3*(h0+h1)/((2*h1+h0)/d0+(h1+2*h0)/d1);
    });
    return at=>{
      if (at<=knots[0][0]) return knots[0][1];
      if (at>=knots.at(-1)[0]) return knots.at(-1)[1];
      const i=knots.findIndex(([x])=>at<=x);
      const [a,left]=knots[i-1], [b,right]=knots[i];
      const span=b-a, t=(at-a)/span;
      return mix(left,right,ease(t))+span*t*(1-t)*((1-t)*slopes[i-1]-t*slopes[i]);
    };
  }

  // Connect slice crossings by shared mesh edges. The torso, hands and arms
  // can all cross the same plane, so select one connected contour at a time.
  function sliceContours(mesh,level) {
    const crossings=new Map();
    for (let i=0;i<topology.length;i+=4) {
      const hits=[];
      for (let j=0;j<4;j++) {
        const ai=topology[i+j], bi=topology[i+(j+1)%4];
        const a=mesh[ai], b=mesh[bi];
        if ((a[1]<level)===(b[1]<level)) continue;
        const key=Math.min(ai,bi)*mesh.length+Math.max(ai,bi);
        if (!crossings.has(key)) {
          const t=(level-a[1])/(b[1]-a[1]);
          crossings.set(key,{point:[mix(a[0],b[0],t),mix(a[2],b[2],t)],neighbors:[]});
        }
        hits.push(crossings.get(key));
      }
      for (let j=0;j+1<hits.length;j+=2) {
        hits[j].neighbors.push(hits[j+1]);
        hits[j+1].neighbors.push(hits[j]);
      }
    }
    const contours=[];
    for (const first of crossings.values()) {
      if (first.visited) continue;
      const pending=[first], points=[];
      first.visited=true;
      while (pending.length) {
        const point=pending.pop();
        points.push(point.point);
        for (const next of point.neighbors) {
          if (next.visited) continue;
          next.visited=true;
          pending.push(next);
        }
      }
      if (points.length>=3) contours.push(describeContour(points));
    }
    return contours;
  }

  function perimeter(edges,width=1,depth=1) {
    return edges.reduce((sum,[dx,dz])=>sum+Math.hypot(dx*width,dz*depth),0);
  }

  function describeContour(points) {
    const sorted=points.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
    const turn=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
    const half=()=>{
      const hull=[];
      for (const point of sorted) {
        while (hull.length>=2 && turn(hull.at(-2),hull.at(-1),point)<=0) hull.pop();
        hull.push(point);
      }
      return hull.slice(0,-1);
    };
    const lower=half();
    const xMin=sorted[0][0], xMax=sorted.at(-1)[0];
    const zs=points.map(([,z])=>z);
    const zMin=Math.min(...zs), zMax=Math.max(...zs);
    sorted.reverse();
    const hull=lower.concat(half());
    const edges=hull.map(([x,z],i)=>[x-hull.at(i-1)[0],z-hull.at(i-1)[1]]);
    return {edges,girth:perimeter(edges),xMin,xMax,x:(xMin+xMax)/2,z:(zMin+zMax)/2,depth:zMax-zMin};
  }

  const profiles=humanMeshData.profiles.map((coordinates,index)=>{
    const points=Array.from({length:coordinates.length/3},(_,i)=>coordinates.slice(i*3,i*3+3));
    const bottom=Math.min(...points.map(p=>p[1]));
    const height=Math.max(...points.map(p=>p[1]))-bottom;
    const mesh=points.map(([x,y,z])=>[x,(y-bottom)/height,z]);
    const arm=humanMeshData.arms[index];
    const levels={...surfaceLevels[index],shoulder:(arm[0][1]-bottom)/height};
    const sections=Object.fromEntries([...legSections,...torsoSections].map(key=>{
      const contours=sliceContours(mesh,levels[key]);
      const central=legSections.includes(key) ? contours.filter(row=>row.xMin>=0)
        : contours.filter(row=>row.xMin<0 && row.xMax>0);
      return [key,central.sort((a,b)=>b.girth-a.girth)[0]];
    }));
    const [shoulder,elbow,wrist]=arm;
    const armTape=(a,b,fraction)=>{
      const origin=a.map((value,i)=>mix(value,b[i],fraction));
      const axis=normalize(direction(a,b));
      const tangent=normalize(cross(axis,[0,0,1]));
      const perpendicular=cross(axis,tangent);
      const local=points.map(point=>{
        const d=direction(origin,point);
        return [dot(d,tangent),dot(d,axis),dot(d,perpendicular)];
      });
      const closest=sliceContours(local,0).sort((a,b)=>Math.hypot(a.x,a.z)-Math.hypot(b.x,b.z))[0];
      return closest?.girth;
    };
    const armGirth={upperArm:armTape(shoulder,elbow,.53),forearm:armTape(elbow,wrist,.28),wrist:armTape(elbow,wrist,.96)};
    const foot=mesh.filter(([,y])=>y<.032).map(([, ,z])=>z);
    const heel=Math.min(...foot);
    return {mesh,height,bottom,arm,levels,sections,armGirth,heel,footLength:Math.max(...foot)-heel};
  });

  function statureCurve(profile,body,props) {
    const at=profile.levels;
    const ankle=props.height*at.ankle;
    const knee=clamp(props.knee,ankle+7,props.crotch-9);
    const knots=[[0,0],[at.ankle,ankle],[at.knee,knee],[at.crotch,props.crotch],
      [at.waist,props.waist],[at.shoulder,props.shoulder],[at.chin,props.chin],[1,props.height]];
    const lowHip=props.crotch+2;
    const fullHip=body.waistToHip?clamp(props.waist-body.waistToHip,lowHip,props.waist-5):null;
    if (fullHip!=null) knots.push([at.hip,fullHip]);
    if (body.waistToHighHip) {
      const minimum=(fullHip ?? lowHip)+2;
      knots.push([at.highHip,clamp(props.waist-body.waistToHighHip,minimum,props.waist-2)]);
    }
    if (body.calfHeight) knots.push([at.calf,clamp(body.calfHeight,ankle+2,knee-2)]);
    const ordered=()=>knots.sort((a,b)=>a[0]-b[0]);
    const estimated=smoothCurve(ordered());
    const bust=body.bustHeight?clamp(body.bustHeight,props.waist+6,props.shoulder-5):estimated(at.bust);
    if (body.bustHeight) knots.push([at.bust,bust]);
    if (body.underbustHeight) {
      // Keep the inferred bust level stable when only the rib-cage height is known.
      if (!body.bustHeight) knots.push([at.bust,bust]);
      knots.push([at.underbust,clamp(body.underbustHeight,props.waist+2,bust-2)]);
    }
    return smoothCurve(ordered());
  }

  function sectionScales(contour,targetCm,depthCm,aspect,cm) {
    const target=(targetCm || contour.girth*cm)/cm;
    if (!depthCm) {
      const ratio=target/perimeter(contour.edges,aspect,1/aspect);
      return [ratio*aspect,ratio/aspect];
    }
    const depth=Math.min(depthCm/cm,target*.48)/contour.depth;
    let left=0, right=target/Math.max(.1,contour.xMax-contour.xMin);
    for (let i=0;i<20;i++) {
      const mid=(left+right)/2;
      if (perimeter(contour.edges,mid,depth)<target) left=mid;
      else right=mid;
    }
    return [(left+right)/2,depth];
  }

  function armShape(profile,body,cm,shoulderRatio) {
    const [shoulder,elbow,wrist]=profile.arm;
    const upper=direction(shoulder,elbow), lower=direction(elbow,wrist);
    const upperLength=Math.hypot(...upper), lowerLength=Math.hypot(...lower);
    const up=normalize(upper), low=normalize(lower);
    const naturalTotal=(upperLength+lowerLength)*cm;
    const total=body.arm || (body.shoulderToElbow?body.shoulderToElbow+lowerLength*cm:naturalTotal);
    const upperCm=body.shoulderToElbow || total*upperLength/(upperLength+lowerLength);
    const upperScale=clamp(upperCm/(upperLength*cm),.64,1.55);
    const lowerScale=clamp((total-upperCm)/(lowerLength*cm),.64,1.55);
    const tape=Object.entries({upperArm:.53*upperLength,forearm:upperLength+.28*lowerLength,wrist:upperLength+.96*lowerLength})
      .filter(([key])=>body[key] && profile.armGirth[key])
      .map(([key,at])=>[at,clamp(body[key]/(profile.armGirth[key]*cm),.57,1.9)]);
    const trim=smoothCurve([[0,1],...tape,[upperLength+lowerLength+.42,1]]);
    const angle=.32, sin=Math.sin(angle), cos=Math.cos(angle);
    return (x,y,z)=>{
      const rawY=y*profile.height+profile.bottom;
      const relative=[x-shoulder[0],rawY-shoulder[1],z-shoulder[2]];
      const start=dot(relative,up);
      const end=dot(direction(elbow,[x,rawY,z]),low);
      const bend=ease((start-upperLength+.45)/.9);
      const progress=mix(start,upperLength+end,bend);
      const size=trim(progress);
      const lowerPosition=Math.min(lowerLength,end);
      const [dx,dy,dz]=relative.map((value,i)=>{
        const before=up[i]*start;
        const after=upper[i]+low[i]*lowerPosition;
        const from=mix(before,after,bend);
        const to=mix(before*upperScale,upper[i]*upperScale+low[i]*lowerPosition*lowerScale,bend);
        return to+(value-from)*size;
      });
      const cutoff=Math.min(shoulder[0]-.52,1.34)+Math.max(0,shoulder[1]-rawY)*.48;
      const weight=ease((x-cutoff)/.84)*ease((y-.46)/.08)*ease((shoulder[1]+.94-rawY)/.67);
      return {weight,x:shoulder[0]*shoulderRatio+dx*cos+dy*sin,y:dx*-sin+dy*cos,z:shoulder[2]+dz-.55*ease(end/lowerLength)};
    };
  }

  function fit(body) {
    const female=sewingModels.profileOf(body)==='female';
    const profile=profiles[female?0:1];
    const props=sewingModels.proportions(body);
    const geometry=sewingModels.bustGeometry(body,props);
    const at=profile.levels;
    const cm=props.height/profile.height;
    const heightAt=statureCurve(profile,body,props);
    const outline=body.scan?modelCamera.rings([
      [-.90,1,1],[-.79,1,1],[-.75,1,1],[-.63,1,1],[-.45,1,1],[-.25,1,1],[-.04,1,1],[.16,1,1],[.30,1,1]
    ],body.scan):null;
    const sectionDepth={waist:body.waistDepth,hip:body.hipDepth};
    const scales=[...legSections,...torsoSections].flatMap(key=>{
      const contour=profile.sections[key];
      if (!contour || (!body[key] && !sectionDepth[key] && (!outline || legSections.includes(key)))) return [];
      const [w,d]=outline ? fabricFit.envelope(outline,props.baseAt(heightAt(at[key]))) : [1,1];
      const aspect=w && d ? Math.sqrt(w/d) : 1;
      return [[at[key],...sectionScales(contour,body[key],sectionDepth[key],aspect,cm)]];
    });
    const scaleAt=axis=>smoothCurve([[.026,1],...scales.map(row=>[row[0],row[axis]]),[.925,1]]);
    const widthAt=scaleAt(1), depthAt=scaleAt(2);
    const pivotZ=smoothCurve([...legSections,...torsoSections].filter(key=>profile.sections[key])
      .map(key=>[at[key],profile.sections[key].z]));
    const legPivot=smoothCurve([...legSections.map(key=>[at[key],profile.sections[key]?.x || 0]),
      [at.crotch,profile.sections.thigh?.x || 0],[at.hip,0]]);
    const footScale=body.footLength?clamp(body.footLength/(cm*profile.footLength),.7,1.35):1;
    const shoulderWidth=(2*profile.arm[0][0]+.62)*cm;
    const shoulderRatio=body.shoulder?clamp(body.shoulder/shoulderWidth,.73,1.35):1;
    const shapeArm=armShape(profile,body,cm,shoulderRatio);
    const shoulderY=floor-props.shoulder*unit;
    const vertices=profile.mesh.map(([x,y,z])=>{
      const sign=Math.sign(x);
      const arm=shapeArm(Math.abs(x),y,z);
      const shoulder=ease((y-at.upperChest)/(at.shoulder-at.upperChest))*ease((at.neck-y)/(at.neck-at.shoulder));
      const vertical=floor-heightAt(y)*unit;
      const center=legPivot(y)*sign*ease(Math.abs(x)/.35);
      const zCenter=pivotZ(y);
      const sizedX=center+(x-center)*widthAt(y)+(shoulderRatio-1)*x*shoulder;
      const stance=sign*.43*ease((at.crotch-y)/(at.crotch-at.calf));
      const foot=(z-profile.heel)*(footScale-1)*ease((at.ankle-y)/(at.ankle-.012));
      const influence=female?Math.exp(-(((y-at.bust)/.037)**2))*ease((z-.48)/.85)*ease((1.58-Math.abs(x))/.6):0;
      const projected=female?(geometry.depth-4.5)/cm*influence*.2:0;
      const spacing=body.bustSpacing && female?(body.bustSpacing/2-9.5)*unit*influence*sign*ease(Math.abs(x)/.43):0;
      return [
        (mix(sizedX,sign*arm.x,arm.weight)-stance)*cm*unit+spacing,
        mix(vertical,shoulderY-arm.y*cm*unit,arm.weight),
        (mix(zCenter+(z-zCenter)*depthAt(y)+foot,arm.z,arm.weight)+projected-.34)*cm*unit,
        arm.weight
      ];
    });
    const joints=profile.arm.map(([x,y,z])=>{
      const joint=shapeArm(x,(y-profile.bottom)/profile.height,z);
      return [joint.x*cm*unit,shoulderY-joint.y*cm*unit,(joint.z-.34)*cm*unit];
    });
    return {vertices,joints};
  }

  const fittingCache=new WeakMap();
  function fittingSurface(body,proportions) {
    const saved=fittingCache.get(body);
    if (saved) return saved;
    const fitted=fit(body);
    const toRig=([x,y,z,arm])=>[x,clamp(proportions.baseAt((floor-y)/unit),-1.24,1.128),z,arm];
    const vertices=fitted.vertices.map(toRig);
    const joints=fitted.joints.map(toRig);
    const buckets={torso:new Map(),arm:new Map(),leg:new Map(),bothLegs:new Map()};
    const add=(part,x,y,z)=>{
      const bin=Math.round(y/.045);
      if (!buckets[part].has(bin)) buckets[part].set(bin,[]);
      buckets[part].get(bin).push([x,z]);
    };
    for (const [x,y,z,arm] of vertices) {
      if (arm>.62 && x>0) add('arm',x,y,z);
      if (y>=.23) {
        if (x>0) add('leg',x,y,z);
        add('bothLegs',x,y,z);
      }
      if (arm<.46 && y>=-.91 && y<=.31) add('torso',x,y,z);
    }
    const rings=Object.fromEntries(Object.entries(buckets).map(([part,bins])=>{
      const rows=[...bins].sort((a,b)=>a[0]-b[0]).filter(([,points])=>points.length>=6).map(([level,points])=>{
        const {x,z,xMin,xMax,depth}=describeContour(points);
        const width=Math.max(.012,(xMax-xMin)/2);
        const radius=Math.max(.014,depth/2);
        const margin=clamp(Math.max(...points.map(([px,pz])=>Math.hypot((px-x)/width,(pz-z)/radius))),1,1.28);
        return [level*.045,width*margin,radius*margin,x,z];
      });
      return [part,rows];
    }));
    function sectionAt(part,y) {
      const rows=rings[part];
      if (!rows.length || y<rows[0][0]-.035 || y>rows.at(-1)[0]+.035) return null;
      if (y<=rows[0][0]) return rows[0].slice(1);
      if (y>=rows.at(-1)[0]) return rows.at(-1).slice(1);
      const i=rows.findIndex(row=>row[0]>=y);
      const a=rows[i-1],b=rows[i];
      const t=(y-a[0])/(b[0]-a[0]);
      return a.slice(1).map((value,k)=>mix(value,b[k+1],t));
    }
    const result={vertices,joints,sectionAt};
    fittingCache.set(body,result);
    return result;
  }

  function skinFaces(points,screen,skin,covered) {
    const faces=[];
    for (let i=0;i<topology.length;i+=4) {
      const indices=topology.slice(i,i+4);
      if (covered && indices.every(index=>covered[index])) continue;
      const [a,b,c,d]=indices.map(index=>points[index]);
      const normal=cross(direction(a,c),direction(b,d));
      if (normal[2]>=0) continue;
      const norm=Math.hypot(...normal)||1;
      const primary=Math.max(0,(-.45*normal[0]+.56*normal[1]-.70*normal[2])/norm);
      const fill=Math.max(0,(.80*normal[0]+.15*normal[1]-.35*normal[2])/norm);
      const light=.66+.31*primary+.09*fill;
      const tone=skin.map(value=>Math.min(255,Math.round(value*light)));
      faces.push({points:indices.map(index=>screen[index]),depth:(a[2]+b[2]+c[2]+d[2])/4,paint:'rgb('+tone.join(',')+')',skin:true});
    }
    return faces;
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
    const points=fit(body).vertices.map(([x,y,z])=>[x*cos-z*sin,y,x*sin+z*cos]);
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
    const faces=skinFaces(points,screen,skin);
    context.lineWidth=.65;
    for (const face of faces.sort((a,b)=>a.depth-b.depth)) {
      context.beginPath();
      face.points.forEach((point,i)=>i?context.lineTo(...point):context.moveTo(...point));
      context.closePath();
      context.fillStyle=context.strokeStyle=face.paint;
      context.fill();
      context.stroke();
    }
  }
  return {draw,fittingSurface,skinFaces};
})();
