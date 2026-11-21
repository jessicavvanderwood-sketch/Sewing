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
    designCut: ['Trace the block and redraw the silhouette', fabric(panel)+stitch('M83 40 L76 111 M188 40 L194 111')+accent('M80 37 L64 118 M189 37 L207 118')+label(84,78,'Original block')+label(119,132,'New outline')],
    colorBlock: ['Add allowances to both sides of a divided panel', fabric('M78 25 H192 L199 68 H71Z M68 81 H202 L208 118 H62Z')+stitch('M72 60 H198 M70 89 H204')+accent('M135 32 V55 M135 94 V111')+label(152,77,'Join here')],
    pocketPatch: ['Press pocket allowances before topstitching', fabric(panel)+fabric('M118 51 H167 V86 L158 97 H127 L118 86Z')+stitch('M122 53 V85 L129 92 H155 L163 85 V53')+label(120,47,'Opening')],
    button: ['Mark buttonholes on one front and buttons on the other', fabric('M78 25 H118 V118 H78Z M148 25 H188 V118 H148Z')+outline('M95 43 H108 M95 68 H108 M95 93 H108')+accent('M165 43h3 M165 68h3 M165 93h3')+label(73,132,'Buttonholes')+label(151,132,'Buttons')],
    lacing: ['Place paired eyelets on reinforced edges',fabric('M60 26H119V115H60Z M151 26H210V115H151Z')+accent('M109 43L162 63L109 83L162 103M162 43L109 63L162 83L109 103')+stitch('M95 29V110 M176 29V110')+label(86,130,'Use the pattern eyelet spacing')],
    busk: ['Transfer the loop and stud positions',fabric('M56 27H112V116H56Z M154 27H210V116H154Z')+outline('M111 40h18v7h-18M111 65h18v7h-18M111 90h18v7h-18')+accent('M146 44h12m-12 25h12m-12 25h12')+label(83,132,'Use the actual busk as a guide')],
    strap: ['Mark both strap attachment points',fabric('M66 52H120V115H66Z M152 52H206V115H152Z')+accent('M93 54Q134 -4 179 54')+stitch('M80 60h27M165 60h27')+label(65,131,'Baste the front and back ends')],
    strapless: ['Test the finished upper edge',fabric('M61 49Q94 33 135 49Q176 33 209 49L197 117H73Z')+
      accent('M61 49Q94 33 135 49Q176 33 209 49')+stitch('M68 61Q96 47 135 61Q174 47 203 61')+label(77,96,'Fit with internal support')],
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
    upperHip: ['Check room at the upper hip',fabric(panel)+accent('M68 59Q135 72 202 59')+label(150,48,'Below waist')],
    seatDepth: ['Mark back seat depth in side view',fabric('M99 22H156Q162 45 181 61Q193 83 159 118H90Q96 72 83 59Z')+
      stitch('M156 26Q157 45 169 62Q177 85 159 118')+accent('M171 75H185')+label(64,132,'Keep the waist fixed')],
    lapEase: ['Check ease around both thighs',fabric(panel)+accent('M65 81Q135 95 205 81')+label(121,69,'Lap level')],
    kneeEase: ['Check skirt circumference near the knees',fabric(panel)+accent('M62 101Q135 113 209 101')+label(127,93,'Knee level')],
    sittingLength: ['Test additional back length above the seat',fabric('M71 28H180L207 116H71Z')+
      stitch('M71 65L193 75')+accent('M71 88L193 75')+label(73,129,'Blend to the side seam')],
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
      [/\bstrapless\b/i,'strapless'],[/\bstrap(?:s)?\b|\bhalter\b/i,'strap'],
      [/armhole|armscye/i,'armhole'],[/sleeve|cuff/i,'sleeve'],[/shoulder/i,'shoulder'],
      [/crotch|rise seam/i,'rise'],[/taper|leg opening|thigh/i,'taper'],[/blend/i,'blend'],
      [/measure the garment/i,'measure'],[/turn the garment inside out|unpick/i,'open'],
      [/zipper/i,'zipper'],[/waistband/i,'band'],[/dart/i,'darts'],[/hem/i,'finish'],
      [/cut\b/i,'cut'],[/layer/i,'layer'],[/stitch|sew/i,'seam'],[/press/i,'press'],
      [/check|fit|try on/i,'fit']
    ].find(([test]) => test.test(step))?.[1];
  }

  const wovenSetup = 'For a stable woven seam, select centered straight stitch 01 with foot J. Start at the 2.5 mm default length. Use scraps of the same layers to check stitch balance and seam strength.';
  const operations = {
    measure:[
      'Set the measuring tape flat around the body at the measurement point. Hold it level, close it without pulling the body inward, and read where the zero end crosses the tape.',
      'Write down the body measurement and the intended finished garment measurement separately. Subtract the body measurement from the finished measurement to check the ease.',
      'Lay the sample flat and match the left and right sides. Measure around the stitched seam line at the same level, with closures fastened and the fabric relaxed.',
      'On a test garment, clip or pin at the planned seam line. Stand, sit and move, then mark any areas that pull with chalk.'
    ],
    grain:[
      'Prewash and dry as planned for the finished garment. Press by setting the iron down and lifting it. Avoid sliding it over fabric that shifts easily.',
      'Spread the fabric on the cutting board. Identify the selvage and place the pattern grainline parallel to it. Measure from both ends of the grainline to the selvage and adjust until the distances match.',
      'Identify pieces marked cut on fold, cut one, and cut a pair. Match any fold mark to the fold. Flip the paper when the instructions call for mirrored pieces cut from one layer.',
      'Check the direction of the nap or print before laying out all the pieces. Place weights inside the pattern edges so the pieces stay flat during cutting.'
    ],
    cut:[
      'Circle the correct size line and confirm whether the printed outline already contains seam and hem allowances.',
      'Match the grainline and fold marks before adding weights. Check that every piece fits on the fabric, with space for any allowances that still need to be traced.',
      'Place the pattern on the fabric and secure it. Insert the lower blade of the fabric shears flat against the board, keep your other hand clear, and cut with steady strokes along the verified line.',
      'Transfer notches, dart points and closure marks before you lift the paper. Test your chalk or marker on scrap first.',
      'Label wrong sides with the piece name and side. Keep matched pairs together and tick each piece off on the cutting list.'
    ],
    marks:[
      'Match the pattern edges to the fabric. Hold the piece flat and mark each notch through the paper with tailor’s chalk or another tested removable marker.',
      'Mark dart points or pocket placement on both mirrored pieces. Remove the paper and check the marks against the original before continuing.'
    ],
    open:[
      'Lay the garment inside out on a lit table. Mark the start and end of the stitches to be removed.',
      'Hold the fabric flat with one hand. Slip the short point of the seam ripper under a single stitch, with the blade facing away from your hand. Cut a few stitches at a time.',
      'Pull out loose thread and press the opened seam flat. Check the remaining seam allowance before changing the seam line.'
    ],
    take:[
      'Turn the garment inside out and mark the original stitch line. Measure the specified amount into the garment from that line at the fitting point.',
      'Use chalk to connect the new mark to the unchanged seam. Match the adjustment on corresponding sides or layers as specified.',
      'Pin or clip the new line, baste it, and check fit while moving. Confirm the new line before trimming any excess.'
    ],
    let:[
      'Unpick the required section. Measure from the original line toward the raw edge by the amount listed for each layer.',
      'Check the fabric remaining beyond the new line. If it is too narrow for the fabric and seam finish, plan an insert or change the distribution before sewing.',
      'Draw a smooth line back to the unchanged seam, baste, and test on the wearer before final stitching.'
    ],
    blend:[
      'Mark the widest part of the change and where it should return to the original seam. Use a ruler or smooth curve to join them without a sudden angle.',
      'Set the pieces together and align matching marks. Pin perpendicular to the seam and remove each pin before it reaches the needle.',
      'Baste, try on the garment, and correct any puckers before permanent sewing.'
    ],
    seam:[
      wovenSetup,
      'Place the fabric layers as specified, usually right sides together. Line up the matching marks and hold the raw edge against the seam allowance guide.',
      'Raise the foot, slide the layers underneath, lower the foot, and start slowly. Keep a hand on each side of the fabric to guide it without pulling.',
      'Remove pins before the needle reaches them. Secure the stitch ends as the pattern directs and press the seam in the specified direction.'
    ],
    darts:[
      wovenSetup,
      'Fold right sides together so both dart legs meet. Pin the legs in place and mark the dart point.',
      'Sew from the wider end toward the point. Taper to the fold and secure the thread tails at the tip without making a bulky knot in the fabric.',
      'Press the dart in the direction specified by the pattern, using a tailor’s ham if needed.'
    ],
    shoulder:[
      wovenSetup,
      'Lay the front and back right sides together. Match the neckline ends, shoulder points and any notches.',
      'Pin the seam at the stitch line, then sew from one end to the other while keeping the edges aligned. Press as directed and recheck the armhole.'
    ],
    sleeve:[
      wovenSetup,
      'Match the sleeve’s front and back notches to the armhole and mark the shoulder point. Clip at those fixed points first.',
      'Distribute the remaining sleeve cap evenly as the pattern directs. Baste and try the garment on before sewing the permanent seam.',
      'Turn the body inside out and insert the sleeve through the armhole with right sides touching. Follow the marked stitching line around the opening and remove the clips before they reach the foot.',
      'Check that the sleeve hangs smoothly, the underarm is untwisted, and you can raise your arm comfortably.'
    ],
    facing:[
      'Compare the facing and garment edges. Mark center front, center back, and shoulder points, then align those marks before pinning.',
      wovenSetup,
      'Sew on the marked line. Where the instructions call for it, trim excess seam allowance, clip curves without cutting the stitches, and understitch toward the facing.',
      'Turn the facing inside, roll the seam slightly inward, and press over a curved surface.'
    ],
    zipper:[
      'With the machine switched off, attach the compatible zipper foot. For an invisible zipper use the foot specified by the zipper and machine instructions.',
      'Place the zipper tape against the garment opening, mark matching seams on the tape, and hand-baste or pin it.',
      'Select a straight stitch. Turn the handwheel toward you to confirm the needle clears the foot before starting. Sew the first side slowly, then match the marks and sew the second.',
      'Close the zipper to check alignment and movement before completing the seam below it.'
    ],
    band:[
      'Mark the center and side-seam positions on the waistband. Match them to the garment and clip between those points.',
      'Baste or pin the band in place and check it sits level while standing and sitting.',
      'Attach and finish the band as the pattern directs. For a casing, leave an opening for the elastic and check that it has not twisted before securing it.'
    ],
    hemUp:[
      'With the garment on the wearer, mark the finished length using chalk or pins. Measure around the garment at several points.',
      'Take it off and lay it flat. Mark the hem allowance below the finished line before cutting. Check the line on both sides or legs.',
      'Fold the allowance to the inside, press it, and baste. Confirm the new length before final stitching.'
    ],
    hemDown:[
      'Mark the requested finished length below the old fold before opening the hem.',
      'Unpick the existing stitches and press out the old crease with a press cloth. Measure how much fabric remains below the new mark.',
      'Choose a finish that the remaining allowance can support. Baste and verify the length before sewing.'
    ],
    finish:[
      'Lay the piece wrong side up. Use a ruler to mark the fold width specified by the pattern. Fold the allowance to the wrong side and set the crease with the iron.',
      'Clip or baste the fold in place. Check that the edge is even and the hem lies flat without twisting.',
      wovenSetup,
      'Place the hem under the foot and sew at a steady pace, using the guide or fold as your reference. If a woven edge needs separate zigzag finishing, use stitch 04 with foot J and test the width and length on scrap first.',
      'Remove basting, press the finished hem, and inspect the stitching on both sides.'
    ],
    press:[
      'Check the iron temperature on a scrap. Use a press cloth for dark, delicate, or easily marked fabrics.',
      'Open or direct the seam allowance as indicated. Set the iron down, lift it, and move to the next section without stretching the seam.'
    ],
    fit:[
      'Remove loose pins before the fitting. Put on the garment and close it as it will be worn.',
      'Check balance from the front, side and back. Sit, reach, and walk as appropriate. Note the exact place and direction of pulling before changing a seam.',
      'Transfer any final marks to the garment or paper pattern and recheck symmetry.'
    ]
  };
  const equivalent = {designCut:'cut',layer:'seam',sew:'seam',topstitch:'seam',neck:'facing',neckFill:'facing',
    sleeveCap:'sleeve',armhole:'sleeve',rise:'blend',taper:'blend',pocket:'marks',pocketPatch:'marks',button:'marks',colorBlock:'grain'};
  const actionFigures = {
    measure:['measure','measure','fit','fitMove'],
    grain:['press','grain','separateLayers','weights'],
    cut:['cut','grain','shears','markPattern','separateLayers'],
    marks:['markPattern','separateLayers'],
    open:['unpick','ripper','press'],
    take:['take','blend','pin'],
    let:['let','allowance','blend'],
    blend:['blend','pin','fit'],
    seam:['screen','layer','foot','pin'],
    darts:['screen','pin','darts','press'],
    shoulder:['screen','shoulder','sew'],
    sleeve:['screen','matchSleeve','easeSleeve','stitchStart','fitMove'],
    facing:['facing','screen','clipCurve','turnFacing'],
    zipper:['foot','zipper','zipClearance','zipCheck'],
    band:['band','pin','casing'],
    hemUp:['hemUp','allowance','fold'],
    hemDown:['hemDown','ripper','fold'],
    finish:['fold','pin','screen','sew','check'],
    press:['press','press'],
    fit:['fit','fitMove','markPattern']
  };
  function operationActions(step,id) {
    const key=operations[id]?id:equivalent[id];
    return operations[key]?.map((text,i)=>({text,figure:actionFigures[key][i]})) ||
      step.split(/(?<=[.!?])\s+/).filter(Boolean).map(text=>({text,figure:identify(text)||id}));
  }
  function machineGuide() {
    return '<details class="wo-how wo-machine"><summary>Brother CP2160F setup and stitch settings</summary><ol><li>Switch the machine off to insert the needle and set up the thread. Use a compatible SA156 Class 15 bobbin and raise the presser foot before threading the upper thread.</li><li>For a stable woven seam, use centered straight stitch <strong>01</strong>, foot <strong>J</strong>, and start at <strong>2.5 mm</strong> stitch length.</li><li>For zigzag edge finishing, select <strong>04</strong> with foot <strong>J</strong>. Its defaults are <strong>3.5 mm wide</strong> and <strong>1.4 mm long</strong>. Adjust only after checking a scrap.</li><li>For a stretchy seam, use a compatible needle and test a narrow zigzag or the stitch required by your pattern. Pull the sewn scrap to check that the stitches stretch with it.</li><li>Use the foot, needle and seam type required by the project. When changing feet or adjusting stitch width, turn the handwheel toward you to confirm needle clearance before using the pedal.</li></ol><p><a href="https://support.brother.com/g/b/manualtop.aspx?c=us&amp;lang=en&amp;prod=hf_cp2160feus" target="_blank" rel="noopener">Brother CP2160F manual and stitch chart</a></p></details>';
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
  return {diagram,identify,tools,steps,basics,patterns,operationActions,figureParts:id=>diagrams[id],machineGuide};
})();
