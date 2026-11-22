'use strict';

const workRecipe = (() => {
  const amount=value=>Number.isFinite(value)&&value>=0?`${Number(value.toFixed(3))} cm`:'';
  const targetModel=pattern=>pattern?.design?.model||pattern?.model||pattern?.id;
  const tailoring=(order,measurements,kind)=>kind==='Tailoring'||order?.kind==='Tailoring'||measurements?.make===false;
  const bodyChecks={
    dress:['Chest / bust','Waist','Hip / seat','Shoulder span'],
    top:['Chest / bust','Shoulder span'],
    skirt:['Waist','Hip / seat'],
    trousers:['Waist','Hip / seat','Body inseam'],
    corset:['Chest / bust','Underbust / rib cage','Waist']
  };
  const allowanceNames={seam:'General seam',neck:'Neckline',armhole:'Armhole',first:'First hem turn',second:'Second hem turn'};
  const normalSetup='On stable woven scraps, use foot J and centered straight stitch 01 on the Brother CP2160F. Start at 2.5 mm. Sew through matching layers and check both sides of the test seam. For stretch fabric, test a compatible needle and narrow zigzag 04 for recovery.';
  const release='Stop with the needle in the fabric to reposition the work. Remove a pin or clip before it reaches the foot.';

  function chosenMeasurements(measurements,labels) {
    const rows=new Map((measurements?.rows||[]).map(row=>[row[0],row.at(-1)]));
    return labels.map(label=>[label,rows.get(label)]);
  }
  const bodyValues=(pattern,measurements)=>chosenMeasurements(measurements,bodyChecks[targetModel(pattern)]||['Chest / bust','Waist','Hip / seat']);
  const knownBody=([,value])=>typeof value==='string'&&Boolean(value.trim())&&!/^[-–—]$/.test(value.trim());
  const bodyText=entries=>entries.map(([label,value])=>`${label} ${value}`).join(' · ');
  const point=(name,text)=>[name,text];
  const position=(plan,key,description)=>amount(plan[key])?`${description} ${amount(plan[key])}.`:'';
  const seamText=(allowances,key='seam')=>{
    const saved=amount(allowances[key])||amount(allowances.seam);
    return saved?`Mark the ${saved} stitching allowance from the aligned cut edges.`:'Find the allowance for these pieces on your paper pattern and mark that distance inward from the cut edges.';
  };
  function seamFinish(plan,allowances,key='seam') {
    const total=allowances[key]??allowances.seam;
    const stitch=seamText(allowances,key);
    if (plan.seamFinish==='french') {
      const first=total>=1.2?Math.round(total*4)/10:null;
      const second=first==null?null:total-first;
      return [point('Sew the first French-seam pass',
        `Use this finish where the pattern and fabric suit a narrow enclosed seam. Remove the fitting basting and put wrong sides together. ${first==null?'Copy the two pass widths from your tested pattern.':`For the recorded ${amount(total)} total, test the first pass at ${amount(first)} from the raw edge.`} ${normalSetup} Trim the two edges so they fit inside the second pass.`),
      point('Fold over and enclose both raw edges',
        `Press the seam. Fold it along the first stitched line with right sides together. ${second==null?'Use the pattern’s tested enclosure width.':`Sew the second pass ${amount(second)} from that fold.`} Open the pieces and check for threads showing through on the garment side before pressing.`)];
    }
    if (plan.seamFinish==='felled') return [
      point('Join the seam and trim one allowance',`${stitch} ${normalSetup} Press both allowances toward the designated side. Trim the lower allowance narrower and keep the upper allowance wide enough to cover it.`),
      point('Wrap the wider edge and topstitch',`Turn the wider allowance over the trimmed edge, tuck its raw edge under and press. ${position(allowances,'topstitch','Use the recorded topstitch distance of')||'Use the pattern’s topstitch distance.'} Sew the folded edge and check that it encloses the lower raw edge.`)];
    if (plan.seamFinish==='stretch') return [point('Test and sew a stretch seam',
      `${stitch} On the CP2160F use foot J, a compatible stretch or ballpoint needle, and test narrow zigzag 04 on the actual layers. Pull and release the sample to check the stitches hold. Sew without tugging the fabric, then test the garment’s seam and press it at a safe temperature.`)];
    if (plan.seamFinish==='plain') return [
      point('Stitch the marked seam on stable woven fabric',`${stitch} ${normalSetup} ${release}`),
      point('Finish the raw edges with zigzag',
        'Test zigzag 04 with foot J on matching layered scrap. For a seam pressed open, zigzag each raw edge separately. Finish the allowances together where the pattern calls for pressing them to one side. Set and press the seam.')];
    return [point('Stitch, finish and press',`${stitch} ${normalSetup} ${release} Finish the exposed allowance according to the paper pattern and press without stretching it.`)];
  }

  function prepare({pattern,order={},measurements=pattern?.measurements,estimate,kind}={}) {
    if (!pattern) return '';
    const plan=order.plan||{};
    const allowances=order.allowances||{};
    const repair=tailoring(order,measurements,kind);
    const values=bodyValues(pattern,measurements);
    const known=values.filter(knownBody);
    const missing=values.filter(entry=>!knownBody(entry)).map(([label])=>label.toLowerCase());
    const recorded=Object.entries(allowanceNames).flatMap(([key,label])=>amount(allowances[key])?[`${label} ${amount(allowances[key])}`]:[]);
    const pieces=(plan.pieces||[]).filter(piece=>typeof piece?.name==='string'&&piece.name.trim());
    const count=pieces.reduce((total,piece)=>total+(Number.isInteger(piece.quantity)&&piece.quantity>0?piece.quantity:0),0);
    const incomplete=pieces.filter(piece=>!Number.isInteger(piece.quantity)||piece.quantity<1||!(piece.width>0&&piece.length>0));
    const unresolved=(estimate?.groups||[]).filter(group=>group.source==='unresolved'&&group.name).map(group=>group.name);
    const doubleHem=pattern.design?.finish==='Double-fold hem'||(pattern.steps||[]).some(step=>/turn.{0,40}twice|double.fold/i.test(step));
    const missingTurns=['first','second'].filter(key=>!amount(allowances[key])).map(key=>allowanceNames[key].toLowerCase());
    const size=order.size?` Use the ${order.size} production measurements saved with this order.`:'';
    const begin=repair?'Start with the original garment fastened as worn. Mark its existing stitching and the required changes on the sample before opening any seams.'
      :pattern.external?'Start with the publisher’s full-size paper pattern and cutting layout. Check the publisher’s size, paper pieces, seam allowances and finished dimensions before cutting.'
        :`Start with a full-size paper pattern or tested tracing that matches this garment. Use those outlines for the cutting shapes, grainlines and matching marks.${size}`;
    const ready=[known.length?`Recorded fitting measurements · ${bodyText(known)}`:'',
      recorded.length?`Recorded allowances · ${recorded.join(' · ')}`:'',
      !repair&&pieces.length?`${pieces.length} paper ${pieces.length===1?'piece is':'pieces are'} on the recorded cutting list${count?` with ${count} recorded fabric ${count===1?'piece':'pieces'} to cut`:''}. Match the names, quantities, and placement to your full-size pattern.`:''].filter(Boolean);
    const check=[missing.length?`Measure and record ${missing.join(', ')} before fitting.`:'',
      !repair&&!pieces.length?'List each paper piece and its cut quantity. Check folds and mirrored pairs before setting out the fabric.':'',
      !repair&&incomplete.length?`Complete the quantities, widths or lengths for ${incomplete.map(piece=>piece.name).join(', ')} in the cutting list.`:'',
      !repair&&!pattern.external&&!amount(plan.usableWidth)?'Measure the usable fabric width between the selvages before checking the cutting layout.':'',
      !repair&&unresolved.length?`Confirm the cut layout and fabric quantity for ${unresolved.join(', ')}.`:'',
      !repair&&doubleHem&&recorded.length&&missingTurns.length?`Copy the ${missingTurns.join(' and ')} width${missingTurns.length>1?'s':''} from the tested pattern before folding the hem.`:'',
      !recorded.length?(repair?'Measure the allowance available beyond the original stitching before cutting or trimming.':'Copy the seam and hem allowances from the tested pattern.')
        :!amount(allowances.seam)?(repair?'Measure the available general seam allowance on the original garment.':'Record the general seam allowance from the paper pattern.'):'' ].filter(Boolean);
    const renderList=(items,className)=>items.length?`<ul class="${className}">${items.map(item=>`<li>${escape(item)}</li>`).join('')}</ul>`:'';
    return `<details class="design-options wo-recipe-preflight" open><summary>Before cutting and sewing</summary><p>${escape(begin)}</p>${renderList(ready,'wo-recipe-ready')}${renderList(check,'wo-recipe-missing')}</details>`;
  }

  function phaseFor(id,text) {
    if (id==='measure'||id==='fit') return 'fit';
    if (id==='grain'||id==='cut'||id==='marks') return 'cut';
    if (id==='designCut') return 'draft';
    if (id==='sleeve'&&/set the sleeve length|attach the cuffs|underarm seams/i.test(text)) return 'cuff';
    if (id==='sleeve'||id==='armhole'&&/sleeve.{0,20}notch|each sleeve/i.test(text)) return 'sleeve';
    if (id==='facing'&&/collar stand|attach the collar/i.test(text)) return 'collar';
    if (['neck','facing','armhole'].includes(id)) return 'facing';
    if (id==='seam'||id==='sew'||id==='layer') return 'seam';
    if (id==='pocket'||id==='pocketPatch') return 'pocket';
    if (id==='band'&&/waist|casing/i.test(text)) return 'waistband';
    if (id==='finish'&&/hem/i.test(text)) return 'hem';
    if (['darts','shoulder','zipper','rise','press','topstitch','button'].includes(id)) return id;
    return null;
  }

  const fit=({pattern,values,text})=>[
    ...(/prewash|prepare the fabric/i.test(text)?[point('Prepare a test piece of the fabric','Follow the care instructions for washing and drying. Press from the wrong side first on a scrap, lifting the iron between sections. Lay the test fabric flat before tracing the grainline.')]:[]),
    point('Set up the fitting sample','Mark center front, center back and the waist on the test garment before sewing. Close the marked opening and align those lines on the wearer.'),
    point('Compare the same levels',`${values.length?`Use the recorded values · ${bodyText(values)}. `:''}Measure the sample around each matching level with the closure fastened. Record the garment measurement beside the body measurement and check the intended ease in the pattern.`),
    point('Pin one change at a time',`Mark both ends of each pinched area with chalk. ${targetModel(pattern)==='trousers'?'Sit and step forward to check the crotch, seat and knees before pinning away excess.':'Sit, reach forward and raise the arms as far as the style allows.'} Baste the new stitch lines and try again before trimming.`),
    point('Mark the paper pattern','Transfer the tested lines and matching marks to the paper. Walk each adjoining seam from notch to notch and recheck the finished measurement before proceeding.')
  ];

  const cut=({plan,pattern})=>{
    const knownPieces=(plan.pieces||[]).filter(piece=>piece?.name&&Number.isInteger(piece.quantity)&&piece.quantity>0);
    const quantity=knownPieces.length?` Confirm the recorded count for ${knownPieces.slice(0,4).map(piece=>`${piece.name} × ${piece.quantity}`).join(', ')}. Check every piece against the pattern.`:'';
    const handed=targetModel(pattern)==='trousers'?'Keep left and right fronts, backs, and pocket pieces in separate stacks.':'Put a removable label on each piece’s wrong side. Write its name and left or right where applicable.';
    return [
      point('Match the paper pieces to the cloth',`Find the factory-finished selvage and the fabric’s right side. Press the fabric flat. ${position(plan,'usableWidth','Use the recorded selvage-to-selvage usable width of')}${quantity}`.trim()),
      point('Set each grainline and fold','Check both ends of the paper grainline against the same selvage with a ruler. For a piece marked on fold, line its fold mark up with the uncut fold. For a mirrored pair cut in one layer, turn the paper over for the matching copy.'),
      point('Verify the actual cutting line','Check every printed size line and allowance before cutting. Keep the lower blade of the shears on the board and keep weights on the paper. Transfer notches, dart points and openings before removing each piece.'),
      point('Sort the cut work',`${handed} Count the shell, lining and interfacing separately before putting the paper pieces away.`)
    ];
  };

  const recipes={
    fit,cut,
    draft:({allowances})=>[
      point('Trace the fitted lines first','Trace a clean copy of the paper piece with its finished lines, grainline and matching marks. Use a different pencil line for the tested change. Keep the original copy for comparison.'),
      point('Check the two sides of every join',`Put the paper edges together on their stitch lines and walk from notch to notch. Mark any ease called for by the pattern. ${seamText(allowances)} Transfer the checked line and all notches to the cutting copy.`)
    ],
    darts:({text,allowances,plan})=>[
      point('Put the two dart marks together','Face the right sides inward and fold through the marked dart point. Match the two marked legs at the wide end and farther down. Put a pin through one marked line and check it emerges at the other line.'),
      point('Sew from the wide end to the point',`${normalSetup} Sew toward the fold and guide the last stitches close to the fold at the point. Leave long tails and secure the tip as the pattern directs.`),
      point('Press over a curved surface',`Set the stitching with the iron, then press ${/toward the center/i.test(text)?'toward the center of the garment':'in the pattern’s direction'}. Compare the two darts at the same level.`),
      ...(/join the shoulder/i.test(text)?[point('Match the shoulders after the darts are pressed','Lay front and back with right sides together. Match the neckline ends first and check the armhole ends. Baste and compare the two shoulders.'),
        ...seamFinish(plan,allowances)]:[]),
      ...(/baste the seams/i.test(text)?[point('Baste the fitted seams after pressing',`${seamText(allowances)} Match the waistline and hip notches. Baste the corresponding seams and pin-test the two sides with the garment fastened.`)]:[])
    ],
    shoulder:({allowances,plan})=>[
      point('Match the shoulder pair','Put front and back right sides together. Match the neck-end point of the shoulder first, then the armhole end. Pin or clip those two points and then the space between them.'),
      ...seamFinish(plan,allowances),
      point('Compare the two shoulders','Lay the shoulders side by side and compare the neckline and armhole ends before finishing the neckline.')
    ],
    seam:({allowances,plan,text})=>[
      point('Match the seam from known points',`Place the pieces right sides together. Match the ends and notches, then clip the fabric between them. ${/side seams/i.test(text)?'At the side seams, match the underarm and waistline marks to their companions. ':''}${seamText(allowances)}`),
      point('Baste and fit','Use long removable stitches. Try on the garment and compare the matching sides at the waist and hem. Mark corrections on both layers and baste again before sewing permanently.'),
      ...seamFinish(plan,allowances)
    ],
    facing:({allowances,text})=>{
      const binding=/\bbind|bias tape|binding/i.test(text)&&!/facing or binding/i.test(text);
      const edge=/armhole/i.test(text)&&!/neckline/i.test(text)?'armhole':'neck';
      return [point('Compare the finish with its worn edge',`Walk the facing or binding along the stitched ${edge==='neck'?'neckline':'armhole'} edge. Match its center, side or shoulder marks, and any closure ends. ${seamText(allowances,edge)}`),
        point(binding?'Open the binding fold and sew the first edge':'Sew the facing with right sides together',`${binding?'Open the first fold and put that raw edge against the garment raw edge. Clip it from one matching mark to the next and stitch inside the crease.':'Finish the facing’s outside edge as specified. Lay it right side down on the garment right side, align the marks and stitch the joined edge.'} ${normalSetup}`),
        point('Turn and check before securing the finish',binding?'Wrap the tape over the raw edge so the inner fold covers the first stitching. Baste and stitch that fold. Check the neckline and arm openings lie flat and can pass over the body.':'Trim and clip the curved allowance as the pattern directs. Roll the facing to the inside. Understitch where reachable, press and secure the facing at matching seams. Check the closure and head clearance.')];
    },
    collar:({allowances})=>[
      point('Check the placket and collar marks','Finish the placket folds according to the marked paper pattern. Find center back, the shoulder marks and both ends of the neckline. Line those up with the collar or stand before basting.'),
      point('Stitch the checked collar',`${seamText(allowances,'neck')} ${normalSetup} Grade the enclosed allowance, turn and press the collar. Close the shirt and compare both collar ends before finishing the inner edge.`)
    ],
    sleeve:({allowances,plan,sleeveValues})=>[
      point('Bring the matching notches together','Lay the left sleeve beside the left armhole and the right sleeve beside the right armhole. Put right sides together. Check front and back notches against the paper and match the cap mark at the shoulder when the pattern calls for it.'),
      point('Baste and compare each sewn shape',`Clip the matching marks first. Distribute any sleeve-cap ease only where the pattern directs. ${seamText(allowances,'armhole')} Baste both arms. ${sleeveValues.length?`Compare the sewn sleeve with the recorded body check · ${bodyText(sleeveValues)}. `:''}Try on the garment and check forward reach, standing hang and equal sleeve lengths.`),
      ...seamFinish(plan,allowances,'armhole'),
      point('Press without flattening the sleeve cap','Check the sewn cap for folds that do not belong in the style. Press the finished seam over a tailor’s ham or rolled towel and compare front and back hang.')
    ],
    cuff:({allowances})=>[
      point('Mark the finished sleeve on the wearer','Bend the elbow and mark the intended sleeve finish from its paper reference. Compare the two sleeves at the same wrist position and note the location of any cuff opening.'),
      point('Finish each cuff as its paper marks direct',`Match cuff and sleeve notches with the fabric faces together as specified. Keep the overlap and any vent accessible. ${seamText(allowances)} Baste, then check that the wrist and hand can pass as intended before choosing the final stitch.`)
    ],
    pocket:({plan,allowances,pattern})=>{
      const patch=plan.pocket==='patch'||pattern?.design?.pocket==='Patch pockets';
      const marks=[position(plan,'pocketDown','Position below the recorded reference'),position(plan,'pocketAcross','Position from center front'),
        position(plan,'pocketWidth','Finished width'),position(plan,'pocketHeight','Finished height')].filter(Boolean).join(' ');
      return [
        point('Transfer the opening and placement marks',`${marks?marks+' ':''}Use the pocket template to mark the opening ends and matching points on the garment panel. Lay the second side beside it and compare the marks when the paper calls for a pair.`),
        point('Keep the hand opening free',patch?'Press the top finish and the sides over the finished pocket template. Pin the pocket to the right side at its marks. Baste the sides and bottom and keep the top open.':`Match the correct facing or pocket bag with the paper pattern’s opening marks. Baste at both ends first. ${seamText(allowances)} Keep the opening and the nearby zipper or seam free.`),
        point('Fit the opening before closing the body seam',`${normalSetup} Secure the opening ends as the pattern specifies. Slide a hand inside, then compare pocket height and access on the garment.`)];
    },
    zipper:({pattern,plan,text})=>{
      const closure=pattern?.design?.closure||'';
      const invisible=/invisible/i.test(text+' '+closure);
      const fly=/\bfly\b/i.test(text+' '+closure);
      const opening=amount(plan.zipperOpening);
      return [
        point('Mark the two zipper stops',`${opening?`Measure the recorded ${opening} opening from its finished top mark. `:'Transfer the top stop and opening end from your paper pattern, then check the zipper against those marks. '}Mark any waist or crossing seam on both sides with the zipper closed.`),
        point('Clip and test the zipper position',`${fly?'Match the fly extension, facing and shield marks on the paper before handling the zipper. Keep the shield free of the topstitching where the pattern shows it loose. ':'Clip the tapes over their marked seam positions. '}Baste the first tape, close the zipper to check alignment, then baste the second tape. Open it again before sewing.`),
        point('Fit the appropriate presser foot',`${invisible?'Use an invisible-zipper foot compatible with the CP2160F and follow its needle-clearance instructions.':'Fit zipper foot I on the Brother CP2160F. Use centered straight stitch 01 for the standard zipper tape, with the foot clipped to the side called for by the installation.'} Turn the handwheel toward you before sewing to check clearance. Test the zipper and finish the seam below its stop as the pattern directs.`)];
    },
    rise:({allowances})=>[
      point('Sort front and back trouser pieces','Lay both fronts with the fly or front-rise marks inward. Match each front to its own back at inseam notches. Clip left and right legs separately before bringing their rise seams together.'),
      point('Baste the rise and check stride',`${seamText(allowances)} Baste the marked legs and rise before sewing permanently. Sit and take several steps while the waist is held at the intended position. Mark the front and back separately if either pulls.`)
    ],
    waistband:({allowances,plan,text})=>{
      const casing=/casing|elastic|drawstring/i.test(text);
      const drawstring=/drawstring/i.test(text);
      return [
        point('Check the finished waistline','Fasten the garment at the planned marks and measure the fitted waistline. Match the waistband centers, side marks and closure. Support or interface the band only as required by the paper pattern.'),
        point(casing?'Mark and sew the casing':'Secure the outside band before closing the inside',casing
          ?`${position(plan,'casingWidth','Use the recorded clear casing depth of')} Test that the actual ${drawstring?'drawstring':'elastic'} moves through a scrap casing. ${drawstring?'Reinforce and test each exit in the outer waistband layer before folding the casing.':'Mark and leave a threading opening while sewing.'} Clip the trailing end outside while feeding the other end.`.trim()
          :`${seamText(allowances)} Baste the outer waistband to the garment. Check the band lies flat at the matching marks, then turn the inner edge over the joining seam and sew it as the pattern directs.`),
        ...(casing?[point(drawstring?'Finish the two drawstring tails':'Fit, join and secure the elastic',drawstring?'Leave both ends free long enough to tie. Check the open waist passes over the hips, then secure the tails and thread ends.':'Check for twists along the casing. Pin the elastic at the tested length and check the waist over the hips. Join its ends at the marked overlap and close the threading opening as the pattern directs.')]:[]),
        point('Check the fastening while worn','Close the waistband and sit. Test zipper, hook, button, tie or elastic function as applicable. Check the waist lies flat and the inside band has caught the intended layers before finishing the final openings.')];
    },
    hem:({pattern,allowances,text})=>{
      const method=pattern?.design?.finish;
      const double=method==='Double-fold hem'||/turn.{0,40}twice|double.fold/i.test(text);
      const first=amount(allowances.first),second=amount(allowances.second);
      const fold=method==='Faced hem'?'Match the facing to the intended hem, stitch the joined edge, grade the allowance and turn the facing in.':method==='Contrast hem band'?'Match and baste the band at the marked hem line. Check the band depth while worn, then finish its inside edge.':double
        ?`With the wrong side up, turn the raw edge ${first||'by the pattern’s first-turn width'} and press. Turn it again ${second||'by the pattern’s second-turn width'} so the raw edge stays inside. Press and clip at the seam matches first.`
        :'Copy the tested hem allowance from the pattern. Mark the final edge and turn or finish the allowance as the pattern directs.';
      return [
        point('Mark the final hem while worn',`Let the garment hang, fasten it and use the intended shoes where relevant. ${targetModel(pattern)==='trousers'?'Mark each leg separately from a level reference. Keep the inseam and outseam positions marked.':'Mark front, sides and back with chalk or clip markers. Follow any shaped hem points on the pattern.'} Take the garment off before tracing a continuous line.`),
        point('Press the chosen hem finish',fold),
        point('Stitch and inspect from both sides',`${normalSetup} Guide the fold or facing under the foot without pulling. Stitch near the inner fold as appropriate. Check every layer remains free at openings and the finished hem hangs as marked.`),
        ...(/buttonholes/i.test(text)?[point('Sample the buttonholes after the hem','With the garment fastened as planned, mark each matching center. On the CP2160F, fit buttonhole foot A and test the style from the stitch chart with the actual button and interfaced scraps. Cut open the test hole first, then transfer and sew the garment marks.')]:[])
      ];
    },
    press:()=>[
      point('Test the iron on a scrap','Use a scrap of the same layers to check for shine, marks and shrinkage. Use a press cloth when needed.'),
      point('Let the shape cool flat','Set the iron down and lift it at each section. Press the seam in the direction on the paper pattern. Let the fabric cool on a flat or curved pressing surface before lifting it.')
    ],
    topstitch:({allowances})=>[
      point('Mark the line on the outside',`${amount(allowances.topstitch)?`Use the recorded ${amount(allowances.topstitch)} edge distance.`:'Use the distance marked on the tested pattern.'} Baste the folded edge so its inside layer stays in position.`),
      point('Use the tested seam as your guide',`${normalSetup} Align the marked line under the needle and keep the adjacent edge parallel with the guide. Check the stitching catches the intended inside edge.`)
    ],
    button:({plan})=>[
      point('Transfer both sides of the opening',`${position(plan,'buttonSpacing','Use the recorded center spacing of')} Mark the buttonhole position and test the overlap on the wearer, then transfer marks to the opposite layer.`.trim()),
      point('Test with foot A and the actual button','Fit Brother CP2160F buttonhole foot A and select the buttonhole style from its stitch chart. Sew an interfaced scrap first. Open the test hole and pass the actual button through before sewing the garment.')
    ]
  };

  function step({pattern,order={},step='',id,measurements=pattern?.measurements}={}) {
    if (!pattern||pattern.external||tailoring(order,measurements)||/^Stitched detail |^Attachment seam |^Attachment ruffle /i.test(step)) return '';
    if (id==='sleeve'&&/\b(flutter|bishop|tapered)\b/i.test(step)) return '';
    const phase=phaseFor(id,step);
    if (!phase) return '';
    const values=bodyValues(pattern,measurements).filter(knownBody);
    const sleeveValues=phase==='sleeve'?chosenMeasurements(measurements,['Shoulder to wrist','Upper arm circumference']).filter(knownBody):[];
    const actions=recipes[phase]({pattern,plan:order.plan||{},allowances:order.allowances||{},text:step,values,sleeveValues});
    const items=actions.map(([name,text])=>`<li><strong>${escape(name)}</strong> ${escape(text)}</li>`).join('');
    return `<details class="wo-how wo-recipe-step" data-recipe-phase="${phase}" open><summary>How to do this step</summary><ol class="wo-recipe-actions">${items}</ol></details>`;
  }

  return {prepare,step};
})();
