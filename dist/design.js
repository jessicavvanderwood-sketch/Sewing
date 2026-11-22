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
    'Button fly','Wrap ties','Separating zipper','Back lacing','Front busk','Drawstring waistband'];
  const backs = ['Classic back','Low scoop back','V-back','Square back','Racerback','Open back','Boat back','Soft V-back','Deep U-back'];
  const supports = ['Integrated shoulders','Wide straps','Narrow straps','Spaghetti straps','Halter strap','One-shoulder','Strapless'];
  const strapShapeLimits = {strapFrontCurve:[-5,5],strapBackCurve:[-5,5],strapFrontTaper:[25,250],strapBackTaper:[25,250],
    strapFrontJoin:[0,6],strapBackJoin:[0,6],strapFrontAngle:[-35,35],strapBackAngle:[-35,35],
    strapBackSpacing:[-6,6],strapBackShift:[-5,5]};
  const strapShapeDefaults = {strapFrontCurve:0,strapBackCurve:0,strapFrontTaper:100,strapBackTaper:100,
    strapFrontJoin:0,strapBackJoin:0,strapFrontAngle:0,strapBackAngle:0,strapBackSpacing:0,strapBackShift:0};
  const rearBodiceStrapKeys=['strapBackJoin','strapBackAngle','strapBackSpacing','strapBackShift'];
  const strapShapeChoices = {
    Straight:{...strapShapeDefaults},
    'Curved into neckline':{...strapShapeDefaults,strapFrontCurve:2.5,strapBackCurve:1.5},
    Tapered:{...strapShapeDefaults,strapFrontTaper:60,strapBackTaper:75},
    'Flared at neckline':{...strapShapeDefaults,strapFrontTaper:145,strapBackTaper:125}
  };
  const strapCornerStyles = ['Sharp','Chamfer','Round'];
  const strapCornerSizeLimits = [.25,5];
  const strapCornerDefaultSize = 1.25;
  const strapCornerLabels = {
    frontInner:'Front neckline corner',frontOuter:'Front armhole corner',
    backInner:'Back neckline corner',backOuter:'Back armhole corner'
  };
  const rises = ['Low rise','Natural rise','High rise'];
  const pockets = ['None','Patch pockets','In-seam pockets'];
  const pocketTypes = {patch:'Patch pocket',inseam:'In-seam pocket'};
  const sectionLabels = {body:'Garment body',leftLeg:'Wearer’s left leg',rightLeg:'Wearer’s right leg'};
  const pocketLimits = {angle:[-180,180],height:[0,100],width:[4,30],depth:[4,35],opening:[3,30],rotation:[-45,45]};
  const pocketShapes = ['Square','Rounded','Pointed'];
  const slitLimits = {angle:[-180,180],length:[1,65],opening:[0,25]};
  const slitDefaults = {angle:90,length:14,opening:2};
  const finishes = ['Double-fold hem','Faced hem','Contrast hem band'];
  const laceStyles = ['Scalloped lace','Eyelet lace','Stretch lace'];
  const laceWidthLimits = [.5,8];
  const laceDefaults = {style:laceStyles[0],width:2,color:'#f1e6da'};
  const seamLaceAlignments = ['center','left','right'];
  const stitchStyles = ['Gathered ruffle','Knife pleats','Box pleats','Inverted pleats','Pintucks'];
  const maxStitchDetails = 6;
  const stitchLimits = {depth:[.5,28],spacing:[.5,25],fullness:[1.25,3.5]};
  const attachmentSeamLimits = {height:[0,100],depth:[1,65],fullness:stitchLimits.fullness};
  const attachmentRuffleDefaults = {depth:12,fullness:2};
  const attachmentSeamHeights = [55,72,38,85,25,92,12,64,45];
  const stitchDefaults = {
    'Gathered ruffle':{depth:7,fullness:2},
    'Knife pleats':{depth:9,spacing:3},
    'Box pleats':{depth:9,spacing:4},
    'Inverted pleats':{depth:9,spacing:4},
    Pintucks:{depth:8,spacing:1.5}
  };
  const stitchPlacementLabels = {waist:'Waist',waistband:'Waistband top edge',hem:'Hem',neckline:'Neckline',sleeves:'Sleeve openings'};
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
    skirt:['Invisible zipper','Side zipper','Elastic waistband','Front buttons','Wrap ties','Drawstring waistband'],
    trousers:['Zip fly','Button fly','Side zipper','Elastic waistband','Invisible zipper','Drawstring waistband'],
    corset:['Back lacing','Front busk','Separating zipper']
  };
  const closureChoices = model=>closuresByType[model];
  const casingClosure=closure=>closure==='Elastic waistband'||closure==='Drawstring waistband';
  const supportChoices = model=>model==='corset'?supports.slice(1):supports;
  const selectedSupport = design=>design.support || (design.model==='corset'?'Strapless':supports[0]);
  const supportsStrapShape = support=>supports.includes(support) && support!=='Integrated shoulders' && support!=='Strapless';
  const strapShape = design=>Object.fromEntries(Object.entries(strapShapeLimits).map(([key,limits])=>{
    const collar=design?.support==='Halter strap' && rearBodiceStrapKeys.includes(key);
    const single=design?.support==='One-shoulder' && key==='strapBackSpacing';
    return [key,collar||single?0:numeric(design,key,strapShapeDefaults[key],limits)];
  }));
  function strapCornerChoices(design) {
    if (!isBodice(design?.model)) return {};
    const support=selectedSupport(design);
    if (!supportsStrapShape(support)) return {};
    if (support==='Halter strap') return {frontInner:strapCornerLabels.frontInner,frontOuter:strapCornerLabels.frontOuter};
    return {...strapCornerLabels};
  }

  function strapCorner(value) {
    const style=strapCornerStyles.includes(value?.style)?value.style:strapCornerStyles[0];
    const size=style==='Sharp'?0:numeric(value,'size',strapCornerDefaultSize,strapCornerSizeLimits);
    return {style,size};
  }

  function strapCorners(design) {
    if (!design?.strapCorners) return {};
    return Object.fromEntries(Object.keys(strapCornerChoices(design)).flatMap(key=>{
      const corner=strapCorner(design.strapCorners[key]);
      return corner.style==='Sharp'?[]:[[key,corner]];
    }));
  }

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
  const selectedBack = design=>backs.includes(design?.back)?design.back:backs[0];
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

  const supportsInseamPocket = model=>['dress','skirt','trousers'].includes(model);

  function pocketChoicesForDesign(design) {
    const model=design?.model;
    if (!Object.hasOwn(silhouettes,model)) return {};
    const choices={patch:pocketTypes.patch};
    if (supportsInseamPocket(model) && !onePiece(design).legOutseam) choices.inseam=pocketTypes.inseam;
    return choices;
  }

  function pocketSections(design,type='patch') {
    if (!Object.hasOwn(silhouettes,design?.model) || !Object.hasOwn(pocketTypes,type)) return {};
    if (type==='inseam' && !supportsInseamPocket(design.model)) return {};
    return type==='patch' && design.model==='trousers'?{...sectionLabels}:{body:sectionLabels.body};
  }

  function pocketDefaults(design,type) {
    const model=design.model;
    const height={dress:26,top:32,skirt:20,trousers:40,corset:40}[model];
    const patchWidth={top:12,corset:8}[model]||15;
    const width=type==='inseam'?15:patchWidth;
    const depth=type==='inseam'?20:({top:11,corset:8}[model]||15);
    return {type,section:'body',angle:type==='inseam'?90:model==='top'?33:42,height,width,depth,
      opening:type==='inseam'?14:width,rotation:0,shape:type==='inseam'?'Rounded':'Square'};
  }

  function pocketDetail(value,design) {
    const type=value?.type;
    const sections=pocketSections(design,type);
    if (!Object.hasOwn(pocketTypes,type) || !Object.keys(sections).length) return null;
    const base=pocketDefaults(design,type);
    const sized=Object.fromEntries(Object.entries(pocketLimits).map(([key,limits])=>[key,numeric(value,key,base[key],limits)]));
    sized.opening=Math.min(sized.opening,type==='patch'?sized.width:sized.depth);
    if (type==='inseam') {
      sized.angle=sized.angle<0?-90:90;
      sized.rotation=0;
    }
    const section=Object.hasOwn(sections,value.section)?value.section:'body';
    return {type,section,...sized,shape:pocketShapes.includes(value.shape)?value.shape:base.shape};
  }

  function legacyPocketDetails(design) {
    const type=design?.pocket===pockets[1]?'patch':design?.pocket===pockets[2]?'inseam':undefined;
    if (!type || !Object.hasOwn(silhouettes,design.model) || !pocketChoices(design.model).includes(design.pocket)) return [];
    const base=pocketDefaults(design,type);
    return [base,{...base,angle:-base.angle}];
  }

  function pocketDetails(design) {
    if (!Array.isArray(design?.pocketDetails)) return legacyPocketDetails(design);
    return design.pocketDetails.map(pocket=>pocketDetail(pocket,design)).filter(Boolean);
  }

  function hasInseamPocket(design) {
    if (!supportsInseamPocket(design?.model)) return false;
    return Array.isArray(design.pocketDetails)?design.pocketDetails.some(pocket=>pocket?.type==='inseam'):design.pocket===pockets[2];
  }

  function newPocket(design,overrides={}) {
    const choices=pocketChoicesForDesign(design);
    if (!choices.patch) return null;
    const type=Object.hasOwn(choices,overrides.type)?overrides.type:'patch';
    const base=pocketDefaults(design,type);
    const existing=pocketDetails(design).filter(pocket=>pocket.type===type).length;
    const angles=type==='inseam'?[90,-90]:[base.angle,-base.angle,180-base.angle,base.angle-180,90,-90,0,180];
    return pocketDetail({...base,angle:angles[existing%angles.length],height:Math.min(90,base.height+10*Math.floor(existing/angles.length)),
      ...overrides,type},design);
  }

  function pocketPositionLabel(pocket) {
    return `${sectionAngleLabel(pocket)} · ${pocket.height}% down`;
  }

  function slitSections(design) {
    if (!Object.hasOwn(silhouettes,design?.model)) return {};
    if (design.model==='trousers') return {leftLeg:sectionLabels.leftLeg,rightLeg:sectionLabels.rightLeg};
    return {body:sectionLabels.body};
  }

  function slitDetail(value,design) {
    if (!value || typeof value!=='object' || Array.isArray(value)) return null;
    const choices=slitSections(design);
    const sections=Object.keys(choices);
    if (!sections.length) return null;
    const suggested=choices.rightLeg && value.angle<0?'rightLeg':sections[0];
    const section=Object.hasOwn(choices,value.section)?value.section:suggested;
    const fallbackAngle=section==='rightLeg'?-slitDefaults.angle:slitDefaults.angle;
    return {section,angle:numeric(value,'angle',fallbackAngle,slitLimits.angle),length:numeric(value,'length',slitDefaults.length,slitLimits.length),
      opening:numeric(value,'opening',slitDefaults.opening,slitLimits.opening)};
  }

  function slits(design) {
    if (!Array.isArray(design?.slits)) return [];
    return design.slits.map(slit=>slitDetail(slit,design)).filter(Boolean);
  }

  function newSlit(design,overrides={}) {
    const sections=slitSections(design);
    const choices=Object.keys(sections);
    if (!choices.length) return null;
    const existing=slits(design);
    const section=Object.hasOwn(sections,overrides.section)?overrides.section:choices[existing.length%choices.length];
    const angles=section==='rightLeg'?[-90,0,180,90]:section==='leftLeg'?[90,0,180,-90]:[90,-90,180,0,45,-45,135,-135];
    const count=existing.filter(item=>item.section===section).length;
    return slitDetail({...slitDefaults,...overrides,section,angle:overrides.angle??angles[count%angles.length]},design);
  }

  function sectionAngleLabel(piece) {
    return `${sectionLabels[piece.section]} · ${singleSeamLocation(piece.angle)} (${piece.angle}°)`;
  }

  const slitLabel = slit=>sectionAngleLabel(slit);

  const supportsAttachmentSeams = model=>hasSkirt(model)||model==='top'||model==='corset';

  function attachmentSeam(value,design) {
    if (!supportsAttachmentSeams(design?.model) || !value || typeof value!=='object' || Array.isArray(value)) return null;
    const height=numeric(value,'height',attachmentSeamHeights[0],attachmentSeamLimits.height);
    const ruffle=value.ruffle;
    if (!ruffle || typeof ruffle!=='object' || Array.isArray(ruffle)) return {height};
    const depth=numeric(ruffle,'depth',attachmentRuffleDefaults.depth,attachmentSeamLimits.depth);
    const fullness=numeric(ruffle,'fullness',attachmentRuffleDefaults.fullness,attachmentSeamLimits.fullness);
    return {height,ruffle:{depth,fullness}};
  }

  function attachmentSeams(design) {
    if (!Array.isArray(design?.attachmentSeams) || !supportsAttachmentSeams(design.model)) return [];
    return design.attachmentSeams.map(seam=>attachmentSeam(seam,design)).filter(Boolean);
  }

  const attachmentSeamReference = design=>design?.model==='skirt'?'Waistband upper edge':'Upper edge at the side seam';

  function newAttachmentSeam(design,overrides={}) {
    const count=attachmentSeams(design).length;
    return attachmentSeam({height:attachmentSeamHeights[count%attachmentSeamHeights.length],...overrides},design);
  }

  function newAttachmentSeamTiers(design) {
    const model=design?.model;
    if (!supportsAttachmentSeams(model)) return [];
    const tall=hasSkirt(model);
    const approximateSideLengths={dress:[68,90,116],skirt:[43,64,89],top:[26,39,49],corset:[20,27,36]};
    const lengthIndex=silhouettes[model].lengths.indexOf(design.length);
    const estimate=approximateSideLengths[model][lengthIndex<0?1:lengthIndex];
    // Overlap adjacent tiers slightly using provisional side-seam lengths.
    // The actual mounted drop is checked on the fitted garment.
    const depth=Math.round(estimate*(tall?.25:.28));
    const heights=tall?[12,34,56,78]:[45,69];
    return heights.map(height=>attachmentSeam({height,ruffle:{depth,fullness:attachmentRuffleDefaults.fullness}},design));
  }

  function onePieceChoices(design) {
    const model=design?.model;
    if (!Object.hasOwn(silhouettes,model)) return {};
    const choices={};
    const support=selectedSupport(design);
    if (isBodice(model) && supportsStrapShape(support)) {
      choices.strapFront='Front strap and bodice';
      if (support!=='Halter strap') choices.strapBack='Back strap and bodice';
    }
    if (model==='dress' && design.tone!==tones[1]) choices.waist='Bodice and skirt at waist';
    const panel=design.seams;
    const hasPanelZipper=panel?.panelSeam===centerFrontSeam && Number.isFinite(panel.panelZipper);
    if (seamKeys(model).includes('panelSeam') && !hasPanelZipper) choices.panel='Continuous panel';
    if (model==='trousers' && design.closure!=='Side zipper' && !hasInseamPocket(design)) {
      choices.legOutseam='Trouser legs without outseams';
    }
    return choices;
  }

  function onePiece(design) {
    if (!design?.onePiece) return {};
    return Object.fromEntries(Object.keys(onePieceChoices(design)).filter(key=>design.onePiece[key]===true).map(key=>[key,true]));
  }

  const newLaceTrim = ()=>({...laceDefaults});
  function laceTrim(value) {
    if (!laceStyles.includes(value?.style)) return null;
    const color=typeof value.color==='string' && /^#[0-9a-f]{6}$/i.test(value.color)?value.color.toLowerCase():laceDefaults.color;
    return {style:value.style,width:numeric(value,'width',laceDefaults.width,laceWidthLimits),color};
  }

  function seamLaceTrim(value) {
    const trim=laceTrim(value);
    if (!trim) return null;
    const alignment=seamLaceAlignments.includes(value.alignment)?value.alignment:'center';
    return {...trim,alignment,matchPocket:typeof value.matchPocket==='boolean'?value.matchPocket:true};
  }

  function lacePlacements(design) {
    const model=design?.model;
    if (!Object.hasOwn(silhouettes,model)) return {};
    const placements={};
    if (isBodice(model)) placements.neckline='Neckline';
    if (isSleeved(design)) placements.sleeves='Sleeve openings';
    placements.hem=model==='trousers'?'Leg hems':'Hem';
    if (model==='trousers') placements.waistband='Waistband top edge';
    if (pocketDetails(design).length) placements.pockets='Pocket openings';
    if (!onePiece(design).legOutseam) placements.seams='Seam overlay';
    return placements;
  }

  function laceTrims(design) {
    return Object.fromEntries(Object.keys(lacePlacements(design)).flatMap(key=>{
      const trim=(key==='seams'?seamLaceTrim:laceTrim)(design.laceTrims?.[key]);
      return trim?[[key,trim]]:[];
    }));
  }

  function laceSeamPlacement(design) {
    if (onePiece(design).legOutseam) return {kind:'none'};
    const {panelSeam,panelAngle}=seams(design);
    if (panelSeam===centerFrontSeam) return {kind:'single',angle:panelAngle};
    if (Number.isFinite(panelSeam)) return {kind:'panels',offset:panelSeam};
    return {kind:'sides'};
  }

  function seamLaceCanMatch(design) {
    if (!laceTrim(design?.laceTrims?.seams) || !laceTrim(design.laceTrims.pockets) || !hasInseamPocket(design)) return false;
    const seam=laceSeamPlacement(design);
    if (seam.kind==='sides') return true;
    if (seam.kind!=='single' || Math.abs(seam.angle)!==90) return false;
    return pocketDetails(design).some(pocket=>pocket.type==='inseam' && pocket.angle===seam.angle);
  }

  function effectiveSeamLace(design) {
    const seam=seamLaceTrim(design?.laceTrims?.seams);
    if (!seam || !Object.hasOwn(silhouettes,design?.model) || onePiece(design).legOutseam) return null;
    if (seam.alignment!=='center' || !seam.matchPocket || !seamLaceCanMatch(design)) return seam;
    return {...seam,...laceTrim(design.laceTrims.pockets)};
  }

  function stitchPlacements(design) {
    const model=design?.model;
    if (!Object.hasOwn(silhouettes,model)) return {};
    const placements={hem:model==='trousers'?'Leg hems':stitchPlacementLabels.hem};
    if (hasSkirt(model)) placements.waist=stitchPlacementLabels.waist;
    if (model==='trousers') placements.waistband=stitchPlacementLabels.waistband;
    if (isBodice(model)) placements.neckline=stitchPlacementLabels.neckline;
    if (isSleeved(design)) placements.sleeves=stitchPlacementLabels.sleeves;
    return placements;
  }

  function newStitchDetail(style=stitchStyles[0],placement='hem') {
    const chosen=stitchStyles.includes(style)?style:stitchStyles[0];
    const edge=Object.hasOwn(stitchPlacementLabels,placement)?placement:'hem';
    return {style:chosen,placement:edge,...stitchDefaults[chosen]};
  }

  function stitchDetail(value,design) {
    const {style,placement}=value||{};
    if (!stitchStyles.includes(style) || !Object.hasOwn(design?stitchPlacements(design):stitchPlacementLabels,placement)) return null;
    return {
      style,placement,
      ...Object.fromEntries(Object.entries(stitchDefaults[style]).map(([key,fallback])=>[key,numeric(value,key,fallback,stitchLimits[key])]))
    };
  }

  function stitchDetails(design) {
    if (!Array.isArray(design?.stitchDetails)) return [];
    return design.stitchDetails.map(detail=>stitchDetail(detail,design)).filter(Boolean).slice(0,maxStitchDetails);
  }

  function stitchFoldDepth(detail) {
    if (detail?.style==='Pintucks') return .3;
    if (!Number.isFinite(detail?.spacing) || detail.style===stitchStyles[0]) return 0;
    return detail.spacing*(detail.style==='Knife pleats'?.5:.25);
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

  function asymmetryKeys(design,configured=false) {
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
    if (Number.isFinite((configured?configuredSeams(design):seams(design)).panelSeam)) keys.push('panelSeam');
    return keys;
  }

  function asymmetry(design,configured=false) {
    const keys=asymmetryKeys(design,configured);
    return Object.fromEntries(['left','right'].map(side=>[side,Object.fromEntries(keys.flatMap(key=>{
      const value=numeric(design.asymmetry?.[side],key,0,asymmetryLimits[key]);
      return value?[[key,value]]:[];
    }))]));
  }

  function configuredSeams(design) {
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

  function seams(design) {
    const settings=configuredSeams(design);
    const continuous=onePiece(design);
    if (continuous.waist) delete settings.waistSeam;
    if (continuous.panel) {
      delete settings.panelSeam;
      delete settings.panelAngle;
    }
    return settings;
  }

  function onePieceInstructions(design) {
    const continuous=onePiece(design);
    if (!Object.keys(continuous).length) return [];
    const settings=configuredSeams(design);
    const result=[];
    const support=selectedSupport(design);
    const width=design.strapWidth??supportWidth(support);
    const shape=strapShape(design);
    for (const [flag,side] of [['strapFront','Front'],['strapBack','Back']]) {
      if (!continuous[flag]) continue;
      const lower=side.toLowerCase();
      const endWidth=Number.isFinite(width)?` Keep the tested transition ${Number((width*shape[`strap${side}Taper`]/100).toFixed(3))} cm wide on the finished lines.`:'';
      const halter=support==='Halter strap';
      const remaining=halter?'Retain the neck fastening or the collar join from the fitted pattern.'
        :continuous.strapFront && continuous.strapBack?'Retain the joining line where the two extended panels meet over the shoulder.'
          :`Retain the strap’s attachment to the ${side==='Front'?'back':'front'} panel.`;
      result.push({visual:`designOnePieceStrap${side}`,text:`Cut the ${lower} strap and ${lower} bodice as one piece. On the fitted paper pattern, mark both ends and the center of the old joining line. Place the strap and bodice together with those marks aligned at the finished seam line. Overlap or fold away the old seam allowances at this join. Trace one continuous outer outline through the neckline and into the strap. Keep the inner and outer curves smooth.${endWidth} Carry over the grainline and any ${lower} fitting darts. ${remaining} Add the pattern’s allowances only at retained seams and finished edges. Trace a matching facing or lining. Baste a sample and check coverage and support while reaching before cutting the final fabric.`});
    }
    if (continuous.waist) {
      const amount=settings.waistSeam||0;
      const waist=amount?` Use the former join at ${Math.abs(amount)} cm ${amount<0?'above':'below'} the pattern waist as the alignment reference.`:' Use the fitted waistline as the alignment reference.';
      result.push({visual:'designOnePieceWaist',text:`Cut each bodice and matching skirt panel as one continuous piece.${waist} Draw the old waist stitching lines on both pieces. Match center front, center back, and the side references at each matching join on paper. Align each pair at the stitching line and fold away the old waist allowances. If the shapes leave a wedge, mark the finished waist width on the sample and rotate that shaping into a dart or a retained seam. Redraw the side and grain lines and preserve the closure opening. Trace the whole panel from upper edge to hem, add allowances to the remaining edges, and test the waist and hip fit in a toile.`});
    }
    if (continuous.panel) {
      const location=settings.panelSeam===centerFrontSeam?` at ${singleSeamLocation(settings.panelAngle)}`:'';
      result.push({visual:'designOnePiecePanel',text:`Replace the optional panel seam${location} with a continuous panel. Mark matching levels at the old seam on the fitted sample. Trace the adjoining paper pieces using their stitch lines and align the marks. Fold away the allowances along the former join and trace one outline. Transfer any shaping the seam supplied into a dart or a retained seam, then verify the same finished bust, waist or hip widths on the toile. Carry over the grainline, required opening and outer allowances. Trace left and right pieces separately where their shapes differ.`});
    }
    if (continuous.legOutseam) {
      result.push({visual:'designOnePieceLegOutseam',text:'Draft one continuous piece for each trouser leg. Mark the front and back outer-leg stitch lines and match the knee and hem levels on paper. If the pieces cannot meet smoothly with a straight, balanced grainline, start from a fitted no-outseam trouser block and transfer the desired leg shape to it. Move required waist shaping into darts or the waistband. Trace around the combined leg and keep the inseam, front and back rise, crotch curve, waistband marks and closure opening. Add the pattern’s allowances to those remaining edges and the hem. Cut one left and one right leg as mirrored pieces, or use separate left and right paper patterns for an asymmetrical fit. Check hip and thigh room, knee position and stride in a toile.'});
    }
    return result;
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
    const referencePoints=paired?(onePiece(design).legOutseam?'the front, back, inseam and outer-leg reference of each leg':'the front, back, inseam and outseam of each leg'):'center front, center back and both sides';
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
      const opening=casingClosure(closure)
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
    const continuous=onePiece(design);
    const placement=design.strapPlacement?` Move the attachment ${Math.abs(design.strapPlacement)} cm ${design.strapPlacement<0?'inward':'outward'} from the starting shoulder mark.`:'';
    const route=halter?'Fit the strap around the neck from the front attachment points.':support==='One-shoulder'
      ?`Fit from the front bodice to the back bodice over the wearer’s ${selectedShoulderSide(design)} shoulder.`:'Fit from the front bodice to the back bodice over each shoulder.';
    const joins=shape.strapFrontJoin || shape.strapFrontAngle || !halter && (shape.strapBackJoin || shape.strapBackAngle);
    const ends=supportsStrapShape(support)?[[continuous.strapFront?'Front blend':'Front attachment',shape.strapFrontCurve,shape.strapFrontTaper,shape.strapFrontJoin,shape.strapFrontAngle,continuous.strapFront],
      [halter?'Back collar segment':continuous.strapBack?'Back blend':'Back attachment',shape.strapBackCurve,shape.strapBackTaper,shape.strapBackJoin,shape.strapBackAngle,continuous.strapBack]].map(([name,curve,taper,depth,angle,blend])=>{
      const shift=curve?`Move its centerline ${Math.abs(curve)} cm ${curve>0?'toward the neckline':'away from the neckline'} from the starting mark.`:'Keep its starting centerline.';
      const endWidth=Number.isFinite(width)?` (${Number((width*taper/100).toFixed(3))} cm finished)`:'';
      const from=depth?`${depth} cm down the fabric from the starting attachment edge`:blend?'from the starting attachment edge':'from the starting edge, with no overlap added';
      const join=joins && name!=='Back collar segment'?` At the midpoint, measure ${from}. ${angle?`Tilt the ${blend?'blend reference':'joining line'} ${Math.abs(angle)}° from the crosswise line, with the ${angle>0?'neckline':'outer'} side extending farther.`:`Keep the ${blend?'blend reference':'joining line'} crosswise.`}`:'';
      return `${name} uses ${taper}% of the ${base}${endWidth}. ${shift}${join}`;
    }).join(' '):'';
    const backSpacing=supportsStrapShape(support)?shape.strapBackSpacing:0;
    const backShift=supportsStrapShape(support)?shape.strapBackShift:0;
    const spacing=backSpacing?` Change the distance between the back attachment centers by ${Math.abs(backSpacing)} cm total. Move each mark ${Math.abs(backSpacing)/2} cm ${backSpacing>0?'out':'in'} from its original position.`:'';
    const shift=backShift?` Shift the back attachment ${support==='One-shoulder'?'mark':'marks'} ${Math.abs(backShift)} cm toward the wearer’s ${backShift>0?'left':'right'}.`:'';
    const integral=continuous.strapFront||continuous.strapBack;
    const joinCheck=joins?(integral?' Transfer the blend reference to the continuous panel. Add a joining allowance wherever two separate pieces still meet.':' Transfer the complete joining lines to the matching pieces. Check that the two ends of each join sit on fabric at the fitted edge before adding the joining allowance.'):'';
    const allowances=integral?' Add the pattern’s allowance to the retained joins, neckline and armhole edges. Baste the remaining assembly and check reach and support.':' Add the pattern’s attachment and edge allowances. Baste, check reach and support, then reinforce the ends.';
    return {visual:'strap',text:`Fit the ${support.toLowerCase()} ${Number.isFinite(width)?`at ${width} cm wide, finished, at the ${halter?'neck reference':'shoulder'}.`:'and mark its tested width.'} ${route}${placement}${ends?` ${ends} Blend each edge into the marked reference width.`:''}${spacing}${shift}${joinCheck} Mark the worn length.${allowances}`};
  }

  function strapCornerInstructions(design) {
    const corners=strapCorners(design);
    const labels=strapCornerChoices(design);
    const machine='On the Brother CP2160F, test centered straight stitch 01 with foot J at 2.5 mm on the planned woven layers. If the edge must stretch, test a compatible stretch stitch first.';
    return Object.entries(corners).map(([key,{style,size}])=>{
      const chamfer=style==='Chamfer';
      const shape=chamfer?'Use a ruler to join the two marks with a straight diagonal. Keep the marks as the ends of the diagonal.'
        :'Draw a smooth arc between the two marks. At each mark, blend the new curve into the direction of the existing edge.';
      const stitch=chamfer?'Sew to the first mark. Stop with the needle down, lift the presser foot, pivot to the diagonal and lower the foot. Stitch to the second mark, then pivot again to follow the next edge.'
        :'Stitch the curve slowly. For a tight curve, test a shorter stitch length and turn the fabric gradually with the needle down whenever you need to reposition it.';
      const trim=chamfer?'Trim excess allowance at outward points and clip inward angles toward the stitching. Keep the stitches intact.'
        :'Clip the allowance of an inward curve or notch excess allowance along an outward curve. Stop short of the stitches.';
      return {key,visual:'designStrapCorner',text:`${labels[key]} · ${style} · ${size} cm. On the fitted paper pattern, extend the two finished edge lines until they meet. Measure ${size} cm away from that point along each edge and mark both points. ${shape} Check the remaining strap width on a sample and try it on while reaching. Trace a matching facing or lining. Add the pattern’s seam allowance outside the new stitch line on both pieces before cutting. ${machine} ${stitch} ${trim} Turn, press and check that the new edge lies flat.`};
    });
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
    const main=Object.entries(laceTrims(design)).map(([edge,trim])=>({edge,label:placements[edge],trim:edge==='seams'?effectiveSeamLace(design):trim}));
    const layerHems=layers(design).flatMap((layer,index)=>layer.laceTrim
      ?[{edge:'layer',label:`Layer ${index+1} ${layer.kind.toLowerCase()} hem`,trim:layer.laceTrim}]:[]);
    return [...main,...layerHems];
  }

  function laceInstructions(design) {
    return laceTrimTargets(design).filter(({edge})=>edge!=='pockets'||!Array.isArray(design.pocketDetails)).map(({edge,label,trim})=>{
      const flexible=trim.style==='Stretch lace';
      const settings=flexible
        ?'Test zigzag 04 with foot J on the Brother CP2160F using a compatible stretch or ballpoint needle. After stitching, stretch the test piece and check that the thread holds and the edge recovers.'
        :'Test centered straight stitch 01 with foot J and 2.5 mm stitch length on the Brother CP2160F if the attachment rail and garment are both stable. If the edge must stretch, test zigzag 04 with foot J on the actual layers and use trim that stretches far enough.';
      let placement;
      if (edge==='pockets') {
        placement=design.pocket==='Patch pockets'
          ?'Finish each pocket’s top edge as the pattern directs and press the side turnbacks. Lay the pocket flat with its right side up, separate from the garment panel. Measure the finished opening between its corners. Position the lace rail on the pocket face just below the opening. Match motifs on the two pockets. Tuck the ends into the side turnbacks and baste them. Sew through the pocket fabric without catching its folded edge closed.'
          :'After sewing the side seams and pocket bags, open each pocket and measure between the two reinforced ends. Lay lace on the visible lip of the opening. Fold each trim end under at the reinforcement mark. Pin back the bag and the other lip. Baste through the visible lip alone so a hand can pass into the bag.';
      } else if (edge==='waistband') {
        placement='Finish the waistband and try it on before measuring the top edge with the closure fastened. Place the lace rail on the outer face just below the top edge. Mark separate ends at any closure. On an elastic or drawstring casing, use hand tacks or catch the outer layer only. Check that the elastic can slide or stretch and the drawstring holes stay clear. Test the trim over the hips before securing a continuous pull-on band.';
      } else if (edge==='seams') {
        const seam=laceSeamPlacement(design);
        const route=seam.kind==='single'?singleSeamLocation(seam.angle):seam.kind==='panels'?'the two marked front panel seams':'the side seams';
        const alignment=trim.alignment==='center'?'Center the lace over the seam line.':`With the garment right side out and the upper edge up, place the band to the ${trim.alignment} of the seam. Align its nearer edge along the seam line.`;
        const matching=trim.alignment==='center' && trim.matchPocket && seamLaceCanMatch(design)
          ?' Use the same lace as the in-seam pocket lip. Lay out the repeats so the motif and rail align above and below the opening. Cut separate lengths at the opening ends so the lace follows the seam without bridging the pocket mouth.':'';
        placement=`Sew and press the structural seams first. On the right side, mark the trim route along ${route}. Measure each exposed section. ${alignment}${matching} Fold or finish the trim ends at the ends of each section. Keep zipper teeth, pocket mouths and any vent clear. Baste the two lace edges flat before sewing or hand-tacking them to the outer fabric.`;
      } else {
        placement='Finish and fit the fabric edge first. With a flexible tape, measure the stitching path and mark matching points, joins and any closure. Match motifs on paired edges. Lay the right side of the lace outward and place its solid sewing rail just over the finished edge. Let the decorative part extend beyond the garment. Clip and baste the rail.';
        if (edge==='hem' && slits(design).length) placement+=' Secure the lace ends separately where a slit meets the hem so the opening stays clear.';
      }
      return {edge,visual:'designLaceTrim',text:`${label}. Apply ${trim.style.toLowerCase()} ${trim.width} cm wide (${trim.color}). ${placement} Allow spare trim for pattern repeats, joins and a test piece. ${settings} With the lace lying flat, sew the basted path. Remove visible basting and check that the edge, seam, closure or pocket opens and moves as intended.`};
    });
  }

  function customPocketInstructions(design) {
    if (!Array.isArray(design?.pocketDetails)) return [];
    const trim=laceTrim(design.laceTrims?.pockets);
    const lace=trim?` With the opening fitted, use ${trim.width} cm wide ${trim.style.toLowerCase()}.`:'';
    const machine='On the Brother CP2160F, test straight stitch 01 with foot J at 2.5 mm on stable woven scraps of the same thickness. If using stretch fabric, test a compatible stretch stitch or narrow zigzag and check the opening recovers.';
    return pocketDetails(design).map((pocket,index)=>{
      const {type,section,height,width,depth,opening,angle,rotation,shape}=pocket;
      const inseam=type==='inseam';
      const range=section!=='body'?'the top of the selected leg just below the crotch to its finished hem'
        :design.model==='trousers'?'the waistband top to the bottom of the seat section'
          :design.model==='skirt'?'the waistband’s upper edge to the finished hem':'the upper edge of the chosen body panel to its finished hem';
      const rotationText=rotation?` Looking at the right side of the pocket, rotate its template ${Math.abs(rotation)}° ${rotation>0?'clockwise':'counterclockwise'}.`:'';
      const share=Number((height/100).toFixed(4));
      const place=`Pocket ${index+1} · ${pocketTypes[type]}. ${pocketPositionLabel(pocket)}. On the fitted sample, mark ${singleSeamLocation(angle)}. Measure down the garment from ${range} at that position. Multiply that distance by ${share} to locate the pocket’s upper edge.${rotationText}`;
      const corners=shape==='Rounded'?'Round the lower corners in a smooth curve.':shape==='Pointed'?'Draw the two lower edges toward the centered point at full depth.':'Keep the lower corners square.';
      if (inseam) {
        const trimLip=trim?`${lace} Lay the trim on the outer lip after the side seam and bag are joined. Fold its ends under inside the reinforced marks, baste and sew through the lip only. Check that the mouth still opens.`:'';
        return {visual:'designPocketInseam',text:`${place} Mark the top stop on the side seam and measure ${opening} cm down the seam for the bottom stop. Draft two matching bag pieces ${width} cm wide inward from the side seam and ${depth} cm deep. ${corners} Check that the whole bag fits on the tested panel and clears the closure. Mark both stops on the paper and add the pattern’s seam allowances to the bag edges. Cut and mark both pieces and stabilize the opening on the garment panels. ${machine} Put one bag piece and one garment edge right sides together. Match their stops, stitch the opening, press the bag away from the garment, and repeat on the other edge. Join the side seam above and below the two stops. Match and stitch around the bag edges. Reinforce both stops without closing the mouth.${trimLip} Slide a hand inside and check access, depth and seam clearance on the wearer.`};
      }
      const closed=Number(((width-opening)/2).toFixed(3));
      const closeEnds=closed?` Measure ${closed} cm inward from each upper corner and mark the ends of the ${opening} cm centered opening. Secure the top edges only outside those marks.`:' Keep the full top edge open.';
      const trimTop=trim?`${lace} Position the lace rail just below the finished opening and tuck its ends under. Baste and stitch it on the flat pocket before attaching the pocket to the garment.`:'';
      return {visual:'designPocketPatch',text:`${place} Trace a ${width} cm wide by ${depth} cm deep finished pocket with a ${opening} cm top opening. ${corners} Check the template fits inside the selected section and clears any seams or closures. Draw the fold line at the top and add the pattern’s top finish and side and lower turnbacks outside the finished lines. Cut the fabric and transfer the marks. ${machine} Fold and press the top allowance inward, stitch the top finish, then turn and press the sides and bottom around the paper template.${trimTop} Transfer the tested placement to the flat garment panel. Pin the pocket there and check reach. Topstitch around the shape and reinforce both top ends.${closeEnds} Check the opening length again before joining the garment panels.`};
    });
  }

  function slitInstructions(design) {
    const settings='On the Brother CP2160F, test straight stitch 01 with foot J and a 2.5 mm length on a stable woven sample. For a stretch edge, test a compatible stretch stitch or narrow zigzag 04 on matching layers.';
    return slits(design).map((slit,index)=>{
      const {length,opening,section}=slit;
      const halfWidth=Number((opening/2).toFixed(3));
      const which=section==='body'?'selected panel':'selected leg';
      const marks=opening?`Mark the two finished hem corners ${halfWidth} cm to each side of the center mark. Join each corner to the top stop to make a ${opening} cm opening across the finished hem.`
        :'Mark both finished hem corners at the center mark. Draw a straight slit to the top stop, with a 0 cm gap when the edges meet at rest.';
      const label=`Slit ${index+1} · ${slitLabel(slit)}.`;
      return {visual:'designSlit',text:`${label} On the fitted ${which}, mark the finished hem, then mark the slit center at the indicated location. Measure ${length} cm up from that finished hem line to the top stop. ${marks} Check the opening while sitting or walking and transfer the hem mark and stop to paper. At a retained seam, keep the section below the top stop open and finish each edge separately. For a slit in an unbroken panel, trace a matching facing and stabilize the top stop. Mark the finished lines, the cut line inside the opening and the pattern’s seam allowances on the paper. ${settings} Baste and stitch the facing around the marked opening. Clip inside the allowance up toward the reinforced stop, then turn and press the facing. Fold the hem separately on both sides and secure the facing and top stop. Measure the ${length} cm finished length and ${opening} cm hem gap again. Keep any trim ends and hems free of the opening.`};
    });
  }

  function attachmentSeamInstructions(design) {
    const rows=attachmentSeams(design).map((seam,index)=>({...seam,index}));
    const reference=attachmentSeamReference(design).toLowerCase();
    const seams=rows.map(({height,ruffle,index})=>{
      const fraction=Number((height/100).toFixed(4));
      const border=height===0||height===100;
      const draft=ruffle
        ?'Transfer the line and its center front, center back and side marks to the main garment. Use this line for mounting and keep the main fabric continuous there.'
        :border
          ?'Transfer the line to the upper-edge or hem finish at this boundary. Use the existing finished edge and keep the adjacent pattern piece whole.'
          :'If an existing seam follows this line, use that seam. For a new sewn join, trace the upper and lower portions of each paper piece. Copy their grainlines and matching marks, add the pattern’s seam allowance to both edges of the new cut, then cut and baste the matching sections together. Press and finish the join as the fabric requires.';
      return {index,visual:'designAttachmentSeam',text:`Attachment seam ${index+1} · ${height}% down. On the fitted sample, measure straight down from the ${reference} to the main finished hem at each side. Multiply each vertical distance by ${fraction} and mark that amount down from its upper reference. If the two marks are at different heights, use a level halfway between them. Use the same level around the shell and check that there is fabric at each planned attachment point. ${draft} Keep zipper teeth, button openings, pocket mouths and slits clear.`};
    });
    const ruffles=rows.filter(row=>row.ruffle).sort((a,b)=>b.height-a.height).map(({height,ruffle,index})=>{
      const {depth,fullness}=ruffle;
      return {index,visual:'designAttachmentRuffle',text:`Attachment ruffle ${index+1} · ${depth} cm drop at ${fullness}× fullness. Fit and baste the main shell first. Measure each available section of the ${height}% attachment line with a flexible tape. Leave separate ends at openings. Multiply that length by ${fullness} to get the flat strip length before allowances. Add seam and end allowances to both ends of each strip as needed. Mark the ${depth} cm drop from the mounting stitch line to the finished free edge, then add the top seam and bottom finishing allowances. Cut the strips and join any lengths. Finish the free edges before gathering. Mark quarters on each strip and on its attachment section. For stable woven fabric, on the Brother CP2160F, use straight stitch 01 with foot J at 4–5 mm for two parallel gathering rows within the top allowance. Leave long tails without locking the ends. Pull the bobbin threads evenly and match the quarter marks before clipping in between. Start with the lowest ruffle and work upward. With right sides together at the attachment line and the ruffle pointing up, baste each gathered section to the outer garment, keeping the lining and openings free. Test straight stitch 01 at 2.5 mm on the actual layers or a compatible stretch stitch if the seam needs to give. Stitch the mounting line, flip the ruffle down, press, and remove visible basting. Check the drop, overlap and clearance while the garment is worn.`};
    });
    return [...seams,...ruffles];
  }

  const stitchVisuals = {
    'Gathered ruffle':'designGatheredRuffle','Knife pleats':'designKnifePleats','Box pleats':'designBoxPleats',
    'Inverted pleats':'designInvertedPleats',Pintucks:'designPintucks'
  };

  function stitchInstructions(design) {
    const placements=stitchPlacements(design);
    const keepsSlits=slits(design).length?' Finish each section separately at a slit so the trim stays clear of the opening.':'';
    const fittedPaths={
      waist:'Mark and measure the waist reference on the fitted sample, using the marked waist join when present.',
      waistband:'Mark and measure the finished waistband top on the fitted sample. Leave the casing opening, eyelets or fastener clear.',
      neckline:'Measure the fitted neckline path and mark its front and back. Keep straps, closures and head clearance free.',
      hem:(design.model==='trousers'?'Measure the finished edge around each leg separately. Keep the legs matched unless the plan calls for an asymmetry.':'Measure the finished hem line. Work along the actual curve and points.')+keepsSlits,
      sleeves:'Mark and measure the opening on each sleeve separately. Keep any cuff opening or placket free.'
    };
    const machine='On the Brother CP2160F, test centered straight stitch 01 with foot J and 2.5 mm stitch length on the planned woven layers. If the edge needs to stretch, test a compatible stretch stitch or zigzag 04 and check recovery on scrap first.';
    return stitchDetails(design).map((detail,index)=>{
      const {style,placement,depth,spacing,fullness}=detail;
      const pintucks=style==='Pintucks';
      const visual=stitchVisuals[style];
      const path=fittedPaths[placement];
      const prefix=`Stitched detail ${index+1} · ${placements[placement]}. ${style}. ${path}`;
      if (style===stitchStyles[0]) {
        return {placement,visual,text:`${prefix} The finished drop is ${depth} cm. On paper, multiply the measured attachment length by ${fullness} for the flat ruffle length, then add joining and end allowances. Add the upper seam and lower finish allowances to the ${depth} cm depth. Cut, join and finish the outer edge of the strip. Quarter-mark the strip and the attachment path. On stable woven fabric, set straight stitch 01 with foot J to 4–5 mm and sew two parallel rows inside the attachment allowance. Leave long thread tails and skip backstitching. Hold each pair of bobbin threads and slide the fabric toward the quarter marks. Clip matching marks together first, then even out the gathers. ${machine} Baste and stitch the ruffle in place, remove any basting that shows on the right side, and check the drop while worn.`};
      }
      const fold=stitchFoldDepth(detail);
      const foldLabel=Number(fold.toFixed(3));
      if (pintucks) {
        const direction=placement==='hem'?'up from the finished hem':placement==='sleeves'?'toward the sleeve cap from the sleeve opening':'down from the marked attachment line';
        return {placement,visual,prepare:true,text:`${prefix} Mark a ${depth} cm stitching length ${direction}, with centers spaced ${spacing} cm apart on the finished panel. On a scrap first, mark, fold and stitch one tuck ${foldLabel} cm from the folded edge, then press it over. Add 0.6 cm of fabric width per tuck to the paper plan. Cut the affected panel oversize, mark the folds with a removable marker and keep the grain direction consistent. ${machine} Crease each fold wrong sides together, lower the presser foot at the start mark and stitch the measured line. Stop at the end mark and secure the thread tails. Press tucks evenly, double-check the finished spacing, then lay the paper pattern back on the panel, transfer the marks and cut the final outline.`};
      }
      const layout=style==='Knife pleats'
        ?`Fold each pleat ${foldLabel} cm deep in the same direction. Bring the fold line to its matching placement line, then press with the paper pattern’s grain aligned.`
        :`Make two ${foldLabel} cm folds per repeat. ${style==='Box pleats'?'Fold the two crease lines outward away from their shared center on the right side.':'Bring the two crease lines inward to meet at their shared center on the right side.'} Press each set and compare it to the marked spacing.`;
      return {placement,visual,text:`${prefix} Draft a band ${depth} cm deep after finishing. Add the joining and hem allowances to that width. Mark repeat centers ${spacing} cm apart at the finished attachment line, allowing ${spacing} cm of extra cloth per repeat for the folds. Lay out the repeats from the middle and share any remainder between the ends while keeping closure gaps. Cut a scrap band and fold a test repeat. ${layout} After confirming the flat length, cut and join the band, finish the free edge, transfer the fold marks, and clip them in sequence. ${machine} Baste across the tops of the folds to hold them, match the band’s marks to the garment, then sew the attachment line. Recheck ${spacing} cm center spacing and ${depth} cm finished drop before the final press.`};
    });
  }
  function instructions(design,model) {
    const spec = silhouettes[design.model];
    const style = design.cut.toLowerCase();
    const list = [];
    const add = (visual,text) => list.push({visual,text});
    const layerSteps=layerInstructions(design);
    const stitchSteps=stitchInstructions(design);
    const laceSteps=laceInstructions(design);
    const attachmentSteps=attachmentSeamInstructions(design);
    const continuous=onePiece(design);
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
      list.push(...strapCornerInstructions(design));
      if (isSleeved(design)) add('sleeve',`Trace a sleeve for the matching armhole. Mark the ${design.sleeve.toLowerCase()} sleeve shape and finished length. ${sleeveDrafting(design.sleeve)} Baste it into the test garment and check reach before cutting the final fabric.`);
    } else if (design.model==='trousers') {
      const edges=continuous.legOutseam?'check the outer-leg balance and walk the inseam and rise stitching lines':'walk the inseams and outseams';
      add('rise',`Mark the ${(design.rise||rises[1]).toLowerCase()} on the toile and mark the ${style} silhouette at the thigh, knee and leg opening. Change the knee and hem widths gradually on the front and back, keeping the grainline straight. Check sitting and stride, then ${edges} before cutting.`);
    }
    if (design.tone===tones[1]) {
      add('colorBlock','Mark a lower-panel seam on the traced pieces at the same height wherever panels meet. Split the pattern there, add matching seam allowances to both new edges and copy the grainline. Sew the contrast lower panels to their matching upper pieces before joining the garment seams.');
    }
    list.push(...onePieceInstructions(design));
    list.push(...layerSteps.draft);
    list.push(...attachmentSteps.filter(step=>step.visual==='designAttachmentSeam'));
    list.push(...stitchSteps.filter(step=>step.prepare));
    add('grain',`Prewash the ${design.fabric.toLowerCase()} as appropriate, press it flat and lay out the trued pieces on grain. Measure your final layout against the fabric width before buying or cutting. Cut all pieces and transfer matching marks, pocket positions and closure marks.`);
    list.push(...layerSteps.cut);
    if (Array.isArray(design.pocketDetails)) {
      list.push(...customPocketInstructions(design));
    } else if (design.pocket==='Patch pockets') {
      const pocketLace=laceSteps.find(step=>step.edge==='pockets');
      if (pocketLace) {
        list.push(pocketLace);
        add('pocketPatch','Mark matching pocket positions on the fitted sample and transfer them to the flat panels. Lay each lace-trimmed pocket on its marks. Turn and press the remaining allowances, then pin or baste the sides and bottom. Topstitch those edges and reinforce the top corners. Keep the lace-trimmed top edge open.');
      } else add('pocketPatch','Mark matching pocket positions on the first fitting. Finish the pocket top edge, turn and press the remaining allowances, then topstitch the pockets onto the flat garment panels before assembly.');
    } else if (design.pocket==='In-seam pockets') add('pocket','Mark paired openings on the side seams. Sew the pocket bags to the matching front and back opening lines before joining the side seams. Join the bags, reinforce each opening end and check that the pockets sit flat.');
    if (isBodice(design.model)) {
      if (strapless) {
        add('seam','Join the fitted bodice panels and preserve the marked upper edge. Baste the intended closure at its marks for the trial fitting, leaving the opening accessible for final construction.');
        list.push(...upperEdge.slice(1,-1));
      } else if (continuous.strapFront||continuous.strapBack) {
        const support=selectedSupport(design);
        const rest=support==='Halter strap'?'Baste the fitted collar join or halter fastening.'
          :continuous.strapFront&&continuous.strapBack?'Match the extended ends of the front and back panels at the remaining shoulder seams and baste.'
            :`Baste the separate attachment of the strap to the ${continuous.strapFront?'back':'front'} panel.`;
        add('facing',`${rest} Baste the other body seams and test ease and coverage. Finish the retained joins as fitted. Trace and attach the matching facing or binding along the full continuous edge. Understitch or secure its inner edge as appropriate.`);
      } else add('shoulder','Sew and press the shoulder seams. Baste body seams and confirm ease and balance. Attach the facing or binding and understitch or secure its inner edge as appropriate.');
      if (isSleeved(design)) add('armhole','Match each sleeve’s marked notches to its own armhole and baste it. Try on the garment and check movement and the intended fit on both sides, then attach and finish the sleeves.');
    } else {
      add(design.model==='trousers'?'rise':'seam',design.model==='trousers'
        ? continuous.legOutseam?'Fold each continuous leg right sides together. Bring its two inseam edges together and match the knee and hem marks. Baste the inseams and the crotch seam, leaving the closure opening. Check rise and stride. On stable woven fabric, test Brother CP2160F straight stitch 01 with foot J at 2.5 mm on matching scrap. Stitch and finish the remaining seams.'
          :'Baste the inseams, side seams and crotch seam and check the rise and stride. Stitch and finish confirmed seams, leaving the opening required for the closure.'
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
      'Elastic waistband':['band','Choose a pull-on opening that passes over the hips. Sew a waistband casing, insert the elastic and fit it, then join its ends securely and close the casing.'],
      'Drawstring waistband':['band','Fit the open waist so it passes over the hips. Reinforce and finish two drawstring openings on the outer waistband, sew the casing, thread the drawstring, and secure the cord ends. Pull the drawstring even and check the tie on the wearer.']
    };
    const {panelZipper,panelAngle}=seams(design);
    const closure=effectiveClosure(design);
    if (Number.isFinite(panelZipper)) {
      const foot=closure==='Invisible zipper'?'Use a compatible invisible zipper foot as directed by the pattern.':'Use zipper foot I on the Brother CP2160F and check needle clearance by turning the handwheel before sewing.';
      add('designSinglePanelZipper',`Install the ${closure.toLowerCase()} at ${singleSeamLocation(panelAngle)}. Mark ${panelZipper} cm along the seam from the finished upper edge and leave that opening free. Stabilize the opening if the fabric stretches. Baste each zipper tape to its marked edge and close the zipper to check that the upper edges and any crossing seams line up. ${foot} Sew the tapes in place, close the seam below the bottom stop, and test that the zipper opens fully.`);
    } else {
      const fastenerSteps=typeof garmentFasteners==='undefined'?[]:garmentFasteners.instructions(design);
      if (fastenerSteps.length) list.push(...fastenerSteps);
      else add(...(closureSteps[closure] || closureSteps[closureChoices(design.model)[0]]));
    }
    if (strapless) list.push(upperEdge.at(-1));
    if (!isBodice(design.model) && !casingClosure(closure)) add('band','Finish the top edge with the chosen waistband or waist facing. Test the closure and check that the waist stays level when sitting.');
    list.push(...stitchSteps.filter(step=>!step.prepare && step.placement!=='hem'));
    list.push(...layerSteps.assemble);
    const hem = {
      'Double-fold hem':'Turn the raw edge twice, press and stitch. Check that the hem lies smoothly without ripples.',
      'Faced hem':'Trace a shaped facing that matches the hem curve. Stitch it to the lower edge, grade the seam, turn it inside and secure the upper edge.',
      'Contrast hem band':'Cut a matching band in contrast fabric. Test the finished band depth on the wearer, then join the band, press the seam and finish its inside edge.'
    };
    list.push(...slitInstructions(design));
    list.push(...attachmentSteps.filter(step=>step.visual==='designAttachmentRuffle'));
    if (hemShape.text) add('finish','Let the hem hang so any bias edges settle. Recheck the finished edge at each marked point on the wearer, and test the finish on a scrap cut at the same angle before trimming. '+hem[design.finish]);
    else add('finish','Mark a level hem during a final fitting. '+hem[design.finish]);
    list.push(...layerSteps.hem);
    list.push(...stitchSteps.filter(step=>!step.prepare && step.placement==='hem'));
    list.push(...laceSteps.filter(step=>step.edge!=='pockets'||design.pocket!=='Patch pockets'));
    return list;
  }

  function make(design,name,model) {
    const spec = silhouettes[design.model];
    const garmentLayers=layers(design);
    design={...design};
    if (Array.isArray(design.pocketDetails)) design.pocketDetails=pocketDetails(design);
    if (Array.isArray(design.slits)) design.slits=slits(design);
    else delete design.slits;
    if (Array.isArray(design.attachmentSeams) && supportsAttachmentSeams(design.model)) design.attachmentSeams=attachmentSeams(design);
    else delete design.attachmentSeams;
    const continuous=onePiece(design);
    if (Object.keys(continuous).length) design.onePiece=continuous;
    else delete design.onePiece;
    const seamSettings=configuredSeams(design);
    if (Object.keys(seamSettings).length) design.seams=seamSettings;
    else delete design.seams;
    if (hasSkirt(design.model) || Array.isArray(design.layers)) design.layers=garmentLayers;
    else delete design.layers;
    Object.assign(design,hemContour(hasSkirt(design.model)?design:undefined));
    const sideSettings=asymmetry(design,true);
    if (Object.values(sideSettings).some(side=>Object.keys(side).length)) design.asymmetry=sideSettings;
    else delete design.asymmetry;
    const support=selectedSupport(design);
    if (support==='One-shoulder') design.shoulderSide=selectedShoulderSide(design);
    else delete design.shoulderSide;
    const corners=strapCorners(design);
    if (Object.keys(corners).length) design.strapCorners=corners;
    else delete design.strapCorners;
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
    const details=stitchDetails(design);
    if (details.length) design.stitchDetails=details;
    else delete design.stitchDetails;
    if (typeof garmentFasteners!=='undefined') {
      const fastener=garmentFasteners.saved(design);
      if (fastener) design.fastener=fastener;
      else delete design.fastener;
    }
    const list = instructions(design,model);
    const closure=effectiveClosure(design);
    const tools = ['Sewing machine','iron','fabric shears','measuring tape','ruler','pins or clips','tailor’s chalk','matching thread','pattern paper'];
    if (typeof garmentFasteners!=='undefined' && closure===design.closure) tools.push(...garmentFasteners.tools(design));
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
    if (details.length) tools.push('foot J','removable fabric marker','hand-basting needle','press cloth');
    if (design.strapCorners) tools.push('foot J','removable fabric marker','small sharp scissors');
    if (design.pocketDetails?.length) tools.push('foot J','removable fabric marker','press cloth');
    if (design.slits?.length) tools.push('foot J','removable fabric marker','facing and lightweight reinforcement');
    const attachmentRuffles=design.attachmentSeams?.some(seam=>seam.ruffle);
    if (attachmentRuffles) tools.push('foot J','hand-basting needle','flexible measuring tape','removable fabric marker');
    const layerFabrics=garmentLayers.length?' Layers: '+garmentLayers.map((layer,index)=>`${index+1} ${layer.kind.toLowerCase()} in ${layer.fabric}`).join(', ')+'.':'';
    const trimMaterials=trimTargets.length?' '+trimTargets.map(({label,trim})=>`Use ${trim.style.toLowerCase()} ${trim.width} cm wide (${trim.color}) for ${label.toLowerCase()}.`).join(' ')+' Measure each finished edge and allow spare for motif matching, joins and a test piece.':'';
    const detailMaterials=details.length?' Allow fabric for the selected ruffle fullness, folded bands or pintuck take-up. Measure the fitted attachment paths and add seam and hem allowances before finalizing the layout.':'';
    const pocketMaterials=Array.isArray(design.pocketDetails) && hasInseamPocket(design)?' Allow lightweight pocketing and opening reinforcement for each in-seam pocket.':'';
    const attachmentMaterials=attachmentRuffles?' Allow fabric for the attached ruffles. Measure the fitted paths and multiply each by its chosen fullness before adding joining and hem allowances.':'';
    return {name,model:baseModel(design.model),sleeves:isSleeved(design),type:spec.type,
      cut:design.cut+' '+spec.label.toLowerCase()+' · '+design.length.toLowerCase()+(hasFairyHem(design)?' · fairy hem':''),
      level:'Intermediate',color:design.primary,design,
      fabric:design.fabric+(isContrast(design)?' and coordinating contrast fabric':'')+'.'+layerFabrics+trimMaterials+detailMaterials+pocketMaterials+attachmentMaterials+' Confirm yardage after laying out your drafted pieces.',
      tools:[...new Set(tools)].join(', '),steps:list.map(entry=>entry.text),visuals:list.map(entry=>entry.visual)};
  }

  return {silhouettes,necklines,sleeves,fabrics,closures,pockets,finishes,hemStyles,hasFairyHem,hemDrop,hemContourLimits,hemContour,hemOffsetAt,tones,backs,rises,
    laceStyles,laceWidthLimits,newLaceTrim,laceTrim,lacePlacements,laceTrims,laceSeamPlacement,seamLaceAlignments,seamLaceTrim,seamLaceCanMatch,effectiveSeamLace,
    slitLimits,slitSections,slitDetail,slits,newSlit,slitLabel,slitInstructions,
    attachmentSeamLimits,attachmentRuffleDefaults,supportsAttachmentSeams,attachmentSeam,attachmentSeams,newAttachmentSeam,newAttachmentSeamTiers,
    attachmentSeamReference,attachmentSeamInstructions,
    stitchStyles,stitchLimits,maxStitchDetails,stitchPlacements,newStitchDetail,stitchDetail,stitchDetails,stitchFoldDepth,
    layerKinds,layerKindChoices,layerStartsAt,layerIsInner,layerLimits,maxLayers,layers,newLayer,layerSweepAt,layerAttachmentLimits,layerAttachmentAt,
    seamKeys,seamLimits,configuredSeams,seams,onePieceChoices,onePiece,onePieceInstructions,asymmetryLimits,asymmetryKeys,asymmetry,
    centerFrontSeam,panelAngleLimits,panelSeamPaths,panelSeamSnapOffset,singleSeamAngle,singleSeamLocation,singleSeamGuide,
    panelZipperLimits,panelZipperDefault,panelZipperKinds,panelZipperEligible,panelZipperStyle,effectiveClosure,
    baseModel,isBodice,isContrast,isSleeved,closureChoices,supportChoices,selectedSupport,straplessSupportChoices,selectedStraplessSupport,
    selectedShoulderSide,supportWidth,supportsStrapShape,strapShapeLimits,strapShapeChoices,strapShape,
    strapCornerStyles,strapCornerSizeLimits,strapCornerDefaultSize,strapCornerChoices,strapCorner,strapCorners,strapCornerInstructions,
    selectedBack,pocketChoices,pocketChoicesForDesign,pocketSections,pocketLimits,pocketShapes,pocketDetail,pocketDetails,newPocket,hasInseamPocket,pocketPositionLabel,customPocketInstructions,
    defaults,measurements,straplessInstructions,straplessTools,strapInstructions,sleeveDrafting,laceInstructions,stitchInstructions,instructions,make};
})();
