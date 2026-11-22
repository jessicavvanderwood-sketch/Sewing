'use strict';

const modelOutline = (() => {
  // These are the scan bands used by the model library, measured down from
  // the crown as a fraction of the person's visible standing height.
  const levels = [.112,.145,.182,.218,.267,.345,.415,.485,.53];
  const median = values => {
    const sorted = values.slice().sort((a,b)=>a-b);
    const middle = Math.floor(sorted.length/2);
    return sorted.length%2 ? sorted[middle] : (sorted[middle-1]+sorted[middle])/2;
  };
  const centerOf = band => (band.left+band.right)/2;
  const widthOf = band => band.right-band.left+1;

  function labelSubjects(mask,width,height) {
    const labels = new Int32Array(mask.length);
    const queue = new Int32Array(mask.length);
    const subjects = [];
    let label = 0;
    for (let index=0;index<mask.length;index++) {
      if (!mask[index] || labels[index]) continue;
      label++;
      labels[index]=label;
      queue[0]=index;
      let length=1, left=width, right=-1, top=height, bottom=-1, edge=0;
      for (let next=0;next<length;next++) {
        const at=queue[next], x=at%width, y=Math.floor(at/width);
        left=Math.min(left,x);
        right=Math.max(right,x);
        top=Math.min(top,y);
        bottom=Math.max(bottom,y);
        if (x===0 || x===width-1) edge++;
        for (let ny=Math.max(0,y-1);ny<=Math.min(height-1,y+1);ny++) {
          for (let nx=Math.max(0,x-1);nx<=Math.min(width-1,x+1);nx++) {
            const neighbor=ny*width+nx;
            if (!mask[neighbor] || labels[neighbor]) continue;
            labels[neighbor]=label;
            queue[length++]=neighbor;
          }
        }
      }
      const span=bottom-top+1, across=right-left+1;
      if (span<height*.25 || across<span*.045 || length<span*span*.032) continue;
      subjects.push({label,left,right,top,bottom,span,across,area:length,edge});
    }
    return {labels,subjects};
  }

  function subjectRows(labels,width,subject) {
    const rows=[];
    for (let y=subject.top;y<=subject.bottom;y++) {
      const bands=[];
      const row=y*width;
      for (let x=subject.left;x<=subject.right;x++) {
        if (labels[row+x]!==subject.label) continue;
        if (bands.at(-1)?.right===x-1) bands.at(-1).right=x;
        else bands.push({left:x,right:x});
      }
      rows.push(bands);
    }
    return rows;
  }

  function traceSubject(labels,width,height,subject,centerX,view) {
    const rows=subjectRows(labels,width,subject);
    const extent=subject.span-1;
    const rowAt=fraction=>Math.round(extent*fraction);
    const headCenter=[], headWidths=[];
    const firstHead=rowAt(.035), lastHead=rowAt(.105);
    let duplicateHeads=0;
    for (let y=firstHead;y<=lastHead;y++) {
      const headBands=rows[y].filter(band=>widthOf(band)>=subject.span*.038);
      if (!headBands.length) continue;
      const ordered=headBands.sort((a,b)=>widthOf(b)-widthOf(a));
      const [largest,second]=ordered;
      if (second && widthOf(second)>=widthOf(largest)*.63 && Math.abs(centerOf(second)-centerOf(largest))>subject.span*.09) duplicateHeads++;
      headCenter.push(centerOf(largest));
      headWidths.push(widthOf(largest));
    }
    if (!headCenter.length) return null;
    const head=median(headCenter), headWidth=median(headWidths);
    const headAmbiguous=duplicateHeads>=(lastHead-firstHead+1)*.46;

    // An arm may share the mask with the body at the shoulder and hand but
    // be separated by background at chest or waist level. Follow the torso
    // horizontally from the head and record only the central run in each row.
    const core=[];
    let axis=head;
    for (let y=firstHead;y<=rowAt(.55);y++) {
      const eligible=rows[y].filter(band=>widthOf(band)>=Math.max(2,subject.span*.025));
      const score=band=>Math.abs(centerOf(band)-axis)-Math.min(widthOf(band),subject.span*.24)*.30;
      const nearest=eligible.reduce((best,band)=>!best||score(band)<score(best)?band:best,null);
      if (!nearest || Math.abs(centerOf(nearest)-axis)>subject.span*.16) continue;
      core[y]={...nearest,detached:eligible.length>1};
      axis+=.22*(centerOf(nearest)-axis);
    }
    const torso=core.slice(rowAt(.24),rowAt(.51)+1).filter(Boolean);
    if (torso.length<(rowAt(.51)-rowAt(.24)+1)*.71) return null;
    const torsoWidth=median(torso.map(widthOf));
    const torsoCenter=median(torso.map(centerOf));
    if (torsoWidth<subject.span*.052 || torsoWidth>subject.span*.61 || headWidth>torsoWidth*1.55 ||
      Math.abs(torsoCenter-head)>subject.span*.18) return null;
    const distance=Math.abs((head+torsoCenter*2)/3-centerX);
    const score=subject.span/height-3.1*distance/width;
    const spanRatio=subject.span/height;
    const cropped=subject.top===0 || subject.bottom===height-1 || subject.edge>=Math.max(2,subject.span*.012);
    const wide=subject.across>subject.span*(view==='side'?.72:.75);
    const small=spanRatio<.45;
    return {core,rowAt,headAmbiguous,distance,score,cropped,wide,small,span:subject.span,area:subject.area};
  }

  function bandRatio(subject,position,view) {
    const at=subject.rowAt(position);
    const radius=Math.max(1,Math.round(subject.span*.011));
    const sample=subject.core.slice(at-radius,at+radius+1).filter(Boolean);
    if (sample.length<radius+1) return NaN;
    let value=median(sample.map(widthOf));
    if (position>=.267) {
      const isolated=sample.filter(band=>band.detached);
      if (isolated.length) value=median(isolated.map(widthOf));
      else {
        // A forearm or hand can join the torso run briefly. Recover the
        // width between rows where there is visible space beside the arm.
        // Near the fingertips, the abrupt end of that protrusion can also
        // provide the second width anchor.
        const tail=Math.round(subject.span*.085);
        const adjacent=direction=>{
          const indices=Array.from({length:tail},(_,i)=>at+direction*(i+1));
          const separated=indices.find(index=>subject.core[index]?.detached);
          const narrower=indices.find(index=>{
            const from=subject.core[index-direction], to=subject.core[index];
            return from && to && widthOf(from)-widthOf(to)>subject.span*.015;
          });
          return {separated,narrower};
        };
        const higher=adjacent(-1), lower=adjacent(1);
        const upper=higher.separated??higher.narrower, bottom=lower.separated??lower.narrower;
        if ((higher.separated!=null || lower.separated!=null) && upper!=null && bottom!=null) {
          const a=widthOf(subject.core[upper]), b=widthOf(subject.core[bottom]);
          const nearby=a+(b-a)*(at-upper)/(bottom-upper);
          if (value>nearby*(view==='side'?1.15:1.16)) value=nearby;
        }
      }
    }
    return Number((value/(subject.span-1)).toFixed(4));
  }

  function measure(mask,width,height,{centerX=(width-1)/2,view='front'}={}) {
    if (!Number.isInteger(width) || !Number.isInteger(height) || width<16 || height<24 || mask?.length!==width*height ||
      !Number.isFinite(centerX) || centerX<0 || centerX>=width || !['front','side'].includes(view)) {
      throw Error('The camera outline could not be read. Try taking the capture again.');
    }
    const {labels,subjects}=labelSubjects(mask,width,height);
    const traced=subjects.map(subject=>traceSubject(labels,width,height,subject,centerX,view)).filter(Boolean)
      .sort((a,b)=>b.score-a.score);
    const suitable=traced.filter(subject=>!subject.cropped&&!subject.small&&!subject.wide&&!subject.headAmbiguous&&subject.distance<width*.26);
    const [chosen,other]=suitable;
    if (other && chosen.score-other.score<.13 && Math.abs(chosen.distance-other.distance)<width*.072) {
      throw Error('More than one person is near the center. Keep only the person being measured in the center of the frame.');
    }
    const obstruction=traced.find(subject=>subject.cropped && subject.distance<width*.115 &&
      (!chosen || subject.distance<chosen.distance-width*.08 && subject.area>=chosen.area*.65));
    if (obstruction || !chosen && subjects.some(subject=>subject.top===0||subject.bottom===height-1||subject.edge>2)) {
      throw Error('Move back until your full body fits in the frame, with space above your head and below your feet.');
    }
    if (!chosen) {
      if (traced.some(subject=>subject.headAmbiguous)) throw Error('The camera sees overlapping people. Leave clear space around the person being measured.');
      if (traced.some(subject=>subject.small&&subject.distance<width*.26)) throw Error('Move closer so your standing body fills at least half the frame, with your head and feet visible.');
      if (traced.some(subject=>subject.wide&&subject.distance<width*.26)) throw Error('Stand upright with your arms slightly away from your body, leaving room on both sides.');
      throw Error('No clear standing person was detected near the center. Stand head to toe in view and hold still.');
    }
    const ratios=levels.map(position=>bandRatio(chosen,position,view));
    if (ratios.some(value=>!Number.isFinite(value)||value<=0)) throw Error('The body outline was incomplete. Keep your arms clear of your waist and try again.');
    return ratios;
  }

  return {measure};
})();
