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
  const sleeves = ['Sleeveless','Cap','Short','Elbow','Long','Puff','Bell'];
  const fabrics = ['Cotton poplin','Linen blend','Medium-weight twill','Fluid woven crepe'];
  const closures = ['Invisible zipper','Back button and loop','Front buttons','Elastic waistband','Side zipper','Zip fly',
    'Button fly','Wrap ties','Separating zipper','Back lacing','Front busk'];
  const backs = ['Classic back','Low scoop back','V-back','Square back','Racerback','Open back'];
  const supports = ['Integrated shoulders','Wide straps','Narrow straps','Spaghetti straps','Halter strap','One-shoulder','Strapless'];
  const rises = ['Low rise','Natural rise','High rise'];
  const pockets = ['None','Patch pockets','In-seam pockets'];
  const finishes = ['Double-fold hem','Faced hem','Contrast hem band'];
  const hemStyles = ['Level','Fairy / handkerchief'];
  const tones = ['Solid','Contrast lower panel'];
  const layerKinds = ['Overskirt','Underskirt','Tier','Ruffle'];
  const maxLayers = 5;
  const layerLimits = {hemOffset:[-65,65],sweep:[0,240],opacity:[20,100],attachment:[10,85],depth:[3,50]};
  const layerDefaults = {
    Overskirt:{hemOffset:6,sweep:32,opacity:65},
    Underskirt:{hemOffset:-6,sweep:0,opacity:100},
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
  const supportWidth = style=>({'Integrated shoulders':6.5,'Wide straps':4.5,'Narrow straps':2.2,'Spaghetti straps':.8,'Halter strap':2.5,'One-shoulder':4.5})[style];
  const selectedBack = design=>design.back || backs[0];
  const pocketChoices = model => model==='corset' ? pockets.slice(0,1) : model==='top' ? pockets.slice(0,2) : pockets;
  const isContrast = design => design.finish===finishes[2] || design.tone===tones[1];
  const isSleeved = design => isBodice(design.model) && design.model!=='corset' && selectedSupport(design)===supports[0] && design.sleeve!==sleeves[0];
  const hasSkirt = model=>model==='dress'||model==='skirt';
  const hasFairyHem = design => hasSkirt(design.model) && design.hemStyle===hemStyles[1];
  const hemDrop = design => Number.isFinite(design.hemDrop) ? Math.max(2,Math.min(35,design.hemDrop)) : 10;

  function newLayer(kind='Overskirt') {
    const selected=layerKinds.includes(kind)?kind:layerKinds[0];
    return {kind:selected,fabric:fabrics[0],color:'#783e60',...layerDefaults[selected]};
  }

  function layers(design) {
    if (!hasSkirt(design?.model) || !Array.isArray(design.layers)) return [];
    return design.layers.filter(layer=>layerKinds.includes(layer?.kind)).slice(0,maxLayers).map(layer=>{
      const clean=newLayer(layer.kind);
      if (typeof layer.fabric==='string' && layer.fabric.trim()) clean.fabric=layer.fabric.trim();
      if (typeof layer.color==='string' && /^#[0-9a-f]{6}$/i.test(layer.color)) clean.color=layer.color.toLowerCase();
      for (const [key,[min,max]] of Object.entries(layerLimits)) {
        if (Object.hasOwn(clean,key) && Number.isFinite(layer[key])) {
          const value=bounded(layer[key],[min,max]);
          clean[key]=key==='opacity'||key==='attachment'?Math.round(value):value;
        }
      }
      return clean;
    });
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
      pocket:pockets[0],finish:corset?'Faced hem':finishes[0],hemStyle:hemStyles[0],hemDrop:10,
      tone:tones[0],primary:'#783e60',accent:'#d3a98d',ease:4,...(hasSkirt(model)?{layers:[]}: {})};
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
      steps.push({visual:'designPanelSeam',text:`Place the front panel seams ${placement}${distance?' from their starting pattern marks':''}. On the fitted sample, use the existing seams or mark starter lines between the center and sides. Measure the shift across the front at several matching levels and mirror it on the other half of the front. Trace the new line onto both joining panels, preserving any dart shaping in the fitted block. Walk the seam lines from matching notch to matching notch, smooth their ends, then add the seam allowance to both edges. Baste the panels and check symmetry and fit before stitching.`});
    }
    return steps;
  }

  function layerInstructions(design) {
    const steps={draft:[],cut:[],assemble:[],hem:[]};
    const closure=effectiveClosure(design);
    layers(design).forEach((layer,index)=>{
      const number=index+1;
      const name=`Layer ${number} · ${layer.kind}`;
      const add=(phase,visual,text)=>steps[phase].push({visual,text:`${name}. ${text}`});
      const ruffle=layer.kind==='Ruffle';
      const band=layer.kind==='Tier'||ruffle;
      const inside=layer.kind==='Underskirt';
      const where=band?`at the marked ${ruffle?'ruffle':'tier'} attachment line`:inside?'inside the waist seam':'at the outer waist seam';
      const offset=Number(Math.abs(layer.hemOffset??0).toFixed(3));
      const drop=ruffle?Number(layer.depth.toFixed(3)):0;
      const hem=ruffle?`${drop} cm below its attachment line`:offset
        ?`${offset} cm ${layer.hemOffset<0?'above':'below'} the main finished hem`:'level with the main finished hem';
      const sweep=Number(layer.sweep.toFixed(3));
      const reference=band
        ?`On the fitted main skirt, mark the attachment ${layer.attachment}% of the way from the waist to the main finished hem at center front. Transfer the level line around the skirt.`
        :`Copy the waist attachment seam from the fitted main garment and mark where it sits ${where}.`;
      const circumference=ruffle?'the fitted main skirt around the level of the ruffle’s own bottom edge':'the main skirt’s finished hem seam line';
      const opening=closure==='Elastic waistband'
        ?'Keep the casing and threading opening clear. Test that every layer at the waist passes over the hips.'
        :`Keep the ${closure?.toLowerCase()||'garment closure'} free to open all the way. Transfer the opening to a layer that crosses it.`;
      add('draft','layerDraft',`${reference} Draft on paper with the hem ${hem} at matching points around the skirt. Check floor clearance on the fitted sample. Measure ${circumference} without allowances. Set the layer’s finished hem circumference to ${sweep?`that measurement plus ${sweep} cm, shared across the panels`:'that same measurement'}. Walk the new adjoining seam lines before adding allowances.`);
      add('cut','layerCut',`Prepare and press ${layer.fabric}. Label the new pattern pieces with the layer number, material, grainline and quantities.${ruffle?` Mark ${drop} cm between the attachment stitching line and finished lower edge before adding the upper seam and lower hem allowances.`:' Mark the finished hem and the cutting line with the allowance for the selected finish.'} Align both ends of the grainline to the same selvage, cut on the outside line and transfer attachment, center and closure marks.`);
      add('assemble','layerFit',`Baste the layer panels together, leaving any opening from the pattern. Mark centers and side positions on the layer and at its attachment. Match those points first. If the layer’s upper stitch line is longer, use two rows of basting in the allowance to gather it evenly between marks. Check the fit before sewing it in place.`);
      add('assemble','layerAttach',`Baste ${where} and try on the garment. ${opening} Sit, stand, and walk to check the layers hang freely. Once the fitting passes, stitch along the marked connection, secure the ends at the opening and finish the joined raw edges to suit the fabric.`);
      add('hem','layerHem',`Let this layer hang and settle before marking its own finished hem ${hem}. Check it with the garment worn and shoes on. Keep the other layers out of the way while you trim and finish this edge. ${!ruffle && hasFairyHem(design)?'Measure against the matching short or long point on the main hem. ':''}Test your finish on an offcut of ${layer.fabric} first.`);
    });
    return steps;
  }

  function instructions(design,model) {
    const spec = silhouettes[design.model];
    const style = design.cut.toLowerCase();
    const list = [];
    const add = (visual,text) => list.push({visual,text});
    const layerSteps=layerInstructions(design);
    const upper = isBodice(design.model);
    const fitArea = upper?'chest or bust':'hip or seat';
    const target = (upper?model.bust:model.hip)+design.ease;
    const additional = sewingModels.summary(model);
    add('measure',`Use the ${model.name} model measurements. Chest / bust ${model.bust} cm, waist ${model.waist} cm, hip / seat ${model.hip} cm and shoulder span ${model.shoulder} cm.${additional?' Additional measurements: '+additional+'.':''} Choose a compatible ${spec.label.toLowerCase()} block in the matching size. With ${design.ease} cm of target ease, aim for ${target} cm around the finished ${fitArea}. Check minimum ease, movement and balance on a test garment. Trace and mark grainlines, matching points and seam allowances.`);
    add('designCut',`Draw the ${style} silhouette and mark the ${design.length.toLowerCase()} finish while fitting the test garment. Make width changes on seam lines, then blend the curves, walk the adjoining seams to check they match, and restore seam and hem allowances. Keep the grainline straight and transfer matching marks to the new outline.`);
    list.push(...seamInstructions(design));
    if (design.model==='corset') {
      add('designCut',`Use a ${style} pattern sized to the wearer. Fit the panel seams in a stable toile over the intended underlayers. Mark panel numbers, grainlines and the narrowest waist on each side. Check breathing, sitting and closure reach before cutting.`);
      add('seam','Mark the boning channels and busk or lacing reinforcement from the pattern. Label left and right panels, join the numbered panels in order, and test the marked channel width against the actual boning before closing the lining.');
    }
    if (isBodice(design.model)) {
      add('neck',`Draw the ${design.neckline.toLowerCase()} front edge and ${selectedBack(design).toLowerCase()} on the toile. Mark center front, center back and matching points. Check coverage and closure access, then trace matching facings or binding before cutting.`);
      const strap=selectedSupport(design);
      if (strap!=='Strapless' && (strap!==supports[0] || design.strapWidth || design.strapPlacement)) {
        const width=design.strapWidth??supportWidth(strap);
        const shift=design.strapPlacement?` Move the attachment ${Math.abs(design.strapPlacement)} cm ${design.strapPlacement<0?'inward':'outward'} from the starting shoulder mark.`:'';
        const route=strap==='Halter strap'?'Fit from the two front attachment points around the neck.':strap==='One-shoulder'
          ?'Fit from the front bodice to the back bodice over the wearer’s right shoulder.':'Fit from the front bodice to the back bodice over each shoulder.';
        add('strap',`Fit the ${strap.toLowerCase()} at ${width} cm wide, finished. ${route}${shift} Mark the worn length and add the pattern’s attachment allowances. Baste, check reach and support, then reinforce the ends.`);
      }
      if (strap==='Strapless') add('facing','Fit and mark the strapless upper edge on the toile. Check that it stays in place while moving. Use the support, facing and reinforcement specified for the pattern before finishing the edge.');
      if (isSleeved(design)) add('sleeve',`Trace a sleeve for the matching armhole. Mark the ${design.sleeve.toLowerCase()} sleeve shape and finished length. ${design.sleeve==='Puff'?'Slash and spread the sleeve pattern for fullness, then gather that excess into a tested cap or cuff.':design.sleeve==='Bell'?'Slash and spread from hem toward the cap, keeping the cap seam intact. Draw a smooth, wider hem.':'Keep the sleeve cap and its notches aligned to the armhole.'} Baste it into the test garment and check reach before cutting the final fabric.`);
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
      add('shoulder','Sew and press the shoulder seams. Baste body seams and confirm ease and balance. Attach the facing or binding and understitch or secure its inner edge as appropriate.');
      if (isSleeved(design)) add('armhole','Match sleeve notches to the armhole and baste the sleeves. Try on the garment and check arm movement and symmetry, then attach and finish the sleeves.');
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
    if (!isBodice(design.model) && closure!=='Elastic waistband') add('band','Finish the top edge with the chosen waistband or waist facing. Test the closure and check that the waist stays level when sitting.');
    list.push(...layerSteps.assemble);
    const hem = {
      'Double-fold hem':'Turn the raw edge twice, press and stitch. Check that the hem lies smoothly without ripples.',
      'Faced hem':'Trace a shaped facing that matches the hem curve. Stitch it to the lower edge, grade the seam, turn it inside and secure the upper edge.',
      'Contrast hem band':'Cut a matching band in contrast fabric. Test the finished band depth on the wearer, then join the band, press the seam and finish its inside edge.'
    };
    if (hasFairyHem(design)) {
      add('fairyHem',`Mark the high points of the finished fairy hem on the toile. Measure ${hemDrop(design)} cm straight down at each planned low point. Connect those marks on paper, then mark the hem allowance outside the finished line.`);
      add('fairyHem',`Let the skirt hang so any bias edges can settle. Check the ${hemDrop(design)} cm drop from high to low again on the wearer. Test the selected finish on a scrap cut at the same angle and check that the points hang cleanly before you trim.`);
      add('finish',hem[design.finish]);
    } else add('finish','Mark a level hem during a final fitting. '+hem[design.finish]);
    list.push(...layerSteps.hem);
    return list;
  }

  function make(design,name,model) {
    const spec = silhouettes[design.model];
    const garmentLayers=layers(design);
    design={...design};
    const seamSettings=seams(design);
    if (Object.keys(seamSettings).length) design.seams=seamSettings;
    else delete design.seams;
    if (hasSkirt(design.model)) design.layers=garmentLayers;
    else delete design.layers;
    const list = instructions(design,model);
    const closure=effectiveClosure(design);
    const tools = ['Sewing machine','iron','fabric shears','measuring tape','ruler','pins or clips','tailor’s chalk','matching thread','pattern paper'];
    if (/zipper|zip fly/i.test(closure)) tools.push('zipper foot',closure==='Invisible zipper'?'invisible zipper':'pattern-specified zipper');
    if (closure===closures[1]) tools.push('button','loop cord');
    if (closure===closures[2]||closure==='Button fly') tools.push('buttonhole foot','buttons','interfacing');
    if (closure===closures[3]) tools.push('elastic','safety pin or bodkin');
    if (design.model==='corset') tools.push('sturdy foundation fabric','boning','channel tape');
    if (closure==='Back lacing') tools.push('eyelets and setting tool','lacing cord');
    if (closure==='Front busk') tools.push('busk');
    if (garmentLayers.length) tools.push('hand-basting needle','removable fabric marker');
    const layerFabrics=garmentLayers.length?' Layers: '+garmentLayers.map((layer,index)=>`${index+1} ${layer.kind.toLowerCase()} in ${layer.fabric}`).join(', ')+'.':'';
    return {name,model:baseModel(design.model),sleeves:isSleeved(design),type:spec.type,
      cut:design.cut+' '+spec.label.toLowerCase()+' · '+design.length.toLowerCase()+(hasFairyHem(design)?' · fairy hem':''),
      level:'Intermediate',color:design.primary,design,
      fabric:design.fabric+(isContrast(design)?' and coordinating contrast fabric':'')+'.'+layerFabrics+' Confirm yardage after laying out your drafted pieces.',
      tools:tools.join(', '),steps:list.map(entry=>entry.text),visuals:list.map(entry=>entry.visual)};
  }

  return {silhouettes,necklines,sleeves,fabrics,closures,pockets,finishes,hemStyles,hasFairyHem,hemDrop,tones,backs,rises,
    layerKinds,layerLimits,maxLayers,layers,newLayer,seamKeys,seamLimits,seams,
    centerFrontSeam,panelAngleLimits,panelSeamPaths,panelSeamSnapOffset,singleSeamAngle,singleSeamLocation,singleSeamGuide,
    panelZipperLimits,panelZipperDefault,panelZipperKinds,panelZipperEligible,panelZipperStyle,effectiveClosure,
    baseModel,isBodice,isContrast,isSleeved,closureChoices,supportChoices,selectedSupport,supportWidth,selectedBack,pocketChoices,defaults,measurements,instructions,make};
})();
