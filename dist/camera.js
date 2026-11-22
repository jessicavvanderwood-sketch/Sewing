'use strict';

const modelCamera = (() => {
  function measureFrame(data,width,height) {
    const shape = garmentPhoto.foreground(data,width,height);
    if (!shape.largest) throw Error('Couldn’t find one clear outline. Try even lighting, a plain contrasting background, and fitted clothing.');
    const rowWidths = shape.right.map((right,y)=>Math.max(0,right-shape.left[y]+1));
    const top = rowWidths.findIndex(Boolean);
    const bottom = rowWidths.findLastIndex(Boolean);
    const span = bottom-top;
    if (top<2 || bottom>=height-2 || Math.min(...shape.left)<2 || Math.max(...shape.right)>=width-2 || span<height*.45) {
      throw Error('Keep your entire outline, from head to feet, inside the camera frame.');
    }
    const landmarks = [.112,.145,.182,.218,.267,.345,.415,.485,.53];
    return landmarks.map(point=>{
      const center = Math.round(top+span*point);
      const rows = rowWidths.slice(center-2,center+3).sort((a,b)=>a-b);
      return Number((rows[2]/span).toFixed(4));
    });
  }

  async function readFrame(video,view,center) {
    const {videoWidth,videoHeight}=video;
    if (!videoWidth || !videoHeight) throw Error('Wait for the camera preview before taking a capture.');
    const canvas = document.createElement('canvas');
    const sourceWidth=Math.min(videoWidth,Math.round(videoHeight*.96));
    const left=Math.round(Math.max(0,Math.min(videoWidth-sourceWidth,center*videoWidth-sourceWidth/2)));
    const scale = Math.min(1,480/videoHeight);
    canvas.width=Math.max(1,Math.round(sourceWidth*scale));
    canvas.height=Math.max(1,Math.round(videoHeight*scale));
    const context=canvas.getContext('2d',{willReadFrequently:true});
    context.drawImage(video,left,0,sourceWidth,videoHeight,0,0,canvas.width,canvas.height);
    const {width,height}=canvas;
    let mask;
    if (typeof modelPerson!=='undefined') {
      try { mask=await modelPerson.segment(canvas); }
      catch (error) { console.warn('On-device person detection was unavailable.',error); }
    }
    if (mask) {
      const centerX=(center*videoWidth-left)*width/sourceWidth;
      return {values:modelOutline.measure(mask,width,height,{centerX,view}),person:true};
    }
    try {
      return {values:measureFrame(context.getImageData(0,0,width,height).data,width,height),person:false};
    } catch {
      throw Error('Person detection couldn’t load. Try another capture, or use a plain background for the backup outline tool.');
    }
  }

  function setup(root,initialCapture,update) {
    const video=root.querySelector('video');
    const frame=root.querySelector('[data-camera-frame]');
    const guide=root.querySelector('[data-camera-guide]');
    const status=root.querySelector('[role=status]');
    const start=root.querySelector('[data-camera-start]');
    const front=root.querySelector('[data-camera-front]');
    const side=root.querySelector('[data-camera-side]');
    const stop=root.querySelector('[data-camera-stop]');
    const clear=root.querySelector('[data-camera-clear]');
    let stream;
    let request=0;
    let starting=false;
    let processing=false;
    let center=.5;
    let capture={...initialCapture};
    const ready=()=>Boolean(stream && video.readyState>=2 && video.videoWidth && video.videoHeight);
    const isCurrent=attempt=>attempt===request&&root.isConnected;
    function videoBounds() {
      const rect=video.getBoundingClientRect();
      const scale=Math.min(rect.width/video.videoWidth,rect.height/video.videoHeight);
      const width=video.videoWidth*scale,height=video.videoHeight*scale;
      return {rect,width,height,x:(rect.width-width)/2,y:(rect.height-height)/2};
    }
    function drawGuide() {
      guide.hidden=!ready();
      if (guide.hidden) return;
      const {width,height,x,y}=videoBounds();
      if (!width || !height) return;
      const half=Math.min(width*.24,height*.29);
      const left=Math.max(1,Math.min(width-half*2-1,center*width-half));
      guide.style.left=`${x+left}px`;
      guide.style.top=`${y+height*.025}px`;
      guide.style.width=`${half*2}px`;
      guide.style.height=`${height*.95}px`;
    }
    function render() {
      frame.hidden=!stream;
      front.disabled=side.disabled=!ready()||processing;
      start.disabled=Boolean(stream)||starting;
      stop.disabled=!stream&&!starting;
      clear.disabled=processing||(!capture.front&&!capture.side);
      front.textContent=capture.front?'Retake front':'Capture front';
      side.textContent=capture.side?'Retake side':'Capture side';
      drawGuide();
    }
    function updateOutline() {
      update(capture.front&&capture.side?capture:null);
    }
    function release() {
      request++;
      const current=stream;
      stream=undefined;
      starting=processing=false;
      current?.getTracks().forEach(track=>track.stop());
      video.srcObject=null;
      render();
    }
    function onPreview() {
      if (ready() && status.textContent==='Starting camera preview…') {
        status.textContent='Fit your head and feet in the frame. Tap yourself to move the guide.';
      }
      render();
    }
    video.addEventListener('loadeddata',onPreview);
    video.addEventListener('resize',onPreview);
    video.addEventListener('click',event=>{
      if (!ready() || processing) return;
      const {rect,width,height,x}=videoBounds();
      const fraction=(event.clientX-rect.left-x)/width;
      if (fraction>=0 && fraction<=1) {
        const margin=Math.min(.24,height*.29/width);
        center=Math.max(margin,Math.min(1-margin,fraction));
        drawGuide();
      }
    });
    const size=typeof ResizeObserver==='function'?new ResizeObserver(drawGuide):null;
    size?.observe(video);
    start.onclick=async()=>{
      if (stream || starting) return;
      if (!navigator.mediaDevices?.getUserMedia) {
        status.textContent='Camera access needs an HTTPS page and camera permission. You can still enter your measurements.';
        return;
      }
      const attempt=++request;
      starting=true;
      status.textContent='Waiting for camera access…';
      render();
      try {
        const next=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:960},height:{ideal:720}},audio:false});
        if (!isCurrent(attempt)) {
          next.getTracks().forEach(track=>track.stop());
          return;
        }
        stream=next;
        starting=false;
        status.textContent='Starting camera preview…';
        video.srcObject=next;
        for (const track of next.getVideoTracks?.()||[]) track.addEventListener('ended',()=>{
          if (!isCurrent(attempt)) return;
          release();
          status.textContent='The camera disconnected. Turn it on again to keep capturing.';
        },{once:true});
        onPreview();
        if (typeof modelPerson!=='undefined') modelPerson.prepare?.().catch(()=>{});
      } catch (error) {
        if (!isCurrent(attempt)) return;
        release();
        status.textContent=error.name==='NotAllowedError'?'Camera access was declined. Allow camera access to capture an outline.':
          'The camera couldn’t start. Turn it on again or enter your measurements.';
      }
    };
    for (const [key,button] of [['front',front],['side',side]]) button.onclick=async()=>{
      if (!ready() || processing) return;
      const attempt=request;
      processing=true;
      status.textContent=`Finding the ${key} outline…`;
      render();
      try {
        const {values,person}=await readFrame(video,key,center);
        if (!isCurrent(attempt)) return;
        capture={...capture,[key]:values,personViews:{...capture.personViews,[key]:person}};
        status.textContent=capture.front&&capture.side?'Both views captured. The shape will be saved with your measurements.':
          key==='front'?'Front captured. Turn sideways and capture the side.':'Side captured. Face the camera and capture the front.';
        updateOutline();
      } catch (error) {
        if (isCurrent(attempt)) status.textContent=error.message+(capture[key]?' The previous view was kept.':'');
      } finally {
        if (isCurrent(attempt)) {
          processing=false;
          render();
        }
      }
    };
    stop.onclick=()=>{
      release();
      status.textContent='Camera off. Any captured outline is still available in this form.';
    };
    root.addEventListener('toggle',()=>{
      if (!root.open&&(stream||starting)) stop.onclick();
    });
    clear.onclick=()=>{
      if (processing) return;
      capture={};
      status.textContent='Camera outline cleared.';
      render();
      updateOutline();
    };
    render();
    updateOutline();
    return ()=>{size?.disconnect();release();};
  }

  function rings(base,capture) {
    const frontReference=[.07,.08,.101,.132,.124,.101,.122,.14,.119];
    const sideReference=[.086,.092,.087,.096,.105,.081,.101,.106,.085];
    const scale=(actual,expected)=>Math.max(.72,Math.min(1.32,actual/expected));
    const levels=[-.90,-.79,-.75,-.63,-.45,-.25,-.04,.16,.30];
    const sections=levels.map((y,i)=>[y,scale(capture.front[i],frontReference[i]),scale(capture.side[i],sideReference[i])]);
    return base.map(([y,w,d])=>{
      const hi=Math.max(1,sections.findIndex(row=>row[0]>=y));
      const [a,b]=sections.slice(hi-1,hi+1);
      const t=(y-a[0])/(b[0]-a[0]);
      return [y,w*(a[1]+(b[1]-a[1])*t),d*(a[2]+(b[2]-a[2])*t)];
    });
  }
  return {measureFrame,setup,rings};
})();
