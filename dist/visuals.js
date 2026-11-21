'use strict';

// Solid outlines show fabric edges, dashed lines show stitching or proposed marks.
const sewingVisuals = (() => {
  const panel = 'M72 37 L198 37 213 117 57 117 Z';
  const bodice = 'M82 34 L107 23 Q135 66 163 23 L188 34 Q188 64 206 73 L195 117 H75 L64 73 Q82 64 82 34Z';
  const pants = 'M76 26 H194 L209 118 H153 L135 61 L117 118 H61Z';
  const square = 'M82 23 H188 V123 H82Z';
  const fabric = d => '<path class="fabric-shape" d="'+d+'"/>';
  const outline = d => '<path class="outline-shape" d="'+d+'"/>';
  const stitch = d => '<path class="stitch-line" d="'+d+'"/>';
  const accent = d => '<path class="accent-line" d="'+d+'"/>';
  const thread = d => '<path class="thread-line" d="'+d+'"/>';
  const label = (x,y,value) => '<text x="'+x+'" y="'+y+'">'+value+'</text>';
  const needle = '<path class="outline-shape" d="M137 21 V75 L134 91 L131 75 V21Z"/><circle cx="134" cy="74" r="2" class="needle-eye"/>';
  const bobbin = '<ellipse cx="133" cy="83" rx="34" ry="10" class="fabric-shape"/><path class="fabric-shape" d="M99 64 V83 Q133 102 167 83 V64Z"/><ellipse cx="133" cy="64" rx="34" ry="11" class="fabric-shape"/><ellipse cx="133" cy="64" rx="8" ry="4" class="outline-shape"/>';
  const machine = '<path class="fabric-shape" d="M49 112 H224 V97 H211 V39 Q211 27 196 27 H75 Q61 27 61 42 V67 H107 V52 H161 V96 H49Z"/><rect x="169" y="35" width="31" height="22" rx="2" class="screen-shape"/>';
  const iron = '<path class="fabric-shape" d="M79 91 Q88 62 114 62 H160 L179 91Z"/><path class="outline-shape" d="M108 62 L115 49 H151 L159 62 M77 93 H182"/>';
  const diagrams = {
    needle: ['Needle setup', needle+accent('M155 84 V42 M150 48 L155 42 160 48')+label(35,66,'Flat side faces back')+label(167,49,'Push up')],
    bobbin: ['Load the top-drop bobbin', outline('M87 40 H177 V97 H87Z')+bobbin+thread('M167 74 L181 89 207 89')+label(150,110,'Follow slot to cutter')],
    upper: ['Upper thread route', machine+thread('M92 20 H143 V62 H119 V44 H99 V70 H91 V98')+label(91,16,'Spool')+label(148,77,'Take-up lever')+label(60,126,'Needle eye · front to back')],
    screen: ['LCD settings for a straight seam', machine+label(174,50,'01')+label(122,129,'Foot J · 2.5 mm stitch length')],
    sew: ['Guide a straight stitch', fabric('M76 76 H177 V120 H76Z')+needle+outline('M119 79 H150 V87 H119Z')+stitch('M134 91 V119')+accent('M158 89 V111')+label(166,107,'Seam guide')+label(18,116,'Fabric layers')],
    check: ['Check both sides of a test seam', fabric('M49 37 H118 V100 H49Z M151 37 H220 V100 H151Z')+stitch('M61 67 H106 M163 67 H208')+label(53,121,'Top side')+label(155,121,'Underside')],
    press: ['Press on a flat surface', fabric('M45 86 H220 V112 H45Z')+iron+label(35,130,'Lift and set down the iron')],
    grain: ['Align the pattern grainline', fabric('M53 24 H213 V116 H53Z')+outline('M62 24 V116 M101 33 L174 35 183 100 96 103Z')+accent('M135 50 V91 M131 56 L135 50 139 56 M131 85 L135 91 139 85')+stitch('M63 51 H134 M63 90 H134')+label(10,24,'Selvage')+label(139,78,'Grainline')+label(72,130,'Match the two distances')],
    cut: ['Cut along the outside line', fabric(panel)+stitch('M82 46 H188 L202 106 H68Z')+accent('M203 49 L225 43 M203 49 L224 61')+label(147,130,'Solid line = cut')+label(93,73,'Seam allowance')],
    marks: ['Transfer matching marks', fabric(panel)+accent('M72 57 L83 64 M198 57 L187 64 M133 37 V47')+label(21,68,'Notch')+label(169,25,'Center mark')],
    measure: ['Compare body and finished-garment measurements', fabric(bodice)+accent('M68 75 H202 M77 98 H194')+label(90,73,'Bust / chest')+label(94,96,'Waist level')+label(75,132,'Measure horizontally')],
    seam: ['Stitch inside the fabric edge', fabric('M70 32 H195 V110 H70Z')+stitch('M87 34 V108')+accent('M71 61 H87')+label(97,64,'Seam allowance')+label(94,126,'Raw edge to stitch line')],
    darts: ['Sew from dart legs to the point', fabric(bodice)+stitch('M104 116 L117 79 130 116 M140 116 L153 79 166 116')+label(100,71,'Dart points')],
    shoulder: ['Mark and compare shoulder seams', fabric(bodice)+stitch('M81 36 L108 24 M163 24 L189 36')+accent('M77 43 L109 29 M161 29 L193 43')+label(44,17,'Shoulder seam')+label(145,63,'Check armhole')],
    facing: ['Follow the neckline with facing or binding', fabric(bodice)+accent('M102 27 Q135 77 168 27')+stitch('M106 24 Q135 66 163 24')+label(83,86,'Turn finish inside')],
    zipper: ['Align the zipper with the opening', fabric('M57 25 H212 V116 H57Z')+outline('M128 27 V105 M142 27 V105')+stitch('M113 28 V107 M157 28 V107')+outline('M128 37 H142 M128 48 H142 M128 59 H142 M128 70 H142 M128 81 H142')+label(159,92,'Stitch beside coil')],
    band: ['Match the waistband to the top edge', fabric(panel)+fabric('M71 24 H199 V47 H71Z')+stitch('M72 46 H198')+label(104,22,'Waistband')+label(85,69,'Garment waist edge')],
    pocket: ['Mark the pocket opening before assembly', fabric(pants)+accent('M78 34 Q92 51 110 51 M192 34 Q178 51 160 51')+label(63,15,'Pocket openings')],
    rise: ['Mark the crotch seam on a test fit', fabric(pants)+stitch('M136 27 Q127 48 135 63')+accent('M136 63 L151 77')+label(149,48,'Rise seam')+label(158,79,'Crotch point')],
    taper: ['Blend the new leg seam', fabric(pants)+stitch('M189 47 Q185 78 190 118')+accent('M197 54 L208 118')+label(151,132,'Compare both legs')],
    sleeve: ['Mark the new sleeve fit on the underside', fabric('M48 52 Q75 24 112 37 L217 52 V100 L112 113 Q73 119 48 93Z')+stitch('M58 89 Q117 107 216 88')+accent('M195 49 V102')+label(63,77,'Underarm seam')+label(181,126,'Cuff line')],
    armhole: ['Mark the armhole during a fitting', fabric(bodice)+stitch('M81 35 Q88 62 65 77 M189 35 Q183 62 205 77')+accent('M85 36 Q92 64 68 83')+label(79,102,'Check arm movement')],
    neck: ['Compare the original and proposed neckline', fabric(bodice)+accent('M98 27 Q135 87 172 27')+stitch('M107 24 Q135 66 163 24')+label(104,92,'New edge')+label(100,16,'Original edge')],
    neckFill: ['Add fabric inside the existing neckline', fabric(bodice)+fabric('M107 24 Q134 46 163 24 Q135 67 107 24Z')+stitch('M107 24 Q135 66 163 24')+accent('M108 24 Q135 48 162 24')+label(71,82,'Inset raises the opening')],
    take: ['Take in toward the garment body', fabric('M66 29 H203 V112 H66Z')+stitch('M185 32 V108')+accent('M153 32 V108 M177 65 H155 M161 60 L155 65 161 70')+label(78,62,'Garment body')+label(139,130,'New line moves inward')],
    let: ['Let out toward the raw edge', fabric('M66 29 H203 V112 H66Z')+stitch('M151 32 V108')+accent('M183 32 V108 M155 65 H181 M175 60 L181 65 175 70')+label(79,62,'Garment body')+label(133,130,'Keep a seam allowance')],
    blend: ['Blend the new seam into the old line', fabric(panel)+stitch('M189 39 Q169 70 204 111')+outline('M198 38 L212 114')+label(65,72,'Baste along the curve')],
    hemUp: ['Raise the hem and keep the allowance', fabric(panel)+stitch('M62 100 H208')+accent('M68 81 H202')+label(89,77,'New finished hem')+label(85,132,'Allowance below fold')],
    hemDown: ['Lower the hem only as fabric permits', fabric(panel)+stitch('M67 80 H203')+accent('M62 101 H208')+label(93,75,'Original fold')+label(97,131,'New finished hem')],
    finish: ['Fold, press and stitch the hem', fabric(panel)+stitch('M63 100 H208')+outline('M61 109 H209')+label(84,90,'Stitch through fold')+label(93,132,'Finished edge')],
    layer: ['Stack with right sides touching', fabric('M70 38 H172 V118 H70Z')+fabric('M88 24 H190 V104 H88Z')+label(101,65,'Wrong side up')+label(47,133,'Right sides face each other')],
    gap: ['Leave a gap and pivot at each corner', fabric(square)+stitch('M128 113 H93 V34 H177 V113 H152')+accent('M129 116 H151')+label(110,134,'Turning gap')],
    corners: ['Clip the corners before turning', fabric(square)+stitch('M93 34 H177 V113 H93Z')+accent('M82 38 L99 23 M171 23 L188 38 M82 108 L99 123 M171 123 L188 108')+label(194,75,'Clip outside')+label(194,89,'the stitches')],
    topstitch: ['Topstitch around the turned square', fabric(square)+stitch('M89 30 H181 V116 H89Z')+label(102,80,'2–3 mm in')],
    open: ['Open only the seam section you need', fabric(panel)+stitch('M138 42 V59 M138 89 V116')+accent('M138 59 V89')+label(146,77,'Unpick here')],
    fit: ['Check the fit before final stitching', fabric(bodice)+stitch('M69 75 L79 115 M202 75 L191 115')+accent('M81 96 H189')+label(86,132,'Check ease and symmetry')]
  };
  const basics = [
    ['needle','bobbin','upper','screen','sew','check'],
    ['press','grain','cut','cut','marks'],
    ['layer','seam','sew','press'],
    ['marks','gap','corners','topstitch']
  ];
  const patterns = {
    dress:['measure','cut','darts','facing','zipper','finish'],
    top:['measure','cut','shoulder','seam','facing','finish'],
    shirt:['measure','cut','facing','sleeve','sleeve','finish'],
    skirt:['measure','cut','darts','zipper','band','finish'],
    trousers:['measure','cut','pocket','zipper','band','finish']
  };
  const toolCards = [
    ['Fabric shears', /shears|scissors/i], ['Measuring tape', /measuring tape/i],
    ['Pins and clips', /\bpins\b|clips/i], ['Tailor’s chalk', /chalk/i],
    ['Seam ripper', /seam ripper/i], ['Thread and Class 15 bobbin', /thread|bobbin/i],
    ['Iron', /\biron\b/i], ['Machine needle and presser foot', /needle|foot J|zipper foot/i],
    ['Cutting mat, ruler and rotary cutter', /cutting board|cutting mat|rotary|ruler/i], ['Foot controller', /foot controller/i],
    ['Invisible zipper', /zipper/i], ['Woven fabric', /cotton|woven|linen/i]
  ];

  function diagram(id) {
    const visual = diagrams[id];
    if (!visual) return '';
    return '<figure class="step-figure"><svg viewBox="0 0 270 141" role="img" aria-label="'+visual[0]+'" xmlns="http://www.w3.org/2000/svg">'+visual[1]+'</svg><figcaption>'+visual[0]+'</figcaption></figure>';
  }
  function identify(step) {
    return [
      [/\btake in\b/i,'take'],[/\blet out\b/i,'let'],[/new finished hem .*above/i,'hemUp'],
      [/new finished hem .*below/i,'hemDown'],[/neckline|neck opening/i,'neck'],
      [/armhole|armscye/i,'armhole'],[/sleeve|cuff/i,'sleeve'],[/shoulder/i,'shoulder'],
      [/crotch|rise seam/i,'rise'],[/taper|leg opening|thigh/i,'taper'],[/blend/i,'blend'],
      [/measure the garment/i,'measure'],[/turn the garment inside out|unpick/i,'open'],
      [/zipper/i,'zipper'],[/waistband/i,'band'],[/dart/i,'darts'],[/hem/i,'finish'],
      [/cut\b/i,'cut'],[/layer/i,'layer'],[/stitch|sew/i,'seam'],[/press/i,'press'],
      [/check|fit|try on/i,'fit']
    ].find(([test]) => test.test(step))?.[1];
  }

  function steps(items, ids) {
    return '<ol class="steps illustrated-steps">'+items.map((step,index)=>
      '<li><p>'+escape(step)+'</p>'+diagram(ids?.[index] || identify(step))+'</li>'
    ).join('')+'</ol>';
  }
  function tools(description) {
    const cards = toolCards.flatMap(([name,match],i)=>match.test(description)?[{name,i}]:[]);
    if (!cards.length && !/machine/i.test(description)) return '';
    const machinePhoto = /machine/i.test(description) ? '<figure><img src="brother-cp2160f.jpg" alt="Brother CP2160F sewing machine" loading="lazy"><figcaption>Brother CP2160F sewing machine</figcaption></figure>' : '';
    return '<div class="tool-photos">'+machinePhoto+cards.map(({name,i})=>'<figure><img src="tools/tool-'+i+'.jpg" alt="'+name+'" loading="lazy"><figcaption>'+name+'</figcaption></figure>').join('')+'</div>';
  }
  return {diagram,identify,tools,steps,basics,patterns};
})();
