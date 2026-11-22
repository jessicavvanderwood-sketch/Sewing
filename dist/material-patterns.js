'use strict';

const materialPatterns = (() => {
  const positive = (value,fallback)=>Number.isFinite(value)&&value>0?value:fallback;
  const amount = (record,key)=>Number.isFinite(record?.[key])?record[key]:0;
  const roundUp=value=>Math.ceil(value*10)/10;
  const between=(a,b,t)=>a+(b-a)*Math.max(0,Math.min(1,t));
  const models=['dress','top','skirt','trousers','corset'];
  const defaultsByModel={dress:6,top:8,skirt:5,trousers:5,corset:3};

  function names(pattern,mainFabric) {
    const design=pattern?.design;
    const main=typeof mainFabric==='string'?mainFabric:mainFabric?.name;
    const base=main || pattern?.fit?.fabric?.name || design?.fabric;
    const labels={
      main:base||'Main fabric',contrast:'Contrast fabric',lining:'Lining',
      interfacing:'Interfacing',pocketing:'Pocketing'
    };
    studioDesign.layers(design).forEach((layer,index)=>{
      labels['layer:'+index]=`Layer ${index+1} · ${layer.fabric}`;
    });
    return labels;
  }

  function chosenLength(pattern,design,model) {
    const choices=studioDesign.silhouettes[model].lengths;
    if (choices.includes(design.length)) return design.length;
    const description=`${pattern?.cut||''} ${pattern?.name||''}`;
    const words=choices.find(length=>new RegExp(`\\b${length}\\b`,'i').test(description));
    if (words) return words;
    if (model==='dress'||model==='skirt') return /maxi|floor.length/i.test(description)?'Ankle':/mini|short/i.test(description)?'Above knee':'Midi';
    if (model==='top') return /crop/i.test(description)?'Cropped':'Low hip';
    return model==='trousers'?'Full length':'High hip';
  }

  function fitDimensions(pattern,design,model,body,changes) {
    const {landmarks,estimates}=sewingModels.proportions(body);
    const {shoulder,bust:bustHeight,underbust,waist,knee,ankle,crotch,thigh,hip:hipHeight,highHip}=landmarks;
    const defaults=sewingModels.starter[sewingModels.profileOf(body)];
    const style=chosenLength(pattern,design,model);
    const description=`${design.cut||pattern?.cut||''} ${pattern?.name||''}`;
    const ease=Number.isFinite(design.ease)?design.ease:defaultsByModel[model];
    const side=studioDesign.asymmetry(design);
    const extra=key=>Math.max(0,amount(side.left,key),amount(side.right,key));
    const adjusted=key=>amount(changes,key)+extra(key);
    const girth=(key,modelValue,easeValue)=>Math.max(modelValue*.8,modelValue+easeValue+adjusted(key));
    const topRoom=model==='top' && /boxy|oversized/i.test(description)?8:0;
    const bust=girth('bust',positive(body.bust,defaults.bust),ease+topRoom);
    const waistGirth=girth('waist',positive(body.waist,defaults.waist),ease+topRoom);
    const hip=girth('hip',positive(body.hip,defaults.hip),ease+topRoom);
    const shoulderSpan=positive(body.shoulder,defaults.shoulder)+adjusted('shoulder');
    const sleeveStyle=changes.sleeveStyle||design.sleeve||(pattern?.sleeves?'Long':'Sleeveless');
    const arm=estimates.arm;
    const armGirth=positive(body.upperArm,positive(body.bust,defaults.bust)*.3);
    const wrist=positive(body.wrist,armGirth*.57);
    const armOpening=Math.max(12,(['Long','Tapered','Bishop'].includes(sleeveStyle)?wrist:armGirth)+4+adjusted('cuff'));
    const sleeveLengthFraction={Cap:.22,Short:.38,Elbow:.59,Puff:.58,Flutter:.57,Long:1,Bell:1,Bishop:1,Tapered:1};
    const sleeveLength=Math.max(7,arm*(sleeveLengthFraction[sleeveStyle]||.42)+adjusted('sleeveLength'));
    const armFlare={Puff:1.43,Bell:1.62,Bishop:1.53,Flutter:1.82};
    const sleeveWidth=Math.max(armOpening,(armGirth+7)*(armFlare[sleeveStyle]||1)+adjusted('sleeveWidth')+Math.max(0,amount(changes,'sleeveCap')));
    const topWaist=waist+amount(changes,'waistHeight');
    const rise=({'Low rise':-5,'High rise':5})[design.rise]||0;
    const trouserWaist=topWaist+rise+amount(changes,'rise');
    const corsetTop=/underbust/i.test(description)?underbust:between(bustHeight,shoulder,.45);
    const topEdge=model==='corset'?corsetTop:model==='skirt'?topWaist:model==='trousers'?trouserWaist
      :studioDesign.selectedSupport(design)==='Strapless'?between(bustHeight,shoulder,.4):shoulder;
    const lowerEdge=({
      'Above knee':knee+5,Midi:between(knee,ankle,.48),Ankle:ankle,
      Cropped:model==='trousers'?between(knee,ankle,.45):waist+4,
      'High hip':highHip,'Low hip':hipHeight-2,Waist:waist,
      'Full length':Math.max(1,ankle-4),Bermuda:knee+5,Short:thigh-4
    })[style];
    const hem=Math.max(0,lowerEdge-adjusted('length'));
    const skirtDrop=Math.max(8,topWaist-hem);
    const hemShape=studioDesign.hemContour(design);
    const hemDrops=['hemFront','hemLeft','hemBack','hemRight'].map(key=>amount(hemShape,key));
    const points=studioDesign.hasFairyHem(design)?hemShape.hemDrop:0;
    const extraHem=Math.max(0,...hemDrops)+points;
    const bodyLength=Math.max(12,topEdge-hem)+extraHem+
      Math.max(0,amount(changes,'backRise'),amount(changes,'sittingLength'));
    const bodiceLength=Math.max(14,topEdge-topWaist);
    const panelWidth=Math.max(bust/2,waistGirth/2,(model==='top'&&style==='Cropped'?waistGirth:hip)/2,shoulderSpan);
    const isFull=/full skirt|circle|gathered skirt/i.test(description);
    const isCircle=/circle/i.test(description);
    const skirtEase=amount(changes,'sweep')+extra('sweep')+Math.max(0,amount(changes,'lapEase'),amount(changes,'kneeEase'));
    const sweep=isFull?Math.max(hip*1.55,waistGirth+2*Math.PI*skirtDrop*(isCircle?.83:.45))
      :/a.line/i.test(description)?hip+skirtDrop*.96:hip*1.06;
    const skirtSweep=Math.max(hip,sweep+skirtEase);
    const legShape=model==='trousers'?studioDesign.measurements(design).leg:[0,0,0];
    const thighMeasure=positive(body.thigh,positive(body.hip,defaults.hip)*.55);
    const kneeMeasure=positive(body.knee,thighMeasure*.67);
    const legMeasure=positive(body.calf,thighMeasure*.63);
    const legThigh=Math.max(thighMeasure*.85,thighMeasure+ease+adjusted('thigh')+legShape[0]*300);
    const legKnee=Math.max(kneeMeasure*.85,kneeMeasure+ease+adjusted('knee')+legShape[1]*300);
    const legEnd=Math.max(legMeasure*.82,legMeasure+ease+adjusted('leg')+legShape[2]*330);
    const legSpan=Math.max(legThigh,legKnee,legEnd,hip/2+Math.max(0,amount(changes,'crotch'))*1.6);
    return {bust,waist:waistGirth,hip,shoulderSpan,panelWidth,topEdge,topWaist,crotch,hem,bodyLength,
      bodiceLength,skirtDrop,extraHem,skirtSweep,isFull,legThigh,legEnd,legSpan,sleeveLength,sleeveWidth,sleeveStyle,armOpening};
  }

  function pieces({pattern={},model,body,changes,allowances={},plan={},material,usableWidth}={}) {
    model=pattern.design?.model || model;
    if (!models.includes(model)) return [];
    body=body||sewingModels.defaults[0];
    const edits={...pattern.design?.fitAdjustments,...pattern.fit?.changes,...changes};
    // These two names are also numerical fit deltas. Keep the garment's
    // design length and rise choices while applying the deltas separately.
    const construction={...edits};
    delete construction.length;
    delete construction.rise;
    const design={...pattern.design,...construction,model,sleeve:edits.sleeveStyle??pattern.design?.sleeve};
    const fit=fitDimensions(pattern,design,model,body,edits);
    const bodice=studioDesign.isBodice(model);
    const skirt=model==='dress'||model==='skirt';
    const trousers=model==='trousers';
    const structured=model==='corset';
    const support=studioDesign.selectedSupport(design);
    const strapless=support==='Strapless';
    const sleeves=!structured && support==='Integrated shoulders' && (edits.hasSleeves ??
      (pattern.design?studioDesign.isSleeved(design):Boolean(pattern.sleeves)));
    const continuity=studioDesign.onePiece(design);
    const seam=positive(allowances?.seam,material?.gsm>=320?1.75:1.5);
    const hem=positive(allowances?.first,1)+positive(allowances?.second,2.5);
    const neck=positive(allowances?.neck,seam);
    const armhole=positive(allowances?.armhole,seam);
    const list=[];

    function add(name,width,length,quantity=1,material='main') {
      if (width>0 && length>0 && quantity>0 && [width,length,quantity].every(Number.isFinite)) {
        list.push({name,quantity,mode:'single',width:roundUp(width),length:roundUp(length),material});
      }
    }

    const boltWidth=material=>typeof usableWidth==='number'?usableWidth:usableWidth?.[material];

    function panels(name,span,height,quantity,material='main',canSplit=false) {
      const available=boltWidth(material)-2*seam;
      if (canSplit && available>8 && span/quantity>available) {
        quantity=Math.ceil(span/available/quantity)*quantity;
      }
      add(name,span/quantity+2*seam,height+seam+hem,quantity,material);
    }

    // Gathered or joined bands estimate cross-grain sections. Repeated joins
    // include two end allowances, while garment pieces keep their grain.
    function band(name,run,depth,material='main') {
      const available=boltWidth(material)-2*seam;
      const quantity=available>8?Math.max(1,Math.ceil(run/available)):Math.max(1,Math.ceil(run/130));
      add(name,run/quantity+2*seam,depth+seam+hem,quantity,material);
    }

    function bodyGirthAt(t) {
      const down=fit.topEdge-t*fit.bodyLength;
      if (trousers) return between(fit.legThigh,fit.legEnd,t);
      if (down>fit.topWaist && model!=='skirt') {
        return Math.max(fit.waist,between(fit.bust,fit.waist,(fit.topEdge-down)/fit.bodiceLength));
      }
      if (!skirt) return between(fit.waist,fit.hip,t);
      return Math.max(between(fit.waist,fit.hip,(fit.topWaist-down)/21),
        between(fit.waist,fit.skirtSweep,(fit.topWaist-down)/fit.skirtDrop));
    }

    const details=studioDesign.stitchDetails(design);
    const trimRun=placement=>placement==='sleeves'?fit.armOpening*2:placement==='neckline'?fit.bust*.52
      :placement==='waist'||placement==='waistband'?fit.waist:trousers?fit.legEnd*2:bodyGirthAt(1);
    const tucks=details.filter(detail=>detail.style==='Pintucks');
    const tuckWidth=placement=>tucks.filter(detail=>detail.placement===placement)
      .reduce((sum,detail)=>sum+.6*Math.floor(trimRun(placement)/detail.spacing),0);
    const shellTakeUp=Math.max(...['hem','neckline','waist','waistband'].map(tuckWidth));
    const sleeveTakeUp=tuckWidth('sleeves')/2;
    const contrast=design.tone==='Contrast lower panel';

    function shell(name,span,height,count,canSplit=false) {
      if (contrast) {
        panels(name+' above the contrast join',span+shellTakeUp,height*.66,count,'main',canSplit);
        panels('Contrast lower panels',span+shellTakeUp,height*.34,count,'contrast',canSplit);
      } else panels(name,span+shellTakeUp,height,count,'main',canSplit);
    }

    if (trousers) {
      const count=continuity.legOutseam?2:4;
      shell(continuity.legOutseam?'Continuous trouser legs':'Front and back trouser leg panels',fit.legSpan*2,fit.bodyLength,count);
      const closure=studioDesign.effectiveClosure(design)||'Zip fly';
      if (/fly/i.test(closure)) {
        add('Fly facing and shield',12+2*seam,23+2*seam,2);
        add('Fly reinforcement',10,22,1,'interfacing');
      }
    } else if (structured) {
      const count=/underbust|overbust/i.test(design.cut||'')?12:8;
      const span=Math.max(fit.bust,fit.hip,fit.waist)*1.08;
      shell('Corset shell panels',span,fit.bodyLength,count);
      if (!studioDesign.layers(design).some(studioDesign.layerIsInner)) {
        panels('Corset foundation or lining panels',span,fit.bodyLength,count,'lining');
      }
    } else if (skirt) {
      const waistSeam=studioDesign.seams(design).waistSeam;
      const divided=model==='dress' && Number.isFinite(waistSeam);
      const upperLength=fit.bodiceLength+(waistSeam||0);
      if (divided) panels('Front and back bodice panels',fit.panelWidth*2+shellTakeUp,upperLength,2);
      const lowerLength=divided?fit.bodyLength-upperLength:fit.bodyLength;
      const panelCount=fit.isFull&&!continuity.panel?4:2;
      const span=model==='dress'&&!divided?Math.max(fit.panelWidth*2,fit.skirtSweep):fit.skirtSweep;
      shell(divided||model==='skirt'?'Skirt panels':'Continuous dress panels',span,lowerLength,panelCount,!continuity.panel);
    } else {
      shell('Front and back top panels',fit.panelWidth*2,fit.bodyLength,2);
    }

    if (sleeves) {
      add('Sleeves',fit.sleeveWidth+sleeveTakeUp+2*seam,fit.sleeveLength+4+armhole+hem,2);
      if (fit.sleeveStyle==='Bishop' || /cuff|button.front shirt/i.test(pattern.cut||'')) {
        add('Cuffs',fit.armOpening+2*seam,10+2*seam,2);
        add('Cuff interfacing',fit.armOpening,5,2,'interfacing');
      }
    }
    if (bodice) {
      const fastener=typeof garmentFasteners==='undefined'?null:garmentFasteners.saved(design);
      const shape=studioDesign.keyholes(design);
      const facingDrop=Math.max(11,...Object.values(shape).map(hole=>hole.offset+hole.depth+4),
        10+Math.max(0,amount(edits,'neckDepth'),amount(edits,'backNeck')));
      const facingWidth=Math.max(16,Math.min(fit.panelWidth,fit.shoulderSpan+2));
      add('Upper-edge facings',facingWidth+2*neck,facingDrop+2*neck,2);
      add('Facing reinforcement',facingWidth,facingDrop,2,'interfacing');
      if (studioDesign.supportsStrapShape(support)) {
        const strapWidth=positive(plan?.strapWidth,positive(design.strapWidth,studioDesign.supportWidth(support)));
        const strapLength=positive(plan?.strapLength,fit.bust*.31);
        const cutCount=support==='One-shoulder'?1:2;
        add('Strap blanks',strapWidth*2+2*seam,strapLength+2*seam,cutCount);
      }
      if (strapless && !structured && studioDesign.selectedStraplessSupport(design)==='Structured bodice' &&
          !studioDesign.layers(design).some(studioDesign.layerIsInner)) {
        panels('Strapless foundation or lining panels',fit.bust,fit.bodiceLength,2,'lining');
      }
      if (fastener?.kind==='ties') add('Wrap ties',fastener.width*2+2*seam,fastener.length+2*seam,2);
    }
    if (trousers || model==='skirt') {
      const closure=studioDesign.effectiveClosure(design);
      const casing=closure==='Elastic waistband'||closure==='Drawstring waistband';
      const bandLength=(casing?Math.max(fit.waist,fit.hip):fit.waist)+7;
      const depth=positive(plan?.casingWidth,4);
      add(casing?'Waist casing':'Waistband',depth*2+2*seam,bandLength+2*seam);
      if (!casing) add('Waistband interfacing',depth,bandLength,1,'interfacing');
    }
    if (design.finish==='Contrast hem band') {
      band('Contrast hem band',trousers?fit.legEnd*2:skirt?fit.skirtSweep:fit.hip,8,'contrast');
    }

    const authored=Array.isArray(design.pocketDetails);
    let pockets=studioDesign.pocketDetails(design);
    if (!authored && plan?.pocket==='omit') pockets=[];
    else if (!authored && (plan?.pocket==='patch'||plan?.pocket==='inseam'||(!pockets.length&&!pattern.design&&trousers))) {
      const type=plan?.pocket==='patch'?'patch':'inseam';
      const pocket={type,width:positive(plan?.pocketWidth,15),depth:positive(plan?.pocketHeight,20)};
      pockets=[pocket,pocket];
    }
    pockets.forEach((pocket,index)=>{
      const lining=pocket.type==='inseam';
      const width=positive(!authored&&plan?.pocketWidth,pocket.width);
      const depth=positive(!authored&&plan?.pocketHeight,pocket.depth);
      add(`Pocket ${index+1} ${lining?'bag':'patch'}`,width+2*seam,depth+seam+(lining?seam:hem),
        lining?2:1,lining?'pocketing':'main');
    });

    const layerBaseDrop=trousers?Math.max(8,fit.crotch-fit.hem):skirt?fit.skirtDrop:fit.bodyLength;
    studioDesign.layers(design).forEach((layer,index)=>{
      const material='layer:'+index;
      const paired=trousers?2:1;
      const height=layer.attachment/100;
      const sideDrop=layerBaseDrop*Math.max(0,1-Math.min(height,height+layer.leftAttachment/100,height+layer.rightAttachment/100));
      const hemOffset=studioDesign.hemContour(Object.hasOwn(layer,'hemStyle')?layer:design);
      const tips=studioDesign.hasFairyHem(Object.hasOwn(layer,'hemStyle')?layer:design)?hemOffset.hemDrop:0;
      const shaping=tips+Math.max(0,hemOffset.hemFront,hemOffset.hemLeft,hemOffset.hemBack,hemOffset.hemRight);
      const extraSweep=Math.max(0,layer.sweep,layer.sweep+layer.leftSweep,layer.sweep+layer.rightSweep);
      const baseGirth=bodyGirthAt(height);
      const bottomGirth=studioDesign.layerIsInner(layer)&&skirt?Math.max(fit.hip,fit.skirtSweep*.72):bodyGirthAt(1);
      if (layer.kind==='Ruffle') band(`Layer ${index+1} ruffle strips`,baseGirth*paired+extraSweep,layer.depth+shaping,material);
      else panels(`Layer ${index+1} ${layer.kind.toLowerCase()} panels`,
        Math.max(baseGirth,bottomGirth)*paired+extraSweep,Math.max(4,sideDrop+layer.hemOffset+shaping),2*paired,material,true);
    });
    studioDesign.attachmentSeams(design).forEach((item,index)=>{
      if (item.ruffle) band(`Attachment ruffle ${index+1} strips`,bodyGirthAt(item.height/100)*item.ruffle.fullness,item.ruffle.depth);
    });
    for (const [index,detail] of details.entries()) {
      if (detail.style==='Pintucks') continue;
      band(`Detail ${index+1} ${detail.style.toLowerCase()} strips`,trimRun(detail.placement)*(detail.fullness||2),detail.depth);
    }
    for (const {slit,index} of studioDesign.activeSlitEntries(design)) {
      if (slit.finish==='Bound placket') {
        add(`Slit ${index+1} binding`,4+2*seam,2*slit.length+4,1);
      } else {
        add(`Slit ${index+1} facing`,Math.max(6,slit.opening+5)+2*seam,slit.length+4+2*seam,1);
      }
    }
    return list;
  }

  return {pieces,names};
})();
