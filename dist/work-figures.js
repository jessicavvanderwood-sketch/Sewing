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
  const cloth=path('M32 41H169V135H32Z','wf-cloth');
  const layers=cloth+path('M40 35H177V126H40Z','wf-fold');
  const raw=path('M177 39V125','wf-dimension');
  const row=path('M145 46V115','wf-stitch');
  const needle=path('M143 23H149V82L146 92L143 82Z','wf-fold');
  const arrow=(x,y)=>path(`M${x} ${y-26}v26m-5 -6l5 6 5 -6`,'wf-arrow');
  const pin=(x,y)=>path(`M${x} ${y}h43m-43 -3a3 3 0 1 0 .1 0z`,'wf-dimension');
  let scenes;
  const createScenes=()=>({
    weights:['Weight the pattern',cloth+path('M52 55H155V119H52Z','wf-guide')+path('M61 63h17v16H61zM126 93h17v16h-17z','wf-fold')+label(179,74,'Weights inside cut line')],
    shears:['Keep the lower blade flat',cloth+path('M169 56l50 -15M169 56l50 13M219 41q29 -18 25 3q-2 8 -25 -3M219 69q28 22 26 2q-2 -10 -26 -2','wf-dimension')+label(183,108,'Cut on outer line')],
    unpick:['Mark the section to open',layers+row+path('M132 63h23m-23 34h23','wf-dimension')+label(179,84,'Remove between marks')],
    ripper:['Lift one stitch at a time',cloth+path('M59 99H156','wf-stitch')+path('M246 56l-30 23 -48 18q-11 0 -11 -11m59 -7l-22 -1 -25 14','wf-dimension')+label(57,124,'Keep tip above fabric')],
    allowance:['Measure from stitch line to edge',layers+raw+row+span(145,177,117,'')+label(189,119,'Remaining fabric')],
    pin:['Pin across the stitch line',layers+row+pin(119,57)+pin(119,89)+label(184,56,'Remove before needle')],
    foot:['Lower the presser foot onto the fabric',layers+needle+path('M133 45h26v17h-8v22h-29v-8h14v-14h-3z','wf-cloth')+arrow(183,77)+label(203,72,'Lower the foot')],
    pinOut:['Stop and slide the pin out',layers+row+pin(119,78)+needle+path('M166 78h49m-6 -5l6 5 -6 5','wf-arrow')+label(185,104,'Pull away from needle')],
    stitchStart:['Guide the fabric past the needle',layers+needle+row+raw+arrow(110,110)+label(182,89,'Raw edge on guide')],
    matchSleeve:['Match the sleeve cap to the armhole',path('M51 130Q48 33 111 32Q164 35 184 123Z','wf-cloth')+path('M53 120Q78 44 113 44Q151 44 181 115','wf-stitch')+path('M106 37l7 12 7 -12M65 78l9 4m84 -4l9 -4','wf-dimension')+label(171,40,'Shoulder notch')+label(192,118,'Match front and back')],
    clipCurve:['Clip toward the seam in the allowance',path('M29 32H180V120H29Z','wf-cloth')+path('M37 34Q100 122 170 34','wf-stitch')+path('M60 35l9 19M91 48l3 21M119 51l-2 18M148 38l-10 20','wf-dimension')+label(182,78,'Stop before stitches')],
    turnFacing:['Roll the stitched edge to the inside',path('M30 34H173V142H30Z','wf-cloth')+path('M31 36Q103 102 172 36V54Q104 125 31 55Z','wf-fold')+arrow(103,83)+label(187,65,'Facing moves inside')],
    zipClearance:['Lower the needle beside the zipper coil',layers+needle+path('M157 45v70m5 -70v70M158 54h4m-4 10h4m-4 10h4m-4 10h4m-4 10h4','wf-dimension')+label(181,63,'Clear of the teeth')],
    zipCheck:['Close the zipper and compare the seam marks',layers+path('M115 40v80m7 -80v80M112 82h13l-3 10h-7z','wf-dimension')+guide(75,62,146,62)+label(184,65,'Marks should line up')],
    casing:['Feed the elastic through the opening',path('M31 51H191V113H31Z','wf-fold')+path('M34 103h62m31 0h60','wf-stitch')+path('M51 76h111l-6 -5m6 5l-6 5','wf-arrow')+label(84,128,'Opening')],
    fold:['Lift the cut edge toward the wrong side',cloth+guide(32,104,169,104)+path('M32 106H169V134H32Z','wf-fold')+path('M100 145Q117 144 118 112l-6 6m6 -6l5 7','wf-arrow')+label(182,109,'Fold here')+label(40,59,'Wrong side up')]
  });
  const machineSteps=[
    {figure:'foot',text:'With the needle up and the pedal released, lift the presser-foot lever. Slide in the fabric and align its edge with the seam guide. Lower the lever before touching the pedal.'},
    {figure:'stitchStart',text:'Keep your fingers to the sides of the foot. Press the pedal gently to sew a few stitches. Guide the fabric along the marked line and let the feed dogs move it.'},
    {figure:'pinOut',text:'Release the pedal when a pin or clip approaches the foot. Pull it out sideways. Check that both fabric edges still line up, then resume.'},
    {figure:'check',text:'Stop at the end of the line. Secure the ends as the pattern directs, raise the needle and presser foot, slide the fabric out, and cut the threads. Check the front and back for skipped stitches or loops.'}
  ];
  const setupSteps=[
    ['needle','Switch off the machine. Loosen the needle clamp, insert a compatible needle with the flat side facing back, push it up fully, and retighten the clamp.'],
    ['bobbin','With the machine off, open the bobbin cover. Drop in the compatible Class 15 bobbin in the direction shown on the cover. Hold it lightly while guiding the thread through the slot to the cutter, then replace the cover.'],
    ['upper','Raise the presser foot. Turn the handwheel toward you to raise the needle and take-up lever. Follow the marked thread path, making sure the thread passes through the take-up lever and the needle eye.'],
    ['screen','For stable woven fabric, attach foot J and select centered straight stitch 01. Start at 2.5 mm. Use the project stitch and compatible needle for stretch fabrics.'],
    ['check','Sew a scrap folded to the same number of layers. Look at both sides and gently pull the seam. Fix loops, skipped stitches or popped thread before sewing the garment.']
  ];
  function standardPanel(title,visual,text) {
    return panel(title,`<svg class="wf-standard" x="0" y="0" width="330" height="164" viewBox="0 0 270 141">${visual}</svg>`,text);
  }
  function machineActions() {
    return `<details class="wo-how wo-storyboard"><summary>Set up the Brother CP2160F in pictures</summary><div class="wf-grid">${setupSteps.map(([figure,text],i)=>{
      const [title,visual]=sewingVisuals.figureParts(figure);
      return standardPanel((i+1)+'. '+title,visual,text);
    }).join('')}</div></details>`;
  }
  function illustratedActions(step,id,index) {
    scenes ??= createScenes();
    const actions=sewingVisuals.operationActions(step,id);
    if (['seam','sew','layer','topstitch'].includes(id)) actions.splice(2,2,...machineSteps);
    const items=actions.map(({text,figure},i)=>{
      const local=scenes[figure], standard=sewingVisuals.figureParts(figure);
      if (local) return panel((i+1)+'. '+local[0],local[1],text);
      if (standard) return standardPanel((i+1)+'. '+standard[0],standard[1],text);
      return `<div class="wf-panel wf-written"><strong>${i+1}.</strong> ${escape(text)}</div>`;
    });
    return `<details class="wo-how wo-storyboard"${index===0?' open':''}><summary>Follow this step in pictures</summary><div class="wf-grid">${items.join('')}</div></details>`;
  }
  return {forStep,bodySheet,illustratedActions,machineActions};
})();
