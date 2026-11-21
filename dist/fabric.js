'use strict';

const fabricFit = (() => {
  // Illustrative stretch allowances at the onset of high restriction, by direction.
  const fabrics = {
    'Cotton poplin':{cross:0.027,length:0.018,power:1.15,gsm:130,bend:0.44},
    'Cotton lawn':{cross:0.02,length:0.014,power:1.15,gsm:85,bend:0.27},
    'Cotton voile':{cross:0.027,length:0.019,power:1.2,gsm:67,bend:0.2},
    'Cotton oxford':{cross:0.02,length:0.015,power:1.1,gsm:160,bend:0.55},
    'Cotton seersucker':{cross:0.05,length:0.025,power:1.28,gsm:145,bend:0.37},
    'Chambray':{cross:0.03,length:0.02,power:1.18,gsm:145,bend:0.43},
    'Linen blend':{cross:0.036,length:0.022,power:1.2,gsm:175,bend:0.42},
    'Medium-weight linen':{cross:0.026,length:0.018,power:1.14,gsm:210,bend:0.45},
    'Viscose challis':{cross:0.055,length:0.033,power:1.34,gsm:115,bend:0.18},
    'Tencel twill':{cross:0.042,length:0.028,power:1.28,gsm:195,bend:0.3},
    'Medium-weight twill':{cross:0.035,length:0.024,power:1.2,gsm:245,bend:0.55},
    'Cotton canvas':{cross:0.015,length:0.01,power:1.07,gsm:300,bend:0.68},
    'Corduroy':{cross:0.028,length:0.017,power:1.16,gsm:285,bend:0.58},
    'Lightweight rigid denim':{cross:0.025,length:0.018,power:1.14,gsm:245,bend:0.52},
    'Rigid denim':{cross:0.022,length:0.015,power:1.1,gsm:410,bend:0.68},
    'Heavy rigid denim':{cross:0.016,length:0.011,power:1.06,gsm:510,bend:0.72},
    'Stretch denim':{cross:0.15,length:0.04,power:1.45,gsm:315,bend:0.52},
    'Wool suiting':{cross:0.053,length:0.028,power:1.28,gsm:240,bend:0.42},
    'Wool coating':{cross:0.045,length:0.027,power:1.19,gsm:490,bend:0.68},
    'Stretch woven suiting':{cross:0.15,length:0.06,power:1.4,gsm:225,bend:0.39},
    'Fluid woven crepe':{cross:0.052,length:0.032,power:1.3,gsm:160,bend:0.18},
    'Silk charmeuse':{cross:0.031,length:0.022,power:1.22,gsm:85,bend:0.17},
    'Silk chiffon':{cross:0.025,length:0.016,power:1.16,gsm:45,bend:0.16},
    'Silk organza':{cross:0.016,length:0.012,power:1.08,gsm:50,bend:0.68},
    'Silk dupioni':{cross:0.02,length:0.015,power:1.1,gsm:125,bend:0.64},
    'Woven satin':{cross:0.028,length:0.016,power:1.1,gsm:155,bend:0.3},
    'Woven velvet':{cross:0.045,length:0.025,power:1.24,gsm:245,bend:0.39},
    'Stretch velvet':{cross:0.25,length:0.09,power:1.55,gsm:245,bend:0.31},
    'Cotton jersey':{cross:0.26,length:0.13,power:1.65,gsm:190,bend:0.24},
    'Cotton-spandex jersey':{cross:0.49,length:0.29,power:1.72,gsm:220,bend:0.23},
    'Rib knit':{cross:0.55,length:0.16,power:1.73,gsm:235,bend:0.22},
    'Interlock knit':{cross:0.31,length:0.14,power:1.55,gsm:240,bend:0.38},
    'Ponte knit':{cross:0.28,length:0.12,power:1.52,gsm:320,bend:0.48},
    'French terry':{cross:0.22,length:0.1,power:1.48,gsm:310,bend:0.42},
    'Sweatshirt fleece':{cross:0.18,length:0.07,power:1.44,gsm:330,bend:0.51},
    'Stretch mesh':{cross:0.47,length:0.36,power:1.72,gsm:110,bend:0.18},
    'Nylon-spandex activewear':{cross:0.53,length:0.4,power:1.8,gsm:240,bend:0.25},
    'Swimwear tricot':{cross:0.52,length:0.44,power:1.83,gsm:195,bend:0.2},
    'Four-way stretch':{cross:0.45,length:0.36,power:1.8,gsm:225,bend:0.21}
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
        add('sleeve','Upper sleeve',around(body.upperArm||(body.bust||92)*.32,3.5,'sleeveWidth',.060*pose.arm+.035*pose.reach),.021*pose.arm+.022*pose.reach);
        add('cuff','Sleeve opening',around(body.wrist||(body.bust||92)*.20,3.5,'cuff',.022*pose.arm));
      }
    }
    add('waist','Waist',around(body.waist||74,bodice?ease??5:2.7,'waist',.045*pose.sit),.013*pose.sit+gravity);
    if (model!=='top' || pattern.design?.length==='Low hip') {
      add('hip','Hip / seat',around(body.hip||98,ease??5,'hip',.067*pose.sit),.045*pose.sit+gravity);
    }
    if (legs) {
      add('thigh','Thigh / knee',around(body.thigh||(body.hip||98)*.54,5,'thigh',.086*pose.sit),.07*pose.sit);
      add('leg','Lower leg',around(body.calf||(body.hip||98)*.35,4,'leg',.02*pose.sit));
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

  function rig(pose) {
    const hip=.22, knee=.655;
    const thighAngle=pose.sit*1.46;
    const shinAngle=-pose.sit*.10;
    const upper=knee-hip;
    const lower=1.045-knee;
    const kneeY=hip+upper*Math.cos(thighAngle);
    const kneeZ=upper*Math.sin(thighAngle);
    const drop=1.045-kneeY-lower*Math.cos(shinAngle);
    const ankleZ=kneeZ+lower*Math.sin(shinAngle);
    const lean=.14*pose.sit+.08*pose.reach;
    const rotate=(y,z,angle)=>[y*Math.cos(angle)-z*Math.sin(angle),y*Math.sin(angle)+z*Math.cos(angle)];
    function torso([x,y,z]) {
      const [v,w]=rotate(y-hip,z,-lean);
      const weight=clamp((hip-y)/.44,0,1);
      return [x,mix(y,v+hip,weight)+drop,mix(z,w,weight)];
    }
    function leg([x,y,z]) {
      const [a,b]=rotate(y-hip,z,thighAngle);
      const [c,d]=rotate(y-knee,z,shinAngle);
      const t=clamp((y-knee+.105)/.21,0,1);
      return [x,mix(hip+a,kneeY+c,t)+drop,mix(b,kneeZ+d,t)];
    }
    function foot([x,y,z]) {
      return [x,y,z+ankleZ];
    }
    function skirt([x,y,z],theta,material) {
      if (!pose.sit || y<=hip) return torso([x,y,z]);
      const fall=y-hip;
      const forward=(1+Math.sin(theta))*.5;
      const bend=material?.bend ?? .42;
      const weight=clamp(((material?.gsm ?? 170)-100)/500,0,1);
      const blend=clamp(fall/.16,0,1);
      const lap=upper*(.24+.76*forward);
      const across=Math.min(fall,lap);
      const hanging=Math.max(0,fall-lap);
      const fold=Math.sin(theta*7+fall*11)*.025*blend*(1-.5*bend);
      const softCorner=1-Math.exp(-hanging/(.065+.11*bend));
      const yOnLap=across*Math.cos(thighAngle)-.045*forward*blend;
      const yFall=hanging*(.86+.12*weight);
      const zOnLap=across*Math.sin(thighAngle);
      const zFall=softCorner*(.05+.045*bend)*(1-.45*weight);
      const sideways=Math.abs(Math.cos(theta))*blend*.035;
      const movingY=hip+drop+yOnLap+yFall+fold;
      const excess=Math.max(0,movingY-1.105);
      const movingZ=z+zOnLap+zFall+fold*.6+excess*forward*.45;
      return [x+Math.sign(x)*sideways*pose.sit,mix(y+drop,Math.min(1.105,movingY),pose.sit),mix(z,movingZ,pose.sit)];
    }
    return {torso,leg,foot,skirt};
  }
  const posePoint=(point,pose,part='body')=>rig(pose)[part==='leg'?'leg':'torso'](point);

  return {fabrics,poses,resample,envelope,clearance,posePoint,rig,estimate,levelAt,tint,clamp,mix};
})();
