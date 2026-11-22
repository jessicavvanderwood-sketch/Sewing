'use strict';

const materialEstimate = (() => {
  const defaultWidth=140;
  const defaultWidths={interfacing:90};
  const commonMaterials={main:'Main fabric',contrast:'Contrast fabric',lining:'Lining',pocketing:'Pocketing',interfacing:'Interfacing',other:'Other fabric'};
  const positive=value=>Number.isFinite(value)&&value>0;

  function byMaterial(pieces,materialId) {
    const groups=new Map();
    for (const piece of pieces) {
      const id=materialId(piece);
      if (!groups.has(id)) groups.set(id,[]);
      groups.get(id).push(piece);
    }
    return groups;
  }

  function nameOptions(pattern,mainFabric) {
    return {...commonMaterials,...materialPatterns.names(pattern,mainFabric)};
  }

  function notions(design,plan) {
    const rows=[];
    const zipper=plan.zipperOpening??studioDesign.seams(design).panelZipper;
    if (positive(zipper)) rows.push({name:'Zipper',quantity:`1 for a ${zipper} cm finished opening`});
    if (!design) return rows;
    const closure=garmentFasteners.saved(design);
    if (closure?.kind==='buttons' && positive(closure.count)) rows.push({name:'Buttons',quantity:String(closure.count)});
    if (closure?.kind==='drawstring' && positive(closure.length)) rows.push({name:'Drawcord',quantity:`${closure.length} cm finished length`});
    const loops=Object.values(studioDesign.keyholes(design)).filter(hole=>hole.bridge==='Button and loop').length;
    const sleeveLoops=studioDesign.slits(design).filter(slit=>slit.finish==='Button-and-loop vent').length;
    const sharedBack=design.closure==='Back button and loop' && studioDesign.keyholes(design).back?.bridge==='Button and loop';
    if (loops+sleeveLoops) rows.push({name:'Opening buttons and loops',quantity:`${loops+sleeveLoops}${sharedBack?' including the shared back closure':''}`});
    return rows;
  }

  function build({pattern,model,body,changes={},allowances,plan={},kind,material,size,allowGuide=false}) {
    const tailoring=kind==='Tailoring';
    const publisher=pattern.external;
    const names=nameOptions(pattern,material);
    const materialId=piece=>Object.hasOwn(names,piece.material)?piece.material:'main';
    const entered=byMaterial(plan.pieces||[],materialId);
    const boltWidth=materialId=>{
      const recorded=materialId==='main'?plan.usableWidth:plan.materialWidths?.[materialId];
      if (positive(recorded)) return recorded;
      return defaultWidths[materialId]??(positive(plan.usableWidth)?plan.usableWidth:defaultWidth);
    };
    const widths=Object.fromEntries(Object.keys(names).map(id=>[id,boltWidth(id)]));
    const approximate=tailoring||publisher?[]:materialPatterns.pieces({pattern,model,body,changes,allowances,plan,material,usableWidth:widths});
    const estimated=byMaterial(approximate,materialId);
    const guide=allowGuide&&!entered.has('main')&&positive(pattern.materialGuideCm);
    const groups=[];
    const notes=[];
    const sources=new Set();
    let usesDefaultWidth=false;
    for (const id of Object.keys(names)) {
      const name=names[id];
      if (id==='main'&&guide) {
        groups.push({id,name,widthCm:null,lengthCm:pattern.materialGuideCm,source:'guide',details:'The original guide gives this amount without a size or fabric width.'});
        continue;
      }
      const recorded=entered.get(id);
      const pieces=recorded??estimated.get(id);
      if (!pieces?.length) continue;
      const widthCm=widths[id];
      const basis=recorded?'pieces':'estimate';
      sources.add(basis);
      usesDefaultWidth ||= !positive(id==='main'?plan.usableWidth:plan.materialWidths?.[id]);
      const layout=materialLayout.estimate({...plan,usableWidth:widthCm,pieces,layout:recorded?plan.layout:'single'});
      if (!layout.ready) {
        const incomplete=layout.missing.map(({piece})=>piece.name||'Unnamed piece');
        const wide=layout.overflow.map(({piece,requiredWidth,availableWidth})=>
          `${piece.name} needs ${Number(requiredWidth.toFixed(1))} cm across ${Number(availableWidth.toFixed(1))} cm of usable width in this layout.`);
        const missing=incomplete.length?`Check cut quantities, dimensions and placement for ${incomplete.join(', ')}.`:'';
        groups.push({id,name,widthCm,lengthCm:null,source:'unresolved',details:[missing,...wide].filter(Boolean).join(' ')});
        continue;
      }
      // Include a small cutting and shrinkage reserve and round up to 10 cm.
      const lengthCm=Math.ceil((layout.length*1.1-1e-7)/10)*10;
      const details=recorded
        ?size?`Uses the paper dimensions entered for this ${size} order. Include every piece cut from this fabric.`:'Include every piece cut from this fabric.'
        :size?`Based on the saved fit graded to ${size}.`:'Based on the selected model and garment settings.';
      groups.push({id,name,widthCm,lengthCm,source:basis,details,layout:recorded?layout:undefined});
    }
    if (sources.size) notes.push('Calculated amounts include a 10% reserve and round up to the next 10 cm. Allow extra for matching stripes, plaids or large repeats and for fabric with higher shrinkage.');
    if (usesDefaultWidth) notes.push('Enter the usable width between the selvages for each material. The estimate shows the assumed width where a width is missing.');
    if (sources.has('estimate')) notes.push('Garment-based estimates use approximate grain-aligned rectangles. Check the amount with your full-size paper pieces before buying or cutting.');
    if (sources.has('pieces')) notes.push('Enter the outside cutting dimensions, including any allowances. The estimate keeps the grain direction of each piece.');
    if (tailoring) notes.push('Use the existing garment for this alteration. Enter any new or replacement pieces to estimate only the fabric you need to add.');
    if (publisher) notes.push('Use the publisher’s fabric requirements for your size and width, or enter the complete cutting list from your printed draft.');
    if (!groups.length&&!publisher&&!tailoring) notes.push('Enter a cutting list to estimate fabric for this garment.');
    const activeDesign=pattern.design?{...pattern.design,...changes,sleeve:changes.sleeveStyle??pattern.design.sleeve}:null;
    return {groups,notes,notions:tailoring?[]:notions(activeDesign,plan),publisher:publisher?{name:publisher.publisher,url:publisher.url}:undefined};
  }

  return {build,nameOptions};
})();
