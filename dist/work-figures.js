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
    const marks=(rows,x1,x2)=>rows.filter(([key])=>at(key)&&at(key)!=='—').map(([key,y])=>
      path(`M${x1} ${y}H${x2}`,'wf-dimension')+guide(x2,y,x2+14,y)+label(x2+18,y+4,key+' '+at(key))).join('');
    const torso=marks([['Upper chest circumference',43],['Chest / bust',60],['Underbust / rib cage',76],['Waist',93],['High hip circumference',109],['Hip / seat',127]],69,151);
    const leg=marks([['Thigh circumference',34],['Mid-thigh circumference',57],['Knee circumference',78],['Calf circumference',108],['Ankle circumference',138]],54,103);
    const panels=[];
    if (torso) panels.push(panel('Torso measurements',
      path('M75 28L93 19Q101 37 110 37Q119 37 127 19L145 28L154 52L140 88L151 142H69L80 88L66 52Z','wf-cloth')+torso,
      'Keep the tape level at each line. Compare these body measurements with the pattern size and the intended wearing ease.'));
    if (leg) panels.push(panel('Leg measurements',
      path('M57 20H108Q104 54 92 78Q101 99 86 138L88 152H63L67 137Q62 111 69 81Q52 51 57 20Z','wf-cloth')+leg,
      'Wrap the tape around one leg at each level. Use the pattern to check the finished leg width and room to move.'));
    return panels.length?strip('Where the model measurements go',panels):'';
  }
  function forStep(step,id,order,pattern) {
    const allowance=order.allowances||{};
    const movement=moveFigure(step,id);
    if (movement) return movement;
    if (id==='darts') return seamFold(allowance,true);
    if (['seam','layer','sew'].includes(id)) return seamFold(allowance);
    if (id==='topstitch') return strip('Topstitch placement',[topstitchPanel(allowance)]);
    if (['cut','designCut','grain'].includes(id)) return strip('Cutting and grainline',[
      layoutPanel(order.plan||{}),cutEdgePanel(allowance)
    ]);
    if (id==='finish' && /\bhem\b/i.test(step)) {
      const selected=pattern.design?.finish || '';
      if (/faced hem|hem facing/i.test(step+' '+selected)) return hemFold(allowance,'faced');
      if (/contrast hem band|attach\b.*\bband\b|coverstitch/i.test(step+' '+selected)) return '';
      if (allowance.first!=null || allowance.second!=null || /double.fold|turn .*twice/i.test(step+' '+selected)) return hemFold(allowance,'double');
      return `<details class="wf-optional"><summary>See a double-fold hem example</summary>${hemFold(allowance,'double')}</details>`;
    }
    return '';
  }

  function layoutPanel(plan) {
    const folded=plan.layout==='folded';
    const width=format(plan.usableWidth && (folded?plan.usableWidth/2:plan.usableWidth));
    const boundary=folded?'Fold':'Opposite selvage';
    const direction=plan.oneWay?'Cut all pieces with the print or nap arrows pointing the same way.':'Read the grainline and any direction arrow on each piece.';
    return panel(folded?'Set up the folded fabric':plan.layout==='single'?'Lay out one layer':'Check the pattern layout against your fabric',
      path('M37 38H290V139H37Z','wf-cloth')+guide(43,42,43,138)+guide(284,42,284,138)+
      path('M95 53H178L194 122H93Z','wf-right')+path('M130 113V63m-5 6l5 -6 5 6','wf-arrow')+
      guide(44,70,129,70)+guide(44,103,129,103)+label(48,63,'Same distance')+label(155,90,'Grainline')+
      span(43,284,31,width||'Measure usable width')+label(38,154,'Selvage')+label(288,154,boundary,'end'),
      `${folded?'Bring the selvages together without stretching the fold.':plan.layout==='single'?'Spread one layer flat. Flip paper pieces to cut left and right copies when the pattern calls for a mirrored pair.':'Use the layout for your pattern size and fabric width. Check whether it shows a fold or one layer.'} Measure from each end of the grainline to the same selvage. Adjust the paper until the two distances match. ${direction}`);
  }

  function cutEdgePanel(allowance) {
    const seam=format(allowance.seam);
    return panel('Find the cut edge and stitch line',
      path('M31 35H188V126H31Z','wf-cloth')+path('M150 42V119','wf-stitch')+
      span(150,188,134,seam||'Pattern allowance')+label(46,74,'Paper pattern')+label(199,54,'Solid cut edge')+label(66,109,'Stitch line')+
      path('M181 85L188 81L188 89Z','wf-right')+label(199,86,'Matching notch'),
      `Circle the cutting line for your size. Check whether the pattern already includes the ${seam?seam+' ':''}seam allowance before tracing. Weight the paper inside the outline. Keep the lower blade of the fabric shears flat on the board and follow the outer line without lifting the cloth. Mark the notches and label each piece before removing the paper.`);
  }

  function cutPiecePanel(piece) {
    const pieces={fold:'Match the marked fold edge to the fabric fold. Leave that edge uncut.',
      pair:'For a single-layer layout, cut the first side with the pattern face up, then flip the paper for the opposite side.',
      single:'Cut through one layer with the fabric face oriented as the pattern directs.',
      pattern:'Match this piece to the fold and layer instructions printed on the pattern.'};
    const width=format(piece.width)||'Width on pattern';
    const length=format(piece.length)||'Length on pattern';
    const grain=format(piece.grain);
    const folded=piece.mode==='fold';
    const left=folded?72:32, selvage=folded?207:42;
    return panel(piece.name+(piece.quantity?' · Cut '+piece.quantity:''),
      path(`M${left} 30H209V141H${left}Z`,'wf-cloth')+guide(selvage,36,selvage,137)+path('M72 50H161L181 124H72Z','wf-right')+
      path('M118 114V54m-5 6l5 -6 5 6','wf-arrow')+span(72,181,41,width)+tick(215,50,124,length)+
      (grain?span(Math.min(selvage,118),Math.max(selvage,118),111,grain):'')+
      label(selvage,154,'Selvage',folded?'end':'start')+label(folded?72:106,154,folded?'Fold edge':'Pattern edge'),
      `${pieces[piece.mode]||pieces.pattern} Copy the marked shape from your paper. ${grain?`Set both ends of the grainline ${grain} from the same selvage.`:'Measure both ends of the grainline to the same selvage.'}`);
  }

  function cuttingPlan(order,pattern) {
    const plan=order.plan||{};
    const panels=[layoutPanel(plan),cutEdgePanel(order.allowances||{}),
      panel('Transfer placement marks before lifting the paper',
        path('M28 32H198V129H28Z','wf-cloth')+guide(103,36,103,125)+guide(31,60,194,60)+
        path('M49 60h105M107 72h47v37h-47z','wf-dimension')+label(205,63,'Reference line')+label(205,101,'Feature outline')+
        label(83,148,'Center front or back'),
        'Mark matching notches, darts, pocket corners, and closure endpoints on the wrong side with chalk tested on scrap. Mark both layers. Use the paper markings to find each position, then label the wrong side of each piece with its name and left or right.')];
    const pieces=(plan.pieces||[]).map(cutPiecePanel);
    if (order.kind==='Tailoring' && !pieces.length) return '';
    return `<details class="design-options wo-cut-guide"><summary>Cutting layout and placement</summary><p class="tight">Use the paper pieces for ${escape(pattern.name)} to find the cutting shapes and quantities.</p><div class="wf-grid">${panels.join('')}${pieces.join('')}</div></details>`;
  }

  function topstitchPanel(allowance) {
    const distance=format(allowance.topstitch)||'Pattern distance';
    return panel('Guide the finished edge',
      path('M29 34H192V133H29Z','wf-cloth')+path('M186 38V129','wf-dimension')+path('M158 42V120','wf-stitch')+
      span(158,186,139,distance)+label(197,72,'Finished edge'),
      'Measure inward from the finished edge or seam as specified. Mark a short guide line on a scrap and test the spacing before you sew the garment.');
  }

  function seamPlan(order) {
    const finish=order.plan?.seamFinish;
    if (!finish || finish==='pattern') return '';
    const allowance=order.allowances||{};
    const seam=format(allowance.seam)||'Pattern allowance';
    const first=allowance.seam>=1.2?Math.round(allowance.seam*4)/10:null;
    const second=first==null?null:allowance.seam-first;
    const edge=(wrong,distance)=>path('M31 27H189V132H31Z',wrong?'wf-cloth':'wf-right')+
      path('M151 37V117','wf-stitch')+span(151,189,130,distance)+label(45,66,wrong?'Wrong sides touching':'Right sides touching');
    const choices={
      plain:['Plain seam with zigzag finish',[
        panel('Stitch the seam',edge(false,seam),'For woven fabric, place right sides together and sew the tested straight stitch at the marked allowance.'),
        panel('Finish and press the raw edges',path('M40 36H202V136H40Z','wf-cloth')+path('M120 38V133','wf-stitch')+
          path('M194 42l7 5 -7 5 7 5 -7 5 7 5 -7 5 7 5 -7 5 7 5 -7 5 7 5','wf-arrow')+label(207,72,'Zigzag at edge'),
          'Test zigzag stitch 04 with foot J on a scrap. Finish each raw edge separately for an open seam or both together when the pattern calls for a seam pressed to one side.')]],
      french:['French seam',[
        panel('First pass with wrong sides together',edge(true,format(first)||'First-pass allowance'),
          'Use this finish on a suitable straight or gently curved seam in light woven fabric. Start with wrong sides together. Sew the first pass on a scrap and trim the raw edges narrower than the enclosure in the next pass.'),
        panel('Enclose the trimmed edges',edge(false,format(second)||'Enclosure allowance'),
          `${first==null?'Use a pattern allowance that provides space for both passes.':`Fold on the first stitch line. The two passes use ${format(first)} plus ${format(second)} for a ${seam} total.`} With right sides touching, sew the second line to trap the raw edges inside and press to one side.`)]],
      felled:['Flat-felled seam',[
        panel('Stitch and trim one allowance',edge(false,seam),'Test on a straight woven seam. Stitch at the pattern allowance, press both allowances to the designated side, then trim the lower allowance narrower. Keep the upper allowance wide enough to cover it.'),
        panel('Wrap and topstitch',path('M31 45H190V132H31Z','wf-cloth')+path('M130 45H175V132H130Z','wf-fold')+
          path('M164 48V119','wf-stitch')+span(164,175,134,format(allowance.topstitch)||'Pattern spacing'),
          'Turn the wider raw edge under so it wraps around the trimmed edge. Press and clip the fold flat. Stitch along the folded edge and check that the lower raw edge is enclosed.')]],
      stretch:['Stretch seam',[
        panel('Test the seam at the pattern allowance',edge(false,seam),'Use a compatible stretch or ballpoint needle and a stitch your knit can stretch with. Test a narrow zigzag on layered scraps before sewing.'),
        panel('Pull the test seam along the stitching',path('M44 35H196V133H44Z','wf-cloth')+path('M117 41l7 6 -7 6 7 6 -7 6 7 6 -7 6 7 6 -7 6 7 6 -7 6 7 6','wf-stitch')+
          path('M98 69H54m6 -5l-6 5 6 5M144 69h43m-6 -5l6 5 -6 5','wf-arrow'),
          'Let the feed dogs guide the fabric so you do not stretch it while sewing. On the scrap, gently stretch the seam along the stitch line and check for broken stitches and ripples.')]]
    };
    if (!choices[finish]) return '';
    const [title,panels]=choices[finish];
    return `<details class="design-options wo-seam-guide"><summary>${title}</summary><p class="tight">Use this finish on seams that suit the fabric and pattern. Test it with the same layers and allowance first.</p><div class="wf-grid">${panels.join('')}</div></details>`;
  }

  function featurePlan(order,design) {
    const plan=order.plan||{}, allowance=order.allowances||{};
    const pocket=plan.pocket==='pattern'||!plan.pocket?design?.pocket:plan.pocket;
    const panels=[];
    if (pocket==='patch'||pocket==='Patch pockets') {
      const reference=plan.pocketReference||'Pattern reference line';
      const width=format(plan.pocketWidth)||'Finished width';
      const height=format(plan.pocketHeight)||'Finished height';
      panels.push(
        panel('Mark the finished pocket corners',
          path('M36 29H230V147H36Z','wf-cloth')+guide(58,33,58,143)+guide(36,48,229,48)+
          path('M118 77H176V126H118Z','wf-right')+span(118,176,73,width)+tick(187,77,126,height)+
          tick(233,48,77,format(plan.pocketDown)||'Down from line')+span(58,118,140,format(plan.pocketAcross)||'From center front')+
          label(74,40,reference),
          'Mark the horizontal reference on your flat front panel. Measure down to the pocket top and across from center front to its inner edge. Use the finished width and height to place the corners. Check the matching pocket against the same marks on the opposite side.'),
        panel('Press the edges, then stitch around the pocket',
          path('M39 29H212V141H39Z','wf-cloth')+path('M69 58H160V125H69Z','wf-right')+
          path('M75 63V118H154V63','wf-stitch')+span(69,75,137,format(allowance.topstitch)||'Topstitch spacing')+label(96,50,'Opening'),
          'Finish the pocket’s top edge first. Fold and press the side and bottom allowances to the wrong side. Clip the pocket on its placement marks, sew the sides and bottom, and reinforce the top corners while leaving the top open.'));
    }
    if (pocket==='inseam'||pocket==='In-seam pockets') panels.push(panel('Match the side-seam pocket openings',
      path('M31 30H186V136H31Z','wf-cloth')+path('M154 49Q229 48 215 113Q195 140 154 110Z','wf-fold')+
      path('M154 33V48M154 110V133','wf-stitch')+tick(230,49,110,format(plan.pocketHeight)||'Opening per pattern'),
      'Mark the opening ends on both front and back side seams. Attach the bags at those marks before joining the side seams. Sew around each bag and reinforce both opening ends. Check for room to put your hand in.'));
    if (pocket==='omit') panels.push(panel('Join across the optional pocket opening',
      path('M32 28H192V137H32Z','wf-cloth')+path('M152 33V130','wf-stitch')+span(152,192,143,format(allowance.seam)||'Seam per pattern'),
      'If the pattern allows omitting the pocket, use its plain panel or fill the pocket opening on the paper first. Baste the complete seam and check the shape before cutting the final panels.'));
    if (plan.strapLength || plan.strapWidth) panels.push(panel('Measure and mark the strap',
      path('M47 59H234V93H47Z','wf-fold')+guide(66,54,66,100)+guide(218,54,218,100)+
      span(66,218,49,format(plan.strapLength)||'Finished length')+tick(245,59,93,format(plan.strapWidth)||'Finished width'),
      'Measure between attachment points over the shoulder or around the neck during a fitting. Mark the finished length on the strip, then add the attachment allowances from your pattern to the cut length.'));
    if (plan.zipperOpening) panels.push(panel('Mark zipper opening on both sides',
      path('M31 23H184V141H31Z','wf-cloth')+path('M143 39V114M150 39V114','wf-stitch')+
      tick(176,39,114,format(plan.zipperOpening))+label(42,44,'Top stop')+label(42,117,'End of opening'),
      'Measure down from the marked top stop and transfer the opening endpoint to both edges. Baste the zipper tapes and close the zipper to check that crossing seams line up.'));
    if (plan.buttonSpacing) panels.push(panel('Mark button centers on the placket',
      path('M41 24H144V139H41Z','wf-cloth')+guide(94,30,94,132)+path('M90 52h8M90 81h8M90 110h8','wf-dimension')+
      tick(147,52,81,format(plan.buttonSpacing)),
      'Check placement and overlap on a fitting sample. Start from the pattern’s first button position. Mark down the centerline, then transfer each mark to the matching buttonhole side.'));
    if (plan.casingWidth) panels.push(panel('Mark the elastic casing depth',
      path('M31 35H194V114H31Z','wf-cloth')+path('M31 35H194V86H31Z','wf-fold')+path('M31 86H113m24 0h57','wf-stitch')+
      tick(205,35,86,format(plan.casingWidth))+label(99,104,'Opening'),
      'Fold and press to the planned casing depth. Leave an opening for threading. Check that the chosen elastic slides inside without twisting before closing the casing.'));
    return panels.length?`<details class="design-options wo-feature-guide"><summary>Feature placement and construction</summary><div class="wf-grid">${panels.join('')}</div></details>`:'';
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
  function actionPanel(order,figure,title,description,id) {
    const allowance=order.allowances||{};
    const general=allowance.seam;
    const seam=['neck','facing','neckFill'].includes(id)?allowance.neck??general
      : ['sleeve','armhole','sleeveCap'].includes(id)?allowance.armhole??general:general;
    const plan=order.plan||{};
    const annotated=format(seam)||'Pattern allowance';
    const local=scenes[figure];
    if (figure==='cut') return cutEdgePanel(allowance);
    if (figure==='grain') return layoutPanel(plan);
    if (figure==='fold') {
      const turn=format(allowance.first)||'Turn per pattern';
      return panel(title,path('M32 34H171V134H32Z','wf-cloth')+guide(33,105,170,105)+path('M32 106H171V134H32Z','wf-fold')+
        path('M91 145Q115 141 116 110m-5 6l5 -6 5 6','wf-arrow')+tick(184,106,134,turn)+label(43,66,'Wrong side up'),description);
    }
    if (figure==='sew' && id==='topstitch') return topstitchPanel(allowance);
    if (figure==='sew' || figure==='stitchStart') {
      return panel(title,scenes.stitchStart[1]+span(145,177,144,
        id==='topstitch'?format(allowance.topstitch)||'Pattern distance':annotated),description);
    }
    if (['clipCurve','turnFacing','matchSleeve','pin','foot','pinOut','allowance','zipClearance'].includes(figure) && local) {
      const line={
        clipCurve:guide(67,48,142,48)+tick(105,48,77,annotated),
        turnFacing:tick(104,69,89,annotated),
        matchSleeve:tick(114,32,44,annotated),
        pin:span(145,177,146,annotated),
        foot:span(146,177,144,annotated),
        pinOut:span(145,177,144,annotated),
        allowance:label(173,145,annotated,'middle'),
        zipClearance:format(plan.zipperOpening)?tick(169,45,115,format(plan.zipperOpening),-1):''
      }[figure];
      return panel(title,local[1]+line,description);
    }
    if (local) return panel(title,local[1],description);
    return '';
  }
  const practicalTips={
    grain:'If the selvages are tight and pull the fabric out of shape, let the fabric relax on the board before you straighten the fold.',
    cut:'Cut the larger pieces first so the smaller pieces can fit around them. Confirm every piece—including interfacing and lining—before making the first cut.',
    darts:'Draw both legs and the point on each mirrored piece. Compare the distance from the raw edge on the left and right so the darts finish level.',
    facing:'Test the turned edge on a scrap curve. Small clips release an inward curve. Keep them short of the stitches.',
    zipper:'Use a removable mark across both zipper tapes at any crossing seam. Match that mark as you baste the second side.',
    sleeve:'Pin shoulder and matching notches first. Then fill in between them. A sleeve cap should ease in smoothly unless the style calls for visible gathers.',
    finish:'Check the hem after pressing and before sewing. Compare finished length at the front, back and sides or on both legs.',
    fit:'Use basting that can be removed. Mark any pull lines while the garment is on, then double-check the measurements with it off the body.'
  };
  function illustratedActions(step,id,index,order={}) {
    scenes ??= createScenes();
    const actions=sewingVisuals.operationActions(step,id);
    if (['seam','sew','layer','topstitch'].includes(id)) actions.splice(2,2,...machineSteps);
    const items=actions.map(({text,figure},i)=>{
      const local=scenes[figure], standard=sewingVisuals.figureParts(figure);
      const title=(i+1)+'. '+(local?.[0] || standard?.[0] || 'Check the pattern');
      const measured=actionPanel(order,figure,title,text,id);
      if (measured) return measured;
      if (standard) return standardPanel((i+1)+'. '+standard[0],standard[1],text);
      return `<div class="wf-panel wf-written"><strong>${i+1}.</strong> ${escape(text)}</div>`;
    });
    const tip=practicalTips[id];
    return `<details class="wo-how wo-storyboard"${index===0?' open':''}><summary>Follow this step in pictures</summary><div class="wf-grid">${items.join('')}</div>${tip?`<p class="wo-tip"><strong>Tip</strong> ${tip}</p>`:''}</details>`;
  }
  return {forStep,bodySheet,cuttingPlan,seamPlan,featurePlan,illustratedActions,machineActions};
})();
