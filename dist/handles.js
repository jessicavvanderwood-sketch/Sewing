'use strict';

const fitHandles = (() => {
  // x anchors sit on the garment's right edge. y anchors sit on the front
  // surface and follow the corresponding vertical sewing measurement.
  const specs = {
    waist:{label:'Waist width',axis:'x',y:-.26},
    hip:{label:'Hip width',axis:'x',y:.13},
    bust:{label:'Bust width',axis:'x',y:-.48},
    shoulder:{label:'Shoulder width',axis:'x',y:-.73},
    shoulderSlope:{label:'Shoulder slope',axis:'y',y:-.72,x:.88},
    armhole:{label:'Armhole depth',axis:'y',y:-.63,x:.86},
    neckDepth:{label:'Front neckline depth',axis:'y',y:-.74,x:0,neck:true},
    neckWidth:{label:'Neckline width',axis:'x',y:-.74,x:.56,neck:true},
    backNeck:{label:'Back neckline depth',axis:'y',y:-.74,x:0,neck:true,back:true},
    waistHeight:{label:'Waistline height',axis:'y',y:-.25,x:0},
    length:{label:'Garment length',axis:'y',end:true,x:0},
    sweep:{label:'Hem width',axis:'x',end:true},
    sleeveWidth:{label:'Upper sleeve width',axis:'x',part:'sleeve',y:-.59},
    sleeveCap:{label:'Sleeve cap fullness',axis:'x',part:'sleeve',y:-.68},
    sleeveLength:{label:'Sleeve length',axis:'y',part:'sleeve',end:true,x:0},
    cuff:{label:'Cuff width',axis:'x',part:'sleeve',end:true},
    thigh:{label:'Thigh width',axis:'x',part:'leg',y:.36},
    knee:{label:'Knee width',axis:'x',part:'leg',y:.61},
    leg:{label:'Leg opening',axis:'x',part:'leg',end:true},
    rise:{label:'Rise length',axis:'y',y:-.21,x:0}
  };

  const groups = {
    body:{label:'Body width',keys:['bust','waist','hip','shoulder']},
    neckline:{label:'Front neckline',keys:['neckDepth','neckWidth']},
    back:{label:'Back neckline',keys:['backNeck']},
    shoulder:{label:'Shoulder and armhole',keys:['shoulder','shoulderSlope','armhole']},
    sleeves:{label:'Sleeves',keys:['sleeveWidth','sleeveCap','sleeveLength','cuff']},
    length:{label:'Hem and length',keys:['sweep','length','waistHeight']},
    legs:{label:'Pants legs',keys:['thigh','knee','leg','rise','length']}
  };

  function available(keys) {
    const allowed=new Set(keys);
    return Object.entries(groups).filter(([id])=>id!=='legs'||allowed.has('thigh')).map(([id,group])=>[
      id,{label:group.label,keys:group.keys.filter(key=>allowed.has(key))}
    ]).filter(([,group])=>group.keys.length);
  }

  function history({undoButton,redoButton,snapshot,restore}) {
    const past=[];
    const future=[];
    function refresh() {
      if (undoButton) undoButton.disabled=!past.length;
      if (redoButton) redoButton.disabled=!future.length;
    }
    function checkpoint(before=snapshot()) {
      past.push(before);
      future.length=0;
      refresh();
    }
    function travel(from,to) {
      if (!from.length) return;
      to.push(snapshot());
      restore(from.pop());
      refresh();
    }
    const undo=()=>travel(past,future);
    const redo=()=>travel(future,past);
    undoButton?.addEventListener('click',undo);
    redoButton?.addEventListener('click',redo);
    refresh();
    return {
      checkpoint,undo,redo,
      reset(){past.length=0;future.length=0;refresh();},
      cleanup(){
        undoButton?.removeEventListener('click',undo);
        redoButton?.removeEventListener('click',redo);
      }
    };
  }

  function distanceToSegment(x,y,ax,ay,bx,by) {
    const dx=bx-ax, dy=by-ay;
    const size=dx*dx+dy*dy;
    const t=size ? Math.min(1,Math.max(0,((x-ax)*dx+(y-ay)*dy)/size)) : 0;
    return (x-ax-t*dx)**2+(y-ay-t*dy)**2;
  }

  function selection(canvas,{select,hover,rotate}) {
    let hits=[];
    let pointer;
    let over=null;
    let gesture;

    function pick(event) {
      const box=canvas.getBoundingClientRect();
      const x=event.clientX-box.left, y=event.clientY-box.top;
      if (!box.width || !box.height || x<0 || y<0 || x>box.width || y>box.height) return null;
      const w=box.width/100, h=box.height/100;
      const candidates=[];
      for (const [key,{paths=[],points=[],radius=12}] of hits) {
        const tolerance=event.pointerType==='touch'?Math.max(radius,19):radius;
        const consider=(squared,span)=>{
          if (squared<=tolerance*tolerance) candidates.push({key,distance:Math.sqrt(squared),span});
        };
        for (const [px,py] of points) consider((x-px*w)**2+(y-py*h)**2,0);
        for (const path of paths) {
          let distance=Infinity, span=0;
          for (let i=1;i<path.length;i++) {
            const [ax,ay]=path[i-1], [bx,by]=path[i];
            distance=Math.min(distance,distanceToSegment(x,y,ax*w,ay*h,bx*w,by*h));
            span+=Math.hypot((bx-ax)*w,(by-ay)*h);
          }
          consider(distance,span);
        }
      }
      const nearest=Math.min(...candidates.map(candidate=>candidate.distance));
      // A short center section can sit directly on a longer silhouette
      // line. Let clicks on that section choose the more specific edit.
      const winner=candidates.filter(candidate=>candidate.distance<=nearest+.3)
        .sort((a,b)=>a.span-b.span || a.distance-b.distance)[0];
      return winner?.key??null;
    }

    function highlight(key,event) {
      if (key===over) return;
      over=key;
      canvas.toggleAttribute('data-component-hover',key!==null);
      hover?.(key,event);
    }

    function down(event) {
      if (gesture || event.button!==0 || event.isPrimary===false) return;
      if (event.pointerType==='touch'||event.pointerType==='pen') event.preventDefault();
      gesture={id:event.pointerId,x:event.clientX,y:event.clientY,lastX:event.clientX,dragged:false};
      canvas.setPointerCapture(event.pointerId);
      if (event.pointerType==='touch') leave(event);
    }

    function move(event) {
      if (!gesture) {
        if (event.pointerType==='touch') return;
        pointer=event;
        highlight(pick(event),event);
        return;
      }
      if (gesture.id!==event.pointerId) return;
      if (!gesture.dragged) {
        const threshold=event.pointerType==='touch'?7:4;
        if (Math.hypot(event.clientX-gesture.x,event.clientY-gesture.y)<threshold) return;
        gesture.dragged=true;
        pointer=undefined;
        highlight(null,event);
      }
      const delta=event.clientX-gesture.lastX;
      gesture.lastX=event.clientX;
      if (delta) rotate?.(delta,event);
    }

    function leave(event) {
      pointer=undefined;
      highlight(null,event);
    }

    function end(event) {
      if (gesture?.id!==event.pointerId) return;
      move(event);
      const {dragged}=gesture;
      gesture=undefined;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      if (!dragged) select?.(pick(event),event);
      if (event.pointerType!=='touch') move(event);
    }

    function cancel(event) {
      if (gesture?.id!==event.pointerId) return;
      gesture=undefined;
      leave(event);
    }

    const listeners={pointerdown:down,pointermove:move,pointerup:end,pointerleave:leave,
      pointercancel:cancel,lostpointercapture:cancel};
    for (const [event,handle] of Object.entries(listeners)) canvas.addEventListener(event,handle);
    return {
      targets(data={}) {
        hits=Object.entries(data);
        if (pointer && !gesture) highlight(pick(pointer),pointer);
      },
      cleanup() {
        for (const [event,handle] of Object.entries(listeners)) canvas.removeEventListener(event,handle);
        if (gesture && canvas.hasPointerCapture(gesture.id)) canvas.releasePointerCapture(gesture.id);
        canvas.removeAttribute('data-component-hover');
        gesture=pointer=undefined;
        over=null;
        hits=[];
      }
    };
  }

  return {specs,available,history,selection};
})();
