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
    highHip:['High hip circumference',60,160],
    thigh:['Thigh circumference',30,94],
    knee:['Knee circumference',24,62],
    calf:['Calf circumference',23,65],
    ankle:['Ankle circumference',16,39],
    upperArm:['Upper arm circumference',19,65],
    wrist:['Wrist circumference',12,30]
  };

  const extra = new Set(Object.keys(dimensions).slice(4));
  const profiles={female:'Female',male:'Male'};
  const profileOf=model=>model.profile==='male'?'male':'female';
  const cups=['A','B','C','D','DD','DDD / E','F','G'];
  function bustShape(model,x,y,front) {
    if (profileOf(model)!=='female' || front<=0) return 0;
    const cup=cups.indexOf(model.cup);
    const measured=model.underbust && model.bust
      ? Math.max(0,Math.min(6,(model.bust-model.underbust-8)/2.5)):2;
    const projection=.012+(cup<0?measured:cup)*.008;
    const center=.46;
    const horizontal=Math.exp(-(((Math.abs(x)-center)/.33)**2));
    const vertical=Math.exp(-(((y+.49)/.125)**2));
    return projection*horizontal*vertical*front;
  }
  function shape(model,rings,part) {
    const ref=starter[profileOf(model)];
    const k=(key,coefficient)=>((model[key]??ref[key])-starter.female[key])*coefficient;
    const male=profileOf(model)==='male';
    const at=(y,center,range)=>Math.max(0,1-Math.abs(y-center)/range);
    return rings.map(([y,w,d,...rest])=>{
      let width=0,depth=0;
      if (part==='torso') {
        width=k('neck',.002)*at(y,-.9,.14)+k('underbust',.0013)*at(y,-.45,.14)+k('highHip',.0014)*at(y,-.04,.16);
        depth=width*.65+(male?-.012:.009)*at(y,-.6,.19)+(male?-.007:.008)*at(y,.16,.22);
      } else if (part==='leg') {
        width=k('thigh',.0017)*at(y,.31,.26)+k('knee',.0016)*at(y,.655,.17)+
          k('calf',.0017)*at(y,.76,.19)+k('ankle',.0016)*at(y,1.015,.14);
        depth=width*.86+.007*at(y,.76,.13);
      } else {
        width=k('upperArm',.0018)*at(y,-.60,.25)+k('wrist',.0016)*at(y,-.04,.20);
        depth=width*.85;
      }
      return [y,Math.max(.008,w+width),Math.max(.008,d+depth),...rest];
    });
  }
  function proportions(model) {
    const floor=1.128, top=-1.24;
    const height=model.height || starter[profileOf(model)].height;
    const toWorld=2.368/168;
    const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
    const crotch=clamp(model.inseam||height*.448,height*.29,height*.59);
    const waist=clamp(model.waistToFloor||crotch+height*.142,crotch+height*.07,height*.74);
    const shoulder=clamp(model.shoulderToWaist?waist+model.shoulderToWaist:height*.824,
      waist+height*.10,height*.89);
    const chin=clamp(height*.865,shoulder+height*.025,height*.925);
    const anchors=[
      [top,height],[-.986,chin],[-.73,shoulder],[-.25,waist],[.30,crotch],
      [.655,crotch*.515],[1.045,height*.035],[floor,0]
    ].map(([base,aboveFloor])=>[base,floor-aboveFloor*toWorld]);
    function yAt(value) {
      const next=anchors.findIndex(([at])=>at>value);
      const hi=next<0?anchors.length-1:Math.max(1,next);
      const [a,b]=anchors.slice(hi-1,hi+1);
      return a[1]+(b[1]-a[1])*(value-a[0])/(b[0]-a[0]);
    }
    return {yAt,height,crotch,waist,shoulder};
  }
  function measurementIssue(model) {
    const {height,inseam,waistToFloor,shoulderToWaist}=model;
    const h=height || starter[profileOf(model)].height;
    if (inseam && (inseam<h*.29 || inseam>h*.59)) return 'Check whether body inseam runs from crotch to floor and that it uses the same units as height.';
    if (waistToFloor && inseam && waistToFloor<inseam+h*.07) return 'Waist to floor should extend above the crotch. Check that you measured from your natural waist.';
    if (waistToFloor && waistToFloor>h*.74) return 'Waist to floor is unusually long for this height. Check the waist mark and units.';
    if (shoulderToWaist && waistToFloor && shoulderToWaist+waistToFloor>h*.89) return 'Together the shoulder-to-waist and waist-to-floor measurements leave too little room for the head and neck. Check the landmarks.';
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
  return {defaults,dimensions,extra,profiles,profileOf,starter,cups,bustShape,shape,proportions,measurementIssue,summary,parseObj};
})();
