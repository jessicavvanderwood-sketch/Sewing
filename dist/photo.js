'use strict';

const garmentPhoto = (() => {
  const mean = values => values.reduce((a,b)=>a+b,0)/values.length;
  const colorDistance = (a,b) => Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
  const channelHex = n => Math.round(n).toString(16).padStart(2,'0');

  function foreground(data,width,height) {
    const pixel = i => data.subarray(i*4,i*4+4);
    const frame = [];
    for (let y=0;y<height;y++) {
      for (let x=0;x<width;x++) {
        if (x<3||y<3||x>=width-3||y>=height-3) frame.push(pixel(y*width+x));
      }
    }
    const transparent = frame.filter(p=>p[3]<30).length / frame.length > .63;
    const background = [0,1,2].map(c=>mean(frame.map(p=>p[c])));
    const variation = mean(frame.map(p=>colorDistance(p,background)));
    if (!transparent && variation>37) return {};
    const mask = new Uint8Array(width*height);
    const threshold = Math.max(36,variation*2.5);
    for (let i=0;i<mask.length;i++) {
      const p = pixel(i);
      mask[i] = p[3]>110 && (transparent || colorDistance(p,background)>threshold) ? 1 : 0;
    }
    // Keep the largest connected silhouette so background flecks do not affect the outline.
    let largest = [];
    for (let i=0;i<mask.length;i++) {
      if (!mask[i]) continue;
      const component = [i];
      mask[i]=0;
      for (let j=0;j<component.length;j++) {
        const at = component[j], col = at%width;
        const neighbors = [at-width,at+width,col>0?at-1:-1,col<width-1?at+1:-1];
        for (const next of neighbors) {
          if (!mask[next]) continue;
          mask[next]=0;
          component.push(next);
        }
      }
      if (component.length>largest.length) largest = component;
    }
    if (largest.length<width*height*.07 || largest.length>width*height*.82) return {};
    const left = Array(height).fill(width), right=Array(height).fill(-1);
    const silhouette = new Uint8Array(mask.length);
    for (const index of largest) {
      const x=index%width,y=Math.floor(index/width);
      silhouette[index]=1;
      left[y]=Math.min(x,left[y]);
      right[y]=Math.max(x,right[y]);
    }
    return {left,right,silhouette,largest};
  }

  function analyze(data,width,height) {
    const {left,right,silhouette,largest} = foreground(data,width,height);
    if (!largest) return {};
    const rows = right.map((edge,y)=>Math.max(0,edge-left[y]+1));
    const top=rows.findIndex(Boolean), bottom=rows.findLastIndex(Boolean), span=bottom-top+1;
    const minX=Math.min(...left), maxX=Math.max(...right), across=maxX-minX+1;
    if (span<height*.32 || across<width*.24 || minX<2 || maxX>=width-2 || top<2 || bottom>=height-2) return {};
    const row = fraction => Math.round(top+(span-1)*fraction);
    const band = (from,to) => mean(rows.slice(row(from),row(to)+1));
    const upper = band(.15,.27), middle = band(.42,.57), hem = band(.78,.91);
    const torso = band(.29,.4);
    const rgb = [0,1,2].map(c=>mean(largest.map(index=>data[index*4+c])));
    const primary = '#'+rgb.map(channelHex).join('');
    let pantsRows=0;
    for (let y=row(.59);y<=row(.87);y++) {
      const midpoint=(minX+maxX)/2;
      const gap=Math.max(1,Math.round(across*.027));
      const isOpen=Array.from({length:gap*2+1},(_,i)=>Math.round(midpoint)+i-gap).every(x=>!silhouette[y*width+x]);
      if (isOpen && rows[y]>across*.48 && left[y]<midpoint-across*.2 && right[y]>midpoint+across*.2) pantsRows++;
    }
    if (pantsRows>span*.15) return {model:'trousers',cut:hem>upper*1.12?'Wide leg':hem<upper*.71?'Tapered':'Straight',primary};
    const sleeveWidth=upper>torso*1.2 && upper>middle*1.25;
    if (span/across<1.1 && (sleeveWidth || upper>=hem*.93)) {
      return {model:'top',cut:middle<upper*.7?'Fitted':hem>middle*1.12?'Boxy':'Straight',sleeve:sleeveWidth?'Short':'Sleeveless',
        neckline:neckShape(silhouette,width,minX,maxX,top,span),primary};
    }
    if (hem>middle*1.11 && span/across>=1.08 && upper>middle*.85) {
      return {model:'dress',cut:hem>middle*1.57?'Full skirt':'A-line',sleeve:sleeveWidth?'Short':'Sleeveless',
        neckline:neckShape(silhouette,width,minX,maxX,top,span),primary};
    }
    if (hem>upper*1.2 && torso>upper*1.08) {
      return {model:'skirt',cut:hem>upper*1.65?'Full skirt':'A-line',primary};
    }
    return {primary};
  }

  function neckShape(mask,width,left,right,top,height) {
    const depthAt=fraction=>{
      const x=Math.round(left+(right-left)*fraction);
      for (let dy=0;dy<height*.23;dy++) if (mask[(top+dy)*width+x]) return dy;
      return null;
    };
    const samples=[.32,.41,.47,.5,.53,.59,.68].map(depthAt);
    if (samples.some(depth=>depth==null)) return undefined;
    const [leftEdge,leftInner,nearLeft,center,nearRight,rightInner,rightEdge]=samples;
    if (Math.abs(leftEdge-rightEdge)>height*.035 || Math.abs(leftInner-rightInner)>height*.04) return undefined;
    const edge=(leftEdge+rightEdge)/2;
    const inner=(leftInner+rightInner)/2;
    const depth=center-edge;
    if (depth<Math.max(5,height*.065)) return undefined;
    if (center-inner>=depth*.36 && center>nearLeft && center>nearRight) return 'V-neck';
    if (Math.max(...samples.slice(1,-1))-Math.min(...samples.slice(1,-1))<=1 && inner-edge>=depth*.72) return 'Square';
    if (inner-edge>depth*.3 && inner-edge<depth*.85) return 'Scoop';
    return undefined;
  }

  function inspect(media,width,height) {
    if (!width || !height) throw Error('Unreadable image');
    const canvas = document.createElement('canvas');
    function draw(max) {
      const scale = Math.min(1,max/Math.max(width,height));
      canvas.width = Math.max(1,Math.round(width*scale));
      canvas.height = Math.max(1,Math.round(height*scale));
      const context = canvas.getContext('2d',{willReadFrequently:true});
      context.drawImage(media,0,0,canvas.width,canvas.height);
      return context;
    }
    const sample = draw(112);
    const result = analyze(sample.getImageData(0,0,canvas.width,canvas.height).data,canvas.width,canvas.height);
    const thumbnailContext = draw(560);
    thumbnailContext.globalCompositeOperation='destination-over';
    thumbnailContext.fillStyle='#fff';
    thumbnailContext.fillRect(0,0,canvas.width,canvas.height);
    return {...result,thumbnail:canvas.toDataURL('image/jpeg',.8)};
  }

  async function read(file) {
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src=url;
      await image.decode();
      return inspect(image,image.naturalWidth,image.naturalHeight);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  const capture=video=>inspect(video,video.videoWidth,video.videoHeight);
  return {analyze,foreground,read,capture};
})();
