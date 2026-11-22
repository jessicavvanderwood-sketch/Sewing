'use strict';

const studioDesign = (() => {
  const silhouettes = {
    dress:{label:'Dress',type:'Dresses',cuts:['Column','A-line','Full skirt'],lengths:['Above knee','Midi','Ankle']},
    top:{label:'Shirt / top',type:'Tops',cuts:['Fitted','Straight','Boxy'],lengths:['Cropped','High hip','Low hip']},
    skirt:{label:'Skirt',type:'Skirts',cuts:['Straight','A-line','Full skirt'],lengths:['Above knee','Midi','Ankle']},
    trousers:{label:'Pants',type:'Trousers',cuts:['Tapered','Straight','Wide leg','Bootcut','Flared','Palazzo','Barrel leg','Jogger'],lengths:['Cropped','Ankle','Full length','Bermuda','Short']},
    corset:{label:'Corset / structured bodice',type:'Tops',cuts:['Underbust','Overbust','Corset-style bodice'],lengths:['Waist','High hip','Low hip']}
  };
  const necklines = ['Crew','Scoop','V-neck','Boat','Square','Sweetheart','U-neck','Mock neck'];
  const sleeves = ['Sleeveless','Cap','Short','Elbow','Long','Puff','Bell','Flutter','Bishop','Tapered'];
  const fabrics = ['Cotton poplin','Linen blend','Medium-weight twill','Fluid woven crepe'];
  const closures = ['Invisible zipper','Back button and loop','Front buttons','Elastic waistband','Side zipper','Zip fly',
    'Button fly','Wrap ties','Separating zipper','Back lacing','Front busk'];
  const backs = ['Classic back','Low scoop back','V-back','Square back','Racerback','Open back'];
  const supports = ['Integrated shoulders','Wide straps','Narrow straps','Spaghetti straps','Halter strap','One-shoulder','Strapless'];
  const strapShapeLimits = {strapFrontCurve:[-5,5],strapBackCurve:[-5,5],strapFrontTaper:[25,250],strapBackTaper:[25,250],
    strapFrontJoin:[0,6],strapBackJoin:[0,6],strapFrontAngle:[-35,35],strapBackAngle:[-35,35]};
  const strapShapeDefaults = {strapFrontCurve:0,strapBackCurve:0,strapFrontTaper:100,strapBackTaper:100,
    strapFrontJoin:0,strapBackJoin:0,strapFrontAngle:0,strapBackAngle:0};
  const strapShapeChoices = {
    Straight:{...strapShapeDefaults},
    'Curved into neckline':{...strapShapeDefaults,strapFrontCurve:2.5,strapBackCurve:1.5},
    Tapered:{...strapShapeDefaults,strapFrontTaper:60,strapBackTaper:75},
    'Flared at neckline':{...strapShapeDefaults,strapFrontTaper:145,strapBackTaper:125}
  };
  const rises = ['Low rise','Natural rise','High rise'];
  const pockets = ['None','Patch pockets','In-seam pockets'];
  const finishes = ['Double-fold hem','Faced hem','Contrast hem band'];
  const laceStyles = ['Scalloped lace','Eyelet lace','Stretch lace'];
  const laceWidthLimits = [.5,8];
  const laceDefaults = {style:laceStyles[0],width:2,color:'#f1e6da'};
  const hemStyles = ['Level','Fairy / handkerchief'];
  const hemContourLimits = {hemDrop:[2,35],hemPointCount:[3,10],hemRotation:[-180,180],
    hemFront:[-35,35],hemLeft:[-35,35],hemBack:[-35,35],hemRight:[-35,35]};
  const hemDefaults = {hemDrop:10,hemPointCount:4,hemRotation:0,hemFront:0,hemLeft:0,hemBack:0,hemRight:0};
  const hemQuarters = ['hemLeft','hemFront','hemRight','hemBack'];
  const tones = ['Solid','Contrast lower panel'];
  const skirtLayerKinds = ['Overskirt','Underskirt','Tier','Ruffle'];
  const garmentLayerKinds = ['Overlay','Lining','Tier','Ruffle'];
  const layerKinds = [...new Set([...skirtLayerKinds,...garmentLayerKinds])];
  const layerCounterparts = {Overskirt:'Overlay',Underskirt:'Lining',Overlay:'Overskirt',Lining:'Underskirt'};
  const maxLayers = 5;
  const layerLimits = {hemOffset:[-65,65],sweep:[0,240],opacity:[20,100],attachment:[-25,85],depth:[3,50],
    leftSweep:[-120,120],rightSweep:[-120,120],leftAttachment:[-40,40],rightAttachment:[-40,40],...hemContourLimits};
  const lowerAttachmentLimits=[0,85];
  const layerAttachmentLimits=(model='dress')=>model==='dress'?layerLimits.attachment:lowerAttachmentLimits;
  const layerDefaults = {
    Overskirt:{hemOffset:6,sweep:32,opacity:65,attachment:0},
    Underskirt:{hemOffset:-6,sweep:0,opacity:100,attachment:0},
    Overlay:{hemOffset:0,sweep:20,opacity:65,attachment:0},
    Lining:{hemOffset:-2,sweep:0,opacity:100,attachment:0},
    Tier:{hemOffset:0,sweep:36,opacity:100,attachment:60},
    Ruffle:{depth:14,sweep:70,opacity:100,attachment:60}
  };
  const seamLimits = {waistSeam:[-12,16],panelSeam:[-12,12]};
  const centerFrontSeam='centerFront';
  const panelAngleLimits=[-180,180];
  const panelZipperLimits=[8,70];
  const panelZipperDefault=22;
  const panelZipperKinds=['Invisible zipper','Standard zipper'];
  const panelZipperEligible=angle=>Number.isFinite(angle) && Math.abs(angle)<=180;
  const seamsByType = {dress:['waistSeam','panelSeam'],skirt:['panelSeam'],top:['panelSeam']};
  const seamKeys = model=>Object.hasOwn(seamsByType,model)?seamsByType[model]:[];
  const bounded = (value,[min,max])=>Math.min(max,Math.max(min,value));
  const numeric = (source,key,fallback,limits)=>Number.isFinite(source?.[key])?bounded(source[key],limits):fallback;
  const asymmetryLimits = {shoulder:[-6,6],armhole:[-4,4],neckDepth:[-16,16],bust:[-12,12],waist:[-12,12],hip:[-12,12],
    sleeveWidth:[-8,8],sleeveLength:[-12,12],cuff:[-8,8],sweep:[-30,30],thigh:[-18,18],knee:[-16,16],leg:[-12,12],
    length:[-15,15],panelSeam:[-12,12]};
  const panelStart=(model,y)=>.42+(model==='skirt'?0:Math.max(0,1-Math.abs(y+.71)/.36)*.2);
  const panelMinimum=.095;
  const usableHalfWidth=cm=>Math.max(.035/(2.368/168),cm);

  const baseModel = model=>model==='corset'?'top':model;
  const isBodice = model => baseModel(model)==='top'||model==='dress';
  const closuresByType = {
    dress:['Invisible zipper','Side zipper','Back button and loop','Front buttons','Wrap ties'],
    top:['Invisible zipper','Back button and loop','Front buttons','Separating zipper','Wrap ties'],
    skirt:['Invisible zipper','Side zipper','Elastic waistband','Front buttons','Wrap ties'],
    trousers:['Zip fly','Button fly','Side zipper','Elastic waistband','Invisible zipper'],
    corset:['Back lacing','Front busk','Separating zipper']
  };
  const closureChoices = model=>closuresByType[model];
  const supportChoices = model=>model==='corset'?supports.slice(1):supports;
  const selectedSupport = design=>design.support || (design.model==='corset'?'Strapless':supports[0]);
  const supportsStrapShape = support=>supports.includes(support) && support!=='Integrated shoulders' && support!=='Strapless';
  const strapShape = design=>Object.fromEntries(Object.entries(strapShapeLimits).map(([key,limits])=>{
    const collar=design?.support==='Halter strap' && (key==='strapBackJoin'||key==='strapBackAngle');
    return [key,collar?0:numeric(design,key,strapShapeDefaults[key],limits)];
  }));
  function straplessSupportChoices(model='dress') {
    if (model==='corset') return ['Structured bodice'];
    return isBodice(model)?['Elastic top edge','Structured bodice']:[];
  }
  function selectedStraplessSupport(design) {
    const choices=straplessSupportChoices(design?.model);
    const chosen=design?.straplessSupport;
    return choices.includes(chosen)?chosen:choices[0];
  }
  const selectedShoulderSide = design=>design?.shoulderSide==='right'?'right':'left';
  const supportWidth = style=>({'Integrated shoulders':6.5,'Wide straps':4.5,'Narrow straps':2.2,'Spaghetti straps':.8,'Halter strap':2.5,'One-shoulder':4.5})[style];
  const selectedBack = design=>design.back || backs[0];
  const pocketChoices = model => model==='corset' ? pockets.slice(0,1) : model==='top' ? pockets.slice(0,2) : pockets;
  const isContrast = design => design.finish===finishes[2] || design.tone===tones[1];
  const isSleeved = design => isBodice(design.model) && design.model!=='corset' && selectedSupport(design)===supports[0] && design.sleeve!==sleeves[0];
  const hasSkirt = model=>model==='dress'||model==='skirt';
  function layerKindChoices(model='dress') {
    if (!Object.hasOwn(silhouettes,model)) return [];
    return hasSkirt(model)?skirtLayerKinds:garmentLayerKinds;
  }
  const layerStartsAt = (model='dress')=>hasSkirt(model)?'Waist':model==='trousers'?'Upper leg':'Upper edge';
  const layerIsInner = layer=>['Underskirt','Lining'].includes(typeof layer==='string'?layer:layer?.kind);

  const newLaceTrim = ()=>({...laceDefaults});
  function laceTrim(value) {
    if (!laceStyles.includes(value?.style)) return null;
    const color=typeof value.color==='string' && /^#[0-9a-f]{6}$/i.test(value.color)?value.color.toLowerCase():laceDefaults.color;
    return {style:value.style,width:numeric(value,'width',laceDefaults.width,laceWidthLimits),color};
  }

  function lacePlacements(design) {
    const model=design?.model;
    if (!Object.hasOwn(silhouettes,model)) return {};
    const placements={};
    if (isBodice(model)) placements.neckline='Neckline';
    if (isSleeved(design)) placements.sleeves='Sleeve openings';
    placements.hem=model==='trousers'?'Leg hems':'Hem';
    return placements;
  }

  function laceTrims(design) {
    return Object.fromEntries(Object.keys(lacePlacements(design)).flatMap(key=>{
      const trim=laceTrim(design.laceTrims?.[key]);
      return trim?[[key,trim]]:[];
    }));
  }

  const hasFairyHem = source => source?.hemStyle===hemStyles[1] && (!source.model || hasSkirt(source.model));
  const hemValue = (source,key)=>numeric(source,key,hemDefaults[key],hemContourLimits[key]);
  const hemDrop = source=>hemValue(source,'hemDrop');
  const pointCount=source=>Math.round(hemValue(source,'hemPointCount'));

  function hemContour(source) {
    const values=Object.fromEntries(Object.keys(hemDefaults).map(key=>[key,hemValue(source,key)]));
    values.hemPointCount=pointCount(source);
    return {hemStyle:hasFairyHem(source)?hemStyles[1]:hemStyles[0],...values};
  }

  function hemOffsetAt(source,theta) {
    if (!Number.isFinite(theta)) return 0;
    const turn=2*Math.PI;
    const quarter=((theta%turn+turn)%turn)/(turn/4);
    const whole=Math.floor(quarter), index=whole%4, fraction=quarter-whole;
    const weight=fraction*fraction*(3-2*fraction);
    const start=hemValue(source,hemQuarters[index]), end=hemValue(source,hemQuarters[(index+1)%4]);
    const asymmetryOffset=start+(end-start)*weight;
    if (!hasFairyHem(source)) return asymmetryOffset;
    // Repeating the square's diagonal profile keeps the original four-point
    // shape while adding more points. Positive rotation turns toward the left.
    const phase=(theta-Math.PI/2+hemValue(source,'hemRotation')*Math.PI/180)*pointCount(source)/4;
    const corner=(1/Math.max(Math.abs(Math.cos(phase)),Math.abs(Math.sin(phase)))-1)/(Math.SQRT2-1);
    return asymmetryOffset+hemDrop(source)*(corner-.5);
  }

  function layerShape(kind) {
    return {kind,fabric:fabrics[0],color:'#783e60',leftSweep:0,rightSweep:0,leftAttachment:0,rightAttachment:0,...layerDefaults[kind]};
  }

  function selectedLayerKind(kind,choices) {
    if (choices.includes(kind)) return kind;
    const equivalent=layerCounterparts[kind];
    return choices.includes(equivalent)?equivalent:choices[0];
  }

  function newLayer(kind,model='dress') {
    const choices=layerKindChoices(model);
    const selected=selectedLayerKind(kind,choices.length?choices:skirtLayerKinds);
    return {...layerShape(selected),...hemContour()};
  }

  function layers(design) {
    if (!Array.isArray(design?.layers)) return [];
    const choices=layerKindChoices(design.model??null);
    if (!choices.length) return [];
    return design.layers.filter(layer=>layerKinds.includes(layer?.kind)).slice(0,maxLayers).map(layer=>{
      const clean=layerShape(layer.kind);
      clean.kind=selectedLayerKind(layer.kind,choices);
      if (typeof layer.fabric==='string' && layer.fabric.trim()) clean.fabric=layer.fabric.trim();
      if (typeof layer.color==='string' && /^#[0-9a-f]{6}$/i.test(layer.color)) clean.color=layer.color.toLowerCase();
      for (const [key,limits] of Object.entries(layerLimits)) {
        if (Object.hasOwn(clean,key) && Number.isFinite(layer[key])) {
          const value=bounded(layer[key],key==='attachment'?layerAttachmentLimits(design.model):limits);
          clean[key]=key==='opacity'||key==='attachment'?Math.round(value):value;
        }
      }
      // Layers saved before contour editing inherit the main garment hem.
      if (Object.hasOwn(layer,'hemStyle') || Object.keys(hemDefaults).some(key=>Number.isFinite(layer[key]))) {
        Object.assign(clean,hemContour(layer));
      }
      const trim=laceTrim(layer.laceTrim);
      if (trim) clean.laceTrim=trim;
      return clean;
    });
  }

  function layerSideOffset(layer,theta,left,right) {
    const across=Math.cos(theta);
    const key=across>=0?left:right;
    return Number.isFinite(across)?across**2*numeric(layer,key,0,layerLimits[key]):0;
  }

  function layerSweepAt(layer,theta) {
    const sweep=numeric(layer,'sweep',layerDefaults[layer?.kind]?.sweep??0,layerLimits.sweep);
    return bounded(sweep+layerSideOffset(layer,theta,'leftSweep','rightSweep'),layerLimits.sweep);
  }

  function layerAttachmentAt(layer,theta,model='dress') {
    const limits=layerAttachmentLimits(model);
    const attachment=numeric(layer,'attachment',layerDefaults[layer?.kind]?.attachment??0,limits);
    return bounded(attachment+layerSideOffset(layer,theta,'leftAttachment','rightAttachment'),limits);
  }

  function asymmetryKeys(design) {
    const model=design?.model;
    if (!Object.hasOwn(silhouettes,model)) return [];
    const keys=['waist','hip','length'];
    if (model==='trousers') return [...keys,'thigh','knee','leg'];
    keys.push('sweep');
    if (isBodice(model)) {
      keys.push('bust','neckDepth');
      if (selectedSupport(design)!=='Strapless') keys.push('shoulder','armhole');
      if (isSleeved(design)) keys.push('sleeveWidth','sleeveLength','cuff');
    }
    if (seamKeys(model).includes('panelSeam') && Number.isFinite(design.seams?.panelSeam)) keys.push('panelSeam');
    return keys;
  }

  function asymmetry(design) {
    const keys=asymmetryKeys(design);
    return Object.fromEntries(['left','right'].map(side=>[side,Object.fromEntries(keys.flatMap(key=>{
      const value=numeric(design.asymmetry?.[side],key,0,asymmetryLimits[key]);
      return value?[[key,value]]:[];
    }))]));
  }

  function seams(design) {
    const placement=Object.fromEntries(seamKeys(design?.model).flatMap(key=>{
      const value=design.seams?.[key];
      if (key==='panelSeam' && value===centerFrontSeam) return [[key,value]];
      return Number.isFinite(value)?[[key,bounded(value,seamLimits[key])]]:[];
    }));
    if (placement.panelSeam===centerFrontSeam) {
      placement.panelAngle=singleSeamAngle(design);
      if (Number.isFinite(design.seams.panelZipper)) {
        placement.panelZipper=bounded(design.seams.panelZipper,panelZipperLimits);
        placement.panelZipperKind=panelZipperStyle(design);
      }
    }
    return placement;
  }

  function panelSeamSnapOffset(model,y,halfWidthCm) {
    const offset=(panelMinimum-panelStart(model,y))*usableHalfWidth(halfWidthCm);
    return bounded(Math.floor(offset*2)/2,seamLimits.panelSeam);
  }

  function panelSeamPaths(model,placement,rows,angle=0) {
    if (placement===centerFrontSeam) return [rows.map(()=>Math.PI/2-angle*Math.PI/180)];
    const positions=rows.map(([y,halfWidthCm])=>
      bounded(panelStart(model,y)+(placement||0)/usableHalfWidth(halfWidthCm),[panelMinimum,.94]));
    return [-1,1].map(side=>positions.map(position=>Math.acos(side*position)));
  }

  function singleSeamAngle(design) {
    const value=design?.seams?.panelAngle;
    return Number.isFinite(value)?bounded(value,panelAngleLimits):0;
  }

  function singleSeamLocation(angle) {
    const degrees=Math.abs(angle);
    if (!degrees) return 'center front';
    if (degrees===180) return 'center back';
    const side=angle>0?'left':'right';
    return 'wearer’s '+side+' '+(degrees===90?'side':degrees<90?'front':'back');
  }

  function singleSeamGuide(design) {
    if (Number.isFinite(seams(design).panelZipper)) return false;
    const angle=Math.abs(singleSeamAngle(design));
    const closure=design?.closure;
    if (angle===0) return ['Front buttons','Wrap ties','Separating zipper'].includes(closure);
    if (angle===180) return ['Invisible zipper','Back button and loop','Back lacing'].includes(closure);
    return angle===90 && closure==='Side zipper';
  }

  const panelZipperStyle=design=>panelZipperKinds.includes(design?.seams?.panelZipperKind)?design.seams.panelZipperKind:panelZipperKinds[0];
  const effectiveClosure=design=>Number.isFinite(seams(design).panelZipper)?panelZipperStyle(design):design?.closure;

  function defaults(model='dress') {
    const spec = silhouettes[model];
    const corset=model==='corset';
    return {model,cut:spec.cuts[1],length:spec.lengths[1],neckline:corset?'Sweetheart':necklines[1],sleeve:corset?sleeves[0]:'Short',
      fabric:model==='trousers'||corset?fabrics[2]:fabrics[0],closure:closureChoices(model)[0],
      support:corset?'Strapless':supports[0],back:backs[0],rise:rises[1],
      pocket:pockets[0],finish:corset?'Faced hem':finishes[0],...hemContour(),
      tone:tones[0],primary:'#783e60',accent:'#d3a98d',ease:4,layers:[]};
  }

  const pantShape = {
    Tapered:[-.004,-.02,-.027],Straight:[0,0,0],'Wide leg':[.01,.025,.045],Bootcut:[-.006,-.014,.035],
    Flared:[-.008,-.018,.067],Palazzo:[.026,.046,.085],'Barrel leg':[.013,.039,-.018],Jogger:[.008,.006,-.035]
  };
  function measurements(design) {
    const spec = silhouettes[design.model];
    const lower = ({Bermuda:-1.55,Short:-2.38})[design.length] ?? spec.lengths.indexOf(design.length)-1;
    const volume = design.model==='trousers'||design.model==='corset'?0:spec.cuts.indexOf(design.cut)-1;
    return {lower,volume,leg:pantShape[design.cut] || pantShape.Straight,rise:({'Low rise':-4,'High rise':5})[design.rise]||0};
  }

  function seamInstructions(design) {
    const {waistSeam,panelSeam,panelAngle,panelZipper}=seams(design);
    const steps=[];
    if (waistSeam!==undefined) {
      const distance=Number(Math.abs(waistSeam).toFixed(3));
      const placement=distance?`${distance} cm ${waistSeam<0?'above':'below'} the pattern waistline`:'at the original pattern waistline';
      steps.push({visual:'designWaistSeam',text:`Mark the dress waist seam ${placement}. Use the pattern waist as your reference on the fitted sample. Mark the shift at center front, both sides and center back, then join the points smoothly. Trace the new seam onto the bodice and skirt. Match center and side notches, compare the front seam lengths and back seam lengths separately, then add the required allowance to both joining edges. Baste the bodice to the skirt at those seam lines and check balance before stitching.`});
    }
    if (panelSeam===centerFrontSeam) {
      const location=singleSeamLocation(panelAngle);
      const front=panelAngle===0;
      const guide=singleSeamGuide(design);
      const visual=front?(guide?'designCenterFrontGuide':'designCenterFrontSeam'):(guide?'designSinglePanelGuide':'designSinglePanelSeam');
      const mark=`Mark one line at ${location} (${panelAngle}°) on the fitted sample and transfer it to the pattern.`;
      const opening=Number.isFinite(panelZipper)
        ?` Reserve the first ${panelZipper} cm along the seam from the finished upper edge for the zipper opening. Baste only below that mark during fitting.`
        :' Mark any closure opening and keep it free.';
      const text=guide
        ?`${mark} Use this line to align the selected closure. Follow the pattern's separate opening or overlap marks, match notches, and baste to check alignment. Stitch only the portions the closure construction calls for.`
        :`${mark} Trace the two joining edges separately so each has its own seam allowance. Match notches and check that the seam lines are the same length. Keep the grainlines and shaping from the fitted pattern.${opening} Keep the right sides together while basting, then check the fit before stitching and pressing.`;
      steps.push({visual,text});
    } else if (panelSeam!==undefined) {
      const distance=Number(Math.abs(panelSeam).toFixed(3));
      const placement=distance?`${distance} cm ${panelSeam<0?'toward center front':'toward each side seam'}`:'at the starting panel marks';
      steps.push({visual:'designPanelSeam',text:`Place the front panel seams ${placement}${distance?' from their starting pattern marks':''}. On the fitted sample, use the existing seams or mark starter lines between the center and sides. Measure the shift across the front at several levels, then apply any separate left and right adjustments. Trace each new line onto both joining panels, preserving any dart shaping in the fitted block. Walk the seam lines from matching notch to matching notch, smooth their ends, then add the seam allowance to both edges. Baste the panels and check the planned left and right placement before stitching.`});
    }
    return steps;
  }

  function hemDraft(source) {
    const shape=hemContour(source);
    const rotation=shape.hemRotation;
    const fairy=shape.hemStyle===hemStyles[1];
    const shifts=['Front','Left','Back','Right'].flatMap(side=>{
      const value=shape['hem'+side];
      return value?[`${side.toLowerCase()} ${Math.abs(value)} cm ${value<0?'higher':'lower'}`]:[];
    });
    const points=fairy?`Mark ${shape.hemPointCount} low points at even angles around the hem${rotation?`. Rotate the point layout ${Math.abs(rotation)}° toward the wearer’s ${rotation>0?'left':'right'} starting from the default positions`:' using the starting layout'}. Check the ${shape.hemDrop} cm high-to-low drop against the unshifted shape.`:'';
    const quarters=shifts.length?` From that shape, mark the position changes on the fitted sample (${shifts.join(', ')}). Blend smoothly between the marks and transfer the full edge to paper.`:'';
    return {text:(points+quarters).trim(),fairy};
  }

  function sideFitInstructions(design) {
    const sides=asymmetry(design);
    const directions={shoulder:['narrower','wider'],armhole:['higher','lower'],neckDepth:['higher','lower'],
      sleeveLength:['shorter','longer'],length:['shorter','longer'],panelSeam:['toward center front','toward the side']};
    return asymmetryKeys(design).flatMap(key=>{
      const left=sides.left[key]||0,right=sides.right[key]||0;
      if (!left && !right) return [];
      const name=key==='panelSeam'?'Front panel seam':garmentFit.fields[key][0];
      const [minus,plus]=directions[key]||['narrower','wider'];
      const setting=value=>value?`${Math.abs(value)} cm ${value<0?minus:plus}`:'use the base fit';
      const local={
        shoulder:'Measure from that side’s shoulder point and keep the shoulder end at the neckline fixed.',
        armhole:'Mark the vertical change at that side’s underarm. Walk the corresponding sleeve cap if the garment has a sleeve.',
        neckDepth:'Measure the vertical change on that half of the neckline. Blend the edge into the opposite half and trace a matching facing or binding.',
        panelSeam:'Measure from the front panel line at matching levels and walk the adjoining stitch lines.',
        length:'Measure vertically from that side’s starting finished hem and mark it on the wearer.',
        sleeveLength:'Measure down the marked outside line of that sleeve from its current finished edge.'
      }[key];
      const position=local || (['bust','waist','hip','sweep'].includes(key)
        ?'Measure this change across that half of the garment and distribute it across its matching panel edges.'
        :'Measure around just that sleeve or leg at the named position. Distribute the listed circumference change across the adjoining edges of that piece.');
      const layout=left===right?'Transfer the tested shape and label both sides.':'Trace full paper pieces for the affected sides, label them from the wearer’s perspective, and cut each in a single layer.';
      return [{visual:'asymmetricFit',text:`${name}. From the fitted base, wearer’s left ${setting(left)} and wearer’s right ${setting(right)}. ${position} Mark the reference and new line separately on each side of the sample. Check coverage and movement, true the adjoining seam lines and transfer matching notches. ${layout}`}];
    });
  }

  function layerInstructions(design) {
    const steps={draft:[],cut:[],assemble:[],hem:[]};
    const closure=effectiveClosure(design);
    const startsAt=layerStartsAt(design.model).toLowerCase();
    const paired=design.model==='trousers';
    const referenceLine=startsAt==='waist'?'waistline':startsAt==='upper leg'?'upper-leg reference':'upper-edge reference';
    const referencePoints=paired?'the front, back, inseam and outseam of each leg':'center front, center back and both sides';
    layers(design).forEach((layer,index)=>{
      const number=index+1;
      const name=`Layer ${number} · ${layer.kind}`;
      const add=(phase,visual,text)=>steps[phase].push({visual,text:`${name}. ${text}`});
      const ruffle=layer.kind==='Ruffle';
      const inside=layerIsInner(layer);
      const where=`at the marked attachment line on the ${inside?'inside':'outside'} of the main garment`;
      const offset=Number(Math.abs(layer.hemOffset??0).toFixed(3));
      const drop=ruffle?Number(layer.depth.toFixed(3)):0;
      const contour=hemDraft(Object.hasOwn(layer,'hemStyle')?layer:design);
      const hem=ruffle?`${drop} cm below its attachment line`:offset
        ?`${offset} cm ${layer.hemOffset<0?'above':'below'} the main hem’s base line`:'level with the main hem’s base line';
      const sweep=Number(layer.sweep.toFixed(3));
      const positionAt=angle=>Number(layerAttachmentAt(layer,angle,design.model).toFixed(3));
      const placement=positionAt(Math.PI/2);
      const sidePositions=['left','right'].map(side=>[side,positionAt(side==='left'?0:Math.PI)]);
      const fromReference=value=>value?`${Math.abs(value)}% of that distance ${value<0?'above':'below'} the ${referenceLine}`:`at the ${referenceLine}`;
      const attachmentSides=sidePositions.some(([,value])=>value!==placement)?sidePositions.map(([side,value])=>`wearer’s ${side}${paired?' leg':''} ${fromReference(value)}`):[];
      const fullnessSides=['left','right'].flatMap(side=>{
        const delta=(layerSweepAt(layer,side==='left'?0:Math.PI)-sweep)/(paired?2:1);
        return Math.abs(delta)>.001?[`wearer’s ${side}${paired?' leg':''} ${Number(Math.abs(delta).toFixed(3))} cm ${delta>0?'more':'less'}`]:[];
      });
      const distance=paired?'from the top of each leg just below the crotch junction to that leg’s main hem base line'
        :startsAt==='waist'?'from the center-front waistline down to the main hem’s base line'
          :'from the local finished upper edge down to the main hem’s base line at center front, center back and each side';
      const reference=placement||attachmentSides.length
        ?`On the fitted garment, measure straight ${distance}. ${paired && attachmentSides.length?`Calculate the two attachment positions separately (${attachmentSides.join(', ')}). Transfer each position around its own leg.`:`Mark the attachment ${fromReference(placement)} at ${referencePoints}.${attachmentSides.length?` Mark the two side positions (${attachmentSides.join(', ')}) and blend them into the center marks.`:''}`}`
        :`Mark the ${referenceLine} on the fitted garment and transfer that line at ${referencePoints}.`;
      const baseCircumference=paired?'each leg':hasSkirt(design.model)?'the main skirt':'the main bodice';
      const circumference=ruffle?`${baseCircumference} around the level of the ruffle’s own bottom edge`:`${baseCircumference} along the finished hem line`;
      const opening=closure==='Elastic waistband'
        ?`Keep the casing and threading opening clear wherever the layer reaches them.${paired?'':' Test that any layer crossing the waist passes over the hips.'}`
        :`Keep the ${closure?.toLowerCase()||'garment closure'} free to open all the way. Transfer the opening to a layer that crosses it.`;
      const clearance=paired?'Check that the two layers hang separately and clear the shoes.':startsAt==='upper edge'?'Check coverage and that the layer clears the arm openings.':'Check floor clearance on the fitted sample.';
      const stays=design.model==='corset'?' Keep stitching clear of boning channels and lacing or busk hardware.':'';
      add('draft','layerDraft',`${reference} The layer attaches on the ${inside?'inside':'outside'} of the garment. Start on paper with the hem ${hem}. ${contour.text?`${contour.text} `:''}${clearance} Measure ${circumference} without allowances. Set the layer’s starting sweep ${paired?'on each leg ':''}to ${sweep?`that measurement plus ${Number((sweep/(paired?2:1)).toFixed(3))} cm, shared across the panels${paired?' of that leg':''}`:'that same measurement'}.${fullnessSides.length?` Refine fullness at the marked edges (${fullnessSides.join(', ')} relative to the layer’s base sweep).${paired?' Keep each adjustment on its own leg.':' Blend to the center marks.'}`:''} Walk the new adjoining seam lines before adding allowances.`);
      add('cut','layerCut',`Prepare and press ${layer.fabric}. Label the new pattern pieces with the layer number, material, grainline and quantities.${paired?' Label a complete set for each leg. Use separate cut lines wherever the left and right settings differ.':''}${ruffle?` Mark the ${drop} cm base depth between the attachment stitch line and lower edge, then trace any finished shape changes before adding the upper seam and lower hem allowances.`:' Mark the finished hem and the cutting line with the allowance for the selected finish.'} Align both ends of the grainline to the same selvage, cut on the outside line and transfer attachment, closure and matching marks.`);
      add('assemble','layerFit',`Baste the layer panels together${paired?' into two separate leg assemblies':''}, leaving any opening from the pattern. Mark ${referencePoints} on the layer and at its attachment. Match those points first. If the layer’s upper stitch line is longer, use two rows of basting in the allowance to gather it evenly between marks. Check the fit before sewing it in place.`);
      add('assemble','layerAttach',`Baste ${where}${paired?' around each leg separately':''} and try on the garment. ${opening}${stays} ${startsAt==='upper edge'?'Reach, breathe, and sit to check the layer clears the arm openings and the closure.':'Sit, stand, and walk to check the layers hang freely.'} Once the fitting passes, stitch along the marked connection, secure the ends at the opening and finish the joined raw edges to suit the fabric.`);
      add('hem','layerHem',`Let this layer hang and settle. Recheck the base edge ${hem} and the marked hem shape with the garment worn${startsAt==='upper edge'?'':' and shoes on'}. ${paired?'Mark and finish one leg at a time. ':''}${contour.fairy?'Check each long point and short valley at its own labeled position. ':''}Keep the other layers out of the way while you trim and finish this edge. Test your finish on an offcut of ${layer.fabric} first.`);
    });
    return steps;
  }

  function straplessInstructions(design) {
    if (selectedStraplessSupport(design)==='Structured bodice') return [
      {visual:'straplessStructuredFit',text:'Fit a strapless sample with the same weight as the finished garment. Baste the stable foundation or lining, shaped body seams and closure at their planned lines. With the garment fastened, mark the upper edge at center front, center back and both sides. Check coverage and comfort while breathing, sitting and reaching. Transfer those marks and the matching facing shape to paper before cutting.'},
      {visual:'straplessChannels',text:'Build the structured bodice from the fitted pattern. Mark the boning channel lines on the stable foundation, keeping the upper-edge allowance and closure clear. Test a channel on layered scrap with the planned bone. Cut and finish the ends as the pattern and boning maker direct, insert the bones, and secure the channel ends clear of the seam lines. Baste any waist stay to the marked internal seams as specified and test it with the full garment weight.'},
      {visual:'straplessStructuredFinish',text:'Place the matching facing or lining and shell right sides together. Match the upper edge, notches, and closure marks, then stitch at the chosen allowance. Grade or clip curves as the pattern directs, turn the facing inside and secure it at seams so it stays flat. Recheck the closure, comfort, coverage and support with the full garment weight while standing, sitting and reaching.'}
    ];
    return [
      {visual:'straplessElasticFit',text:'Baste a strapless sample in similar fabric and mark the finished upper edge at center front, center back and both sides. Fasten the intended closure and mark the exact path where the elastic will sit. Check coverage, breathing, sitting and reaching. Transfer the marks to the paper pieces and trace a facing or casing that follows the fitted edge.'},
      {visual:'straplessElasticLength',text:'Hold the actual elastic at the marked upper edge of the fitting sample. Pin or clip the ends where the tension feels secure during movement and comfortable while breathing. For a pull-on loop, check that it stretches far enough to put on and take off. Where a zipper or button opening crosses the elastic edge, measure between the two planned anchors while the garment is fastened. Relax the elastic, measure the tested length, then add the join or anchor allowance specified by your pattern.'},
      {visual:'straplessElasticCasing',text:'Check elastic recovery and width on a scrap of the actual layers. For a casing, finish the upper edge with the shaped facing or fold from the pattern. Leave a threading opening and enough room for the elastic to slide flat. Use a bodkin or safety pin to feed it through and hold the trailing end. For sew-in elastic, mark corresponding sections on the elastic and garment, baste at those marks, and stretch the elastic gently between the marks as you stitch. On the Brother CP2160F, test zigzag 04 with foot J and a compatible needle on the layered scrap.'},
      {visual:'straplessElasticFinish',text:'Check that the elastic sits flat all the way around the upper edge. For a pull-on loop, overlap and secure the ends using the tested join for your elastic. Where a closure crosses the elastic edge, secure each end to its reinforced anchor under the facing so the opening stays free. Close the threading gap if used. Try the garment on while standing, sitting, reaching and taking a full breath. Adjust uncomfortable or slipping areas in the sample before permanently finishing the edge.'}
    ];
  }

  function straplessTools(design) {
    return selectedStraplessSupport(design)==='Structured bodice'
      ?['stable foundation or lining','boning','channel tape','facing','boning end covers as specified','waist stay if specified']
      :['garment elastic with good recovery','casing facing or lining','bodkin or safety pin','compatible needle'];
  }

  function strapInstructions(design) {
    const support=selectedSupport(design);
    const halter=support==='Halter strap';
    const width=design.strapWidth??supportWidth(support);
    const base=halter?'reference strap width':'shoulder width';
    const shape=strapShape(design);
    const placement=design.strapPlacement?` Move the attachment ${Math.abs(design.strapPlacement)} cm ${design.strapPlacement<0?'inward':'outward'} from the starting shoulder mark.`:'';
    const route=halter?'Fit the strap around the neck from the front attachment points.':support==='One-shoulder'
      ?`Fit from the front bodice to the back bodice over the wearer’s ${selectedShoulderSide(design)} shoulder.`:'Fit from the front bodice to the back bodice over each shoulder.';
    const joins=shape.strapFrontJoin || shape.strapFrontAngle || !halter && (shape.strapBackJoin || shape.strapBackAngle);
    const ends=supportsStrapShape(support)?[['Front attachment',shape.strapFrontCurve,shape.strapFrontTaper,shape.strapFrontJoin,shape.strapFrontAngle],
      [halter?'Back collar segment':'Back attachment',shape.strapBackCurve,shape.strapBackTaper,shape.strapBackJoin,shape.strapBackAngle]].map(([name,curve,taper,depth,angle])=>{
      const shift=curve?`Move its centerline ${Math.abs(curve)} cm ${curve>0?'toward the neckline':'away from the neckline'} from the starting mark.`:'Keep its starting centerline.';
      const endWidth=Number.isFinite(width)?` (${Number((width*taper/100).toFixed(3))} cm finished)`:'';
      const join=joins && name!=='Back collar segment'?` At the midpoint, measure ${depth?`${depth} cm down the fabric from the starting attachment edge`:'from the starting edge, with no overlap added'}. ${angle?`Tilt the joining line ${Math.abs(angle)}° from the crosswise line, with the ${angle>0?'neckline':'outer'} side extending farther.`:'Keep the joining line crosswise.'}`:'';
      return `${name} uses ${taper}% of the ${base}${endWidth}. ${shift}${join}`;
    }).join(' '):'';
    const joinCheck=joins?' Transfer the complete joining lines to the matching pieces. Check that the two ends of each join sit on fabric at the fitted edge before adding the joining allowance.':'';
    return {visual:'strap',text:`Fit the ${support.toLowerCase()} ${Number.isFinite(width)?`at ${width} cm wide, finished, at the ${halter?'neck reference':'shoulder'}.`:'and mark its tested width.'} ${route}${placement}${ends?` ${ends} Blend each edge into the marked reference width.`:''}${joinCheck} Mark the worn length and add the pattern’s attachment and edge allowances. Baste, check reach and support, then reinforce the ends.`};
  }

  function sleeveDrafting(style) {
    return ({
      Puff:'Slash and spread the sleeve pattern for fullness, then gather the excess into the tested sleeve cap or cuff.',
      Bell:'Slash and spread from the hem toward the cap, keeping the cap seam intact. Draw a smooth, wider hem.',
      Flutter:'Start with a short sleeve cap that matches the armhole. Slash from the lower edge toward the cap, leave a paper hinge, then spread evenly to make a circular flare. Keep the cap stitch length and notches, redraw the rounded edge and test a narrow finish on the curved scraps.',
      Bishop:'Keep the cap stitch line matched to the armhole. Spread the lower sleeve for fullness and fit the wrist opening with the cuff and its closure. Baste two rows at the lower edge, draw up the gathers between matching marks and stitch the fitted cuff in place.',
      Tapered:'Mark the upper arm, elbow and wrist on the sleeve while it is on the wearer. Blend the narrower line toward the wrist, leaving room to bend the elbow. Check the hand can pass through or mark the cuff opening and closure before adding the seam allowance.'
    })[style]||'Keep the sleeve cap and its notches aligned to the corresponding armhole.';
  }

  function laceTrimTargets(design) {
    const placements=lacePlacements(design);
    const main=Object.entries(laceTrims(design)).map(([edge,trim])=>({label:placements[edge],trim}));
    const layerHems=layers(design).flatMap((layer,index)=>layer.laceTrim
      ?[{label:`Layer ${index+1} ${layer.kind.toLowerCase()} hem`,trim:layer.laceTrim}]:[]);
    return [...main,...layerHems];
  }

  function laceInstructions(design) {
    return laceTrimTargets(design).map(({label,trim})=>{
      const flexible=trim.style==='Stretch lace';
      const settings=flexible
        ?'Test zigzag 04 with foot J on the Brother CP2160F using a compatible stretch or ballpoint needle. After stitching, stretch the test piece and check that the thread holds and the edge recovers.'
        :'Test centered straight stitch 01 with foot J on the Brother CP2160F if the attachment rail and garment are both stable. If the edge must stretch, test zigzag 04 with foot J on the actual layers and use trim that stretches far enough.';
      return {visual:'designLaceTrim',text:`${label}. Apply ${trim.style.toLowerCase()} ${trim.width} cm wide (${trim.color}). Finish and fit the fabric edge first. With a flexible tape, measure each actual edge along the stitching path and mark matching points, joins and any closure. Allow spare trim for the repeat, seam joins and a test piece. Match motifs on paired edges. Lay the right side of the lace outward and place its solid sewing rail just over the finished fabric edge. Let the decorative part extend beyond the garment. Clip, then baste the rail through the garment. Check that it follows curves and points while lying flat. ${settings} Stitch through the rail and fabric. Finish the ends at the joins or on each side of an opening. Keep the closure free and recheck fit with the garment fastened.`};
    });
  }

  function instructions(design,model) {
    const spec = silhouettes[design.model];
    const style = design.cut.toLowerCase();
    const list = [];
    const add = (visual,text) => list.push({visual,text});
    const layerSteps=layerInstructions(design);
    const upper = isBodice(design.model);
    const strapless=upper && selectedSupport(design)==='Strapless';
    const upperEdge=strapless?straplessInstructions(design):[];
    const fitArea = upper?'chest or bust':'hip or seat';
    const target = (upper?model.bust:model.hip)+design.ease;
    const additional = sewingModels.summary(model);
    const hemShape=hasSkirt(design.model)?hemDraft(design):{text:'',fairy:false};
    add('measure',`Use the ${model.name} model measurements. Chest / bust ${model.bust} cm, waist ${model.waist} cm, hip / seat ${model.hip} cm and shoulder span ${model.shoulder} cm.${additional?' Additional measurements: '+additional+'.':''} Choose a compatible ${spec.label.toLowerCase()} block in the matching size. With ${design.ease} cm of target ease, aim for ${target} cm around the finished ${fitArea}. Check minimum ease, movement and balance on a test garment. Trace and mark grainlines, matching points and seam allowances.`);
    add('designCut',`Draw the ${style} silhouette and mark the ${design.length.toLowerCase()} finish while fitting the test garment. Make width changes on seam lines, then blend the curves, walk the adjoining seams to check they match, and restore seam and hem allowances. Keep the grainline straight and transfer matching marks to the new outline.`);
    list.push(...seamInstructions(design));
    list.push(...sideFitInstructions(design));
    if (hemShape.text) add(hemShape.fairy?'fairyHem':'hemContour',`Stand in the fitting sample and establish the base hem. ${hemShape.text} Mark each center and side position on the paper and add the finish allowance beyond the checked stitching or fold line.`);
    if (design.model==='corset') {
      add('designCut',`Use a ${style} pattern sized to the wearer. Fit the panel seams in a stable toile over the intended underlayers. Mark panel numbers, grainlines and the narrowest waist on each side. Check breathing, sitting and closure reach before cutting.`);
      add('seam','Mark the boning channels and busk or lacing reinforcement from the pattern. Label left and right panels, join the numbered panels in order, and test the marked channel width against the actual boning before closing the lining.');
    }
    if (isBodice(design.model)) {
      if (strapless) list.push(upperEdge[0]);
      else add('neck',`Draw the ${design.neckline.toLowerCase()} front edge and ${selectedBack(design).toLowerCase()} on the toile. Mark center front, center back and matching points. Check coverage and closure access, then trace matching facings or binding before cutting.`);
      const strap=selectedSupport(design);
      if (!strapless && (strap!==supports[0] || design.strapWidth || design.strapPlacement)) list.push(strapInstructions(design));
      if (isSleeved(design)) add('sleeve',`Trace a sleeve for the matching armhole. Mark the ${design.sleeve.toLowerCase()} sleeve shape and finished length. ${sleeveDrafting(design.sleeve)} Baste it into the test garment and check reach before cutting the final fabric.`);
    } else if (design.model==='trousers') {
      add('rise',`Mark the ${(design.rise||rises[1]).toLowerCase()} on the toile and mark the ${style} silhouette at the thigh, knee and leg opening. Change the knee and hem widths gradually on the front and back, keeping the grainline straight. Check sitting and stride, then walk the inseams and outseams before cutting.`);
    }
    if (design.tone===tones[1]) {
      add('colorBlock','Mark a lower-panel seam on the traced pieces at the same height wherever panels meet. Split the pattern there, add matching seam allowances to both new edges and copy the grainline. Sew the contrast lower panels to their matching upper pieces before joining the garment seams.');
    }
    list.push(...layerSteps.draft);
    add('grain',`Prewash the ${design.fabric.toLowerCase()} as appropriate, press it flat and lay out the trued pieces on grain. Measure your final layout against the fabric width before buying or cutting. Cut all pieces and transfer matching marks, pocket positions and closure marks.`);
    list.push(...layerSteps.cut);
    if (design.pocket==='Patch pockets') add('pocketPatch','Mark matching pocket positions on the first fitting. Finish the pocket top edge, turn and press the remaining allowances, then topstitch the pockets onto the flat garment panels before assembly.');
    if (design.pocket==='In-seam pockets') add('pocket','Mark paired openings on the side seams. Sew the pocket bags to the matching front and back opening lines before joining the side seams. Join the bags, reinforce each opening end and check that the pockets sit flat.');
    if (isBodice(design.model)) {
      if (strapless) {
        add('seam','Join the fitted bodice panels and preserve the marked upper edge. Baste the intended closure at its marks for the trial fitting, leaving the opening accessible for final construction.');
        list.push(...upperEdge.slice(1,-1));
      } else add('shoulder','Sew and press the shoulder seams. Baste body seams and confirm ease and balance. Attach the facing or binding and understitch or secure its inner edge as appropriate.');
      if (isSleeved(design)) add('armhole','Match each sleeve’s marked notches to its own armhole and baste it. Try on the garment and check movement and the intended fit on both sides, then attach and finish the sleeves.');
    } else {
      add(design.model==='trousers'?'rise':'seam',design.model==='trousers'
        ? 'Baste the inseams, side seams and crotch seam and check the rise and stride. Stitch and finish confirmed seams, leaving the opening required for the closure.'
        : 'Baste the skirt seams and check walking ease. Stitch and finish the seams, leaving the planned closure opening.');
    }
    const closureSteps = {
      'Invisible zipper':['zipper','Install the invisible zipper in the opening planned on the pattern. Use a zipper foot, check that crossing seams line up, then close and finish the rest of the seam.'],
      'Side zipper':['zipper','Mark the top stop and opening end on the designated side seam. Stabilize the opening as directed, baste both zipper tapes to their marks and test that the waist or underarm edges align when closed.'],
      'Zip fly':['zipper','Mark the fly fold, facing and shield. Baste the front opening, stitch the zipper to the fly facing and shield in the order shown on your pattern, then mark and topstitch the fly curve without catching the teeth.'],
      'Button fly':['button','Interface and prepare the fly extension and shield. Baste the overlap, mark the buttonholes and matching button centers, and test the overlap before cutting the buttonholes open.'],
      'Wrap ties':['band','Baste the overlap and mark where the ties exit or anchor during the fitting. Verify coverage while sitting and moving. Finish the overlap edges and reinforce the tie attachment points.'],
      'Separating zipper':['zipper','With the zipper closed, mark matching garment lines on both tapes. Open the zipper and baste each tape to its marks. Check the bottom box clears the hem and that both upper edges match when closed.'],
      'Back lacing':['lacing','Interface the lacing edges and mark eyelet spacing from the corset pattern. Test on scrap with the chosen hardware. Keep the two rows paired, reinforce the lacing edges and test the closure over the intended layers.'],
      'Front busk':['busk','Align the busk at center front and mark every loop and stud from the actual hardware. Reinforce the opening, baste the facing around the busk, and test that the two sides close evenly before topstitching.'],
      'Back button and loop':['facing','Finish the back-neck opening with the facing. Baste in a thread or fabric loop, test head clearance, then secure the loop and matching button.'],
      'Front buttons':['button','Interface and finish the front opening with plackets or facings. Test buttonholes on layered scrap, mark even spacing and stitch them. Attach the buttons opposite the holes.'],
      'Elastic waistband':['band','Choose a pull-on opening that passes over the hips. Sew a waistband casing, insert the elastic and fit it, then join its ends securely and close the casing.']
    };
    const {panelZipper,panelAngle}=seams(design);
    const closure=effectiveClosure(design);
    if (Number.isFinite(panelZipper)) {
      const foot=closure==='Invisible zipper'?'Use a compatible invisible zipper foot as directed by the pattern.':'Use zipper foot I on the Brother CP2160F and check needle clearance by turning the handwheel before sewing.';
      add('designSinglePanelZipper',`Install the ${closure.toLowerCase()} at ${singleSeamLocation(panelAngle)}. Mark ${panelZipper} cm along the seam from the finished upper edge and leave that opening free. Stabilize the opening if the fabric stretches. Baste each zipper tape to its marked edge and close the zipper to check that the upper edges and any crossing seams line up. ${foot} Sew the tapes in place, close the seam below the bottom stop, and test that the zipper opens fully.`);
    } else add(...(closureSteps[closure] || closureSteps[closureChoices(design.model)[0]]));
    if (strapless) list.push(upperEdge.at(-1));
    if (!isBodice(design.model) && closure!=='Elastic waistband') add('band','Finish the top edge with the chosen waistband or waist facing. Test the closure and check that the waist stays level when sitting.');
    list.push(...layerSteps.assemble);
    const hem = {
      'Double-fold hem':'Turn the raw edge twice, press and stitch. Check that the hem lies smoothly without ripples.',
      'Faced hem':'Trace a shaped facing that matches the hem curve. Stitch it to the lower edge, grade the seam, turn it inside and secure the upper edge.',
      'Contrast hem band':'Cut a matching band in contrast fabric. Test the finished band depth on the wearer, then join the band, press the seam and finish its inside edge.'
    };
    if (hemShape.text) add('finish','Let the hem hang so any bias edges settle. Recheck the finished edge at each marked point on the wearer, and test the finish on a scrap cut at the same angle before trimming. '+hem[design.finish]);
    else add('finish','Mark a level hem during a final fitting. '+hem[design.finish]);
    list.push(...layerSteps.hem);
    list.push(...laceInstructions(design));
    return list;
  }

  function make(design,name,model) {
    const spec = silhouettes[design.model];
    const garmentLayers=layers(design);
    design={...design};
    const seamSettings=seams(design);
    if (Object.keys(seamSettings).length) design.seams=seamSettings;
    else delete design.seams;
    if (hasSkirt(design.model) || Array.isArray(design.layers)) design.layers=garmentLayers;
    else delete design.layers;
    Object.assign(design,hemContour(hasSkirt(design.model)?design:undefined));
    const sideSettings=asymmetry(design);
    if (Object.values(sideSettings).some(side=>Object.keys(side).length)) design.asymmetry=sideSettings;
    else delete design.asymmetry;
    const support=selectedSupport(design);
    if (support==='One-shoulder') design.shoulderSide=selectedShoulderSide(design);
    else delete design.shoulderSide;
    const shape=isBodice(design.model) && supportsStrapShape(support)?strapShape(design):strapShapeDefaults;
    for (const [key,value] of Object.entries(shape)) {
      if (value===strapShapeDefaults[key]) delete design[key];
      else design[key]=value;
    }
    if (support==='Strapless' && isBodice(design.model)) {
      design.straplessSupport=selectedStraplessSupport(design);
      design.sleeve='Sleeveless';
      delete design.strapWidth;
      delete design.strapPlacement;
      if (design.fitAdjustments) {
        const {sleeveWidth,sleeveCap,sleeveLength,cuff,...remaining}=design.fitAdjustments;
        design.fitAdjustments=remaining;
      }
    } else delete design.straplessSupport;
    const trims=laceTrims(design);
    if (Object.keys(trims).length) design.laceTrims=trims;
    else delete design.laceTrims;
    const list = instructions(design,model);
    const closure=effectiveClosure(design);
    const tools = ['Sewing machine','iron','fabric shears','measuring tape','ruler','pins or clips','tailor’s chalk','matching thread','pattern paper'];
    if (design.straplessSupport) tools.push(...straplessTools(design));
    if (/zipper|zip fly/i.test(closure)) tools.push('zipper foot',closure==='Invisible zipper'?'invisible zipper':'pattern-specified zipper');
    if (closure===closures[1]) tools.push('button','loop cord');
    if (closure===closures[2]||closure==='Button fly') tools.push('buttonhole foot','buttons','interfacing');
    if (closure===closures[3]) tools.push('elastic','safety pin or bodkin');
    if (design.model==='corset') tools.push('sturdy foundation fabric','boning','channel tape');
    if (closure==='Back lacing') tools.push('eyelets and setting tool','lacing cord');
    if (closure==='Front busk') tools.push('busk');
    if (garmentLayers.length) tools.push('hand-basting needle','removable fabric marker');
    const trimTargets=laceTrimTargets(design);
    if (trimTargets.length) tools.push('foot J','hand-basting needle','compatible needle','flexible measuring tape');
    const layerFabrics=garmentLayers.length?' Layers: '+garmentLayers.map((layer,index)=>`${index+1} ${layer.kind.toLowerCase()} in ${layer.fabric}`).join(', ')+'.':'';
    const trimMaterials=trimTargets.length?' '+trimTargets.map(({label,trim})=>`Use ${trim.style.toLowerCase()} ${trim.width} cm wide (${trim.color}) for ${label.toLowerCase()}.`).join(' ')+' Measure each finished edge and allow spare for motif matching, joins and a test piece.':'';
    return {name,model:baseModel(design.model),sleeves:isSleeved(design),type:spec.type,
      cut:design.cut+' '+spec.label.toLowerCase()+' · '+design.length.toLowerCase()+(hasFairyHem(design)?' · fairy hem':''),
      level:'Intermediate',color:design.primary,design,
      fabric:design.fabric+(isContrast(design)?' and coordinating contrast fabric':'')+'.'+layerFabrics+trimMaterials+' Confirm yardage after laying out your drafted pieces.',
      tools:[...new Set(tools)].join(', '),steps:list.map(entry=>entry.text),visuals:list.map(entry=>entry.visual)};
  }

  return {silhouettes,necklines,sleeves,fabrics,closures,pockets,finishes,hemStyles,hasFairyHem,hemDrop,hemContourLimits,hemContour,hemOffsetAt,tones,backs,rises,
    laceStyles,laceWidthLimits,newLaceTrim,laceTrim,lacePlacements,laceTrims,
    layerKinds,layerKindChoices,layerStartsAt,layerIsInner,layerLimits,maxLayers,layers,newLayer,layerSweepAt,layerAttachmentLimits,layerAttachmentAt,
    seamKeys,seamLimits,seams,asymmetryLimits,asymmetryKeys,asymmetry,
    centerFrontSeam,panelAngleLimits,panelSeamPaths,panelSeamSnapOffset,singleSeamAngle,singleSeamLocation,singleSeamGuide,
    panelZipperLimits,panelZipperDefault,panelZipperKinds,panelZipperEligible,panelZipperStyle,effectiveClosure,
    baseModel,isBodice,isContrast,isSleeved,closureChoices,supportChoices,selectedSupport,straplessSupportChoices,selectedStraplessSupport,
    selectedShoulderSide,supportWidth,supportsStrapShape,strapShapeLimits,strapShapeChoices,strapShape,
    selectedBack,pocketChoices,defaults,measurements,straplessInstructions,straplessTools,strapInstructions,sleeveDrafting,laceInstructions,instructions,make};
})();
