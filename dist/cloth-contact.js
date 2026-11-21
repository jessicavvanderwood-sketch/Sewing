'use strict';

const clothContact = (() => {
  const spacing=.026;
  const clearance=.023;
  const cachedEdges=new WeakMap();
  const cachedPoses=new WeakMap();
  const mix=(a,b,t)=>a+(b-a)*t;
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

  function bodyEdges(topology) {
    const cached=cachedEdges.get(topology);
    if (cached) return cached;
    const edges=[];
    const seen=new Set();
    for (let i=0;i<topology.length;i+=4) {
      for (let j=0;j<4;j++) {
        const a=topology[i+j],b=topology[i+(j+1)%4];
        const pair=Math.min(a,b)*65536+Math.max(a,b);
        if (!seen.has(pair)) {
          seen.add(pair);
          edges.push([a,b]);
        }
      }
    }
    cachedEdges.set(topology,edges);
    return edges;
  }

  function hullOf(points) {
    if (!points || points.length<3) return null;
    points.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
    const turn=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
    const half=()=>{
      const rows=[];
      for (const p of points) {
        while (rows.length>1 && turn(rows.at(-2),rows.at(-1),p)<=1e-8) rows.pop();
        rows.push(p);
      }
      return rows.slice(0,-1);
    };
    const lower=half();
    points.reverse();
    const boundary=lower.concat(half());
    if (boundary.length<3) return null;
    const center=[0,1].map(k=>boundary.reduce((sum,p)=>sum+p[k],0)/boundary.length);
    // Store each outward unit normal and support distance for fast ray tests.
    const planes=boundary.map((p,i)=>{
      const q=boundary[(i+1)%boundary.length];
      const nx=q[1]-p[1], nz=p[0]-q[0];
      const length=Math.hypot(nx,nz);
      return [nx/length,nz/length,(nx*(p[0]-center[0])+nz*(p[1]-center[1]))/length];
    });
    return {center,planes};
  }

  // Take horizontal sections of the actual posed mesh. Exclude moving arms
  // from the bodice volume so an outstretched hand cannot swell the chest.
  function fromAvatar(vertices,rest,topology) {
    const cached=cachedPoses.get(vertices);
    if (cached) return cached;
    const sections=new Map();
    for (const [a,b] of bodyEdges(topology)) {
      const p=vertices[a],q=vertices[b];
      const low=Math.min(p[1],q[1]),high=Math.max(p[1],q[1]);
      if (high-low<1e-6 || Math.min(rest[a][3],rest[b][3])>.70) continue;
      const start=Math.ceil(low/spacing),end=Math.floor(high/spacing);
      for (let k=start;k<=end;k++) {
        const t=(k*spacing-p[1])/(q[1]-p[1]);
        if (mix(rest[a][3],rest[b][3],t)>.70) continue;
        let points=sections.get(k);
        if (!points) sections.set(k,points=[]);
        points.push([mix(p[0],q[0],t),mix(p[2],q[2],t)]);
      }
    }
    for (const [k,points] of sections) sections.set(k,hullOf(points));
    function radius(hull,ox,oz,dx,dz) {
      let exit=Infinity;
      for (const [nx,nz,limit] of hull.planes) {
        const dot=nx*dx+nz*dz;
        if (dot<=1e-6) continue;
        exit=Math.min(exit,(limit+clearance-nx*(ox-hull.center[0])-nz*(oz-hull.center[1]))/dot);
      }
      return exit;
    }
    const projectOutside=(point,theta)=>{
      const [x,y,z]=point;
      const level=y/spacing;
      const lo=Math.floor(level), hi=lo+1;
      const a=sections.get(lo),b=sections.get(hi);
      if (!a && !b) return point;
      const t=level-lo;
      const c=a?.center||b.center,d=b?.center||a.center;
      const cx=mix(c[0],d[0],t),cz=mix(c[1],d[1],t);
      const distance=Math.hypot(x-cx,z-cz);
      const expectedX=Math.cos(theta),expectedZ=Math.sin(theta);
      // A seated knee can move the slice center past a front panel. Keep
      // the panel on its own side rather than ejecting it through the back.
      const aligned=(x-cx)*expectedX+(z-cz)*expectedZ>.72*distance;
      const dx=aligned?(x-cx)/distance:expectedX;
      const dz=aligned?(z-cz)/distance:expectedZ;
      const ra=a?radius(a,a.center[0],a.center[1],dx,dz):null;
      const rb=b?radius(b,b.center[0],b.center[1],dx,dz):null;
      const limit=ra===null?rb:rb===null?ra:mix(ra,rb,t);
      if (!Number.isFinite(limit) || aligned && distance>=limit) return point;
      return [cx+dx*limit,y,cz+dz*limit];
    };
    cachedPoses.set(vertices,projectOutside);
    return projectOutside;
  }

  // Deterministic position constraints keep the shoulder/waist attached and
  // let the hem move. Collision has priority over the fabric's target length.
  function drape(targets,rest,projectOutside,material,{free=.35}={}) {
    const count=targets.length;
    const columns=targets[0].length;
    const work=targets.map(row=>row.map(point=>point.slice()));
    const stretch=clamp(material?.length??.04,0,.30);
    const cross=clamp(material?.cross??.04,0,.30);
    const bend=clamp(material?.bend??.42,.08,.90);
    const mass=clamp((material?.gsm??165)/380,.2,1.6);
    const mobility=i=>.04+.96*clamp((i/(count-1)-free)/(1-free),0,1);
    function shorten(i,j,other,otherColumn,allowance) {
      const a=work[i][j],b=work[other][otherColumn];
      const p=rest[i][j],q=rest[other][otherColumn];
      const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2];
      const size=Math.hypot(dx,dy,dz);
      const max=Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2])*(1.025+allowance);
      if (size<=max || size<1e-6) return;
      const excess=(size-max)/size*.58;
      const w1=mobility(i),w2=mobility(other),total=w1+w2;
      for (const [axis,delta] of [dx,dy,dz].entries()) {
        a[axis]+=delta*excess*w1/total;
        b[axis]-=delta*excess*w2/total;
      }
    }
    for (let pass=0;pass<3;pass++) {
      for (let i=0;i<count;i++) {
        for (let j=0;j<columns;j++) {
          shorten(i,j,i,(j+1)%columns,cross);
          if (i+1<count) shorten(i,j,i+1,j,stretch);
          if (i>1 && i+1<count) {
            const point=work[i][j], above=work[i-1][j],below=work[i+1][j];
            const smoothing=mobility(i)*bend*.14/(1+mass);
            const target=targets[i][j];
            point[0]=mix(point[0],(above[0]+below[0])*.5,smoothing);
            point[2]=mix(point[2],(above[2]+below[2])*.5,smoothing);
            point[1]=mix(point[1],target[1],.16+.1*mass);
          }
        }
      }
      for (let i=0;i<count;i++) for (let j=0;j<columns;j++) work[i][j]=projectOutside(work[i][j],j*2*Math.PI/columns);
    }
    return work;
  }

  return {fromAvatar,drape};
})();
