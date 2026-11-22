'use strict';

const garmentFasteners=(()=>{
  const placements={front:'Center front',left:'Wearer’s left',right:'Wearer’s right'};
  const fields={
    buttons:{count:['Button count',1,16,1],diameter:['Button diameter',.5,4,.1],
      offset:['First button from upper edge',0,15,.1],spacing:['Button spacing',1,15,.1]},
    ties:{length:['Finished length per tie',12,120,.5],width:['Finished tie width',.5,8,.1]},
    drawstring:{length:['Finished drawstring length',50,240,.5],width:['Cord diameter or tape width',.2,2,.1],
      casingDepth:['Finished casing depth',.6,6,.1]}
  };

  function kind(closure) {
    if (['Front buttons','Button fly','Back button and loop'].includes(closure)) return 'buttons';
    if (closure==='Wrap ties') return 'ties';
    if (closure==='Drawstring waistband') return 'drawstring';
    return null;
  }

  function active(design) {
    return kind(design?.closure)==='drawstring' || Boolean(kind(design?.closure) && design.fastener?.kind===kind(design.closure));
  }

  function settings(design) {
    const closure=design?.closure;
    const type=kind(closure);
    if (!type) return null;
    const defaults=type==='buttons'
      ? closure==='Button fly'?{count:4,diameter:1.5,offset:1.5,spacing:2.8}
        : closure==='Back button and loop'?{count:1,diameter:1,offset:.8,spacing:4}
        : {count:6,diameter:1.6,offset:2.5,spacing:4.5}
      : type==='ties'?{length:44,width:2,placement:'left'}
        : {length:145,width:.7,casingDepth:2.5,placement:'front'};
    const input=design.fastener?.kind===type?design.fastener:{};
    const result={kind:type,...defaults,color:/^#[\da-f]{6}$/i.test(input.color||'')?input.color:'#493639'};
    for (const [key,[,min,max,step]] of Object.entries(fields[type])) {
      if (!Number.isFinite(input[key])) continue;
      const rounded=Math.round(input[key]/step)*step;
      result[key]=Number(Math.max(min,Math.min(max,rounded)).toFixed(2));
    }
    if (closure==='Back button and loop') {
      result.count=1;
      delete result.spacing;
    }
    if (type==='drawstring') result.casingDepth=Math.max(result.casingDepth,Number((result.width+.4).toFixed(2)));
    if (Object.hasOwn(placements,input.placement)) result.placement=input.placement;
    return result;
  }

  const saved=design=>active(design)?settings(design):undefined;

  function tools(design) {
    const detail=saved(design);
    if (!detail) return [];
    if (detail.kind==='drawstring') return ['drawstring cord or flat tape','safety pin or bodkin','reinforcement for casing exits','buttonhole foot A'];
    if (detail.kind==='ties') return ['turning tool','lightweight interfacing for tie anchors'];
    return design.closure==='Back button and loop'?['hand-sewing needle','loop cord']:['buttonhole foot A','seam ripper','pins for buttonhole stops'];
  }

  function instructions(design) {
    const detail=saved(design);
    if (!detail) return [];
    if (detail.kind==='buttons') {
      const {count,diameter,offset,spacing}=detail;
      const site=design.closure==='Back button and loop'?'back neckline':design.closure==='Button fly'?'fly extension':'front placket';
      return [{visual:'designButtons',text:`At the ${site}, use ${count} button${count===1?'':'s'}, ${diameter} cm in diameter. Place the first center ${offset} cm below the finished upper edge${count>1?` and space the centers ${spacing} cm apart`:''}. Baste the overlap first, then transfer every center to the matching layer. ${design.closure==='Back button and loop'
        ?'Make a test loop around the actual button. Baste its ends between the facing and back edge, test the opening, then stitch through the finished edge and sew the button by hand.'
        :'Interface the opening and test a buttonhole on matching scrap with Brother buttonhole foot A and the actual button. Leave room for its thickness and check that the overlap closes flat. Stitch the buttonholes, cut them open with a pin across each end to protect the bar tack, then sew the buttons opposite the holes.'}`}];
    }
    if (detail.kind==='ties') {
      return [{visual:'designWrapTies',text:`Make two ties, each ${detail.length} cm long and ${detail.width} cm wide when finished, with the knot at ${placements[detail.placement].toLowerCase()}. Add your pattern allowances to the cut strips. Fold each strip lengthwise with right sides together, sew the long edge and one short end, trim the corner, turn and press. Baste the open ends at the wrap overlap marks. Tie the garment on the wearer and check coverage and the reach of both ends before reinforcing the anchors.`}];
    }
    return [{visual:'designDrawstring',text:`Make a ${detail.casingDepth} cm deep finished casing for a ${detail.length} cm long, ${detail.width} cm wide drawstring. Reinforce two exits at ${placements[detail.placement].toLowerCase()} on the outer waistband layer before folding the casing. Test buttonholes with foot A, or use pattern-specified eyelets. Stitch the casing channel with foot J after testing the layers. Feed the cord with a bodkin or safety pin, hold the trailing end outside the opening, and pull out even tails. Check the waistband passes comfortably over the hips when open, then secure the cord ends.`}];
  }

  return {placements,fields,kind,active,settings,saved,tools,instructions};
})();
