'use strict';

const workDimensions=(()=>{
  const fieldGroups={
    'Front reference levels':[
      'frontShoulderToBust','bustToWaist','waistToHip','shoulderToUpperChest','upperChestToBust',
      'bustToUnderbust','underbustToWaist','waistToHighHip','highHipToHip'
    ],
    'Back reference levels':['backShoulderToChest','backShoulderToWaist'],
    'Lower-body reference levels':['waistToCrotch','crotchToFloor','waistToKnee','hipToKnee','crotchToKnee','kneeToCalf','calfToFloor'],
    'Finished skirt and trouser lengths':['waistToHem','hipToHem','kneeToHem','garmentInseam','finishedRise','backRise'],
    'Arm and sleeve lengths':['shoulderToElbow','elbowToWrist','shoulderToWrist','sleeveToCuff']
  };
  const definitions={
    frontShoulderToBust:{
      label:'Front shoulder to bust / chest',from:'Front high shoulder point',to:'Bust / chest level',
      anchors:['shoulder','bust'],sum:['shoulderToUpperChest','upperChestToBust'],
      method:'At the front, mark where the neck meets the shoulder and the level of the full bust or chest. Measure their straight vertical separation.'
    },
    shoulderToUpperChest:{
      label:'Front shoulder to upper chest',from:'Front high shoulder point',to:'Upper chest level',
      anchors:['shoulder','upperChest'],
      method:'Measure straight down from the front high shoulder point to the upper chest tape level.'
    },
    upperChestToBust:{
      label:'Upper chest to bust / chest',from:'Upper chest level',to:'Bust / chest level',anchors:['upperChest','bust'],
      method:'Mark both tape levels and measure the vertical gap between them at the front.'
    },
    bustToUnderbust:{
      label:'Bust / chest to underbust',from:'Bust / chest level',to:'Underbust level',anchors:['bust','underbust'],
      subtract:['bustHeight','underbustHeight'],
      method:'Take both heights straight up from the floor, then subtract the underbust height from the bust / chest height.'
    },
    underbustToWaist:{
      label:'Underbust to natural waist',from:'Underbust level',to:'Natural waist level',anchors:['underbust','waist'],
      subtract:['underbustHeight','waistToFloor'],
      method:'Take both heights straight up from the floor, then subtract waist height from underbust height.'
    },
    bustToWaist:{
      label:'Bust / chest to natural waist',from:'Bust / chest level',to:'Natural waist level',anchors:['bust','waist'],
      subtract:['bustHeight','waistToFloor'],sum:['bustToUnderbust','underbustToWaist'],
      method:'Hold both tape lines level. Measure their vertical gap or subtract the waist-to-floor height from the bust / chest-to-floor height.'
    },
    waistToHighHip:{
      label:'Natural waist to high hip',from:'Natural waist level',to:'High hip level',anchors:['waist','highHip'],
      direct:'waistToHighHip',method:'At the side, measure straight down from the natural waist to the high hip tape line.'
    },
    highHipToHip:{
      label:'High hip to full hip / seat',from:'High hip level',to:'Full hip / seat level',anchors:['highHip','hip'],
      subtract:['waistToHip','waistToHighHip'],
      method:'At the same side, measure the vertical gap between the high and full hip levels.'
    },
    waistToHip:{
      label:'Natural waist to full hip / seat',from:'Natural waist level',to:'Full hip / seat level',anchors:['waist','hip'],
      direct:'waistToHip',sum:['waistToHighHip','highHipToHip'],
      method:'At the side, measure straight down from the natural waist to the fullest part of the seat.'
    },
    backShoulderToChest:{
      label:'Back shoulder to chest level',from:'Back high shoulder point',to:'Chest tape level on back',anchors:['shoulder','bust'],
      method:'Transfer the full chest tape level around the back. Measure straight down from the back high shoulder point to that level.'
    },
    backShoulderToWaist:{
      label:'Back shoulder to natural waist',from:'Back neck-to-shoulder point',to:'Natural waist at back',anchors:['shoulder','waist'],
      direct:'shoulderToWaist',method:'At the back, measure from the neck-to-shoulder point down to the natural waist.'
    },
    waistToKnee:{
      label:'Natural waist to knee',from:'Natural waist level',to:'Kneecap center level',anchors:['waist','knee'],
      subtract:['waistToFloor','kneeHeight'],
      method:'Subtract kneecap-center height from waist height, both measured vertically from the floor.'
    },
    hipToKnee:{
      label:'Full hip / seat to knee',from:'Full hip / seat level',to:'Kneecap center level',anchors:['hip','knee'],
      subtract:['waistToFloor','waistToHip','kneeHeight'],
      method:'Measure vertically from the full hip tape line to the kneecap center. To calculate it, subtract waist-to-hip and kneecap-to-floor from waist-to-floor.'
    },
    waistToCrotch:{
      label:'Natural waist to crotch level (vertical)',from:'Natural waist level',to:'Body crotch level',anchors:['waist','crotch'],
      subtract:['waistToFloor','inseam'],
      method:'Stand barefoot. Subtract the straight crotch-to-floor height from the straight waist-to-floor height. Take the finished rise separately along the garment seam.'
    },
    crotchToFloor:{
      label:'Body crotch to floor (vertical)',from:'Body crotch level',to:'Floor',anchors:['crotch','floor'],
      direct:'inseam',method:'Stand barefoot and measure straight down from the crotch to the floor at the inside of the leg.'
    },
    crotchToKnee:{
      label:'Body crotch to knee level',from:'Body crotch level',to:'Kneecap center level',anchors:['crotch','knee'],
      subtract:['inseam','kneeHeight'],method:'Subtract the measured kneecap height from the straight crotch-to-floor height.'
    },
    kneeToCalf:{
      label:'Knee to fullest calf',from:'Kneecap center level',to:'Fullest calf level',anchors:['knee','calf'],
      subtract:['kneeHeight','calfHeight'],method:'Subtract the measured fullest-calf height from the measured kneecap-center height.'
    },
    calfToFloor:{
      label:'Fullest calf to floor',from:'Fullest calf level',to:'Floor',anchors:['calf','floor'],
      direct:'calfHeight',method:'Stand barefoot and measure vertically from the floor to the fullest calf tape line.'
    },
    waistToHem:{
      label:'Natural waist to finished hem at side',from:'Natural waist at side',to:'Finished hem at the same side',
      method:'Mark the finished edge on the fitted garment and measure to it from the waist at the same side. Use the local drop when hems are uneven.'
    },
    hipToHem:{
      label:'Full hip to finished hem at side',from:'Full hip level at side',to:'Finished hem at the same side',
      method:'Measure down from the full hip level to the finished hem at the same side of the fitted sample.'
    },
    kneeToHem:{
      label:'Knee to finished hem below knee',from:'Kneecap center level',to:'Finished hem below the knee',
      method:'Mark the knee level and measure down the same side to the finished hem. Record this for garments with a hem below the knee.'
    },
    garmentInseam:{
      label:'Garment inseam to finished hem',from:'Garment crotch seam junction',to:'Finished leg hem along inseam',
      method:'Follow the inside-leg stitch line from the garment crotch seam junction to the finished hem. Check each leg separately if the lengths differ.'
    },
    finishedRise:{
      label:'Finished front rise along seam',from:'Finished waistband at center front',to:'Garment crotch seam junction',
      method:'On the fitted trousers, place a flexible tape at the finished waist edge at center front. Follow the curved front rise seam to the crotch seam junction.'
    },
    backRise:{
      label:'Finished back rise along seam',from:'Finished waistband at center back',to:'Garment crotch seam junction',
      method:'On the fitted trousers, follow the curved back rise seam from the finished waist edge at center back to the crotch seam junction.'
    },
    shoulderToElbow:{
      label:'Outer shoulder to elbow',from:'Outer shoulder point',to:'Elbow point',direct:'shoulderToElbow',arm:'shoulderToElbow',
      method:'Follow the arm from the outer shoulder to the elbow point with the elbow slightly bent.'
    },
    elbowToWrist:{
      label:'Elbow to wrist',from:'Elbow point',to:'Wrist bone',subtract:['arm','shoulderToElbow'],arm:['arm','shoulderToElbow'],
      method:'Measure from elbow to wrist bone, or subtract shoulder-to-elbow from shoulder-to-wrist with the arm held in the same position.'
    },
    shoulderToWrist:{
      label:'Outer shoulder to wrist',from:'Outer shoulder point',to:'Wrist bone',direct:'arm',arm:'arm',
      method:'Follow the arm from the outer shoulder to the wrist bone, with the elbow slightly bent.'
    },
    sleeveToCuff:{
      label:'Sleeve from shoulder seam to finished cuff',from:'Sleeve at shoulder seam',to:'Finished cuff edge',
      method:'Measure down the sleeve from the shoulder seam to its finished edge on the fitted garment. Mark the cuff finish separately.'
    },
    pocketDown:{
      label:'Pocket drop',from:'Specified pocket reference',to:'Pocket top edge',plan:true,
      method:'Measure down from the marked reference line to the pocket top. Use the reference named in the cutting plan.'
    },
    pocketAcross:{
      label:'Pocket distance from center front',from:'Center front',to:'Pocket inner edge',plan:true,
      method:'Measure horizontally from center front to the marked inner pocket edge.'
    },
    zipperOpening:{
      label:'Zipper opening length',from:'Top of zipper opening',to:'Bottom of zipper opening',plan:true,
      method:'Measure along the intended opening from its upper mark to its lower mark.'
    },
    strapLength:{
      label:'Finished strap length',from:'Front strap attachment',to:'Back strap attachment',plan:true,
      method:'Measure along the finished strap path between the fittings or attachment marks.'
    },
    casingWidth:{
      label:'Finished elastic casing depth',from:'Finished casing edge',to:'Casing stitch line',plan:true,
      method:'Measure across the finished casing from the folded edge to the stitching.'
    }
  };
  const fields=Object.fromEntries(Object.values(fieldGroups).flat().map(key=>[key,definitions[key].label]));
  const descriptions=Object.fromEntries(Object.keys(fields).map(key=>[key,definitions[key].method]));
  const sectionKeys={
    front:['frontShoulderToBust','bustToWaist','waistToHip'],
    back:['backShoulderToChest','bustToWaist','waistToHip','backShoulderToWaist'],
    lower:['waistToHighHip','waistToHip','waistToKnee','hipToKnee','waistToCrotch','crotchToKnee','kneeToCalf','calfToFloor','crotchToFloor',
      'waistToHem','hipToHem','kneeToHem'],
    trousers:['garmentInseam','finishedRise','backRise'],
    sleeve:['shoulderToElbow','elbowToWrist','shoulderToWrist','sleeveToCuff'],
    features:['pocketDown','pocketAcross','zipperOpening','strapLength','casingWidth']
  };
  const positive=value=>Number.isFinite(value)&&value>0?value:null;
  const difference=(above,...below)=>positive(above)!==null && below.every(value=>Number.isFinite(value)&&value>=0)?
    positive(above-below.reduce((sum,value)=>sum+value,0)):null;
  function sheetLength(raw) {
    const match=typeof raw==='string' && raw.trim().match(/^(\d+(?:\.\d+)?)\s*(cm|in)$/i);
    return match?positive(Number(match[1])*(match[2].toLowerCase()==='in'?2.54:1)):null;
  }
  function modelValues(measurements,body) {
    const labels=new Map((measurements?.rows||[]).filter(Array.isArray).map(row=>[row[0],row.at(-1)]));
    const lengths=Object.entries(sewingModels.dimensions).flatMap(([key,[label]])=>{
      const cm=positive(body?.[key])??sheetLength(labels.get(label));
      return cm===null?[]:[[key,cm]];
    });
    return Object.fromEntries(lengths);
  }
  function resolve({plan={},measurements,body}={}) {
    plan??={};
    const fitted=plan.landmarkDistances||{};
    const model=modelValues(measurements,body);
    const hasProfile=Object.hasOwn(sewingModels.profiles,body?.profile);
    const geometry=(hasProfile || positive(model.height)!==null)?
      sewingModels.proportions({profile:body?.profile,...model}):null;
    const rows=Object.fromEntries(Object.entries(definitions).map(([key,definition])=>{
      const {label,from,to,method,direct,subtract,anchors,arm,sum}=definition;
      let cm=positive(definition.plan?plan[key]:fitted[key]);
      let source=definition.plan?'plan':'sample';
      if (cm===null && sum && sum.every(field=>positive(fitted[field])!==null)) {
        cm=sum.reduce((length,field)=>length+fitted[field],0);
        source='derived';
      }
      if (cm===null && direct) {
        cm=positive(model[direct]);
        source='model';
      }
      if (cm===null && subtract) {
        cm=difference(...subtract.map(field=>model[field]));
        source='derived';
      }
      if (cm===null && geometry) {
        if (anchors) cm=difference(geometry.landmarks[anchors[0]],geometry.landmarks[anchors[1]]);
        if (Array.isArray(arm)) cm=difference(geometry.estimates[arm[0]],geometry.estimates[arm[1]]);
        else if (arm) cm=positive(geometry.estimates[arm]);
        source='estimate';
      }
      const instructions=source==='estimate' && cm!==null?
        `${arm?'Estimated arm length from the reference model.':'Estimated vertical separation on the reference model.'} ${method}`:method;
      return [key,{key,label,from,to,cm,source:cm===null?'missing':source,method:instructions}];
    }));
    const sections=Object.fromEntries(Object.entries(sectionKeys).map(([name,keys])=>[
      name,keys.map(key=>rows[key]).filter(row=>name!=='features' || row.cm!==null)
    ]));
    return {rows,sections};
  }
  function value(row) {
    if (positive(row?.cm)===null) return 'Measure on fitted sample';
    const estimate=row.source==='estimate';
    return `${estimate?'Est. ':''}${Number(row.cm.toFixed(estimate?1:3))} cm`;
  }
  return {fields,fieldGroups,descriptions,resolve,value};
})();
