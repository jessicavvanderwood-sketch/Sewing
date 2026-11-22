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
    waistHeight:{label:'Waistline height',axis:'y',y:-.25,x:0,direction:-1},
    length:{label:'Garment length',axis:'y',end:true,x:0},
    sweep:{label:'Hem width',axis:'x',end:true},
    sleeveWidth:{label:'Upper sleeve width',axis:'x',part:'sleeve',y:-.59},
    sleeveCap:{label:'Sleeve cap fullness',axis:'x',part:'sleeve',y:-.68},
    sleeveLength:{label:'Sleeve length',axis:'y',part:'sleeve',end:true,x:0},
    cuff:{label:'Cuff width',axis:'x',part:'sleeve',end:true},
    thigh:{label:'Thigh width',axis:'x',part:'leg',y:.36},
    knee:{label:'Knee width',axis:'x',part:'leg',y:.61},
    leg:{label:'Leg opening',axis:'x',part:'leg',end:true},
    rise:{label:'Rise length',axis:'y',y:-.21,x:0,direction:-1}
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

  function place(key,surfaces,canvas) {
    const spec=specs[key];
    const surface=surfaces[spec.part || (key==='length'&&surfaces.leg?'leg':'shell')];
    if (!surface) return null;
    const {rings,projectPoint,opening}=surface;
    const index=spec.neck?0:spec.end?rings.length-1:rings.reduce((best,row,i)=>
      Math.abs(row[0]-spec.y)<Math.abs(rings[best][0]-spec.y)?i:best,0);
    const ring=rings[index];
    const x=(key==='neckWidth'?opening:spec.x) ?? (spec.axis==='x'?.98:.67);
    const theta=(spec.back?-1:1)*Math.acos(x);
    const [px,py]=projectPoint(ring,theta,index);
    return {x:100*px/canvas.width,y:100*py/canvas.height};
  }

  function editor({canvas,overlay,undoButton,redoButton,snapshot,restore,apply}) {
    const handles=new Map();
    const past=[];
    const future=[];
    let anchors={};
    let drag;

    function updateHistoryButtons() {
      undoButton.disabled=!past.length;
      redoButton.disabled=!future.length;
    }

    function remember(before) {
      past.push(before);
      future.length=0;
      updateHistoryButtons();
    }

    function checkpoint() {
      if (drag) finishDrag();
      remember(snapshot());
    }

    function showValue(button,control) {
      const suffix=control.unit==='%'?'%':' cm';
      button.dataset.metricHandle=`${control.label} · ${control.value}${suffix}`;
      const label=studioUnits.text(button.dataset.metricHandle);
      button.title=label;
      button.setAttribute('aria-label',label);
    }

    function position(nextAnchors) {
      anchors=nextAnchors;
      for (const [key,{button}] of handles) {
        const anchor=anchors[key];
        button.hidden=!anchor;
        if (!anchor) continue;
        button.style.left=`${Math.min(95,Math.max(5,anchor.x))}%`;
        button.style.top=`${Math.min(96,Math.max(4,anchor.y))}%`;
      }
    }

    function controls(list) {
      const active=new Set(list.map(control=>control.key));
      for (const [key,{button}] of handles) {
        if (active.has(key)) continue;
        if (drag?.key===key) finishDrag();
        button.remove();
        handles.delete(key);
      }
      let nextButton=overlay.firstElementChild;
      for (const control of list) {
        let handle=handles.get(control.key);
        if (!handle) {
          const button=document.createElement('button');
          button.type='button';
          button.className='fit-handle';
          button.dataset.key=control.key;
          const icon=document.createElement('span');
          icon.setAttribute('aria-hidden','true');
          button.append(icon);
          handle={button,icon};
          handles.set(control.key,handle);
        }
        const {button,icon}=handle;
        if (button!==nextButton) overlay.insertBefore(button,nextButton);
        nextButton=button.nextElementSibling;
        if (button.dataset.axis!==control.axis) {
          button.dataset.axis=control.axis;
          icon.textContent=control.axis==='x'?'↔':'↕';
        }
        handle.control={...control};
        showValue(button,control);
      }
      overlay.hidden=!list.length;
      position(anchors);
    }

    function rounded(control,value) {
      const snapped=control.min+Math.round((value-control.min)/control.step)*control.step;
      return Math.min(control.max,Math.max(control.min,Number(snapped.toFixed(8))));
    }

    function change(handle,value) {
      if (value===handle.control.value) return;
      handle.control.value=value;
      showValue(handle.button,handle.control);
      apply(handle.control.key,value);
    }

    function finishDrag(cancel=false) {
      if (!drag) return;
      const {button,id,before,initial,value}=drag;
      drag=undefined;
      button.classList.remove('is-dragging');
      if (button.hasPointerCapture(id)) button.releasePointerCapture(id);
      if (initial===value) return;
      if (cancel) restore(before);
      else remember(before);
    }

    function moveDrag(event) {
      if (drag?.id!==event.pointerId) return;
      const {control,dimension,start,initial}=drag;
      const current=control.axis==='x'?event.clientX:event.clientY;
      const sensitivity=control.sensitivity??(control.axis==='x'?120:100);
      drag.value=current===start?initial:
        rounded(control,initial+(current-start)/dimension*sensitivity*(control.direction??1));
      change(handles.get(control.key),drag.value);
    }

    overlay.addEventListener('pointerdown',event=>{
      const button=event.target.closest('button[data-key]');
      const control=handles.get(button?.dataset.key)?.control;
      if (!control || event.button!==0 || drag) return;
      const rect=canvas.getBoundingClientRect();
      const horizontal=control.axis==='x';
      drag={button,control,key:control.key,id:event.pointerId,start:horizontal?event.clientX:event.clientY,
        dimension:Math.max(1,horizontal?rect.width:rect.height),before:snapshot(),initial:control.value,value:control.value};
      button.setPointerCapture(event.pointerId);
      button.classList.add('is-dragging');
    });
    overlay.addEventListener('pointermove',moveDrag);
    overlay.addEventListener('pointerup',event=>{
      if (drag?.id!==event.pointerId) return;
      moveDrag(event);
      finishDrag();
    });
    function cancelDrag(event) {
      if (drag?.id===event.pointerId) finishDrag(true);
    }
    overlay.addEventListener('pointercancel',cancelDrag);
    overlay.addEventListener('lostpointercapture',cancelDrag);

    overlay.addEventListener('keydown',event=>{
      const button=event.target.closest('button[data-key]');
      const handle=handles.get(button?.dataset.key);
      if (!handle || drag) return;
      const {control}=handle;
      const [less,more]=control.axis==='x'?['ArrowLeft','ArrowRight']:['ArrowUp','ArrowDown'];
      if (event.key!==less && event.key!==more) return;
      event.preventDefault();
      const direction=(event.key===less?-1:1)*(control.direction??1);
      const value=rounded(control,control.value+direction*control.step*(event.shiftKey?4:1));
      if (value===control.value) return;
      checkpoint();
      change(handle,value);
    });

    function travel(from,to) {
      if (drag) finishDrag();
      if (!from.length) return;
      to.push(snapshot());
      restore(from.pop());
      updateHistoryButtons();
    }

    undoButton.addEventListener('click',()=>travel(past,future));
    redoButton.addEventListener('click',()=>travel(future,past));
    updateHistoryButtons();

    function reset() {
      if (drag) finishDrag();
      past.length=0;
      future.length=0;
      updateHistoryButtons();
    }

    return {controls,position,checkpoint,reset};
  }

  return {specs,available,place,editor};
})();
