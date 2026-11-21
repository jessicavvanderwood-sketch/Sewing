'use strict';

const workFigures = (() => {
  const path=(d,style='wf-edge')=>`<path class="${style}" d="${d}"/>`;
  const label=(x,y,text,align='start')=>`<text x="${x}" y="${y}" text-anchor="${align}">${escape(text)}</text>`;
  const tick=(x,y1,y2,text,side=1)=>path(`M${x-5} ${y1}h10M${x} ${y1}V${y2}M${x-5} ${y2}h10`,'wf-dimension')+
    label(x+side*8,(y1+y2)/2+4,text,side===1?'start':'end');
  const span=(x1,x2,y,text)=>path(`M${x1} ${y-5}v10M${x1} ${y}H${x2}M${x2} ${y-5}v10`,'wf-dimension')+
    label((x1+x2)/2,y-8,text,'middle');
  const guide=(x1,y1,x2,y2)=>path(`M${x1} ${y1}L${x2} ${y2}`,'wf-guide');
  const format=value=>Number.isFinite(value)?Number(value.toFixed(3))+' cm':'';
  const num=(step,regex)=>step.match(regex)?.[1];
  function panel(title,drawing,description) {
    return `<figure class="wf-panel"><svg viewBox="0 0 330 164" aria-hidden="true" focusable="false">${drawing}</svg><figcaption><strong>${escape(title)}</strong><span>${escape(description)}</span></figcaption></figure>`;
  }
  function strip(title,panels) {
    return `<section class="wf-figures"><h4>${title}</h4><div class="wf-grid">${panels.join('')}</div></section>`;
  }
  function hemFold(allowances,mode) {
    const first=format(allowances.first)||'First turn per pattern';
    const second=format(allowances.second)||'Second turn per pattern';
    const total=Number.isFinite(allowances.first)&&Number.isFinite(allowances.second)
      ?format(allowances.first+allowances.second):'Total per pattern';
    if (mode==='faced') return strip('Facing the hem',[
      panel('Align the facing',path('M30 38H190V128H30Z','wf-cloth')+path('M45 94H173V128H45Z','wf-fold')+
        path('M44 116H175','wf-stitch')+tick(188,116,128,format(allowances.seam)||'Seam per pattern')+label(44,65,'Right sides together'),
        'Match the facing to the lower edge and stitch through the aligned layers.'),
      panel('Turn inside and secure',path('M30 26H190V128H30Z','wf-cloth')+path('M30 91H190V128H30Z','wf-fold')+
        path('M38 100H182','wf-stitch')+label(53,71,'Wrong side up')+label(55,152,'Finished edge'),
        'Turn the facing to the wrong side, press the hem edge, and secure the upper edge as the pattern directs.')
    ]);
    return strip('Double-fold hem',[
      panel('1. Mark both fold lines',path('M24 23H162V138H24Z','wf-cloth')+guide(25,81,162,81)+guide(25,111,162,111)+
        tick(173,111,138,first)+tick(173,81,111,second)+label(41,49,'Wrong side up')+label(42,154,'Raw edge'),
        `Measure from the raw edge and mark the two folds. Total allowance from raw edge to final fold: ${total}.`),
      panel('2. Turn the raw edge once',path('M24 23H162V139H24Z','wf-cloth')+path('M24 112H162V139H24Z','wf-fold')+
        path('M72 145Q86 150 88 104M82 111L88 104L93 111','wf-arrow')+
        tick(173,112,139,first)+label(39,64,'Lift toward wrong side'),
        'Pinch the raw edge with your thumbs and forefingers. Lift it along the first mark toward the wrong side, then lay it down and press.'),
      panel('3. Turn again and stitch',path('M24 23H162V136H24Z','wf-cloth')+path('M24 100H162V136H24Z','wf-fold')+
        path('M24 106H162','wf-stitch')+tick(173,100,136,second)+label(39,82,'Stitch near inner fold')+label(42,153,'Finished edge'),
        'Lift the folded band again, keeping the raw edge tucked inside. Press, clip, then stitch near the inner folded edge as the pattern directs.')
    ]);
  }
  function seamFold(allowances,dart=false) {
    if (dart) return strip('Fold the dart',[
      panel('Bring the dart legs together',path('M25 24H200V143H25Z','wf-cloth')+guide(83,38,111,127)+guide(145,38,111,127)+
        path('M80 56Q112 71 146 56M139 53L146 56L141 62','wf-arrow')+label(207,50,'Match legs')+label(119,130,'Dart point'),
        'Pinch the fabric right sides together. Match the marked legs and put the first pin through both marks.'),
      panel('Stitch toward the point',path('M70 23L184 28L112 142Z','wf-fold')+path('M145 34L112 142','wf-stitch')+
        label(171,47,'Wide end')+label(123,145,'Point'), 'Sew from the wide end to the marked point. Use the dart legs from your pattern for placement.')
    ]);
    const size=format(allowances.seam)||'Your pattern allowance';
    return strip('Align and sew the fabric layers',[
      panel('1. Put right sides together',path('M34 26H115V125H34Z','wf-cloth')+path('M187 26H268V125H187Z','wf-right')+
        path('M201 51Q156 27 117 62M128 59L117 62L123 50','wf-arrow')+label(40,145,'Layer 1')+label(196,145,'Layer 2'),
        'Hold the upper piece at the edge. Flip it over so the two right sides touch, then match the raw edges and notches.'),
      panel('2. Sew at the allowance',path('M28 29H213V139H28Z','wf-cloth')+path('M36 33H213V135H36Z','wf-fold')+
        path('M167 34V111','wf-stitch')+guide(167,111,167,126)+guide(213,110,213,126)+span(167,213,127,size)+
        label(72,63,'Stitch line')+label(221,78,'Raw edges'),
        `Use ${Number.isFinite(allowances.seam)?size:'the allowance stated in your pattern'} to mark the stitch line inward from the matched edges. Keep the edges against the machine guide as you sew.`)
    ]);
  }
  function moveFigure(step,id) {
    const amount=num(step,/(\d+(?:\.\d+)?) cm (?:above|below) the old hem/);
    if (amount) {
      const up=id==='hemUp';
      const old=up?116:67, next=up?67:116;
      return strip('Where to move the finished hem',[
        panel(up?'Raise the hem':'Lower the hem',path('M27 22H176V140H27Z','wf-cloth')+path(`M29 ${old}H176`,'wf-guide')+
          path(`M29 ${next}H176`,'wf-stitch')+tick(187,67,116,amount+' cm')+
          label(40,old-5,'Old finished hem')+label(40,next-5,'New finished hem'),
          `Measure ${amount} cm ${up?'above':'below'} the old finished hem. Mark the finished line first, then check the allowance below it.`)
      ]);
    }
    const seamMove=num(step,/(\d+(?:\.\d+)?) cm (?:inward from|toward the raw edges|on both layers|on each layer)/);
    if (seamMove && ['take','let','sleeve','taper'].includes(id)) {
      const inward=id==='take'||/inward|toward the (?:leg|sleeve) body/.test(step);
      const old=inward?177:107, next=inward?107:177;
      return strip('Where to mark the new seam',[
        panel(inward?'Move toward the garment body':'Move toward the raw edge',
          path('M28 22H225V136H28Z','wf-cloth')+path(`M${old} 24V113`,'wf-guide')+
          path(`M${next} 24V113`,'wf-stitch')+span(107,177,126,seamMove+' cm')+
          label(25,153,'Garment body')+label(230,78,'Raw edge'),
          `The bracket shows ${seamMove} cm on one layer at this seam. Use the same signed direction and layer count stated in the step.`)
      ]);
    }
    return '';
  }
  function bodySheet(sheet) {
    if (!sheet) return '';
    const at=key=>sheet.rows.find(([label])=>label===key)?.at(-1);
    const rows=[['Chest / bust',58],['Waist',83],['Hip / seat',109]].filter(([key])=>at(key)&&at(key)!=='—');
    if (!rows.length) return '';
    return strip('Where to measure the body',[
      panel('Target model measurements',path('M83 28L104 19Q114 43 128 43Q141 43 152 19L172 28L183 59L167 80L175 137H82L91 80L72 59Z','wf-cloth')+
        rows.map(([key,y])=>path(`M83 ${y}H172`,'wf-dimension')+guide(172,y,192,y)+label(196,y+4,key+' '+at(key))).join(''),
        'Keep the tape level around the body at each marked height. These values are the model measurements. Check wearing ease and pattern allowances separately.')
    ]);
  }
  function forStep(step,id,order,pattern) {
    const allowance=order.allowances||{};
    const movement=moveFigure(step,id);
    if (movement) return movement;
    if (id==='darts') return seamFold(allowance,true);
    if (['seam','layer','sew','topstitch'].includes(id)) return seamFold(allowance);
    if (id==='finish' && /\bhem\b/i.test(step)) {
      const selected=pattern.design?.finish || '';
      if (/faced hem|hem facing/i.test(step+' '+selected)) return hemFold(allowance,'faced');
      if (/contrast hem band|attach\b.*\bband\b|coverstitch/i.test(step+' '+selected)) return '';
      if (allowance.first!=null || allowance.second!=null || /double.fold|turn .*twice/i.test(step+' '+selected)) return hemFold(allowance,'double');
      return `<details class="wf-optional"><summary>See a double-fold hem example</summary>${hemFold(allowance,'double')}</details>`;
    }
    return '';
  }
  return {forStep,bodySheet};
})();
