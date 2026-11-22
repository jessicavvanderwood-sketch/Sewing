'use strict';

const garmentFit = (() => {
  const fields = {
    waist:['Waist circumference',12,'Tighter','Looser'],
    hip:['Hip / seat circumference',12,'Tighter','Looser'],
    upperHip:['Upper hip circumference',18,'Tighter','Looser'],
    seatDepth:['Back seat depth',12,'Less room','More room'],
    lapEase:['Lap circumference',28,'Narrower','Wider'],
    kneeEase:['Skirt circumference at the knees',36,'Narrower','Wider'],
    sittingLength:['Center-back sitting length',14,'Shorter','Longer'],
    bust:['Chest / bust circumference',12,'Tighter','Looser'],
    length:['Hem length',15,'Shorter','Longer'],
    shoulder:['Shoulder span',6,'Narrower','Wider'],
    armhole:['Armhole depth',4,'Higher','Lower'],
    neckDepth:['Front neckline depth',16,'Higher','Lower'],
    neckWidth:['Neckline width',12,'Narrower','Wider'],
    sleeveWidth:['Upper sleeve circumference',8,'Tighter','Looser'],
    sleeveLength:['Sleeve length',12,'Shorter','Longer'],
    cuff:['Cuff / sleeve opening',8,'Tighter','Looser'],
    thigh:['Thigh circumference',18,'Tighter','Looser'],
    leg:['Leg opening circumference',12,'Tighter','Looser'],
    backNeck:['Back neckline depth',12,'Higher','Lower'],
    shoulderSlope:['Shoulder slope',4,'Squarer','More sloped'],
    waistHeight:['Waistline position',7,'Lower','Higher'],
    sweep:['Hem sweep circumference',30,'Narrower','Wider'],
    backRise:['Extra back rise length',10,'Shorter','Longer'],
    crotch:['Crotch extension',8,'Shallower','Deeper'],
    kneeFlex:['Extra length over bent knee',8,'Less','More'],
    knee:['Knee circumference',16,'Narrower','Wider'],
    sleeveCap:['Sleeve cap fullness',8,'Less fullness','More fullness'],
    rise:['Rise length',6,'Shorter','Longer']
  };

  function keys(model,sleeves) {
    if (model==='trousers') return ['waist','hip','rise','backRise','crotch','thigh','knee','kneeFlex','leg','length'];
    const skirtFit=['upperHip','seatDepth','lapEase','kneeEase','sittingLength'];
    if (model==='skirt') return ['waist','hip',...skirtFit,'waistHeight','sweep','length'];
    return ['waist','hip',...(model==='dress'?skirtFit:[]),'bust','shoulder','shoulderSlope','armhole','neckDepth','neckWidth','backNeck','waistHeight',
      ...(sleeves ? ['sleeveWidth','sleeveCap','sleeveLength','cuff'] : []),'sweep','length'];
  }

  const seatedKeys=['upperHip','seatDepth','lapEase','kneeEase','sittingLength'];
  function seatedRegions(model) {
    if (model==='trousers') return {waist:['waist'],hip:['hip'],thigh:['thigh'],knee:['knee','kneeFlex'],
      leg:['leg'],rise:['rise'],backRise:['backRise'],crotch:['crotch']};
    if (model==='dress' || model==='skirt') return {waist:['waist'],upperHip:['upperHip'],hip:['hip'],seat:['seatDepth'],
      lap:['lapEase'],skirtKnee:['kneeEase'],sittingLength:['sittingLength']};
    return {};
  }

  function easeControls(model) {
    const seated=seatedRegions(model);
    if (model!=='dress' && model!=='top') return seated;
    return {
      bust:['bust'],shoulder:['shoulder','sleeveCap'],armhole:['armhole','sleeveWidth','sleeveCap','shoulder'],
      sleeve:['sleeveWidth','sleeveCap','sleeveLength'],cuff:['cuff','sleeveLength'],
      waist:['waist'],hip:['hip'],...seated
    };
  }

  function solveEase(pattern,model,body,draft,adjustments,material,poses,controls) {
    const result={...draft};
    let total={...adjustments};
    const requested=[].concat(poses||fabricFit.poses.sit).filter(Boolean);
    const samples=new Map();
    for (const frame of requested.length?requested:[fabricFit.poses.sit]) {
      const pose={...fabricFit.poses.stand,...frame,stride:Math.abs(frame.stride||0)};
      samples.set([pose.sit,pose.arm,pose.reach,pose.stride].join(','),pose);
    }
    const samplePoses=[...samples.values()];
    const sitting=samplePoses.every(pose=>pose.sit>.92);
    const seated=seatedRegions(model);
    const targetLoad=level=>-Math.log1p(-level)/.85;
    const threshold=targetLoad(.24);
    function tolerance(region) {
      if (!sitting || !Object.hasOwn(seated,region)) return threshold;
      if (model!=='trousers') return targetLoad(.01);
      return region==='knee'?0:threshold;
    }
    const targets=Object.fromEntries(Object.keys(controls).map(region=>[region,tolerance(region)]));
    const estimate=changes=>samplePoses.map(pose=>fabricFit.estimate(pattern,model,body,changes,pose,material));
    const significant=1e-7;
    function restriction(fits) {
      const excess={};
      for (const [region,target] of Object.entries(targets)) {
        excess[region]=Math.max(0,...fits.map(fit=>(fit[region]?.load||0)-target));
      }
      return {excess,penalty:Object.values(excess).reduce((sum,load)=>sum+Math.log1p(load),0)};
    }
    let before=estimate(total);
    let current=restriction(before);
    while (current.penalty>significant) {
      const candidates=new Set(Object.keys(current.excess).filter(region=>current.excess[region]>significant)
        .flatMap(region=>controls[region]));
      let best;
      for (const key of candidates) {
        if (!Object.hasOwn(result,key) || !Number.isFinite(result[key])) continue;
        const limit=fields[key][1];
        for (const direction of key==='armhole'?[1,-1]:[1]) {
          const value=fabricFit.clamp(result[key]+.5*direction,-limit,limit);
          if (value===result[key]) continue;
          const trial={...total,[key]:(total[key]||0)+value-result[key]};
          const after=estimate(trial);
          const stats=restriction(after);
          const improvement=current.penalty-stats.penalty;
          if (improvement<=(best?.improvement||0)+significant) continue;
          // Leave already restricted regions at least as comfortable in
          // every sampled pose, including motion in the opposite direction.
          const worsens=after.some((fit,index)=>Object.entries(fit).some(([region,data])=>
            data.load>(targets[region]??threshold)+significant && data.load>(before[index][region]?.load||0)+significant));
          if (!worsens) best={key,value,trial,after,stats,improvement};
        }
      }
      if (!best) break;
      result[best.key]=best.value;
      total=best.trial;
      before=best.after;
      current=best.stats;
    }
    return result;
  }

  function suggestEase(pattern,model,body,draft,adjustments,material,poses) {
    return solveEase(pattern,model,body,draft,adjustments,material,poses,easeControls(model));
  }

  function directions(key,delta) {
    const n = Math.abs(delta);
    const label = fields[key][0].toLowerCase();
    const smaller = delta < 0;
    if (['upperHip','lapEase','kneeEase'].includes(key)) {
      const band=key==='upperHip'?'upper-hip tape line':key==='lapEase'?'lap line across both thighs':'line across both knees';
      return [key,`${smaller?'Take out':'Add'} ${n} cm at the ${band} around the entire garment. Mark the level on the toile while seated, then carry the marks to the front and back patterns. If the two side seams share the change equally, mark ${n/4} cm ${smaller?'inside':'outside'} the old stitch line on each of the four panel edges. Blend the change into the adjacent levels. Check seated movement and walking before transferring the new stitch line and restoring the seam allowance.`];
    }
    if (key==='seatDepth') return [key,`${smaller?'Take out':'Add'} ${n} cm of room at the fullest seat measured on the side-view profile. Mark the seat level from waist to hip and compare the back profile with the toile held at that level. Shape the back panel or princess seams and blend toward the side seams. Pin or baste a mock-up first. Check the waist, back closure and hem after sitting.`];
    if (key==='sittingLength') return [key,`${smaller?'Remove':'Add'} ${n} cm of vertical length at center back above the seat. Draw a horizontal adjustment line from center back to the side seam. ${smaller?'Overlap':'Spread'} the paper at center back, taper to zero at the side seam, then redraw the center-back seam and check the closure length. Baste the toile, sit down and recheck the balance of the hem before cutting.`];
    if (key==='waistHeight') return ['band',`Mark the new waist line ${n} cm ${smaller?'below':'above'} the old line at center front and back. On the toile, level the line at the sides, move the seam or shaping to that height, then adjust adjacent bodice and skirt lengths and recheck the closure.`];
    if (key==='sweep') return [smaller?'take':'let',`Change the finished hem circumference by ${n} cm total. Spread the adjustment equally between corresponding panels, blending to zero above the hem. For a wider sweep, slash and spread the paper pattern or add matching godets to an existing garment. True the new hem before cutting.`];
    if (key==='shoulderSlope') return ['shoulder',`Move the outer shoulder ${n} cm ${smaller?'up':'down'} while holding the neckline point fixed. Redraw and match the front and back shoulder seams, then true the armhole and test the sleeve cap.`];
    if (key==='sleeveCap') return ['sleeve',`${smaller?'Remove':'Add'} ${n} cm of fullness at each sleeve cap on the paper pattern. Keep underarm and notch positions aligned. Distribute any excess as ease or gathers and baste the sleeve to test arm movement.`];
    if (key==='bust') return smaller
      ? ['take',`Pin out ${n} cm total at the chest or bust. Share the change across the two side seams where possible, then check that the bust point and armhole remain in place. If the side seam distorts, refit the darts or princess seams on a toile.`]
      : ['let',`Add ${n} cm total through the chest or bust. Check spare side-seam allowance first. For more room or bust length, test a bust adjustment on the pattern or use matching panels on the finished garment.`];
    if (key==='sleeveWidth'||key==='cuff') return ['sleeve',`Change the ${label} by ${n} cm on each sleeve. At a single underarm seam, move the line ${n/2} cm on each layer ${smaller?'toward the sleeve body':'toward the raw edges, keeping enough allowance to finish the seam'}. Blend into the armhole or cuff and baste both sleeves. If there’s a separate cuff, resize or replace it to fit the new opening.`];
    if (key==='sleeveLength') return ['sleeve',`Mark a new sleeve finish ${n} cm ${smaller?'above':'below'} the old one on both sleeves. Measure with the elbow bent. ${smaller?'Keep a hem allowance before cutting.':'Check the released hem for enough fabric. Add a cuff or extension if needed.'} Remove and reattach any separate cuff before the final press.`];
    if (key==='shoulder') return ['shoulder',`Mark a shoulder point ${n/2} cm ${smaller?'inward':'outward'} on each side. Detach the sleeve if present and check the new armhole curve on a toile. Match the sleeve cap to that curve. ${smaller?'Baste and test arm movement before trimming.':'Check available fabric at the shoulder edge. Use a matching extension or recut the bodice if necessary.'}`];
    if (key==='armhole') return ['armhole',`Mark the underarm point ${n} cm ${smaller?'higher':'lower'} and blend the curve into the original front and back armhole. ${smaller?'A higher opening may need an underarm gusset or a recut panel.':'A lower opening removes fabric. Baste a toile and check coverage before cutting.'} Refit the sleeve cap or finish the sleeveless edge after testing arm movement.`];
    if (key==='neckDepth'||key==='neckWidth'||key==='backNeck') {
      const depth = key!=='neckWidth';
      const site = depth ? (key==='backNeck'?'center-back neckline':'center-front neckline') : 'two neck-to-shoulder points';
      const move = depth ? (smaller?'up':'down') : (smaller?'inward':'outward');
      return [smaller?'neckFill':'neck',`Mark the ${site} ${move} by ${depth?n:n/2} cm${depth?'':' per side'}. Blend a smooth curve and check that the head fits through the opening or the closure still works. ${smaller?'Use a matching inset, wider binding or a recut panel where fabric is missing.':'Staystitch the new curve and mark the sewing allowance before trimming.'} Resize the collar, facing or binding to match.`];
    }
    if (key==='backRise') return ['rise',`${smaller?'Remove':'Add'} ${n} cm at center back above the seat. Slash and pivot the back pattern so the adjustment tapers to zero at the side seam. True the center-back seam, check the waistband and test the new length while sitting.`];
    if (key==='crotch') return ['rise',`${smaller?'Reduce':'Extend'} the front-to-back crotch allowance by ${n} cm total on the test pattern. Fit the front and back separately before splitting that amount. Blend into the inseam, match the seam lengths and sit and walk in the toile before cutting. A finished garment may need a gusset if the seam allowance is insufficient.`];
    if (key==='kneeFlex') return ['taper',`${smaller?'Remove':'Add'} ${n} cm over the front of each knee on the test pattern. Mark the knee level while seated, distribute the change with a shaped panel or knee darts, and true the adjoining seams. Check standing leg length and seated movement before cutting.`];
    if (key==='rise') return ['rise',`Change the waistband-to-crotch length by ${n} cm. Pin-test while standing and sitting. ${smaller?'Try lowering the waistband on a toile and check how it affects the fly, pockets and waist circumference.':'Check whether the waistband can be raised or extended. Substantial increases may require a recut or an insert.'} Preserve crotch shape and stride room before altering the finished pants.`];
    return ['taper',`Change the ${label} by ${n} cm on each leg. If inseam and outseam share the change equally, move each seam line ${n/4} cm on both layers ${smaller?'toward the leg body':'toward the raw edge'}. Blend into the unchanged leg, preserve the grainline, and baste both legs. Check sitting room and that the foot passes through the finished opening.`];
  }

  return {fields,keys,seatedKeys,suggestEase,directions};
})();
