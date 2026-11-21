'use strict';

const sewingModels = (() => {
  const defaults = [
    {id:'studio-form',name:'Studio dress form',profile:'female',bust:92,waist:74,hip:98,shoulder:39},
    {id:'straight-form',name:'Straight dress form',profile:'female',bust:98,waist:89,hip:101,shoulder:43},
    {id:'full-hip-form',name:'Full-hip dress form',profile:'female',bust:104,waist:86,hip:117,shoulder:40},
    {id:'female-athletic',name:'Athletic female form',profile:'female',bust:94,waist:72,hip:101,shoulder:42,
      height:174,inseam:81,arm:58,neck:33,underbust:78,highHip:89,thigh:58,knee:36,calf:37,ankle:23,upperArm:30,wrist:16},
    {id:'male-classic',name:'Classic male form',profile:'male',bust:102,waist:86,hip:100,shoulder:45,
      height:178,inseam:82,arm:62,neck:39,underbust:94,highHip:94,thigh:57,knee:39,calf:37,ankle:23,upperArm:33,wrist:18},
    {id:'male-broad',name:'Broad male form',profile:'male',bust:116,waist:101,hip:111,shoulder:51,
      height:185,inseam:84,arm:65,neck:44,underbust:109,highHip:104,thigh:63,knee:43,calf:41,ankle:25,upperArm:39,wrist:20}
  ];
  const starter = {
    female:{...defaults[0],height:168,inseam:76,arm:56,neck:33,underbust:77,highHip:87,thigh:55,knee:36,calf:35,ankle:22,upperArm:28,wrist:16},
    male:defaults[4]
  };
  const dimensions = {
    bust:['Chest / bust',65,160],
    waist:['Waist',55,145],
    hip:['Hip / seat',65,175],
    shoulder:['Shoulder span',28,58],
    height:['Height',110,225],
    inseam:['Body inseam',45,115],
    waistToFloor:['Waist to floor',62,145],
    shoulderToWaist:['Shoulder to waist',25,61],
    arm:['Shoulder to wrist',35,85],
    neck:['Neck circumference',24,57],
    underbust:['Underbust / rib cage',53,152],
    bustProjection:['Bust projection',1,20],
    bustSpacing:['Bust point spacing',12,35],
    bustHeight:['Bust point to floor',65,180],
    kneeHeight:['Kneecap center to floor',25,77],
    headLength:['Crown to chin',16,35],
    highHip:['High hip circumference',60,160],
    thigh:['Thigh circumference',30,94],
    knee:['Knee circumference',24,62],
    calf:['Calf circumference',23,65],
    ankle:['Ankle circumference',16,39],
    upperArm:['Upper arm circumference',19,65],
    wrist:['Wrist circumference',12,30],
    upperChest:['Upper chest circumference',52,160],
    underbustHeight:['Rib cage to floor',60,175],
    waistDepth:['Waist front-to-back depth',10,50],
    hipDepth:['Full hip front-to-back depth',12,60],
    waistToHighHip:['Waist to high hip',3,24],
    waistToHip:['Waist to full hip',8,40],
    shoulderToElbow:['Shoulder to elbow',16,49],
    forearm:['Forearm circumference',15,50],
    midThigh:['Mid-thigh circumference',24,88],
    calfHeight:['Fullest calf to floor',10,60],
    footLength:['Foot length',15,37]
  };

  const measurementGroups = [
    {title:'Overall proportions',keys:['height','inseam','waistToFloor','shoulderToWaist','headLength']},
    {title:'Torso and hips',keys:['upperChest','underbustHeight','waistDepth','highHip','waistToHighHip','hipDepth','waistToHip','neck']},
    {title:'Arms',keys:['arm','shoulderToElbow','upperArm','forearm','wrist']},
    {title:'Legs and feet',keys:['thigh','midThigh','knee','kneeHeight','calf','calfHeight','ankle','footLength']}
  ];
  const measuringTips = {
    upperChest:'Wrap the tape just under the armpits and above the fullest part of the chest.',
    underbustHeight:'Measure vertically from the floor to the level where you wrapped the rib-cage tape.',
    waistDepth:'At waist level, hold two books upright against the front and back without pressing in. Measure straight between their inner faces.',
    highHip:'Wrap the tape level around your upper hips. Use that same level for waist to high hip.',
    waistToHighHip:'Measure straight down from your natural waist to the upper-hip tape line.',
    hipDepth:'At the level of your full-hip tape, use two upright books to measure straight from front to back.',
    waistToHip:'Measure straight down at your side from the natural waist to the level around the fullest part of the seat.',
    neck:'Wrap the tape around your neck where a shirt collar would sit.',
    arm:'Measure from the outside shoulder point to the wrist bone with the elbow slightly bent.',
    shoulderToElbow:'Use the same arm position. Measure from the outside shoulder point to the elbow point.',
    upperArm:'Wrap the tape around the fullest part of your upper arm with your arm relaxed.',
    forearm:'Wrap the tape around the fullest part of the forearm, usually just below the elbow.',
    wrist:'Wrap the tape around the wrist at the wrist bones.',
    thigh:'Wrap the tape around one upper thigh, just below the crotch.',
    midThigh:'Wrap the tape halfway between the upper-thigh tape line and the center of the kneecap.',
    knee:'Wrap the tape around the center of the kneecap with the leg relaxed and straight.',
    kneeHeight:'Standing barefoot, measure vertically from the floor to the center of the kneecap.',
    calf:'Wrap the tape around the fullest part of one calf.',
    calfHeight:'Measure vertically from the floor to the level where you wrapped the calf tape.',
    ankle:'Wrap the tape around the narrowest part of the ankle, just above the ankle bones.',
    footLength:'Stand barefoot on paper. Mark the back of the heel and the tip of the longest toe, then measure between them.'
  };
  const profiles={female:'Female',male:'Male'};
  const profileOf=model=>model.profile==='male'?'male':'female';
  const cups=['A','B','C','D','DD','DDD / E','F','G'];
  function bustProjection(model) {
    if (profileOf(model)!=='female') return 0;
    if (Number.isFinite(model.bustProjection) && model.bustProjection>0) return model.bustProjection;
    const full=model.bust||starter.female.bust;
    const rib=model.underbust||starter.female.underbust;
    if (!model.underbust) {
      const braCup=model.braSize?.trim().toUpperCase().match(/^[0-9]+\s*([A-G]{1,3})$/)?.[1];
      const visualCup=({E:'DDD / E',DDD:'DDD / E',FF:'F'})[braCup]||braCup;
      const cup=cups.indexOf(model.cup||visualCup);
      if (cup>=0) return 2.7+cup*.67;
    }
    return Math.max(1.8,Math.min(8.5,2.1+Math.max(0,full-rib-6)*.29));
  }
  const unit = 2.368/168;
  const clamp = (value,min,max)=>Math.min(max,Math.max(min,value));

  function bustGeometry(model, proportions) {
    const female=profileOf(model)==='female';
    const {bust,underbust}=model;
    // Projection and tape girth describe different things. Bound saved depth
    // by the available bust-to-rib difference, including on older models.
    const limit=underbust && bust ? clamp(1.8+Math.max(0,bust-underbust)*.31,1.8,8.5) : 8.5;
    const depth=female?Math.min(bustProjection(model),limit):0;
    const y=model.bustHeight ? proportions.baseAt(clamp(model.bustHeight,proportions.waist+9,proportions.shoulder-5)) : -.49;
    return {depth,y,spacing:(model.bustSpacing||19)*unit,limited:female && model.bustProjection>limit};
  }

  function bustShape(geometry,x,y,front,width) {
    if (front<=0 || !geometry.depth) return 0;
    const center=clamp(geometry.spacing/(2*width),.29,.68);
    const lobe=side=>Math.exp(-(((x-side*center)/.24)**2)/2);
    const horizontal=lobe(-1)+lobe(1);
    const falloff=y<geometry.y?.143:.103;
    const vertical=Math.exp(-(((y-geometry.y)/falloff)**2));
    return geometry.depth*unit*horizontal*vertical*front**1.5;
  }

  // A taut tape spans concavities such as the center of the bust.
  function tapePerimeter(width,depth,offset) {
    const points=Array.from({length:72},(_,i)=>{
      const theta=i*Math.PI/36;
      const x=Math.cos(theta),z=Math.sin(theta);
      return [x*width,z*depth+offset(x,z)];
    }).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
    const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
    const half=points=>{
      const hull=[];
      for (const p of points) {
        while (hull.length>=2 && cross(hull.at(-2),hull.at(-1),p)<=0) hull.pop();
        hull.push(p);
      }
      return hull.slice(0,-1);
    };
    const hull=half(points).concat(half(points.reverse()));
    return hull.reduce((sum,p,i)=>sum+Math.hypot(p[0]-hull.at(i-1)[0],p[1]-hull.at(i-1)[1]),0);
  }

  function fitSection(row,target,geometry) {
    if (!target) return row;
    const [y,w,d,...rest]=row;

    if (!geometry?.depth || Math.abs(y-geometry.y)>.35) {
      const h=((w-d)/(w+d))**2;
      const ellipse=Math.PI*(w+d)*(1+3*h/(10+Math.sqrt(4-3*h)));
      const ratio=target*unit/ellipse;
      return [y,w*ratio,d*ratio,...rest];
    }
    let low=.18, high=4;
    for (let i=0;i<16;i++) {
      const ratio=(low+high)/2;
      const offset=(x,z)=>bustShape(geometry,x,y,z,w*ratio);
      if (tapePerimeter(w*ratio,d*ratio,offset)<target*unit) low=ratio;
      else high=ratio;
    }
    const ratio=(low+high)/2;
    return [y,w*ratio,d*ratio,...rest];
  }

  function calibrated(model,rings,part,geometry) {
    const sections=part==='torso'
      ? [['neck',-.9],['bust',geometry.y],['underbust',Math.min(-.27,geometry.y+.12)],['waist',-.25],['highHip',-.04],['hip',.16]]
      : part==='leg' ? [['thigh',.31],['knee',.655],['calf',.76],['ankle',1.015]]
      : [['upperArm',-.60],['wrist',-.038]];
    const levels=sections.filter(([key,y])=>model[key] && y>=rings[0][0] && y<=rings.at(-1)[0]);
    const sample=y=>{
      const j=Math.max(1,rings.findIndex(row=>row[0]>=y));
      const a=rings[j-1],b=rings[j];
      return a.map((value,i)=>value+(b[i]-value)*(y-a[0])/(b[0]-a[0]));
    };
    const adjustments=levels.map(([key,y])=>{
      const row=sample(y);
      const fitted=fitSection(row,model[key],part==='torso'?geometry:null);
      return [y,fitted[1]/row[1]];
    });
    const anchors=new Map([[rings[0][0],1],[rings.at(-1)[0],1],...adjustments]);
    const ordered=[...anchors].sort((a,b)=>a[0]-b[0]);
    const ys=[...new Set([...rings.map(row=>row[0]),...ordered.map(row=>row[0])])].sort((a,b)=>a-b);
    return ys.map(y=>{
      const j=Math.max(1,ordered.findIndex(row=>row[0]>=y));
      const [a,b]=ordered.slice(j-1,j+1);
      const t=(y-a[0])/(b[0]-a[0]);
      const ratio=a[1]+(b[1]-a[1])*t*t*(3-2*t);
      const [,w,d,...rest]=sample(y);
      return [y,w*ratio,d*ratio,...rest];
    });
  }

  function smoothRings(rings,step=.027) {
    const slope=(i,axis)=>{
      const a=rings[Math.max(0,i-1)], b=rings[i], c=rings[Math.min(i+1,rings.length-1)];
      const before=(b[axis]-a[axis])/(b[0]-a[0]||1);
      const after=(c[axis]-b[axis])/(c[0]-b[0]||1);
      return before*after>0 ? 2*before*after/(before+after) : 0;
    };
    return rings.flatMap((row,i)=>{
      const next=rings[i+1];
      if (!next) return [row];
      const span=next[0]-row[0];
      const count=Math.max(1,Math.ceil(span/step));
      return Array.from({length:count},(_,j)=>{
        const t=j/count;
        return row.map((value,axis)=>{
          if (!axis) return value+span*t;
          const d=next[axis]-value;
          return value+d*t*t*(3-2*t)+span*t*(1-t)*((1-t)*slope(i,axis)-t*slope(i+1,axis));
        });
      });
    });
  }

  function proportions(model) {
    const floor=1.128, top=-1.24;
    const height=model.height || starter[profileOf(model)].height;
    const toWorld=unit;
    const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
    const crotch=clamp(model.inseam||height*.448,height*.29,height*.59);
    const waist=clamp(model.waistToFloor||crotch+height*.142,crotch+height*.07,height*.74);
    const shoulder=clamp(model.shoulderToWaist?waist+model.shoulderToWaist:height*.824,
      waist+height*.10,height*.89);
    const chin=clamp(height-(model.headLength||height*.123),shoulder+height*.025,height*.925);
    const knee=clamp(model.kneeHeight||crotch*.58,height*.16,crotch*.76);
    const anchors=[
      [top,height],[-.986,chin],[-.73,shoulder],[-.25,waist],[.30,crotch],
      [.655,knee],[1.045,height*.035],[floor,0]
    ].map(([base,aboveFloor])=>[base,floor-aboveFloor*toWorld]);
    function yAt(value) {
      const next=anchors.findIndex(([at])=>at>value);
      const hi=next<0?anchors.length-1:Math.max(1,next);
      const [a,b]=anchors.slice(hi-1,hi+1);
      return a[1]+(b[1]-a[1])*(value-a[0])/(b[0]-a[0]);
    }
    const baseAt=aboveFloor=>{
      const world=floor-aboveFloor*toWorld;
      const hi=Math.max(1,anchors.findIndex(([,y])=>y>=world));
      const [a,b]=anchors.slice(hi-1,hi+1);
      return a[0]+(b[0]-a[0])*(world-a[1])/(b[1]-a[1]);
    };
    return {yAt,baseAt,height,crotch,waist,shoulder,knee,chin};
  }
  function measurementIssue(model) {
    const {height,inseam,waistToFloor,shoulderToWaist}=model;
    const h=height || starter[profileOf(model)].height;
    if (inseam && (inseam<h*.29 || inseam>h*.59)) return 'Check whether body inseam runs from crotch to floor and that it uses the same units as height.';
    if (waistToFloor && inseam && waistToFloor<inseam+h*.07) return 'Waist to floor should extend above the crotch. Check that you measured from your natural waist.';
    if (waistToFloor && waistToFloor>h*.74) return 'Waist to floor is unusually long for this height. Check the waist mark and units.';
    if (shoulderToWaist && waistToFloor && shoulderToWaist+waistToFloor>h*.89) return 'Together the shoulder-to-waist and waist-to-floor measurements leave too little room for the head and neck. Check the landmarks.';
    if (model.shoulderToElbow && model.arm && model.arm-model.shoulderToElbow<10) return 'Shoulder to wrist should extend past the elbow. Check both arm lengths and the selected units.';
    if (model.waistToHighHip && model.waistToHip && model.waistToHip-model.waistToHighHip<2) return 'The full-hip tape line should sit at least 2 cm below the high-hip tape line.';
    if (model.calfHeight && model.kneeHeight && model.calfHeight>=model.kneeHeight-2) return 'The fullest calf should be below the kneecap. Check both heights from the floor.';
    if (model.underbustHeight && model.bustHeight && model.underbustHeight>=model.bustHeight-2) return 'The rib-cage tape line should be below the bust point.';
    for (const [depth,girth] of [['waistDepth','waist'],['hipDepth','hip']]) {
      if (model[depth] && model[girth] && model[depth]*2>=model[girth]) return dimensions[depth][0]+' should be a straight front-to-back distance. Check it against the circumference.';
    }
    return '';
  }
  const summary = model => ['height','inseam','waistToFloor','shoulderToWaist','arm'].filter(key=>model[key]).map(key=>dimensions[key][0]+' '+model[key]+' cm').join(' · ');

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
  return {defaults,dimensions,measurementGroups,measuringTips,profiles,profileOf,starter,cups,bustProjection,bustGeometry,bustShape,calibrated,smoothRings,proportions,measurementIssue,summary,parseObj};
})();
