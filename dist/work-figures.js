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
  const format=value=>Number.isFinite(value)?Number(value.toFixed(3))+' cm':'';
  const num=(step,regex)=>step.match(regex)?.[1];
  function panel(title,drawing,description) {
    return `<figure class="wf-panel step-figure"><svg viewBox="0 0 330 164" role="img" aria-label="${escape(title)}" focusable="false">${drawing}</svg><figcaption><strong>${escape(title)}</strong><span>${escape(description)}</span></figcaption></figure>`;
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
    if (id==='strapless' || id==='facing' && /strapless upper edge/i.test(step)) {
      return straplessPanels(order,pattern.measurements)[0];
    }
    if (id==='darts') return seamFold(allowance,true);
    if (['seam','layer','sew'].includes(id)) return seamFold(allowance);
    if (id==='topstitch') return strip('Topstitch placement',[topstitchPanel(allowance)]);
    if (['cut','designCut','grain'].includes(id)) return strip('Cutting and grainline',[
      layoutPanel(order.plan||{}),cutEdgePanel(allowance)
    ]);
    if (id==='fairyHem') return '';
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
    const length=format(plan.strapLength);
    const placement=step.match(/(\d+(?:\.\d+)?) cm (inward|outward) from the starting shoulder mark/i);
    const halter=/\bhalter\b/i.test(step) || design?.support==='Halter strap' && !/shoulder straps|wide straps|narrow straps|spaghetti straps/i.test(step);
    const side=placement?.[2].toLowerCase();
    const old=side==='outward'?75:51;
    const target=side==='outward'?51:75;
    const attach=(x,offset=0)=>path(`M${x+offset-7} 68h14`,'wf-stitch');
    const bodice='M30 69H137L130 111Q124 129 125 144H42Q43 129 37 111Z';
    const front=path(bodice,'wf-cloth')+guide(84,72,84,143)+attach(target)+attach(168-target);
    const backing=path('M180 69H287L280 111Q274 129 275 144H192Q193 129 187 111Z','wf-right')+
      guide(234,72,234,143)+(halter?'':attach(target,150)+attach(168-target,150));
    const connectors=halter
      ?path(`M${target} 65Q${target} 30 84 30Q${168-target} 30 ${168-target} 65`,'wf-arrow')+label(84,20,'Around neck','middle')
      :path(`M${target} 64V53Q${target} 37 ${target+18} 37H${target+132}Q${target+150} 37 ${target+150} 53V64`,'wf-arrow')+
        label(158,29,'Route over shoulder','middle');
    const offset=placement?guide(old,64,old,88)+guide(target,69,target,88)+span(51,75,91,placement[1]+' cm')+
      label(86,97,side):'';
    const pad=format(order.allowances?.neck??order.allowances?.seam);
    const start=64,end=203,outerLeft=38,outerRight=225,yTop=63,yBottom=97;
    const plannedStrip=path(`M${outerLeft} ${yTop}H${outerRight}V${yBottom}H${outerLeft}Z`,'wf-cloth')+
      path(`M${start} ${yTop}V${yBottom}M${end} ${yTop}V${yBottom}`,'wf-stitch')+
      path(`M${start} ${yTop}V40M${end} ${yTop}V40M${outerRight} ${yTop}H242M${outerRight} ${yBottom}H242`,'wf-extension')+
      span(start,end,43,length||'Finished length')+tick(241,yTop,yBottom,width||'Pattern width');
    return [
      panel(halter?'Mark front anchors for the halter':'Locate both strap anchors on front and back',
        front+backing+connectors+offset+label(84,126,'Front','middle')+label(234,126,halter?'Back · no anchors':'Back','middle'),
        placement?`Measure ${placement[1]} cm ${side} from the starting shoulder mark on each side. Mark the straps on the fitting sample and check both sides before cutting.`
          :halter?'Mark where the halter ends meet the front. Check the fit around the back of the neck, including the closure.'
            :'Mark both ends of each strap on the fitting sample. Match the left and right sides, then transfer every marked end to the paper pattern.'),
      panel('Measure between the attachment lines',
        plannedStrip+label(58,119,'Front mark')+label(170,119,halter?'Neck mark':'Back mark')+
        (pad?span(outerLeft,start,145,pad):''),
        `${width?'Check the finished width at '+width+'. ':''}${length?'Use '+length+' between the marked lines and check it on the fitting sample. ':'Measure between the attachment marks on the wearer. '}Add the pattern’s attachment allowance to the cut length. A folded or turned strap also needs the cut width specified by its construction.`),
      panel('Baste both ends and check the fit',
        path('M52 43H258V133H52Z','wf-cloth')+path('M130 26H155V102H130Z','wf-right')+
        path('M116 66H169M131 85H154','wf-stitch')+guide(155,85,193,85)+label(198,89,'Baste here')+
        (width?span(130,155,123,width):''),
        'Keep each strap flat and untwisted. Baste it at the marks and try on the garment. Check reach, symmetry, and coverage before permanently sewing and reinforcing the attachment as the pattern directs.')
    ];
  }
  function straplessPanels(order,measurements) {
    const edge=format(order.allowances?.neck??order.allowances?.seam);
    const bust=valueFor(measurements,'Chest / bust');
    const bodice=path('M45 54Q72 39 105 54Q132 39 164 54L153 133H57Z','wf-cloth');
    const topEdge=path('M45 54Q72 39 105 54Q132 39 164 54','wf-dimension');
    return [
      panel('Fit the unsupported upper edge',
        bodice+topEdge+guide(161,52,187,40)+label(192,42,'Finished upper edge')+
        (bust?tape(52,159,85,'Model bust '+bust):''),
        'Use a strapless pattern or toile with the specified structure before removing any support. Mark front and back upper edge heights on the wearer, then check standing, sitting, and reaching without the edge slipping.'),
      panel('Mark the facing or support seam',
        bodice+path('M47 65Q72 50 105 65Q132 50 162 65','wf-stitch')+path('M163 54H192M162 65H192','wf-extension')+
        tick(192,54,65,edge||'Pattern allowance')+label(104,116,'Inside of the bodice','middle'),
        'Trace matching front and back reinforcement and finishing pieces from the confirmed pattern. Keep the specified seam allowance and construct the support before finishing the upper edge.')
    ];
  }

  function fairyHemActions(design,allowance) {
    const drop=design?.hemStyle==='Fairy / handkerchief' && typeof studioDesign.hemDrop==='function'
      ?format(studioDesign.hemDrop(design)):'';
    const skirt=path('M106 35H202Q226 78 271 113L232 104L207 142L176 116L139 142L107 115L77 130L38 110Q79 81 106 35Z','wf-cloth');
    return [
      panel('1. Mark the short hem points',skirt+guide(41,104,279,104)+label(211,87,'Short hem level'),
        'Try on the toile with the intended shoes. Mark the shortest finished hem height at the points called out on the pattern. Transfer those marks without changing the waist seam.'),
      panel('2. Check the drop to the long points',skirt+guide(176,104,286,104)+guide(207,142,286,142)+tick(282,104,142,drop||'Pattern drop',-1),
        `Measure vertically from the marked short level to each low point${drop?' using the '+drop+' design drop':''}. Check front, back and both sides before marking a cut line.`),
      panel('3. Mark the seam or turn allowance',path('M51 36H220L169 137Z','wf-cloth')+path('M79 46L166 115L196 55','wf-stitch')+
        path('M166 116H207M169 137H207','wf-extension')+tick(204,116,137,format(allowance.first??allowance.seam)||'Pattern allowance'),
        'Follow the pattern along the taper into each point. Measure the finish allowance from the finished line, then test the finish on a scrap cut on the same grain.'),
      panel('4. Support and finish each point',path('M44 33H193L122 140Z','wf-right')+path('M65 49L123 116L174 48','wf-stitch')+
        path('M185 112H141m7 -5l-7 5 7 5','wf-arrow')+label(186,130,'Support the bias edge'),
        'Let the skirt hang so the bias edges settle. Recheck the short points and long points on the wearer, then finish the edges without pulling. Use the narrow hem, binding, or facing supplied by the pattern.')
    ];
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
  function standardPanel(title,visual,text) {
    return panel(title,`<svg class="wf-standard" x="0" y="0" width="330" height="164" viewBox="0 0 270 141">${visual}</svg>`,text);
  }
  function machineActions() {
    return `<details class="wo-how wo-storyboard"><summary>Set up the Brother CP2160F in pictures</summary><div class="wf-grid">${setupSteps.map(([figure,text],i)=>{
      const [title,visual]=sewingVisuals.figureParts(figure);
      return standardPanel((i+1)+'. '+title,visual,text);
    }).join('')}</div></details>`;
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
    if (figure==='zipper' || figure==='zipCheck') {
      const drawing=path('M35 24H204V138H35Z','wf-cloth')+path('M116 43V119M122 43V119','wf-edge')+
        path('M119 46V115','wf-stitch')+guide(52,73,181,73)+label(52,68,'Matching seam')+
        path('M122 43H212M122 119H212','wf-extension')+tick(210,43,119,format(plan.zipperOpening)||'Pattern opening');
      return panel(title,drawing,description);
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
    if (['clipCurve','turnFacing','matchSleeve','easeSleeve','pin','foot','pinOut','allowance','zipClearance'].includes(figure) && local) {
      const line={
        clipCurve:guide(67,48,142,48)+tick(105,48,77,annotated),
        turnFacing:tick(104,69,89,annotated),
        matchSleeve:path('M114 32H213M114 44H213','wf-extension')+tick(212,32,44,format(seam)||'Use pattern'),
        easeSleeve:dimText(203,125,'Allowance '+(format(seam)||'per pattern')),
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
  function illustratedActions(step,id,index,order={},measurements,design) {
    scenes ??= createScenes();
    if (id==='fairyHem') return `<details class="wo-how wo-storyboard" open><summary>Follow this step in pictures</summary><div class="wf-grid">${fairyHemActions(design,order.allowances||{}).join('')}</div></details>`;
    if (Object.hasOwn(seatedRegions,id)) return `<details class="wo-how wo-storyboard" open><summary>Follow this step in pictures · 2 actions</summary><div class="wf-grid">${seatedPanels(step,id,order,measurements).slice(1).join('')}</div></details>`;
    if (id==='strap' || id==='strapless' || id==='facing' && /strapless upper edge/i.test(step)) {
      const panels=id==='strap'?strapPanels(step,order,design).slice(1):straplessPanels(order,measurements).slice(1);
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
    return `<details class="wo-how wo-storyboard"${index===0?' open':''}><summary>Follow this step in pictures · ${items.length} actions</summary><div class="wf-grid">${items.join('')}</div>${tip?`<p class="wo-tip"><strong>Tip</strong> ${tip}</p>`:''}</details>`;
  }
  function stepList(pattern,order={},measurements=pattern.measurements) {
    scenes ??= createScenes();
    const checklist=Array.isArray(order.done);
    const ids=pattern.visuals || sewingVisuals.patterns[pattern.id];
    return `<ol class="${checklist?'check-list':'steps illustrated-steps'} wo-packet-steps">${pattern.steps.map((step,index)=>{
      const id=ids?.[index] || sewingVisuals.identify(step);
      const figure=sewingVisuals.figureParts(id);
      const overview=forStep(step,id,order,{...pattern,measurements}) || (id==='fairyHem'?'':actionPanel(order,id,figure?.[0]||'Pattern detail',step,id,measurements) || sewingVisuals.diagram(id));
      const text=checklist?`<label><input type="checkbox" value="${index}" ${order.done.includes(index)?'checked':''}><span><strong>${index+1}.</strong> ${escape(step)}</span></label>`:`<p>${escape(step)}</p>`;
      return `<li>${text}${overview}${illustratedActions(step,id,index,order,measurements,pattern.design)}</li>`;
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
  return {bodySheet,cuttingPlan,seamPlan,featurePlan,stepList,referenceSheet,machineActions};
})();
