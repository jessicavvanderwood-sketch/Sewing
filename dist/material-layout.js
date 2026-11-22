'use strict';

const materialLayout = (() => {
  const modes=new Set(['pattern','fold','pair','single']);

  function positive(value) {
    const number=typeof value==='number'?value:typeof value==='string' && value.trim()?Number(value):NaN;
    return Number.isFinite(number) && number>0?number:null;
  }

  function widthTolerance(width) {
    return Math.max(1e-8,width*1e-9);
  }

  function placeBatch(items,width,layout,start) {
    const shelves=[];
    const openShelves=new Set();
    const tolerance=widthTolerance(width);
    let length=0;
    // Each rectangle keeps length along the selvage and all copies point in one direction.
    const ordered=items.slice().sort((a,b)=>b.length-a.length||b.width-a.width||a.rowIndex-b.rowIndex||a.copy-b.copy);
    for (const item of ordered) {
      let shelf;
      let bestRemaining=Infinity;
      for (const candidate of openShelves) {
        if (item.onFold && candidate.hasFold) continue;
        if (item.length>candidate.length+tolerance) continue;
        const remaining=width-candidate.widthUsed-item.width;
        if (remaining < -tolerance || remaining>=bestRemaining) continue;
        shelf=candidate;
        bestRemaining=remaining;
      }
      if (!shelf) {
        shelf={start:length,length:item.length,widthUsed:0,foldWidth:0,hasFold:false,placements:[]};
        shelves.push(shelf);
        openShelves.add(shelf);
        length+=item.length;
      }
      const x=item.onFold?Math.max(0,width-item.width):shelf.widthUsed-shelf.foldWidth;
      shelf.placements.push({...item,x,y:shelf.start});
      shelf.widthUsed+=item.width;
      if (item.onFold) {
        shelf.hasFold=true;
        shelf.foldWidth=item.width;
      }
      if (width-shelf.widthUsed<=tolerance) openShelves.delete(shelf);
    }
    return {layout,width,start,length,shelves};
  }

  function estimate(plan={}) {
    const source=plan||{};
    const usableWidth=positive(source.usableWidth);
    const rows=Array.isArray(source.pieces)?source.pieces:[];
    const layout=source.asymmetric?'single':['folded','single'].includes(source.layout)?source.layout:'pattern';
    const missing=[],overflow=[],notes=[];
    const positions={single:[],folded:[]};
    if (!usableWidth) missing.push({field:'usableWidth',reason:'usable-width'});
    if (!rows.length) missing.push({field:'pieces',reason:'pieces'});

    rows.forEach((piece,rowIndex)=>{
      const paper=piece||{};
      const width=positive(paper.width),length=positive(paper.length),quantity=positive(paper.quantity);
      const mode=modes.has(paper.mode)?paper.mode:'pattern';
      const fields=[];
      if (!width) fields.push('width');
      if (!length) fields.push('length');
      if (!Number.isSafeInteger(quantity)) fields.push('quantity');
      const row={rowIndex,piece};
      if (fields.length) {
        missing.push({...row,fields,reason:'piece-measurements'});
        return;
      }
      if (source.asymmetric && mode==='fold') {
        missing.push({...row,fields:['mode','width'],reason:'asymmetric-fold'});
        return;
      }
      if (!usableWidth) return;

      function add(batch,cutWidth,copies,cutCount,{onFold=false,first=0,mirrored=false}={}) {
        const availableWidth=usableWidth/(batch==='folded'?2:1);
        if (cutWidth>availableWidth+widthTolerance(availableWidth)) {
          overflow.push({...row,layout:batch,requiredWidth:cutWidth,availableWidth,cutCount:copies*cutCount});
          return;
        }
        for (let i=0;i<copies;i++) {
          const copy=first+i*cutCount;
          positions[batch].push({...row,mode,copy,cutCount,width:cutWidth,length,onFold,mirror:mirrored && copy%2===1});
        }
      }

      if (mode==='fold') {
        // A flat copy of a symmetric fold piece includes both halves of the paper outline.
        if (layout==='single') add('single',width*2,quantity,1);
        else add('folded',width,quantity,1,{onFold:true});
      } else if (mode==='pair' && layout==='folded') {
        const pairs=Math.floor(quantity/2);
        if (pairs) add('folded',width,pairs,2);
        if (quantity%2) {
          notes.push({...row,reason:'unpaired-copy'});
          add('single',width,1,1,{first:pairs*2});
        }
      } else add('single',width,quantity,1,{mirrored:mode==='pair'});
    });

    const batches=[];
    let laidLength=0;
    for (const batch of ['folded','single']) {
      if (!positions[batch].length) continue;
      const setup=placeBatch(positions[batch],usableWidth/(batch==='folded'?2:1),batch,laidLength);
      batches.push(setup);
      laidLength+=setup.length;
    }
    const ready=!missing.length && !overflow.length;
    return {ready,usableWidth,length:ready?laidLength:null,laidLength,batches,missing,overflow,notes};
  }

  return {estimate};
})();
