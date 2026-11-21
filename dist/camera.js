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

  function readFrame(video) {
    if (!video.videoWidth || !video.videoHeight) throw Error('Wait for the camera preview before taking a capture.');
    const canvas = document.createElement('canvas');
    const scale = Math.min(1,210/Math.max(video.videoWidth,video.videoHeight));
    canvas.width=Math.max(1,Math.round(video.videoWidth*scale));
    canvas.height=Math.max(1,Math.round(video.videoHeight*scale));
    const context=canvas.getContext('2d',{willReadFrequently:true});
    context.drawImage(video,0,0,canvas.width,canvas.height);
    return measureFrame(context.getImageData(0,0,canvas.width,canvas.height).data,canvas.width,canvas.height);
  }

  function setup(root,initialCapture,update) {
    const video=root.querySelector('video');
    const status=root.querySelector('[role=status]');
    const start=root.querySelector('[data-camera-start]');
    const front=root.querySelector('[data-camera-front]');
    const side=root.querySelector('[data-camera-side]');
    const stop=root.querySelector('[data-camera-stop]');
    const clear=root.querySelector('[data-camera-clear]');
    let stream;
    let request=0;
    let capture={...initialCapture};
    function render() {
      video.hidden=!stream;
      front.disabled=side.disabled=!stream;
      start.disabled=Boolean(stream);
      stop.disabled=!stream;
      clear.disabled=!capture.front&&!capture.side;
      front.textContent=capture.front?'Retake front':'Capture front';
      side.textContent=capture.side?'Retake side':'Capture side';
      update(capture.front&&capture.side?capture:null);
    }
    function cleanup() {
      request++;
      stream?.getTracks().forEach(track=>track.stop());
      stream=undefined;
      video.srcObject=null;
      render();
    }
    start.onclick=async()=>{
      if (!navigator.mediaDevices?.getUserMedia) {
        status.textContent='Camera access needs an HTTPS page and camera permission. You can still enter your measurements.';
        return;
      }
      const attempt=++request;
      start.disabled=true;
      status.textContent='Waiting for camera access…';
      try {
        const next=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:960},height:{ideal:720}},audio:false});
        if (attempt!==request||!root.isConnected) {
          next.getTracks().forEach(track=>track.stop());
          return;
        }
        stream=next;
        video.srcObject=next;
        status.textContent='Stand centered and capture a front view and a side view.';
        render();
      } catch {
        if (attempt!==request) return;
        status.textContent='Camera unavailable. Check camera permission or enter your measurements manually.';
        render();
      }
    };
    for (const [key,button] of [['front',front],['side',side]]) button.onclick=()=>{
      try {
        capture[key]=readFrame(video);
        status.textContent=capture.front&&capture.side?'Both views captured. The shape will be saved with your measurements.':
          key==='front'?'Front captured. Turn sideways and capture the side.':'Side captured. Face the camera and capture the front.';
        render();
      } catch (error) {
        status.textContent=error.message;
      }
    };
    stop.onclick=()=>{
      cleanup();
      status.textContent='Camera off. Any captured outline is still available in this form.';
    };
    clear.onclick=()=>{
      capture={};
      status.textContent='Camera outline cleared.';
      render();
    };
    render();
    return cleanup;
  }

  function rings(base,capture) {
    const frontReference=[.07,.08,.101,.132,.124,.101,.122,.14,.119];
    const sideReference=[.086,.092,.087,.096,.105,.081,.101,.106,.085];
    const scale=(actual,expected)=>Math.max(.72,Math.min(1.32,actual/expected));
    return base.map(([y,w,d],i)=>[y,w*scale(capture.front[i],frontReference[i]),d*scale(capture.side[i],sideReference[i])]);
  }
  return {measureFrame,setup,rings};
})();
