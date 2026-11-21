'use strict';

const garmentPhoto = (() => {
  const mean = values => values.reduce((a,b)=>a+b,0)/values.length;
  const colorDistance = (a,b) => Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
  const channelHex = n => Math.round(n).toString(16).padStart(2,'0');

  function silhouetteOf(mask,width,height) {
    const left = Array(height).fill(width), right=Array(height).fill(-1);
    let largest = [];
    for (let i=0;i<mask.length;i++) {
      if (!mask[i]) continue;
      const component = [i];
      mask[i]=0;
      for (let j=0;j<component.length;j++) {
        const at = component[j], col = at%width;
        for (let dy=-1;dy<=1;dy++) {
          for (let dx=-1;dx<=1;dx++) {
            if (col+dx<0 || col+dx>=width) continue;
            const next=at+dy*width+dx;
            if (!mask[next]) continue;
            mask[next]=0;
            component.push(next);
          }
        }
      }
      if (component.length>largest.length) largest = component;
    }
    if (largest.length<width*height*.045 || largest.length>width*height*.85) return {};
    const silhouette = new Uint8Array(mask.length);
    for (const index of largest) {
      const x=index%width,y=Math.floor(index/width);
      silhouette[index]=1;
      left[y]=Math.min(x,left[y]);
      right[y]=Math.max(x,right[y]);
    }
    const minX=Math.min(...left), maxX=Math.max(...right);
    const top=right.findIndex(x=>x>=0), bottom=right.findLastIndex(x=>x>=0);
    const across=maxX-minX+1, span=bottom-top+1;
    if (span<height*.30 || across<width*.22 || minX<1 || maxX>=width-1 || top<1 || bottom>=height-1) return {};
    const fill=largest.length/(across*span);
    if (fill<.24 || fill>.96) return {};
    const centerDistance=Math.abs((minX+maxX+1)/2-width/2)/width;
    const score=span/height + .38*across/width + .19*fill - .65*centerDistance;
    return {left,right,silhouette,largest,minX,maxX,top,bottom,across,span,score};
  }

  function foreground(data,width,height) {
    const pixel = i => data.subarray(i*4,i*4+4);
    const frame = [];
    const pixelCount=width*height;
    for (let y=0;y<height;y++) {
      for (let x=0;x<width;x++) {
        if (x<3||y<3||x>=width-3||y>=height-3) frame.push(pixel(y*width+x));
      }
    }
    const transparent = frame.filter(p=>p[3]<30).length / frame.length > .63;
    const candidate=(test,bridge=false)=>{
      const mask=new Uint8Array(pixelCount);
      for (let i=0;i<mask.length;i++) mask[i]=data[i*4+3]>110 && test(i)?1:0;
      if (bridge) {
        // Restore a one-pixel vertical break caused by a highlight on a strap.
        for (let i=width;i<mask.length-width;i++) if (mask[i-width]&&mask[i+width]) mask[i]=1;
      }
      return silhouetteOf(mask,width,height);
    };
    if (transparent) return candidate(()=>true);

    const background = [0,1,2].map(c=>mean(frame.map(p=>p[c])));
    const variation = mean(frame.map(p=>colorDistance(p,background)));
    const choices=[];
    if (variation<=42) choices.push(candidate(i=>colorDistance(pixel(i),background)>Math.max(28,variation*2.2)));

    // Product screenshots often contain a white footer and a textured backdrop.
    // Group garment colors by hue independently of those border pixels.
    const buckets=Array.from({length:24},()=>({count:0,x:0,y:0}));
    const tones=new Float32Array(pixelCount*3);
    for (let i=0;i<pixelCount;i++) {
      const x=i%width, y=Math.floor(i/width);
      const [r,g,b,a]=pixel(i);
      if (a<110) continue;
      const cx=r-g, cy=b-g;
      const chroma=Math.hypot(cx,cy);
      if (chroma<Math.max(12,(r+g+b)*.034)) continue;
      tones[i*3]=cx/chroma;
      tones[i*3+1]=cy/chroma;
      tones[i*3+2]=chroma;
      if (x<width*.12 || x>width*.88 || y<height*.06 || y>height*.89) continue;
      const bucket=buckets[Math.min(23,Math.floor((Math.atan2(cy,cx)+Math.PI)*12/Math.PI))];
      bucket.count++;
      bucket.x+=cx/chroma;
      bucket.y+=cy/chroma;
    }
    const tried=[];
    for (const bucket of buckets.sort((a,b)=>b.count-a.count)) {
      if (tried.length>=5 || bucket.count<pixelCount*.012) break;
      const magnitude=Math.hypot(bucket.x,bucket.y);
      if (!magnitude) continue;
      const hx=bucket.x/magnitude, hy=bucket.y/magnitude;
      if (tried.some(([x,y])=>x*hx+y*hy>.94)) continue;
      tried.push([hx,hy]);
      const outline=candidate(i=>tones[i*3+2]>0 && tones[i*3]*hx+tones[i*3+1]*hy>.68,true);
      if (outline.largest) choices.push({...outline,score:outline.score+.10});
    }
    return choices.filter(outline=>outline.largest).sort((a,b)=>b.score-a.score)[0] || {};
  }

  function strapShape(mask,width,top,span,left,right) {
    const detections=[];
    const across=right-left+1;
    for (let y=top;y<=top+Math.max(3,Math.round(span*.11));y++) {
      const bands=[];
      for (let x=left;x<=right;x++) {
        if (!mask[y*width+x]) continue;
        if (bands.length && bands.at(-1).right===x-1) bands.at(-1).right=x;
        else bands.push({left:x,right:x});
      }
      if (bands.length!==2) continue;
      const [a,b]=bands;
      const extent=b.right-a.left+1;
      const gap=b.left-a.right-1;
      const aw=a.right-a.left+1, bw=b.right-b.left+1;
      if (extent<across*.30 || gap<extent*.48 || Math.max(aw,bw)>2.8*Math.min(aw,bw)) continue;
      detections.push({ratio:(aw+bw)/extent,y,x:[(a.left+a.right)/2,(b.left+b.right)/2]});
    }
    const reliable=detections.length>=Math.max(2,Math.round(span*.023)) && detections[0].y<top+span*.062;
    if (!reliable) return {};
    const narrowness=mean(detections.map(d=>d.ratio));
    return {support:narrowness<.26?'Spaghetti straps':'Narrow straps',points:detections[0].x.map(x=>[x,detections[0].y])};
  }

  function hemShape(mask,width,left,right,top,bottom) {
    const span=bottom-top+1, across=right-left+1;
    const points=[];
    for (let x=Math.round(left+across*.17);x<=right-across*.17;x++) {
      const lower=[];
      for (let dx=-1;dx<=1;dx++) {
        let y=bottom;
        while (y>top+span*.68 && !mask[y*width+x+dx]) y--;
        lower.push(y);
      }
      const y=lower.sort((a,b)=>a-b)[1];
      if (y>top+span*.68) points.push([x,y]);
    }
    if (points.length<across*.45) return {};
    const sorted=points.slice().sort((a,b)=>a[1]-b[1]);
    const high=sorted[Math.floor(sorted.length*.13)];
    const low=sorted[Math.floor(sorted.length*.88)];
    const difference=low[1]-high[1];
    if (difference<Math.max(4,span*.046)) return {};
    // Look for an interior rise between hanging points. A gradually curved
    // regular hem reads as a single bow, even if the outside edges are higher.
    const threshold=Math.max(3,span*.032);
    const leftLow=points.findIndex(p=>p[1]>=low[1]-threshold*.5);
    const rightLow=points.findLastIndex(p=>p[1]>=low[1]-threshold*.5);
    const hasValley=points.some((point,i)=>point[1]<high[1]+threshold*.72 && i>leftLow+1 && i<rightLow-1);
    const isolatedPoint=points[0][1]-points.at(-1)[1]>threshold*1.4 || points.at(-1)[1]-points[0][1]>threshold*1.4;
    if (!hasValley && !isolatedPoint) return {};
    return {hemStyle:'Fairy / handkerchief',points:[high,low]};
  }

  function analyze(data,width,height) {
    const shape=foreground(data,width,height);
    const {left,right,silhouette,largest,minX,maxX,top,bottom,across,span} = shape;
    if (!largest) return {};
    const rows = right.map((edge,y)=>Math.max(0,edge-left[y]+1));
    const row = fraction => Math.round(top+(span-1)*fraction);
    const band = (from,to) => mean(rows.slice(row(from),row(to)+1));
    const upper = band(.15,.27), middle = band(.42,.57), hem = band(.72,.88);
    const torso = band(.29,.4);
    const rgb = [0,1,2].map(c=>mean(largest.map(index=>data[index*4+c])));
    const primary = '#'+rgb.map(channelHex).join('');
    const normalize=points=>points?.map(([x,y])=>[x/width,y/height]);
    const photoOutline={left:minX/width,right:maxX/width,top:top/height,bottom:bottom/height};
    const strap=strapShape(silhouette,width,top,span,minX,maxX);
    let pantsRows=0;
    if (!strap.support) for (let y=row(.58);y<=row(.87);y++) {
      const midpoint=(minX+maxX)/2;
      const gap=Math.max(1,Math.round(across*.027));
      const isOpen=Array.from({length:gap*2+1},(_,i)=>Math.round(midpoint)+i-gap).every(x=>!silhouette[y*width+x]);
      if (isOpen && rows[y]>across*.48 && left[y]<midpoint-across*.2 && right[y]>midpoint+across*.2) pantsRows++;
    }
    if (pantsRows>span*.20) return {model:'trousers',cut:hem>upper*1.12?'Wide leg':hem<upper*.71?'Tapered':'Straight',primary,photoOutline};

    const shoulderWidths=rows.slice(row(.02),row(.25)+1).sort((a,b)=>a-b);
    const widestShoulder=shoulderWidths[Math.floor(shoulderWidths.length*.86)];
    const elbowWidth=band(.28,.38);
    const sleeves=!strap.support && widestShoulder>elbowWidth*1.28 && widestShoulder>upper*1.25;
    const bodice={sleeve:strap.support?'Sleeveless':sleeves?'Short':undefined,
      support:strap.support,
      neckline:neckShape(silhouette,width,minX,maxX,top,span),primary,photoOutline};
    if (strap.points) photoOutline.strapPoints=normalize(strap.points);
    const hemDetail=hemShape(silhouette,width,minX,maxX,top,bottom);
    if (hemDetail.points) photoOutline.hemPoints=normalize(hemDetail.points);
    const longer=span/across>=1.08;
    if (longer && hem>middle*1.08 && (strap.support || sleeves || upper>middle*.82)) {
      return {model:'dress',cut:hem>middle*1.57?'Full skirt':'A-line',...bodice,hemStyle:hemDetail.hemStyle};
    }
    if (longer && strap.support) return {model:'dress',cut:'Column',...bodice,hemStyle:hemDetail.hemStyle};
    if (!longer && (strap.support || sleeves || upper>=hem*.93)) {
      return {model:'top',cut:middle<upper*.7?'Fitted':hem>middle*1.12?'Boxy':'Straight',...bodice};
    }
    if (hem>upper*1.2 && torso>upper*1.08) {
      return {model:'skirt',cut:hem>upper*1.65?'Full skirt':'A-line',primary,photoOutline,hemStyle:hemDetail.hemStyle};
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

  function inspect(media,width,height,thumbnail) {
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
    const sample = draw(240);
    const result = analyze(sample.getImageData(0,0,canvas.width,canvas.height).data,canvas.width,canvas.height);
    if (thumbnail) return {...result,thumbnail};
    const thumbnailContext = draw(560);
    thumbnailContext.globalCompositeOperation='destination-over';
    thumbnailContext.fillStyle='#fff';
    thumbnailContext.fillRect(0,0,canvas.width,canvas.height);
    return {...result,thumbnail:canvas.toDataURL('image/jpeg',.8)};
  }

  async function decode(source,thumbnail) {
    const image = new Image();
    image.src=source;
    await image.decode();
    return inspect(image,image.naturalWidth,image.naturalHeight,thumbnail);
  }

  async function read(file) {
    const url = URL.createObjectURL(file);
    try {
      return await decode(url);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  async function reanalyze(reference) {
    if (!/^data:image\/(?:jpeg|png|webp);base64,/i.test(reference)) throw Error('Unreadable image');
    return decode(reference,reference);
  }
  const capture=video=>inspect(video,video.videoWidth,video.videoHeight);
  return {analyze,foreground,read,reanalyze,capture};
})();
