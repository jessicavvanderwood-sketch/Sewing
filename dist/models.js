'use strict';

const sewingModels = (() => {
  const defaults = [
    {id:'studio-form',name:'Studio dress form',bust:92,waist:74,hip:98,shoulder:39},
    {id:'straight-form',name:'Straight dress form',bust:98,waist:89,hip:101,shoulder:43},
    {id:'full-hip-form',name:'Full-hip dress form',bust:104,waist:86,hip:117,shoulder:40}
  ];
  const dimensions = {
    bust:['Chest / bust',65,160],
    waist:['Waist',55,145],
    hip:['Hip / seat',65,175],
    shoulder:['Shoulder span',28,58]
  };

  function parseObj(content) {
    const vertices = [];
    const triangles = [];
    for (const line of content.split(/\r?\n/)) {
      const [kind,...parts] = line.trim().split(/\s+/);
      if (kind==='v') {
        const vertex = parts.slice(0,3).map(Number);
        if (vertex.length!==3 || vertex.some(n=>!Number.isFinite(n) || Math.abs(n)>1e7)) throw Error('The OBJ contains an invalid vertex.');
        vertices.push(vertex);
        if (vertices.length>4000) throw Error('Use an OBJ with at most 4,000 vertices.');
      } else if (kind==='f') {
        const indexes = parts.filter(part=>!part.startsWith('#')).map(part=>{
          const index = Number(part.split('/')[0]);
          return index<0?vertices.length+index:index-1;
        });
        if (indexes.length<3 || indexes.some(index=>!Number.isInteger(index)||index<0||index>=vertices.length)) throw Error('Export the OBJ with valid polygon faces.');
        for (let i=1;i<indexes.length-1;i++) {
          triangles.push([indexes[0],indexes[i],indexes[i+1]]);
          if (triangles.length>7500) throw Error('Use an OBJ with at most 7,500 triangles.');
        }
      }
    }
    if (!triangles.length) throw Error('The OBJ needs a mesh with faces.');
    const bounds = [0,1,2].map(axis=>vertices.reduce(([min,max],p)=>[Math.min(min,p[axis]),Math.max(max,p[axis])],[Infinity,-Infinity]));
    const height = bounds[1][1]-bounds[1][0];
    if (height<1e-6) throw Error('Export a standing torso with its head end up along the Y axis.');
    const scale = 1.19/height;
    const normalized = vertices.map(([x,y,z])=>[
      (x-(bounds[0][0]+bounds[0][1])/2)*scale,
      -.9+(bounds[1][1]-y)*scale,
      (z-(bounds[2][0]+bounds[2][1])/2)*scale
    ].map(n=>Number(n.toFixed(4))));
    if (normalized.some(([x,,z])=>Math.abs(x)>.9||Math.abs(z)>.9)) throw Error('Use an upright torso without a wide base or outstretched arms.');
    return {vertices:normalized,triangles};
  }
  return {defaults,dimensions,parseObj};
})();
