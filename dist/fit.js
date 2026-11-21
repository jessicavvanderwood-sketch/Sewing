'use strict';

const garmentFit = (() => {
  const fields = {
    waist:['Waist circumference',12,'Tighter','Looser'],
    hip:['Hip / seat circumference',12,'Tighter','Looser'],
    bust:['Chest / bust circumference',12,'Tighter','Looser'],
    length:['Hem length',15,'Shorter','Longer'],
    shoulder:['Shoulder span',6,'Narrower','Wider'],
    armhole:['Armhole depth',4,'Higher','Lower'],
    neckDepth:['Front neckline depth',8,'Higher','Lower'],
    neckWidth:['Neckline width',6,'Narrower','Wider'],
    sleeveWidth:['Upper sleeve circumference',8,'Tighter','Looser'],
    sleeveLength:['Sleeve length',12,'Shorter','Longer'],
    cuff:['Cuff / sleeve opening',8,'Tighter','Looser'],
    thigh:['Thigh circumference',10,'Tighter','Looser'],
    leg:['Leg opening circumference',12,'Tighter','Looser'],
    rise:['Rise length',6,'Shorter','Longer']
  };

  function keys(model,sleeves) {
    if (model==='trousers') return ['waist','hip','thigh','leg','rise','length'];
    if (model==='skirt') return ['waist','hip','length'];
    return ['waist','hip','bust','shoulder','armhole','neckDepth','neckWidth',
      ...(sleeves ? ['sleeveWidth','sleeveLength','cuff'] : []),'length'];
  }

  function directions(key,delta) {
    const n = Math.abs(delta);
    const label = fields[key][0].toLowerCase();
    const smaller = delta < 0;
    if (key==='bust') return smaller
      ? ['take',`Pin out ${n} cm total at the chest or bust. Share the change across the two side seams where possible, then check that the bust point and armhole remain in place. If the side seam distorts, refit the darts or princess seams on a toile.`]
      : ['let',`Add ${n} cm total through the chest or bust. Check spare side-seam allowance first. For more room or bust length, test a bust adjustment on the pattern or use matching panels on the finished garment.`];
    if (key==='sleeveWidth'||key==='cuff') return ['sleeve',`Change the ${label} by ${n} cm on each sleeve. At a single underarm seam, move the line ${n/2} cm on each layer ${smaller?'toward the sleeve body':'toward the raw edges, keeping enough allowance to finish the seam'}. Blend into the armhole or cuff and baste both sleeves. If there’s a separate cuff, resize or replace it to fit the new opening.`];
    if (key==='sleeveLength') return ['sleeve',`Mark a new sleeve finish ${n} cm ${smaller?'above':'below'} the old one on both sleeves. Measure with the elbow bent. ${smaller?'Keep a hem allowance before cutting.':'Check the released hem for enough fabric. Add a cuff or extension if needed.'} Remove and reattach any separate cuff before the final press.`];
    if (key==='shoulder') return ['shoulder',`Mark a shoulder point ${n/2} cm ${smaller?'inward':'outward'} on each side. Detach the sleeve if present and check the new armhole curve on a toile. Match the sleeve cap to that curve. ${smaller?'Baste and test arm movement before trimming.':'Check available fabric at the shoulder edge. Use a matching extension or recut the bodice if necessary.'}`];
    if (key==='armhole') return ['armhole',`Mark the underarm point ${n} cm ${smaller?'higher':'lower'} and blend the curve into the original front and back armhole. ${smaller?'A higher opening may need an underarm gusset or a recut panel.':'A lower opening removes fabric. Baste a toile and check coverage before cutting.'} Refit the sleeve cap or finish the sleeveless edge after testing arm movement.`];
    if (key==='neckDepth'||key==='neckWidth') {
      const depth = key==='neckDepth';
      const site = depth ? 'center-front neckline' : 'two neck-to-shoulder points';
      const move = depth ? (smaller?'up':'down') : (smaller?'inward':'outward');
      return [smaller?'neckFill':'neck',`Mark the ${site} ${move} by ${depth?n:n/2} cm${depth?'':' per side'}. Blend a smooth curve and check that the head fits through the opening or the closure still works. ${smaller?'Use a matching inset, wider binding or a recut panel where fabric is missing.':'Staystitch the new curve and mark the sewing allowance before trimming.'} Resize the collar, facing or binding to match.`];
    }
    if (key==='rise') return ['rise',`Change the waistband-to-crotch length by ${n} cm. Pin-test while standing and sitting. ${smaller?'Try lowering the waistband on a toile and check how it affects the fly, pockets and waist circumference.':'Check whether the waistband can be raised or extended. Substantial increases may require a recut or an insert.'} Preserve crotch shape and stride room before altering the finished pants.`];
    return ['taper',`Change the ${label} by ${n} cm on each leg. If inseam and outseam share the change equally, move each seam line ${n/4} cm on both layers ${smaller?'toward the leg body':'toward the raw edge'}. Blend into the unchanged leg, preserve the grainline, and baste both legs. Check sitting room and that the foot passes through the finished opening.`];
  }

  return {fields,keys,directions};
})();
