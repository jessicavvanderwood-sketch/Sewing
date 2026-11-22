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

  const materialGroups = {
    'Shirting & lightweight wovens': ['Cotton poplin', 'Cotton lawn', 'Cotton voile', 'Cotton oxford', 'Cotton seersucker', 'Chambray', 'Linen blend', 'Medium-weight linen', 'Viscose challis', 'Tencel twill', 'Cotton batiste', 'Cotton muslin', 'Double gauze', 'Cotton broadcloth', 'Cotton sateen', 'Yarn-dyed gingham', 'Brushed cotton flannel', 'Linen handkerchief weave', 'Linen-cotton shirting', 'Linen-viscose blend', 'Ramie shirting', 'Rayon twill', 'Cupro twill', 'Modal woven'],
    'Denim, workwear & outerwear': ['Medium-weight twill', 'Cotton canvas', 'Corduroy', 'Lightweight rigid denim', 'Rigid denim', 'Heavy rigid denim', 'Stretch denim', 'Wool coating', 'Bull denim', 'Slub denim', 'Stretch black denim', 'Cotton duck', 'Waxed canvas', 'Cotton gabardine', 'Fine-wale corduroy', 'Wide-wale corduroy', 'Cotton drill', 'Wool melton', 'Boiled wool', 'Nylon ripstop', 'Coated rainwear nylon', 'Technical softshell'],
    'Suiting & tailored wovens': ['Wool suiting', 'Stretch woven suiting', 'Wool worsted', 'Tropical wool', 'Wool flannel', 'Wool herringbone', 'Wool tweed', 'Wool gabardine', 'Wool crepe', 'Linen suiting', 'Polyester suiting', 'Stretch gabardine', 'Cotton-linen suiting'],
    'Silk, eveningwear & sheer': ['Fluid woven crepe', 'Silk charmeuse', 'Silk chiffon', 'Silk organza', 'Silk dupioni', 'Woven satin', 'Woven velvet', 'Stretch velvet', 'Silk habotai', 'Silk georgette', 'Silk crepe de chine', 'Silk twill', 'Silk faille', 'Silk taffeta', 'Silk shantung', 'Duchess satin', 'Mikado', 'Jacquard brocade', 'Viscose satin', 'Polyester chiffon', 'Soft tulle', 'Guipure lace'],
    'Knits & sweatshirt fabrics': ['Cotton jersey', 'Cotton-spandex jersey', 'Rib knit', 'Interlock knit', 'Ponte knit', 'French terry', 'Sweatshirt fleece', 'Modal jersey', 'Viscose jersey', 'Wool jersey', 'Merino jersey', 'Linen jersey', 'Bamboo-viscose jersey', 'Heavy cotton interlock', 'Intarsia sweater knit', 'Waffle knit', 'Hacci sweater knit', 'Cotton piqué knit', 'Polar fleece', 'Sherpa fleece', 'Scuba double knit'],
    'Activewear & swim': ['Stretch mesh', 'Nylon-spandex activewear', 'Swimwear tricot', 'Four-way stretch', 'Compression powernet', 'Power mesh', 'Recycled swim jersey', 'Brushed activewear jersey', 'High-compression tricot', 'Lightweight lining tricot', 'Athletic interlock', 'Stretch scuba', 'Two-way stretch performance woven'],
    'Lining, lace & specialty': ['Bemberg lining', 'Acetate lining', 'Polyester lining', 'Stretch lining', 'Cotton pocketing', 'Chantilly lace', 'Stretch lace', 'Embroidered mesh', 'Eyelet cotton', 'Quilted cotton', 'Faux suede', 'Garment-weight faux leather'],
  };
  const extraPresets = [
    ['Cotton batiste', 65, 0.02, 0.01, 0.26],
    ['Cotton muslin', 110, 0.02, 0.01, 0.47],
    ['Double gauze', 125, 0.05, 0.03, 0.23],
    ['Cotton broadcloth', 120, 0.02, 0.01, 0.48],
    ['Cotton sateen', 175, 0.03, 0.02, 0.35],
    ['Yarn-dyed gingham', 120, 0.02, 0.01, 0.4],
    ['Brushed cotton flannel', 185, 0.04, 0.02, 0.38],
    ['Linen handkerchief weave', 115, 0.03, 0.02, 0.32],
    ['Linen-cotton shirting', 150, 0.03, 0.02, 0.39],
    ['Linen-viscose blend', 170, 0.04, 0.03, 0.24],
    ['Ramie shirting', 120, 0.02, 0.01, 0.47],
    ['Rayon twill', 170, 0.05, 0.03, 0.28],
    ['Cupro twill', 130, 0.04, 0.03, 0.22],
    ['Modal woven', 125, 0.04, 0.03, 0.21],
    ['Bull denim', 360, 0.02, 0.01, 0.67],
    ['Slub denim', 390, 0.02, 0.01, 0.63],
    ['Stretch black denim', 340, 0.18, 0.05, 0.46],
    ['Cotton duck', 375, 0.01, 0.01, 0.72],
    ['Waxed canvas', 380, 0.01, 0.01, 0.76],
    ['Cotton gabardine', 240, 0.03, 0.02, 0.55],
    ['Fine-wale corduroy', 235, 0.03, 0.02, 0.45],
    ['Wide-wale corduroy', 350, 0.03, 0.02, 0.57],
    ['Cotton drill', 285, 0.03, 0.02, 0.59],
    ['Wool melton', 510, 0.03, 0.02, 0.77],
    ['Boiled wool', 380, 0.17, 0.08, 0.64],
    ['Nylon ripstop', 85, 0.02, 0.01, 0.53],
    ['Coated rainwear nylon', 125, 0.02, 0.01, 0.62],
    ['Technical softshell', 310, 0.18, 0.1, 0.61],
    ['Wool worsted', 220, 0.04, 0.03, 0.44],
    ['Tropical wool', 185, 0.04, 0.03, 0.35],
    ['Wool flannel', 280, 0.05, 0.03, 0.42],
    ['Wool herringbone', 265, 0.04, 0.03, 0.48],
    ['Wool tweed', 340, 0.05, 0.03, 0.61],
    ['Wool gabardine', 245, 0.04, 0.03, 0.52],
    ['Wool crepe', 215, 0.06, 0.04, 0.34],
    ['Linen suiting', 240, 0.03, 0.02, 0.52],
    ['Polyester suiting', 225, 0.03, 0.02, 0.49],
    ['Stretch gabardine', 250, 0.14, 0.05, 0.5],
    ['Cotton-linen suiting', 240, 0.04, 0.02, 0.5],
    ['Silk habotai', 58, 0.02, 0.01, 0.2],
    ['Silk georgette', 62, 0.05, 0.03, 0.18],
    ['Silk crepe de chine', 82, 0.05, 0.03, 0.2],
    ['Silk twill', 95, 0.03, 0.02, 0.34],
    ['Silk faille', 155, 0.02, 0.01, 0.57],
    ['Silk taffeta', 105, 0.02, 0.01, 0.68],
    ['Silk shantung', 110, 0.02, 0.01, 0.58],
    ['Duchess satin', 235, 0.02, 0.01, 0.63],
    ['Mikado', 220, 0.02, 0.01, 0.68],
    ['Jacquard brocade', 255, 0.02, 0.01, 0.7],
    ['Viscose satin', 145, 0.04, 0.03, 0.24],
    ['Polyester chiffon', 50, 0.03, 0.02, 0.18],
    ['Soft tulle', 48, 0.12, 0.04, 0.27],
    ['Guipure lace', 190, 0.03, 0.02, 0.51],
    ['Modal jersey', 170, 0.45, 0.23, 0.19],
    ['Viscose jersey', 175, 0.48, 0.24, 0.18],
    ['Wool jersey', 180, 0.32, 0.14, 0.25],
    ['Merino jersey', 170, 0.37, 0.17, 0.24],
    ['Linen jersey', 165, 0.25, 0.13, 0.25],
    ['Bamboo-viscose jersey', 205, 0.49, 0.29, 0.18],
    ['Heavy cotton interlock', 280, 0.28, 0.12, 0.43],
    ['Intarsia sweater knit', 280, 0.35, 0.15, 0.31],
    ['Waffle knit', 240, 0.34, 0.17, 0.34],
    ['Hacci sweater knit', 175, 0.42, 0.21, 0.23],
    ['Cotton piqué knit', 210, 0.22, 0.09, 0.42],
    ['Polar fleece', 270, 0.21, 0.09, 0.41],
    ['Sherpa fleece', 340, 0.19, 0.07, 0.53],
    ['Scuba double knit', 325, 0.29, 0.19, 0.65],
    ['Compression powernet', 240, 0.34, 0.24, 0.36],
    ['Power mesh', 135, 0.42, 0.28, 0.29],
    ['Recycled swim jersey', 205, 0.52, 0.42, 0.25],
    ['Brushed activewear jersey', 245, 0.48, 0.36, 0.27],
    ['High-compression tricot', 285, 0.43, 0.31, 0.42],
    ['Lightweight lining tricot', 100, 0.44, 0.32, 0.2],
    ['Athletic interlock', 220, 0.42, 0.3, 0.34],
    ['Stretch scuba', 290, 0.38, 0.26, 0.53],
    ['Two-way stretch performance woven', 160, 0.18, 0.02, 0.4],
    ['Bemberg lining', 78, 0.03, 0.02, 0.18],
    ['Acetate lining', 85, 0.02, 0.01, 0.27],
    ['Polyester lining', 75, 0.02, 0.01, 0.28],
    ['Stretch lining', 95, 0.24, 0.11, 0.23],
    ['Cotton pocketing', 115, 0.02, 0.01, 0.41],
    ['Chantilly lace', 65, 0.08, 0.04, 0.22],
    ['Stretch lace', 115, 0.35, 0.14, 0.23],
    ['Embroidered mesh', 110, 0.09, 0.04, 0.45],
    ['Eyelet cotton', 135, 0.03, 0.02, 0.44],
    ['Quilted cotton', 290, 0.02, 0.01, 0.65],
    ['Faux suede', 225, 0.08, 0.04, 0.49],
    ['Garment-weight faux leather', 330, 0.08, 0.03, 0.6],
  ];
  for (const [name,gsm,cross,length,bend] of extraPresets) {
    fabrics[name]={gsm,cross,length,bend,power:cross>.14?1.58:1.2};
  }
  const categoryOf = name => Object.keys(materialGroups).find(category=>materialGroups[category].includes(name));
  function weave(name,category=categoryOf(name)) {
    if (/satin|charmeuse|lining|silk/i.test(name)) return 'satin';
    if (/mesh|tulle|lace/i.test(name)) return 'mesh';
    if (/knit|activewear|swim/.test((category||'').toLowerCase())) return 'knit';
    if (/denim|twill|gabardine|suiting/.test(name.toLowerCase())) return 'twill';
    return 'plain';
  }
  function squareSwatch(source,width,height) {
    const edge=Math.min(width,height);
    if (!edge) throw Error('Swatch image is not ready.');
    const canvas=document.createElement('canvas');
    canvas.width=canvas.height=320;
    const context=canvas.getContext('2d');
    context.fillStyle='#fff';
    context.fillRect(0,0,320,320);
    context.drawImage(source,(width-edge)/2,(height-edge)/2,edge,edge,0,0,320,320);
    return canvas.toDataURL('image/jpeg',.8);
  }
  const captureSwatch=video=>squareSwatch(video,video.videoWidth,video.videoHeight);
  async function readSwatch(file) {
    const url=URL.createObjectURL(file);
    try {
      const photo=new Image();
      photo.src=url;
      await photo.decode();
      return squareSwatch(photo,photo.naturalWidth,photo.naturalHeight);
    } finally { URL.revokeObjectURL(url); }
  }
  const swatches=new Map();
  function sample(photo,u,v,redraw) {
    if (!photo) return null;
    if (!swatches.has(photo)) {
      swatches.set(photo,null);
      const image=new Image();
      image.onload=()=>{
        const canvas=document.createElement('canvas');
        canvas.width=canvas.height=64;
        const context=canvas.getContext('2d',{willReadFrequently:true});
        context.drawImage(image,0,0,64,64);
        swatches.set(photo,context.getImageData(0,0,64,64).data);
        redraw?.();
      };
      image.src=photo;
    }
    const pixels=swatches.get(photo);
    if (!pixels) return null;
    const index=((Math.floor(v*64)&63)*64+(Math.floor(u*64)&63))*4;
    return [pixels[index],pixels[index+1],pixels[index+2]];
  }
  const poses = {
    stand:{name:'Standing',sit:0,arm:0,reach:0},
    sit:{name:'Sitting',sit:1,arm:.12,reach:.20},
    reach:{name:'Reach forward',sit:0,arm:.45,reach:1},
    raise:{name:'Raise arms',sit:0,arm:1,reach:0}
  };
  const clamp = (n,min,max) => Math.min(max,Math.max(min,n));
  const mix = (a,b,t) => a+(b-a)*t;
  const motions={
    walk:{name:'Walk in place',duration:1950},
    lift:{name:'Raise and lower arms',duration:3700},
    reachCycle:{name:'Reach and return',duration:3500},
    sitCycle:{name:'Sit and stand',duration:5100}
  };
  function motionAt(id,progress) {
    const phase=progress*2*Math.PI;
    const height=(1-Math.cos(phase))/2;
    const travel=Math.abs(Math.sin(phase));
    if (id==='walk') return {...poses.stand,arm:.027,reach:.06,stride:Math.sin(phase),flow:.65,phase};
    const amount=clamp((height-.07)/.86,0,1);
    const smooth=amount*amount*(3-2*amount);
    const target=poses[({lift:'raise',reachCycle:'reach',sitCycle:'sit'})[id]];
    return {sit:target.sit*smooth,arm:target.arm*smooth,reach:target.reach*smooth,phase,flow:travel};
  }
  function followThrough([x,y,z],theta,weight,pose,material) {
    if (!pose.flow || !weight) return [x,y,z];
    const gsm=material?.gsm ?? 170;
    const bend=material?.bend ?? .42;
    const softness=(1-.77*bend)/(1+gsm/440);
    const phase=pose.phase-.45-gsm*.0012;
    const wave=pose.flow*softness*weight*weight;
    const ripple=(.014+.012*Math.sin(phase*2+theta*3))*wave;
    return [x+Math.cos(theta)*ripple,y+Math.sin(phase+theta)*.016*wave,z+Math.sin(theta)*ripple+Math.sin(phase)*.025*wave];
  }
  const stretch = (needed,available) => Math.max(0,needed/Math.max(available,1)-1);
  const stretchLoad = (fabric,cross,length) => Math.hypot(
    (cross/Math.max(.001,fabric.cross))**fabric.power,(length/Math.max(.001,fabric.length))**fabric.power);

  function estimate(pattern,model,body,changes,pose,material) {
    const ease = pattern.design?.ease;
    const bodice=model==='top'||model==='dress';
    const legs=model==='trousers';
    const skirt=model==='dress'||model==='skirt';
    const c=key=>changes[key]||0;
    const around = (measure,extra,delta,demand=0) => stretch(measure*(1+demand),measure+extra+c(delta));
    const along = (length,demand,allowance) => stretch(length*(1+demand),length+allowance);
    const regions = {};
    const hangingLength = model==='dress'||model==='trousers'?1:model==='skirt'?.58:.33;
    const gravity = clamp((material.gsm-85)/420,0,1.35)*hangingLength*.009*(1-material.bend);
    const step=Math.abs(pose.stride||0);
    // Seated arm IK targets the lap. Fade the raised and reaching load
    // with that same transition instead of counting it again while seated.
    const arm=pose.arm*(1-pose.sit), reach=pose.reach*(1-pose.sit);
    const raise=Math.max(0,arm-.45*reach);
    function add(key,label,cross,length=0) {
      const load=stretchLoad(material,cross,length);
      regions[key]={label,cross,length,load,level:-Math.expm1(-.85*load)};
    }
    if (bodice) {
      const bust=body.bust||92, shoulder=body.shoulder||39;
      const upperArm=body.upperArm||bust*.32;
      const sideLength=(body.shoulderToWaist||(body.height||168)*.23)*.61;
      const armhole=c('armhole');
      const cap=changes.hasSleeves?c('sleeveCap'):0;
      const sleeveWidth=changes.hasSleeves?c('sleeveWidth'):0;
      const shoulderRoom=c('shoulder');
      add('bust','Chest / bust',around(bust,ease??5,'bust',.042*reach+.022*arm),
        along(bust*.27,.012*reach,.12+Math.max(0,c('bust'))*.15));
      add('shoulder','Shoulders / upper back',around(shoulder,1.3,'shoulder',.07*reach+.036*arm+.024*step),
        along(shoulder,.032*reach+.025*arm+.012*step,.40+.55*shoulderRoom+.24*cap));
      // A deeper armhole adds room around the opening. A higher underarm
      // lifts with the arm more easily. Both effects matter for set-in sleeves.
      const opening=upperArm+8.5;
      add('armhole','Armhole',along(opening,.035*reach+.095*arm,2.2+.7*armhole+.22*shoulderRoom+.28*sleeveWidth+.22*cap),
        along(sideLength,.056*raise+.026*reach,.52-.48*armhole+.17*shoulderRoom+.24*cap+.10*sleeveWidth));
      if (changes.hasSleeves) {
        const style=changes.sleeveStyle||pattern.design?.sleeve||'Short';
        const long=style==='Long'||style==='Bell';
        const portion=({Cap:.23,Short:.40,Elbow:.59,Puff:.48,Long:1,Bell:1})[style]||.40;
        const sleeveSpan=Math.max(10,(body.arm||(body.height||168)*.33)*portion);
        const cuffMeasure=long?body.wrist||bust*.20:style==='Elbow'?body.forearm||upperArm*.82:upperArm*.91;
        const motion=Math.min(1,arm+reach);
        const extraLength=c('sleeveLength')*motion;
        add('sleeve','Upper sleeve',around(upperArm,3.5+.33*cap,'sleeveWidth',.060*arm+.035*reach),
          along(sleeveSpan,.021*arm+.022*reach,.26+extraLength*.56+.20*cap+.10*sleeveWidth));
        add('cuff','Sleeve opening',around(cuffMeasure,3.5,'cuff',.022*arm),
          long?along(sleeveSpan,.012*raise+.020*reach,.35+extraLength*.61+.12*c('cuff')):0);
      }
    }
    add('waist','Waist',around(body.waist||74,bodice?ease??5:2.7,'waist',.045*pose.sit+.014*step),
      legs?0:skirt?gravity*(1-pose.sit):.013*pose.sit+gravity);
    if (model!=='top' || pattern.design?.length==='Low hip') {
      add('hip',skirt?'Hip / seat circumference':'Hip / seat',around(body.hip||98,ease??5,'hip',.067*pose.sit+.034*step),
        legs?0:skirt?gravity*(1-pose.sit):.045*pose.sit+.021*step+gravity);
    }
    if (skirt) {
      const hip=body.hip||98;
      const waist=body.waist||74;
      const upper=body.highHip||mix(waist,hip,.57);
      const backDepth=(body.hipDepth||hip*.235)*.52;
      const lap=Math.max(hip*.87,(body.thigh||hip*.54)*1.57);
      const bothKnees=Math.max(hip*.69,(body.knee||hip*.37)*1.65);
      const backLength=(body.waistToHip||((body.height||168)*.125))+5;
      const room=ease??5;
      const cut=pattern.design?.cut||pattern.cut||'';
      const flare=/full skirt|circle|flared/i.test(cut)?2:/a-line/i.test(cut)?1:0;
      // These are approximate geometric demands across bands, not a cloth stress solve.
      add('upperHip','Upper hip',stretch(upper*(1+.057*pose.sit+.022*step),upper+room*.57+c('upperHip')+c('hip')*.22));
      add('seat','Fullest seat depth',stretch(backDepth*(1+.24*pose.sit+.06*step),backDepth+.75+c('seatDepth')+c('hip')*.045));
      add('lap','Lap across both thighs',stretch(lap*(1+.137*pose.sit+.067*step),
        lap+room*.82+flare*3.2+c('lapEase')+c('hip')*.22+c('sweep')*.30));
      if (pattern.design?.length!=='Above knee' || c('length')>7) {
        add('skirtKnee','Skirt at the knees',stretch(bothKnees*(1+.165*pose.sit+.12*step),
          bothKnees+room*.80+flare*5.8+c('kneeEase')+c('lapEase')*.16+c('sweep')*.68));
      }
      add('sittingLength','Center-back sitting length',0,stretch(backLength*(1+.137*pose.sit+.035*step+gravity),
        backLength+.9+c('sittingLength')+c('seatDepth')*.14));
    }
    if (legs) {
      const longitudinal=(base,demand,ease)=>stretch(base+demand*pose.sit,base+ease);
      add('thigh','Upper thigh',around(body.thigh||(body.hip||98)*.54,5,'thigh',.10*pose.sit+.057*step));
      add('knee','Bent knee',around(body.knee||36,2,'knee',.09*pose.sit+.073*step),stretch(20+2.9*pose.sit+1.6*step,21+c('kneeFlex')));
      add('leg','Lower leg',around(body.calf||(body.hip||98)*.35,4,'leg',.02*pose.sit));
      add('rise','Front rise',0,longitudinal(28,2.9,1+c('rise')));
      add('backRise','Back rise / seat length',0,longitudinal(34,5.1+gravity*34,1.6+c('rise')+c('backRise')));
      add('crotch','Crotch depth',0,longitudinal(14,2.6,0.7+c('crotch')));
    }
    return regions;
  }

  function levelAt(regions,y,theta,part,progress) {
    const band=(key,center,width)=> (regions[key]?.level||0)*Math.max(0,1-Math.abs(y-center)/width);
    if (part==='sleeve' && Number.isFinite(progress)) {
      const armhole=(regions.armhole?.level||0)*Math.max(0,1-progress/.28);
      const sleeve=(regions.sleeve?.level||0)*Math.max(0,1-Math.abs(progress-.34)/.57);
      const cuff=(regions.cuff?.level||0)*Math.max(0,(progress-.57)/.43);
      return Math.max(armhole,sleeve,cuff);
    }
    if (part==='sleeve') return Math.max(band('sleeve',-.61,.47),band('cuff',-.35,.38),band('armhole',-.68,.12));
    if (part==='leg') return Math.max(band('thigh',.38,.27),band('leg',.92,.31),band('knee',.65,.21),band('crotch',.23,.17));
    const side = Math.abs(Math.cos(theta));
    const back=Math.max(0,-Math.sin(theta));
    const front=Math.max(0,Math.sin(theta));
    const upperBack = .65+.35*back;
    return Math.max(band('bust',-.48,.23),band('waist',-.25,.26),band('hip',.12,.35),
      band('upperHip',-.045,.20),band('seat',.16,.22)*back,band('lap',.40,.29)*(.42+.58*front),
      band('skirtKnee',.66,.27)*(.53+.47*front),band('sittingLength',.05,.28)*back,
      band('shoulder',-.73,.15)*upperBack,band('armhole',-.61,.2)*side,band('rise',.10,.32)*front,
      band('backRise',.09,.33)*back,band('crotch',.27,.14));
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

  function rig(pose,mapY=y=>y) {
    const hip=mapY(.22), knee=mapY(.655), ankle=mapY(1.045);
    const floor=mapY(1.128);
    const thighAngle=pose.sit*1.46;
    const shinAngle=-pose.sit*.10;
    const upper=knee-hip;
    const lower=ankle-knee;
    const kneeY=hip+upper*Math.cos(thighAngle);
    const kneeZ=upper*Math.sin(thighAngle);
    const drop=ankle-kneeY-lower*Math.cos(shinAngle);
    const ankleZ=kneeZ+lower*Math.sin(shinAngle);
    const lean=.14*pose.sit+.08*pose.reach;
    const rotate=(y,z,angle)=>[y*Math.cos(angle)-z*Math.sin(angle),y*Math.sin(angle)+z*Math.cos(angle)];
    const gait=(side)=>{
      const swing=(pose.stride||0)*side;
      const thigh=swing*.30;
      const shin=thigh-Math.max(0,-swing)*.40;
      const kneeY=hip+upper*Math.cos(thigh);
      const kneeZ=upper*Math.sin(thigh);
      const ankleY=kneeY+lower*Math.cos(shin);
      return {thigh,shin,kneeY,kneeZ,ankleZ:kneeZ+lower*Math.sin(shin),lift:ankleY-ankle+Math.max(0,-swing)*.049};
    };
    const gaitLeft=gait(-1), gaitRight=gait(1);
    function torso([x,y,z]) {
      y=mapY(y);
      const [v,w]=rotate(y-hip,z,-lean);
      const weight=clamp((hip-y)/.44,0,1);
      return [x,mix(y,v+hip,weight)+drop,mix(z,w,weight)];
    }
    function leg([x,y,z]) {
      y=mapY(y);
      if (pose.stride) {
        const step=x<0?gaitLeft:gaitRight;
        const [ay,az]=rotate(y-hip,z,step.thigh);
        const [by,bz]=rotate(y-knee,z,step.shin);
        const kneeBlend=clamp((y-knee+.12)/.24,0,1);
        const lift=clamp((y-hip)/Math.max(.1,ankle-hip),0,1);
        return [x,mix(hip+ay,step.kneeY+by,kneeBlend)-step.lift*lift,mix(az,step.kneeZ+bz,kneeBlend)];
      }
      const [a,b]=rotate(y-hip,z,thighAngle);
      const [c,d]=rotate(y-knee,z,shinAngle);
      const t=clamp((y-knee+.105)/.21,0,1);
      return [x,mix(hip+a,kneeY+c,t)+drop,mix(b,kneeZ+d,t)];
    }
    function pelvis(point,theta=0) {
      const [x,y]=point;
      const body=torso(point);
      const thigh=leg(point);
      const front=Math.max(0,Math.sin(theta));
      const inner=1-Math.min(1,Math.abs(x)/.26);
      const t=(pose.sit*(.22+.56*front+.19*inner)+Math.abs(pose.stride||0)*.54)*clamp((y-.12)/.24,0,1);
      return body.map((value,axis)=>mix(value,thigh[axis],t));
    }
    const seatY=hip+drop+.115;
    function foot([x,y,z]) {
      if (pose.stride) {
        const step=x<0?gaitLeft:gaitRight;
        const swing=pose.stride*(x<0?-1:1);
        return [x,mapY(y)-Math.max(0,-swing)*.049,z+step.ankleZ];
      }
      return [x,mapY(y),z+ankleZ];
    }
    function skirt([x,y,z],theta,material) {
      if (pose.stride && mapY(y)>hip) {
        const fall=clamp((mapY(y)-hip)/.75,0,1);
        const bend=material?.bend ?? .42;
        const weight=clamp(((material?.gsm ?? 170)-60)/600,0,.8);
        const swing=pose.stride*(1-bend*.64)*(1-weight*.5)*fall;
        const kick=Math.max(0,Math.sin(theta))*Math.abs(swing);
        return [x+swing*.049,mapY(y)-kick*.016,z+kick*.16+.035*Math.cos(theta)*swing];
      }
      if (!pose.sit || mapY(y)<=hip) return torso([x,y,z]);
      y=mapY(y);
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
      const hemLimit=floor-.023;
      const excess=Math.max(0,movingY-hemLimit);
      const movingZ=z+zOnLap+zFall+fold*.6+excess*forward*.45;
      return [x+Math.sign(x)*sideways*pose.sit,mix(y+drop,Math.min(hemLimit,movingY),pose.sit),mix(z,movingZ,pose.sit)];
    }
    return {torso,leg,pelvis,foot,skirt,seatY};
  }
  const posePoint=(point,pose,part='body')=>rig(pose)[part==='leg'?'leg':'torso'](point);

  return {fabrics,materialGroups,categoryOf,weave,readSwatch,captureSwatch,sample,poses,motions,motionAt,followThrough,resample,envelope,clearance,posePoint,rig,estimate,levelAt,tint,clamp,mix};
})();
