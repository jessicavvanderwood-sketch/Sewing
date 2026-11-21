'use strict';

const starterCatalog = (() => {
  const entries = [
    ['column-midi','Column Midi Dress','dress','Column','Midi','#282522','Crew','Sleeveless','Medium-weight twill'],
    ['scoop-day','Scoop-Neck Day Dress','dress','A-line','Above knee','#786a60','Scoop','Short','Cotton poplin'],
    ['vneck-midi','V-Neck Midi Dress','dress','A-line','Midi','#4f4342','V-neck','Elbow','Fluid woven crepe'],
    ['square-maxi','Square-Neck Maxi Dress','dress','Full skirt','Ankle','#766153','Square','Puff','Linen blend'],
    ['boat-column','Boatneck Column Dress','dress','Column','Ankle','#383d3c','Boat','Long','Fluid woven crepe'],
    ['bell-dress','Bell-Sleeve Mini Dress','dress','A-line','Above knee','#684c4b','V-neck','Bell','Fluid woven crepe'],
    ['scoop-tank','Fitted Scoop Tank','top','Fitted','High hip','#817163','Scoop','Sleeveless','Cotton poplin'],
    ['square-crop','Square-Neck Crop Top','top','Fitted','Cropped','#6f685b','Square','Sleeveless','Medium-weight twill'],
    ['box-shirt','Boxy Button-Front Shirt','top','Boxy','High hip','#b79378','Crew','Short','Cotton poplin','Front buttons','Patch pockets'],
    ['long-blouse','Long-Sleeve V-Neck Blouse','top','Straight','Low hip','#5f4d44','V-neck','Long','Fluid woven crepe'],
    ['boat-tee','Boatneck Shell Tee','top','Straight','High hip','#a0816e','Boat','Elbow','Linen blend'],
    ['puff-blouse','Puff-Sleeve Blouse','top','Fitted','High hip','#77685b','Square','Puff','Cotton poplin'],
    ['bell-top','Bell-Sleeve Evening Top','top','Straight','Low hip','#3f3837','V-neck','Bell','Fluid woven crepe'],
    ['straight-skirt','Straight Midi Skirt','skirt','Straight','Midi','#49443e',null,null,'Medium-weight twill'],
    ['a-line-mini','A-Line Mini Skirt','skirt','A-line','Above knee','#695c52',null,null,'Medium-weight twill',null,'Patch pockets'],
    ['full-midi','Full Midi Skirt','skirt','Full skirt','Midi','#827062',null,null,'Linen blend','Elastic waistband','In-seam pockets'],
    ['maxi-skirt','Long Column Skirt','skirt','Straight','Ankle','#46444c',null,null,'Fluid woven crepe'],
    ['cropped-pants','Cropped Tapered Pants','trousers','Tapered','Cropped','#585450',null,null,'Medium-weight twill'],
    ['ankle-pants','Straight Ankle Pants','trousers','Straight','Ankle','#6b665a',null,null,'Linen blend','Elastic waistband'],
    ['wide-trousers','Wide-Leg Trousers','trousers','Wide leg','Full length','#48413d',null,null,'Medium-weight twill',null,'In-seam pockets'],
    ['linen-pants','Wide-Leg Linen Pull-Ons','trousers','Wide leg','Ankle','#927c68',null,null,'Linen blend','Elastic waistband','In-seam pockets'],
    ['tapered-trousers','Full-Length Peg Trousers','trousers','Tapered','Full length','#50494d',null,null,'Medium-weight twill']
  ];

  return entries.map(([id,name,model,cut,length,primary,neckline,sleeve,fabric,closure,pocket])=>{
    const design={...studioDesign.defaults(model),cut,length,primary,fabric};
    if (neckline) design.neckline=neckline;
    if (sleeve) design.sleeve=sleeve;
    if (closure) design.closure=closure;
    if (pocket) design.pocket=pocket;
    const style=studioDesign.make(design,name,sewingModels.defaults[0]);
    // A stock guide starts from the user's measurements, not the sample form.
    style.steps[0]=`Measure the wearer and choose a compatible ${studioDesign.silhouettes[model].label.toLowerCase()} block in their size. Trace the block and mark grainlines, matching points, and seam allowances. Use a test garment to establish the wearing ease before cutting the final fabric.`;
    return {...style,id:'catalog-'+id};
  });
})();
