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
    ['tapered-trousers','Full-Length Peg Trousers','trousers','Tapered','Full length','#50494d',null,null,'Medium-weight twill'],
    ["collection-1-1", "Poplin Shirt Dress", "dress", "A-line", "Midi", "#514944", "Crew", "Elbow", "Cotton poplin", "Front buttons", null, "Shirt dresses"],
    ["collection-2-1", "Wool Crepe Sheath", "dress", "Column", "Above knee", "#786958", "Square", "Short", "Wool crepe", null, null, "Fitted dresses"],
    ["collection-3-1", "Silk Column Gown", "dress", "Column", "Ankle", "#9d8876", "V-neck", "Sleeveless", "Silk charmeuse", null, null, "Evening dresses"],
    ["collection-4-1", "Lawn Garden Dress", "dress", "Full skirt", "Midi", "#504f48", "Square", "Puff", "Cotton lawn", null, null, "Full-skirt dresses"],
    ["collection-6-1", "Wool Crepe Midi", "dress", "A-line", "Midi", "#474147", "Boat", "Long", "Wool crepe", null, null, "Long-sleeve dresses"],
    ["collection-8-1", "Georgette Bell-Sleeve Blouse", "top", "Straight", "Low hip", "#786958", "Boat", "Bell", "Silk georgette", "Back button and loop", null, "Blouses"],
    ["collection-9-1", "Relaxed Oxford Shirt", "top", "Boxy", "Low hip", "#9d8876", "Crew", "Long", "Cotton oxford", "Front buttons", null, "Button-front shirts"],
    ["collection-10-1", "Eyelet Puff-Sleeve Crop", "top", "Fitted", "Cropped", "#504f48", "Square", "Puff", "Eyelet cotton", null, null, "Crop tops"],
    ["collection-11-1", "Linen Blend Tunic", "top", "Boxy", "Low hip", "#74626a", "Scoop", "Elbow", "Linen-viscose blend", "Back button and loop", null, "Shells & tunics"],
    ["collection-13-1", "Corduroy Straight Mini", "skirt", "Straight", "Above knee", "#514944", null, null, "Fine-wale corduroy", null, null, "Mini skirts"],
    ["collection-14-1", "Worsted Tailored Midi", "skirt", "Straight", "Midi", "#786958", null, null, "Wool worsted", null, null, "Tailored skirts"],
    ["collection-16-1", "Broadcloth Full Skirt", "skirt", "Full skirt", "Midi", "#504f48", null, null, "Cotton broadcloth", null, null, "Full skirts"],
    ["collection-19-1", "Rigid Denim Straight Pants", "trousers", "Straight", "Ankle", "#514944", null, null, "Rigid denim", null, null, "Denim & workwear"],
    ["collection-22-1", "Linen Suiting Bermudas", "trousers", "Straight", "Bermuda", "#504f48", null, null, "Cotton-linen suiting", null, null, "Shorts"],
    ["collection-23-1", "Gingham Pull-On Shorts", "trousers", "Wide leg", "Short", "#74626a", null, null, "Yarn-dyed gingham", "Elastic waistband", null, "Shorts"]
  ];

  const designs=entries.map(([id,name,model,cut,length,primary,neckline,sleeve,fabric,closure,pocket,category])=>{
    const design={...studioDesign.defaults(model),cut,length,primary,fabric};
    if (neckline) design.neckline=neckline;
    if (sleeve) design.sleeve=sleeve;
    if (closure) design.closure=closure;
    if (pocket) design.pocket=pocket;
    const style=studioDesign.make(design,name,sewingModels.defaults[0]);
    // A stock guide starts from the user's measurements, not the sample form.
    style.steps[0]=`Measure the wearer and choose a compatible ${studioDesign.silhouettes[model].label.toLowerCase()} block in their size. Trace the block and mark grainlines, matching points, and seam allowances. Use a test garment to establish the wearing ease before cutting the final fabric.`;
    return {...style,category,id:'catalog-'+id};
  });
  const sources=[
    ['albert','Albert Apron','Aprons & accessories','Bib apron with a front pocket','FreeSewing'],
    ['carlton','Carlton Coat','Outerwear','Long tailored coat','FreeSewing'],
    ['devon','Devon Denim Jacket','Outerwear','Button-front denim jacket','FreeSewing'],
    ['wahid','Wahid Waistcoat','Outerwear','Fitted, buttoned waistcoat','FreeSewing'],
    ['hugo','Hugo Hoodie','Knits & casualwear','Raglan-sleeve hoodie','FreeSewing'],
    ['sven','Sven Sweatshirt','Knits & casualwear','Sweatshirt with ribbed finishes','FreeSewing'],
    ['diana','Diana Draped Top','Tops','Asymmetric draped top','FreeSewing'],
    ['tamiko','Tamiko Zero-Waste Top','Tops','Zero-waste folded top','FreeSewing'],
    ['sandy','Sandy Circle Skirt','Skirts','Circular skirt','FreeSewing'],
    ['sunny','Sunny Split-Side Skirt','Skirts','Split-side skirt','FreeSewing'],
    ['waralee','Waralee Wrap Pants','Trousers','Tie-on wrap pants','FreeSewing'],
    ['opal','Opal Overalls','Jumpsuits & overalls','Bib overalls','FreeSewing'],
    ['otis','Otis Romper','Jumpsuits & overalls','One-piece romper','FreeSewing'],
    ['lily','Lily Leggings','Activewear & swim','Close-fitting stretch leggings','FreeSewing'],
    ['bee','Bee Bikini Top','Activewear & swim','Bikini top','FreeSewing'],
    ['onyx','Onyx One-Piece','Activewear & swim','One-piece swimsuit','FreeSewing'],
    ['bruce','Bruce Boxer Briefs','Intimates','Fitted knit boxer briefs','FreeSewing'],
    ['cathrin','Cathrin Corset','Intimates','Underbust corset','FreeSewing'],
    ['crux','Crux Climbing Pants','Activewear & swim','Climbing pants with articulated knees','FreeSewing'],
    ['florent','Florent Flat Cap','Aprons & accessories','Tailored flat cap with a brim','FreeSewing']
  ];
  const knitTryOns={
    hugo:{primary:'#62627e',accent:'#50506a',cut:'Straight',length:'Low hip',hood:true,raglan:true,kangaroo:true},
    sven:{primary:'#7c8373',accent:'#626d5a',cut:'Straight',length:'High hip'}
  };
  return [...designs,...sources.map(([id,name,type,cut,publisher])=>({
    id:'reference-'+id,name,type,cut,category:'Free publisher pattern',level:'Publisher guide',
    external:{publisher,url:'https://freesewing.eu/designs/'+id+'/',
      sewing:knitTryOns[id]?'https://freesewing.eu/docs/designs/'+id+'/instructions/':null,
      terms:'https://freesewing.eu/docs/about/faq/commercial-use/'},
    ...(knitTryOns[id]?{tryOn:true,model:'top',sleeves:true,color:knitTryOns[id].primary,
      design:{...studioDesign.defaults('top'),neckline:'Crew',sleeve:'Long',closure:'Pullover',ribbing:true,ease:12,
        fabric:'French terry',...knitTryOns[id]}}:{}),
    fabric:'Use the fabric type and yardage listed in the publisher’s guide.',
    tools:'Measuring tape, paper or printed pattern, fabric shears, pins or clips, matching thread, sewing machine and iron. Check the publisher’s list for garment-specific notions.',
    visuals:['measure','marks','cut','fit','finish'],
    steps:[
      'Open the publisher’s page and download or draft the pattern for the intended measurements.',
      'Read the publisher’s pattern-specific instructions. Verify the printed scale or trace the digital pattern, and mark your size, grainline and notches.',
      'Confirm yardage, fabric stretch, seam allowances and required notions using the publisher’s guide before cutting.',
      'Make a sample and check movement. Transfer any changes back to the pattern before cutting final fabric.',
      'Follow the publisher’s assembly order. Finish and inspect all seams, closures and hems.'
    ]
  }))];

})();
