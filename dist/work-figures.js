'use strict';

const workFigures = (() => {
  const path=(d,style='wf-edge')=>`<path class="${style}" d="${d}"/>`;
  const label=(x,y,text,align='start')=>`<text x="${x}" y="${y}" text-anchor="${align}">${escape(text)}</text>`;
  const dimText=(x,y,text,align='start')=>`<text class="wf-dim-label" x="${x}" y="${y}" text-anchor="${align}">${escape(text)}</text>`;
  function tick(x,y1,y2,text,side=1) {
    const rise=y2-y1<12?-5:5;
    return path(`M${x-6} ${y1}h12M${x} ${y1}V${y2}M${x-6} ${y2}h12`,'wf-extension')+
      path(`M${x-2.5} ${y1+rise}L${x} ${y1}l2.5 ${rise}M${x-2.5} ${y2-rise}L${x} ${y2}l2.5 ${-rise}`,'wf-dimension')+
      dimText(x+side*10,(y1+y2)/2+4,text,side===1?'start':'end');
  }
  function span(x1,x2,y,text) {
    const run=x2-x1<12?-5:5;
    return path(`M${x1} ${y-6}v12M${x1} ${y}H${x2}M${x2} ${y-6}v12`,'wf-extension')+
      path(`M${x1+run} ${y-2.5}L${x1} ${y}l${run} 2.5M${x2-run} ${y-2.5}L${x2} ${y}l${-run} 2.5`,'wf-dimension')+
      dimText((x1+x2)/2,y-8,text,'middle');
  }
  const guide=(x1,y1,x2,y2)=>path(`M${x1} ${y1}L${x2} ${y2}`,'wf-guide');
  const leader=(x1,y1,x2,y2)=>path(`M${x1} ${y1}L${x2} ${y2}`,'wf-extension');
  const arrowhead=(x,y,direction)=>path(`M${x-5} ${y+direction*6}L${x} ${y}l5 ${direction*6}`,'wf-arrow');
  const texture=(x,y)=>path(`M${x} ${y+12}l12 -12m-4 12l12 -12m-4 12l12 -12`,'wf-guide');
  const format=value=>Number.isFinite(value)?Number(value.toFixed(3))+' cm':'';
  const num=(step,regex)=>step.match(regex)?.[1];
  function panel(title,drawing,description,classes='wf-panel step-figure') {
    return `<figure class="${classes}"><svg viewBox="0 0 330 164" role="img" aria-label="${escape(title)}" focusable="false">${drawing}</svg><figcaption><strong>${escape(title)}</strong><span>${escape(description)}</span></figcaption></figure>`;
  }
  function strip(title,panels) {
    return `<section class="wf-figures"><h4>${title}</h4><div class="wf-grid">${panels.join('')}</div></section>`;
  }
  function hemFold(allowances,mode) {
    const first=format(allowances.first)||'First turn per pattern';
    const second=format(allowances.second)||'Second turn per pattern';
    const total=Number.isFinite(allowances.first)&&Number.isFinite(allowances.second)
      ?format(allowances.first+allowances.second):'Total per pattern';
    const edge=format(allowances.seam)||'Pattern seam';
    if (mode==='faced') return strip('Facing the hem',[
      panel('1. Match the facing to the raw edge',path('M24 35H204V134H24Z','wf-right')+texture(44,58)+
        path('M34 91Q113 78 194 91V134H34Z','wf-cloth')+path('M26 119H202','wf-stitch')+
        leader(202,119,222,119)+leader(202,134,222,134)+tick(221,119,134,edge)+label(85,67,'Garment right side')+
        label(106,105,'Facing wrong side','middle')+label(82,153,'Match both cut edges'),
        'Lay the garment right side up. Place the facing right side down so the two right sides touch. Match seams and notches, then sew the dashed line through both pieces.'),
      panel('2. Roll the facing to the inside',path('M24 35H204V134H24Z','wf-cloth')+
        path('M25 98Q113 86 203 98V134H25Z','wf-fold')+texture(44,107)+path('M31 103Q111 91 194 103','wf-stitch')+
        path('M226 145Q269 139 252 109M248 118l4 -9 9 5','wf-arrow')+
        label(40,62,'Garment wrong side')+label(116,122,'Facing inside','middle')+label(66,153,'Finished hem edge'),
        'Trim or grade the seam allowance as your pattern directs. Roll the joined edge toward the wrong side and press. Secure the facing at the upper edge as specified.')
    ]);
    const base=path('M25 30H185V139H25Z','wf-cloth');
    return strip('Double-fold hem',[
      panel('1. Mark the first and second folds',base+guide(25,80,185,80)+guide(25,108,185,108)+
        path('M185 80H210M185 108H210M185 139H210','wf-extension')+tick(207,108,139,first)+tick(207,80,108,second)+
        label(38,52,'Wrong side facing up')+label(39,75,'Second fold mark')+label(39,103,'First fold mark')+label(39,155,'Raw cut edge'),
        `Use your ruler at several points along the raw edge. Measure in by the first turn and mark it. Measure farther in by the second turn and mark it. From the raw edge to the second mark, the total is ${total}.`),
      panel('2. Lift the raw edge and press the first fold',path('M25 30H185V108H25Z','wf-cloth')+
        path('M25 81H185V108H25Z','wf-fold')+texture(41,88)+guide(25,139,185,139)+
        path('M74 138Q108 129 109 85M103 93l6 -8 6 8','wf-arrow')+leader(185,81,207,81)+leader(185,108,207,108)+
        tick(205,81,108,first)+label(37,56,'Wrong side facing up')+label(121,76,'Raw edge is now here')+
        label(39,155,'Raw edge before turning'),
        'Grip the cut edge between your thumbs and fingers. Lift the edge toward the wrong side, bending at the first mark. Press the first narrow fold flat.'),
      panel('3. Tuck the raw edge into the second fold',path('M25 29H185V121H25Z','wf-cloth')+
        path('M25 88H185V121H25Z','wf-fold')+texture(42,99)+path('M28 94H183','wf-stitch')+
        leader(185,88,207,88)+leader(185,121,207,121)+tick(205,88,121,second)+
        path('M25 121H185','wf-dimension')+leader(157,93,163,72)+label(90,65,'Sew near inner fold')+
        label(39,141,'Finished lower edge')+label(40,52,'Wrong side facing up'),
        'Lift the entire first fold and turn it inward again along the second mark. Tuck the raw edge inside. Press, clip, and stitch near the inner fold. Remove each clip before it reaches the foot.')
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
      panel('1. Flip one piece so the right sides touch',path('M23 38H122V122H23Z','wf-right')+
        path('M202 38H300V122H202Z','wf-right')+texture(44,70)+texture(221,70)+
        path('M208 64Q170 40 123 76M131 67L123 76L135 78','wf-arrow')+
        path('M113 95l9 -5v10Z M211 95l-9 -5v10Z','wf-cloth')+
        label(73,111,'Right side','middle')+label(251,111,'Right side','middle')+label(73,145,'Leave flat','middle')+label(251,145,'Flip this piece','middle'),
        'Start with the right side of both pieces facing you. Pick up one piece and turn it over onto the other. The right sides touch inside. The wrong sides face out.'),
      panel('2. Match the cut edges and notches',path('M24 40H193V129H24Z','wf-right')+
        path('M34 35H194V72l-7 4 7 4V122H34Z','wf-cloth')+
        path('M154 55H196M154 97H196','wf-dimension')+leader(194,77,217,67)+leader(194,107,217,110)+
        label(222,70,'Matched notches')+label(222,113,'Aligned edges')+label(49,65,'Top wrong side')+label(48,147,'Both fabric layers'),
        'Line up the top and bottom raw edges, then match the notches. Place pins across the seam or clip the edges between marks. Keep both layers flat.'),
      panel('3. Sew at the recorded allowance',path('M25 31H205V119H25Z','wf-right')+
        path('M34 26H205V114H34Z','wf-cloth')+path('M151 33V112','wf-stitch')+
        path('M151 111V136M205 115V136','wf-extension')+span(151,205,139,size)+
        leader(151,50,125,38)+label(119,41,'Stitch line','end')+leader(205,63,227,63)+label(233,66,'Raw edges')+
        path('M114 62V100','wf-arrow')+arrowhead(114,100,-1)+label(58,112,'Sew this way'),
        `Use ${Number.isFinite(allowances.seam)?size:'the allowance stated in your pattern'} to mark the dashed stitching line inward from the aligned edges. Guide the fabric along the reference and remove each pin before sewing past it.`)
    ]);
  }
  function moveFigure(step,id) {
    const amount=num(step,/(\d+(?:\.\d+)?) cm (?:above|below) the old (?:hem|one on both sleeves|line at center)/);
    if (amount) {
      const up=step.includes(amount+' cm above');
      const edge=id==='sleeve'?'cuff':id==='band'?'waistline':'hem';
      const old=up?116:67, next=up?67:116;
      return strip('Where to move the '+edge,[
        panel((up?'Raise the ':'Lower the ')+edge,path('M27 22H176V140H27Z','wf-cloth')+path(`M29 ${old}H197`,'wf-guide')+
          path(`M29 ${next}H176`,'wf-stitch')+path(`M176 ${next}H197`,'wf-extension')+tick(193,67,116,amount+' cm')+
          label(40,old-5,'Original '+edge)+label(40,next-5,'New '+edge),
          `Measure ${amount} cm ${up?'above':'below'} the original ${edge}. Baste the new line and check it during the fitting before cutting.`)
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
    const shoulderMove=num(step,/shoulder (?:point )?(\d+(?:\.\d+)?) cm/);
    if (id==='shoulder' && shoulderMove) {
      const vertical=step.includes(shoulderMove+' cm up')||step.includes(shoulderMove+' cm down');
      const inward=new RegExp(shoulderMove.replace('.','\\.')+' cm (?:up|inward)').test(step);
      const [x1,y1,x2,y2]=vertical?[175,inward?72:53,175,inward?53:72]:[inward?175:151,65,inward?151:175,65];
      const old=guide(102,41,x1,y1);
      const next=path(`M102 41L${x2} ${y2}`,'wf-stitch');
      const dimension=vertical
        ?path(`M175 ${y1}H205M175 ${y2}H205`,'wf-extension')+tick(204,53,72,shoulderMove+' cm')
        :path(`M151 65V90M175 65V90`,'wf-extension')+span(151,175,90,shoulderMove+' cm');
      return strip('Move the shoulder point',[panel('Keep the neckline point fixed',
        path('M66 43L102 41L175 64Q177 92 205 109L192 142H57Z','wf-cloth')+old+next+dimension+
        label(103,34,'Fixed neckline point')+label(70,115,'Bodice'),
        'Make the marked change on both sides. Redraw the armhole, compare the front and back seams, and baste before trimming.')]);
    }
    const neckMove=num(step,/(?:neckline|neck-to-shoulder points) (?:up|down|inward|outward) by (\d+(?:\.\d+)?) cm/);
    if (['neck','neckFill'].includes(id) && neckMove && !step.includes('per side')) {
      const lower=step.includes('down by');
      return strip('Shift the center neckline',[panel(lower?'Lower the new neckline':'Add fabric inside the existing neckline',
        path('M25 46H205V142H25Z','wf-cloth')+
        path(`M46 46Q105 ${lower?82:112} 165 46`,'wf-guide')+path(`M46 46Q105 ${lower?112:82} 165 46`,'wf-stitch')+
        path('M105 64H214M105 79H214','wf-extension')+tick(215,64,79,neckMove+' cm')+label(84,135,'Center line'),
        'Measure at the center front or center back named in the step. Mark and test the curve before cutting or adding an inset.')]);
    }
    if (['neck','neckFill'].includes(id) && neckMove) {
      return strip('Mark the neckline width',[panel('Move each neck-to-shoulder mark',
        path(torsoShape,'wf-cloth')+guide(105,31,105,140)+path('M83 25V55M92 25V55M116 25V55M125 25V55','wf-extension')+
        span(83,92,25,neckMove+' cm')+span(116,125,25,'')+label(155,55,'Same change on both sides'),
        'Measure the amount at each neckline point in the direction stated in the step. Keep the opening symmetrical and refit the facing or binding.')]);
    }
    const underarm=num(step,/underarm point (\d+(?:\.\d+)?) cm/);
    if (id==='armhole' && underarm) return strip('Move the underarm point',[panel('Test the new arm opening',
      path('M34 34H130Q143 77 177 83V137H34Z','wf-cloth')+path('M130 34Q146 59 177 68','wf-guide')+
      path('M130 34Q143 77 177 83','wf-stitch')+path('M177 68H192M177 83H192','wf-extension')+tick(192,68,83,underarm+' cm'),
      'Use the higher or lower direction in the step. Blend the opening to the original shoulder and test reach on the fitting sample.')]);
    return '';
  }
  const valueFor=(sheet,key)=>{
    const value=sheet?.rows.find(([label])=>label===key)?.at(-1);
    return value==='—'?'':value||'';
  };
  const torsoShape='M69 32L86 26Q94 43 104 43Q114 43 122 26L139 32L149 56L133 86Q144 112 148 143H60Q63 112 75 86L59 56Z';
  const legShape='M57 20H108Q104 54 92 78Q101 99 86 138L88 152H63L67 137Q62 111 69 81Q52 51 57 20Z';
  const tape=(x1,x2,y,text)=>path(`M${x1} ${y}Q${(x1+x2)/2} ${y+10} ${x2} ${y}`,'wf-dimension')+
    guide(x2,y,x2+14,y)+dimText(x2+19,y+4,text);
  function torsoDrawing(sheet,{extra=false}={}) {
    const rows=[
      ['Upper chest circumference','Upper chest',48],['Chest / bust','Bust / chest',63],['Underbust / rib cage','Underbust',78],
      ['Waist','Waist',95],['High hip circumference','High hip',112],['Hip / seat','Hip / seat',130]
    ];
    const marks=rows.flatMap(([key,label,y],i)=>{
      const value=valueFor(sheet,key);
      return (value && extra || i%2===1)?[tape(68,143,y,label+(value?' '+value:''))]:[];
    }).join('');
    const shoulder=valueFor(sheet,'Shoulder span');
    const finished=sheet?.targets?.[0];
    return path(torsoShape,'wf-cloth')+marks+(shoulder?guide(69,30,69,19)+guide(139,30,139,19)+span(69,139,19,shoulder)+label(154,23,'Shoulder span'):'')+
      (finished?dimText(62,156,finished.join(' ')):'');
  }
  function bodySheet(sheet) {
    if (!sheet?.rows.length) return '';
    const leg=[['Thigh circumference',34],['Mid-thigh circumference',57],['Knee circumference',78],['Calf circumference',108],['Ankle circumference',138]]
      .filter(([key])=>valueFor(sheet,key)).map(([key,y])=>tape(57,103,y,key+' '+valueFor(sheet,key))).join('');
    const arm=[['Upper arm circumference','Upper arm',44],['Forearm circumference','Forearm',91],['Wrist circumference','Wrist',122]]
      .filter(([key])=>valueFor(sheet,key)).map(([key,name,y])=>tape(92,132,y,name+' '+valueFor(sheet,key))).join('');
    const armLength=valueFor(sheet,'Shoulder to wrist');
    const panels=[];
    panels.push(panel('Torso measurements',torsoDrawing(sheet,{extra:true}),
      'Keep the tape level around the body at each line. Compare these body measurements with the pattern size and the intended wearing ease.'));
    if (leg) panels.push(panel('Leg measurements',
      path(legShape,'wf-cloth')+leg,
      'Wrap the tape around one leg at each level. Use the pattern to check the finished leg width and room to move.'));
    if (arm || armLength) panels.push(panel('Arm measurements',
      path('M87 33Q111 10 132 32L137 65Q138 85 134 105L130 125L113 127Q103 110 101 93L86 62Z','wf-cloth')+arm+
      (armLength?path('M70 26H100M70 126H112','wf-extension')+tick(70,26,126,armLength,-1):''),
      'Check length with the elbow slightly bent. The arm measurements inform the fitting sample. Match the sleeve seam to the pattern armhole.'));
    return panels.length?strip('Where the model measurements go',panels):'';
  }
  function forStep(step,id,order,pattern) {
    const allowance=order.allowances||{};
    const movement=moveFigure(step,id);
    if (movement) return movement;
    if (Object.hasOwn(seatedRegions,id)) return seatedPanels(step,id,order,pattern.measurements)[0];
    if (id==='strap') return strapPanels(step,order,pattern.design)[0];
    if (id==='sleeve' && sleeveStylePattern.test(step)) return sleeveStylePanels(step,order,pattern.measurements)[0];
    if (id==='designLaceTrim') return laceTrimPanels(step)[0];
    if (straplessVisuals.includes(id) || id==='strapless' || id==='facing' && /strapless upper edge/i.test(step)) {
      return straplessPanels(id,order,pattern.measurements,pattern.design)[0];
    }
    if (seamDesignPhases.includes(id)) return designSeamPanels(id,order,pattern.design)[0];
    if (layerPhases.includes(id)) return layerPanels(step,id,order,pattern.design)[0];
    if (id==='darts') return seamFold(allowance,true);
    if (['seam','layer','sew'].includes(id) || id==='shoulder' && /^Sew and press the shoulder seams\b/i.test(step)) {
      return seamFold(allowance);
    }
    if (id==='topstitch') return strip('Topstitch placement',[topstitchPanel(allowance)]);
    if (['cut','designCut','grain'].includes(id)) return strip('Cutting and grainline',[
      layoutPanel(order.plan||{}),cutEdgePanel(allowance)
    ]);
    if (id==='fairyHem' || id==='hemContour') return '';
    if (id==='asymmetricFit') return asymmetricPanels(step,order,pattern.design)[0];
    if (id==='finish' && /\bhem\b/i.test(step)) {
      const selected=pattern.design?.finish || '';
      if (/faced hem|hem facing/i.test(step+' '+selected)) return hemFold(allowance,'faced');
      if (/contrast hem band|attach\b.*\bband\b|coverstitch/i.test(step+' '+selected)) return '';
      if (allowance.first!=null || allowance.second!=null || /double.fold|turn .*twice/i.test(step+' '+selected)) return hemFold(allowance,'double');
      return `<details class="wf-optional"><summary>See a double-fold hem example</summary>${hemFold(allowance,'double')}</details>`;
    }
    return '';
  }

  const seatedRegions={
    upperHip:{title:'Upper hip',y:78,check:'Make sure the waist stays in place and the upper hips have room when you sit.'},
    seatDepth:{title:'Back seat depth',y:102,check:'Look at the back and side while seated. Check for diagonal pull lines and make sure the back hem still covers the intended area.'},
    lapEase:{title:'Lap',y:104,check:'Check that the front panel rests across the thighs and that the side seams hang evenly after you stand.'},
    kneeEase:{title:'Knee level',y:132,check:'Check room at the knees while seated and when rising. Walk a few steps to verify stride and coverage.'},
    sittingLength:{title:'Center-back length',y:116,check:'Compare coverage and hem balance when sitting and standing. Level the hem after confirming the back length.'}
  };
  function seatedPanels(step,id,order,measurements) {
    const region=seatedRegions[id];
    const amount=step.match(/([+−-]?\d+(?:\.\d+)?) cm/i)?.[1];
    const lowerAmount=/^(?:remove|reduce|subtract|shorten|take in)/i.test(step) || /^[−-]/.test(amount||'');
    const value=amount?amount.replace(/^[-+−]/,'')+' cm':'';
    const change=value?(lowerAmount?'Remove ':'Add ')+value:'Mark on the sample';
    const around=['upperHip','lapEase','kneeEase'].includes(id);
    const allowance=format(order.allowances?.seam);
    const after=lowerAmount?'Narrower':'Wider';
    const skirt=path('M78 40H139Q145 74 158 89L177 143H40L60 89Q72 73 78 40Z','wf-cloth');
    const side=path('M84 35H127Q135 59 155 77Q169 95 147 126L125 148H68L71 107Q57 72 84 35Z','wf-cloth');
    const waist=guide(69,47,152,47)+label(173,50,'Waist reference');
    const hip=valueFor(measurements,'Hip / seat');
    let marks,adjustment;
    if (around) {
      const ends={upperHip:[66,150],lapEase:[56,163],kneeEase:[46,173]}[id];
      marks=tape(...ends,region.y,value?change+' total':region.title);
      const newEdge=lowerAmount?146:172;
      const eachEdge=amount && /(?:two|both) side seams/i.test(step)?format(Math.abs(Number(amount.replace('−','-')))/4):'';
      adjustment=path('M87 34H138L167 140H55Z','wf-cloth')+guide(108,40,108,136)+
        guide(138,41,157,137)+path(`M138 41L${newEdge} 137`,'wf-stitch')+
        dimText(187,81,value?change+' total':'Transfer the fit mark')+
        label(187,102,after+' seam line')+
        (allowance?dimText(187,125,allowance+' allowance'):'')+
        (eachEdge?path(`M157 137V151M${newEdge} 137V151`,'wf-extension')+
          span(Math.min(157,newEdge),Math.max(157,newEdge),152,eachEdge)+label(187,155,'One edge'):'');
    } else if (id==='seatDepth') {
      marks=side+waist+guide(151,102,197,102)+label(202,106,'Measure at fullest seat');
      const old=lowerAmount?158:141, next=lowerAmount?141:158;
      adjustment=side+path(`M127 48Q${old} 79 ${old} 102Q${old} 121 123 143`,'wf-guide')+
        path(`M127 48Q${next} 79 ${next} 102Q${next} 121 123 143`,'wf-stitch')+
        path('M141 102V118M158 102V118','wf-extension')+
        span(141,158,119,value||'Depth change')+label(174,99,'Side view')+label(175,131,'Back seat');
    } else {
      marks=skirt+waist+guide(111,49,111,145)+label(171,115,'Measure down the back');
      const old=lowerAmount?114:87, next=lowerAmount?87:114;
      adjustment=path('M74 39H150L177 143H74Z','wf-cloth')+guide(74,38,74,145)+
        path(`M74 ${old}L162 96`,'wf-guide')+path(`M74 ${next}L162 96`,'wf-stitch')+
        path('M55 87H74M55 114H74','wf-extension')+tick(54,87,114,value||'Change',-1)+
        label(77,156,'Center back')+guide(162,96,186,96)+label(193,100,'Blend to side seam');
    }
    const firstDrawing=around?skirt+waist+marks:marks;
    return [
      panel('Locate the '+region.title.toLowerCase()+' on the toile',firstDrawing,
        id==='seatDepth'?'Mark where the fullest part of the seat touches the back skirt while sitting. Use the side view to distinguish back room from front lap room.'
          :id==='sittingLength'?'Mark the waist and center back on the toile, then sit to check back coverage. Keep the waist reference fixed while measuring the change in length.'
            :'Mark the level on the fitted garment while seated. Keep the tape level at the marked line. The pictured change applies around the skirt at this level.'),
      panel(around?'Transfer the total circumference change':'Transfer the measured back adjustment',adjustment,
        around?'Pin or baste the change on the toile, distributing the total between the panels that need it. Blend into adjoining edges and match seam lengths before adding the pattern allowance.'
          :'Transfer the tested change to the back pattern. Blend to the unchanged adjoining seams and walk the seam lengths before marking the cut line.'),
      panel('Compare sitting and standing',path('M71 31Q95 20 114 40L116 77Q148 82 176 92L178 107L172 145H153L159 108H91Q69 105 67 91Z','wf-cloth')+
        path('M52 62V114H150V149M58 114V149','wf-edge')+guide(113,84,153,71)+label(157,73,'Watch the lay over the lap')+
        (hip?dimText(187,128,'Model hip / seat '+hip):''),
        region.check+' Transfer the final marks to the paper pattern only after both checks.')
    ];
  }

  function strapPanels(step,order,design) {
    const plan=order.plan||{};
    const widthMark=num(step,/(\d+(?:\.\d+)?) cm wide/i);
    const width=widthMark?widthMark+' cm':format(plan.strapWidth);
    const measuredWidth=widthMark?Number(widthMark):plan.strapWidth??design?.strapWidth;
    const length=format(plan.strapLength);
    const placement=step.match(/(\d+(?:\.\d+)?) cm (inward|outward) from the starting shoulder mark/i);
    const halter=/\bhalter\b/i.test(step) || design?.support==='Halter strap' && !/shoulder straps|wide straps|narrow straps|spaghetti straps/i.test(step);
    const single=/one[- ]shoulder/i.test(step) || design?.support==='One-shoulder';
    const shoulderSide=step.match(/wearer['’]s (left|right) shoulder/i)?.[1] || studioDesign.selectedShoulderSide(design);
    const side=placement?.[2].toLowerCase();
    const old=side==='outward'?75:51;
    const target=side==='outward'?51:75;
    const frontMark=single && shoulderSide==='left'?168-target:target;
    const originalMark=single && shoulderSide==='left'?168-old:old;
    const backMark=single?168-frontMark:target;
    const attach=(x,offset=0)=>path(`M${x+offset-7} 68h14`,'wf-stitch');
    const bodice='M30 69H137L130 111Q124 129 125 144H42Q43 129 37 111Z';
    const front=path(bodice,'wf-cloth')+guide(84,72,84,143)+attach(frontMark)+(single?'':attach(168-target));
    const backing=path('M180 69H287L280 111Q274 129 275 144H192Q193 129 187 111Z','wf-right')+
      guide(234,72,234,143)+(halter?'':attach(backMark,150)+(single?'':attach(168-target,150)));
    const connectors=halter
      ?path(`M${target} 65Q${target} 30 84 30Q${168-target} 30 ${168-target} 65`,'wf-arrow')+label(84,20,'Around neck','middle')
      :path(`M${frontMark} 64V53Q${frontMark} 37 ${frontMark+18} 37H${backMark+132}Q${backMark+150} 37 ${backMark+150} 53V64`,'wf-arrow')+
        label(158,29,single?'Wearer’s '+shoulderSide+' shoulder':'Route over shoulder','middle');
    const offset=placement?guide(originalMark,64,originalMark,88)+guide(frontMark,69,frontMark,88)+
      span(Math.min(originalMark,frontMark),Math.max(originalMark,frontMark),91,placement[1]+' cm')+label(145,97,side):'';
    const pad=format(order.allowances?.neck??order.allowances?.seam);
    const start=64,end=203,outerLeft=38,outerRight=225,yTop=63,yBottom=97;
    const plannedStrip=path(`M${outerLeft} ${yTop}H${outerRight}V${yBottom}H${outerLeft}Z`,'wf-cloth')+
      path(`M${start} ${yTop}V${yBottom}M${end} ${yTop}V${yBottom}`,'wf-stitch')+
      path(`M${start} ${yTop}V40M${end} ${yTop}V40M${outerRight} ${yTop}H242M${outerRight} ${yBottom}H242`,'wf-extension')+
      span(start,end,43,length||'Finished length')+tick(241,yTop,yBottom,width||'Pattern width');
    const values={...design};
    for (const key of Object.keys(studioDesign.strapShapeLimits)) if (Number.isFinite(plan[key])) values[key]=plan[key];
    const shape=studioDesign.strapShape(values);
    const shaped=studioDesign.supportsStrapShape(design?.support)||/Front attachment uses \d+%/.test(step)||
      shape.strapFrontCurve || shape.strapBackCurve || shape.strapFrontTaper!==100 || shape.strapBackTaper!==100;
    const joins=shape.strapFrontJoin || shape.strapFrontAngle || !halter && (shape.strapBackJoin || shape.strapBackAngle);
    return [
      panel(halter?'Mark front anchors for the halter':single?'Mark one shoulder on the front and back':'Locate both strap anchors on front and back',
        front+backing+connectors+offset+label(84,126,'Front','middle')+label(234,126,halter?'Back · no anchors':'Back','middle'),
        placement?`Measure ${placement[1]} cm ${side} from the starting ${single?shoulderSide+' shoulder mark':'shoulder mark on each side'}. Mark the attachment points on the fitting sample and check coverage before cutting.`
          :halter?'Mark where the halter ends meet the front. Check the fit around the back of the neck, including the closure.'
            :single?`Mark where the support meets the front and back over the wearer’s ${shoulderSide} shoulder. Transfer those two marks separately to the paper pattern.`
              :'Mark both ends of each strap on the fitting sample. Match the left and right sides, then transfer every marked end to the paper pattern.'),
      ...(shaped?strapShapePanels(shape,measuredWidth,halter):[]),
      ...(joins?[strapJoinPanel('Front',shape.strapFrontJoin,shape.strapFrontAngle),
        ...(halter?[]:[strapJoinPanel('Back',shape.strapBackJoin,shape.strapBackAngle)])]:[]),
      panel('Measure between the attachment lines',
        plannedStrip+label(58,119,'Front mark')+label(170,119,halter?'Neck mark':'Back mark')+
        (pad?span(outerLeft,start,145,pad):''),
        `${width?'Check the finished width at '+width+'. ':''}${length?'Use '+length+' between the marked lines and check it on the fitting sample. ':'Measure between the attachment marks on the wearer. '}Add the pattern’s attachment allowance to the cut length. A folded or turned strap also needs the cut width specified by its construction.`),
      panel('Baste both ends and check the fit',
        path('M52 43H258V133H52Z','wf-cloth')+path('M130 26H155V102H130Z','wf-right')+
        path('M116 66H169M131 85H154','wf-stitch')+guide(155,85,193,85)+label(198,89,'Baste here')+
        (width?span(130,155,123,width):''),
        `Keep each strap flat and untwisted. Baste it at the marks and try on the garment. Check reach, ${single?'balance':'symmetry'}, and coverage before permanently sewing and reinforcing the attachment as the pattern directs.`)
    ];
  }

  function strapShapePanels(shape,width,halter) {
    const reference=halter?'Neck reference':'Shoulder';
    const back=halter?'Back collar':'Back attachment';
    const sections=[['Front attachment',57,shape.strapFrontCurve,shape.strapFrontTaper],
      [reference,165,0,100],[back,273,shape.strapBackCurve,shape.strapBackTaper]];
    const y=curve=>87-Math.sign(curve)*Math.min(23,Math.abs(curve)*5);
    const halfWidth=taper=>Math.min(.12,17/Math.max(100,shape.strapFrontTaper,shape.strapBackTaper))*taper;
    const [front,shoulder,rear]=sections.map(([,x,curve,taper])=>({x,y:y(curve),half:halfWidth(taper)}));
    const boundary=(direction,start,end)=>`Q${(start.x+end.x)/2} ${start.y+start.half*direction} ${end.x} ${end.y+end.half*direction}`;
    const strip=path(`M${front.x} ${front.y-front.half}${boundary(-1,front,shoulder)}${boundary(-1,shoulder,rear)}L${rear.x} ${rear.y+rear.half}${boundary(1,rear,shoulder)}${boundary(1,shoulder,front)}Z`,'wf-cloth')+
      path(`M57 ${front.y}Q109 ${front.y} 165 87Q222 87 273 ${rear.y}`,'wf-guide');
    const widthMarkings=sections.map(([name,x,curve,taper])=>{
      const half=halfWidth(taper), center=y(curve);
      const amount=Number.isFinite(width)?format(width*taper/100):`${taper}%`;
      return tick(x,center-half,center+half,'')+label(x,21,name,'middle')+dimText(x,39,amount,'middle')+
        label(x,138,`${taper}% of reference`,'middle');
    }).join('');
    const panels=[panel('Mark the finished strap widths',strip+widthMarkings,
      `Mark the center of the ${reference.toLowerCase()} width. Measure across the strap at each reference line. Blend the front and back widths into the center width. Mark the edge allowance outside the finished outline, using the cut pattern’s instructions.`)];
    if (shape.strapFrontCurve || shape.strapBackCurve) {
      const marked=sections.filter(([,x])=>x!==165).map(([name,x,curve])=>{
        const curvy=y(curve);
        return label(x,32,name,'middle')+path(`M${x-10} 87H${x+10}`,'wf-guide')+path(`M${x-10} ${curvy}H${x+10}`,'wf-stitch')+
          (curve?tick(x,Math.min(curvy,87),Math.max(curvy,87),''):'')+
          dimText(x,141,curve?`${format(Math.abs(curve))} ${curve>0?'inward':'outward'}`:'Starting centerline','middle');
      }).join('');
      panels.push(panel('Mark the separate front and back curves',strip+marked+label(165,32,reference,'middle')+label(165,145,'Starting width mark','middle'),
        'Measure each shift from its starting attachment centerline on the fitted pattern. Inward moves toward the neckline, and outward moves away. Blend from each shifted mark back toward the center reference while keeping the planned widths. Baste and check coverage before cutting final fabric.'));
    }
    return panels;
  }

  function strapJoinPanel(end,depth,angle) {
    const startingY=68;
    const joinY=startingY+depth*8;
    const difference=Math.tan(angle*Math.PI/180)*34;
    const innerY=joinY+difference;
    const outerY=joinY-difference;
    const baseline=path(`M41 ${startingY}H226`,'wf-dimension')+label(47,startingY-8,'Starting edge');
    const depthMark=depth?leader(163,joinY,248,joinY)+leader(227,startingY,248,startingY)+tick(246,startingY,joinY,format(depth))
      :dimText(239,startingY+4,'0 cm');
    const join=path(`M129 ${innerY}L197 ${outerY}`,'wf-stitch')+guide(163,29,163,joinY)+
      leader(130,innerY,106,143)+label(103,148,'Neckline side','end')+leader(197,outerY,207,143)+label(210,148,'Outer side');
    const radians=angle*Math.PI/180;
    const arc=angle?path(`M185 ${joinY}A22 22 0 0 ${angle<0?1:0} ${163+22*Math.cos(radians)} ${joinY-22*Math.sin(radians)}`,'wf-dimension'):'';
    const angleMark=guide(123,joinY,203,joinY)+arc+leader(181,joinY,241,131)+dimText(247,135,`${Math.abs(angle)}°`);
    return panel(`Mark the ${end.toLowerCase()} strap joining line`,path('M41 68H227V153H41Z','wf-cloth')+
      path(`M129 28H197V${outerY}L129 ${innerY}Z`,'wf-right')+baseline+depthMark+join+angleMark+
      label(163,17,`${end} strap midpoint`,'middle'),
      `Measure ${depth?`${format(depth)} down the fabric`:'at the starting edge'} at the strap midpoint and sketch the crosswise line. ${angle?`Mark the join at ${Math.abs(angle)}° to that line, with the ${angle>0?'neckline':'outer'} side extending farther along the fabric.`:'Keep the marked join crosswise.'} Mark both endpoints on the strap and its matching garment piece. Check clearance and baste the seam before sewing.`);
  }
  const straplessVisuals=['straplessElasticFit','straplessElasticLength','straplessElasticCasing','straplessElasticFinish',
    'straplessStructuredFit','straplessChannels','straplessStructuredFinish'];
  function straplessPanels(id,order,measurements,design) {
    const plan=order.plan||{};
    const legacy=!straplessVisuals.includes(id);
    const support=plan.straplessSupport || design?.straplessSupport;
    const stage=legacy && support
      ?studioDesign.selectedStraplessSupport({...design,straplessSupport:support})==='Structured bodice'?'straplessStructuredFit':'straplessElasticFit'
      :id;
    const allowance=format(order.allowances?.neck??order.allowances?.seam)||'Pattern allowance';
    const bust=valueFor(measurements,'Chest / bust');
    const shell=path('M38 49Q69 35 102 51Q137 37 172 49L156 135H55Z','wf-cloth');
    const top=path('M38 49Q69 35 102 51Q137 37 172 49','wf-dimension');
    const fit=panel('Mark the finished strapless edge',shell+top+guide(170,49,195,38)+label(199,40,'Finished upper edge')+
      guide(104,52,104,131)+label(105,150,'Center front','middle')+(bust?tape(51,163,89,'Model bust '+bust):''),
      'Fasten the toile as it will be worn. Mark the finished edge at center front, center back and both sides. Check coverage while standing, sitting and reaching, then take the marks back to the pattern.');
    const facing=panel('Match the facing to the top-edge marks',shell+
      path('M40 52Q69 39 102 55Q138 41 171 52L168 75Q137 63 103 77Q71 62 44 75Z','wf-fold')+
      path('M42 65Q70 51 103 67Q137 53 169 64','wf-stitch')+
      leader(171,50,205,50)+leader(169,64,205,64)+tick(203,50,64,allowance)+label(102,109,'Garment side','middle'),
      'Trace the shaped facing from the confirmed pattern. Match the center and side notches before sewing. Measure the seam allowance from the matched raw edges to the marked stitching line.');
    if (stage==='straplessElasticFit' || stage==='straplessStructuredFit') {
      const structured=stage==='straplessStructuredFit';
      const visual=structured?path('M70 67Q74 91 66 130M103 70V131M139 65Q131 94 142 130','wf-stitch'):
        path('M41 59Q68 46 103 62Q140 49 170 59','wf-stitch');
      return [fit,panel(structured?'Baste the sample with its foundation':'Mark the elastic path inside the sample',
        shell+visual+leader(166,structured?94:58,192,structured?88:56)+label(196,structured?91:59,structured?'Foundation seam':'Elastic path'),
        structured?'Match the sample foundation to its fitted body seams. Fasten the closure and fit it with the intended underlayers and a test fabric with similar weight to the finished garment.'
          :'Use washable chalk to mark where the elastic will sit just inside the finished edge. Carry the marks around the upper edge and check where the elastic meets any opening.')];
    }
    const length=format(plan.straplessElasticLength);
    const width=format(plan.straplessElasticWidth);
    const overlap=format(plan.straplessElasticOverlap);
    const casing=format(plan.straplessCasingWidth);
    if (stage==='straplessElasticLength') return [
      panel('Test the elastic on the wearer',shell+path('M40 58Q68 45 102 59Q138 45 171 58','wf-stitch')+
        path('M53 46v23m100-23v23','wf-dimension')+leader(154,62,183,77)+label(187,80,'Pin the fit marks')+
        label(103,147,'Test at the actual upper edge','middle'),
        'Use the elastic chosen for this garment. Hold it where it will sit and pin the marks on the fitting sample at a comfortable tension. For a pull-on opening, also check the loop can pass over the body when stretched.'),
      panel('Measure the fitted length with the elastic relaxed',path('M37 65H239V105H37Z','wf-fold')+
        path('M55 65V105M222 65V105','wf-stitch')+span(55,222,51,length||'Mark and measure relaxed length')+
        (width?tick(246,65,105,width):label(252,86,'Elastic width'))+label(53,122,'First mark')+label(221,122,'Second mark','middle'),
        `${length?`Recheck the recorded ${length} fitted length with the elastic relaxed. `:'Remove the elastic and let it relax before measuring between your test marks. '}Add the join or anchor allowance from the chosen construction method before marking the cut ends.`)
    ];
    if (stage==='straplessElasticCasing') return [
      panel('Sew the casing with room for the elastic',path('M30 39H226V126H30Z','wf-cloth')+path('M30 39H226V91H30Z','wf-fold')+
        path('M32 90H116M150 90H224','wf-stitch')+path('M38 63H215','wf-dimension')+
        tick(237,39,90,casing||'Test clear width')+label(81,56,'Elastic path')+label(110,113,'Threading gap'),
        `Fold or turn the faced edge to the marked casing width. Stitch its inner line, leaving a gap for threading. ${casing?`Check ${casing} of clear space inside. `:''}${width?`Slide a piece of the ${width} elastic through your test casing. `:''}Make sure it slides flat without rolling.`),
      panel('Thread the elastic through the gap',path('M36 44H230V117H36Z','wf-fold')+path('M37 100H114M153 100H230','wf-stitch')+
        path('M64 66H197l-7 -5m7 5l-7 5','wf-arrow')+path('M119 71h12v39h-12Z','wf-right')+
        leader(127,105,145,127)+label(149,131,'Hold the trailing end')+label(61,84,'Feed with bodkin'),
        'Attach the bodkin or safety pin to the first end. Feed it a little at a time, gathering the casing in front of the pin and pulling it off the back. Keep the other end clipped outside the gap.'),
      panel('Baste and test the sew-in option',path('M29 44H241V123H29Z','wf-cloth')+path('M29 77H241V106H29Z','wf-fold')+
        path('M50 70V112M135 70V112M221 70V112','wf-dimension')+
        path('M51 92l6 -5 6 5 6 -5 6 5 6 -5 6 5 6 -5 6 5 6 -5 6 5 6 -5 6 5 6 -5 6 5 6 -5 6 5 6 -5 6 5 6 -5 6 5 6 -5 6 5 6 -5 6 5 6 -5 6 5 6 -5 6 5','wf-stitch')+
        label(59,60,'Match elastic and garment marks')+label(46,141,'Test zigzag 04 with foot J'),
        'If your pattern uses sew-in elastic, mark matching positions on both pieces and baste them first. Stretch the elastic gently between marks while sewing. Test the zigzag on the actual layers and pull the sample to verify the stitches hold.')
    ];
    if (stage==='straplessElasticFinish') return [
      panel('Secure a tested pull-on loop',path('M33 60H177V91H33ZM143 74H292V104H143Z','wf-fold')+
        path('M145 70V104M173 70V104M146 82L171 98M171 82L146 98','wf-stitch')+
        span(143,177,52,overlap||'Tested overlap')+label(157,126,'Secure through both ends','middle'),
        'Lay the elastic flat without twists. Overlap by the allowance tested on your scrap and stitch the join as the elastic requires. Pull it gently to check the stitching, feed it into the casing and close the gap.'),
      panel('Anchor elastic beside a closure that crosses the edge',path('M32 48H143V135H32ZM160 48H272V135H160Z','wf-cloth')+
        path('M34 65H139V89H34ZM164 65H270V89H164Z','wf-fold')+path('M135 65V89M169 65V89','wf-stitch')+
        guide(151,46,151,133)+label(152,31,'Closure opening','middle')+label(152,152,'Anchor each end separately','middle'),
        'Where a zipper or buttons cross the elastic edge, attach the elastic ends to their marked reinforced points. Leave the closure free to open. Fasten the garment and check fit while breathing, sitting and reaching.')
    ];
    if (stage==='straplessChannels') return [
      panel('Mark the boning channels on the foundation',shell+top+
        path('M69 67Q74 100 72 126M103 66V127M138 64Q133 95 142 126','wf-stitch')+
        guide(54,62,160,62)+leader(140,97,183,91)+label(188,94,'Boning channel')+label(194,45,'Clear top allowance'),
        'Mark the channels and closure on the foundation from the tested pattern. Stop the bones short of the top and bottom stitching lines. Check each channel with the actual bone before closing its ends.'),
      panel('Test the bone and the channel together',path('M55 30H151V137H55Z','wf-cloth')+
        path('M81 37H126V129H81Z','wf-fold')+path('M101 48Q109 48 109 55V111Q109 119 101 119Q93 119 93 111V55Q93 48 101 48Z','wf-right')+
        path('M82 42V124M125 42V124','wf-stitch')+leader(106,56,166,53)+label(170,56,'Protected bone end')+
        leader(124,87,165,84)+label(169,87,'Channel stitching'),
        'Sew a channel on a scrap of the support layers and slide a finished bone through it. It should sit flat and keep its end covers in place. Follow the pattern for channel widths, bone length and any internal waist stay.')
    ];
    if (stage==='straplessStructuredFinish') return [facing,
      panel('Turn the facing inside and test the closure',shell+path('M44 56Q72 43 103 62Q136 47 170 55L167 79Q137 65 103 82Q71 65 47 78Z','wf-fold')+
        path('M44 58Q72 45 103 64Q136 49 170 57','wf-stitch')+leader(163,65,192,83)+label(196,86,'Facing inside'),
        'Grade or clip the allowance where required, then roll the seam so the facing sits inside. Anchor it at the seams as specified. Test the closure and comfort with the whole garment fastened and its weight supported.')];
    return [
      fit,facing
    ];
  }

  function laceTrimPanels(step) {
    const match=step.match(/^([^.]+)\. Apply (scalloped|eyelet|stretch) lace (\d+(?:\.\d+)?) cm wide \((#[0-9a-f]{6})\)/i);
    const edge=match?.[1] || 'Finished edge';
    const style=match?.[2].toLowerCase();
    const width=format(Number(match?.[3]))||'Actual trim width';
    const color=match?.[4]||'#f1e6da';
    const stretchy=style==='stretch';
    const laceBottom=style==='scalloped'?'Q218 126 203 110Q188 126 173 110Q158 126 143 110Q128 126 113 110Q98 126 83 110Q68 126 53 110':'H53';
    const openings=[68,98,128,158,188,218].map(x=>`<circle class="wf-edge" cx="${x}" cy="101" r="4"/>`).join('');
    const band=`<path d="M53 79H233V110${laceBottom}V79Z" fill="${color}" stroke="#70564f"/>`+openings;
    const zigzag=Array.from({length:16},(_,index)=>index%2?'4 5':'4 -5').join(' ');
    return [
      panel(`Measure the stitching path for ${edge.toLowerCase()}`,
        path('M34 43H228V101Q138 143 34 99Z','wf-cloth')+path('M36 96Q137 136 225 98','wf-dimension')+
        path('M49 98l3-8m28 18l2-8m27 14l1-7m24 9v-8m27 5l-1-7m27 2l-2-8m28 0l-3-8','wf-dimension')+
        guide(122,115,143,144)+label(151,149,'Flex tape along stitch path')+label(51,69,'Finished fabric face'),
        'Finish the edge and lay it flat. Guide a flexible tape along the actual stitching path through each curve or point. Mark the joins and openings. Check each sleeve, leg or layer separately and allow extra trim to match motifs and test a seam.'),
      panel('Baste the lace rail over the finished edge',
        path('M53 40H233V87H53Z','wf-cloth')+band+path('M54 87H232','wf-guide')+path('M54 82H232','wf-stitch')+
        guide(233,79,251,79)+guide(233,style==='scalloped'?118:110,251,style==='scalloped'?118:110)+
        tick(248,79,style==='scalloped'?118:110,width)+
        leader(86,81,70,62)+label(58,58,'Baste here')+label(156,58,'Garment right side')+
        label(142,139,'Decorative side extends past edge','middle'),
        'Place the lace right side out. Overlap the solid sewing rail with the finished fabric edge just enough to catch both layers. Clip at the matching marks first and baste the rail. Check the basting follows the edge without puckers.'),
      panel(stretchy?'Test a stretch stitch and recovery':'Test the stitch on matching layers',
        path('M33 47H139V85H111V108H46V85H33Z','wf-cloth')+path('M100 57H130V72H100Z','wf-fold')+
        label(115,69,stretchy?'04':'01 / 04','middle')+path('M151 74H252V114H151Z','wf-fold')+
        path(stretchy?`M158 96l${zigzag}`:'M158 94H246','wf-stitch')+label(132,140,'Test with foot J on the Brother CP2160F','middle'),
        stretchy?'Fit foot J and use a compatible stretch or ballpoint needle for the layers. Test zigzag 04 on the actual fabric and lace rail. Pull and release the sewn scrap to check that the stitches hold and the edge recovers.'
          :'Fit foot J and test centered straight stitch 01 if the garment and lace rail are stable. For an edge that must stretch, choose a compatible lace first, then test zigzag 04 on the actual layers and check recovery.'),
      panel('Keep the closure free and finish the trim ends',
        path('M36 44H148V99H36ZM166 44H279V99H166Z','wf-cloth')+
        `<path d="M36 85H143V113H36ZM171 85H279V113H171Z" fill="${color}" stroke="#70564f"/>`+
        path('M40 91H136M177 91H275M139 87V111M174 87V111','wf-stitch')+
        guide(157,47,157,111)+label(157,33,'Opening or closure','middle')+label(157,138,'Finish both ends separately','middle'),
        'Stitch through the solid rail and the fitted fabric edge. Match motifs at joins. At a zipper or other opening, finish the trim ends on each side and leave room for the fastening to work. Try on the garment and check any trimmed edge that moves or stretches.')
    ];
  }

  const sleeveStylePattern=/\b(flutter|bishop|tapered)\b/i;
  function sleeveStylePanels(step,order,measurements) {
    const style=step.match(sleeveStylePattern)?.[1].toLowerCase();
    const seam=format(order.allowances?.armhole??order.allowances?.seam)||'Pattern allowance';
    if (style==='flutter') return [
      panel('Keep the cap length and spread the flutter edge',
        path('M57 105Q69 53 131 38Q203 41 228 104Q141 151 57 105Z','wf-cloth')+
        path('M65 101Q82 54 131 47Q187 48 220 101','wf-stitch')+
        path('M86 116L105 60M124 129L131 50M169 128L156 56M204 117L178 65','wf-guide')+
        guide(134,39,185,28)+label(192,31,'Keep cap and notches')+label(73,152,'Slash from the lower edge'),
        'Slash the paper from the lower edge toward the cap and leave small hinges at the cap stitch line. Spread the sections gradually so the cap still matches the armhole. Mark and true the rounded edge on paper.'),
      panel('Test the curved finish on scrap',path('M47 38Q142 109 230 40L229 67Q143 149 46 66Z','wf-cloth')+
        path('M48 59Q145 136 228 58','wf-stitch')+guide(228,58,255,58)+guide(229,67,255,67)+
        tick(252,58,67,format(order.allowances?.first)||'Per pattern',-1)+label(128,135,'Support the curved edge','middle'),
        'Test the selected narrow finish on a curved scrap cut at the same grain. Guide the fabric without pulling, then press the finished edge flat before checking the drape.')
    ];
    if (style==='bishop') return [
      panel('Mark the bishop sleeve cap and gathered cuff line',
        path('M85 54Q122 23 173 37Q190 40 211 54L258 118Q155 143 51 118Z','wf-cloth')+
        path('M89 53Q128 35 174 46Q187 48 202 54','wf-stitch')+
        path('M64 110Q154 135 245 109M60 116Q155 141 248 115','wf-stitch')+
        path('M99 111v16m55-9v18m55-25v16','wf-dimension')+label(153,26,'Keep the sleeve cap','middle')+label(153,153,'Two rows of gathering stitches','middle'),
        'Match the cap to the armhole and keep its notches. Spread the lower sleeve for fullness. Leave two long rows of basting between the matching cuff marks, with thread tails so you can pull up the gathers.'),
      panel('Fit the cuff before trapping the gathers',path('M38 37H206V82Q121 114 38 82Z','wf-cloth')+
        path('M49 93H196V124H49Z','wf-fold')+path('M51 102H193','wf-stitch')+guide(67,76,67,106)+guide(173,76,173,106)+
        label(137,145,'Fitted cuff and closure','middle')+tick(215,93,102,seam),
        'Test the cuff around the wrist with the planned opening. Draw up the basting until the sleeve fits the cuff’s sewing line. Pin at the marks first, then divide the gathers between them.')
    ];
    return [
      panel('Transfer the upper arm, elbow and wrist levels',
        path('M58 56Q97 30 126 42Q152 48 169 64L146 136H99Z','wf-cloth')+
        guide(71,68,161,68)+guide(86,102,156,102)+guide(93,127,149,127)+
        label(173,71,valueFor(measurements,'Upper arm circumference')?'Model upper arm '+valueFor(measurements,'Upper arm circumference'):'Upper-arm level')+
        label(165,106,'Elbow bend')+label(161,131,valueFor(measurements,'Wrist circumference')?'Model wrist '+valueFor(measurements,'Wrist circumference'):'Wrist level'),
        'Mark the arm and wrist levels on the wearer and transfer them to the sleeve. Blend inside the old sleeve line toward the cuff with room to bend the elbow.'),
      panel('Mark a wrist opening only where the fitting calls for it',path('M55 43H184L171 135H72Z','wf-cloth')+
        path('M112 129V96M126 129V96','wf-stitch')+guide(112,95,196,95)+label(200,98,'Opening end')+
        path('M74 129H169','wf-dimension')+label(93,153,'Finished cuff edge'),
        'Check that the hand passes through the basted cuff. If it needs an opening, mark the opening and its finish from the fitted sleeve pattern. Preserve that space when you true and stitch the sleeve.')
    ];
  }

  const hemSides=['Front','Left','Back','Right'];
  const signedLength=value=>value?`${value>0?'+':''}${format(value)}`:'Base line';
  function hemShapePanels(source,allowance={},finish) {
    const shape=studioDesign.hemContour(source);
    const {hemDrop,hemPointCount,hemRotation,hemStyle}=shape;
    const fairy=hemStyle==='Fairy / handkerchief';
    const shifts=hemSides.filter(side=>shape['hem'+side]);
    if (!fairy && !shifts.length) return [];
    const point=(theta,radius=1)=>[Number((165+Math.cos(theta)*74*radius).toFixed(2)),Number((81+Math.sin(theta)*39*radius).toFixed(2))];
    const shapeAt=theta=>point(theta,1+Math.max(-.31,Math.min(.31,studioDesign.hemOffsetAt(source,theta)*.014)));
    const rim=path('M'+Array.from({length:192},(_,i)=>shapeAt(i*Math.PI/96).join(' ')).join('L')+'Z','wf-cloth');
    const axes=guide(165,28,165,132)+guide(82,81,248,81);
    const marks=hemSides.map((side,i)=>{
      const [x,y,align]=[[165,147,'middle'],[250,73,'start'],[165,12,'middle'],[80,73,'end']][i];
      return label(x,y,side,align)+(shape['hem'+side]?dimText(x,y+12,signedLength(shape['hem'+side]),align):'');
    }).join('');
    const tips=fairy?Array.from({length:hemPointCount},(_,i)=>{
      const [x,y]=shapeAt(Math.PI/2+(2*i+1)*Math.PI/hemPointCount-hemRotation*Math.PI/180);
      return `<circle class="wf-dimension" cx="${x}" cy="${y}" r="3" fill="#fbf5ef"/>`;
    }).join(''):'';
    const tipLayout=fairy?`${hemPointCount} long points${hemRotation?` · ${Math.abs(hemRotation)}° ${hemRotation>0?'left':'right'}`:''}`:'Hem landmarks';
    const panels=[panel(fairy?'Position the fairy hem points':'Position the hem changes',rim+axes+marks+tips+dimText(165,86,tipLayout,'middle'),
      `View from above with the front at the bottom. ${fairy?'Number the long points, marked with circles, so you can return to the same places during every fitting. ':''}Transfer the front, back, and wearer’s left and right marks to the paper. Positive measurements lower the edge, and negative measurements raise it.`)];
    if (fairy) {
      const skirt=path('M106 35H202Q226 78 271 113L232 104L207 142L176 116L139 142L107 115L77 130L38 110Q79 81 106 35Z','wf-cloth');
      panels.push(panel('Measure the high-to-low point drop',skirt+guide(49,104,282,104)+guide(207,142,282,142)+
        tick(282,104,142,format(hemDrop),-1)+label(214,87,'High point level')+label(89,155,'Side elevation'),
        `Check the ${format(hemDrop)} vertical drop on the unshifted hem shape. Then apply each local height change at its marked side, blend into the next point and check clearance at the lowest edges.`));
    }
    if (shifts.length) {
      panels.push(panel('Measure each adjusted edge from its marked base',
        hemSides.map((side,index)=>{
          const x=13+80*index, value=shape['hem'+side];
          const base=91,end=base+(value?Math.sign(value)*27:0);
          return path(`M${x} 33H${x+57}V${end}H${x}Z`,'wf-cloth')+guide(x-2,base,x+63,base)+
            path(`M${x} ${end}H${x+57}`,'wf-stitch')+label(x+29,25,side,'middle')+
            (value?tick(x+57,Math.min(base,end),Math.max(base,end),''):'')+dimText(x+28,138,signedLength(value),'middle');
        }).join('')+label(165,157,'Dashed gray = base edge','middle'),
        'Hold the tape vertically at each named position on the fitting sample. Mark the revised edge there, then connect the marks smoothly without moving the waist or attachment seam. Mark paper pieces by their position on the wearer.'));
    }
    const hemWidth=finish==='Double-fold hem' && Number.isFinite(allowance.first) && Number.isFinite(allowance.second)
      ?format(allowance.first+allowance.second):format(finish==='Double-fold hem'?undefined:allowance.seam);
    panels.push(panel('Add the hem finish allowance',path(fairy?'M51 36H220L169 137Z':'M49 40H218L232 135L44 125Z','wf-cloth')+
      path(fairy?'M79 46L166 115L196 55':'M55 106L223 116','wf-stitch')+
      path('M166 115H246M169 137H246','wf-extension')+tick(245,115,137,hemWidth||'Per pattern')+label(94,146,'Solid edge = cut','middle'),
      `Mark the ${hemWidth||'pattern’s'} finishing allowance beyond the checked finished line. Hang the garment first so bias sections can settle, then verify the marks on the wearer. Test the selected finish on a same-grain offcut.`));
    return panels;
  }

  function asymmetricPanels(step,order,design) {
    const key=studioDesign.asymmetryKeys(design).find(key=>step.startsWith((key==='panelSeam'?'Front panel seam':garmentFit.fields[key][0])+'.'));
    if (!key) return [];
    const {left,right}=studioDesign.asymmetry(design);
    const region={shoulder:47,armhole:66,neckDepth:57,bust:76,waist:93,hip:110,
      sleeveWidth:66,sleeveLength:82,cuff:87,sweep:125,thigh:107,knee:123,leg:139,length:138,panelSeam:99};
    const y=region[key];
    const sleeve=key.startsWith('sleeve')||key==='cuff';
    const trousers=design.model==='trousers';
    const skirt=design.model==='skirt';
    const body=trousers?'M109 75H221L230 144H184L165 105L146 144H100Z':skirt?'M116 65H214L240 141H90Z':
      sleeve?'M103 43L144 31Q165 50 186 31L228 43L262 86L224 103L211 84L218 143H112L119 84L106 103L68 86Z':
        'M110 45L145 31Q165 50 185 31L220 45Q218 66 202 79L211 103L228 142H102L119 103L128 79Q112 66 110 45Z';
    const places=sleeve?[96,234]:key==='neckDepth'?[148,182]:key==='panelSeam'?[145,185]:[126,204];
    const vertical=['armhole','neckDepth','sleeveLength','length'].includes(key);
    const legend=(name,x,value,side)=>{
      const change=value?signedLength(value):'Base fit';
      const edge=Math.max(82,Math.min(248,x+side*35));
      const align=side<0?'end':'start';
      const mark=vertical
        ?guide(x-10,y,x+10,y)+tick(x,y-11,y+11,'',side)
        :guide(x-6,y-14,x-6,y+7)+guide(x+6,y-14,x+6,y+7)+span(x-6,x+6,y,'');
      return mark+leader(x,y,edge-side*5,y-6)+label(edge,y-12,name,align)+dimText(edge,y+3,change,align);
    };
    const allowance=format(order.allowances?.seam)||'Pattern allowance';
    return [panel('Mark each side on the fitted garment',path(body,'wf-cloth')+guide(165,30,165,144)+
      legend('Wearer’s right',places[0],right[key],-1)+legend('Wearer’s left',places[1],left[key],1)+label(165,153,'Front view','middle'),
      'Start at the marked baseline on the fitted garment and apply the listed amount to the named side. Label the wearer’s left and right before removing the sample. Keep the opposite edge at its own recorded position.'),
    panel('True the left and right paper pieces separately',
      path('M44 44H113L130 132H33ZM219 44H290L299 132H199Z','wf-cloth')+
      path('M109 46L121 123M224 46L208 123','wf-stitch')+path('M117 73h9m-5 25h9M216 73h9m-15 25h9','wf-dimension')+
      span(121,130,143,allowance)+label(78,72,'Right','middle')+label(251,72,'Left','middle'),
      'Lay out the paper pieces with their face and grainline marked. Measure their sewing edges against the pieces they join at the same notches. Add the recorded allowance beyond the new sewing lines. Use each separately traced side where the design differs.')];
  }

  const layerHemSource=(layer,design)=>Object.hasOwn(layer,'hemStyle')?layer:design;
  function asymmetricHem(source) {
    const {hemLeft,hemRight,hemStyle,hemPointCount,hemRotation}=studioDesign.hemContour(source);
    return hemLeft!==hemRight || hemStyle==='Fairy / handkerchief' && Math.abs(Math.sin(hemRotation*hemPointCount*Math.PI/180))>.00001;
  }
  function asymmetricLayer(layer,design) {
    return asymmetricHem(layerHemSource(layer,design)) || ['Sweep','Attachment'].some(key=>(layer['left'+key]||0)!==(layer['right'+key]||0));
  }
  function cuttingLayout(plan,design,layer) {
    const {left,right}=studioDesign.asymmetry(design);
    const asymmetric=layer?asymmetricLayer(layer,design):design && (studioDesign.selectedSupport(design)==='One-shoulder' || asymmetricHem(design) ||
      Object.keys({...left,...right}).some(key=>(left[key]||0)!==(right[key]||0)) || studioDesign.layers(design).some(row=>asymmetricLayer(row,design)));
    return asymmetric?{...plan,layout:'single',asymmetric:true}:plan||{};
  }

  const singleSeamPhases=['designCenterFrontSeam','designCenterFrontGuide','designSinglePanelSeam','designSinglePanelGuide','designSinglePanelZipper'];
  const seamDesignPhases=['designWaistSeam','designPanelSeam',...singleSeamPhases];
  function singlePanelSeamFigures(id,order,design) {
    const {panelAngle:angle=0,panelZipper}=studioDesign.seams(design);
    const position=studioDesign.singleSeamLocation(angle);
    const reference=id.endsWith('Guide');
    const zipper=id==='designSinglePanelZipper';
    const radians=angle*Math.PI/180;
    const point=(rx,ry)=>[165+Math.sin(radians)*rx,80+Math.cos(radians)*ry];
    const [x,y]=point(72,44);
    const [ax,ay]=point(46,28);
    const amount=`${Number(Math.abs(angle).toFixed(2))}°`;
    const towards=angle>0?'wearer’s left':'wearer’s right';
    const direction=Math.abs(angle)===180?'around to center back':`toward the ${towards}`;
    const circle=`<circle class="wf-dimension" cx="${x}" cy="${y}" r="4" fill="#fbf5ef"/>`;
    const topView=path('M93 80a72 44 0 1 0 144 0a72 44 0 1 0 -144 0Z','wf-cloth')+
      guide(93,80,237,80)+guide(165,36,165,124)+path(`M165 80L${x} ${y}`,'wf-stitch')+circle+
      (angle?path(`M165 108A46 28 0 0 ${angle>0?0:1} ${ax} ${ay}`,'wf-dimension'):'')+
      dimText(165,77,amount,'middle')+label(165,24,'Center back','middle')+label(165,145,'Center front','middle')+
      label(88,83,'Wearer’s right','end')+label(242,83,'Wearer’s left');
    const location=panel(zipper?'Locate the zipper seam':reference?'Mark the closure reference':'Mark the single seam on the fitted garment',topView,
      `View from above. ${angle?`Start at center front and locate the line ${amount} ${direction}, at the ${position}.`:'Mark the line at center front.'} Use the 3D view or a fitting sample to carry the line between its traced endpoints.`);
    if (zipper) {
      const length=format(panelZipper)||format(order.plan?.zipperOpening)||'Pattern opening';
      const hidden=studioDesign.panelZipperStyle(design)==='Invisible zipper';
      const opening=path('M34 24H115V143H34ZM129 24H211V143H129Z','wf-cloth')+
        path('M108 37H135M108 105H135','wf-dimension')+guide(122,38,122,105)+path('M122 106V139','wf-stitch')+
        path('M135 37H236M135 105H236','wf-extension')+tick(234,37,105,length)+
        label(115,19,'Upper end of seam','middle')+leader(134,105,171,120)+label(176,125,'Opening ends here')+
        label(120,159,'Keep the seam below the zipper','middle');
      const check=path('M30 30H112V139H30ZM129 30H217V139H129Z','wf-right')+
        path('M105 37H136V111H105Z','wf-fold')+path('M117 42V103M124 42V103','wf-edge')+
        path('M117 47h7m-7 7h7m-7 7h7m-7 7h7m-7 7h7m-7 7h7m-7 7h7m-7 7h7','wf-dimension')+
        guide(41,68,197,68)+path('M120 108V136','wf-stitch')+
        leader(143,68,230,59)+label(235,63,'Marks line up')+
        leader(120,124,226,126)+label(230,130,'Stitch below');
      return [location,
        panel('Measure down the opening from the top',opening,
          `Set the upper stop using the finished edge and any facing or waistband allowance from the pattern. Measure ${length==='Pattern opening'?'the pattern opening length':length} down along the seam line. Mark that lower stop on both pieces. The seam continues below it. Check that the fitted seam has enough length before cutting.`),
        panel('Set up the Brother CP2160F',zipperDrawing('foot',{}),
          hidden?'Use a compatible invisible-zipper foot and follow its needle position instructions. Test the same fabric layers. Turn the handwheel toward you to check that the needle clears the foot and stitches beside the coil.':
            'Switch off the machine to attach zipper foot I. Select centered straight stitch 01. Clip the foot onto the pin that places the needle beside the zipper. Turn the handwheel toward you to check clearance before sewing. For a standard zipper, Brother directs sewing each tape from bottom to top.'),
        panel('Align the tapes and finish the seam below',check,
          'Baste each tape at its matching upper and lower marks. Close the zipper and check that any cross-seams line up. Sew the tapes as the zipper and pattern direct. Finish the seam below the lower stop and test the zipper again before securing the upper finish.')
      ];
    }
    if (reference) {
      const opening=format(order.plan?.zipperOpening);
      const marked=path('M33 39H143V137H33ZM143 39H252V137H143Z','wf-cloth')+
        guide(143,38,143,138)+path('M125 58H160V118H125Z','wf-fold')+path('M143 60V116','wf-dimension')+
        leader(150,59,191,48)+label(197,51,'Closure marks')+label(50,126,'Pattern edge')+
        (opening?tick(261,58,118,opening):label(254,128,'Leave free'));
      return [location,panel('Keep the closure opening free',marked,
        'Transfer this reference line and the opening marks from the tested pattern. Use the selected closure construction in the work order. Check alignment and wearing ease without closing the opening with a seam.')];
    }
    const allowance=format(order.allowances?.seam)||'Pattern allowance';
    const plannedOpening=format(panelZipper);
    const trace=path('M28 44L78 35Q102 49 136 47V131H27ZM191 47Q225 49 249 35L298 44V131H191Z','wf-cloth')+
      path('M126 48V129M201 48V129','wf-stitch')+path('M126 72h11m-11 31h11M190 72h11m-11 31h11','wf-dimension')+
      span(126,136,145,allowance)+span(191,201,145,'')+label(75,67,'Piece 1','middle')+label(248,67,'Piece 2','middle')+
      label(165,29,'One joining line','middle');
    const baste=path('M39 36H201V134H39Z','wf-right')+path('M49 31H201V126H49Z','wf-cloth')+
      path(`M166 ${plannedOpening?88:39}V121`,'wf-stitch')+path('M153 61H201m-48 36h48','wf-dimension')+span(166,201,145,allowance)+
      (plannedOpening?guide(166,39,166,88)+tick(93,39,88,plannedOpening,-1)+label(52,105,'Leave upper edge open'):'')+
      leader(164,61,217,50)+label(219,52,'Match notches')+leader(202,109,219,109)+label(224,112,'Both raw edges');
    return [location,
      panel('Trace each side of the same joining line',trace,
        `Match the ends and notches along both stitching lines. Add ${allowance==='Pattern allowance'?'the pattern allowance':allowance} outside each line. ${Math.abs(angle)===0||Math.abs(angle)===180?'Use mirrored pieces when the fitted pattern is symmetrical.':'Trace the two sides individually at this placement.'}`),
      panel(plannedOpening?'Baste below the zipper mark':'Baste the one joining seam',baste,
        `Place the two pieces right sides together. Match the marked ends and notches. ${plannedOpening?`Leave the upper ${plannedOpening} free and start basting at the zipper’s lower stop.`:'Baste the one stitching line and keep any planned opening free.'} Check the fit before sewing.`)
    ];
  }
  function designSeamPanels(id,order,design) {
    if (singleSeamPhases.includes(id)) return singlePanelSeamFigures(id,order,design);
    const waist=id==='designWaistSeam';
    const shift=studioDesign.seams(design)[waist?'waistSeam':'panelSeam'];
    if (!Number.isFinite(shift)) return [];
    const amount=format(Math.abs(shift));
    const direction=waist?(shift<0?'higher':'lower'):(shift<0?'toward center':'toward sides');
    const seam=format(order.allowances?.seam)||'Pattern allowance';
    const distance=shift?Math.sign(shift)*Math.max(7,Math.abs(shift)*1.16):0;
    function outline(x,back) {
      const top=design.model==='skirt'
        ?`M${x-30} 36H${x+30}`
        :`M${x-43} 52L${x-36} 30L${x-16} 23Q${x} ${back?31:43} ${x+16} 23L${x+36} 30L${x+43} 52L${x+33} 61`;
      return path(top+`Q${x+22} 77 ${x+34} 99L${x+50} 139H${x-50}L${x-34} 99Q${x-22} 77 ${x-33} 61Z`,'wf-cloth');
    }
    const views=outline(86,false)+outline(243,true)+label(86,15,'Front','middle')+label(243,15,'Back','middle');
    const originalWaist=85, movedWaist=originalWaist+distance;
    let placement;
    if (waist) {
      const width=25+Math.round(Math.max(0,movedWaist-81)*.44);
      placement=views+guide(44,originalWaist,285,originalWaist)+
        path(`M${86-width} ${movedWaist}H${86+width}M${243-width} ${movedWaist}H${243+width}`,'wf-stitch')+
        path(`M85 ${movedWaist-4}v8M243 ${movedWaist-4}v8`,'wf-dimension')+
        (shift?leader(121,originalWaist,164,originalWaist)+leader(119,movedWaist,164,movedWaist)+
          tick(164,Math.min(originalWaist,movedWaist),Math.max(originalWaist,movedWaist),amount):'')+
        label(166,156,shift?'Dashed gray = original waistline':'Keep the original waist level','middle');
    } else {
      const panels=x=>[1,-1].map(side=>{
        const start=x+side*23, moved=start+distance*side;
        return guide(start,40,start,134)+path(`M${moved} 41Q${moved-side*3} 79 ${moved+side*3} 133`,'wf-stitch');
      }).join('');
      const x=160, start=x+23, mark=start+distance;
      placement=outline(x,false)+panels(x)+guide(x,39,x,134)+label(x,15,'Front','middle')+
        (shift?leader(start,112,start,127)+leader(mark,109,mark,127)+span(Math.min(start,mark),Math.max(start,mark),127,amount):'')+
        label(165,156,shift?'Light dashed lines = starting seam positions':'Keep the starting seam positions','middle');
    }
    const compare=waist
      ?path('M40 37H270L254 76H51ZM51 91H254L272 137H40Z','wf-cloth')+
        path('M55 68H250M55 99H252','wf-stitch')+path('M78 63v10m78 -10v10m82 -10v10M78 94v10m78 -10v10m82 -10v10','wf-dimension')+
        label(158,55,'Bodice piece','middle')+label(158,125,'Skirt piece','middle')+tick(270,68,76,seam,-1)
      :path('M37 36H108Q142 82 128 139H32ZM185 36H269L283 139H204Q215 83 185 36Z','wf-cloth')+
        path('M99 42Q133 84 118 132M195 42Q223 87 213 132','wf-stitch')+
        path('M116 75l8 -3M120 106l9 2M206 75l8 -3M209 106l9 2','wf-dimension')+
        span(118,129,145,seam)+label(67,59,'Center panel','middle')+label(249,59,'Side panel','middle');
    return [
      panel(waist?'Locate the new bodice-to-skirt seam':'Locate the moved panel seams',placement,
        `${shift?'On the fitted sample mark the seam '+amount+' '+direction+' from its starting marks.':'Mark the seam at its starting position.'} ${waist?'Match the new height where each side seam meets the front and back.':'Measure across the front at the same levels on the left and right. Keep center front and the side seams as references.'}`),
      panel('Check both new stitch lines against each other',compare,
        `Transfer corresponding notches first. Measure along one stitching line from notch to notch, then measure the same run on its matching piece. True the curves and check the adjoining edges. Add ${seam==='Pattern allowance'?'the allowance from the pattern':seam} on both sides of each join.`),
      panel('Baste with matching notches together',
        path('M38 31H188V133H38Z','wf-right')+path('M48 36H188V126H48Z','wf-cloth')+
        path('M151 42V122','wf-stitch')+path('M138 60h50m-50 37h50','wf-dimension')+
        span(151,188,144,seam)+leader(150,61,212,52)+label(215,54,'Match notches')+
        leader(189,110,209,109)+label(215,112,'Both raw edges'),
        'Place the matching pieces right sides together, clip or pin the notches, and hand- or machine-baste the seam. Try on the garment before stitching. Recheck both seam ends after any fit changes.')
    ];
  }

  const layerPhases=['layerDraft','layerCut','layerFit','layerAttach','layerHem'];
  function layerPanels(step,id,order,design) {
    const number=Number(num(step,/^Layer (\d+)/));
    const layer=studioDesign.layers(design)[number-1];
    if (!layer) return [];
    const model=design.model;
    const title=`Layer ${number} · ${layer.kind}`;
    const ruffle=layer.kind==='Ruffle';
    const inside=studioDesign.layerIsInner(layer);
    const reference=studioDesign.layerStartsAt(model);
    const anchorName=reference.toLowerCase();
    const paired=model==='trousers';
    const upper=reference==='Upper edge';
    const contour=layerHemSource(layer,design);
    const shape=studioDesign.hemContour(contour);
    const attachmentAt=angle=>Number(studioDesign.layerAttachmentAt(layer,angle,model).toFixed(3));
    const placement=attachmentAt(Math.PI/2);
    const percent=value=>Number(Math.abs(value).toFixed(3))+'%';
    const direction=value=>value?`${percent(value)} ${value<0?'above':'below'}`:`At ${anchorName}`;
    const sideSettings=side=>{
      const angle=side==='left'?0:Math.PI;
      const sweep=studioDesign.layerSweepAt(layer,angle);
      return {attach:attachmentAt(angle),sweep:paired?sweep/2:sweep-layer.sweep};
    };
    const left=sideSettings('left'), right=sideSettings('right');
    const changedAttachment=[left,right].some(side=>Math.abs(side.attach-placement)>.001);
    const changedSweep=left.sweep!==right.sweep || !paired && [left,right].some(side=>Math.abs(side.sweep)>.001);
    const startY=upper?42:58, mainHem=124;
    const heightAt=value=>startY+(mainHem-startY)*value/100;
    const attach=heightAt(paired?right.attach:placement);
    const offset=layer.hemOffset?Math.sign(layer.hemOffset)*18:0;
    const newHem=ruffle?Math.min(144,attach+Math.max(13,layer.depth*1.25)):Math.max(attach+11,mainHem+offset);
    const allowance=order.allowances||{};
    const seam=format(allowance.seam)||'Pattern allowance';
    const bodice=model==='dress'?path(`M92 24H186L173 ${startY}H105Z`,'wf-cloth'):'';
    const main=paired?path(`M80 28H139L150 49L146 ${mainHem}H84L87 ${startY}Z`,'wf-cloth'):
      upper?path(`M98 29L115 24L126 ${startY}H159L169 24L188 29L207 58Q181 74 194 100L204 ${mainHem}H81L89 100Q99 76 79 57Z`,'wf-cloth'):
        bodice+path(`M105 ${startY}H173Q197 97 226 ${mainHem}H54Q91 87 105 ${startY}Z`,'wf-cloth');
    const layerTop=paired?82:upper?97:Math.round(105-51*(attach-startY)/(mainHem-startY));
    const rightEdge=paired?153:upper?224:232;
    const leftEdge=paired?76:upper?63:47;
    const topRight=paired?151:278-layerTop;
    const hemScallops=Array.from({length:5},(_,index)=>{
      const part=(rightEdge-leftEdge)/5;
      return index?`t${-part} 0`:`q${-part/2} 6 ${-part} 0`;
    }).join('');
    const layerEdge=path(`M${layerTop} ${attach}H${topRight}L${rightEdge} ${newHem}${ruffle?hemScallops:`H${leftEdge}`}Z`,'wf-right');
    const outline=(inside?layerEdge+main:main+layerEdge)+path(`M${layerTop} ${attach}H${topRight}`,'wf-stitch');
    const hemSize=layer.hemOffset?format(Math.abs(layer.hemOffset))+(offset<0?' shorter':' longer'):'Same length';
    const hemMarks=ruffle
      ?leader(topRight,attach,267,attach)+leader(rightEdge,newHem,267,newHem)+tick(265,attach,newHem,format(layer.depth))
      :guide(42,mainHem,282,mainHem)+guide(47,newHem,282,newHem)+
        (offset?tick(279,Math.min(mainHem,newHem),Math.max(mainHem,newHem),hemSize,-1):dimText(281,114,hemSize,'end'));
    const at=paired?right.attach:placement;
    const anchor=guide(30,startY,layerTop,startY)+guide(30,attach,layerTop,attach)+
      (at?tick(30,Math.min(startY,attach),Math.max(startY,attach),direction(at))+label(30,startY-5,reference):dimText(31,startY-8,direction(0)))+
      label(308,24,inside?'Inside attachment':'Outside attachment','end');
    const hemFigure=outline+hemMarks+anchor+label(56,156,ruffle?'Base depth from the attachment':'Compare the two base hem lines');
    const hemAllowance=design.finish==='Double-fold hem' && Number.isFinite(allowance.first) && Number.isFinite(allowance.second)
      ?format(allowance.first+allowance.second):design.finish!=='Double-fold hem' && format(allowance.seam)||'Pattern hem allowance';
    if (id==='layerDraft') return [
      panel(`${title} · Mark the attachment and hem`,hemFigure,
        `${at?`Measure straight from the ${anchorName} to ${paired?'the base hem on the wearer’s right leg':upper?'the base hem at each marked location':'the base hem at center front'}. Multiply that distance by ${percent(at)}, then measure that amount ${at<0?'up':'down'} from the ${anchorName}.`:`Mark the attachment at the ${anchorName}.`} ${changedAttachment||paired?'Use the separate side measurements to set the final line. ':''}${ruffle?'Mark the base depth down from the attachment. ':''}${upper?'Check that the layer clears arm openings and hangs below the attachment.':'Check that the finished edge sits below the attachment and clears the floor.'}`),
      panel('Add the sweep across the pattern panels',
        path('M52 45H128L143 122H38ZM169 45H245L259 122H155Z','wf-cloth')+
        path('M51 94L45 115H137L132 94M168 94L161 115H253L249 94','wf-stitch')+
        span(42,255,135,layer.sweep?`+${format(layer.sweep/(paired?2:1))} ${paired?'base per leg':'around the layer'}`:ruffle?'Match the base at this level':'Match main hem circumference')+
        label(90,75,'Panel 1','middle')+label(206,75,'Panel 2','middle'),
        `Add the indicated base sweep across the panels at their finished seam lines. ${ruffle?'Measure the main fabric at the level where the ruffle ends. ':''}${paired?'Measure each leg and add its sweep separately. ':''}Use the panel count in your paper pattern. Keep the upper seam long enough to join the attachment line as drafted.`),
      ...(paired?[panel('Mark and measure the two legs separately',
        path('M91 34H239L249 63L239 125H178L165 72L152 125H90L80 63Z','wf-cloth')+
        guide(78,startY,252,startY)+label(165,startY-5,'Upper-leg reference','middle')+
        [right,left].map((side,index)=>{
          const center=index?212:118,y=heightAt(side.attach),x=index?251:79,sign=index?1:-1;
          return path(`M${center-24} ${y}H${center+24}`,'wf-stitch')+
            (side.attach?tick(x,startY,y,percent(side.attach),sign):dimText(center,startY+17,'At reference','middle'))+
            label(center,26,index?'Wearer’s left':'Wearer’s right','middle')+dimText(center,148,`+${format(side.sweep)} sweep`,'middle');
        }).join(''),
        'Measure straight from the top of each leg below the crotch junction to its own finished base hem. Mark the attachment using that leg’s percentage. The sweep shown is the amount to add around that leg. Keep the two layer assemblies separate, and label each front, back, inseam and outseam.')]:[]),
      ...(!paired && (changedAttachment||changedSweep)?[panel('Mark the separate side settings',
        path(`M102 39H230L267 ${mainHem}H66Z`,'wf-cloth')+guide(165,39,165,133)+guide(72,startY,260,startY)+label(165,startY-5,reference,'middle')+
        [right,left].map((side,index)=>{
          const x=index?230:102, sign=index?1:-1;
          const y=heightAt(side.attach);
          return label(x+sign*35,23,index?'Wearer’s left':'Wearer’s right','middle')+
            (changedAttachment?(side.attach?tick(x,Math.min(startY,y),Math.max(startY,y),direction(side.attach),sign):dimText(x+sign*10,startY+6,direction(0),index?'start':'end')):'')+
            (changedSweep?dimText(x+sign*25,151,signedLength(Number(side.sweep.toFixed(3))),'middle'):'');
        }).join(''),
        `Face the wearer and mark their actual right and left. ${changedAttachment?`Multiply the ${upper?'local upper-edge-to-hem':'center-front waist-to-base-hem'} distance by each shown percentage. Measure up or down from the ${anchorName} as shown at the named side, then blend to the center front and back marks. `:''}${changedSweep?'The lower dimensions show each adjustment from the base sweep setting. Baste the new fullness on the named side and blend to the center marks.':''}`)]:[]),
      ...hemShapePanels(contour,allowance,design.finish)
    ];
    if (id==='layerCut') return [
      panel(`${title} · Trace the finished and cut edges`,
        path('M49 36H146L181 140H30Z','wf-cloth')+path('M39 116H174','wf-stitch')+
        path('M174 116H208M181 140H208','wf-extension')+tick(206,116,140,hemAllowance)+
        (ruffle?path('M48 54H151','wf-stitch')+leader(151,54,206,54)+tick(206,54,116,format(layer.depth))+
          label(113,27,'Attachment stitch line','middle'):'')+
        path('M101 107V50m-5 6l5 -6 5 6','wf-arrow')+label(114,74,'Grainline')+label(53,110,'Finished hem line')+
        label(41,156,'Cut along outer edge'),
        `Write the layer number and ${layer.fabric} on the paper.${paired?' Label the complete pattern pieces for each leg. Give the left and right pieces their own cut lines if the settings differ.':''} Mark both ends of the grainline, attachment points and any opening. Trace the finish allowance outward from the marked hem.`),
      layoutPanel(cuttingLayout(order.plan,design,layer)),
      panel('Transfer and label the matching marks',
        path('M47 40H184L215 137H32Z','wf-cloth')+guide(118,45,118,130)+path('M63 40l4 10 4 -10M118 40v13M168 40l4 10 4 -10','wf-dimension')+
        guide(173,43,228,43)+label(234,47,'Attachment marks')+guide(155,79,225,79)+label(232,83,'Opening mark')+
        label(118,110,paired?'Mark leg and seam':'Center line','middle'),
        `Hold the paper flat until you transfer the marks to the wrong side. ${paired?'Identify the wearer’s left and right, front and back, and which edges meet the inseam or outseam':'Mark and name each cut piece'} before moving the pieces off the cutting board.`)
    ];
    if (id==='layerFit') return [
      panel(`${title} · Match ${paired?'marks on each leg':'centers and sides'}`,
        path('M29 39H280V70H29Z','wf-cloth')+path('M29 88H280L300 139H16Z','wf-right')+
        path('M47 50V97M151 50V97M260 50V97','wf-guide')+label(155,25,'Garment attachment marks','middle')+
        label(47,131,paired?'Inseam':'Side','middle')+label(151,131,paired?'Front mark':'Center','middle')+label(260,131,paired?'Outseam':'Side','middle'),
        `Match each transferred mark and pin it separately. ${paired?'Repeat for the back and the other leg. ':''}Check any opening before pinning between the marks. A layer that already matches the attachment length can be basted flat.`),
      panel('Draw up the basting evenly',
        path('M39 38H257L281 127H29Z','wf-right')+path('M43 57H255M42 73H260','wf-stitch')+
        path('M250 57Q271 56 299 68M250 73Q272 73 299 77M61 50v33M152 50v33M240 50v33','wf-dimension')+
        label(152,111,'Gather between matching marks','middle')+label(307,92,'Pull thread tails','end'),
        'When the layer is longer along the attachment edge, sew two long basting rows in the allowance. Leave thread tails. Hold the matching marks in place, pull the bobbin threads gently, then spread the gathers with your fingertips.')
    ];
    if (id==='layerAttach') {
      const elastic=studioDesign.effectiveClosure(design)==='Elastic waistband';
      const opening=format(elastic?order.plan?.casingWidth:order.plan?.zipperOpening??studioDesign.seams(design).panelZipper);
      return [
        panel(`${title} · Stitch at the attachment`,hemFigure,
        `Baste the layer along its marked line on the ${inside?'inside':'outside'} of the main garment. ${paired?'Match each leg at the front, back, inseam and outseam separately. Stand, sit and walk to check each leg moves freely.':upper?'Match center front, center back and side marks. Reach and sit to check coverage and clearance at the arm openings.':'Match the front, back and both side marks. Check standing, sitting and walking before stitching.'}${model==='corset'?' Keep stitching clear of channels, bones and closure hardware.':''} Use the attachment method and allowance from your tested pattern.`),
        panel('Keep the garment opening clear',
          path('M32 40H211V139H32Z','wf-cloth')+path('M32 83H107M130 83H211','wf-stitch')+
          path('M110 52V124M126 52V124','wf-dimension')+label(64,71,'Layer seam')+
          (opening?tick(237,52,124,opening):label(230,99,elastic?'Casing opening':'Closure opening')),
          'Leave the matching opening free while basting. Open and close the garment fully and check that the layer clears every part of the closure. After stitching, secure the layer’s seam ends at the opening.')
      ];
    }
    const hemPanels=design.finish==='Double-fold hem'
      ?'Press and turn this edge separately, using the two turn widths specified for this layer on your pattern.'
      :design.finish==='Faced hem'?'Trace a facing that matches this layer’s edge. Stitch it, grade the allowance, then turn and secure the facing.'
        :'Confirm the band placement on the layer. Join the band and finish the inside edge using the tested pattern.';
    return [
      panel(`${title} · Check its own hem`,hemFigure,
        `Hang the garment until the layers settle. Mark the finished edge on the wearer at its labeled front, side and back points.${paired?' Repeat for the other leg and check both with shoes on.':''}${ruffle?' Measure the ruffle’s base depth down from its attachment seam.':''}${shape.hemStyle==='Fairy / handkerchief'?' Recheck each of this layer’s long points and short valleys.':''}`),
      panel('Pin the other layers out of the way',
        path('M34 34H199V139H34Z','wf-cloth')+path('M51 48H192V116H51Z','wf-fold')+
        path('M38 118H194','wf-stitch')+path('M201 118H229M199 139H229','wf-extension')+
        tick(227,118,139,format(allowance.first)||seam)+guide(187,69,224,69)+label(229,73,'Hold clear'),
        `Finish and sew only this layer’s hem. ${hemPanels} Check for caught layers after sewing.`)
    ];
  }

  function layoutPanel(plan) {
    const folded=plan.layout==='folded';
    const width=format(plan.usableWidth && (folded?plan.usableWidth/2:plan.usableWidth));
    const boundary=folded?'Fabric fold · leave intact':'Opposite selvage';
    const direction=plan.oneWay?'Cut all pieces with the print or nap arrows pointing the same way.':'Read the grainline and any direction arrow on each piece.';
    return panel(folded?'Set up the folded fabric':plan.layout==='single'?'Lay out one layer':'Check the pattern layout against your fabric',
      (folded?path('M45 44H294V141H45Z','wf-fold'):'')+path('M37 40H287V134H37Z','wf-cloth')+
      guide(45,43,45,132)+(folded?path('M286 41V134','wf-dimension'):guide(279,43,279,132))+
      path('M109 56H208L232 120H101Z','wf-right')+path('M151 110V68','wf-arrow')+
      arrowhead(151,68,1)+arrowhead(151,110,-1)+label(161,85,'Grainline')+label(161,102,'Paper piece')+
      span(45,151,68,'Distance A')+span(45,151,110,'Distance B')+
      span(45,folded?286:279,30,width||'Usable width')+label(37,153,folded?'Matched selvages':'Selvage')+label(289,153,boundary,'end'),
      `${plan.asymmetric?'Spread the fabric one layer thick. Place each full, side-labeled paper piece face up as marked.':folded?'Bring the two factory-finished selvages together to make an uncut fold on the opposite side. Smooth both layers flat.':plan.layout==='single'?'Spread one layer flat. Flip paper pieces to cut left and right copies when the pattern calls for a mirrored pair.':'Use the layout for your pattern size and fabric width. Confirm whether it shows a fold or a single layer.'} Measure from the top of the grainline to the selvage for distance A and from the bottom to the same selvage for B. Rotate the paper until A and B are equal. ${direction}`);
  }

  function cutEdgePanel(allowance) {
    const seam=format(allowance.seam);
    return panel('Find the cutting edge, stitching line, and notch',
      path('M24 28H238V137H24Z','wf-right')+texture(32,101)+path('M60 39H172L192 123H46Z','wf-cloth')+
      path('M70 50H163L179 112H60Z','wf-stitch')+path('M177 79l7 -6 3 12Z','wf-right')+
      leader(170,40,199,38)+label(205,41,'Solid cut line')+leader(170,64,199,58)+label(205,61,'Dashed stitch line')+
      leader(183,80,211,88)+label(213,93,'Notch mark')+label(112,83,'Paper pattern','middle')+
      path('M176 112V143M192 123V143','wf-extension')+span(176,192,149,seam||'Pattern allowance')+
      path('M65 57h15v14H65zM137 87h15v14h-15z','wf-fold')+label(25,155,'Fabric underneath'),
      `Circle the outer cutting line for your size and place weights inside it. The dashed line is where the seam will be sewn. The gap between the lines is ${seam?seam:'the allowance in your pattern'}. Keep the lower blade of your shears against the board along the solid edge. Mark each notch on the fabric before lifting the paper.`);
  }

  function cutPiecePanel(piece,asymmetric=false) {
    const pieces={fold:'Match the marked fold edge to the fabric fold. Leave that edge uncut.',
      pair:'For a single-layer layout, cut the first side with the pattern face up, then flip the paper for the opposite side.',
      single:'Cut through one layer with the fabric face oriented as the pattern directs.',
      pattern:'Match this piece to the fold and layer instructions printed on the pattern.'};
    const width=asymmetric && piece.mode==='fold'?'Width on full pattern':format(piece.width)||'Width on pattern';
    const length=format(piece.length)||'Length on pattern';
    const grain=format(piece.grain);
    const folded=piece.mode==='fold' && !asymmetric;
    const left=folded?72:32, selvage=folded?207:42;
    return panel(piece.name+(piece.quantity?' · Cut '+piece.quantity:''),
      path(`M${left} 30H209V141H${left}Z`,'wf-cloth')+guide(selvage,36,selvage,137)+path('M72 50H161L181 124H72Z','wf-right')+
      path('M118 114V54m-5 6l5 -6 5 6','wf-arrow')+span(72,181,41,width)+tick(215,50,124,length)+
      (grain?span(Math.min(selvage,118),Math.max(selvage,118),111,grain):'')+
      label(selvage,154,'Selvage',folded?'end':'start')+label(folded?72:106,154,folded?'Fold edge':'Pattern edge'),
      `${asymmetric?'For affected pieces, trace each complete side on paper and lay it on a single layer.':pieces[piece.mode]||pieces.pattern} Copy the marked shape from your paper. ${grain?`Set both ends of the grainline ${grain} from the same selvage.`:'Measure both ends of the grainline to the same selvage.'}`);
  }

  function cuttingPlan(order,pattern) {
    const plan=cuttingLayout(order.plan,pattern.design);
    const panels=[layoutPanel(plan),cutEdgePanel(order.allowances||{}),
      panel('Transfer placement marks before lifting the paper',
        path('M28 32H198V129H28Z','wf-cloth')+guide(103,36,103,125)+guide(31,60,194,60)+
        path('M49 60h105M107 72h47v37h-47z','wf-dimension')+label(205,63,'Reference line')+label(205,101,'Feature outline')+
        label(83,148,'Center front or back'),
        `Mark matching notches, darts, pocket corners, and closure endpoints on the wrong side with chalk tested on scrap. ${plan.asymmetric?'Transfer the marks from each paper piece separately.':'Mark both layers.'} Use the paper markings to find each position, then label the wrong side of each piece with its name and left or right.`)];
    const pieces=(plan.pieces||[]).map(piece=>cutPiecePanel(piece,plan.asymmetric));
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
    matchSleeve:['Match the sleeve cap to the armhole',path('M51 130Q48 33 111 32Q164 35 184 123Z','wf-cloth')+path('M53 120Q78 44 113 44Q151 44 181 115','wf-stitch')+path('M106 37l7 12 7 -12M65 78l9 4m84 -4l9 -4','wf-dimension')+guide(111,32,135,22)+label(140,24,'Shoulder notch')+label(192,118,'Match front and back')],
    easeSleeve:['Baste evenly between notches',path('M40 128Q29 48 116 36Q176 37 202 127Z','wf-cloth')+
      path('M43 118Q59 47 116 48Q161 47 198 116M46 110Q62 56 115 55Q157 55 194 107','wf-stitch')+
      path('M81 54v15M116 38v20M156 54v15','wf-dimension')+label(204,100,'Baste between marks')],
    markPattern:['Test and transfer the pattern marks',path('M36 39H169L194 132H36Z','wf-cloth')+
      guide(96,43,96,128)+path('M161 74h18m-5 -4l5 4 -5 4M93 72v6m-3 -3h6M123 102l15 -15','wf-dimension')+
      label(187,77,'Match notch')+label(144,102,'Dart tip')+label(83,145,'Fold or center line')],
    separateLayers:['Label the pieces before separating layers',path('M32 61H150L175 132H32Z','wf-cloth')+
      path('M149 38H252L275 99H149Z','wf-fold')+label(48,101,'Left · wrong side')+label(156,68,'Right · wrong side')+
      path('M100 44q26 -21 50 -5m-8 -8l8 8 -11 1','wf-arrow')],
    fitMove:['Check the fit while moving',path(torsoShape,'wf-cloth')+path('M68 50Q42 54 35 69M140 50Q165 50 178 69','wf-arrow')+
      guide(147,95,194,95)+label(201,99,'Look for pull lines')],
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
  function standardPanel(title,visual,text,classes) {
    return panel(title,`<svg class="wf-standard" x="0" y="0" width="330" height="164" viewBox="0 0 270 141">${visual}</svg>`,text,classes);
  }
  function machineActions() {
    return `<details class="wo-how wo-storyboard"><summary>Set up the Brother CP2160F in pictures</summary><div class="wf-grid">${setupSteps.map(([figure,text],i)=>{
      const [title,visual]=sewingVisuals.figureParts(figure);
      return standardPanel((i+1)+'. '+title,visual,text);
    }).join('')}</div></details>`;
  }
  function zipperDrawing(phase,plan) {
    const measure=format(plan.zipperOpening)||'Per pattern';
    const hardware=(x,y)=>path(`M${x} ${y}v86m7 -86v86`,'wf-edge')+
      path(`M${x} ${y+7}h7m-7 8h7m-7 8h7m-7 8h7m-7 8h7m-7 8h7m-7 8h7m-7 8h7m-7 8h7m-7 8h7`,'wf-dimension');
    if (phase==='foot') return path('M27 38H191V129H27Z','wf-cloth')+
      path('M66 82H172V112H66Z','wf-fold')+path('M106 18H122V65H137V83H97V65H106Z','wf-cloth')+
      path('M116 32v65','wf-dimension')+arrowhead(116,99,-1)+path('M67 102h106','wf-stitch')+
      leader(139,75,191,65)+label(195,68,'Zipper foot on tape')+
      leader(116,96,191,110)+label(195,113,'Needle beside coil')+label(40,147,'Test with handwheel first');
    if (phase==='zipClearance') return path('M33 29H243V139H33Z','wf-cloth')+
      path('M97 37H189V132H97Z','wf-fold')+hardware(158,43)+path('M144 79V128','wf-stitch')+
      path('M138 31H150V66L144 84L138 66Z','wf-cloth')+path('M120 87V123','wf-arrow')+
      arrowhead(120,123,-1)+leader(139,65,84,59)+label(82,55,'Needle','end')+
      leader(166,85,201,77)+label(205,81,'Coil or teeth')+leader(143,108,196,113)+label(200,117,'Stitch path')+
      label(92,155,'Sew parallel to the coil');
    if (phase==='zipCheck') return path('M25 27H133V137H25ZM151 27H239V137H151Z','wf-right')+
      texture(41,41)+texture(196,41)+hardware(137,37)+path('M133 55H147L145 68H135Z','wf-fold')+
      path('M133 75h14m-12 0l-2 13h14l-2 -13','wf-edge')+guide(31,104,130,104)+guide(154,104,236,104)+
      path('M133 41V57m20 -16v16M141 31v14','wf-dimension')+arrowhead(141,31,1)+
      leader(155,103,255,98)+label(257,96,'Both marks')+label(258,109,'line up')+
      label(53,155,'Close before sewing the seam below');
    return path('M26 29H102V138H26ZM157 29H234V138H157Z','wf-cloth')+
      path('M87 38H111V126H87ZM146 38H171V126H146Z','wf-fold')+
      path('M108 40V126M150 40V126','wf-dimension')+path('M95 45V123M162 45V123','wf-stitch')+
      path('M92 37h18m40 0h19M92 126h18m40 0h19','wf-dimension')+
      path('M171 37H256M171 126H256','wf-extension')+tick(254,37,126,measure)+
      guide(49,81,212,81)+label(32,74,'Matching mark')+
      leader(163,111,211,123)+label(216,128,'Tape')+label(97,154,'Stitch one side at a time');
  }
  function actionPanel(order,figure,title,description,id,measurements) {
    const allowance=order.allowances||{};
    const general=allowance.seam;
    const seam=['neck','facing','neckFill'].includes(id)?allowance.neck??general
      : ['sleeve','armhole','sleeveCap'].includes(id)?allowance.armhole??general:general;
    const plan=order.plan||{};
    const annotated=format(seam)||'Pattern allowance';
    const local=scenes[figure];
    if (figure==='shoulder') return panel(title,torsoDrawing(measurements)+
      dimText(161,42,'Shoulder allowance '+annotated),description);
    if (figure==='armhole') return panel(title,path('M32 41H114Q110 78 146 103L140 135H32Z','wf-cloth')+
      path('M105 45Q104 83 135 105','wf-stitch')+guide(135,105,175,105)+guide(144,94,175,94)+
      tick(173,94,105,annotated)+label(183,130,'Mark the underarm'),description);
    if (figure==='sleeve' || figure==='sleeveCap') return actionPanel(order,'matchSleeve',title,description,id,measurements);
    if (figure==='band' && plan.casingWidth) return panel(title,path('M32 37H204V125H32Z','wf-cloth')+
      path('M32 37H204V77H32Z','wf-fold')+path('M32 77H204','wf-stitch')+path('M204 37H218M204 77H218','wf-extension')+
      tick(218,37,77,format(plan.casingWidth))+label(50,107,'Match center and side seams'),description);
    if (figure==='measure') return panel(title,torsoDrawing(measurements),description);
    if (figure==='fit' || figure==='fitMove') {
      const waist=valueFor(measurements,'Waist');
      return panel(title,figure==='fitMove'?local[1]+(waist?dimText(201,120,'Model waist '+waist):''):torsoDrawing(measurements),description);
    }
    if (figure==='cut') return cutEdgePanel(allowance);
    if (figure==='grain') return layoutPanel(plan);
    if (figure==='shears') return panel(title,local[1]+path('M136 120V144M169 120V144','wf-extension')+
      span(136,169,145,annotated)+path('M136 60V120','wf-stitch'),description);
    if (['zipper','zipClearance','zipCheck'].includes(figure) || figure==='foot' && id==='zipper') {
      const titles={foot:'Fit the zipper foot',zipper:'Align both tapes and mark the opening',zipClearance:'Sew next to the coil',zipCheck:'Close and compare the marks'};
      const count=title.match(/^\d+\. /)?.[0]||'';
      return panel(count+titles[figure],zipperDrawing(figure,plan),description);
    }
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
    if (['clipCurve','turnFacing','matchSleeve','easeSleeve','pin','foot','pinOut','allowance'].includes(figure) && local) {
      const line={
        clipCurve:guide(67,48,142,48)+tick(105,48,77,annotated),
        turnFacing:tick(104,69,89,annotated),
        matchSleeve:path('M114 32H213M114 44H213','wf-extension')+tick(212,32,44,format(seam)||'Use pattern'),
        easeSleeve:dimText(203,125,'Allowance '+(format(seam)||'per pattern')),
        pin:span(145,177,146,annotated),
        foot:span(146,177,144,annotated),
        pinOut:span(145,177,144,annotated),
        allowance:label(173,145,annotated,'middle')
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
  function illustratedActions(step,id,index,order={},measurements,design) {
    scenes ??= createScenes();
    if (id==='asymmetricFit') {
      const panels=asymmetricPanels(step,order,design).slice(1);
      return panels.length?`<details class="wo-how wo-storyboard" open><summary>Check the paper pieces</summary><div class="wf-grid">${panels.join('')}</div></details>`:'';
    }
    if (seamDesignPhases.includes(id)) {
      const figures=designSeamPanels(id,order,design).slice(1);
      const source=id==='designSinglePanelZipper' && studioDesign.panelZipperStyle(design)==='Standard zipper'
        ?'<p><a href="https://help.brother-usa.com/app/answers/detail/a_id/59099/~/how-to-insert-a-zipper-using-the-zipper-foot" target="_blank" rel="noopener">Brother CP2160F zipper foot instructions</a></p>':'';
      return figures.length?`<details class="wo-how wo-storyboard" open><summary>Follow this step in pictures · ${figures.length} ${figures.length===1?'action':'actions'}</summary><div class="wf-grid">${figures.join('')}</div>${source}</details>`:'';
    }
    if (layerPhases.includes(id)) {
      const panels=layerPanels(step,id,order,design).slice(1);
      return panels.length?`<details class="wo-how wo-storyboard"><summary>Follow this step in pictures · ${panels.length} ${panels.length===1?'action':'actions'}</summary><div class="wf-grid">${panels.join('')}</div></details>`:'';
    }
    if (id==='fairyHem' || id==='hemContour') return `<details class="wo-how wo-storyboard" open><summary>Follow this step in pictures</summary><div class="wf-grid">${hemShapePanels(design || (id==='fairyHem'?{hemStyle:'Fairy / handkerchief'}:{}),order.allowances,design?.finish).join('')}</div></details>`;
    if (id==='sleeve' && sleeveStylePattern.test(step)) return `<details class="wo-how wo-storyboard" open><summary>Check the sleeve draft in pictures</summary><div class="wf-grid">${sleeveStylePanels(step,order,measurements).slice(1).join('')}</div></details>`;
    if (id==='designLaceTrim') return `<details class="wo-how wo-storyboard" open><summary>Attach the lace trim in pictures</summary><div class="wf-grid">${laceTrimPanels(step).slice(1).join('')}</div></details>`;
    if (order.plan?.asymmetric && ['grain','cut','designCut'].includes(id)) return `<details class="wo-how wo-storyboard" open><summary>Follow the single-layer cutting setup</summary><div class="wf-grid">${[layoutPanel(order.plan),cutEdgePanel(order.allowances||{})].join('')}</div></details>`;
    if (Object.hasOwn(seatedRegions,id)) return `<details class="wo-how wo-storyboard" open><summary>Follow this step in pictures · 2 actions</summary><div class="wf-grid">${seatedPanels(step,id,order,measurements).slice(1).join('')}</div></details>`;
    if (id==='strap' || straplessVisuals.includes(id) || id==='strapless' || id==='facing' && /strapless upper edge/i.test(step)) {
      const panels=id==='strap'?strapPanels(step,order,design).slice(1):straplessPanels(id,order,measurements,design).slice(1);
      return `<details class="wo-how wo-storyboard" open><summary>Follow this step in pictures · ${panels.length} actions</summary><div class="wf-grid">${panels.join('')}</div></details>`;
    }
    const opening=id==='armhole'||id==='sleeve'&&/unpick the sleeves|sleeveless opening/i.test(step);
    const actions=opening?[
      {figure:'armhole',text:'With the fitting sample on the wearer, mark the underarm and shoulder reference points. Check coverage and reach, then transfer matching marks to the other side.'},
      {figure:'clipCurve',text:'Trace or check the new stitching line against the finish or sleeve named in the step. Mark the seam allowance from the line. If there is a facing, clip its curved allowance only as the pattern directs, after stitching.'},
      {figure:'fitMove',text:'Baste the opening and check both sides while the wearer moves. Once the armhole is comfortable, apply the sleeve, facing, or binding specified for the garment.'}
    ]:sewingVisuals.operationActions(step,id);
    if (['seam','sew','layer','topstitch'].includes(id)) actions.splice(2,2,...machineSteps);
    const items=actions.map(({text,figure},i)=>{
      const local=scenes[figure], standard=sewingVisuals.figureParts(figure);
      const title=(i+1)+'. '+(local?.[0] || standard?.[0] || 'Check the pattern');
      const measured=actionPanel(order,figure,title,text,id,measurements);
      if (measured) return measured;
      if (standard) return standardPanel((i+1)+'. '+standard[0],standard[1],text);
      return `<div class="wf-panel wf-written"><strong>${i+1}.</strong> ${escape(text)}</div>`;
    });
    const tip=practicalTips[id];
    return `<details class="wo-how wo-storyboard"${index===0||id==='zipper'?' open':''}><summary>Follow this step in pictures · ${items.length} actions</summary><div class="wf-grid">${items.join('')}</div>${tip?`<p class="wo-tip"><strong>Tip</strong> ${tip}</p>`:''}</details>`;
  }
  function stepList(pattern,order={},measurements=pattern.measurements) {
    scenes ??= createScenes();
    const checklist=Array.isArray(order.done);
    const ids=pattern.visuals || sewingVisuals.patterns[pattern.id];
    const figureOrder={...order,plan:cuttingLayout(order.plan,pattern.design)};
    return `<ol class="${checklist?'check-list':'steps illustrated-steps'} wo-packet-steps">${pattern.steps.map((step,index)=>{
      const id=ids?.[index] || sewingVisuals.identify(step);
      const figure=sewingVisuals.figureParts(id);
      const overview=forStep(step,id,figureOrder,{...pattern,measurements}) || (['fairyHem','hemContour'].includes(id)?'':actionPanel(figureOrder,id,figure?.[0]||'Pattern detail',step,id,measurements) || sewingVisuals.diagram(id));
      const text=checklist?`<label><input type="checkbox" value="${index}" ${order.done.includes(index)?'checked':''}><span><strong>${index+1}.</strong> ${escape(step)}</span></label>`:`<p>${escape(step)}</p>`;
      return `<li>${text}${overview}${illustratedActions(step,id,index,figureOrder,measurements,pattern.design)}</li>`;
    }).join('')}</ol>`;
  }
  function referenceSheet(reference,design,order={},measurements) {
    if (!reference?.startsWith('data:image/jpeg;base64,')) return '';
    const outline=design?.photoOutline || {};
    const plan=order.plan || {};
    const valid=points=>Array.isArray(points)?points.filter(point=>Array.isArray(point) && point.length===2 && point.every(n=>Number.isFinite(n)&&n>=0&&n<=1)):[];
    const strap=valid(outline.strapPoints);
    const hem=valid(outline.hemPoints);
    const low=hem.reduce((lowest,p)=>p[1]>(lowest?.[1]??-1)?p:lowest,null);
    const high=hem.reduce((highest,p)=>p[1]<(highest?.[1]??2)?p:highest,null);
    const drop=design?.hemStyle==='Fairy / handkerchief' && typeof studioDesign.hemDrop==='function'?format(studioDesign.hemDrop(design)):'';
    const ends=drop && high && low && low[1]-high[1]>.01;
    const hemX=ends?Math.min(.94,Math.max(high[0],low[0])+.08):null;
    const dims=[
      {label:'Strap length',value:format(plan.strapLength),point:strap[0]},
      {label:'Strap width',value:format(plan.strapWidth),point:strap[1]},
      {label:'Short-to-long hem drop',value:drop,point:ends?[hemX,(low[1]+high[1])/2]:low},
      ...['Chest / bust','Waist','Hip / seat'].map(label=>({label:'Model '+label.toLowerCase(),value:valueFor(measurements,label)}))
    ].filter(item=>item.value);
    const arrows=ends?`<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${guide(high[0]*100,high[1]*100,hemX*100,high[1]*100)}${guide(low[0]*100,low[1]*100,hemX*100,low[1]*100)}
      <path class="wf-photo-dimension" d="M${hemX*100} ${high[1]*100}V${low[1]*100}"/></svg>`:'';
    const pins=dims.map(({point,value},i)=>point?`<span class="wf-photo-pin${point[0]>.5?' wf-photo-pin-end':''}" aria-hidden="true" style="left:${100*point[0]}%;top:${100*point[1]}%">${i+1}<span>${escape(value)}</span></span>`:'').join('');
    return `<figure class="wf-reference"><div class="wf-reference-image"><img src="${escape(reference)}" alt="Reference garment">${arrows}${pins}</div><figcaption><strong>Reference garment and project measurements</strong>${dims.length?`<ol>${dims.map(({label,value})=>`<li>${escape(label)} <strong>${escape(value)}</strong></li>`).join('')}</ol>`:''}<p>Use the photo to compare details. Take cutting dimensions from your pattern or fitting sample.</p></figcaption></figure>`;
  }
  function lessonScenes(lesson) {
    const {allowances:{seam=1,topstitch=.25}={},practice:{width=12,length=12,gap=5,grain=7}={}}=lesson;
    const cutWidth=format(width), cutLength=format(length), reveal=format(gap), margin=format(seam);
    const finishedWidth=format(width-2*seam), finishedLength=format(length-2*seam);
    const practiceRight=92+Math.round(100*width/length);
    const practicePiece=path(`M92 32H${practiceRight}V132H92Z`,'wf-cloth');
    const piece=path('M92 32H192V132H92Z','wf-cloth');
    const inner=path('M121 124H100V40H184V124H163','wf-stitch');
    const exposed=path('M121 124H163','wf-arrow');
    const gapFigure=piece+inner+exposed+span(121,163,146,reveal)+span(92,100,94,margin);
    const stitchGuide=layers+raw+row+span(145,177,145,margin);
    return {
      needleClamp:path('M111 28h50v33h-50zM126 62h12v72l-6 10 -6 -10z','wf-cloth')+
        path('M159 39h22v11h-22M168 43h8m-4 -4v8','wf-edge')+
        path('M107 104V72m-5 5l5 -5 5 5M141 69h41','wf-arrow')+
        label(187,47,'Clamp screw')+label(191,73,'Flat face points back')+label(47,117,'Push up'),
      winder:path('M32 59H76V104H32Z M38 53h32v6m-32 45h32v6M214 80h54v33h-54z','wf-cloth')+
        path('M105 74a19 19 0 1 0 38 0a19 19 0 1 0 -38 0M118 74h12M217 74h48M228 65h26V78H228Z','wf-edge')+
        path('M55 67H107q-4 25 17 26q23 -2 20 -17l98 -26v20M236 67l6 6 6 -6','wf-arrow')+
        label(27,125,'Spool')+label(83,38,'Pretension disk')+label(198,136,'Bobbin winder seat'),
      bobbinSetup:path('M85 32H151V57H85Z M78 29h80v8H78Z M78 54h80v8H78Z','wf-cloth')+
        path('M67 120H203V136H67Z M112 99h12v21h-12z','wf-edge')+
        path('M118 68v23m-5 -6l5 6 5 -6M137 108h55m-6 -5l6 5 -6 5','wf-arrow')+
        label(171,47,'Seat notch on shaft')+label(204,110,'Slide right')+label(69,151,'Winder seat'),
      windFill:path('M59 66H117V106H59Z M53 62h70v8H53Z M53 102h70v8H53Z M202 66H260V106H202Z M196 62h70v8H196Z M196 102h70v8H196Z','wf-cloth')+
        path('M72 74H105M72 82H105M72 90H105M214 74H250M214 82H250M214 90H250M214 98H250','wf-stitch')+
        path('M66 58V40h27m-5 -4l5 4 -5 4M147 86h23m-6 -5l6 5 -6 5','wf-arrow')+
        label(36,131,'Trim the starting tail')+label(190,131,'Evenly wound layers'),
      bobbinDrop:path('M44 45H197V123H44Z','wf-edge')+path('M81 83a38 27 0 1 0 76 0a38 27 0 1 0 -76 0','wf-cloth')+
        path('M143 86Q148 66 123 66Q98 65 94 84m-4 -6l4 6 6 -4','wf-arrow')+
        path('M153 94q18 23 43 19h53m-6 -5l6 5 -6 5','wf-dimension')+
        label(46,34,'Unwinds counterclockwise')+label(204,102,'Pull through slit')+label(211,132,'Cutter'),
      threadEye:path('M114 23h13v92l-7 13 -6 -13z','wf-cloth')+path('M117 104a3 6 0 1 0 6 0a3 6 0 1 0 -6 0M102 51h30l9 8','wf-edge')+
        path('M90 49q41 -4 63 33q14 26 -34 22l-27 16q-9 6 -29 6m7 -4l-7 4 7 4','wf-arrow')+
        label(153,54,'Needle-bar guide')+label(141,106,'Through eye, then back')+label(32,145,'Tail under foot')+label(156,141,'Leave 10 cm'),
      zigzag:path('M61 50H201V118H61Z','wf-cloth')+path('M187 55l12 9 -12 9 12 9 -12 9 12 9 -12 9','wf-dimension')+
        label(75,80,'One allowance at a time')+label(77,97,'Just inside the raw edge')+label(78,137,'LCD 04 · foot J'),
      board:path('M43 29H252V137H43Z','wf-edge')+
        guide(43,54,252,54)+guide(43,80,252,80)+guide(43,106,252,106)+guide(80,29,80,137)+guide(120,29,120,137)+
        guide(160,29,160,137)+guide(200,29,200,137)+path('M62 48H225V115H62Z','wf-cloth')+
        label(109,72,'Fabric stays flat')+label(65,102,'One layer · no wrinkles')+label(81,153,'Cutting board grid'),
      basicGrain:path('M45 29H274V134H45Z','wf-cloth')+path('M64 29V134M103 42H247V123H103Z','wf-edge')+
        path('M166 50V108m-4-7l4 7 4 -7M162 57l4 -7 4 7','wf-arrow')+
        span(65,165,63,format(grain))+span(65,165,109,format(grain))+label(178,84,'Grainline')+label(44,149,'Selvage'),
      cutRectangle:practicePiece+span(92,practiceRight,145,cutWidth)+tick(practiceRight+12,32,132,cutLength)+label(111,79,'Cut on')+label(111,95,'solid line'),
      seamGuide:stitchGuide+label(190,96,'Raw edge')+label(55,89,'Stitch line'),
      startSeam:scenes.stitchStart[1]+span(145,177,145,margin),
      lockSeam:stitchGuide+path('M108 50V102m-4 -6l4 6 4 -6M124 102V50m-4 6l4 -6 4 6','wf-arrow')+
        label(43,48,'Forward')+label(47,102,'Reverse'),
      pressOpen:path('M38 46H267V120H38Z','wf-cloth')+path('M101 46H152V120H101Z M152 46H204V120H152Z','wf-fold')+
        path('M152 47V120','wf-stitch')+path('M139 77H105m6 -6l-6 6 6 6M166 77H199m-6 -6l6 6 -6 6','wf-arrow')+
        span(101,152,138,margin)+span(152,204,138,margin)+label(54,34,'Wrong side up'),
      rotaryCut:path('M42 36H244V124H42Z','wf-edge')+path('M57 54H185V114H57Z','wf-cloth')+
        path('M176 37H201V125H176Z','wf-fold')+path('M201 49V120','wf-stitch')+
        path('M212 86l21 26M204 81a9 9 0 1 0 18 0a9 9 0 1 0 -18 0','wf-edge')+
        path('M233 72V44m-5 5l5 -5 5 5','wf-arrow')+label(81,82,'Keep ruler steady')+label(72,147,'Rated rotary mat'),
      squareGap:gapFigure+label(110,82,'Leave open'),
      pivot:piece+inner+path('M184 86V40H149m6 -5l-6 5 6 5','wf-arrow')+
        path('M181 40a3 3 0 1 1 6 0a3 3 0 1 1 -6 0','wf-dimension')+
        span(184,192,102,margin)+label(106,68,'Needle down')+label(208,75,'Foot up to rotate'),
      trimCorner:piece+inner+path('M92 45l13 -13M179 32l13 13M92 119l13 13M179 132l13 -13','wf-dimension')+
        label(104,77,'Clip diagonally')+label(202,95,'Keep stitches intact'),
      turnSquare:piece+inner+exposed+path('M155 73Q177 94 145 121v15m-5 -6l5 6 5 -6','wf-arrow')+
        span(121,163,151,reveal)+label(201,83,'Pull through gap'),
      pointTurner:piece+inner+path('M130 116Q151 66 180 44Q154 87 143 123Z','wf-fold')+
        path('M174 57l8 -12m-8 2l8 -2 -1 8','wf-arrow')+label(202,49,'Blunt tip')+label(202,74,'Nudge from inside'),
      tuckGap:path('M48 40H236V122H48Z','wf-cloth')+path('M88 95H196V121H88Z','wf-fold')+
        path('M88 121H196','wf-stitch')+path('M122 132V103m-4 6l4 -6 4 6M159 132V103m-4 6l4 -6 4 6','wf-arrow')+
        tick(246,95,121,margin)+label(76,71,'Tuck both raw edges')+label(58,150,'Match the existing seam'),
      edgeStitch:piece+path('M98 38H186V126H98Z','wf-stitch')+span(186,192,147,format(topstitch))+
        label(202,80,'Across folded gap')+label(202,97,'Sew all four sides'),
      finishedSquare:piece+path('M98 38H186V126H98Z','wf-stitch')+span(92,192,147,finishedWidth)+tick(204,32,132,finishedLength)+
        label(111,75,'Gap is fully')+label(126,90,'closed')
    };
  }

  function lessonSteps(lesson) {
    scenes ??= createScenes();
    const drawings=lessonScenes(lesson);
    function figure(id,title,text,primary=false) {
      const classes=primary?'wf-panel step-figure':'wf-panel';
      const drawing=drawings[id] || scenes[id]?.[1];
      if (drawing) return panel(title,drawing,text,classes);
      const standard=sewingVisuals.figureParts(id);
      return standardPanel(title,standard[1],text,classes);
    }
    return `<ol class="steps illustrated-steps wo-packet-steps">${lesson.steps.map(({title,figure:overview,text,actions,tip,check},index)=>`<li>
      ${figure(overview,title,text,true)}
      <details class="wo-how wo-storyboard"${index===0?' open':''}><summary>Follow this step in pictures · ${actions.length} actions</summary>
        <div class="wf-grid">${actions.map(([id,name,description],i)=>figure(id,(i+1)+'. '+name,description)).join('')}</div>
        ${tip?`<p class="wo-tip"><strong>Tip</strong> ${escape(tip)}</p>`:''}
      </details><p class="wo-tip"><strong>Check before moving on</strong> ${escape(check)}</p>
    </li>`).join('')}</ol>`;
  }

  return {bodySheet,cuttingPlan,seamPlan,featurePlan,stepList,referenceSheet,machineActions,lessonSteps};
})();
