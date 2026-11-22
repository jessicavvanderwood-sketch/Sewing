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

  function selection(canvas,{select,hover,rotate,dragVertical}) {
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
      for (const [key,{paths=[],points=[],radius=12,priority=0}] of hits) {
        const tolerance=event.pointerType==='touch'?Math.max(radius,19):radius;
        const rank=Number.isFinite(priority)?priority:0;
        const consider=(squared,span)=>{
          if (squared<=tolerance*tolerance) candidates.push({key,distance:Math.sqrt(squared),span,rank});
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
      // Visible details sometimes share a line with the silhouette or
      // another layer. Resolve these ties without pulling a click away
      // from a nearer edge. Unranked ties still favor shorter sections.
      const winner=candidates.filter(candidate=>candidate.distance<=nearest+.3)
        .sort((a,b)=>b.rank-a.rank || a.span-b.span || a.distance-b.distance)[0];
      return winner?.key??null;
    }

    function highlight(key,event) {
      if (key===over) return;
      over=key;
      if (key===null) canvas.removeAttribute('data-component-hover');
      else canvas.setAttribute('data-component-hover',key);
      hover?.(key,event);
    }

    function down(event) {
      if (gesture || event.button!==0 || event.isPrimary===false) return;
      if (event.pointerType==='touch'||event.pointerType==='pen') event.preventDefault();
      gesture={id:event.pointerId,x:event.clientX,y:event.clientY,lastX:event.clientX,lastY:event.clientY,
        target:dragVertical?pick(event):null,dragged:false,vertical:null};
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
      const dy=event.clientY-gesture.y;
      if (!gesture.dragged) {
        const threshold=event.pointerType==='touch'?7:4;
        const dx=event.clientX-gesture.x;
        if (Math.hypot(dx,dy)<threshold) return;
        gesture.dragged=true;
        pointer=undefined;
        if (gesture.target!==null && Math.abs(dy)>Math.abs(dx)) gesture.vertical=dragVertical(gesture.target);
        highlight(gesture.vertical?gesture.target:null,event);
      }
      if (gesture.vertical) {
        if (event.clientY!==gesture.lastY) {
          gesture.lastY=event.clientY;
          gesture.vertical.move(dy,event);
        }
        return;
      }
      const delta=event.clientX-gesture.lastX;
      gesture.lastX=event.clientX;
      if (delta) rotate?.(delta,event);
    }

    function leave(event) {
      pointer=undefined;
      highlight(null,event);
    }

    function release(cancelled) {
      const active=gesture;
      gesture=undefined;
      if (active && canvas.hasPointerCapture(active.id)) canvas.releasePointerCapture(active.id);
      active?.vertical?.finish(cancelled);
      return active;
    }

    function end(event) {
      if (gesture?.id!==event.pointerId) return;
      move(event);
      const active=release(false);
      if (active && !active.dragged) select?.(pick(event),event);
      if (event.pointerType!=='touch') move(event);
    }

    function cancel(event) {
      if (gesture?.id!==event.pointerId) return;
      release(true);
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
        release(true);
        canvas.removeAttribute('data-component-hover');
        pointer=undefined;
        over=null;
        hits=[];
      }
    };
  }

  return {specs,available,history,selection};
})();
