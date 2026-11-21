'use strict';

const studioDesign = (() => {
  const silhouettes = {
    dress:{label:'Dress',type:'Dresses',cuts:['Column','A-line','Full skirt'],lengths:['Above knee','Midi','Ankle']},
    top:{label:'Shirt / top',type:'Tops',cuts:['Fitted','Straight','Boxy'],lengths:['Cropped','High hip','Low hip']},
    skirt:{label:'Skirt',type:'Skirts',cuts:['Straight','A-line','Full skirt'],lengths:['Above knee','Midi','Ankle']},
    trousers:{label:'Pants',type:'Trousers',cuts:['Tapered','Straight','Wide leg'],lengths:['Cropped','Ankle','Full length']}
  };
  const necklines = ['Crew','Scoop','V-neck','Boat','Square'];
  const sleeves = ['Sleeveless','Short','Elbow','Long','Puff','Bell'];
  const fabrics = ['Cotton poplin','Linen blend','Medium-weight twill','Fluid woven crepe'];
  const closures = ['Invisible zipper','Back button and loop','Front buttons','Elastic waistband'];
  const pockets = ['None','Patch pockets','In-seam pockets'];
  const finishes = ['Double-fold hem','Faced hem','Contrast hem band'];
  const tones = ['Solid','Contrast lower panel'];

  const isBodice = model => model==='top'||model==='dress';
  const closureChoices = model => isBodice(model)
    ? closures.slice(0,3)
    : [closures[0],closures[3]];
  const pocketChoices = model => model==='top' ? pockets.slice(0,2) : pockets;
  const isContrast = design => design.finish===finishes[2] || design.tone===tones[1];
  const isSleeved = design => isBodice(design.model) && design.sleeve!==sleeves[0];

  function defaults(model='dress') {
    const spec = silhouettes[model];
    return {model,cut:spec.cuts[1],length:spec.lengths[1],neckline:necklines[1],sleeve:sleeves[1],
      fabric:model==='trousers'?fabrics[2]:fabrics[0],closure:closureChoices(model)[0],
      pocket:pockets[0],finish:finishes[0],tone:tones[0],primary:'#783e60',accent:'#d3a98d',ease:4};
  }

  function measurements(design) {
    const spec = silhouettes[design.model];
    const lower = spec.lengths.indexOf(design.length)-1;
    const volume = spec.cuts.indexOf(design.cut)-1;
    return {lower,volume};
  }

  function instructions(design,model) {
    const spec = silhouettes[design.model];
    const style = design.cut.toLowerCase();
    const list = [];
    const add = (visual,text) => list.push({visual,text});
    const upper = isBodice(design.model);
    const fitArea = upper?'chest or bust':'hip or seat';
    const target = (upper?model.bust:model.hip)+design.ease;
    add('measure',`Use the ${model.name} model measurements. Chest / bust ${model.bust} cm, waist ${model.waist} cm, hip / seat ${model.hip} cm and shoulder span ${model.shoulder} cm. Choose a compatible ${spec.label.toLowerCase()} block in the matching size. With ${design.ease} cm of target ease, aim for ${target} cm around the finished ${fitArea}. Check minimum ease, movement and balance on a test garment. Trace and mark grainlines, matching points and seam allowances.`);
    add('designCut',`Draw the ${style} silhouette and mark the ${design.length.toLowerCase()} finish while fitting the test garment. Make width changes on seam lines, then blend the curves, walk the adjoining seams to check they match, and restore seam and hem allowances. Keep the grainline straight and transfer matching marks to the new outline.`);
    if (isBodice(design.model)) {
      add('neck',`Draw the ${design.neckline.toLowerCase()} neckline on the traced front. Keep both halves symmetrical and test coverage and head clearance with the selected closure. Trace a matching facing or plan a compatible binding. Staystitch the cut neckline before handling it.`);
      if (isSleeved(design)) add('sleeve',`Trace a sleeve for the matching armhole. Mark the ${design.sleeve.toLowerCase()} sleeve shape and finished length. ${design.sleeve==='Puff'?'Slash and spread the sleeve pattern for fullness, then gather that excess into a tested cap or cuff.':design.sleeve==='Bell'?'Slash and spread from hem toward the cap, keeping the cap seam intact. Draw a smooth, wider hem.':'Keep the sleeve cap and its notches aligned to the armhole.'} Baste it into the test garment and check reach before cutting the final fabric.`);
    } else if (design.model==='trousers') {
      add('rise','Test the crotch curve and rise in the toile while standing and sitting. Check the seat and thigh, then test the leg opening over the intended shoes. True the front and back inseam lengths before cutting.');
    }
    if (design.tone===tones[1]) {
      add('colorBlock','Mark a lower-panel seam on the traced pieces at the same height wherever panels meet. Split the pattern there, add matching seam allowances to both new edges and copy the grainline. Sew the contrast lower panels to their matching upper pieces before joining the garment seams.');
    }
    add('grain',`Prewash the ${design.fabric.toLowerCase()} as appropriate, press it flat and lay out the trued pieces on grain. Measure your final layout against the fabric width before buying or cutting. Cut all pieces and transfer matching marks, pocket positions and closure marks.`);
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
      'Back button and loop':['facing','Finish the back-neck opening with the facing. Baste in a thread or fabric loop, test head clearance, then secure the loop and matching button.'],
      'Front buttons':['button','Interface and finish the front opening with plackets or facings. Test buttonholes on layered scrap, mark even spacing and stitch them. Attach the buttons opposite the holes.'],
      'Elastic waistband':['band','Choose a pull-on opening that passes over the hips. Sew a waistband casing, insert the elastic and fit it, then join its ends securely and close the casing.']
    };
    add(...closureSteps[design.closure]);
    if (!isBodice(design.model) && design.closure!=='Elastic waistband') add('band','Finish the top edge with the chosen waistband or waist facing. Test the closure and check that the waist stays level when sitting.');
    const hem = {
      'Double-fold hem':'Turn the raw edge twice, press and stitch. Check that the hem lies smoothly without ripples.',
      'Faced hem':'Trace a shaped facing that matches the hem curve. Stitch it to the lower edge, grade the seam, turn it inside and secure the upper edge.',
      'Contrast hem band':'Cut a matching band in contrast fabric. Test the finished band depth on the wearer, then join the band, press the seam and finish its inside edge.'
    };
    add('finish','Mark a level hem during a final fitting. '+hem[design.finish]);
    return list;
  }

  function make(design,name,model) {
    const spec = silhouettes[design.model];
    const list = instructions(design,model);
    const tools = ['Sewing machine','iron','fabric shears','measuring tape','ruler','pins or clips','tailor’s chalk','matching thread','pattern paper'];
    if (design.closure===closures[0]) tools.push('zipper foot','invisible zipper');
    if (design.closure===closures[1]) tools.push('button','loop cord');
    if (design.closure===closures[2]) tools.push('buttonhole foot','buttons','interfacing');
    if (design.closure===closures[3]) tools.push('elastic','safety pin or bodkin');
    return {name,model:design.model,sleeves:isSleeved(design),type:spec.type,
      cut:design.cut+' '+spec.label.toLowerCase()+' · '+design.length.toLowerCase(),
      level:'Intermediate',color:design.primary,design,
      fabric:design.fabric+(isContrast(design)?' and coordinating contrast fabric':'')+'. Confirm yardage after laying out your drafted pieces.',
      tools:tools.join(', '),steps:list.map(entry=>entry.text),visuals:list.map(entry=>entry.visual)};
  }

  return {silhouettes,necklines,sleeves,fabrics,closures,pockets,finishes,tones,
    isBodice,isContrast,isSleeved,closureChoices,pocketChoices,defaults,measurements,instructions,make};
})();
