'use strict';

const fitHandles = (() => {
  // x anchors sit on the garment's right edge. y anchors sit on the front
  // surface and follow the corresponding vertical sewing measurement.
  const specs = {
    waist:{label:'Waist width',axis:'x',y:-.26},
    hip:{label:'Hip width',axis:'x',y:.13},
    bust:{label:'Bust width',axis:'x',y:-.48},
    shoulder:{label:'Shoulder width',axis:'x',y:-.73},
    shoulderSlope:{label:'Shoulder slope',axis:'y',y:-.72,x:.88},
    armhole:{label:'Armhole depth',axis:'y',y:-.63,x:.86},
    neckDepth:{label:'Front neckline depth',axis:'y',y:-.74,x:0,neck:true},
    neckWidth:{label:'Neckline width',axis:'x',y:-.74,x:.56,neck:true},
    backNeck:{label:'Back neckline depth',axis:'y',y:-.74,x:0,neck:true,back:true},
    waistHeight:{label:'Waistline height',axis:'y',y:-.25,x:0,direction:-1},
    length:{label:'Garment length',axis:'y',end:true,x:0},
    sweep:{label:'Hem width',axis:'x',end:true},
    sleeveWidth:{label:'Upper sleeve width',axis:'x',part:'sleeve',y:-.59},
    sleeveCap:{label:'Sleeve cap fullness',axis:'x',part:'sleeve',y:-.68},
    sleeveLength:{label:'Sleeve length',axis:'y',part:'sleeve',end:true,x:0},
    cuff:{label:'Cuff width',axis:'x',part:'sleeve',end:true},
    thigh:{label:'Thigh width',axis:'x',part:'leg',y:.36},
    knee:{label:'Knee width',axis:'x',part:'leg',y:.61},
    leg:{label:'Leg opening',axis:'x',part:'leg',end:true},
    rise:{label:'Rise length',axis:'y',y:-.21,x:0,direction:-1}
  };

  const groups = {
    body:{label:'Body width',keys:['bust','waist','hip','shoulder']},
    neckline:{label:'Front neckline',keys:['neckDepth','neckWidth']},
    back:{label:'Back neckline',keys:['backNeck']},
    shoulder:{label:'Shoulder and armhole',keys:['shoulder','shoulderSlope','armhole']},
    sleeves:{label:'Sleeves',keys:['sleeveWidth','sleeveCap','sleeveLength','cuff']},
    length:{label:'Hem and length',keys:['sweep','length','waistHeight']},
    legs:{label:'Pants legs',keys:['thigh','knee','leg','rise','length']}
  };

  function available(keys) {
    const allowed=new Set(keys);
    return Object.entries(groups).map(([id,group])=>[
      id,{label:group.label,keys:group.keys.filter(key=>allowed.has(key))}
    ]).filter(([,group])=>group.keys.length);
  }

  function place(key,surfaces,canvas) {
    const spec=specs[key];
    const surface=surfaces[spec.part || (key==='length'&&surfaces.leg?'leg':'shell')];
    if (!surface) return null;
    const {rings,projectPoint,opening}=surface;
    const index=spec.neck?0:spec.end?rings.length-1:rings.reduce((best,row,i)=>
      Math.abs(row[0]-spec.y)<Math.abs(rings[best][0]-spec.y)?i:best,0);
    const ring=rings[index];
    const x=(key==='neckWidth'?opening:spec.x) ?? (spec.axis==='x'?.98:.67);
    const theta=(spec.back?-1:1)*Math.acos(x);
    const [px,py]=projectPoint(ring,theta,index);
    return {x:100*px/canvas.width,y:100*py/canvas.height};
  }

  return {specs,available,place};
})();
