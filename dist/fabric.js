'use strict';

const fabricFit = (() => {
  // Illustrative stretch allowances at the onset of high restriction, by direction.
  const fabrics = {
    'Rigid denim':     {cross:.022,length:.015,power:1.1,gsm:410,bend:0.68},
    'Cotton poplin':   {cross:.027,length:.018,power:1.15,gsm:130,bend:0.44},
    'Linen blend':     {cross:.036,length:.022,power:1.2,gsm:175,bend:0.42},
    'Medium-weight twill':{cross:.035,length:.024,power:1.2,gsm:245,bend:.55},
    'Fluid woven crepe':  {cross:.052,length:.032,power:1.3,gsm:160,bend:0.18},
    'Stretch denim':   {cross:.15,length:.04,power:1.45,gsm:315,bend:0.52},
    'Cotton jersey':   {cross:.26,length:.13,power:1.65,gsm:190,bend:0.24},
    'Four-way stretch':{cross:.45,length:.36,power:1.8,gsm:225,bend:0.21}
  };

  const poses = {
    stand:{name:'Standing',sit:0,arm:0,reach:0},
    sit:{name:'Sitting',sit:1,arm:.12,reach:.20},
    reach:{name:'Reach forward',sit:0,arm:.45,reach:1},
    raise:{name:'Raise arms',sit:0,arm:1,reach:0}
  };
  const clamp = (n,min,max) => Math.min(max,Math.max(min,n));
  const mix = (a,b,t) => a+(b-a)*t;
  const stretch = (needed,available) => Math.max(0,needed/Math.max(available,1)-1);
  const response = (fabric,cross,length) => 1-Math.exp(-.85*Math.hypot(
    (cross/Math.max(.001,fabric.cross))**fabric.power,(length/Math.max(.001,fabric.length))**fabric.power));

  function estimate(pattern,model,body,changes,pose,material) {
    const ease = pattern.design?.ease;
    const bodice=model==='top'||model==='dress';
    const legs=model==='trousers';
    const around = (measure,extra,delta,demand=0) => stretch(measure*(1+demand),measure+extra+(changes[delta]||0));
    const regions = {};
    const hangingLength = model==='dress'||model==='trousers'?1:model==='skirt'?.58:.33;
    const gravity = clamp((material.gsm-85)/420,0,1.35)*hangingLength*.009*(1-material.bend);
    function add(key,label,cross,length=0) {
      regions[key]={label,cross,length,level:response(material,cross,length)};
    }
    if (bodice) {
      add('bust','Chest / bust',around(body.bust||92,ease??5,'bust',.042*pose.reach+.022*pose.arm),.009*pose.reach);
      add('shoulder','Shoulders / upper back',around(body.shoulder||39,1.3,'shoulder',.07*pose.reach+.036*pose.arm),.032*pose.reach+.025*pose.arm);
      add('armhole','Armhole',around(38,2.2,'armhole',.035*pose.reach+.095*pose.arm),.05*pose.arm);
      if (changes.hasSleeves) {
        add('sleeve','Upper sleeve',around((body.bust||92)*.32,3.5,'sleeveWidth',.060*pose.arm+.035*pose.reach),.021*pose.arm+.022*pose.reach);
        add('cuff','Sleeve opening',around((body.bust||92)*.20,3.5,'cuff',.022*pose.arm));
      }
    }
    add('waist','Waist',around(body.waist||74,bodice?ease??5:2.7,'waist',.045*pose.sit),.013*pose.sit+gravity);
    if (model!=='top' || pattern.design?.length==='Low hip') {
      add('hip','Hip / seat',around(body.hip||98,ease??5,'hip',.067*pose.sit),.045*pose.sit+gravity);
    }
    if (legs) {
      add('thigh','Thigh / knee',around((body.hip||98)*.54,5,'thigh',.086*pose.sit),.07*pose.sit);
      add('leg','Lower leg',around((body.hip||98)*.35,4,'leg',.02*pose.sit));
      add('rise','Crotch / rise',0,stretch(28+pose.sit*4,30+(changes.rise||0)));
    }
    return regions;
  }

  function levelAt(regions,y,theta,part) {
    const band=(key,center,width)=> (regions[key]?.level||0)*Math.max(0,1-Math.abs(y-center)/width);
    if (part==='sleeve') return Math.max(band('sleeve',-.61,.47),band('cuff',-.35,.38),band('armhole',-.68,.12));
    if (part==='leg') return Math.max(band('thigh',.38,.34),band('leg',.92,.31),band('rise',.24,.20));
    const side = Math.abs(Math.cos(theta));
    const upperBack = .65+.35*Math.max(0,-Math.sin(theta));
    return Math.max(band('bust',-.48,.23),band('waist',-.25,.26),band('hip',.12,.35),
      band('shoulder',-.73,.15)*upperBack,band('armhole',-.61,.2)*side,band('rise',.23,.17));
  }
  function tint(channels,level) {
    const low=[238,173,64], high=[194,25,65];
    const weight = clamp(level*1.4,0,1);
    return channels.map((channel,i)=>mix(channel,mix(low[i],high[i],level),weight));
  }
  function resample(rings,step=.045) {
    return rings.flatMap((ring,index)=>{
      if (index===rings.length-1) return [ring];
      const next=rings[index+1];
      const count=Math.max(1,Math.ceil(Math.abs(next[0]-ring[0])/step));
      return Array.from({length:count},(_,i)=>ring.map((value,axis)=>mix(value,next[axis],i/count)));
    });
  }

  function envelope(rings,y) {
    if (y<rings[0][0] || y>rings.at(-1)[0]) return [0,0];
    const i=rings.findIndex(ring=>ring[0]>=y);
    if (i===0) return rings[0].slice(1,3);
    const [a,b]=rings.slice(i-1,i+1);
    const t=(y-a[0])/Math.max(.001,b[0]-a[0]);
    return [mix(a[1],b[1],t),mix(a[2],b[2],t)];
  }

  function clearance(rings,body,extra=.012) {
    return rings.map(([y,w,d,...rest])=>{
      const [bodyW,bodyD]=envelope(body,y);
      return [y,Math.max(w,bodyW+extra),Math.max(d,bodyD+extra),...rest];
    });
  }

  function posePoint([x,y,z],pose,part='body') {
    const seat = pose.sit;
    if (part==='leg') {
      const thigh=clamp((y-.22)/.44,0,1);
      const shin=clamp((y-.66)/.43,0,1);
      y += seat*(-.35*thigh+.07*shin);
      z += seat*(.46*thigh-.04*shin);
    } else {
      y -= seat*.10;
      z += seat*.11*clamp((y+.72)/.9,0,1);
    }
    return [x,y,z];
  }

  return {fabrics,poses,resample,envelope,clearance,posePoint,estimate,levelAt,tint,clamp,mix};
})();
