'use strict';

const patterns = [
  {id:'dress',name:'The Studio Dress',type:'Dresses',cut:'Sleeveless A-line',level:'Intermediate',color:'#82354d',fabric:'2.5 m medium-weight cotton, linen or crepe',tools:'Machine, iron, shears, clips, zipper foot, matching thread, 55 cm invisible zipper',steps:[
    'Prewash and press the fabric. Compare bust, waist and hip measurements to your selected A-line pattern and make a test bodice.',
    'Lay out the selected pattern on grain. Cut front and back panels, facings, and interfacing. Transfer darts, notches and zipper marks.',
    'Sew and press the darts. Join the shoulder seams and staystitch the neckline and armholes along the seam allowance.',
    'Apply interfacing to the facings. Finish the neckline and armholes with the facing method specified by your pattern, then understitch where accessible.',
    'Baste and fit the side seams. Stitch and finish them, then install the invisible zipper and close the remaining center-back seam.',
    'Let the skirt hang before leveling the hem. Turn, press and stitch the hem, then verify the zipper and final fit.'
  ]},
  {id:'top',name:'The Linen Shell',type:'Tops',cut:'Boxy sleeveless shell',level:'Beginner',color:'#ac735c',fabric:'1.3 m woven linen or cotton',tools:'Machine, iron, shears, pins, marking chalk, matching thread, bias tape',steps:[
    'Prewash and press the fabric. Compare bust and shoulder measurements with your shell pattern and confirm the head fits through the neckline.',
    'Cut front and back pieces on grain. Transfer the notches and mark the right side of each piece.',
    'Staystitch the neckline. Join, finish and press the shoulder seams.',
    'Baste the side seams and check movement. Adjust the fit, stitch the side seams and finish the raw edges.',
    'Bind the neckline and armholes with bias tape. Press the binding and stitch it neatly in place.',
    'Level the hem, turn the raw edge twice, press and stitch. Check that the garment hangs evenly.'
  ]},
  {id:'shirt',model:'top',sleeves:true,name:'The Everyday Shirt',type:'Tops',cut:'Relaxed woven shirt with sleeves',level:'Intermediate',color:'#737b72',fabric:'2 m light- to medium-weight woven cotton, plus lightweight interfacing',tools:'Sewing machine, iron, fabric shears, pins, marking chalk, matching thread, buttonhole foot and buttons',steps:[
    'Prewash and press your fabric. Fit a test version of your shirt pattern through the chest, shoulders, and upper sleeves. Check that you can reach forward comfortably.',
    'Cut the fronts, back, sleeves, collar pieces and any plackets or cuffs on grain. Transfer the sleeve cap notches and apply interfacing as directed by the pattern.',
    'Prepare the front plackets and sew the shoulder seams. Staystitch the neckline, then assemble and attach the collar or collar stand.',
    'Match each sleeve to its armhole using the front and back notches. Baste the sleeve caps, try on the shirt, then stitch and finish the armhole seams.',
    'Join or finish the side and underarm seams as your pattern directs. Set the sleeve length during a fitting and sew the sleeve hems or attach the cuffs.',
    'Level, press and stitch the shirt hem. Sew test buttonholes on scrap of the same thickness before marking and sewing the buttonholes and attaching buttons.'
  ]},
  {id:'skirt',name:'The Everyday Skirt',type:'Skirts',cut:'A-line midi',level:'Beginner',color:'#755269',fabric:'1.8 m stable woven fabric',tools:'Machine, iron, shears, pins, zipper foot, interfacing, matching thread, zipper',steps:[
    'Prewash and press the fabric. Choose an A-line skirt pattern using waist and hip measurements, then check wearing ease.',
    'Cut the panels and waistband on grain. Mark darts, notches, zipper placement and the hem allowance.',
    'Sew the darts and press them toward the center. Baste the seams and fit through the waist and hips.',
    'Stitch and finish the seams, leaving the zipper opening free. Install the zipper and close the seam below it.',
    'Interface the waistband. Attach it, finish its inside edge and add the closure specified in your pattern.',
    'Check the hem while worn. Mark a level hem, turn and press the allowance, then stitch and inspect.'
  ]},
  {id:'trousers',name:'The Workroom Trouser',type:'Trousers',cut:'Straight leg',level:'Advanced',color:'#60464c',fabric:'2.2 m twill or suiting',tools:'Machine, iron, tailor’s ham, shears, zipper foot, interfacing, zipper, hook and bar',steps:[
    'Prewash and press the fabric. Make a toile from a straight-leg pattern and check the rise, waist, hips and movement.',
    'Cut the leg panels, pockets, fly pieces and waistband on grain. Mark matching points and reinforce pocket openings.',
    'Construct the pockets and sew the darts or pleats. Baste the side seams, inseams and rise for a fitting.',
    'Finalize the fitted seams, then construct the zipper fly in the sequence specified by the pattern.',
    'Interface and attach the waistband. Add the closure, finish raw edges and press through a press cloth.',
    'Check the length with the intended shoes. Mark both legs independently, turn and stitch the hems, then press the creases.'
  ]}
];

patterns.push(...starterCatalog);

const vanderwoodBrand = {
  name:'Vanderwood',tagline:'',primary:'#26231f',accent:'#a99c8c',neutral:'#d2c8ba',
  notes:'Use the tall, condensed VANDERWOOD wordmark in charcoal on warm mushroom or oat. Keep generous clear space around it. Use a clean sans serif for product details and sizes. Favor matte materials, blind-debossed tags, and photographs that show the cut and texture of the garment.',
  logo:'vanderwood-wordmark.webp'
};
const initial = {
  brand:vanderwoodBrand,
  orders:[
    {id:'WO-001',title:'Studio dress sample',pattern:'dress',due:'',notes:'Use the first toile to check waist placement.',done:[0,1]},
    {id:'WO-002',title:'Linen shell prototype',pattern:'top',due:'',notes:'',done:[]}
  ],
  next:3,
  custom:[],
  models:[],
  fabrics:[],
  archive:{models:[],patterns:[],fabrics:[],orders:[]}
};

const createId = () => globalThis.crypto?.randomUUID?.() || Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
const storageKey = 'jessicas-sewing-v1';
let state = structuredClone(initial);
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved) {
    const wasStarter = !saved.brand || (saved.brand.name==='Jessica’s Sewing' && !saved.brand.logo &&
      saved.brand.primary==='#752c40' && saved.brand.accent==='#c49399' && saved.brand.neutral==='#f2e5dd' &&
      saved.brand.tagline==='Made with care, fitted with intention.' && !saved.brand.notes);
    state = {...state,...saved,archive:{...initial.archive,...saved.archive},brand:wasStarter?{...vanderwoodBrand}:{...initial.brand,...saved.brand}};
  }
} catch {}
const view = document.querySelector('#view');
const modal = document.querySelector('#modal');
const notice = document.querySelector('#notice');
studioUnits.watch(document.querySelector('#length-units'),view,modal);
const titles = {overview:'Overview',design:'New custom piece',brand:'Brand Kit',library:'Pattern Library',fabrics:'Fabric Library',orders:'Work Orders',fitting:'3D Fitting Room',models:'Model Library',basics:'Sewing Basics'};
const features = [['design','✧','Create an original garment or start from a reference photo.'],['library','▤','Browse garment styles, cuts and construction guides.'],['fitting','◇','Preview fit changes and plan your alterations.']];
const escape = (value = '') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const allPatterns = () => [...patterns, ...state.custom];
const getPattern = id => allPatterns().find(pattern => pattern.id === id);
const getOrderPattern = order => order.snapshot || getPattern(order.pattern);
const allModels = () => [...sewingModels.defaults,...state.models];
const getModel = id => allModels().find(model => model.id === id) || allModels()[0];
const isArchived = (key,id) => state.archive[key].includes(id);
const activeChoices = (items,key,selected) => items.filter(item=>item.id===selected || !isArchived(key,item.id));
const modelOptions = selected => activeChoices(allModels(),'models',selected).map(model=>option(model.id,model.name+(isArchived('models',model.id)?' · Archived':''),selected)).join('');
const stockFabrics=Object.entries(fabricFit.fabrics).map(([name,material])=>({name,...material,category:fabricFit.categoryOf(name)}));
const allFabrics=()=>[...state.fabrics,...stockFabrics];
const getFabric=name=>state.fabrics.find(item=>item.name===name) || fabricFit.fabrics[name] || fabricFit.fabrics['Cotton poplin'];
const fabricOptions=selected=>Object.keys(fabricFit.materialGroups).map(category=>{
  const group=allFabrics().filter(item=>item.category===category && (item.name===selected||!isArchived('fabrics',item.name)));
  return group.length?`<optgroup label="${escape(category)}">${group.map(item=>option(item.name,item.name,selected)).join('')}</optgroup>`:'';
}).join('');
let showArchivedFabrics=false;
let preferredFabric='';
let showArchivedModels=false;
let showArchivedPatterns=false;
function moveArchive(key,ids,restoring) {
  const matches = new Set(ids);
  state.archive[key] = restoring
    ? state.archive[key].filter(item=>!matches.has(item))
    : [...new Set([...state.archive[key],...ids])];
  save(restoring?'Restored to library':'Moved to archive');
}
function archiveItem(key,id) {
  moveArchive(key,[id],isArchived(key,id));
}
const basePattern = pattern => patterns.find(base => base.id === (pattern.model || pattern.id)) || patterns[0];
const canTryOn=pattern=>!pattern.external || pattern.tryOn;
const hasSleeves = pattern => pattern.fit?.changes.hasSleeves ?? Boolean(pattern.sleeves);
function shoulderSettings(pattern) {
  const design=pattern.design||{};
  const fit=pattern.fit?.changes||{};
  const model=design.model || basePattern(pattern).id;
  const options=studioDesign.supportChoices(model);
  const requested=fit.support || studioDesign.selectedSupport({...design,model});
  const support=options.includes(requested)?requested:options[0];
  return {support,strapWidth:fit.strapWidth??design.strapWidth??studioDesign.supportWidth(support),
    strapPlacement:fit.strapPlacement??design.strapPlacement??0,
    sleeveStyle:fit.sleeveStyle || (design.sleeve==='Sleeveless'?null:design.sleeve) || 'Short'};
}
function designForFit(design,changes) {
  if (!design) return design;
  const fitAdjustments=Object.fromEntries(Object.entries(changes).filter(([key,value])=>garmentFit.fields[key]&&Number.isFinite(value)&&value!==0));
  const fitted={...design,fitAdjustments};
  if (!changes.support) return fitted;
  return {...fitted,support:changes.support,strapWidth:changes.strapWidth,strapPlacement:changes.strapPlacement,
    sleeve:changes.hasSleeves?changes.sleeveStyle||design.sleeve:'Sleeveless'};
}
const option = (value,name,selected) => `<option value="${escape(value)}"${value===selected?' selected':''}>${escape(name)}</option>`;
const patternCategory=pattern=>pattern.category || ({dress:'Dresses by silhouette',top:'Tops by silhouette',skirt:'Skirts by silhouette',trousers:'Pants by silhouette'}[basePattern(pattern).id]);
const options = (selected,fittingOnly=false) => {
  const groups=new Map();
  for (const p of activeChoices(allPatterns(),'patterns',selected).filter(p=>!fittingOnly||canTryOn(p))) {
    if (!groups.has(p.type)) groups.set(p.type,[]);
    groups.get(p.type).push(p);
  }
  return [...groups].map(([type,items])=>`<optgroup label="${escape(type)}">${items.map(p=>option(p.id,p.name+(p.revision?' · Revision '+p.revision:''),selected)).join('')}</optgroup>`).join('');
};
const heading = (title,description) => `<div class="page-title"><h1>${title}</h1><p>${description}</p></div>`;
const color = value => /^#[\da-f]{6}$/i.test(value) ? value : '#752c40';
let noticeTimer;
function save(message) {
  try {
    localStorage.setItem(storageKey,JSON.stringify(state));
    if (message) notify(message);
  } catch {
    notify('Browser storage is unavailable or full. These changes are available for this session.');
  }
}
function notify(message) {
  notice.textContent = message;
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => { notice.textContent = ''; },4000);
}
function orderTable(orders) {
  if (!orders.length) return '<div class="card empty"><p>Your work orders will appear here.</p></div>';
  return `<div class="card table"><table><thead><tr><th scope="col">Work order</th><th scope="col">Pattern</th><th scope="col">Due date</th><th scope="col">Status</th><th scope="col">Progress</th><th scope="col"><span class="muted">Details</span></th></tr></thead><tbody>${orders.map(order => {
    const pattern = getOrderPattern(order);
    const done = order.done.length;
    const total = pattern.steps.length;
    const status = done === total ? 'Complete' : done ? 'In progress' : 'Queued';
    return `<tr><td><strong>${escape(order.title)}</strong><br><span class="muted">${order.id}</span></td><td>${escape(pattern.name)}</td><td>${order.due ? new Date(order.due+'T12:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}) : '—'}</td><td><span class="badge ${done === total ? 'done' : ''}">${status}</span></td><td>${done} / ${total} steps</td><td><button class="secondary" data-action="order" data-id="${order.id}">Open</button></td></tr>`;
  }).join('')}</tbody></table></div>`;
}
function overview() {
  const activeOrders=state.orders.filter(order=>!isArchived('orders',order.id));
  const complete = activeOrders.filter(o => o.done.length === getOrderPattern(o).steps.length).length;
  const stats = [['▤',new Set(activeChoices(allPatterns(),'patterns').map(p=>p.family||p.id)).size,'Library styles'],['▣',activeOrders.length-complete,'Open work orders'],['✓',complete,'Completed orders']];
  view.innerHTML = `<section class="hero"><div><div class="eyebrow">THE SEWING STUDIO</div><h1>Jessica’s Sewing<br>Dashboard</h1><p>Manage your patterns, plan the next make, and refine the fit in one workspace.</p><a class="button" href="#library">Browse patterns</a></div></section>
    <div class="stats">${stats.map(([icon,count,label])=>`<div class="stat"><span class="icon" aria-hidden="true">${icon}</span><div><b>${count}</b><span>${label}</span></div></div>`).join('')}</div>
    <section><div class="section-head"><h2>Studio tools</h2></div><div class="features">${features.map(([key,icon,description])=>`<a class="card feature" href="#${key}"><span class="icon" aria-hidden="true">${icon}</span><h3>${titles[key]}</h3><p>${description}</p></a>`).join('')}</div></section>
    <section class="section"><div class="section-head"><h2>Recent work orders</h2><a href="#orders">View all</a></div>${orderTable(activeOrders.slice(0,4))}</section>`;
}
function brand() {
  const b = state.brand;
  view.innerHTML = heading('Brand Kit','Keep your logo, colors and brand guidelines together.') + `<div class="split"><form id="brand-form" class="panel">
    <label class="field">Brand name<input required maxlength="80" name="name" value="${escape(b.name)}"></label>
    <label class="field">Tagline<input maxlength="140" name="tagline" value="${escape(b.tagline)}"></label>
    <div class="fields">${[['primary','Primary'],['accent','Accent'],['neutral','Neutral']].map(([key,label])=>`<label class="field">${label}<input type="color" name="${key}" value="${color(b[key])}"></label>`).join('')}</div>
    <label class="field">Logo (PNG, JPEG or WebP, up to 1 MB)<input type="file" name="logo" accept="image/png,image/jpeg,image/webp"></label>
    ${b.logo ? '<label class="field"><span><input style="min-height:auto;width:auto" type="checkbox" name="removeLogo"> Remove saved logo</span></label>' : ''}
    <label class="field">Brand guidelines<textarea name="notes" rows="4" maxlength="5000">${escape(b.notes)}</textarea></label><div class="actions"><button>Save brand kit</button><button type="button" class="secondary" id="apply-vanderwood">Use Vanderwood identity</button></div></form><div class="panel brand-preview" id="brand-preview"></div></div>`;
  const form = document.querySelector('#brand-form');
  const preview = document.querySelector('#brand-preview');
  function update() {
    const data = new FormData(form);
    const logo = !data.has('removeLogo') && (b.logo===vanderwoodBrand.logo || /^data:image\/(png|jpeg|webp);base64,[\da-z+/=]+$/i.test(b.logo)) ? b.logo : '';
    preview.style.background = color(data.get('neutral'));
    preview.innerHTML = `<div>${logo ? `<img src="${logo}" alt="${escape(data.get('name'))} wordmark">` : `<h2 style="color:${color(data.get('primary'))}">${escape(data.get('name'))}</h2>`}<p>${escape(data.get('tagline'))}</p><div class="swatches">${['primary','accent','neutral'].map(key=>`<span title="${color(data.get(key))}" style="background:${color(data.get(key))}"></span>`).join('')}</div></div>`;
  }
  update();
  document.querySelector('#apply-vanderwood').onclick=()=>{
    state.brand={...vanderwoodBrand};
    save('Vanderwood identity applied');
    brand();
  };
  form.addEventListener('input',update);
  form.addEventListener('submit',async event => {
    event.preventDefault();
    const data = new FormData(form);
    const file = data.get('logo');
    let logo = data.has('removeLogo') ? '' : b.logo;
    if (file.size) {
      if (file.size > 1048576 || !['image/png','image/jpeg','image/webp'].includes(file.type)) {
        notify('Choose a PNG, JPEG or WebP logo under 1 MB.');
        return;
      }
      try {
        logo = await new Promise((resolve,reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      } catch {
        notify('The selected logo could not be read.');
        return;
      }
    }
    state.brand = {name:data.get('name').trim()||b.name,tagline:data.get('tagline'),primary:data.get('primary'),accent:data.get('accent'),neutral:data.get('neutral'),notes:data.get('notes'),logo};
    save('Brand kit saved');
    if (form.isConnected) brand();
  });
}
function materialLibrary() {
  view.innerHTML=heading('Fabric Library','Browse fabric presets or upload a swatch to use in your designs.')+
    `<div class="toolbar"><label class="field">Search fabrics<input id="fabric-search" type="search" placeholder="Search by fabric name"></label>
    <label class="field">Category<select id="fabric-category"><option value="">All fabrics</option>${Object.keys(fabricFit.materialGroups).map(key=>option(key,key)).join('')}</select></label>
    <button class="secondary" data-action="fabric-archive-toggle">${showArchivedFabrics?'Show active':'Show archive'}</button><button data-action="upload-fabric">＋ Add fabric</button></div>
    <p id="fabric-count" class="muted tight"></p><div class="patterns" id="fabric-results"></div>`;
  const search=document.querySelector('#fabric-search'), category=document.querySelector('#fabric-category');
  const results=document.querySelector('#fabric-results');
  function drawResults() {
    const query=search.value.trim().toLowerCase();
    const matches=allFabrics().filter(item=>isArchived('fabrics',item.name)===showArchivedFabrics &&
      (!category.value||item.category===category.value) && (item.name+' '+item.category).toLowerCase().includes(query));
    document.querySelector('#fabric-count').textContent=`${matches.length} fabrics`;
    results.innerHTML=matches.map(item=>`<article class="card pattern">
      <div class="fabric-swatch" data-weave="${fabricFit.weave(item.name,item.category)}">${item.photo?`<img src="${escape(item.photo)}" alt="${escape(item.name)} uploaded swatch" loading="lazy">`:''}</div>
      <div class="pattern-body"><span class="badge">${escape(item.category)}</span><h3 class="tight">${escape(item.name)}</h3>
      <p>${item.gsm} g/m² · ${Math.round(item.cross*1000)/10}% crosswise · ${Math.round(item.length*1000)/10}% lengthwise</p>
      <div class="actions">${showArchivedFabrics?'':`<button data-action="fit-fabric" data-id="${escape(item.name)}">Use in fitting room</button>`}
      <button class="secondary" data-action="archive-fabric" data-id="${escape(item.name)}">${showArchivedFabrics?'Restore':'Archive'}</button></div></div></article>`).join('') || '<p>No fabrics match your search.</p>';
  }
  search.addEventListener('input',drawResults);
  category.addEventListener('change',drawResults);
  drawResults();
}

function uploadFabric() {
  showDialog('Add fabric',`<form id="fabric-form">
    <section class="swatch-capture" aria-labelledby="swatch-title">
      <strong id="swatch-title">Swatch photo</strong>
      <p>Lay the fabric flat in even light and fill the square with texture.</p>
      <div class="swatch-frame" hidden>
        <video muted playsinline autoplay hidden aria-label="Live fabric camera"></video>
        <img alt="Fabric swatch preview" hidden>
      </div>
      <div class="actions tight">
        <button type="button" id="swatch-camera">Open camera</button>
        <button type="button" id="swatch-capture" hidden disabled>Take photo</button>
        <button type="button" class="secondary" id="swatch-stop" hidden>Close camera</button>
        <button type="button" class="secondary" id="swatch-file-button">Choose photo</button>
        <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" hidden aria-label="Choose swatch photo">
      </div>
      <p id="swatch-status" role="status" class="muted tight"></p>
    </section>
    <div class="fields tight">
      <label class="field">Fabric name<input name="name" maxlength="100" placeholder="e.g. Oat linen from my stash" required></label>
      <label class="field">Fabric type<select name="category">${Object.keys(fabricFit.materialGroups).map(key=>option(key,key)).join('')}</select></label>
    </div>
    <details class="design-options">
      <summary>Weight, drape and stretch</summary>
      <div class="fields tight">
        <label class="field">Weight (g/m²)<input name="gsm" type="number" min="45" max="900" required></label>
        <label class="field">Drape<select name="bend"><option value=".2">Fluid</option><option value=".42">Balanced</option><option value=".65">Structured</option></select></label>
        <label class="field">Crosswise stretch (%)<input name="cross" type="number" min="0" max="100" step=".1" required></label>
        <label class="field">Lengthwise stretch (%)<input name="length" type="number" min="0" max="100" step=".1" required></label>
      </div>
    </details>
    <p id="swatch-settings" class="muted"></p>
    <p class="muted tight">Your swatch stays in this browser.</p>
    <p class="tight" role="alert"></p><button type="submit" class="tight">Save fabric</button></form>`);

  const form=modal.querySelector('#fabric-form');
  const field=name=>form.elements.namedItem(name);
  const frame=form.querySelector('.swatch-frame');
  const video=frame.querySelector('video');
  const image=frame.querySelector('img');
  const start=form.querySelector('#swatch-camera');
  const snap=form.querySelector('#swatch-capture');
  const stop=form.querySelector('#swatch-stop');
  const fileButton=form.querySelector('#swatch-file-button');
  const status=form.querySelector('#swatch-status');
  const settings=form.querySelector('#swatch-settings');
  const error=form.querySelector('[role=alert]');
  const saveButton=form.querySelector('[type=submit]');
  let photo='';
  let stream;
  let generation=0;
  let customSettings=false;

  function showSettings() {
    const label=customSettings?'Your settings':'Starting estimates for this fabric type';
    settings.textContent=`${label} · ${field('gsm').value} g/m² · ${field('bend').selectedOptions[0].textContent} · ${field('cross').value}% crosswise · ${field('length').value}% lengthwise`;
  }
  function setDefaults() {
    const exemplar=fabricFit.materialGroups[field('category').value][0];
    const preset=fabricFit.fabrics[exemplar];
    field('gsm').value=preset.gsm;
    field('bend').value=preset.bend<.31?'.2':preset.bend<.55?'.42':'.65';
    field('cross').value=Math.round(preset.cross*1000)/10;
    field('length').value=Math.round(preset.length*1000)/10;
    customSettings=false;
    showSettings();
  }
  setDefaults();
  field('category').addEventListener('change',setDefaults);
  for (const key of ['gsm','bend','cross','length']) field(key).addEventListener('input',()=>{
    customSettings=true;
    showSettings();
  });

  function releaseCamera() {
    generation++;
    const active=stream;
    stream=undefined;
    active?.getTracks().forEach(track=>track.stop());
    video.srcObject=null;
  }
  modalCleanup=releaseCamera;
  const stillOpen=()=>form.isConnected && modal.open;
  function showStill() {
    video.hidden=snap.hidden=stop.hidden=true;
    snap.disabled=true;
    start.hidden=false;
    start.disabled=false;
    start.textContent=photo?'Retake photo':'Open camera';
    frame.hidden=image.hidden=!photo;
    if (photo) image.src=photo;
  }
  video.addEventListener('loadeddata',()=>{
    snap.disabled=!stream || !video.videoWidth;
  });
  start.onclick=async()=>{
    if (!navigator.mediaDevices?.getUserMedia) {
      status.textContent='Camera is unavailable in this view. Choose a photo from your device.';
      return;
    }
    const attempt=++generation;
    start.disabled=true;
    status.textContent='Waiting for camera permission…';
    error.textContent='';
    try {
      const next=await navigator.mediaDevices.getUserMedia({
        audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:960}}
      });
      if (attempt!==generation || !stillOpen()) {
        next.getTracks().forEach(track=>track.stop());
        return;
      }
      stream=next;
      video.srcObject=stream;
      frame.hidden=video.hidden=snap.hidden=stop.hidden=false;
      image.hidden=start.hidden=true;
      await video.play();
      if (attempt!==generation || !stillOpen()) return;
      snap.disabled=!video.videoWidth;
      status.textContent='Fill the square with fabric, then select Take photo.';
      for (const track of stream.getVideoTracks?.() || []) track.addEventListener('ended',()=>{
        if (attempt!==generation || !stillOpen()) return;
        releaseCamera();
        showStill();
        status.textContent='The camera disconnected. Open it again or choose a photo.';
      });
    } catch (problem) {
      if (attempt!==generation || !stillOpen()) return;
      releaseCamera();
      showStill();
      status.textContent=problem.name==='NotAllowedError'
        ? 'Camera access was declined. Allow camera access in your browser or choose a photo.'
        : 'The camera could not start. Choose a photo or try again.';
    }
  };
  snap.onclick=()=>{
    if (!stream || !video.videoWidth || !video.videoHeight) return;
    try {
      photo=fabricFit.captureSwatch(video);
      releaseCamera();
      showStill();
      status.textContent='Photo captured. Retake it or save this fabric.';
    } catch {
      status.textContent='The photo could not be captured. Try again or choose a photo.';
    }
  };
  stop.onclick=()=>{
    releaseCamera();
    showStill();
    status.textContent=photo?'Previous photo kept.':'Camera closed.';
  };
  fileButton.onclick=()=>field('photo').click();
  field('photo').addEventListener('change',async()=>{
    const file=field('photo').files[0];
    if (!file) return;
    if (!file.size || file.size>15000000 || !['image/jpeg','image/png','image/webp'].includes(file.type)) {
      error.textContent='Choose a JPEG, PNG or WebP under 15 MB.';
      field('photo').value='';
      return;
    }
    releaseCamera();
    showStill();
    const attempt=generation;
    error.textContent='';
    saveButton.disabled=true;
    start.disabled=true;
    status.textContent='Loading photo…';
    try {
      const next=await fabricFit.readSwatch(file);
      if (attempt!==generation || !stillOpen()) return;
      photo=next;
      showStill();
      status.textContent='Photo ready. Check the crop before saving.';
    } catch {
      if (attempt===generation && stillOpen()) {
        error.textContent='The swatch could not be read.';
        status.textContent='';
      }
    } finally {
      if (attempt===generation && stillOpen()) {
        field('photo').value='';
        start.disabled=saveButton.disabled=false;
      }
    }
  });
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const data=new FormData(form);
    const name=data.get('name').trim();
    if (!name || allFabrics().some(item=>item.name.toLowerCase()===name.toLowerCase())) {
      error.textContent='Enter a unique fabric name.';return;
    }
    if (!photo) {error.textContent='Take or choose a swatch photo before saving.';return;}
    const cross=Number(data.get('cross'))/100;
    state.fabrics.unshift({name,photo,category:data.get('category'),gsm:Number(data.get('gsm')),
      cross,length:Number(data.get('length'))/100,bend:Number(data.get('bend')),power:cross>.14?1.58:1.2});
    releaseCamera();
    modalCleanup=undefined;
    save('Fabric swatch saved');
    modal.close();
    showArchivedFabrics=false;
    materialLibrary();
  });
}
function library() {
  view.innerHTML = heading('Pattern Library','Browse garment cuts and construction guides, or add a style from your own pattern collection.') + `<div class="toolbar"><label class="field">Search patterns<input id="pattern-search" type="search" placeholder="Search by style or cut"></label><label class="field">Garment type<select id="pattern-filter"><option value="">All garments</option>${[...new Set(patterns.map(p=>p.type))].map(type=>option(type,type)).join('')}</select></label><label class="field">Collection<select id="pattern-category"><option value="">All collections</option></select></label><button class="secondary" data-action="toggle-pattern-archive">${showArchivedPatterns?'Show active':'Show archive'}</button><a class="button" href="#design">＋ New custom piece</a><button class="secondary" data-action="add-pattern">Add existing pattern</button></div><p class="muted tight" id="pattern-count"></p><div class="patterns" id="patterns"></div><button class="secondary tight" id="more-patterns" hidden>Show more garments</button>`;
  const search = document.querySelector('#pattern-search');
  const filter = document.querySelector('#pattern-filter');
  const container = document.querySelector('#patterns');
  const category = document.querySelector('#pattern-category');
  const more = document.querySelector('#more-patterns');
  let limit=24;
  function results() {
    const query = search.value.trim().toLowerCase();
    const latest = new Map();
    for (const p of allPatterns().filter(item=>isArchived('patterns',item.id)===showArchivedPatterns)) latest.set(p.family || p.id,p);
    const candidates=[...latest.values()].filter(p=>!filter.value || p.type===filter.value);
    const previous=category.value;
    const categories=[...new Set(candidates.map(patternCategory))].sort();
    category.innerHTML='<option value="">All collections</option>'+categories.map(value=>option(value,value,previous)).join('');
    const matches=candidates.filter(p=>(!category.value||category.value===patternCategory(p)) &&
      [p.name,p.type,p.cut,patternCategory(p),p.external?.publisher].join(' ').toLowerCase().includes(query))
      .sort((a,b)=>Number(state.custom.includes(b))-Number(state.custom.includes(a)));
    document.querySelector('#pattern-count').textContent=`${matches.length} garments`;
    more.hidden=matches.length<=limit;
    container.innerHTML = matches.length ? matches.slice(0,limit).map(p=>`<article class="card pattern"><div class="pattern-art">${!canTryOn(p)?`<span class="pattern-source">${escape(p.external.publisher)}<small>Free pattern</small></span>`:`<canvas width="360" height="155" data-pattern="${escape(p.id)}" role="img" aria-label="${escape(p.cut)} illustration"></canvas>`}</div><div class="pattern-body"><span class="badge">${escape(p.type)} · ${escape(patternCategory(p))}</span><h3 class="tight">${escape(p.name)}</h3><p>${escape(p.cut)} · ${p.revision?'Revision '+p.revision:escape(p.level)}</p><button class="secondary" data-action="pattern" data-id="${escape(p.id)}">View ${p.fit?'tailoring guide':'construction guide'}</button> ${canTryOn(p)?`<button class="secondary" data-action="fit" data-id="${escape(p.id)}">${p.external?'Try on in 3D':p.fit?'Revise fit':'Alter garment'}</button>`:''}</div></article>`).join('') : '<p>No styles match your search.</p>';
    for (const canvas of container.querySelectorAll('canvas')) drawModel(canvas,getPattern(canvas.dataset.pattern),-.35,getPattern(canvas.dataset.pattern).fit?.changes || {hasSleeves:hasSleeves(getPattern(canvas.dataset.pattern))}, {},true,{pose:fabricFit.poses.stand,show:false,redraw:results});
  }
  const filterResults=()=>{limit=24;results();};
  search.addEventListener('input',filterResults);
  filter.addEventListener('change',filterResults);
  category.addEventListener('change',filterResults);
  more.addEventListener('click',()=>{limit+=24;results();});
  results();
}
let showArchivedOrders=false;
const orderFilters={query:'',kind:'',status:''};
const orderStatus=order=>{
  const count=getOrderPattern(order).steps.length;
  return order.done.length===count?'Complete':order.done.length?'In progress':'Queued';
};
const orderKind=order=>order.kind ||
  (getPattern(order.pattern)?.fit && !order.snapshot?.measurements?.make && !getOrderPattern(order).measurements?.make &&
    (!order.snapshot || /Revision .* to |->/.test(order.notes))?'Tailoring':'Construction');

function orderPreview(order) {
  const after=getPattern(order.pattern);
  if (!after) return '';
  if (!canTryOn(after)) return `<div class="wo-preview wo-reference"><span>${escape(after.cut)}</span></div>`;
  const before=orderKind(order)==='Tailoring'?getPattern(order.before || after.fit?.source):null;
  const frames=[...(before?[[before,'Before']]:[]),[after,before?'After':'Garment preview']];
  return `<div class="wo-preview">${frames.map(([pattern,label])=>`<figure><canvas width="150" height="130" data-order-preview="${escape(pattern.id)}"${order.plan?.modelId?` data-order-model="${escape(order.plan.modelId)}"`:''} role="img" aria-label="${escape(label+' · '+pattern.name)}"></canvas><figcaption>${label}</figcaption></figure>`).join('')}</div>`;
}

function drawOrderPreviews(root) {
  for (const canvas of root.querySelectorAll('[data-order-preview]')) {
    const item=getPattern(canvas.dataset.orderPreview);
    if (!item) continue;
    drawModel(canvas,item,-.27,item.fit?.changes||{hasSleeves:hasSleeves(item)},item.fit?.modelMeasurements||(canvas.dataset.orderModel||item.design?.fitModelId?getModel(canvas.dataset.orderModel||item.design.fitModelId):{}),true,
      {pose:fabricFit.poses.stand,show:false,fabricName:item.fit?.fabric?.name || item.design?.fabric,redraw:()=>drawOrderPreviews(root)});
  }
}

function orders() {
  view.innerHTML=heading('Work Orders','Find construction and alteration jobs, review the garment, and track each step.')+
  `<div class="toolbar"><label class="field">Search work orders<input type="search" id="order-search" value="${escape(orderFilters.query)}" placeholder="Title, garment, number or notes"></label>
    <label class="field">Order type<select id="order-kind"><option value="">All types</option>${['Construction','Tailoring'].map(kind=>option(kind,kind,orderFilters.kind)).join('')}</select></label>
    <label class="field">Status<select id="order-status"><option value="">All statuses</option>${['Queued','In progress','Complete'].map(status=>option(status,status,orderFilters.status)).join('')}</select></label>
    <button class="secondary" data-action="order-archive-toggle">${showArchivedOrders?'Show active':'Show archive'}</button></div>
    <p class="muted tight" id="order-count"></p><div id="order-results" class="wo-grid"></div>`;
  const search=view.querySelector('#order-search');
  const kind=view.querySelector('#order-kind');
  const status=view.querySelector('#order-status');
  const results=view.querySelector('#order-results');
  function filter() {
    Object.assign(orderFilters,{query:search.value,kind:kind.value,status:status.value});
    const query=search.value.trim().toLowerCase();
    const matches=state.orders.filter(order=>isArchived('orders',order.id)===showArchivedOrders &&
      (!kind.value||kind.value===orderKind(order)) && (!status.value||status.value===orderStatus(order)) &&
      [order.title,order.id,order.notes,getOrderPattern(order).name,getPattern(order.pattern)?.type].join(' ').toLowerCase().includes(query));
    view.querySelector('#order-count').textContent=`${matches.length} ${showArchivedOrders?'archived':'active'} work orders`;
    results.innerHTML=matches.map(order=>`<article class="card wo-card">${orderPreview(order)}<div class="wo-card-body">
      <div class="wo-tags"><span class="badge">${orderKind(order)}</span><span class="badge ${orderStatus(order)==='Complete'?'done':''}">${orderStatus(order)}</span></div>
      <h3>${escape(order.title)}</h3><p>${order.id} · ${order.done.length}/${getOrderPattern(order).steps.length} steps${order.due?' · Due '+escape(order.due):''}</p>
      <div class="actions"><button data-action="order" data-id="${order.id}">Open work order</button>
      <button class="secondary" data-action="archive-order" data-id="${order.id}">${showArchivedOrders?'Restore':'Archive'}</button></div></div></article>`).join('') || '<p>No work orders match this view.</p>';
    drawOrderPreviews(results);
  }
  search.addEventListener('input',filter);
  kind.addEventListener('change',filter);
  status.addEventListener('change',filter);
  filter();
}
let modalCleanup;
modal.addEventListener('close',()=>{
  if (!modal.open) {modalCleanup?.();modalCleanup=undefined;}
});
function showDialog(title, body) {
  modalCleanup?.();
  modalCleanup=undefined;
  modal.innerHTML = `<div class="dialog-head"><h2>${escape(title)}</h2><button class="secondary close" type="button" data-action="close" aria-label="Close dialog">×</button></div>${body}`;
  studioUnits.refresh(modal);
  if (!modal.open) modal.showModal();
}
const referenceLinks=pattern=>pattern?.external?`<div class="actions tight"><a href="${escape(pattern.external.url)}" target="_blank" rel="noopener" class="button">Open free pattern at ${escape(pattern.external.publisher)}</a>${pattern.external.sewing?`<a href="${escape(pattern.external.sewing)}" target="_blank" rel="noopener" class="button secondary">Publisher sewing instructions</a>`:''}<a href="${escape(pattern.external.terms)}" target="_blank" rel="noopener" class="button secondary">Publisher terms</a></div>`:'';
function patternDetails(pattern) {
  const revisions = pattern.family ? allPatterns().filter(p=>p.family===pattern.family && isArchived('patterns',p.id)===isArchived('patterns',pattern.id)).sort((a,b)=>b.revision-a.revision) : [];
  const revisionPicker = revisions.length ? `<label class="field">Revision<select id="revision-picker">${revisions.map(p=>option(p.id,'Revision '+p.revision,p.id===pattern.id?p.id:null)).join('')}</select></label>` : '';
  showDialog(pattern.name,`${revisionPicker}${referenceLinks(pattern)}${pattern.reference?.startsWith('data:image/jpeg;base64,')?`<figure class="design-reference"><img src="${escape(pattern.reference)}" alt="Uploaded garment reference"><figcaption>Reference photo</figcaption></figure>`:''}<p>${escape(pattern.cut)} · ${escape(pattern.level)}</p><p class="tight"><strong>Suggested fabric</strong> ${escape(pattern.fabric)}</p><p class="tight"><strong>Tools and notions</strong> ${escape(pattern.tools)}</p>${sewingVisuals.tools(pattern.tools)}${sewingVisuals.steps(pattern.steps, pattern.visuals || sewingVisuals.patterns[pattern.id])}<div class="actions"><button data-action="new" data-id="${escape(pattern.id)}">${pattern.revision?'Make this revision again':'Create work order'}</button>${canTryOn(pattern)?`<button class="secondary" data-action="fit" data-id="${escape(pattern.id)}">${pattern.external?'Try on in 3D':pattern.revision?'Revise this fit':'Open fitting room'}</button>`:''}${pattern.design && !pattern.external?`<button class="secondary" data-action="copy-design" data-id="${escape(pattern.id)}">Customize design copy</button>`:''}<button class="secondary" data-action="archive-pattern" data-id="${escape(pattern.id)}">${isArchived('patterns',pattern.id)?'Restore':pattern.revision?'Archive this revision':'Archive garment'}</button>${revisions.length>1?`<button class="secondary" data-action="archive-family" data-id="${escape(pattern.id)}">${isArchived('patterns',pattern.id)?'Restore all revisions':'Archive all revisions'}</button>`:''}</div>`);
  modal.querySelector('#revision-picker')?.addEventListener('change',event=>patternDetails(getPattern(event.target.value)));
}
function addPattern() {
  showDialog('Add a style',`<form id="pattern-form"><label class="field">Style name<input required maxlength="100" name="name"></label><div class="fields"><label class="field">Garment type<select name="model">${patterns.filter(p=>!p.id.startsWith('catalog-')).map(p=>option(p.id,p.id==='shirt'?'Shirt with sleeves':p.id==='top'?'Sleeveless top':p.type)).join('')}</select></label><label class="field">Clothing cut<input required maxlength="100" name="cut"></label></div><label class="field">Skill level<select name="level"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label><label class="field">Fabric and quantity<input required maxlength="200" name="fabric"></label><label class="field">Tools and notions<textarea required maxlength="2000" name="tools" rows="2"></textarea></label><label class="field">Construction steps (one per line)<textarea required maxlength="10000" name="steps" rows="6"></textarea></label><button>Save style</button></form>`);
  document.querySelector('#pattern-form').addEventListener('submit',event => {
    event.preventDefault();
    const data = new FormData(event.target);
    const read = key => data.get(key).trim();
    const steps = read('steps').split(/\n/).map(s=>s.trim()).filter(Boolean);
    if (!read('name') || !read('cut') || !read('tools') || !read('fabric') || !steps.length) { notify('Fill in each style field and add a construction step.'); return; }
    const base = getPattern(read('model'));
    state.custom.push({id:'custom-'+Date.now().toString(36),model:basePattern(base).id,sleeves:base.sleeves,type:base.type,color:base.color,name:read('name'),cut:read('cut'),level:read('level'),fabric:read('fabric'),tools:read('tools'),steps});
    save('Style added');
    modal.close();
    library();
  });
}
function newOrder(id,existing,modelId) {
  if (!id && !existing && !activeChoices(allPatterns(),'patterns').length) {
    showDialog('New work order','<p>Add or restore a garment in the Pattern Library to create a work order.</p><a class="button tight" href="#library">Open Pattern Library</a>');
    return;
  }
  showDialog(existing ? 'Edit work order' : 'New work order', `<form id="order-form"><label class="field">Work order name<input name="title" required maxlength="120" value="${escape(existing?.title || (getPattern(id)?.revision?getPattern(id).name+' · Revision '+getPattern(id).revision:''))}"></label><label class="field">Pattern<select name="pattern" ${(existing?.done.length || existing?.snapshot || getPattern(id)?.revision) ? 'disabled' : ''}>${options(existing?.pattern || id)}</select></label><label class="field">Due date<input type="date" name="due" value="${escape(existing?.due || '')}"></label><label class="field">Fabric, sizing or fitting notes<textarea name="notes" rows="4" maxlength="7000">${escape(existing?.notes || '')}</textarea></label><button>Save work order</button></form>`);
  const form = document.querySelector('#order-form');
  form.addEventListener('submit',event => {
    event.preventDefault();
    const data = new FormData(form);
    const title = data.get('title').trim();
    if (!title) { notify('Enter a work order name.'); return; }
    const details = {title,pattern:data.get('pattern') || existing?.pattern || id,due:data.get('due'),notes:data.get('notes')};
    const order = existing || {id:'WO-'+String(state.next++).padStart(3,'0'),kind:'Construction',done:[]};
    Object.assign(order,details);
    if (!existing) {
      const selected = getPattern(order.pattern);
      if (selected?.rebuildSteps) order.snapshot = {name:selected.name,steps:selected.rebuildSteps,visuals:selected.rebuildVisuals,
        fabric:selected.buildFabric,tools:selected.buildTools,measurements:selected.measurements?.make?selected.measurements:undefined};
      if (modelId) order.plan={modelId};
      state.orders.unshift(order);
    }
    save('Work order saved');
    if (!existing) showNewOrders();
    modal.close();
    if (location.hash === '#orders') orders();
    else location.hash = 'orders';
  });
}
function showNewOrders() {
  showArchivedOrders=false;
  Object.assign(orderFilters,{query:'',kind:'',status:''});
}
const workAllowanceFields={seam:'General seam allowance',neck:'Neckline seam allowance',armhole:'Armhole seam allowance',
  first:'First hem turn',second:'Second hem turn',topstitch:'Topstitch distance from edge'};
const workPlanLengths={
  usableWidth:'Usable fabric width between selvages',
  pocketWidth:'Finished pocket width',pocketHeight:'Finished pocket height',
  pocketDown:'Pocket top below reference line',pocketAcross:'Pocket inner edge from center front',
  zipperOpening:'Zipper opening length',buttonSpacing:'Button center spacing',
  strapLength:'Finished strap length',strapWidth:'Finished strap width',casingWidth:'Finished elastic casing depth'
};
const cutModes={pattern:'As marked on pattern',fold:'Place on fold',pair:'Mirror a pair',single:'Cut a single layer'};
function workLengthField(name,label,value,max=500) {
  return `<label class="field">${label} (cm)<input type="number" data-length-input name="${name}" min="0.05" max="${max}" value="${escape(value??'')}"></label>`;
}
function cutPieceFields(piece={}) {
  return `<fieldset class="cut-piece"><legend>Pattern piece</legend><div class="fields tight">
    <label class="field">Piece name<input name="pieceName" maxlength="80" required value="${escape(piece.name||'')}" placeholder="e.g. Front bodice"></label>
    <label class="field">Number to cut<input type="number" name="quantity" min="1" max="30" step="1" value="${escape(piece.quantity??'')}"></label>
    <label class="field">Placement<select name="mode">${Object.entries(cutModes).map(([key,label])=>option(key,label,piece.mode)).join('')}</select></label>
    ${workLengthField('width','Paper piece width',piece.width)}${workLengthField('length','Paper piece length',piece.length)}
    ${workLengthField('grain','Grainline distance to selvage',piece.grain)}
    </div><button type="button" class="secondary" data-remove-cut-piece>Remove piece</button></fieldset>`;
}
function allowanceEditor(order,pattern,formId='allowance-form') {
  const plan=order.plan||{};
  const choose=(name,label,choices)=>`<label class="field">${label}<select name="${name}">${Object.entries(choices).map(([key,value])=>option(key,value,plan[name])).join('')}</select></label>`;
  const dimension=key=>workLengthField(key,workPlanLengths[key],plan[key]);
  return `<details class="design-options wo-allowances"><summary>Pattern measurements, cutting and options</summary>
    <form id="${formId}" class="tight" data-work-measurements>
      <p>Copy values from the paper pattern or your fitting sample to label the dimensions in the drawings. Leave fields blank if the pattern specifies a different amount for each piece.</p>
      ${pattern.measurements?'':`<label class="field">Model for body measurements<select name="modelId"><option value="">No model selected</option>${modelOptions(plan.modelId)}</select></label>`}
      <div class="fields tight">${Object.entries(workAllowanceFields).map(([key,label])=>
        workLengthField(key,label,order.allowances?.[key],30)
      ).join('')}</div>
      <details class="design-options"${plan.pieces?.length?' open':''}><summary>Fabric layout and cutting list</summary>
        <div class="fields tight">
          ${choose('layout','Fabric layout',{pattern:'Follow pattern layout',folded:'Fold selvage to selvage',single:'Cut in a single layer'})}
          ${dimension('usableWidth')}
        </div>
        <label class="sleeve-choice"><input type="checkbox" name="oneWay"${plan.oneWay?' checked':''}> Keep nap or print in one direction</label>
        <p class="muted tight">Record the actual paper pieces, quantities and grainline distances to label the cutting figures.</p>
        <div id="cut-piece-fields">${(plan.pieces||[]).map(cutPieceFields).join('')}</div>
        <button type="button" class="secondary tight" id="add-cut-piece">Add pattern piece</button>
      </details>
      <details class="design-options"><summary>Seams and feature placement</summary>
        <div class="fields tight">
          ${choose('seamFinish','Seam finish',{pattern:'Follow pattern',plain:'Plain seam with zigzag finish',french:'French seam',felled:'Flat-felled seam',stretch:'Stretch seam'})}
          ${choose('pocket','Pocket plan',{pattern:'Follow pattern',patch:'Patch pocket',inseam:'In-seam pocket',omit:'Skip optional pockets'})}
        </div>
        <div class="fields tight">${dimension('pocketWidth')}${dimension('pocketHeight')}${dimension('pocketDown')}${dimension('pocketAcross')}</div>
        <label class="field">Horizontal pocket reference<input name="pocketReference" maxlength="65" placeholder="e.g. Waistline or shoulder reference line" value="${escape(plan.pocketReference||'')}"></label>
        <div class="fields tight">${dimension('zipperOpening')}${dimension('buttonSpacing')}${dimension('strapLength')}${dimension('strapWidth')}${dimension('casingWidth')}</div>
      </details>
      <button type="submit">${formId==='allowance-form'?'Save figure measurements':'Apply figure measurements'}</button>
    </form></details>`;
}

function bindMeasurementEditor(container,onSave) {
  const planForm=container.querySelector('[data-work-measurements]');
  planForm.querySelector('#add-cut-piece').onclick=()=>{
    const list=planForm.querySelector('#cut-piece-fields');
    list.insertAdjacentHTML('beforeend',cutPieceFields());
    studioUnits.refresh(list.lastElementChild);
    list.lastElementChild.querySelector('input').focus();
  };
  planForm.addEventListener('click',event=>{
    if (event.target.matches('[data-remove-cut-piece]')) event.target.closest('.cut-piece').remove();
  });
  function readMeasurements() {
    const values=new FormData(planForm);
    const lengths=keys=>Object.fromEntries(keys.flatMap(key=>{
      const value=studioUnits.lengthValue(planForm.elements.namedItem(key));
      return value==null?[]:[[key,value]];
    }));
    const allowances=lengths(Object.keys(workAllowanceFields));
    const pieces=[...planForm.querySelectorAll('.cut-piece')].flatMap(row=>{
      const name=row.querySelector('[name=pieceName]').value.trim();
      if (!name) return [];
      const quantity=Number(row.querySelector('[name=quantity]').value)||null;
      const mode=row.querySelector('[name=mode]').value;
      const dimensions=Object.fromEntries(['width','length','grain'].map(key=>[key,studioUnits.lengthValue(row.querySelector(`[name="${key}"]`))]));
      return [{name,quantity,mode,...dimensions}];
    });
    const plan={...lengths(Object.keys(workPlanLengths)),modelId:values.get('modelId')||undefined,layout:values.get('layout'),seamFinish:values.get('seamFinish'),
      pocket:values.get('pocket'),oneWay:values.has('oneWay'),pocketReference:values.get('pocketReference').trim(),pieces};
    return {allowances,plan};
  }
  planForm.addEventListener('submit',event=>{
    event.preventDefault();
    onSave(readMeasurements());
  });
  return readMeasurements;
}
function orderFigureSections(order,pattern,measurements) {
  return `${workFigures.referenceSheet(pattern.reference,pattern.design,order,measurements)}
    ${workFigures.cuttingPlan(order,pattern)}${workFigures.seamPlan(order)}${workFigures.featurePlan(order,pattern.design)}`;
}
function orderDetails(order) {
  const original=getPattern(order.pattern);
  const pattern={...getOrderPattern(order),design:original?.design,reference:original?.reference};
  const referenceBody=order.plan?.modelId?getModel(order.plan.modelId):null;
  const measurements=pattern.measurements || (referenceBody?fitMeasurementSheet(referenceBody,{hasSleeves:hasSleeves(original||pattern)},{},true,original||pattern,referenceBody):null);
  const notes=order.notes || original?.design?.details;
  showDialog(order.title,`${orderPreview(order)}<p>${order.id} · ${escape(pattern.name)}</p>${notes ? `<p class="tight" style="white-space:pre-wrap">${escape(notes)}</p>` : ''}<p class="tight"><strong>Fabric</strong> ${escape(pattern.fabric)}</p><p class="tight"><strong>Tools and notions</strong> ${escape(pattern.tools)}</p>${referenceLinks(original)}${sewingVisuals.tools(pattern.tools)}${fitMeasurementTable(measurements)}${workFigures.bodySheet(measurements)}${allowanceEditor(order,pattern)}
    ${orderFigureSections(order,pattern,measurements)}
    ${sewingVisuals.machineGuide()}${workFigures.machineActions()}<h3 class="tight">Step checklist</h3><p id="order-progress" aria-live="polite">${order.done.length} of ${pattern.steps.length} steps completed</p>${workFigures.stepList(pattern,order,measurements)}
    <button class="secondary" data-action="edit-order" data-id="${order.id}">Edit work order</button> <button class="secondary" data-action="archive-order" data-id="${order.id}">${isArchived('orders',order.id)?'Restore':'Archive'} work order</button>`);
  drawOrderPreviews(modal);
  bindMeasurementEditor(modal,settings=>{
    Object.assign(order,settings);
    save('Figure measurements saved');
    const scroll=modal.scrollTop;
    orderDetails(order);
    modal.querySelector('.wo-allowances').open=true;
    for (const section of modal.querySelectorAll('.wo-cut-guide,.wo-seam-guide,.wo-feature-guide')) section.open=true;
    modal.scrollTop=scroll;
  });
  modal.querySelector('.check-list').addEventListener('change',event => {
    if (!event.target.matches('input')) return;
    order.done = [...modal.querySelectorAll('.check-list input:checked')].map(box=>Number(box.value));
    save();
    document.querySelector('#order-progress').textContent = `${order.done.length} of ${pattern.steps.length} steps completed`;
    render();
  });
}

const mannequin = [[-.9,.064,.058],[-.82,.087,.074],[-.755,.18,.091],[-.69,.233,.117],[-.57,.217,.127],[-.45,.191,.112],[-.25,.155,.104],[-.04,.194,.122],[.16,.226,.14],[.24,.210,.120],[.30,.175,.083]];
const dress = [[-.75,.225,.122],[-.64,.266,.145],[-.45,.222,.142],[-.25,.168,.115],[-.04,.209,.139],[.16,.246,.154],[.4,.298,.19],[.64,.35,.225],[.84,.399,.251]];
const shells = {
  dress,
  top:[[-.75,.225,.122],[-.64,.267,.147],[-.45,.237,.154],[-.25,.23,.15],[-.04,.243,.161],[.15,.262,.168]],
  skirt:dress.slice(4).map(([y,x,z],i)=>i===0?[-.25,.166,.114]:[y,x,z]),
  trousers:[[-.25,.169,.114],[-.04,.209,.143],[.16,.246,.154],[.35,.24,.144]]
};

function importedEnvelope(mesh,base) {
  const samples=base.map(([y,w,d])=>[y,w,d]);
  const occupied=samples.map(()=>[]);
  for (const [x,y,z] of mesh.vertices) {
    let closest=0;
    for (let i=1;i<samples.length;i++) if (Math.abs(samples[i][0]-y)<Math.abs(samples[closest][0]-y)) closest=i;
    occupied[closest].push([x,z]);
  }
  return samples.map(([y,w,d],index)=>{
    const bin=occupied[index];
    if (!bin.length) return [y,w,d];
    const width=Math.max(w,...bin.map(([x])=>Math.abs(x)));
    const depth=Math.max(d,...bin.map(([,z])=>Math.abs(z)));
    const radial=Math.max(1,...bin.map(([x,z])=>Math.hypot(x/width,z/depth)));
    return [y,width*radial,depth*radial];
  });
}

function drawModel(canvas,pattern,angle,changes,body,thumbnail=false,analysis=null) {
  if (!pattern && !body.mesh && typeof humanPreview!=='undefined') {
    return humanPreview.draw(canvas,body,angle);
  }
  changes={...pattern?.design?.fitAdjustments,...changes};
  const context = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const lifted=analysis?.pose?.arm||0;
  const shoulderRaising=Math.max(0,lifted-.45*(analysis?.pose?.reach||0)-.12*(analysis?.pose?.sit||0));
  const zoom=fabricFit.clamp(Number(analysis?.editor?.zoom)||1,.7,1.45);
  const scale = Math.min(height * (thumbnail && pattern ? .44 : .345)/Math.max(1,(body.height||168)/174),width*.57)*(1-.21*lifted)*zoom;
  const cx = width/2;
  const cy = height*(thumbnail && pattern ? .49 : .51+.05*lifted);
  const faces = [];
  const markings = [];
  const surfaces = {};
  const editorAnchors={};
  const model = pattern ? basePattern(pattern).id : null;
  const skirtFit=model==='dress'||model==='skirt';
  const design = pattern?.design;
  const garmentLayers=skirtFit?studioDesign.layers(design):[];
  const garmentSeams=studioDesign.seams?.(design) || {};
  const designShape = design ? studioDesign.measurements(design) : null;
  const necklineStyle = changes.neckline || design?.neckline;
  const support=changes.support || (design?studioDesign.selectedSupport(design):'Integrated shoulders');
  const sleeveStyle=changes.sleeveStyle || design?.sleeve || 'Short';
  const backStyle=design?studioDesign.selectedBack(design):'Classic back';
  const structured=design?.model==='corset';
  const fairyHem=design && studioDesign.hasFairyHem(design);
  const strapWidth=support==='Strapless'?0:Number(changes.strapWidth??design?.strapWidth)||studioDesign.supportWidth(support)||0;
  const strapPlacement=(Number(changes.strapPlacement??design?.strapPlacement)||0)*2.368/168;
  const neckWidth=fabricFit.clamp((.56+(changes.neckWidth||0)/37)*(necklineStyle==='Boat'?1.27:1),.21,.94);
  const neckDepth=fabricFit.clamp(.115+(changes.neckDepth||0)/75,.012,.39);
  const neckProfile=(style,t)=>{
    const u=Math.min(1,t);
    if (style==='V-neck' || style==='V-back') return 1-u;
    if (style==='Square' || style==='Square back') return 1-u**7;
    if (style==='Sweetheart') return (1-u**3)*(.62+.38*Math.cos(u*Math.PI*1.7)**2);
    return 1-u**(style==='U-neck'?3:2);
  };
  const materialName=analysis?.fabricName || design?.fabric;
  const selectedSwatch=materialName?getFabric(materialName):null;
  const weave=materialName?fabricFit.weave(materialName,selectedSwatch?.category):'plain';
  const regions = analysis?.show ? fabricFit.estimate(pattern,model,body,changes,analysis.pose,analysis.material) : null;
  const spin = Math.cos(angle);
  const sine = Math.sin(angle);
  const tilt = -.105;
  const proportions=sewingModels.proportions(body);
  const bustGeometry=sewingModels.bustGeometry(body,proportions);
  const avatar=pattern && !thumbnail && !body.mesh && typeof humanPreview!=='undefined'
    ?humanPreview.fittingSurface(body,proportions):null;
  const rotateView = ([x,y,z]) => {
    const px = x*spin-z*sine;
    const pz = x*sine+z*spin;
    const py = y*Math.cos(tilt)-pz*Math.sin(tilt);
    const depth = y*Math.sin(tilt)+pz*Math.cos(tilt);
    return [px,py,depth];
  };
  const screen = ([px,py,depth]) => {
    const perspective = 3.7/(3.7-depth);
    return [cx+px*scale*perspective,cy+py*scale*perspective,depth];
  };
  const project=point=>screen(rotateView(point));
  const anchor=([x,y])=>({x:100*x/width,y:100*y/height});
  let shellContact;
  let skinPoints=null;
  let posedSkin=null;
  function mesh(rings,hex,offset=0,neck=false,detail=false,fabricBody=false,transform=null,part=null,visibleBand=null) {
    const segments = part==='shell' ? 64 : hex===skin && !detail ? 54 : 38;
    const channels = hex.match(/[0-9a-f]{2}/gi).map(c=>parseInt(c,16));
    function restPoint(ring,theta,ringIndex) {
      const [y,w,d,center=0,centerZ=0] = ring;
      const x = Math.cos(theta);
      const z = Math.sin(theta);
      const frontDepth=neckDepth*({Crew:.58,Boat:.45,'V-neck':1.5,Square:1.18,Sweetheart:1.1,'U-neck':1.4,'Mock neck':.27}[necklineStyle]||1);
      const backDepth=fabricFit.clamp(({'Low scoop back':.20,'V-back':.25,'Square back':.17,'Open back':.36,'Racerback':.12}[backStyle]||.0575)+(changes.backNeck||0)/92,.012,.44);
      const absX=Math.abs(x);
      const backWidth=backStyle==='Open back'?.9:backStyle==='Classic back'?neckWidth:.72;
      let edge=z>=0?frontDepth*neckProfile(necklineStyle,absX/neckWidth):backDepth*neckProfile(backStyle,absX/backWidth);
      if (z<0 && backStyle==='Racerback') edge=.035+.17*Math.sin(absX*Math.PI)**2;
      if (neck && !changes.hasSleeves && support==='Integrated shoulders') {
        edge+=.135*absX**8+.11*shoulderRaising*absX**5;
      }
      if (support!=='Integrated shoulders') {
        const lowered=support==='Strapless'?.18:z>=0?.111:.156;
        edge=edge*.55+lowered+(.04+.11*shoulderRaising)*absX**4;
        if (support==='One-shoulder') edge-=.066*x;
      }
      if (structured && design.cut==='Underbust') edge=.36+(z<0?backDepth*.37:0);
      const transition=structured?.56:.70;
      const shoulderCap=avatar && changes.hasSleeves && neck?.065*absX**2*Math.max(0,1-(y-rings[0][0])/.12):0;
      const neckline=neck ? Math.max(0,1-(y-rings[0][0])/transition)*edge-shoulderCap : 0;
      const ribbed=design?.ribbing && (part==='sleeve'||part==='shell') && y>rings.at(-1)[0]-.06;
      const gathered=design?.closure==='Elastic waistband' && part==='shell' && y<rings[0][0]+.07;
      const looseSkirt=part==='shell' && (model==='dress'||model==='skirt') ? Math.max(0,(y-.06)/.78) : 0;
      const fold = (detail ? looseSkirt*.013*Math.cos(theta*(fairyHem?8:7)+y*1.9) : 0)+(ribbed?.002*Math.cos(theta*37):0)
        +(gathered?.0035*Math.cos(theta*16):0);
      const slope = neck?Math.abs(x)*(changes.shoulderSlope||0)/120*Math.max(0,1-ringIndex/5):0;
      const bustWidth=neck && fullBody && !body.mesh ? fabricFit.envelope(torso,y)[0] || w : w;
      const projectedBust=(part==='torso-skin'||neck&&!avatar)?sewingModels.bustShape(bustGeometry,x,y,z,bustWidth):0;
      // Drop the inner pelvis a little below the outer hip to meet the thighs.
      const pelvis=part==='torso-skin' ? Math.max(0,(y-.13)/.17)**2 : 0;
      const pelvisY=pelvis*(.035-.095*Math.abs(x));
      const progress=ringIndex/Math.max(1,rings.length-1);
      const corner=(1/Math.max(Math.abs(x),Math.abs(z))-1)/(Math.SQRT2-1);
      const hemOffset=fairyHem && part==='shell'?studioDesign.hemDrop(design)*.0138*progress**4*(corner-.5):0;
      const hemLimited=hemOffset ? Math.min(y+hemOffset,1.105) : y;
      const seatedSkirt=skirtFit && part==='shell';
      const front=Math.max(0,z),rear=Math.max(0,-z);
      const seatPanel=seatedSkirt?Math.exp(-(((y-.15)/.25)**2))*rear**2*(changes.seatDepth||0)*.013:0;
      const lapPanel=seatedSkirt?Math.exp(-(((y-.35)/.31)**2))*front*(changes.lapEase||0)*.0038:0;
      const backLength=seatedSkirt?rear**2*fabricFit.clamp((y+.31)/.77,0,1)*(changes.sittingLength||0)*.011:0;
      return [offset+center+x*(w+fold+lapPanel*.55),Math.min(hemLimited+backLength,1.12)+neckline+slope+pelvisY,centerZ+z*(d+fold)+projectedBust+lapPanel-seatPanel];
    }
    function movePoint(vertex,theta,ringIndex) {
      const moved=transform?transform(vertex,theta):vertex;
      const freeEdge=part==='sleeve'||part==='leg'?.6:part==='shell'?1:0;
      const falloff=detail?freeEdge*ringIndex/Math.max(1,rings.length-1):0;
      return fabricFit.followThrough(moved,theta,falloff,analysis?.pose||fabricFit.poses.stand,analysis?.material);
    }
    const thetaAt=i=>i*2*Math.PI/segments;
    const contact=part==='shell'?shellContact:null;
    const rest=rings.map((row,index)=>Array.from({length:segments},(_,i)=>restPoint(row,thetaAt(i),index)));
    const targets=rest.map((row,index)=>row.map((p,i)=>movePoint(p,thetaAt(i),index)));
    const seat=skirtFit && part==='shell'
      ? {top:proportions.yAt(-.12),bottom:proportions.yAt(.32),weight:1-pose.sit**.7}
      : null;
    const geometry=contact?clothContact.drape(targets,rest.map(row=>row.map(([x,y,z])=>[x,proportions.yAt(y),z])),
      contact,material,{free:model==='dress'?.29:.13,seat}):targets;
    const projected=geometry.map(row=>row.map(project));
    function sampleRing(theta,index) {
      const position=((theta/(2*Math.PI)*segments)%segments+segments)%segments;
      const column=Math.floor(position);
      return geometry[index][column].map((value,axis)=>fabricFit.mix(value,geometry[index][(column+1)%segments][axis],position-column));
    }
    if (part && part!=='torso-skin') surfaces[part]={rings,rest,geometry,opening:neckWidth,sampleRing,projectPoint:(row,theta,index)=>{
      const point=sampleRing(theta,index);
      if (row!==rings[index]) {
        const current=movePoint(restPoint(row,theta,index),theta,index);
        const base=movePoint(restPoint(rings[index],theta,index),theta,index);
        return project(point.map((n,i)=>n+current[i]-base[i]));
      }
      return project(point);
    }};
    const contrast = design?.accent ? color(design.accent).match(/[0-9a-f]{2}/gi).map(c=>parseInt(c,16)) : channels;
    for (let ring=0;ring<rings.length-1;ring++) {
      const band=(rings[ring][0]+rings[ring+1][0])*.5;
      if (visibleBand && !visibleBand(band)) continue;
      for (let i=0;i<segments;i++) {
        const next=(i+1)%segments;
        const points=[projected[ring][i],projected[ring][next],projected[ring+1][next],projected[ring+1][i]];
        const [a,b,c] = points;
        const innerFace=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])>=0;
        const twoSided=skinPoints && detail || model==='top' && part==='shell' && analysis?.pose?.sit>.28 && band>.025;
        if (innerFace && !twoSided) continue;
        const theta = (i+.5)*2*Math.PI/segments+angle;
        let light = (.73+.24*Math.cos(theta-1.95)+.12*Math.sin(theta))*(innerFace?.88:1);
        if (hex===skin && !detail) {
          const u=[(b[0]-a[0])/scale,(b[1]-a[1])/scale,b[2]-a[2]];
          const v=[(c[0]-a[0])/scale,(c[1]-a[1])/scale,c[2]-a[2]];
          const normal=[u[2]*v[1]-u[1]*v[2],u[0]*v[2]-u[2]*v[0],u[1]*v[0]-u[0]*v[1]];
          const magnitude=Math.hypot(...normal)||1;
          light=.70+.36*Math.max(0,(-.36*normal[0]-.48*normal[1]+.80*normal[2])/magnitude);
        }
        const depth = points.reduce((sum,p)=>sum+p[2],0)/4;
        const contrastPanel = detail && design && fabricBody && (design.tone==='Contrast lower panel' && ring>=Math.floor(rings.length*.54) || design.finish==='Contrast hem band' && ring===rings.length-2);
        const ribbed=design?.ribbing && (part==='sleeve'||part==='shell') && (band>rings.at(-1)[0]-.06
          || part==='shell' && design.neckline==='Crew' && ring===0 && Math.abs(Math.cos(theta-angle))<.58);
        const level = regions && part ? fabricFit.levelAt(regions,band,theta-angle,part) : 0;
        const swatch=part && detail && !contrastPanel?fabricFit.sample(selectedSwatch?.photo,i/segments*3,band*2.5,analysis?.redraw):null;
        const grain=part && detail?(weave==='twill'?Math.sin(theta*11+band*40)*.015:
          weave==='knit'?Math.cos(theta*13)*Math.sin(band*36)*.012:
          weave==='satin'?Math.max(0,Math.cos(theta-1.95))**12*.13:Math.sin(theta*9+band*48)*.009):0;
        const waistband=design?.closure==='Elastic waistband' && part==='shell' && band<rings[0][0]+.061;
        const palette=contrastPanel||ribbed?contrast:waistband?channels.map(c=>c*.93):swatch || channels;
        const fiber=(level>0?fabricFit.tint(palette,level):palette).map(c=>fabricFit.clamp(Math.round(c*(light+grain)),0,255));
        const panelSeam=structured && neck && [0,3,6,segments/2,segments/2+3,segments/2+6].includes(i);
        faces.push({points,depth,paint:'rgb('+fiber.join(',')+')',seam:detail&&(i===0||i===segments/2||ring===rings.length-2||panelSeam)});
      }
    }
  }
  const waistDelta = (changes.waist || 0)/450;
  const hipDelta = (changes.hip || 0)/450;
  const bodyWaist = ((body.waist || 74)-74)/450;
  const bodyHip = ((body.hip || 98)-98)/450;
  const lengthDelta = (changes.length || 0)/95+(structured?-.24:0)+(designShape?.lower || 0)*(model==='top'?.16:.22);
  const modeledBust = (body.bust || 92)-92;
  const modeledShoulder = (body.shoulder || 39)-39;
  const waistWeight = y=>Math.max(0,1-Math.abs(y+.25)/.32);
  const hipWeight = y=>Math.max(0,1-Math.abs(y-.16)/.38);
  function resize(rings,waist,hip,length=0,fit={},designShell=false) {
    return rings.map(([y,w,d],index)=>{
      const bustWeight = Math.max(0,1-Math.abs(y+.49)/.24);
      const shoulderWeight = Math.max(0,1-Math.abs(y+.75)/.18);
      const thighWeight = Math.max(0,1-Math.abs(y-.36)/.25);
      const legWeight = Math.max(0,1-Math.abs(y-.93)/.38);
      const designWidth = designShell && designShape ? (designShape.volume*.13 +
        (design.ease-4)/180)*Math.max(0,Math.min(1,(y+.59)/(model==='top'?.73:1.4))) : 0;
      const hemWeight=Math.max(0,1-Math.abs(y-rings.at(-1)[0])/.42);
      const kneeWeight=Math.max(0,1-Math.abs(y-.62)/.29);
      const extraSweep=designShell?(hemWeight*(fit.sweep||0)+kneeWeight*(fit.knee||0))/450:0;
      const seatedWidth=designShell && skirtFit
        ? (Math.exp(-(((y+.065)/.16)**2))*(fit.upperHip||0)+kneeWeight*(fit.kneeEase||0))*.00225 : 0;
      const widthChange = waistWeight(y)*waist+hipWeight(y)*hip+designWidth+extraSweep+seatedWidth+
        (bustWeight*(fit.bust||0)+thighWeight*(fit.thigh||0)+legWeight*(fit.leg||0))/450+
        shoulderWeight*(fit.shoulder||0)/220;
      const heightChange = index===0 ? 0 : length*(index/(rings.length-1))**2;
      const riseShift = Math.max(0,1-Math.abs(y+.25)/.36)*(fit.rise||0)/100;
      const armholeShift = Math.max(0,1-Math.abs(y+.64)/.1)*(fit.armhole||0)/100;
      const waistShift=waistWeight(y)*(fit.waistHeight||0)/94;
      return [y+heightChange-riseShift+armholeShift-waistShift,Math.max(.013,w+widthChange),Math.max(.013,d+widthChange*.68)];
    });
  }
  context.clearRect(0,0,width,height);
  context.fillStyle='#3a1e271f';
  context.beginPath();
  const pose = analysis?.pose || fabricFit.poses.stand;
  const rig = fabricFit.rig(pose,proportions.yAt);
  const [floorX,floorY]=project(rig.foot([0,1.127,.055]));
  context.ellipse(floorX,floorY+2,scale*.35,scale*.055,0,0,Math.PI*2);
  context.fill();
  const skin = color(body.skin||'#d7b69d');
  const calibrate=(rings,part)=>sewingModels.smoothRings(sewingModels.calibrated(body,rings,part,bustGeometry));
  const baseTorso=body.scan?modelCamera.rings(mannequin,body.scan):mannequin;
  const torso = calibrate(resize(baseTorso,0,0,0,{shoulder:modeledShoulder}),'torso');
  const head = [[-1.24,.015,.023],[-1.219,.065,.062],[-1.17,.084,.078],[-1.105,.084,.082],
    [-1.063,.082,.081],[-1.035,.072,.077],[-1.009,.057,.066],[-.986,.047,.053],[-.962,.047,.053],[-.917,.051,.058],[-.875,.065,.07]]
    .map(([y,w,d])=>[y,w*(sewingModels.profileOf(body)==='male'?1.06:1),d]);
  const upperLeg = Math.max(.083,.112+bodyHip*.37);
  const legBody = calibrate([[.145,upperLeg*.74,.086],[.205,upperLeg*.93,.109],[.30,upperLeg,.118],[.38,upperLeg*.94,.108],
    [.56,.081,.086],[.66,.069,.067],[.76,.071,.069],[.88,.056,.057],[.996,.036,.041],[1.045,.04,.039]],'leg');
  const foot = [[1.014,.031,.037],[1.054,.058,.086],[1.096,.059,.103],[1.116,.052,.094],[1.128,.009,.029]];
  const armBody = calibrate([[-.728,.027,.046,.19],[-.668,.058,.064,.244],[-.52,.052,.052,.285],
    [-.365,.045,.044,.317],[-.28,.043,.041,.33],[-.14,.032,.032,.35],
    [-.038,.026,.026,.367],[-.006,.032,.03,.373],[.055,.036,.027,.384],[.103,.019,.015,.397],[.123,.005,.005,.40]],'arm');
  const legSpacing = .116 + bodyHip*.24;
  const shoulders = modeledShoulder/240;
  const armScale=avatar?1:fabricFit.clamp((body.arm||56)/56,.78,1.27);
  const articulated=avatar?.pose?.(pose);
  const torsoMove=articulated?.torso||rig.torso;
  const legMove=articulated?.leg||rig.leg;
  const skirtMove=(point,theta,cloth=analysis?.material)=>{
    if (articulated && pose.sit && point[1]>.045) {
      const [x,y,z]=point;
      const {hip,knee}=articulated.joints[1];
      const front=Math.max(0,Math.sin(theta));
      const distance=proportions.yAt(y)-proportions.yAt(.045);
      const reach=Math.max(0,knee[2]-hip[2])*(.12+.95*front**1.35);
      // Round the transition at the knees rather than fold two rings
      // onto the same horizontal plane.
      const corner=Math.min(.07,reach*.34);
      const start=reach-corner;
      const u=corner?fabricFit.clamp((distance-start)/(2*corner),0,1):1;
      const over=distance<start?distance:distance>reach+corner?reach:start+2*corner*(u-u*u/2);
      const hanging=Math.max(0,distance-over);
      const anchor=torsoMove([x,.045,z]);
      const bent=[anchor[0],Math.min(1.09,anchor[1]+over*(.18+.14*(1-front))+hanging),anchor[2]+over];
      const neutral=torsoMove(point);
      const blend=Math.sqrt(pose.sit)*fabricFit.clamp(distance/.075,0,1);
      return neutral.map((n,i)=>fabricFit.mix(n,bent[i],blend));
    }
    const hang=rig.skirt(point,theta,cloth);
    if (!articulated) return hang;
    const previous=rig.torso(point);
    return torsoMove(point).map((value,i)=>value+hang[i]-previous[i]);
  };
  function armMove(side) {
    if (articulated) return point=>articulated.arm(point,side);
    const pivot=avatar?.joints[0][0] ?? .218+shoulders;
    const shoulderLevel=avatar?.joints[0][1] ?? -.68;
    const elbowLevel=avatar?.joints[1][1] ?? -.28;
    const wristLevel=avatar?.joints[2][1] ?? -.038;
    const lift=pose.arm*2.3;
    const reach=pose.reach*.98-side*(pose.stride||0)*.23;
    const elbowAngle=pose.sit*.7+pose.reach*.22+pose.arm*.17;
    const shoulder=torsoMove([side*(pivot+.01),shoulderLevel,avatar?.joints[0][2]||0]);
    const lap=legMove([side*(legSpacing+.055),.435,.10]);
    const upper=.44*armScale, fore=.40*armScale;
    const wristWish=[lap[0],lap[1]-.055,lap[2]+.15];
    const dY=wristWish[1]-shoulder[1],dZ=wristWish[2]-shoulder[2];
    const distance=Math.max(.1,Math.hypot(dY,dZ));
    const reachLength=Math.min(distance,(upper+fore)*.98);
    const uy=dY/distance,uz=dZ/distance;
    const elbowAlong=(upper*upper-fore*fore+reachLength*reachLength)/(2*reachLength);
    const elbowBend=Math.sqrt(Math.max(0,upper*upper-elbowAlong*elbowAlong));
    const elbow=[side*(.252+shoulders),shoulder[1]+uy*elbowAlong+uz*elbowBend,shoulder[2]+uz*elbowAlong-uy*elbowBend];
    const wrist=[wristWish[0],shoulder[1]+uy*reachLength,shoulder[2]+uz*reachLength];
    return ([x,y,z])=>{
      const u=x*side-pivot;
      let v=(y-shoulderLevel)*armScale;
      const forearm=Math.max(0,y-elbowLevel)*armScale;
      v-=forearm*(1-Math.cos(elbowAngle));
      const extendedZ=z+forearm*Math.sin(elbowAngle);
      const sagittalY=v*Math.cos(reach)-extendedZ*Math.sin(reach);
      const sagittalZ=v*Math.sin(reach)+extendedZ*Math.cos(reach);
      const standing=torsoMove([side*(pivot+u*Math.cos(lift)+sagittalY*Math.sin(lift)),
        shoulderLevel+sagittalY*Math.cos(lift)-u*Math.sin(lift),sagittalZ]);
      if (pose.sit===0) return standing;
      const shoulderToElbow=y<=elbowLevel;
      const a=shoulderToElbow?shoulder:elbow;
      const b=shoulderToElbow?elbow:wrist;
      const t=shoulderToElbow?(y-shoulderLevel)/Math.max(.05,elbowLevel-shoulderLevel):(y-elbowLevel)/Math.max(.05,wristLevel-elbowLevel);
      const detailedArm=avatar?.sectionAt('arm',y);
      const center=side*(detailedArm?.[2] ?? shoulders+fabricFit.mix(.244,.367,fabricFit.clamp((y+.668)/.63,0,1)));
      const relativeZ=z-(detailedArm?.[3]||0);
      const dy=b[1]-a[1],dz=b[2]-a[2],length=Math.hypot(dy,dz)||1;
      const seated=[fabricFit.mix(a[0],b[0],Math.min(1,t))+x-center,
        a[1]+t*dy-relativeZ*dz/length,a[2]+t*dz+relativeZ*dy/length];
      const shoulderBlend=fabricFit.clamp((y-shoulderLevel+.025)/.165,0,1);
      const blend=shoulderBlend*shoulderBlend*(3-2*shoulderBlend);
      return standing.map((value,axis)=>fabricFit.mix(value,seated[axis],pose.sit*blend));
    };
  }
  const expanded = rings=>fabricFit.resample(rings);
  const fullBody = !thumbnail || !pattern;
  const material = analysis?.material;
  const gravity = material ? fabricFit.clamp((material.gsm-110)/400,-.2,1.35) : 0;
  function hang(rings) {
    return rings.map(([y,w,d,...rest],i)=>{
      const drop=(i/(rings.length-1))**2;
      const drape=gravity*(1-(material?.bend||0))*drop;
      return [y+drape*.055,w*(1-drape*.11),d*(1-drape*.06),...rest];
    });
  }
  const tailored = {...changes,bust:modeledBust+(changes.bust||0),shoulder:modeledShoulder+(changes.shoulder||0),
    rise:(changes.rise||0)+(designShape?.rise||0)};
  const shell = pattern?hang(resize(shells[model],bodyWaist+waistDelta,bodyHip+hipDelta,model==='trousers'?0:lengthDelta,tailored,true)):null;
  const legHem=fabricFit.clamp(.93+lengthDelta,.35,1.09);
  const legRings=[[.19,.12,.128],[.36,.123,.132],[.57,.107,.112],[.8,.103,.108],[.93,.103,.106]];
  const trouserLeg=model==='trousers'?expanded(hang(resize(legRings,0,hipDelta,0,changes,true).map(([y,w,d])=>{
    const t=(y-.19)/.74;
    const [thigh,knee,hem]=designShape?.leg || [0,0,0];
    const variation=t<.53?fabricFit.mix(thigh,knee,t/.53):fabricFit.mix(knee,hem,(t-.53)/.47);
    return [fabricFit.mix(.19,legHem,t),w+variation,d+variation*.82];
  }))):null;
  const restingHem=['dress','skirt'].includes(model)?shell.at(-1)[0]:0;
  const legCover=trouserLeg?.at(-1)[0] ?? Math.max(0,restingHem-pose.sit*.14);
  const torsoCover=shell ? Math.max(shell[0][0],(model==='dress'||model==='top')?-.27:-Infinity) : 2;
  const visibleTorso=y=>!shell||y<torsoCover||y>shell.at(-1)[0];
  const exposedLeg=legBody.filter(([y])=>y>legCover);
  if (legCover>=legBody[0][0] && legCover<legBody.at(-1)[0]) {
    exposedLeg.unshift([legCover,...fabricFit.envelope(legBody,legCover)]);
  }

  const detailedSleeveEnd=()=>{
    const [shoulder,elbow,wrist]=avatar.joints;
    const start=shoulder[1]-.085;
    const naturalEnd=({Long:wrist[1],Bell:wrist[1],Elbow:elbow[1]})[sleeveStyle] ??
      fabricFit.mix(shoulder[1]-.027,elbow[1],({Cap:.35,Puff:.91})[sleeveStyle]??.77);
    return [start,Math.max(start+.11,naturalEnd+(changes.sleeveLength||0)/75)];
  };
  if (avatar) {
    const arms=[armMove(-1),armMove(1)];
    const bodyPoints=articulated?.vertices || avatar.vertices.map(([x,y,z,arm])=>{
      const rest=[x,y,z];
      const main=y>=1.011?rig.foot(rest):y>=.30?legMove(rest):y>.12?rig.pelvis(rest,Math.atan2(z,x)):torsoMove(rest);
      if (arm<=.005 || !(pose.arm||pose.reach||pose.sit||pose.stride)) return main;
      const movingArm=arms[x<0?0:1](rest);
      return main.map((value,index)=>fabricFit.mix(value,movingArm[index],arm));
    });
    posedSkin=bodyPoints;
    skinPoints=bodyPoints.map(rotateView);
    if (typeof clothContact!=='undefined' && humanPreview.topology) {
      shellContact=clothContact.fromAvatar(bodyPoints,avatar.vertices,humanPreview.topology);
    }
  } else if (fullBody) {
    if (body.mesh) {
      const points = body.mesh.vertices.map(v=>project(torsoMove(v)));
      for (const triangle of body.mesh.triangles) {
        if (triangle.every(index=>!visibleTorso(body.mesh.vertices[index][1]))) continue;
        const corners = triangle.map(index=>points[index]);
        const [a,b,c] = corners;
        const area = (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
        if (Math.abs(area)<.1) continue;
        const depth = (a[2]+b[2]+c[2])/3;
        const light = Math.round(Math.max(-36,Math.min(36,depth*62)));
        const paint=skin.slice(1).match(/../g).map(channel=>fabricFit.clamp(parseInt(channel,16)+light,0,255));
        faces.push({points:corners,depth,paint:'rgb('+paint.join(',')+')'});
      }
    } else mesh(torso,skin,0,false,false,false,torsoMove,'torso-skin',visibleTorso);
    mesh(sewingModels.smoothRings(head,.012),skin,0,false,false,false,(point,theta)=>{
      const [x,y,z]=point;
      const front=Math.max(0,Math.sin(theta));
      const nose=Math.exp(-(((y+1.078)/.047)**2))*front**23*.032;
      const eyeSocket=Math.exp(-(((y+1.126)/.027)**2))*Math.exp(-(((Math.abs(x)-.039)/.023)**2))*front*.010;
      const brow=Math.exp(-(((y+1.151)/.021)**2))*front**2*.008;
      const lips=Math.exp(-(((y+1.041)/.014)**2))*front**11*.009;
      return torsoMove([x,y,z+nose+brow+lips-eyeSocket]);
    });
    for (const side of [-1,1]) {
      mesh([[-1.155,.006,.012],[-1.132,.015,.019],[-1.083,.012,.017],[-1.058,.005,.009]],
        skin,side*.08,false,false,false,torsoMove);
      const arms=armBody.filter(([y])=>y<=.055).map(([y,w,d,x])=>[y,w,d,side*(x+shoulders)]);
      const moveArm=armMove(side);
      mesh(arms,skin,0,false,false,false,moveArm);
      for (const [index,length] of [.056,.069,.062,.046].entries()) {
        const x=side*(.36+shoulders+index*.014);
        const fingers=[[.04,.011,.017,x],[.072,.009,.012,x+side*.006],[.05+length,.005,.006,x+side*.011],[.055+length,.002,.003,x+side*.012]];
        mesh(fingers,skin,0,false,false,false,moveArm);
      }
      mesh([[.002,.014,.017,side*(.356+shoulders)],[.045,.011,.011,side*(.337+shoulders)],
        [.073,.006,.006,side*(.337+shoulders)]],skin,0,false,false,false,moveArm);
      if (exposedLeg.length>1) mesh(exposedLeg,skin,side*legSpacing,false,false,false,legMove);
      mesh(foot,skin,side*legSpacing,false,false,false,p=>rig.foot([p[0],p[1],p[2]+.045]),null,y=>y>legCover);
    }
  }

  function bridgeShoulders() {
    if (!strapWidth || (model!=='dress' && model!=='top') || structured && design.cut==='Underbust') return;
    const {sampleRing,rings}=surfaces.shell;
    const bind=avatar?.joints[0] || [.214+shoulders,-.73,0];
    const rows=changes.hasSleeves?2:1;
    const width=rings[rows][1];
    const centimeter=2.368/168;
    const edge=Math.min(bind[0]+(changes.hasSleeves?.061:.018-.029*shoulderRaising),width*.95);
    const halfWidth=Math.min(Math.max(.003,strapWidth*centimeter/2),(edge-.067)*.5);
    const integrated=support==='Integrated shoulders', halter=support==='Halter strap';
    const fitCenter=bind[0]*(integrated?.81:halter?.64:.76)+strapPlacement-(changes.hasSleeves?0:.021*shoulderRaising);
    const center=fabricFit.clamp(fitCenter,.067+halfWidth,edge-halfWidth);
    const shoulderTriangles=[];
    if (posedSkin && humanPreview.topology) {
      const topology=humanPreview.topology;
      for (let i=0;i<topology.length;i+=4) {
        const a=topology[i],b=topology[i+1],c=topology[i+2],d=topology[i+3];
        const bindPoints=[avatar.vertices[a],avatar.vertices[b],avatar.vertices[c],avatar.vertices[d]];
        if (bindPoints.every(([,y])=>y<bind[1]-.22 || y>bind[1]+.17)) continue;
        for (const indices of [[a,b,c],[a,c,d]]) {
          const [p,q,r]=indices.map(index=>posedSkin[index]);
          const [wp,wq,wr]=indices.map(index=>avatar.vertices[index][3]);
          const ux=q[0]-p[0], uz=q[2]-p[2], vx=r[0]-p[0], vz=r[2]-p[2];
          const determinant=ux*vz-uz*vx;
          if (Math.abs(determinant)<1e-8) continue;
          shoulderTriangles.push({
            p,ux,uz,vx,vz,determinant,uy:q[1]-p[1],vy:r[1]-p[1],wp,wu:wq-wp,wv:wr-wp,
            x0:Math.min(p[0],q[0],r[0]),x1:Math.max(p[0],q[0],r[0]),
            z0:Math.min(p[2],q[2],r[2]),z1:Math.max(p[2],q[2],r[2])
          });
        }
      }
    }
    // A vertical ray through the posed shoulder finds the skin below each
    // point of the support, including while the arm moves at the joint.
    function aboveShoulder(x,z,fallback) {
      let y=fallback;
      for (const tri of shoulderTriangles) {
        if (x<tri.x0 || x>tri.x1 || z<tri.z0 || z>tri.z1) continue;
        const dx=x-tri.p[0],dz=z-tri.p[2];
        const a=(dx*tri.vz-dz*tri.vx)/tri.determinant;
        const b=(tri.ux*dz-tri.uz*dx)/tri.determinant;
        const armWeight=tri.wp+a*tri.wu+b*tri.wv;
        if (!changes.hasSleeves && shoulderRaising>.12 && armWeight>.58) continue;
        if (a>=0 && b>=0 && a+b<=1) y=Math.min(y,tri.p[1]+a*tri.uy+b*tri.vy-.012);
      }
      return y;
    }
    const channels=color(pattern.color).slice(1).match(/../g).map(value=>parseInt(value,16));
    const level=(regions?.shoulder?.level||0)*.70;
    const paint='rgb('+fabricFit.tint(channels,level).map(n=>Math.round(n*.94)).join(',')+')';
    const lanes=strapWidth<1.2?2:6;
    function collarPoint(x,y) {
      const neck=avatar?.sectionAt('torso',y);
      const z=neck ? Math.min(-.10,neck[3]-neck[1]-.015) : -.102;
      return torsoMove([x,y,z]);
    }
    function drawStrip(points) {
      const projected=points.map(row=>row.map(project));
      for (let i=0;i<projected.length-1;i++) {
        for (let j=0;j<projected[i].length-1;j++) {
          const quad=[projected[i][j],projected[i][j+1],projected[i+1][j+1],projected[i+1][j]];
          faces.push({points:quad,depth:quad.reduce((sum,p)=>sum+p[2],0)/4,paint});
        }
      }
    }
    for (const side of support==='One-shoulder'?[1]:[-1,1]) {
      const stations=18;
      const target=Array.from({length:lanes+1},(_,lane)=>{
        const across=(lane/lanes*2-1)*halfWidth;
        const x=side*(center+across);
        const theta=Math.acos(fabricFit.clamp(x/width,-.95,.95));
        const front=sampleRing(theta,rows);
        const back=halter?collarPoint(side*(.044+across*.32),bind[1]-.167):sampleRing(-theta,rows);
        const crown=torsoMove([x,bind[1]-.066,bind[2]]);
        const raise=Math.max(.028,(front[1]+back[1])*.5-crown[1]);
        return {front,back,crown,raise};
      });
      const strip=Array.from({length:stations+1},(_,index)=>{
        const t=index/stations;
        const arch=Math.sin(Math.PI*t);
        return target.map(({front,back,crown,raise})=>{
          const x=fabricFit.mix(front[0],back[0],t)-(changes.hasSleeves?0:side*arch*.031*shoulderRaising);
          const z=fabricFit.mix(front[2],back[2],t);
          const height=fabricFit.mix(front[1],back[1],t)-raise*arch;
          if (!index || index===stations) return [x,height-.001,z+(index?-.002:.002)];
          const shoulderHeight=Math.min(height,crown[1]+Math.abs(t-.5)*.34);
          const outside=aboveShoulder(x,z,shoulderHeight);
          const endBlend=Math.min(1,index/2,(stations-index)/2);
          return [x,fabricFit.mix(height,outside,endBlend),z];
        });
      });
      // Relax height discontinuities at the shoulder edge while preserving
      // the same clearance and fixed stitched endpoints.
      for (let pass=0;pass<2;pass++) {
        for (let i=2;i<stations-1;i++) {
          for (let j=0;j<=lanes;j++) {
            const point=strip[i][j];
            const mean=(strip[i-1][j][1]+strip[i+1][j][1])*.5;
            point[1]=aboveShoulder(point[0],point[2],fabricFit.mix(point[1],mean,.39));
          }
        }
      }
      drawStrip(strip);
    }
    if (halter) {
      drawStrip(Array.from({length:9},(_,i)=>{
        const x=(i/8*2-1)*.047;
        return [collarPoint(x,bind[1]-.177),collarPoint(x,bind[1]-.150)];
      }));
    }
  }

  let shellColumns;
  function columnsOfShell() {
    if (shellColumns) return shellColumns;
    const {rest,geometry}=surfaces.shell;
    const segments=rest[0].length;
    shellColumns=Array.from({length:segments},(_,i)=>{
      const theta=i*2*Math.PI/segments;
      const levels=rest.map((row,j)=>({height:proportions.yAt(row[i][1]),point:geometry[j][i]}))
        .sort((a,b)=>a.height-b.height);
      return {theta,levels,restHem:rest.at(-1)[i],hem:proportions.yAt(rest.at(-1)[i][1]),posedHem:geometry.at(-1)[i]};
    });
    return shellColumns;
  }
  function pointAtHeight(levels,y) {
    const hi=levels.findIndex(row=>row.height>=y);
    const index=hi<0?levels.length-1:hi;
    const b=levels[index],a=levels[Math.max(0,index-1)];
    const t=fabricFit.clamp((y-a.height)/Math.max(.001,b.height-a.height),0,1);
    return a.point.map((n,i)=>fabricFit.mix(n,b.point[i],t));
  }
  function aroundAt(theta,points) {
    const position=((theta/(2*Math.PI)*points.length)%points.length+points.length)%points.length;
    const i=Math.floor(position);
    return points[i].map((n,k)=>fabricFit.mix(n,points[(i+1)%points.length][k],position-i));
  }
  function markSeams() {
    if (!design) return;
    const showGuides=analysis?.editor?.showSeams;
    if (!showGuides && !Object.keys(garmentSeams).length) return;
    const eligible=studioDesign.seamKeys(design.model);
    const surface=surfaces.shell;
    const [r,g,b]=color(pattern.color).slice(1).match(/../g).map(n=>parseInt(n,16));
    const tone=(r*.2126+g*.7152+b*.0722)<139?'248,219,177':'68,43,48';
    const style=saved=>'rgba('+tone+','+(saved?.8:.58)+')';
    const unit=2.368/168;
    const onSurface=([x,y,z],theta)=>project([x+.0036*Math.cos(theta),y,z+.0036*Math.sin(theta)]);
    const waistSaved=Number.isFinite(garmentSeams.waistSeam);
    const panelSaved=Number.isFinite(garmentSeams.panelSeam);
    if (eligible.includes('waistSeam') && (waistSaved || showGuides)) {
      const y=proportions.yAt(-.25)+(garmentSeams.waistSeam||0)*unit;
      const points=columnsOfShell().map(({theta,levels})=>onSurface(pointAtHeight(levels,y),theta));
      markings.push({points,closed:true,style:style(waistSaved)});
      if (showGuides) editorAnchors.waistSeam=anchor(aroundAt(Math.PI/2-angle,points));
    }
    if (eligible.includes('panelSeam') && (panelSaved || showGuides)) {
      const target=model==='skirt'?fabricFit.mix(surface.rings[0][0],surface.rings.at(-1)[0],.32):model==='top'?-.39:-.34;
      const selected=surface.rings.reduce((best,row,i)=>Math.abs(row[0]-target)<Math.abs(surface.rings[best][0]-target)?i:best,0);
      const shift=(garmentSeams.panelSeam||0)*unit;
      for (const side of [-1,1]) {
        const points=surface.rings.map(([y],i)=>{
          const right=surface.rest[i][0][0], left=surface.rest[i][surface.rest[i].length/2][0];
          const halfWidth=(right-left)/2;
          const shoulder=model==='skirt'?0:Math.max(0,1-Math.abs(y+.71)/.36)*.2;
          const position=fabricFit.clamp(.42+shoulder+shift/Math.max(.035,halfWidth),.095,.94);
          const theta=Math.acos(side*position);
          const point=onSurface(surface.sampleRing(theta,i),theta);
          if (showGuides && side===1 && i===selected && Math.sin(theta+angle)>.18) {
            editorAnchors.panelSeam=anchor(point);
          }
          return point;
        });
        markings.push({points,style:style(panelSaved)});
      }
    }
  }

  function drawSkirtLayers() {
    if (!garmentLayers.length) return;
    const columns=columnsOfShell();
    const segments=columns.length;
    const unit=2.368/168;
    const waist=proportions.yAt(shell[model==='dress'?3:0][0]);
    const floor=proportions.yAt(1.105);
    const frontHem=columns[segments/4].hem;
    const entries=garmentLayers.map((layer,index)=>({layer,index}));
    const ordered=[...entries.filter(({layer})=>layer.kind==='Underskirt'),...entries.filter(({layer})=>layer.kind!=='Underskirt')];
    const stack=[];
    for (const {layer,index} of ordered) {
      const under=layer.kind==='Underskirt';
      const tier=layer.kind==='Tier';
      const ruffle=layer.kind==='Ruffle';
      const joined=tier || ruffle;
      const attachment=joined?fabricFit.mix(waist,frontHem,layer.attachment/100):waist;
      const endFor=hem=>Math.min(floor,Math.max(attachment+.036,ruffle?attachment+unit*layer.depth:hem+unit*layer.hemOffset));
      const gap=under?-.012:.008;
      const cloth=getFabric(layer.fabric);
      const weave=fabricFit.weave(layer.fabric,cloth.category);
      const opacity=layer.opacity/100;
      const channels=color(layer.color).slice(1).match(/../g).map(n=>parseInt(n,16));
      const sweep=unit*layer.sweep/(2*Math.PI);
      const length=Math.max(.042,endFor(frontHem)-attachment);
      const rows=Math.max(8,Math.ceil(length/(thumbnail?.078:.050)));
      const fluteCount=11;
      const gather=layer.sweep/(layer.sweep+70);
      const section=columns.map(({theta,levels,restHem,hem,posedHem},i)=>{
        const end=endFor(hem);
        const start=under?Math.min(end,Math.max(attachment,hem-.014)):attachment;
        const hidden=under && end<=hem+.001;
        const dx=Math.cos(theta),dz=Math.sin(theta);
        const movedHem=skirtMove(restHem,theta,cloth);
        const correction=posedHem.map((n,i)=>n-movedHem[i]);
        const vertices=Array.from({length:rows+1},(_,j)=>{
          const fraction=j/rows;
          const y=fabricFit.mix(start,end,fraction);
          const drop=fabricFit.clamp((y-attachment)/Math.max(.036,end-attachment),0,1);
          const extension=Math.max(0,y-hem);
          let point;
          if (extension>0) {
            const canonical=proportions.baseAt((1.128-y)/unit);
            const fade=Math.max(0,1-extension/.24);
            point=skirtMove([restHem[0],canonical,restHem[2]],theta,cloth)
              .map((n,i)=>n+correction[i]*fade);
          } else point=pointAtHeight(levels,y);
          const spread=ruffle?Math.min(.28,length*.9)*gather*drop**.85:drop**(tier?.73:1.28)*sweep;
          const fullness=ruffle?Math.min(.14,length*.64)*gather*(1-.43*cloth.bend)*drop**.8:
            (.016+sweep*.11)*(1-.64*cloth.bend)*drop**1.45;
          const wave=theta*(ruffle?fluteCount:tier?12:8)+drop*(ruffle?.64:1.9);
          const fold=Math.cos(wave)*fullness;
          const release=under?fabricFit.clamp(extension/.105,0,1):1;
          const moved=fabricFit.followThrough(point,theta,drop,pose,cloth);
          const motion=(moved[0]-point[0])*dx+(moved[2]-point[2])*dz;
          let offset=gap+release*Math.max(0,spread+fold+motion*.55);
          // Keep later panels outside the ones they cover. Ease out the
          // extra width above an attachment and below a shorter hem.
          if (!under || extension>.014) for (const inner of stack) {
            const panel=inner[i];
            if (panel.hidden || y<panel.start-.065 || y>panel.end+.065) continue;
            const t=fabricFit.clamp((y-panel.start)/Math.max(.001,panel.end-panel.start),0,1)*(panel.vertices.length-1);
            const a=panel.vertices[Math.floor(t)],b=panel.vertices[Math.ceil(t)];
            const width=(fabricFit.mix(a[0],b[0],t%1)-point[0])*dx+(fabricFit.mix(a[2],b[2],t%1)-point[2])*dz;
            const edge=fabricFit.clamp(1-Math.max(panel.start-y,y-panel.end,0)/.065,0,1);
            offset+=Math.max(0,width+.012-offset)*edge*edge*(3-2*edge);
          }
          const scallop=ruffle?Math.sin(wave)*fullness*.24*drop:0;
          point=[point[0]+dx*offset,point[1]+(extension>0?moved[1]-point[1]:0)+scallop,point[2]+dz*offset];
          if (extension>0 && shellContact) point=shellContact(point,theta);
          return point;
        });
        return {start,end,vertices,points:vertices.map(project),hidden};
      });
      stack.push(section);
      if (analysis?.editor?.layerIndex===index) {
        const near=Math.PI/2-angle;
        const first=section.map(column=>column.points[0]);
        const hem=section.map(column=>column.points.at(-1));
        editorAnchors.layerAttachment=anchor(aroundAt(near-.37,first));
        editorAnchors.layerHem=anchor(aroundAt(near+.24,hem));
        editorAnchors.layerSweep=anchor(aroundAt(near-1.11,hem));
      }
      for (let i=0;i<segments;i++) {
        const a=section[i],b=section[(i+1)%segments];
        if (a.hidden && b.hidden) continue;
        const theta=(i+.5)*2*Math.PI/segments+angle;
        for (let j=0;j<rows;j++) {
          const band=(j+.5)/rows;
          const points=[a.points[j],b.points[j],b.points[j+1],a.points[j+1]];
          const [p,q,r]=points;
          const inner=(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0])>=0;
          const visibleTex=fabricFit.sample(cloth.photo,i/segments*3,band*2.5,analysis?.redraw);
          const swatch=visibleTex ? .35+.85*(.2126*visibleTex[0]+.7152*visibleTex[1]+.0722*visibleTex[2])/255 : 1;
          const grain=weave==='satin'?Math.max(0,Math.cos(theta-1.95))**11*.17:
            weave==='mesh'?(Math.sin(i*2.3)+Math.cos(j*2.7))*.012:
              Math.sin(theta*(weave==='twill'?13:9)+band*42)*.017;
          const edge=joined && j===0 || j===rows-1;
          const fluteLight=ruffle?.18*gather*Math.cos(fluteCount*(theta-angle)+.64*band):0;
          const light=(.76+.23*Math.cos(theta-1.95)+.11*Math.sin(theta)+grain+fluteLight)*(inner?.90:1)*(edge?.91:1);
          const tint=channels.map(c=>fabricFit.clamp(Math.round(c*light*swatch),0,255));
          const paint=opacity===1?'rgb('+tint.join(',')+')':'rgba('+tint.join(',')+','+opacity+')';
          const depth=points.reduce((sum,p)=>sum+p[2],0)/4;
          faces.push({points,depth,paint,skipStroke:opacity<1,seam:edge});
        }
      }
    }
  }

  if (pattern) {
    const torsoClearance = body.mesh ? importedEnvelope(body.mesh,torso) : torso;
    const aroundAvatar=([y,w,d,center=0,centerZ=0],part,side=1)=>{
      const sample=avatar?.sectionAt(part,y);
      if (!sample) return [y,w,d,center,centerZ];
      const [bw,bd,x,z]=sample;
      return [y,Math.max(w,bw+.012),Math.max(d,bd+.014),side*x,z];
    };
    let guarded = shellContact?sewingModels.smoothRings(shell,.028):avatar?expanded(shell).map(row=>{
      const anatomy=['dress','skirt'].includes(model) && row[0]>.30?'bothLegs':'torso';
      const fitted=aroundAvatar(row,anatomy);
      if (changes.hasSleeves && row[0]<-.63) {
        const smooth=fabricFit.clamp((-.63-row[0])/.11,0,1);
        fitted[1]+=.017*smooth;
        fitted[2]+=.009*smooth;
      }
      return fitted;
    }):fullBody?fabricFit.clearance(expanded(shell),torsoClearance):expanded(shell);
    if (!avatar && fullBody && ['dress','skirt'].includes(model)) {
      const coveredLegs=legBody.map(([y,w,d])=>[y,(w+legSpacing)*1.045,d*1.32]);
      guarded=fabricFit.clearance(guarded,coveredLegs);
    }
    mesh(guarded,color(pattern.color),0,model==='top'||model==='dress',true,true,
      (point,theta)=>{
        const [x,y,z]=point;
        const side=Math.abs(Math.cos(theta));
        const shoulderEase=Math.max(0,1-Math.abs(y+.70)/.28)*side**3;
        const rise=pose.arm*.061*shoulderEase;
        const reach=pose.reach*.032*shoulderEase;
        const back=model==='trousers'?Math.max(0,-Math.sin(theta)):0;
        const seatWeight=Math.max(0,1-Math.abs(y-.13)/.27);
        const extraBack=back*(changes.backRise||0)/100*Math.max(0,1-Math.abs(y+.16)/.46);
        const extraCrotch=(changes.crotch||0)/135*seatWeight*Math.sin(theta);
        const moved=[x,y-rise-extraBack,z+reach+extraCrotch];
        if (model==='top' && pose.sit && y>-.10) {
          const laid=skirtMove(moved,theta);
          const edge=fabricFit.clamp((y+.10)/.41,0,1);
          const front=Math.max(0,Math.sin(theta));
          const lap=edge*edge*(3-2*edge)*pose.sit*front;
          laid[1]-=(.075+.055*front)*lap;
          laid[2]+=.15*lap;
          return laid;
        }
        if (model==='dress'||model==='skirt') return skirtMove(moved,theta);
        return model==='trousers'?rig.pelvis(moved,theta):torsoMove(moved);
      },'shell');
    markSeams();
    drawSkirtLayers();
    bridgeShoulders();
    if (design?.hood) {
      const hood=fabricFit.resample([[-.867,.072,.041],[-.835,.10,.061],[-.775,.136,.079],[-.705,.136,.105],
        [-.64,.093,.086],[-.585,.031,.029]],.027);
      mesh(hood,color(design.primary),0,false,true,false,([x,y,z])=>torsoMove([x,y,z-.162-(y+.82)*.28]));
      mesh(fabricFit.resample([[-.868,.068,.043],[-.845,.091,.052]],.019),color(design.accent),0,false,false,false,
        ([x,y,z])=>torsoMove([x,y,z-.161-(y+.82)*.28]));
    }
    if (design) {
      const visible=forward=>Math.sin(angle+forward)>.30;
      const surface=surfaces.shell;
      const fromSurface=(heightFraction,theta)=>{
        const index=Math.round((surface.rings.length-1)*heightFraction);
        const [y,w,d]=surface.rings[index];
        return surface.projectPoint([y,w+.006,d+.006],theta,index);
      };
      const front=Math.PI/2, back=Math.PI*1.5;
      const addMark=(coordinates,style,closed=false)=>markings.push({points:coordinates.map(([level,theta])=>fromSurface(level,theta)),style,closed});
      if (visible(front) && design.kangaroo) addMark([[.87,1.02],[.77,1.05],[.61,1.23],[.61,1.91],[.77,2.09],[.87,2.12]],'rgba(29,22,38,.60)',true);
      if (visible(front) && design.raglan) for (const sign of [-1,1]) {
        addMark([[.025,front+sign*.41],[.105,front+sign*.63],[.20,front+sign*.87],[.28,front+sign*1.09]],'rgba(31,25,39,.51)');
      }
      const closure=design.closure;
      const center=closure==='Invisible zipper'||closure==='Back lacing'||closure==='Back button and loop'?back:closure==='Side zipper'?.14:front;
      if (visible(center)) {
        if (['Front buttons','Button fly','Front busk','Back button and loop'].includes(closure)) {
          const last=closure==='Button fly'?.29:.87;
          for (let level=.08;level<last;level+=last/7) {
            const [x,y,depth]=fromSurface(level,center);
            const radius=Math.max(1,scale*.012);
            markings.push({circle:[x,y,radius],depth,style:'#463632'});
            if (closure==='Back button and loop') break;
          }
        } else if (closure==='Back lacing') {
          addMark(Array.from({length:14},(_,i)=>[.05+i*.057,center+(i%2===0?-.14:.14)]),'rgba(39,24,35,.83)');
        } else if (['Invisible zipper','Side zipper','Separating zipper','Zip fly'].includes(closure)) {
          const length=closure==='Zip fly'?.26:closure==='Side zipper'?.43:.68;
          addMark(Array.from({length:8},(_,i)=>[i*length/7,center]),'rgba(58,42,47,.55)');
        }
      }
    }
    if (changes.hasSleeves && (model==='dress'||model==='top')) {
      const sleeve=(changes.sleeveWidth||0)/410+(sleeveStyle==='Puff'?.045:0);
      const length=(changes.sleeveLength||0)/75+({Cap:-.16,Short:-.08,Elbow:.07,Long:.39,Puff:.02,Bell:.36}[sleeveStyle]||0);
      const cuff=(changes.cuff||0)/410+(sleeveStyle==='Bell'?.085:0);
      for (const side of [-1,1]) {
        let rings=[[-.71,.075+sleeve+(changes.sleeveCap||0)/460,.091],[-.60,.085+sleeve+(changes.sleeveCap||0)/620,.105],
          [Math.max(-.595,-.46+length*.48),.068+sleeve*.6,.077],
          [Math.max(-.585,-.35+length),.057+cuff,.064+cuff*.64]];
        if (avatar) {
          const [start,end]=detailedSleeveEnd();
          rings=rings.map(([,w,d],i)=>[fabricFit.mix(start,end,i/3),w,d]);
        }
        const shellSleeve=expanded(hang(rings)).map(([y,w,d])=>{
          const [bw,bd]=fabricFit.envelope(armBody,y);
          const next=armBody.findIndex(ring=>ring[0]>=y);
          const i=fabricFit.clamp(next<0?armBody.length-1:next,1,armBody.length-1);
          const a=armBody[i-1],b=armBody[i];
          const t=fabricFit.clamp((y-a[0])/(b[0]-a[0]),0,1);
          const center=fabricFit.mix(a[3],b[3],t);
          if (avatar) return aroundAvatar([y,w,d,side*(center+shoulders)],'arm',side);
          return [y,Math.max(w,bw+.012),Math.max(d,bd+.012),side*(center+shoulders)];
        });
        const moveArm=armMove(side);
        const start=shellSleeve[0][0];
        const seamSpan=Math.min(.146,(shellSleeve.at(-1)[0]-start)*.75);
        const posedArm=articulated?.joints[side];
        const upperRadius=(body.upperArm||(body.bust||92)*.31)*2.368/168/(2*Math.PI);
        const armSegments=posedArm?[[posedArm.shoulder,posedArm.elbow,upperRadius,upperRadius*.78],
          [posedArm.elbow,posedArm.wrist,upperRadius*.78,(body.wrist||16)*2.368/168/(2*Math.PI)]].map(([a,b,first,last])=>{
          const axis=b.map((value,i)=>value-a[i]);
          return {a,axis,square:axis.reduce((sum,n)=>sum+n*n,0),first,last};
        }):[];
        function sleeveClearance(point,follow) {
          if (!follow || !armSegments.length) return point;
          let closest;
          for (const {a,axis,square,first,last} of armSegments) {
            if (square<1e-8) continue;
            const fromStart=point.reduce((sum,value,i)=>sum+(value-a[i])*axis[i],0);
            const t=fabricFit.clamp(fromStart/square,0,1);
            const normal=point.map((value,i)=>value-a[i]-axis[i]*t);
            const distance=Math.hypot(...normal);
            if (!closest || distance<closest.distance) {
              closest={normal,distance,radius:fabricFit.mix(first,last,t)+.008};
            }
          }
          if (!closest || closest.distance<.001 || closest.distance>=closest.radius) return point;
          const push=follow*(closest.radius/closest.distance-1);
          return point.map((value,i)=>value+closest.normal[i]*push);
        }
        const moveSleeve=avatar?(point,theta)=>{
          const t=fabricFit.clamp((point[1]-start)/Math.max(.025,seamSpan),0,1);
          const follow=t*t*(3-2*t);
          const arm=moveArm(point);
          if (follow===1) return sleeveClearance(arm,1);
          // Walk a closed armhole around the actual bodice on this side.
          // Its upper edge starts at the shoulder and its lower edge
          // follows the underarm, so raising the limb cannot detach it.
          const bodice=surfaces.shell;
          const underarm=fabricFit.clamp((1-side*Math.cos(theta))*.5,0,1);
          const angle=Math.sin(theta)*.64;
          const around=side>0?angle:Math.PI-angle;
          const depth=Math.min(bodice.rings.length-1,underarm*6);
          const row=Math.floor(depth);
          const a=bodice.sampleRing(around,row), b=bodice.sampleRing(around,Math.ceil(depth));
          const socket=a.map((value,axis)=>fabricFit.mix(value,b[axis],depth-row));
          return sleeveClearance(socket.map((value,axis)=>fabricFit.mix(value,arm[axis],follow)),follow);
        }:moveArm;
        mesh(shellSleeve,color(pattern.color),0,false,true,false,moveSleeve,'sleeve');
      }
    }
    if (trouserLeg) {
      const fitted=avatar?trouserLeg:fabricFit.clearance(trouserLeg,legBody);
      for (const side of [-1,1]) mesh(avatar?fitted.map(row=>aroundAvatar([...row,side*legSpacing],'leg',side)):fitted,color(pattern.color),avatar?0:side*legSpacing,false,true,true,(point,theta)=>{
        const moved=legMove(point);
        const knee=Math.max(0,1-Math.abs(point[1]-.64)/.19);
        moved[2]+=pose.sit*knee*Math.max(0,Math.sin(theta))*(changes.kneeFlex||0)/145;
        return moved;
      },'leg');
    }
  }
  if (analysis && pose.sit>.15 && fullBody) {
    const height= avatar?.pose?.(fabricFit.poses.sit).seatY ??
      (pose.sit===1?rig:fabricFit.rig(fabricFit.poses.sit,proportions.yAt)).seatY;
    const wide=Math.max(.30,.28+bodyHip);
    const near=.24, far=-.27, floor=1.126;
    const opacity=Math.min(1,(pose.sit-.15)*1.4);
    function seatFace(vertices,fill) {
      const points=vertices.map(project);
      faces.push({points,depth:points.reduce((n,point)=>n+point[2],0)/points.length,paint:fill});
    }
    seatFace([[-wide,height,far],[wide,height,far],[wide,height,near],[-wide,height,near]],`rgba(138,112,98,${.29*opacity})`);
    seatFace([[-wide,height,near],[wide,height,near],[wide,height+.027,near],[-wide,height+.027,near]],`rgba(108,82,69,${.30*opacity})`);
    for (const x of [-wide+.027,wide-.027]) {
      for (const z of [far+.026,near-.019]) {
        seatFace([[x,height,z],[x+.018,height,z],[x+.018,floor,z],[x,floor,z]],`rgba(108,82,69,${.26*opacity})`);
      }
    }
  }
  const depthRendered=(skinPoints||garmentLayers.length) && typeof fittingRender!=='undefined' && fittingRender.paint(context,{
    faces,skinPoints,skinTopology:skinPoints?humanPreview.topology:null,skinColor:skin,width,height,cx,cy,scale,markings
  });
  if (!depthRendered && skinPoints) {
    const channels=skin.slice(1).match(/../g).map(value=>parseInt(value,16));
    faces.push(...humanPreview.skinFaces(skinPoints,skinPoints.map(screen),channels));
  }
  for (const face of depthRendered?[]:faces.sort((a,b)=>a.depth-b.depth)) {
    context.beginPath();
    face.points.forEach(([x,y],index)=>index?context.lineTo(x,y):context.moveTo(x,y));
    context.closePath();
    context.fillStyle = face.paint;
    context.fill();
    context.lineWidth = face.skin?.52:.85;
    context.strokeStyle = face.paint;
    if (!face.skipStroke) context.stroke();
    if (face.seam) {
      const [a,b,c] = face.points;
      context.beginPath();
      context.moveTo(...b.slice(0,2));
      context.lineTo(...(Math.abs(a[1]-b[1])<.5?a:c).slice(0,2));
      context.strokeStyle = '#28121f42';
      context.lineWidth = .55;
      context.stroke();
    }
  }
  for (const mark of depthRendered?[]:markings) {
    context.beginPath();
    if (mark.circle) {
      context.ellipse(mark.circle[0],mark.circle[1],mark.circle[2],mark.circle[2],0,0,Math.PI*2);
      context.fillStyle=mark.style;
      context.fill();
      continue;
    }
    mark.points.forEach(([x,y],index)=>index?context.lineTo(x,y):context.moveTo(x,y));
    if (mark.closed) context.closePath();
    context.strokeStyle=mark.style;
    context.lineWidth=Math.max(.8,scale*.008);
    context.stroke();
  }
  return {...Object.fromEntries((analysis?.handleKeys || []).map(key=>[key,fitHandles.place(key,surfaces,canvas)])),...editorAnchors};
}

let fitPattern = 'dress';
let fitModel = 'studio-form';
let fitRevision = null;

function models() {
  const visible = allModels().filter(model=>isArchived('models',model.id)===showArchivedModels);
  view.innerHTML = heading('Model Library','Choose a female or male form, enter your measurements, or shape a custom form with your camera.')+
    `<div class="section-head"><h2>${showArchivedModels?'Archived models':'Saved models'}</h2><div class="actions"><button class="secondary" data-action="toggle-model-archive">${showArchivedModels?'Show active':'Show archive'}</button><button data-action="add-model">＋ Add custom model</button></div></div>
    <div class="patterns">${visible.length?visible.map(model=>`<article class="card pattern"><div class="pattern-art"><canvas width="350" height="155" data-form="${escape(model.id)}" role="img" aria-label="${escape(model.name)} preview"></canvas></div><div class="pattern-body"><h3>${escape(model.name)}</h3><p>${sewingModels.profiles[sewingModels.profileOf(model)]} · ${model.mesh?'Imported OBJ':model.scan?'Camera-shaped form':'Measurement-based form'} · Chest ${model.bust} cm · Waist ${model.waist} cm · Hip ${model.hip} cm</p>${sewingModels.summary(model)?`<p>${sewingModels.summary(model)}</p>`:''}<div class="actions">${showArchivedModels?'':`<button data-action="choose-model" data-id="${escape(model.id)}">Fit a garment</button>${state.models.includes(model)?`<button class="secondary" data-action="edit-model" data-id="${escape(model.id)}">Edit</button>`:''}`}<button class="secondary" data-action="archive-model" data-id="${escape(model.id)}">${showArchivedModels?'Restore':'Archive'}</button></div></div></article>`).join(''):'<p>No models in this view.</p>'}</div>`;
  for (const canvas of view.querySelectorAll('canvas')) drawModel(canvas,null,-.12,{},getModel(canvas.dataset.form),true);
}

function addModel(existing) {
  const starting = existing || getModel('studio-form');
  const baseKeys=['bust','waist','hip','shoulder'];
  const editedBase=new Set();
  const field=(key,required=false)=>{
    const [label,min,max]=sewingModels.dimensions[key];
    const tip=sewingModels.measuringTips[key];
    const measured=existing?.[key] ?? (required?starting[key]:'');
    return `<label class="field"><span>${label} (cm)</span><input type="number" data-length-input name="${key}" min="${min}" max="${max}" value="${escape(measured)}" step="0.5" ${required?'required':''} ${tip?`aria-describedby="model-tip-${key}"`:''}></label>${tip?`<small class="measurement-tip" id="model-tip-${key}">${tip}</small>`:''}`;
  };
  const fieldGrid=(keys,required=false)=>keys.map(key=>`<div class="model-measurement">${field(key,required)}</div>`).join('');
  const group=(section,help='',open=false)=>`<details class="design-options model-measurements"${open?' open':''}><summary>${section.title}</summary>${help}<div class="fields tight">${fieldGrid(section.keys)}</div></details>`;
  const [overall,...regions]=sewingModels.measurementGroups;
  showDialog(existing?'Edit model':'Add custom model',`<form id="model-form"><label class="field">Model name<input name="name" maxlength="90" value="${escape(existing?.name || '')}" required></label>
    <label class="field">Adult body profile<select name="profile">${Object.entries(sewingModels.profiles).map(([key,name])=>option(key,name,sewingModels.profileOf(starting))).join('')}</select></label>
    <div class="fields">${fieldGrid(baseKeys,true)}</div>
    <div class="fields">
      <div>${field('underbust')}</div>
      <label class="field" data-bra-size${sewingModels.profileOf(starting)==='male'?' hidden':''}>Bra size (optional)<input name="braSize" maxlength="20" value="${escape(existing?.braSize||'')}" placeholder="e.g. 34DD"></label>
    </div>
    <div id="cup-field"${sewingModels.profileOf(starting)==='male'?' hidden':''}>
      <p class="muted">Measure around the rib cage just below the bust. Full bust and underbust shape the preview. A bra size can help when underbust is missing.</p>
      <details class="design-options tight"><summary>Fine-tune bust shape</summary>
        <label class="field tight">Bra sizing system<select name="braSystem">${['Unspecified','US','UK','EU','Other'].map(system=>option(system,system,existing?.braSystem)).join('')}</select></label>
        ${field('bustProjection')}
        <p class="muted">Optional projection is the horizontal depth from the front of the rib cage to the fullest point. The preview limits depth using full bust and underbust.</p>
        <p data-bust-depth-note class="muted" role="status" hidden></p>
        <div class="fields">${fieldGrid(['bustSpacing','bustHeight'])}</div>
        <p class="muted">Measure spacing straight across between the fullest points. Measure height vertically from the floor to one of those points while standing.</p>
        <label class="field tight">Visual cup fallback<select name="cup"><option value="">Estimate from available measurements or bra size</option>${sewingModels.cups.map(cup=>option(cup,cup,existing?.cup)).join('')}</select></label>
      </details>
    </div>
    <div class="model-views"><canvas id="model-scan-preview" class="model-scan-preview" width="560" height="410" role="img" aria-label="Model shape preview"></canvas>
      <div class="actions tight"><button type="button" class="secondary" data-model-angle="0">Front view</button><button type="button" class="secondary" data-model-angle="0.65">Three-quarter view</button><button type="button" class="secondary" data-model-angle="1.57">Side view</button><button type="button" class="secondary" data-model-angle="3.14">Back view</button></div>
    </div>
    <p class="muted tight">Your measurements shape the preview. Placeholders marked “Est.” are adult landmark estimates for blank fields. Enter your height and body inseam for a closer starting fit.</p>
    <p id="model-proportion-note" class="muted tight" role="status" hidden></p>
    ${group(overall,`<div class="measurement-help">
      <svg viewBox="0 0 190 168" role="img" aria-label="Body measurement landmarks from shoulder, waist and crotch to floor">
        <circle cx="54" cy="22" r="12" fill="none" stroke="currentColor"/>
        <path d="M43 39Q33 39 28 47L22 96M65 39Q75 39 80 47L86 96M43 39H65L66 73L73 90L67 151H58L54 104L50 151H41L35 90L42 73Z" fill="none" stroke="currentColor"/>
        <path d="M91 39V73M105 73V153M119 104V153M42 73H105M54 104H119M36 153H125" fill="none" stroke="#752c40" stroke-dasharray="3 2"/>
        <text x="95" y="47">Shoulder</text><text x="110" y="78">Waist</text><text x="124" y="108">Crotch</text><text x="130" y="156">Floor</text>
      </svg>
      <dl><dt>Height</dt><dd>Top of head to floor, barefoot.</dd>
      <dt>Body inseam</dt><dd>From the crotch straight down the inside of the leg to the floor, barefoot. A pants inseam stops at the hem.</dd>
      <dt>Waist to floor</dt><dd>From your natural waist straight down at the side to the floor.</dd>
      <dt>Crown to chin</dt><dd>With your head level, measure the vertical distance from the top of your head to the bottom of your chin.</dd>
      <dt>Shoulder to waist</dt><dd>At the back, measure from where the neck meets the shoulder down to your natural waist.</dd></dl>
    </div>`,true)}
    ${regions.map(section=>group(section)).join('')}
    <details class="design-options" data-model-camera><summary>Shape your form with a camera</summary>
      <p class="tight">Stand head to toe against a plain, contrasting background. Wear fitted clothes and keep your arms down and a little away from your torso. Capture one front view and one side view. Use the same camera position for both.</p>
      <p class="tight">Your measurements set the sizing. Only the outline is kept. Camera frames stay on this device and aren’t saved.</p>
      <video class="model-camera" muted autoplay playsinline hidden aria-label="Live camera preview"></video>
      <p class="tight" role="status">${existing?.scan?'This model has a saved outline.':''}</p>
      <div class="actions tight"><button type="button" data-camera-start>Turn camera on</button><button type="button" class="secondary" data-camera-front>Capture front</button><button type="button" class="secondary" data-camera-side>Capture side</button><button type="button" class="secondary" data-camera-stop>Turn off</button><button type="button" class="secondary" data-camera-clear>Clear outline</button></div>
      <label class="field tight">Form skin tone<input type="color" name="skin" value="${color(existing?.skin || '#d7b69d')}"></label>
    </details>
    <details class="design-options"><summary>Import a 3D torso instead</summary><label class="field tight">Optional 3D torso file (.obj)<input type="file" name="mesh" accept=".obj"></label>
      <p>Use a low-poly torso with Y pointing up and the front facing +Z. An imported mesh takes priority over a camera outline.</p>
      ${existing?.mesh?'<label class="sleeve-choice tight"><input type="checkbox" name="removeMesh"> Remove the saved OBJ mesh</label>':''}
    </details>
    <p id="model-error" class="tight" role="alert"></p><button>Save model</button></form>`);
  const form = document.querySelector('#model-form');
  const canvas = form.querySelector('#model-scan-preview');
  const proportionNote=form.querySelector('#model-proportion-note');
  const modelError=form.querySelector('#model-error');
  const dimensionFields=Object.fromEntries(Object.keys(sewingModels.dimensions).map(key=>[key,form.elements.namedItem(key)]));
  let scan = existing?.scan || null;
  let previewAngle=-.38;
  let previewFrame;
  let lastHint='';
  for (const button of form.querySelectorAll('[data-model-angle]')) button.onclick=()=>{
    previewAngle=Number(button.dataset.modelAngle);preview();
  };
  const readDimensions=()=>Object.fromEntries(Object.entries(dimensionFields).flatMap(([key,field])=>{
    const metric=studioUnits.lengthValue(field);
    return metric==null?[]:[[key,metric]];
  }));
  function measurementHints() {
    const profile=form.elements.namedItem('profile').value;
    const data={...readDimensions(),profile};
    const {estimates={},adjusted=[]}=sewingModels.proportions(data);
    const review=new Set(adjusted);
    for (const [key,input] of Object.entries(dimensionFields)) {
      if (input.value==='' && Number.isFinite(estimates[key])) studioUnits.writeEstimate(input,estimates[key]);
      else if (input.dataset.estimatedLength!==undefined) studioUnits.writeEstimate(input,null);
      const {rangeUnderflow,rangeOverflow,badInput}=input.validity;
      if (rangeUnderflow || rangeOverflow || badInput) review.add(key);
      if (input.closest('#cup-field')?.hidden) review.delete(key);
      const flagged=review.has(key);
      if (flagged) input.setAttribute('aria-invalid','true');
      else input.removeAttribute('aria-invalid');
      const descriptions=[sewingModels.measuringTips[key]?`model-tip-${key}`:'',flagged?'model-proportion-note':''].filter(Boolean);
      if (descriptions.length) input.setAttribute('aria-describedby',descriptions.join(' '));
      else input.removeAttribute('aria-describedby');
    }
    const labels=[...review].map(key=>sewingModels.dimensions[key]?.[0]).filter(Boolean);
    const issue=sewingModels.measurementIssue(data);
    const message=[labels.length?`Review ${labels.join(', ')}. Check the tape landmarks and the selected unit.`:'',issue].filter(Boolean).join(' ');
    proportionNote.hidden=!message;
    if (lastHint!==message) {
      lastHint=message;
      proportionNote.textContent=message;
      studioUnits.refresh(proportionNote);
    }
  }
  function preview() {
    const data = new FormData(form);
    const shape={...readDimensions(),profile:data.get('profile'),cup:data.get('cup'),braSize:data.get('braSize'),mesh:data.has('removeMesh')?null:existing?.mesh,scan,skin:color(data.get('skin'))};
    const depth=sewingModels.bustGeometry(shape,sewingModels.proportions(shape));
    const note=form.querySelector('[data-bust-depth-note]');
    note.hidden=!depth.limited;
    if (depth.limited) note.textContent='The entered depth is too large for the preview. Check the measurement and the selected unit.';
    drawModel(canvas,null,previewAngle,{},shape,true);
  }
  const cleanCamera = modelCamera.setup(form.querySelector('[data-model-camera]'),scan,next=>{
    scan=next;
    preview();
  });
  modalCleanup=()=>{
    cancelAnimationFrame(previewFrame);
    cleanCamera?.();
  };
  form.addEventListener('input',event=>{
    if (baseKeys.includes(event.target.name)) editedBase.add(event.target.name);
    const male=form.elements.namedItem('profile').value==='male';
    form.querySelector('#cup-field').hidden=male;
    form.querySelector('[data-bra-size]').hidden=male;
    if (event.target.name==='profile' && !existing) {
      const preset=sewingModels.starter[event.target.value];
      for (const key of baseKeys) if (!editedBase.has(key)) studioUnits.writeLength(dimensionFields[key],preset[key]);
    }
    if (event.target.matches('[data-length-input], [name=profile]')) measurementHints();
    modelError.textContent='';
    cancelAnimationFrame(previewFrame);
    previewFrame=requestAnimationFrame(preview);
  });
  measurementHints();
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get('name').trim();
    const error = modelError;
    if (!name) { error.textContent = 'Enter a model name.'; return; }
    const file = data.get('mesh');
    let mesh = data.has('removeMesh')?undefined:existing?.mesh;
    if (file.size) {
      try {
        if (!/\.obj$/i.test(file.name) || file.size>1000000) throw Error('Choose an OBJ file under 1 MB.');
        mesh = sewingModels.parseObj(await file.text());
      } catch (problem) { error.textContent = problem.message; return; }
    }
    if (!form.isConnected || !modal.open) return;
    const measurements=readDimensions();
    const issue=sewingModels.measurementIssue({...measurements,profile:data.get('profile')});
    if (issue) {error.textContent=issue;return;}
    const item = {id:existing?.id || 'form-'+createId(),name,...measurements,profile:data.get('profile'),cup:data.get('profile')==='female'?data.get('cup'):'',braSize:data.get('profile')==='female'?data.get('braSize').trim():'',
      braSystem:data.get('profile')==='female'?data.get('braSystem'):'',mesh,scan,skin:color(data.get('skin'))};
    if (existing) state.models = state.models.map(model=>model.id===item.id?item:model);
    else state.models.push(item);
    save(existing?'Model updated':'Model added');
    modalCleanup?.();
    modalCleanup=undefined;
    modal.close();
    showArchivedModels=false;
    models();
  });
}

function startFit(id,modelId) {
  fitPattern = id;
  fitRevision = getPattern(id).fit || null;
  fitModel = modelId || fitRevision?.modelId || getPattern(id).design?.fitModelId || (!isArchived('models',fitModel)?fitModel:activeChoices(allModels(),'models')[0]?.id) || fitModel;
  if (modal.open) modal.close();
  if (location.hash==='#fitting') render();
  else location.hash='fitting';
}

let fittingDraft;
const adjustmentText = n => (n>0?'+':'')+n+' cm';
function fitSlider(key,value,label=garmentFit.fields[key][0]) {
  const [,max,minus,plus]=garmentFit.fields[key];
  return `<label class="field adjustment"><span>${label} <output id="${key}-value">${adjustmentText(value)}</output></span><input data-fit-slider name="${key}" type="range" min="-${max}" max="${max}" step="0.5" value="${value}"><span class="adjustment-ends"><span>${minus}</span><span>${plus}</span></span></label>`;
}
function guide(pattern,changes,body) {
  const {waist,hip,length} = changes;
  const model = basePattern(pattern).id;
  const steps = [
    `Measure the garment and the wearer at the same reference points. The selected model measures ${body.bust} cm at the chest, ${body.waist} cm at the waist and ${body.hip} cm at the hip. Compare the finished garment measurements with those values and allow enough wearing ease for the fabric and style.`,
    'Turn the garment inside out and mark the original stitching lines. If a lining, facing or waistband blocks the seam, open only the section needed for access.'
  ];
  const visuals = ['measure','open'];
  if (changes.neckline) {
    steps.push(`Trace the new ${changes.neckline} neckline, baste a toile, and check coverage and head clearance. Mark the sewing allowance before cutting and draft a facing or binding to follow the new edge.`);
    visuals.push('neck');
  }
  if (Object.hasOwn(changes,'sleeves')) {
    steps.push(changes.sleeves
      ? 'Trace a compatible sleeve for the armhole and make a test sleeve in matching fabric. Baste it at the notches and check reach before sewing and finishing the armhole.'
      : 'Unpick the sleeves and check the shape and coverage of both armholes on the wearer. Staystitch and finish the openings with a compatible facing or binding.');
    visuals.push('sleeve');
  }
  if (changes.sleeveStyle) {
    steps.push(`Use a ${changes.sleeveStyle.toLowerCase()} sleeve pattern matched to the armhole. Baste it in at the shoulder and underarm marks, then check coverage and reach before stitching.`);
    visuals.push('sleeve');
  }
  if (changes.support==='Strapless') {
    steps.push('Fit a strapless sample with the lining, waist stay or other support specified by the pattern. Test that it stays in place while sitting and moving before you remove any existing shoulders or straps.');
    visuals.push('strapless');
  } else if (changes.support) {
    const placement=changes.strapPlacement
      ? ` Move the attachment ${Math.abs(changes.strapPlacement)} cm ${changes.strapPlacement<0?'inward':'outward'} from the starting shoulder mark.` : '';
    const route=changes.support==='Halter strap'?'Pin the strap ends to the front bodice and fit the strap around the neck.':changes.support==='One-shoulder'
      ? 'Pin the strap from front to back over the wearer’s right shoulder and fit the opposite edge.'
      : 'Pin each shoulder piece from the front bodice to the back bodice.';
    steps.push(`Fit the ${changes.support.toLowerCase()} at ${changes.strapWidth} cm wide, finished. ${route}${placement} Mark the length on the wearer, add the attachment allowances, then baste and check that the garment stays up before securing the ends.`);
    visuals.push('strap');
  }
  for (const [key,value] of Object.entries(changes)) {
    if (!value || !garmentFit.fields[key] || ['waist','hip','length'].includes(key)) continue;
    const [visual,step] = garmentFit.directions(key,value);
    steps.push(step);
    visuals.push(visual);
  }
  if (waist || hip) {
    for (const [area,amount] of [['waist',waist],['hip',hip]]) {
      if (!amount) continue;
      const allowance = Math.abs(amount)/4;
      visuals.push(amount<0?'take':'let');
      steps.push(amount<0
        ? `At the ${area}, take in ${Math.abs(amount)} cm total. When both side seams share the change equally, mark ${allowance} cm inward from the original stitching line on both layers at each side seam. Refit the waistband if the waist edge changes.`
        : `At the ${area}, let out ${amount} cm total. When both side seams share the change equally, the new line moves ${allowance} cm toward the raw edges on both layers at each side seam. Check that the remaining seam allowance is sufficient for the fabric and finish. If it is too narrow, plan inserts or a different seam distribution before proceeding.`);
    }
    visuals.push('blend','seam');
    steps.push('Blend the new stitching lines smoothly into the unchanged seams. Baste both sides, then try on the garment while standing, sitting and moving. Check symmetry and distribute the adjustment differently if a zipper, pocket or design seam affects the fit.');
    steps.push('Stitch the confirmed lines, finish the raw edges and press. Refit and reattach any opened lining, facing or waistband.');
  }
  if (length) {
    visuals.push(length<0?'hemUp':'hemDown','finish');
    const target = model==='trousers'?'both trouser legs':'the garment';
    steps.push(length<0
      ? `Try on ${target} with the intended shoes if applicable. Mark the new finished hem ${Math.abs(length)} cm above the old hem. Add the hem allowance below the new line before trimming and keep the original finish in mind.`
      : `Mark the new finished hem ${length} cm below the old hem. Unpick and press the existing hem. Confirm there is enough fabric for a secure finish. Use a faced hem to preserve available length, or add a cuff or extension if the existing fabric is insufficient.`);
    steps.push('Baste and check the hem level while worn. Stitch the hem, then press with a suitable press cloth.');
  }
  steps.push('Check the finished measurements, ease, closures and hem before trimming any remaining excess or closing the lining.');
  visuals.push('fit');
  return {steps,visuals};
}
function fitDifference(source, target, sourceBody, targetBody) {
  const before=source.fit?.changes || source.design?.fitAdjustments || {};
  const after=target.fit?.changes || target.design?.fitAdjustments || {};
  const difference={};
  for (const key of garmentFit.keys(basePattern(target).id,hasSleeves(target))) {
    const measurement=['bust','waist','hip','shoulder'].includes(key)?targetBody[key]-sourceBody[key]:0;
    const value=(after[key]||0)-(before[key]||0)+measurement;
    if (value) difference[key]=value;
  }
  if (hasSleeves(source)!==hasSleeves(target)) difference.sleeves=hasSleeves(target);
  const sourceNeck=before.neckline || source.design?.neckline || 'Scoop';
  const targetNeck=after.neckline || target.design?.neckline || 'Scoop';
  if (sourceNeck!==targetNeck) difference.neckline=targetNeck;
  if (['dress','top'].includes(basePattern(target).id)) {
    const original=shoulderSettings(source), selected=shoulderSettings(target);
    if (selected.support!==original.support || selected.support!=='Strapless' &&
        (selected.strapWidth!==original.strapWidth || selected.strapPlacement!==original.strapPlacement)) {
      Object.assign(difference,{support:selected.support,strapWidth:selected.strapWidth,strapPlacement:selected.strapPlacement});
    }
    if (hasSleeves(target) && (!hasSleeves(source) || original.sleeveStyle!==selected.sleeveStyle)) difference.sleeveStyle=selected.sleeveStyle;
  }
  return difference;
}
function applyDesignFit(item,body) {
  const changes=item.design?.fitAdjustments || {};
  if (!Object.values(changes).some(Boolean)) return item;
  const adjustment=guide(item,changes,body);
  return {...item,steps:[item.steps[0],...adjustment.steps.slice(2,-1),...item.steps.slice(1)],
    visuals:[item.visuals[0],...adjustment.visuals.slice(2,-1),...item.visuals.slice(1)]};
}
function fitSummary(delta) {
  return Object.entries(delta).flatMap(([key,amount])=>{
    if (key==='neckline') return amount+' neckline';
    if (key==='support') return amount;
    if (key==='strapWidth' && Number.isFinite(amount)) return 'Finished shoulder width '+amount+' cm';
    if (key==='strapPlacement' && amount) return 'Shoulder placement '+adjustmentText(amount);
    if (key==='sleeveStyle') return amount+' sleeves';
    if (key==='sleeves') return amount?'Add sleeves':'Remove sleeves';
    return garmentFit.fields[key]?garmentFit.fields[key][0]+' '+adjustmentText(amount):[];
  }).join(' · ');
}
function fitMeasurementSheet(body,targetChanges,difference,make,pattern,sourceBody) {
  const dimensions=Object.entries(sewingModels.dimensions).map(([key,[label]])=>[key,label]);
  const cm=value=>value==null?'—':value+' cm';
  const rows=dimensions.filter(([key])=>body[key] || sourceBody[key]).map(([key,label])=>[
    label,...(make?[]:[cm(sourceBody[key])]),cm(body[key])
  ]);
  const changes=make?targetChanges:difference;
  const adjustments=Object.entries(changes).filter(([key,value])=>garmentFit.fields[key]&&value)
    .map(([key,value])=>[garmentFit.fields[key][0],adjustmentText(value)]);
  if (changes.neckline) adjustments.push(['Neckline style',changes.neckline]);
  if (make && ['dress','top'].includes(basePattern(pattern).id)) adjustments.push(['Sleeves',targetChanges.hasSleeves?'Sleeved':'Sleeveless']);
  if (Object.hasOwn(changes,'sleeves')) adjustments.push(['Sleeves',changes.sleeves?'Add sleeves':'Remove sleeves']);
  if (changes.support) adjustments.push(['Shoulder support',changes.support]);
  if (Number.isFinite(changes.strapWidth)) adjustments.push(['Finished shoulder width',cm(changes.strapWidth)]);
  if (changes.strapPlacement) adjustments.push(['Shoulder placement',adjustmentText(changes.strapPlacement)]);
  if (changes.sleeveStyle && (make?targetChanges.hasSleeves:true)) adjustments.push(['Sleeve style',changes.sleeveStyle]);
  if (make) for (const [key,value] of Object.entries(studioDesign.seams(pattern.design))) {
    adjustments.push([key==='waistSeam'?'Waist join seam offset':'Front panel seam offset',adjustmentText(value)]);
  }
  const targets=[];
  if (make && Number.isFinite(pattern.design?.ease)) {
    const model=basePattern(pattern).id;
    const key=['top','dress'].includes(model)?'bust':'hip';
    targets.push([key==='bust'?'Finished chest / bust target':'Finished hip / seat target',cm(body[key]+pattern.design.ease+(targetChanges[key]||0))]);
  }
  const layers=make?studioDesign.layers(pattern.design).map((layer,index)=>[
    `Layer ${index+1} · ${layer.kind}`,layer.fabric,layer.kind==='Ruffle'?cm(layer.depth)+' drop':adjustmentText(layer.hemOffset),cm(layer.sweep),
    Object.hasOwn(layer,'attachment')?`${layer.attachment}% from waist to main hem`:'Waist seam'
  ]):[];
  return {headings:make?['Model measurement','Size']:['Model measurement','Source','Target'],
    rows,adjustments,targets,layers,make};
}
function fitMeasurementTable(sheet) {
  if (!sheet) return '';
  const table=(headings,rows)=>`<div class="table"><table><thead><tr>${headings.map(h=>`<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(([label,...cells])=>
    `<tr><th scope="row">${escape(label)}</th>${cells.map(cell=>`<td>${escape(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  return `<section class="wo-measurements"><h3>Measurement sheet</h3>${table(sheet.headings,sheet.rows)}
    ${sheet.adjustments.length?table(['Garment setting',sheet.make?'Change from the base pattern':'Change from source to target'],sheet.adjustments):''}
    ${sheet.targets.length?table(['Finished garment','Target including design ease'],sheet.targets):''}
    ${sheet.layers?.length?table(['Fabric layer','Fabric','Hem offset or drop','Extra hem sweep','Attachment'],sheet.layers):''}
    <p class="muted">${sheet.make?'Use your selected sewing pattern for cut-piece dimensions and seam allowances.':'Measure the existing garment before marking the listed changes.'}</p></section>`;
}

function constructionGuide(pattern,changes,body,fabric) {
  let base=pattern;
  while (base.fit?.source && getPattern(base.fit.source)) base=getPattern(base.fit.source);
  const delta=fitDifference(base,{...pattern,fit:{changes}},body,body);
  const settings=Object.keys(delta).length?guide(base,delta,body):null;
  const steps=[`For this new garment, choose a block in the selected model’s size and check the bust (${body.bust} cm), waist (${body.waist} cm), hip (${body.hip} cm), and shoulders (${body.shoulder} cm) against the pattern. Test ${fabric.name} (${fabric.gsm} g/m²) for the intended ease and finish.`];
  const visuals=['measure'];
  if (settings) {
    steps.push('Make a fitting sample in similar fabric. Apply the changes below to that sample, then transfer them to the paper pattern and check the adjoining seam lengths before cutting your final fabric.',...settings.steps.slice(2));
    visuals.push('designCut',...settings.visuals.slice(2));
  }
  const design=pattern.design || base.design;
  const instructions=design?studioDesign.make({...designForFit(design,changes),fabric:fabric.name},pattern.name,body):base;
  const baseVisuals=instructions.visuals || sewingVisuals.patterns[base.id] || instructions.steps.map(sewingVisuals.identify);
  return {steps:[...steps,...instructions.steps],visuals:[...visuals,...baseVisuals],tools:instructions.tools,
    fabric:`${fabric.name} (${fabric.gsm} g/m²). ${instructions.fabric}`};
}

function fitting() {
  const pattern = getPattern(fitPattern);
  const modelType = basePattern(pattern).id;
  const publisher=pattern.external;
  const sleeveEligible = ['dress','top'].includes(modelType);
  const fabricName=preferredFabric || fitRevision?.fabric?.name || pattern.design?.fabric ||
    (/denim/i.test(pattern.fabric)?'Rigid denim':/twill|suiting/i.test(pattern.fabric)?'Medium-weight twill':'Cotton poplin');
  preferredFabric='';
  const initialMaterial=getFabric(fabricName);
  const initialWeight=fitRevision?.fabric?.gsm || initialMaterial.gsm;
  const siblings=pattern.family?allPatterns().filter(item=>item.family===pattern.family && item.id!==pattern.id && !isArchived('patterns',item.id)):[];
  const startingNeck=fitRevision?.changes.neckline || pattern.design?.neckline || 'Scoop';
  const startingFit=fitRevision?.changes || pattern.design?.fitAdjustments || {};
  const shoulders=shoulderSettings(pattern);
  const supportStyles=studioDesign.supportChoices(pattern.design?.model || modelType);
  const canHaveSleeves=shoulders.support==='Integrated shoulders';
  view.innerHTML = heading('3D Fitting Room','Choose a model and garment, preview your fit changes, then create an illustrated work order.') + `<div class="split"><section class="panel viewer fitting-viewer"><div class="fit-canvas"><canvas id="model" tabindex="0" role="img" aria-label="Rotatable three-dimensional garment preview. Use left and right keys to turn the garment."></canvas><div id="fit-handles" hidden></div></div><div class="viewer-footer"><span class="muted">Drag or use left and right keys to rotate</span><button class="secondary" id="reset-view">Front view</button></div>    <div class="fit-preview-controls">
      <label class="field">Movement<select id="fit-pose"><optgroup label="Poses">${Object.entries(fabricFit.poses).map(([key,value])=>option(key,value.name,'stand')).join('')}</optgroup><optgroup label="Motion loops">${Object.entries(fabricFit.motions).map(([key,value])=>option(key,value.name)).join('')}</optgroup></select></label>
      <div id="motion-controls" hidden>
        <button type="button" class="secondary" id="play-motion">Play motion</button>
        <label class="field">Motion progress<input id="motion-progress" type="range" min="0" max="100" step=".1" value="0"></label>
        <label class="field">Speed<select id="motion-speed"><option value=".5">Half speed</option><option value="1" selected>Normal</option><option value="1.5">1.5×</option></select></label>
      </div>
      <label class="fit-map-toggle"><input type="checkbox" id="fit-map" checked> Show tightness</label>
      <label class="field">Sculpt with handles<select id="fit-handle-group"><option value="">Off</option></select></label><button type="button" class="secondary" id="fit-undo" disabled>Undo drag</button>
      <p id="fit-handle-help" class="fit-handle-help" hidden>Drag horizontally for width or vertically for length. Arrow keys adjust a focused handle. Use Shift for larger steps.</p>
      <div id="fit-legend"><div class="fit-legend-gradient" aria-hidden="true"></div><div class="fit-legend-labels"><span>Ease</span><span>Snug</span><span>Restricted</span></div></div>
      <p id="fit-reading" class="fit-reading" aria-live="polite"></p>
      ${['trousers','dress','skirt'].includes(modelType)?'<div class="seat-fit"><button type="button" class="secondary" id="add-seat-ease">Add sitting ease</button><p id="seat-fit-hint" class="fit-reading"></p></div>':''}
    </div>
</section><section class="panel fitting-controls"><h2>Fit adjustments</h2><form id="fitting-form">
    <label class="field">3D model<select name="model">${modelOptions(fitModel)}</select></label>
    <p class="model-link"><a href="#models">Open Model Library</a></p>
    <label class="field">Garment<select name="pattern">${options(fitPattern,true)}</select></label>
    ${publisher?'<p class="fit-baseline muted">This style preview estimates the silhouette. Use the publisher’s draft for cutting dimensions.</p>':''}
    <div class="fields">
      <label class="field">Fabric<select name="fabric">${fabricOptions(fabricName)}</select></label>
      <label class="field">Fabric weight (g/m²)<input name="fabricWeight" type="number" value="${initialWeight}" min="45" max="900" step="1" required></label>
    </div>
    <details class="design-options"><summary>Fabric stretch and drape</summary>
      <div class="fields tight">
        <label class="field">Crosswise stretch (%)<input type="number" name="fabricCross" min="0" max="100" step="0.1" value="${Math.round((fitRevision?.fabric?.cross ?? initialMaterial.cross)*1000)/10}" required></label>
        <label class="field">Lengthwise stretch (%)<input type="number" name="fabricLength" min="0" max="100" step="0.1" value="${Math.round((fitRevision?.fabric?.length ?? initialMaterial.length)*1000)/10}" required></label>
      </div>
      <label class="field">Drape firmness<select name="fabricBend">${[['.2','Fluid'],['.42','Balanced'],['.65','Structured']].map(([value,label])=>option(value,label,String((fitRevision?.fabric?.bend ?? initialMaterial.bend)<.31?'.2':(fitRevision?.fabric?.bend ?? initialMaterial.bend)<.55?'.42':'.65'))).join('')}</select></label>
      <p>Set stretch to the amount you can pull a swatch before you feel firm resistance.</p>
    </details>
    ${sleeveEligible?`<label class="field">Neckline style<select name="neckline">${studioDesign.necklines.map(name=>option(name,name,startingNeck)).join('')}</select></label>
      <fieldset class="wo-path"><legend>Shoulders and sleeves</legend>
        <label class="field">Shoulder support<select name="support">${supportStyles.map(name=>option(name,name,shoulders.support)).join('')}</select></label>
        <div class="fields" data-strap-sizing ${shoulders.support==='Strapless'?'hidden':''}>
          <label class="field">Finished shoulder width (cm)<input name="strapWidth" type="number" data-length-input min=".4" max="12" value="${shoulders.strapWidth??''}"></label>
          <label class="field">Shoulder placement (cm)<input name="strapPlacement" type="number" data-length-input min="-4" max="4" value="${shoulders.strapPlacement}"></label>
        </div>
        <p class="muted" data-strap-sizing ${shoulders.support==='Strapless'?'hidden':''}>Negative placement moves toward the neck. Positive placement moves toward the arm.</p>
        <p class="muted" data-strapless-note ${shoulders.support==='Strapless'?'':'hidden'}>Check the support and stability of a strapless bodice on a fitting sample.</p>
        <div data-sleeve-toggle ${canHaveSleeves?'':'hidden'}><label class="sleeve-choice"><input name="sleeves" type="checkbox" ${canHaveSleeves&&hasSleeves(pattern)?'checked':''}> Add sleeves</label></div>
        <div data-sleeve-style ${canHaveSleeves&&hasSleeves(pattern)?'':'hidden'}><label class="field">Sleeve style<select name="sleeveStyle">${studioDesign.sleeves.filter(style=>style!=='Sleeveless').map(name=>option(name,name,shoulders.sleeveStyle)).join('')}</select></label></div>
      </fieldset>`:''}
    ${pattern.revision?`<p class="muted fit-baseline">Changes are measured from revision ${pattern.revision}. Saving creates a new revision.</p>`:
      Object.values(pattern.design?.fitAdjustments||{}).some(Boolean)?'<p class="muted fit-baseline">These sliders start from the fit saved with this design.</p>':''}
    <div id="fit-sliders"></div>
    <p class="muted fit-baseline">The map estimates stretch demand as the fabric moves. The preview uses the selected weight, stretch and drape. Check the fit and movement on a sewn sample.</p>${publisher?`<div class="actions tight"><button type="button" data-action="new" data-use-fit-model data-id="${escape(pattern.id)}">Create publisher-pattern work order</button><button type="reset" class="secondary">Reset changes</button></div>${referenceLinks(pattern)}`:`<fieldset class="wo-path"><legend>Create work order</legend>
      <label class="field">Tailoring target<select name="tailorTarget"><option value="">Current fit as a new revision</option>${siblings.map(item=>option(item.id,'Saved revision '+item.revision)).join('')}</select></label>
      ${pattern.revision?`<p class="muted">Source garment is revision ${pattern.revision}. Choose a saved revision to use its recorded settings as the tailoring target.</p>`:''}
      <p class="muted">Make a new garment uses the fit shown above and creates a separate design.</p>
      <div class="actions tight"><button name="workType" value="tailor">Tailor between revisions</button><button class="secondary" name="workType" value="make">Make a new garment</button><button type="reset" class="secondary">Reset changes</button></div>
    </fieldset>`}</form></section></div><section id="fit-guide" class="panel instructions" hidden></section>`;
  const form = document.querySelector('#fitting-form');
  const canvas = document.querySelector('#model');
  const fitGuide = document.querySelector('#fit-guide');
  const sliders = document.querySelector('#fit-sliders');
  let angle = 0;
  let pointer;
  let pose={...fabricFit.poses.stand};
  let animation=0;
  let playing=false;
  let motionProgress=0;
  const poseField=document.querySelector('#fit-pose');
  const motionControls=document.querySelector('#motion-controls');
  const playMotion=document.querySelector('#play-motion');
  const timeline=document.querySelector('#motion-progress');
  const speed=document.querySelector('#motion-speed');
  const mapField=document.querySelector('#fit-map');
  const reading=document.querySelector('#fit-reading');
  const overlay=document.querySelector('#fit-handles');
  const handleGroup=document.querySelector('#fit-handle-group');
  const undoButton=document.querySelector('#fit-undo');
  const handleHelp=document.querySelector('#fit-handle-help');
  const history=[];
  let activeHandles=[];
  let drag;
  let groups={};
  const pickedFabric=()=>form.elements.namedItem('fabric').value;
  const gsm=()=>fabricFit.clamp(Number(form.elements.namedItem('fabricWeight').value)||initialWeight,45,900);
  const stretchInput=key=>fabricFit.clamp(Number(form.elements.namedItem(key).value)/100,0,1);
  const material=()=>({power:getFabric(pickedFabric()).power,gsm:gsm(),
    cross:stretchInput('fabricCross'),length:stretchInput('fabricLength'),
    bend:Number(form.elements.namedItem('fabricBend').value)});
  function setFabricDefaults(preset,weight=preset.gsm) {
    form.elements.namedItem('fabricWeight').value=weight;
    form.elements.namedItem('fabricCross').value=Math.round(preset.cross*1000)/10;
    form.elements.namedItem('fabricLength').value=Math.round(preset.length*1000)/10;
    form.elements.namedItem('fabricBend').value=preset.bend<.31?'.2':preset.bend<.55?'.42':'.65';
  }
  const neckline=()=>form.elements.namedItem('neckline')?.value || startingNeck;
  const supportField=form.elements.namedItem('support');
  const sleeveToggle=form.elements.namedItem('sleeves');
  const sleeveStyle=form.elements.namedItem('sleeveStyle');
  const strapWidth=form.elements.namedItem('strapWidth');
  const strapPlacement=form.elements.namedItem('strapPlacement');
  const sleeves = () => supportField?.value==='Integrated shoulders' && sleeveToggle.checked;
  function refreshShoulders() {
    if (!supportField) return;
    const strapless=supportField.value==='Strapless';
    for (const row of form.querySelectorAll('[data-strap-sizing]')) row.hidden=strapless;
    strapWidth.disabled=strapPlacement.disabled=strapless;
    form.querySelector('[data-strapless-note]').hidden=!strapless;
    form.querySelector('[data-sleeve-toggle]').hidden=supportField.value!=='Integrated shoulders';
    form.querySelector('[data-sleeve-style]').hidden=!sleeves();
  }
  refreshShoulders();
  const keys = () => garmentFit.keys(modelType,sleeves());
  const changes = () => Object.fromEntries(keys().map(key=>[key,Number(form.elements.namedItem(key)?.value || 0)]));
  const adjustments = () => {
    const result = {hasSleeves:sleeves(),neckline:neckline()};
    if (supportField) {
      result.support=supportField.value;
      if (result.support!=='Strapless') {
        result.strapWidth=fabricFit.clamp(studioUnits.lengthValue(strapWidth)??studioDesign.supportWidth(result.support),.4,12);
        result.strapPlacement=fabricFit.clamp(studioUnits.lengthValue(strapPlacement)??0,-4,4);
      }
      if (result.hasSleeves) result.sleeveStyle=sleeveStyle.value;
    }
    for (const [key,n] of Object.entries(changes())) result[key] = (startingFit[key] || 0)+n;
    return result;
  };
  const body = () => getModel(fitModel);
  function drawControls(values={}) {
    const seatedKeys=['upperHip','seatDepth','lapEase','kneeEase','sittingLength'];
    const slider=key=>{
      const [defaultLabel] = garmentFit.fields[key];
      const label=key==='neckDepth'?`${neckline()} depth`:key==='neckWidth'?`${neckline()} width`:defaultLabel;
      const n = values[key] || 0;
      return fitSlider(key,n,label);
    };
    const seated=keys().filter(key=>seatedKeys.includes(key));
    sliders.innerHTML = (seated.length?`<fieldset class="wo-path"><legend>Seated fit</legend>${seated.map(slider).join('')}</fieldset>`:'')+
      keys().filter(key=>!seatedKeys.includes(key)).map(slider).join('');
  }
  drawControls();
  function refreshGroups() {
    const selected=handleGroup.value;
    groups=Object.fromEntries(fitHandles.available(keys()));
    handleGroup.innerHTML='<option value="">Off</option>'+Object.entries(groups).map(([id,g])=>option(id,g.label,selected)).join('');
    renderHandles();
  }
  function renderHandles() {
    activeHandles=groups[handleGroup.value]?.keys || [];
    overlay.hidden=handleHelp.hidden=!activeHandles.length;
    overlay.innerHTML=activeHandles.map(key=>{
      const spec=fitHandles.specs[key];
      return `<button type="button" class="fit-handle" data-key="${key}" data-axis="${spec.axis}" aria-label="${spec.label}" title="${spec.label}"><span aria-hidden="true">${spec.axis==='x'?'↔':'↕'}</span></button>`;
    }).join('');
  }
  function edit(key,value) {
    const input=form.elements.namedItem(key);
    const n=fabricFit.clamp(Math.round(value*2)/2,Number(input.min),Number(input.max));
    if (Number(input.value)===n) return;
    input.value=n;
    input.dispatchEvent(new Event('input',{bubbles:true}));
  }
  function remember(key,before) {
    if (Number(form.elements.namedItem(key).value)!==before) {
      history.push({key,before});
      undoButton.disabled=false;
    }
  }
  refreshGroups();
  handleGroup.addEventListener('change',()=>{
    if (handleGroup.value) angle=handleGroup.value==='back'?Math.PI:0;
    renderHandles();
    draw();
  });
  overlay.addEventListener('pointerdown',event=>{
    const button=event.target.closest('button[data-key]');
    if (!button || event.button!==0) return;
    const key=button.dataset.key;
    const spec=fitHandles.specs[key];
    drag={button,key,spec,id:event.pointerId,start:spec.axis==='x'?event.clientX:event.clientY,
      before:Number(form.elements.namedItem(key).value)};
    button.setPointerCapture(event.pointerId);
    button.classList.add('is-dragging');
  });
  overlay.addEventListener('pointermove',event=>{
    if (drag?.id!==event.pointerId) return;
    const current=drag.spec.axis==='x'?event.clientX:event.clientY;
    const speed=(drag.spec.axis==='x'?110:65)/Math.max(250,canvas.clientHeight);
    edit(drag.key,drag.before+(current-drag.start)*speed*(drag.spec.direction||1)*(event.shiftKey?.35:1));
  });
  overlay.addEventListener('lostpointercapture',event=>{
    if (drag?.id!==event.pointerId) return;
    drag.button.classList.remove('is-dragging');
    remember(drag.key,drag.before);
    drag=undefined;
  });
  overlay.addEventListener('keydown',event=>{
    const button=event.target.closest('button[data-key]');
    const key=button?.dataset.key;
    if (!key) return;
    const spec=fitHandles.specs[key];
    const arrows=spec.axis==='x'?['ArrowLeft','ArrowRight']:['ArrowUp','ArrowDown'];
    if (!arrows.includes(event.key)) return;
    event.preventDefault();
    const before=Number(form.elements.namedItem(key).value);
    edit(key,before+(event.key===arrows[0]?-1:1)*(spec.direction||1)*(event.shiftKey?2:.5));
    remember(key,before);
  });
  undoButton.onclick=()=>{
    let action=history.pop();
    while (action && !form.elements.namedItem(action.key)) action=history.pop();
    if (action) edit(action.key,action.before);
    undoButton.disabled=!history.length;
  };
  const easeButton=document.querySelector('#add-seat-ease');
  const seatHint=document.querySelector('#seat-fit-hint');
  const seatControls=modelType==='trousers'?{waist:['waist'],hip:['hip'],thigh:['thigh'],knee:['knee','kneeFlex'],
    leg:['leg'],rise:['rise'],backRise:['backRise'],crotch:['crotch']}:
    {waist:['waist'],upperHip:['upperHip'],hip:['hip'],seat:['seatDepth'],lap:['lapEase'],skirtKnee:['kneeEase'],sittingLength:['sittingLength']};
  if (easeButton) easeButton.onclick=()=>{
    const values=adjustments();
    const seated=fabricFit.poses.sit;
    const estimate=()=>fabricFit.estimate(pattern,modelType,body(),values,seated,material());
    const draft=changes();
    for (const [region,controls] of Object.entries(seatControls)) {
      const details=estimate()[region];
      if (!details) continue;
      const ordered=region==='knee' && details.length>details.cross?controls.slice().reverse():controls;
      for (const key of ordered) {
        const input=form.elements.namedItem(key);
        if (!input) continue;
        // Crosswise and lengthwise room can be solved independently.
        const component=key==='knee'?'cross':key==='kneeFlex'?'length':null;
        const needsRoom=current=>component?current[component]>0:current.level>(modelType==='trousers'?.24:.01);
        while (draft[key]<Number(input.max) && needsRoom(estimate()[region])) {
          draft[key]+=.5;
          values[key]=(values[key]||0)+.5;
        }
      }
    }
    drawControls(draft);
    form.dispatchEvent(new Event('input'));
    if (poseField.value!=='sit') {
      poseField.value='sit';
      poseField.dispatchEvent(new Event('change'));
    }
  };
  function reportFit() {
    const regions=fabricFit.estimate(pattern,modelType,body(),adjustments(),pose,material());
    const [peak]=Object.values(regions).sort((a,b)=>b.level-a.level);
    const state=peak.level>.66?'Restricted':peak.level>.26?'Snug':'Room to move';
    reading.textContent=`${state} · ${peak.label} · ${(100*Math.max(peak.cross,peak.length)).toFixed(1)}% estimated stretch demand`;
    if (seatHint) {
      const [region,seatedPeak]=Object.entries(regions).filter(([key])=>seatControls[key])
        .sort((a,b)=>b[1].level-a[1].level)[0]||[];
      seatHint.textContent=pose.sit<=.6?'Adds room where the seated fit needs it using the selected fabric.':
        seatedPeak?.level>.26?`For sitting, check ${seatControls[region].map(key=>garmentFit.fields[key][0].toLowerCase()).join(' and ')}.`:
          'The seated fit estimate shows room around the hips and knees. Check on a sewn sample.';
    }
  }
  function draw() {
    if (!canvas.isConnected) return;
    const ratio = Math.min(window.devicePixelRatio||1,2);
    const width=Math.round(canvas.clientWidth*ratio),height=Math.round(canvas.clientHeight*ratio);
    if (canvas.width!==width) canvas.width=width;
    if (canvas.height!==height) canvas.height=height;
    const anchors=drawModel(canvas,pattern,angle,adjustments(),body(),false,
      {pose,material:material(),show:mapField.checked,handleKeys:activeHandles,fabricName:pickedFabric(),redraw:draw});
    const values=activeHandles.length?changes():{};
    for (const button of overlay.querySelectorAll('button')) {
      const anchor=anchors[button.dataset.key];
      button.hidden=!anchor;
      if (!anchor) continue;
      button.style.left=`${fabricFit.clamp(anchor.x,5,95)}%`;
      button.style.top=`${fabricFit.clamp(anchor.y,4,96)}%`;
      const value=adjustmentText(values[button.dataset.key]);
      button.dataset.metricHandle=fitHandles.specs[button.dataset.key].label+' · '+value;
      button.setAttribute('aria-label',studioUnits.text(button.dataset.metricHandle));
      button.title=studioUnits.text(button.dataset.metricHandle);
    }
  }
  const size = new ResizeObserver(draw);
  size.observe(canvas);
  function pauseMotion() {
    cancelAnimationFrame(animation);
    playing=false;
    playMotion.textContent='Play motion';
    reading.setAttribute('aria-live','polite');
  }
  function setMotion(progress) {
    motionProgress=progress;
    pose=fabricFit.motionAt(poseField.value,progress);
    timeline.value=(progress*100).toFixed(1);
    draw();
  }
  playMotion.onclick=()=>{
    if (playing) {
      pauseMotion();
      reportFit();
      return;
    }
    const motion=fabricFit.motions[poseField.value];
    if (!motion) return;
    playing=true;
    playMotion.textContent='Pause motion';
    reading.setAttribute('aria-live','off');
    let last=performance.now(), lastRead=0;
    function frame(now) {
      if (!playing || !canvas.isConnected) return;
      const elapsed=now-last;
      if (elapsed>=40) {
        setMotion((motionProgress+Math.min(elapsed,110)*Number(speed.value)/motion.duration)%1);
        last=now;
        if (now-lastRead>=160) {
          reportFit();
          lastRead=now;
        }
      }
      animation=requestAnimationFrame(frame);
    }
    animation=requestAnimationFrame(frame);
  };
  timeline.addEventListener('input',()=>{
    const progress=Number(timeline.value)/100;
    pauseMotion();
    setMotion(progress);
    reportFit();
  });
  fitCleanup = () => {size.disconnect();pauseMotion();};
  mapField.addEventListener('change',()=>{
    document.querySelector('#fit-legend').hidden=!mapField.checked;
    draw();
  });
  poseField.addEventListener('change',()=>{
    pauseMotion();
    const isMotion=Object.hasOwn(fabricFit.motions,poseField.value);
    motionControls.hidden=!isMotion;
    if (isMotion) {
      setMotion(0);
      reportFit();
      return;
    }
    const target=fabricFit.poses[poseField.value];
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      pose={...target};
      draw();
      reportFit();
      return;
    }
    const previous={...pose},start=performance.now();
    function step(now) {
      const t=fabricFit.clamp((now-start)/580,0,1);
      const transition=t*t*(3-2*t);
      pose=Object.fromEntries(['sit','arm','reach'].map(key=>[key,fabricFit.mix(previous[key],target[key],transition)]));
      draw();
      if (t<1) animation=requestAnimationFrame(step);
      else reportFit();
    }
    animation=requestAnimationFrame(step);
  });
  form.addEventListener('input',event=>{
    if (event.target.name==='pattern') { startFit(event.target.value); return; }
    if (event.target.name==='model') fitModel = event.target.value;
    if (event.target.name==='fabric') setFabricDefaults(getFabric(pickedFabric()));
    if (event.target===supportField) {
      studioUnits.writeLength(strapWidth,studioDesign.supportWidth(supportField.value));
    }
    if (['sleeves','neckline','support'].includes(event.target.name)) {
      refreshShoulders();
      drawControls(changes());
      refreshGroups();
    }
    for (const [key,n] of Object.entries(changes())) document.querySelector('#'+key+'-value').textContent = adjustmentText(n);
    fittingDraft = undefined;
    fitGuide.hidden = true;
    draw();
    reportFit();
  });
  form.addEventListener('reset',event=>{
    event.preventDefault();
    if (sleeveEligible) {
      supportField.value=shoulders.support;
      sleeveToggle.checked=canHaveSleeves&&hasSleeves(pattern);
      sleeveStyle.value=shoulders.sleeveStyle;
      studioUnits.writeLength(strapWidth,shoulders.strapWidth);
      studioUnits.writeLength(strapPlacement,shoulders.strapPlacement);
      form.elements.namedItem('neckline').value=startingNeck;
      refreshShoulders();
    }
    form.elements.namedItem('fabric').value=fabricName;
    setFabricDefaults({...initialMaterial,...fitRevision?.fabric},initialWeight);
    drawControls();
    refreshGroups();
    history.length=0;
    undoButton.disabled=true;
    form.dispatchEvent(new Event('input'));
  });
  canvas.addEventListener('pointerdown',event=>{
    pointer = {id:event.pointerId,x:event.clientX};
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove',event=>{
    if (pointer?.id!==event.pointerId) return;
    angle += (event.clientX-pointer.x)*.016;
    pointer.x = event.clientX;
    draw();
  });
  canvas.addEventListener('lostpointercapture',()=>{ pointer = undefined; });
  canvas.addEventListener('keydown',event=>{
    if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    angle += event.key==='ArrowLeft'?-.2:.2;
    draw();
  });
  document.querySelector('#reset-view').onclick = ()=>{angle=0;draw();};
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if (publisher) return;
    const make=event.submitter?.value==='make';
    const savedTarget=make?null:siblings.find(item=>item.id===form.elements.namedItem('tailorTarget').value);
    const targetBody=savedTarget?{...getModel(savedTarget.fit.modelId),...savedTarget.fit.modelMeasurements}:body();
    const sourceBody=pattern.fit?.modelId?{...getModel(pattern.fit.modelId),...pattern.fit.modelMeasurements}:targetBody;
    const targetChanges=savedTarget?savedTarget.fit.changes:adjustments();
    const compare=fitDifference(pattern,{...(savedTarget||pattern),fit:{changes:targetChanges}},sourceBody,targetBody);
    if (!make && !Object.keys(compare).length) {notify('Choose a target revision with different fit settings or change the current fit.');return;}
    const fabric=savedTarget?.fit.fabric || {name:pickedFabric(),...material()};
    const kit=make?constructionGuide(pattern,targetChanges,targetBody,fabric):{
      ...guide(pattern,compare,targetBody),
      tools:'Measuring tape, pins or clips, tailor’s chalk, seam ripper, matching thread, sewing machine, iron and press cloth.',
      fabric:'Existing garment and compatible fabric if an extension is needed.'
    };
    const route=make?'New garment':`Revision ${pattern.revision || 'base'} to ${savedTarget?'revision '+savedTarget.revision:'a new revision'}`;
    const summary=fitSummary(compare);
    const {tools,steps,visuals}=kit;
    const measurements=fitMeasurementSheet(targetBody,targetChanges,compare,make,pattern,sourceBody);
    const modelMeasurements=Object.fromEntries(Object.keys(sewingModels.dimensions).filter(key=>targetBody[key]).map(key=>[key,targetBody[key]]));
    const packet={...(savedTarget||pattern),design:designForFit((savedTarget||pattern).design,targetChanges),steps,visuals,measurements};
    const draftOrder={kind:make?'Construction':'Tailoring',plan:{
      strapWidth:['Wide straps','Narrow straps','Spaghetti straps','Halter strap','One-shoulder'].includes(targetChanges.support)?targetChanges.strapWidth:undefined
    }};
    const drawings=()=>orderFigureSections(draftOrder,packet,measurements)+workFigures.stepList(packet,draftOrder,measurements);
    fittingDraft={garment:pattern,...kit,summary,modelId:targetBody.id,modelMeasurements,changes:targetChanges,fabric,make,savedTarget,route,materials:kit.fabric,measurements};
    fitGuide.hidden = false;
    fitGuide.innerHTML = `<h2>${make?'Construction work order':'Tailoring work order'}</h2><p class="tight"><strong>${escape(route)}</strong></p><p class="tight">${escape(pattern.name)} · ${escape(targetBody.name)} · ${escape(fabric.name)} (${fabric.gsm} g/m²) · ${escape(summary)}</p>${fitMeasurementTable(measurements)}${workFigures.bodySheet(measurements)}<p class="tight"><strong>Materials</strong> ${escape(kit.fabric)}</p><p class="tight"><strong>Tools and materials</strong> ${escape(tools)}</p>${sewingVisuals.tools(tools)}${allowanceEditor(draftOrder,packet,'preview-allowance-form')}<p id="preview-fit-status" role="status"></p>
      <form id="save-fit-form">${savedTarget?'':`<label class="field">Garment name<input name="garmentName" required maxlength="100" value="${escape(make?pattern.name+' new':pattern.family?pattern.name:pattern.name+' fitted')}" ${!make&&pattern.family?'readonly':''}></label>`}<button>${savedTarget?'Save tailoring work order':make?'Save new garment and work order':'Save revision and create work order'}</button></form>
      <div id="fit-packet-drawings">${drawings()}</div>`;
    studioUnits.refresh(fitGuide);
    const readPreviewMeasurements=bindMeasurementEditor(fitGuide,settings=>{
      Object.assign(draftOrder,settings);
      const figures=fitGuide.querySelector('#fit-packet-drawings');
      figures.innerHTML=drawings();
      studioUnits.refresh(figures);
      fitGuide.querySelector('#preview-fit-status').textContent='Updated the dimensions in the work-order preview.';
    });
    fitGuide.querySelector('#save-fit-form').addEventListener('submit',event=>{
      event.preventDefault();
      const name = savedTarget?.name || new FormData(event.target).get('garmentName').trim();
      if (!name) {notify('Enter a garment name.');return;}
      const figureForm=fitGuide.querySelector('#preview-allowance-form');
      if (!figureForm.checkValidity()) {
        figureForm.closest('details').open=true;
        for (const section of figureForm.querySelectorAll('details')) section.open=true;
        figureForm.reportValidity();
        return;
      }
      fittingDraft.figureSettings=readPreviewMeasurements();
      saveFit(name);
    });
    fitGuide.scrollIntoView({block:'nearest'});
  });
  draw();
  reportFit();
}
function saveFit(name) {
  if (!fittingDraft) return;
  const {garment,tools,steps,visuals,summary,modelId,modelMeasurements,changes,fabric,make,savedTarget,route,materials,measurements,figureSettings} = fittingDraft;
  const notes=[route,getModel(modelId).name,fabric.name,fabric.gsm+' g/m²',summary].filter(Boolean).join(' · ');
  if (savedTarget) {
    state.orders.unshift({id:'WO-'+String(state.next++).padStart(3,'0'),title:garment.name+' · Revision '+garment.revision+' to '+savedTarget.revision,
      pattern:savedTarget.id,kind:'Tailoring',before:garment.id,due:'',notes,done:[],...figureSettings,snapshot:{name:savedTarget.name,tools,steps,visuals,fabric:materials,measurements}});
    save('Tailoring work order saved');
    showNewOrders();
    fittingDraft=undefined;
    location.hash='orders';
    return;
  }
  const base = basePattern(garment);
  const id = 'alteration-'+createId();
  const family = make?id:garment.family || id;
  const revision = state.custom.filter(p=>p.family===family).length+1;
  const garmentVisuals = garment.visuals || sewingVisuals.patterns[garment.id] || garment.steps.map(sewingVisuals.identify);
  const rebuildSteps = make?steps:[...(garment.rebuildSteps || garment.steps),...steps];
  const rebuildVisuals = make?visuals:[...(garment.rebuildVisuals || garmentVisuals),...visuals];
  const plan = {id,family,revision,name,type:garment.type,level:'Intermediate',cut:garment.cut,
    model:base.id,color:garment.color,design:designForFit(garment.design,changes),reference:garment.reference,fabric:materials,
    tools,steps,visuals,rebuildSteps,rebuildVisuals,measurements,
    buildFabric:make?materials:garment.buildFabric || garment.fabric,buildTools:make?tools:[garment.buildTools || garment.tools,tools].filter(Boolean).join(' · '),
    fit:{modelId,modelMeasurements,changes,fabric,source:garment.id}};
  state.custom.push(plan);
  state.orders.unshift({id:'WO-'+String(state.next++).padStart(3,'0'),title:name+' · Revision '+revision,pattern:id,kind:make?'Construction':'Tailoring',before:make?undefined:garment.id,
    due:'',notes,done:[],...figureSettings});
  save('Revision and work order saved');
  showNewOrders();
  fittingDraft = undefined;
  fitPattern = id;
  fitRevision = plan.fit;
  location.hash = 'orders';
}

let designDraft = {...studioDesign.defaults(),name:'',reference:'',fitModelId:'studio-form'};

function designStudio() {
  view.innerHTML = `<div class="page-title"><p class="model-link"><a href="#library">Back to Pattern Library</a></p>
    <h1>${titles.design}</h1><p>Combine garment details into a new design, or use a photo to suggest a starting shape.</p></div>
    <div class="split"><div class="panel viewer fitting-viewer">
      <div class="design-editor-toolbar">
        <div class="fields tight">
          <label class="field">Edit on garment<select id="design-edit-mode"><option value="fit">Shape and fit</option><option value="seams">Seam placement</option><option value="layers">Layers and ruffles</option><option value="view">View only</option></select></label>
          <label class="field" id="design-target-field"><span>Controls</span><select id="design-edit-target"></select></label>
        </div>
        <div class="actions tight"><button type="button" class="secondary" id="design-undo" disabled>Undo</button><button type="button" class="secondary" id="design-redo" disabled>Redo</button>
          <button type="button" class="secondary" id="design-quick-layer" hidden>＋ Add layer</button><button type="button" class="secondary" id="add-design-ruffle" hidden>＋ Add ruffle</button></div>
      </div>
      <div class="fit-canvas design-canvas"><canvas id="design-model" role="img" tabindex="0" aria-label="Three-dimensional design preview"></canvas><div id="design-handles" aria-label="Garment editing handles"></div></div>
      <div class="viewer-footer design-editor-footer">
        <p class="muted tight" id="design-editor-help">Drag the handles to edit. Drag the canvas to rotate.</p>
        <output id="design-handle-value" hidden></output>
        <div class="fields tight"><label class="field design-rotate">Rotate preview<input type="range" id="design-angle" min="-180" max="180" value="-21"></label>
          <label class="field">Zoom<input type="range" id="design-zoom" min="70" max="145" value="100"></label></div>
        <button type="button" class="secondary" id="design-front-view">Front view</button>
      </div>
    </div><div class="panel"><form id="design-form">
      <label class="field">Fit to model<select name="fitModelId">${modelOptions(designDraft.fitModelId)}</select></label>
      <p class="model-link"><a href="#models">Open Model Library</a></p><p id="design-measurements" class="fit-baseline"></p>
      <div class="actions tight" aria-label="Start your garment">
        <button class="secondary" type="button" id="design-manual-mode" aria-pressed="${!designDraft.reference}">Custom fields</button>
        <button class="secondary" type="button" id="design-photo-mode" aria-pressed="${Boolean(designDraft.reference)}" aria-controls="design-photo-options">Photo reference</button>
      </div>
      <section class="design-options design-photo-options" id="design-photo-options"${designDraft.reference?'':' hidden'}>
        <p class="tight">Keep the whole front in view, including narrow straps and the lowest hem points. A cropped product photo or a flat lay on a contrasting surface works best.</p>
        <video id="design-camera-feed" playsinline muted autoplay hidden aria-label="Live garment camera"></video>
        <div class="actions tight">
          <button type="button" id="design-camera-open">Open camera</button>
          <button type="button" id="design-camera-snap" hidden disabled>Take photo</button>
          <button class="secondary" type="button" id="design-camera-stop" hidden>Close camera</button>
          <button class="secondary" type="button" id="design-file-button">Upload photo</button>
          <input type="file" id="design-photo" accept="image/jpeg,image/png,image/webp" hidden aria-label="Upload a front-view garment photo">
        </div>
        <p id="photo-status" class="tight" role="status"></p><div id="design-reference"></div>
      </section>
      <label class="field">Garment name<input name="name" required maxlength="100" value="${escape(designDraft.name)}" placeholder="e.g. Plum bell-sleeve dress"></label>
      <label class="field">Garment type<select name="model">${Object.entries(studioDesign.silhouettes).map(([id,entry])=>option(id,entry.label,designDraft.model)).join('')}</select></label>
      <div id="design-settings"></div>
      <details class="design-options" id="design-seams"><summary>Seam placement</summary><div id="design-seam-fields"></div></details>
      <details class="design-options" id="design-layers">
        <summary>Fabric layers</summary>
        <p class="muted tight">Add an overskirt, underskirt, tier, or gathered ruffle. Hem offsets are relative to the main hem. Outer layers stack in list order.</p>
        <div id="design-layer-list"></div>
        <button type="button" class="secondary" id="add-design-layer">＋ Add layer</button>
      </details>
      <details class="design-options"><summary>Fine-tune fit</summary>
        <p class="muted tight">Adjust the garment from its starting shape.</p>
        <div id="design-fit-sliders"></div>
        <button type="button" class="secondary" id="reset-design-fit">Reset fit adjustments</button>
      </details>
      <div class="actions"><button name="save" value="library">Save to Pattern Library</button><button class="secondary" name="save" value="order">Save and create work order</button></div>
    </form></div></div>
    <details class="panel instructions" id="design-guide"><summary>Preview illustrated construction plan</summary><div id="design-guide-content"></div></details>`;
  const form = document.querySelector('#design-form');
  const canvas = document.querySelector('#design-model');
  const angle = document.querySelector('#design-angle');
  const zoom = document.querySelector('#design-zoom');
  const mode = document.querySelector('#design-edit-mode');
  const target = document.querySelector('#design-edit-target');
  const targetField = document.querySelector('#design-target-field');
  const quickLayer = document.querySelector('#design-quick-layer');
  const addRuffle = document.querySelector('#add-design-ruffle');
  const editorHelp = document.querySelector('#design-editor-help');
  const overlay = document.querySelector('#design-handles');
  const handleReadout = document.querySelector('#design-handle-value');
  const settings = document.querySelector('#design-settings');
  const fitSliders = document.querySelector('#design-fit-sliders');
  const seamPanel = document.querySelector('#design-seams');
  const seamFields = document.querySelector('#design-seam-fields');
  const layerPanel = document.querySelector('#design-layers');
  const layerList = document.querySelector('#design-layer-list');
  const addLayer = document.querySelector('#add-design-layer');
  const guide = document.querySelector('#design-guide');
  const photo = document.querySelector('#design-photo');
  const photoStatus = document.querySelector('#photo-status');
  const reference = document.querySelector('#design-reference');
  const photoOptions = form.querySelector('#design-photo-options');
  const manualMode = form.querySelector('#design-manual-mode');
  const photoMode = form.querySelector('#design-photo-mode');
  const live = form.querySelector('#design-camera-feed');
  const cameraOpen = form.querySelector('#design-camera-open');
  const cameraSnap = form.querySelector('#design-camera-snap');
  const cameraStop = form.querySelector('#design-camera-stop');
  let stream;
  let photoAttempt=0;
  let captured;
  let readingPhoto=false;
  let editedSupport=Boolean(designDraft.reference || designDraft.name);
  const measurementSummary = document.querySelector('#design-measurements');
  const body = () => getModel(designDraft.fitModelId);
  const fitKeys=()=>garmentFit.keys(studioDesign.baseModel(designDraft.model),studioDesign.isSleeved(designDraft));
  const activeDesignFit=()=>Object.fromEntries(fitKeys().flatMap(key=>{
    const value=designDraft.fitAdjustments?.[key];
    return Number.isFinite(value)&&value!==0 ? [[key,value]] : [];
  }));
  const seamNames={waistSeam:'Waist join seam',panelSeam:'Front panel seams'};
  const layerHandles={layerAttachment:['attachment','Attachment height','y','%'],
    layerHem:['hemOffset','Layer hem','y','cm'],layerSweep:['sweep','Layer fullness','x','cm']};
  let fitTarget='body';
  let layerTarget=0;
  let editorControls=[];
  let editFrame=0;
  let guideTimer;
  const currentLayer=()=>studioDesign.layers(designDraft)[layerTarget];
  const layerKey=handle=>handle==='layerHem'&&currentLayer()?.kind==='Ruffle'?'depth':layerHandles[handle][0];
  const editor=fitHandles.editor({canvas,overlay,
    undoButton:document.querySelector('#design-undo'),redoButton:document.querySelector('#design-redo'),
    snapshot:()=>({fit:activeDesignFit(),seams:studioDesign.seams(designDraft),layers:studioDesign.layers(designDraft),layerTarget}),
    restore:restoreEditor,apply:applyEditor});
  function showActiveHandle() {
    const button=overlay.querySelector('.is-dragging') || document.activeElement;
    const label=overlay.contains(button) && !button.hidden ? button.dataset.metricHandle : '';
    handleReadout.textContent=label?studioUnits.text(label):'';
    handleReadout.hidden=!label;
  }
  overlay.addEventListener('focusin',showActiveHandle);
  overlay.addEventListener('focusout',()=>queueMicrotask(showActiveHandle));

  function refreshEditor() {
    const groups=fitHandles.available(fitKeys());
    const seamKeys=studioDesign.seamKeys(designDraft.model);
    const layerAllowed=['dress','skirt'].includes(designDraft.model);
    mode.querySelector('[value=seams]').disabled=!seamKeys.length;
    mode.querySelector('[value=layers]').disabled=!layerAllowed;
    if (mode.selectedOptions[0]?.disabled) mode.value='fit';
    const layers=studioDesign.layers(designDraft);
    layerTarget=Math.max(0,Math.min(layerTarget,layers.length-1));
    quickLayer.hidden=addRuffle.hidden=mode.value!=='layers';
    quickLayer.disabled=addRuffle.disabled=layers.length>=studioDesign.maxLayers;
    targetField.hidden=true;
    editorControls=[];
    if (mode.value==='fit') {
      if (!groups.some(([key])=>key===fitTarget)) fitTarget=groups[0]?.[0];
      target.innerHTML=groups.map(([key,{label}])=>option(key,label,fitTarget)).join('');
      targetField.hidden=!groups.length;
      const keys=groups.find(([key])=>key===fitTarget)?.[1].keys || [];
      const fit=activeDesignFit();
      editorControls=keys.map(key=>{
        const spec=fitHandles.specs[key];
        const [,limit]=garmentFit.fields[key];
        return {...spec,key,value:fit[key]||0,min:-limit,max:limit,step:.5,sensitivity:spec.axis==='x'?105:70};
      });
    } else if (mode.value==='seams') {
      const seams=studioDesign.seams(designDraft);
      editorControls=seamKeys.map(key=>{
        const [min,max]=studioDesign.seamLimits[key];
        return {key,label:seamNames[key],axis:key==='waistSeam'?'y':'x',value:seams[key]??0,min,max,step:.5,sensitivity:78};
      });
    } else if (mode.value==='layers') {
      target.innerHTML=layers.map((layer,i)=>option(String(i),`${i+1}. ${layer.kind}`,String(layerTarget))).join('');
      targetField.hidden=!layers.length;
      const layer=layers[layerTarget];
      if (layer) editorControls=Object.entries(layerHandles).flatMap(([key,[,label,axis,unit]])=>{
        const field=layerKey(key);
        if (!Object.hasOwn(layer,field)) return [];
        const [min,max]=studioDesign.layerLimits[field];
        return [{key,label:field==='depth'?'Ruffle depth':label,axis,unit,value:layer[field],min,max,
          step:field==='attachment'?1:.5,sensitivity:field==='sweep'?380:field==='attachment'?170:75}];
      });
    }
    targetField.querySelector('span').textContent=mode.value==='layers'?'Active layer':'Controls';
    editorHelp.textContent=mode.value==='view'?'Drag the canvas to rotate.':mode.value==='layers'&&!layers.length
      ?'Add a layer or ruffle to start.':'Drag a handle or use its arrow keys. Drag the canvas to rotate.';
    editor.controls(editorControls);
  }

  function drawSeams() {
    const keys=studioDesign.seamKeys(designDraft.model);
    const seams=studioDesign.seams(designDraft);
    seamPanel.hidden=!keys.length;
    seamFields.innerHTML=keys.map(key=>{
      const enabled=Object.hasOwn(seams,key);
      const [min,max]=studioDesign.seamLimits[key];
      const direction=key==='waistSeam'?'Positive moves the seam down from the pattern waist.':'Positive moves the mirrored seams toward the sides.';
      return `<fieldset class="wo-path"><legend>${seamNames[key]}</legend>
        <label class="sleeve-choice"><input type="checkbox" data-seam-enable="${key}"${enabled?' checked':''}> Include on garment</label>
        <label class="field">Offset from starting seam (cm)<input type="number" data-length-input data-seam-value="${key}" min="${min}" max="${max}" step="0.5" value="${seams[key]??0}" required${enabled?'':' disabled'}></label>
        <p class="muted tight">${direction}</p></fieldset>`;
    }).join('');
    studioUnits.refresh(seamFields);
  }

  function applyEditor(key,value) {
    if (Object.hasOwn(layerHandles,key)) {
      const layers=studioDesign.layers(designDraft);
      const field=layerKey(key);
      if (!layers[layerTarget]) return;
      layers[layerTarget]={...layers[layerTarget],[field]:value};
      designDraft.layers=layers;
      const input=layerList.querySelector(`[data-layer-index="${layerTarget}"] [data-layer-field="${field}"]`);
      if (input.hasAttribute('data-length-input')) studioUnits.writeLength(input,value);
      else input.value=value;
    } else if (Object.hasOwn(seamNames,key)) {
      designDraft.seams={...studioDesign.seams(designDraft),[key]:value};
      const option=seamFields.querySelector(`[data-seam-enable="${key}"]`);
      const input=seamFields.querySelector(`[data-seam-value="${key}"]`);
      option.checked=true;
      input.disabled=false;
      studioUnits.writeLength(input,value);
    } else {
      designDraft.fitAdjustments={...designDraft.fitAdjustments,[key]:value};
      form.elements.namedItem(key).value=value;
      const output=fitSliders.querySelector(`#${key}-value`);
      output.textContent=adjustmentText(value);
      studioUnits.refresh(output);
      showMeasurements();
    }
    refreshEditor();
    if (!editFrame) editFrame=requestAnimationFrame(()=>{editFrame=0;preview();});
    clearTimeout(guideTimer);
    if (guide.open) guideTimer=setTimeout(updateGuide,120);
  }

  function restoreEditor(snapshot) {
    designDraft.fitAdjustments=snapshot.fit;
    designDraft.seams=snapshot.seams;
    designDraft.layers=snapshot.layers;
    layerTarget=snapshot.layerTarget;
    drawFitSliders();
    drawSeams();
    drawLayers();
    refreshEditor();
    showMeasurements();
    preview();
    updateGuide();
  }
  function showMeasurements() {
    const model = body();
    const target = studioDesign.isBodice(designDraft.model)?['bust',model.bust]:['hip',model.hip];
    const finished=target[1]+Number(designDraft.ease)+(designDraft.fitAdjustments?.[target[0]]||0);
    measurementSummary.textContent = `Bust ${model.bust} cm · Waist ${model.waist} cm · Hip ${model.hip} cm · Shoulders ${model.shoulder} cm. Finished ${target[0]} target ${finished} cm.`;
  }
  function drawFitSliders() {
    const neckline=designDraft.neckline;
    fitSliders.innerHTML=fitKeys().map(key=>fitSlider(key,designDraft.fitAdjustments?.[key]||0,
      key==='neckDepth'?`${neckline} depth`:key==='neckWidth'?`${neckline} width`:garmentFit.fields[key][0])).join('');
    studioUnits.refresh(fitSliders);
  }
  function refreshDesignStraps(resetWidth=false) {
    const width=form.elements.namedItem('strapWidth');
    if (!width) return;
    const placement=form.elements.namedItem('strapPlacement');
    const support=studioDesign.selectedSupport(designDraft);
    const strapless=support==='Strapless';
    for (const row of settings.querySelectorAll('[data-design-strap-sizing]')) row.hidden=strapless;
    width.disabled=placement.disabled=strapless;
    if (resetWidth) {
      designDraft.strapWidth=studioDesign.supportWidth(support);
      studioUnits.writeLength(width,designDraft.strapWidth);
    }
    if (strapless) {
      delete designDraft.strapPlacement;
      studioUnits.writeLength(placement,0);
    }
  }
  const select = (key,label,items) => `<label class="field">${label}<select name="${key}">${items.map(item=>option(item,item,designDraft[key])).join('')}</select></label>`;
  function drawLayers() {
    layerPanel.hidden=!['dress','skirt'].includes(designDraft.model);
    const layers=studioDesign.layers(designDraft);
    const field=(layer,key,label,length=false)=>{
      const [min,max]=studioDesign.layerLimits[key];
      return `<label class="field">${label}<input type="number" data-layer-field="${key}" ${length?'data-length-input step="0.5"':''} min="${min}" max="${max}" value="${layer[key]}" required></label>`;
    };
    layerList.innerHTML=layers.map((layer,index)=>`<fieldset class="wo-path layer-card" data-layer-index="${index}">
      <legend>Layer ${index+1}</legend>
      <div class="fields tight">
        <label class="field">Layer type<select data-layer-field="kind">${studioDesign.layerKinds.map(kind=>option(kind,kind,layer.kind)).join('')}</select></label>
        <label class="field">Fabric<select data-layer-field="fabric">${fabricOptions(layer.fabric)}</select></label>
        <label class="field">Color<input type="color" data-layer-field="color" value="${color(layer.color)}"></label>
        ${field(layer,'opacity','Opacity (%)')}
        ${layer.kind==='Ruffle'?field(layer,'depth','Ruffle depth (cm)',true):field(layer,'hemOffset','Hem offset (cm)',true)}
        ${field(layer,'sweep','Extra hem sweep (cm)',true)}
        ${Object.hasOwn(layer,'attachment')?field(layer,'attachment','Starts (% down from waist)'):''}
      </div>
      <div class="actions tight">
        <button type="button" class="secondary" data-layer-edit>Edit on garment</button>
        ${index?`<button type="button" class="secondary" data-layer-move="-1" aria-label="Move layer ${index+1} up">Move up</button>`:''}
        ${index<layers.length-1?`<button type="button" class="secondary" data-layer-move="1" aria-label="Move layer ${index+1} down">Move down</button>`:''}
        <button type="button" class="secondary" data-layer-remove aria-label="Remove layer ${index+1}">Remove</button>
      </div>
    </fieldset>`).join('');
    addLayer.disabled=layers.length>=studioDesign.maxLayers;
    studioUnits.refresh(layerList);
  }
  function settingsForModel(open=false) {
    const model=designDraft.model;
    const spec = studioDesign.silhouettes[model];
    const bodice=studioDesign.isBodice(model);
    const support=studioDesign.selectedSupport(designDraft);
    const strapless=support==='Strapless';
    settings.innerHTML = `<div class="fields">${select('cut','Silhouette',spec.cuts)}${select('length','Finished length',spec.lengths)}</div>
      ${bodice?`<div class="fields">${select('neckline',model==='corset'?'Front edge':'Neckline',studioDesign.necklines)}${select('back','Back style',studioDesign.backs)}
        ${select('support','Straps and shoulders',studioDesign.supportChoices(model))}${model==='corset'?'':select('sleeve','Sleeves',studioDesign.sleeves)}</div>
        <div data-design-strap-sizing${strapless?' hidden':''}><div class="fields">
          <label class="field">Finished strap / shoulder width (cm)<input name="strapWidth" type="number" data-length-input min=".4" max="12" step=".1" value="${designDraft.strapWidth??studioDesign.supportWidth(support)??''}"${strapless?' disabled':''}></label>
          <label class="field">Shoulder placement (cm)<input name="strapPlacement" type="number" data-length-input min="-4" max="4" step=".1" value="${designDraft.strapPlacement??0}"${strapless?' disabled':''}></label>
        </div><p class="muted">Negative placement moves toward the neck. Positive placement moves toward the arm.</p></div>`:''}
      ${['dress','skirt'].includes(model)?`<div class="fields">${select('hemStyle','Hem shape',studioDesign.hemStyles)}<div data-hem-drop${studioDesign.hasFairyHem(designDraft)?'':' hidden'}>
        <label class="field">High-to-low hem drop (cm)<input type="number" data-length-input name="hemDrop" min="2" max="35" step="0.5" value="${studioDesign.hemDrop(designDraft)}" required${studioDesign.hasFairyHem(designDraft)?'':' disabled'}></label></div></div>`:''}
      <div class="fields">${select('closure','Closure',studioDesign.closureChoices(model))}${model==='trousers'?select('rise','Waist rise',studioDesign.rises):''}</div>
      <div class="fields"><label class="field">Main color<input type="color" name="primary" value="${color(designDraft.primary)}"></label><label class="field">Fabric<select name="fabric">${fabricOptions(designDraft.fabric)}</select></label></div>
      <details class="design-options"${open?' open':''}><summary>Finishes, pockets and fit</summary>
        <div class="fields tight">${select('pocket','Pockets',studioDesign.pocketChoices(model))}${select('finish','Hem finish',studioDesign.finishes)}${select('tone','Color layout',studioDesign.tones)}
        <label class="field">Contrast color<input type="color" name="accent" value="${color(designDraft.accent)}"></label>
        <label class="field">Target wearing ease (cm)<input type="number" data-length-input name="ease" min="0" max="24" step="1" value="${Number(designDraft.ease)}" required></label></div>
        <label class="field">Custom detail notes<textarea name="details" rows="3" maxlength="2000" placeholder="e.g. Contrast stitching, back tie placement or special hardware">${escape(designDraft.details || '')}</textarea></label>
      </details>`;
    studioUnits.refresh(settings);
    drawFitSliders();
    drawSeams();
    drawLayers();
    refreshEditor();
  }
  function refreshReference() {
    const image=captured?.thumbnail || designDraft.reference;
    reference.innerHTML = image ? `<figure class="design-reference tight"><img src="${escape(image)}" alt="Your reference garment photo"><figcaption>${captured?'Captured photo':'Reference photo'}</figcaption></figure>${captured
      ? '<div class="actions tight"><button type="button" id="use-captured">Use photo</button><button type="button" class="secondary" id="discard-captured">Discard capture</button></div>'
      : '<div class="actions tight"><button type="button" class="secondary" id="reanalyze-reference">Reanalyze photo</button><button type="button" class="secondary" id="remove-reference">Remove photo</button></div>'}` : '';
    cameraOpen.textContent=image?'Retake photo':'Open camera';
    reference.querySelector('#use-captured')?.addEventListener('click',()=>applyReference(captured));
    reference.querySelector('#discard-captured')?.addEventListener('click',()=>{
      captured=undefined;
      photoStatus.textContent='';
      refreshReference();
    });
    reference.querySelector('#reanalyze-reference')?.addEventListener('click',()=>{
      const current=designDraft.reference;
      readReference(()=>garmentPhoto.reanalyze(current));
    });
    reference.querySelector('#remove-reference')?.addEventListener('click',()=>{
      stopCamera();
      designDraft.reference='';
      delete designDraft.photoOutline;
      photo.value='';
      photoStatus.textContent='';
      refreshReference();
    });
  }
  function preview() {
    if (!canvas.isConnected) return;
    const ratio = Math.min(window.devicePixelRatio||1,2);
    const width=Math.round(canvas.clientWidth*ratio),height=Math.round(canvas.clientHeight*ratio);
    if (canvas.width!==width) canvas.width=width;
    if (canvas.height!==height) canvas.height=height;
    const item = {model:studioDesign.baseModel(designDraft.model),design:designDraft,color:designDraft.primary};
    const anchors=drawModel(canvas,item,Number(angle.value)*Math.PI/180,{hasSleeves:studioDesign.isSleeved(designDraft)},body(),false,
      {pose:fabricFit.poses.stand,show:false,material:getFabric(designDraft.fabric),redraw:preview,
        handleKeys:mode.value==='fit'?editorControls.map(control=>control.key):[],
        editor:{layerIndex:mode.value==='layers'?layerTarget:null,showSeams:mode.value==='seams',zoom:Number(zoom.value)/100}});
    editor.position(anchors);
    showActiveHandle();
  }
  function updateGuide() {
    if (!guide.open) return;
    const design={...designDraft,layers:studioDesign.layers(designDraft),seams:studioDesign.seams(designDraft),fitAdjustments:activeDesignFit()};
    const item = applyDesignFit(studioDesign.make(design,designDraft.name,body()),body());
    const measurements=designMeasurementSheet(item);
    const figureValues={plan:{strapWidth:design.strapWidth}};
    const work=guide.querySelector('#design-guide-content');
    work.innerHTML = `<p class="tight"><strong>Fabric</strong> ${escape(item.fabric)}</p><p class="tight"><strong>Tools and materials</strong> ${escape(item.tools)}</p>${sewingVisuals.tools(item.tools)}${workFigures.referenceSheet(designDraft.reference,item.design,figureValues,measurements)}${workFigures.stepList(item,figureValues,measurements)}`;
    studioUnits.refresh(work);
  }
  function designMeasurementSheet(item) {
    const design=item.design;
    const model=body();
    const changes={...design.fitAdjustments,hasSleeves:item.sleeves};
    if (studioDesign.isBodice(design.model)) {
      const support=studioDesign.selectedSupport(design);
      Object.assign(changes,{support,neckline:design.neckline,sleeveStyle:design.sleeve});
      if (support!=='Strapless') Object.assign(changes,{strapWidth:design.strapWidth??studioDesign.supportWidth(support),strapPlacement:design.strapPlacement});
    }
    return fitMeasurementSheet(model,changes,{},true,item,model);
  }
  function changeModel(model) {
    form.elements.namedItem('model').value = model;
    designDraft = {...studioDesign.defaults(model),name:designDraft.name,reference:designDraft.reference,photoOutline:designDraft.photoOutline,fitModelId:designDraft.fitModelId,primary:designDraft.primary,accent:designDraft.accent,details:designDraft.details,layers:designDraft.layers,seams:designDraft.seams};
    editor.reset();
    settingsForModel();
  }
  settingsForModel();
  refreshReference();
  showMeasurements();
  const size = new ResizeObserver(preview);
  size.observe(canvas);
  fitCleanup = () => {size.disconnect();cancelAnimationFrame(editFrame);clearTimeout(guideTimer);stopCamera();};
  angle.addEventListener('input',preview);
  zoom.addEventListener('input',preview);
  document.querySelector('#design-front-view').onclick=()=>{angle.value=0;preview();};
  let orbit;
  canvas.addEventListener('pointerdown',event=>{
    if (event.button!==0) return;
    orbit={id:event.pointerId,start:event.clientX,angle:Number(angle.value)};
    canvas.setPointerCapture(orbit.id);
  });
  canvas.addEventListener('pointermove',event=>{
    if (event.pointerId!==orbit?.id) return;
    const next=orbit.angle+(event.clientX-orbit.start)/Math.max(1,canvas.clientWidth)*275;
    angle.value=((next+180)%360+360)%360-180;
    preview();
  });
  canvas.addEventListener('lostpointercapture',()=>{orbit=undefined;});
  canvas.addEventListener('keydown',event=>{
    if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    angle.value=((Number(angle.value)+(event.key==='ArrowLeft'?-10:10)+540)%360)-180;
    preview();
  });
  function activateEditor(value) {
    mode.value=value;
    if (value!=='view') angle.value=value==='fit'&&fitTarget==='back'?180:0;
    refreshEditor();
    preview();
  }
  mode.addEventListener('change',()=>activateEditor(mode.value));
  target.addEventListener('change',()=>{
    if (mode.value==='fit') {
      fitTarget=target.value;
      angle.value=fitTarget==='back'?180:0;
    } else layerTarget=Number(target.value);
    refreshEditor();
    preview();
  });
  guide.addEventListener('toggle',updateGuide);
  const refreshLayers=()=>{drawLayers();refreshEditor();preview();updateGuide();};
  function appendLayer(kind) {
    const current=studioDesign.layers(designDraft);
    if (current.length>=studioDesign.maxLayers) return;
    editor.checkpoint();
    designDraft.layers=[...current,{...studioDesign.newLayer(kind),color:designDraft.accent}];
    layerTarget=current.length;
    mode.value='layers';
    angle.value=0;
    refreshLayers();
  }
  addLayer.onclick=()=>{
    appendLayer('Overskirt');
    layerList.querySelector('fieldset:last-child select')?.focus();
  };
  quickLayer.onclick=()=>appendLayer('Overskirt');
  addRuffle.onclick=()=>appendLayer('Ruffle');
  layerList.addEventListener('click',event=>{
    const button=event.target.closest('button');
    if (!button) return;
    const index=Number(button.closest('[data-layer-index]').dataset.layerIndex);
    if (button.hasAttribute('data-layer-edit')) {
      layerTarget=index;
      activateEditor('layers');
      target.focus();
      return;
    }
    editor.checkpoint();
    const current=studioDesign.layers(designDraft);
    const [layer]=current.splice(index,1);
    const move=Number(button.dataset.layerMove)||0;
    if (move) current.splice(index+move,0,layer);
    layerTarget=index+move;
    designDraft.layers=current;
    refreshLayers();
    const follow=layerList.querySelectorAll('fieldset')[Math.min(index+move,current.length-1)];
    (follow?.querySelector('select')||addLayer).focus();
  });
  form.querySelector('#reset-design-fit').onclick=()=>{
    editor.checkpoint();
    designDraft.fitAdjustments={};
    drawFitSliders();
    refreshEditor();
    showMeasurements();
    preview();
    updateGuide();
  };
  form.addEventListener('input',event=>{
    const field = event.target;
    const seamKey=field.dataset.seamEnable || field.dataset.seamValue;
    if (seamKey) {
      const seams=studioDesign.seams(designDraft);
      if (field.dataset.seamEnable) {
        editor.checkpoint();
        const input=seamFields.querySelector(`[data-seam-value="${seamKey}"]`);
        if (field.checked) seams[seamKey]=studioUnits.lengthValue(input)??0;
        else delete seams[seamKey];
        designDraft.seams=studioDesign.seams({...designDraft,seams});
        input.disabled=!field.checked;
        if (field.checked) studioUnits.writeLength(input,designDraft.seams[seamKey]);
      } else {
        const value=studioUnits.lengthValue(field);
        if (value==null) return;
        designDraft.seams=studioDesign.seams({...designDraft,seams:{...seams,[seamKey]:value}});
      }
      refreshEditor();
      preview();
      updateGuide();
      return;
    }
    const layerKey=field.dataset.layerField;
    if (layerKey) {
      const index=Number(field.closest('[data-layer-index]').dataset.layerIndex);
      const current=studioDesign.layers(designDraft);
      const value=field.hasAttribute('data-length-input')?studioUnits.lengthValue(field):field.type==='number'?field.valueAsNumber:field.value;
      if (value==null || typeof value==='number' && !Number.isFinite(value)) return;
      current[index]={...current[index],[layerKey]:value};
      designDraft.layers=studioDesign.layers({...designDraft,layers:current});
      if (layerKey==='kind') {
        drawLayers();
        layerList.querySelector(`[data-layer-index="${index}"] select`)?.focus();
      }
      refreshEditor();
      preview();
      updateGuide();
      return;
    }
    if (!field.name || field.type==='file') return;
    const oldSupport=studioDesign.selectedSupport(designDraft);
    if (field.name==='model') changeModel(field.value);
    else if (field.hasAttribute('data-fit-slider')) {
      const value=Number(field.value);
      designDraft.fitAdjustments={...designDraft.fitAdjustments,[field.name]:value};
      const output=fitSliders.querySelector(`#${field.name}-value`);
      output.textContent=adjustmentText(value);
      studioUnits.refresh(output);
    } else if (field.name==='strapWidth' || field.name==='strapPlacement') {
      const value=studioUnits.lengthValue(field);
      const [min,max]=field.name==='strapWidth'?[.4,12]:[-4,4];
      designDraft[field.name]=value==null?undefined:fabricFit.clamp(value,min,max);
    }
    else designDraft[field.name] = field.name==='ease' || field.name==='hemDrop'?(studioUnits.lengthValue(field)??0):field.type==='number'?Number(field.value):field.value;
    if (field.name==='support' || field.name==='sleeve') editedSupport=true;
    if (field.name==='hemStyle') {
      const fairy=studioDesign.hasFairyHem(designDraft);
      settings.querySelector('[data-hem-drop]').hidden=!fairy;
      form.elements.hemDrop.disabled=!fairy;
    }
    if (field.name==='support' && field.value!=='Integrated shoulders' && form.elements.sleeve) {
      form.elements.sleeve.value=designDraft.sleeve='Sleeveless';
    }
    if (field.name==='sleeve' && field.value!=='Sleeveless') {
      form.elements.support.value=designDraft.support='Integrated shoulders';
    }
    if (field.name==='support' || field.name==='sleeve') refreshDesignStraps(oldSupport!==studioDesign.selectedSupport(designDraft));
    if (['support','sleeve','neckline'].includes(field.name)) drawFitSliders();
    refreshEditor();
    showMeasurements();
    preview();
    updateGuide();
  });
  function stopCamera() {
    photoAttempt++;
    readingPhoto=false;
    const active=stream;
    stream=undefined;
    active?.getTracks().forEach(track=>track.stop());
    live.srcObject=null;
    live.hidden=cameraSnap.hidden=cameraStop.hidden=true;
    cameraSnap.disabled=true;
    cameraOpen.disabled=false;
    cameraOpen.hidden=false;
    reference.hidden=false;
  }
  function photoModeEnabled(enabled) {
    photoOptions.hidden=!enabled;
    manualMode.setAttribute('aria-pressed',String(!enabled));
    photoMode.setAttribute('aria-pressed',String(enabled));
    if (!enabled) {
      stopCamera();
      if (!captured) photoStatus.textContent='';
    }
  }
  manualMode.onclick=()=>photoModeEnabled(false);
  photoMode.onclick=()=>photoModeEnabled(true);
  cameraStop.onclick=()=>{
    stopCamera();
    photoStatus.textContent='';
  };
  form.querySelector('#design-file-button').onclick=()=>photo.click();
  const activePhoto=attempt=>attempt===photoAttempt && form.isConnected && location.hash==='#design';
  live.addEventListener('loadeddata',()=>{cameraSnap.disabled=!stream || !live.videoWidth;});
  cameraOpen.onclick=async()=>{
    if (!navigator.mediaDevices?.getUserMedia) {
      photoStatus.textContent='Camera access is unavailable here. You can still upload a photo.';
      return;
    }
    stopCamera();
    const attempt=photoAttempt;
    cameraOpen.hidden=false;
    cameraStop.hidden=false;
    cameraOpen.disabled=true;
    photoStatus.textContent='Waiting for camera permission…';
    try {
      const next=await navigator.mediaDevices.getUserMedia({
        audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:960}}
      });
      if (!activePhoto(attempt)) {
        next.getTracks().forEach(track=>track.stop());
        return;
      }
      stream=next;
      live.srcObject=stream;
      live.hidden=cameraSnap.hidden=false;
      cameraOpen.hidden=reference.hidden=true;
      cameraSnap.disabled=true;
      await live.play();
      if (!activePhoto(attempt)) return;
      cameraSnap.disabled=!live.videoWidth;
      photoStatus.textContent='Center the whole garment, then take a photo.';
      for (const track of stream.getVideoTracks?.() || []) track.addEventListener('ended',()=>{
        if (!activePhoto(attempt)) return;
        stopCamera();
        photoStatus.textContent='The camera disconnected. Open it again or upload a photo.';
      },{once:true});
    } catch (problem) {
      if (!activePhoto(attempt)) return;
      stopCamera();
      photoStatus.textContent=problem.name==='NotAllowedError'
        ? 'Camera permission was denied. Allow it in your browser or upload a photo.'
        : 'The camera couldn’t start. You can still upload a photo.';
    } finally {
      if (activePhoto(attempt)) cameraOpen.disabled=false;
    }
  };
  cameraSnap.onclick=()=>{
    if (!stream || !live.videoWidth) return;
    try {
      captured=garmentPhoto.capture(live);
      stopCamera();
      refreshReference();
      photoStatus.textContent='Use this photo to suggest a design, or retake it.';
    } catch {
      photoStatus.textContent='This frame couldn’t be read. Try taking another photo.';
    }
  };
  function applyReference(result) {
    const modelChanged=result.model && result.model!==designDraft.model;
    if (modelChanged) changeModel(result.model);
    const oldSupport=studioDesign.selectedSupport(designDraft);
    if (result.cut) designDraft.cut=result.cut;
    if (studioDesign.isBodice(designDraft.model)) {
      if (result.support) designDraft.support=result.support;
      else if (result.sleeve && result.sleeve!=='Sleeveless') designDraft.support='Integrated shoulders';
      if (result.sleeve || modelChanged || !editedSupport) designDraft.sleeve=result.sleeve || 'Sleeveless';
      if (result.neckline) designDraft.neckline=result.neckline;
    }
    if (result.hemStyle) designDraft.hemStyle=result.hemStyle;
    if (oldSupport!==studioDesign.selectedSupport(designDraft)) designDraft.strapWidth=studioDesign.supportWidth(designDraft.support);
    if (result.primary) designDraft.primary=result.primary;
    designDraft.reference=result.thumbnail;
    designDraft.photoOutline=result.photoOutline;
    captured=undefined;
    settingsForModel();
    refreshReference();
    showMeasurements();
    const features=[result.support,result.sleeve==='Short'?'Short sleeves':'',result.hemStyle].filter(Boolean);
    const review={dress:'Review the straps, sleeves and hem shape',top:'Review the straps and sleeves',skirt:'Review the cut and hem shape',trousers:'Review the leg shape'};
    photoStatus.textContent=result.model
      ? `Starting shape suggested${features.length?' · '+features.join(' · '):''}. ${review[result.model] || 'Review the style'}, then confirm measurements using your garment or pattern.`
      : 'Photo saved. The outline was unclear. Use the custom fields to choose the silhouette, straps and hem shape.';
    preview();
    updateGuide();
  }
  async function readReference(read) {
    stopCamera();
    const attempt=photoAttempt;
    photoStatus.textContent='Reading silhouette and colors…';
    readingPhoto=true;
    try {
      const result = await read();
      if (activePhoto(attempt)) applyReference(result);
    } catch {
      if (activePhoto(attempt)) photoStatus.textContent='This image couldn’t be read. Try another JPG, PNG or WebP.';
    } finally {
      if (activePhoto(attempt)) readingPhoto=false;
    }
  }
  photo.addEventListener('change',()=>{
    const file = photo.files[0];
    if (!file) return;
    if (file.size>15000000 || !['image/jpeg','image/png','image/webp'].includes(file.type)) {
      stopCamera();
      photoStatus.textContent='Choose a JPG, PNG or WebP photo under 15 MB.';
      photo.value='';
      return;
    }
    readReference(()=>garmentPhoto.read(file));
  });
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const name = form.elements.namedItem('name').value.trim();
    if (!name) {notify('Enter a garment name.');return;}
    if (readingPhoto) {
      photoStatus.textContent='Wait for the photo to finish loading before saving.';
      return;
    }
    if (captured) {
      photoModeEnabled(true);
      photoStatus.textContent='Use or discard the captured photo before saving.';
      reference.querySelector('#use-captured')?.focus();
      return;
    }
    stopCamera();
    const {name:_,reference,...draft} = designDraft;
    const design={...draft,layers:studioDesign.layers(designDraft),seams:studioDesign.seams(designDraft),fitAdjustments:activeDesignFit()};
    const item = {id:'design-'+createId(),...applyDesignFit(studioDesign.make(design,name,body()),body()),reference};
    item.measurements=designMeasurementSheet(item);
    state.custom.push(item);
    showArchivedPatterns=false;
    if (event.submitter?.value==='order') state.orders.unshift({
      id:'WO-'+String(state.next++).padStart(3,'0'),title:name,kind:'Construction',pattern:item.id,due:'',notes:['Fitted to '+body().name+'.',reference?'Check the design details against the reference photo.':'',design.details].filter(Boolean).join('\n'),done:[]
    });
    if (event.submitter?.value==='order') showNewOrders();
    save(event.submitter?.value==='order'?'Garment and work order saved':'Garment saved to Pattern Library');
    designDraft = {...studioDesign.defaults(),name:'',reference:'',fitModelId:design.fitModelId};
    location.hash=event.submitter?.value==='order'?'orders':'library';
  });
  preview();
}

const basicLessons = [
  {
    title:'Set up your Brother CP2160F',
    tools:'Brother CP2160F machine, foot controller, SA156 Class 15 bobbin, all-purpose polyester thread, universal 80/12 needle, zigzag foot J, fabric shears, and two layers of medium-weight woven cotton scrap.',
    result:'Thread the machine and make an even row of centered straight stitches through two layers of woven cotton.',
    steps:[
      {title:'Install the needle and check foot J',figure:'needleClamp',text:'Start with a fresh universal 80/12 needle for the medium-weight woven cotton in these exercises.',actions:[
        ['needleClamp','Raise the needle','Switch off the machine. Sit facing the needle. Grip the rim of the handwheel on your right and turn the top of the wheel toward you until the needle is at its highest point.'],
        ['needleClamp','Hold the old needle while loosening the clamp','Hold the needle by its sides above the point. With your other hand, loosen the small clamp screw with the machine’s screwdriver. Slide the old needle down and set it aside.'],
        ['needleClamp','Seat the new needle','Face the flat side of the shank toward the back of the machine. Push the shank straight up to the stop while tightening the clamp screw.'],
        ['foot','Check the presser foot','Look for J on the presser foot. If it is missing, keep the power off, raise the foot lever, and use the release at the back of the holder. Center the bar of foot J beneath the holder and lower the lever to snap it on.']
      ],check:'The new needle will not slide down when gently tugged and foot J stays attached when lifted.'},
      {title:'Wind and load the lower bobbin',figure:'bobbinDrop',text:'Use the clear Brother SA156 Class 15 bobbin. Start with it empty so the thread can wind evenly.',actions:[
        ['winder','Route the thread on top','Raise the spool pin and put the spool on it. Draw thread under the bobbin-winding guide and around the pretension disk from front to back. Follow the winding path printed on the top of the machine.'],
        ['bobbinSetup','Snap the empty bobbin onto the winder','Place the bobbin over the winder shaft with its notch seated on the shaft projection. Slide the shaft right. If your winder seat has a slit cutter, wrap thread around the bobbin five or six times and pull into the slit to cut it.'],
        ['windFill','Wind evenly','For a bobbin started through a hole, pass the tail from inside to outside before seating it. Hold the tail only for the first few turns, stop the machine and snip the tail close, then continue winding. Use light foot pressure to start.'],
        ['windFill','Remove the wound bobbin','Release the foot controller when the bobbin is full and turns more slowly. Cut the connecting thread, slide the shaft left and lift off the bobbin.'],
        ['bobbinDrop','Load and thread the bobbin case','Raise the needle and presser foot and switch off. Slide open the clear cover. Drop in the bobbin so the thread pulls off counterclockwise. Hold the bobbin down with a fingertip, route the tail through the slit as the plate arrows show, then pull it into the cutter. Refit the clear cover.']
      ],tip:'If the thread slips out of the tension slit or the bobbin turns clockwise when you pull the tail, lift it out and reload it.',check:'The thread on the bobbin is even and the cover is flat and fully snapped in.'},
      {title:'Thread the top path and needle',figure:'threadEye',text:'Raise the presser foot and needle so the thread can pass through the tension path and the take-up lever.',actions:[
        ['upper','Find the presser-foot lever and the take-up lever','With the power off, lift the lever just behind the needle area. Turn the handwheel toward you until the moving take-up lever is visible at the top of the front slot.'],
        ['upper','Follow the numbered channels','Hold the thread lightly near the spool with one hand. With the other, draw it through the top guide, down the numbered channel, around the bottom turn and up toward the take-up lever.'],
        ['upper','Catch the take-up lever','Feed the thread into the visible take-up lever as the printed arrows show, then bring it down the final channel. Gently pull the tail to verify the thread is still inside the lever.'],
        ['threadEye','Thread front to back','Slide the tail behind the small guide just above the needle. Point the end through the eye from the side facing you toward the back. Pull about 10 cm through and place it under the foot toward the back.']
      ],tip:'Snip a fuzzy thread tip square so it can pass through the eye cleanly.',check:'The thread is inside the take-up lever and the tail moves freely while the presser foot is raised.'},
      {title:'Select centered straight stitch 01',figure:'screen',text:'For these woven cotton exercises, the Brother settings are stitch 01, foot J and a 2.5 mm stitch length.',actions:[
        ['screen','Read the LCD','Turn on the machine. Use the stitch selection buttons until the display reads 01 and shows foot J. The width display for this stitch is normally 3.5 mm, which positions the needle in the center.'],
        ['screen','Confirm the stitch length','Find the length control and verify 2.5 mm. If the needle-position setting was changed, restore the center and turn the handwheel toward you slowly to check the needle clears the foot.'],
        ['layer','Make a test stack','Lay one woven cotton scrap on another, match one straight raw edge and smooth both layers with your palm. Use the same layers you will sew in the project.']
      ],check:'The LCD reads 01 and 2.5 mm. Turning the handwheel lowers the needle into the opening in foot J without touching the foot.'},
      {title:'Sew and release a test row',figure:'startSeam',text:'Use the edge guide to keep the needle 1 cm in from the raw edges. Let the machine feed the cotton.',actions:[
        ['foot','Set the fabric under the foot','Raise the needle and foot and slide the test stack in from the front. Put the matched raw edges against your 1 cm guide. Turn the handwheel toward you to put the needle down at the beginning, then lower foot J.'],
        ['startSeam','Let the feed dogs carry the layers','Put your fingertips to the sides of the foot. Press the controller gently and guide the edge past the mark. Release the controller to stop, keeping the fabric still.'],
        ['lockSeam','Practice securing the row','Use the reverse button to stitch two or three stitches back along the same line. Sew forward again. After the final backstitch, raise the needle first and then the foot. Slide the scrap out and cut the threads.']
      ],check:'The row stays the same distance from the edge. Both layers advance together and the fabric lies flat.'},
      {title:'Check both sides before a project',figure:'check',text:'Turn the scrap over and examine the top and underside. Look for smooth, evenly spaced stitches without loops or skipped spots.',actions:[
        ['check','Inspect the sample','Lay it flat in good light. Look at each side. Gently separate the layers at the seam and check for gaps or broken thread.'],
        ['upper','Fix thread loops first','If you see loops underneath, switch off, raise the foot and fully rethread the top with the take-up lever visible. If the bobbin thread is not seated, reload it through the tension slit and test again.'],
        ['needle','Check the needle for skips','If you see spaces where stitches should be, switch off and check the needle for damage and that it sits fully up with the flat side back. Insert a new needle if needed.'],
        ['check','Compare a fresh test row','Make a separate row on the scrap after each change. Compare it with the previous row before adjusting tension or moving to the project fabric.']
      ],check:'The second sample has even stitches on both faces and holds under a gentle pull.'}
    ]
  },
  {
    title:'Measure and cut fabric',
    tools:'Fabric cutting board, clear ruler, measuring tape, fabric chalk, pins or pattern weights, fabric shears, optional rotary cutter with a compatible cutting mat, iron and pressing surface, and woven cotton.',
    result:'Cut a straight-grain practice rectangle and learn how to place a paper pattern.',
    practice:{width:8,length:12},
    steps:[
      {title:'Wash, press and spread out the fabric',figure:'board',text:'Cotton can shrink in the wash. Prepare it first so the marks stay accurate when you cut.',actions:[
        ['press','Wash and dry before marking','Use the care method intended for the finished piece. Let the cloth dry completely before working with it.'],
        ['press','Press out the creases','Lay the cloth on a pressing surface. Set the iron for your fiber. Lower and lift the iron in overlapping sections so it flattens creases without dragging the cloth.'],
        ['board','Lay out one layer','Set the cutting board flat on a sturdy work surface. Spread the cloth wrong side up. Smooth from the middle outward until there are no ripples or hanging edges pulling it off the board.']
      ],check:'The area you will cut lies fully supported and flat. No folds run under it.'},
      {title:'Line up the grain with the selvage',figure:'basicGrain',text:'The selvage is a tightly woven factory edge. The long arrow on the pattern usually runs parallel to it.',actions:[
        ['board','Find the factory edge','Run a finger along the two long sides of the cloth. Look for a smooth, tighter edge. A cut crosswise end tends to show loose threads.'],
        ['basicGrain','Measure both ends of the arrow','Set the ruler perpendicular to the selvage at the first arrow tip and read the distance. Slide the ruler to the opposite tip and rotate the paper until the reading matches. The diagram uses 7 cm at both ends as an example.'],
        ['weights','Hold orientation before marking','Put a weight near each end of the pattern or pin inside its cut line. For a directional print, point each piece’s top the same way before weighing down the remaining pieces.']
      ],tip:'If thick or tight selvages ripple, lay the fabric relaxed and avoid cutting the garment pieces into the puckered area.',check:'Both measurements from the grainline to the same selvage match after you secure the pattern.'},
      {title:'Mark the cut line and its allowance',figure:'cutRectangle',text:'Make an 8 × 12 cm practice rectangle. A solid cut line sets the outer size. A seam line sits inside it.',actions:[
        ['board','Use your cutting board to square a corner','Place a straight selvage parallel to a long grid line. Set the ruler at a right angle to it and lightly mark one corner on the wrong side. Confirm the grid scale with your ruler.'],
        ['cutRectangle','Draw all four sides','Mark 8 cm across and 12 cm along the grain. Keep opposite sides parallel and extend each mark until the four corners meet.'],
        ['seamGuide','Read the seam allowance before cutting','The practice rectangle uses a 1 cm seam allowance on the edge you sew later. On a commercial pattern, read whether the allowance is already printed between the cut and stitch lines. Add an allowance outside the stitching line only when the directions require it.']
      ],check:'Two opposite sides measure 8 cm and the other two measure 12 cm. You can point to the cut line before you pick up the shears.'},
      {title:'Cut the marked piece without lifting the cloth',figure:'shears',text:'Start at a corner and work along the outside line. Keep the layout secure while you cut.',actions:[
        ['weights','Anchor the shape','If you have paper over the fabric, place weights inside the outline. Leave room for the blades and take any straight pin out before cutting past it.'],
        ['shears','Glide the lower blade on the board','Slip the bottom blade under the edge. Open the shears, push the lower blade flat against the board and close the blades almost all the way. Slide ahead, then repeat. Turn the board or move your body to reach the next side.'],
        ['rotaryCut','Use a rotary cutter on a rated mat','For a straight cut on a compatible mat, hold the acrylic ruler steady with your free hand. Place the cutting wheel beside it and roll away from your body. Close the blade as soon as you finish the cut.']
      ],tip:'Use fabric shears on your cutting board when you are unsure whether it is rated for rotary blades.',check:'The cut follows the line, both ends finish at the corners and the fabric stays flat when you lift the offcuts.'},
      {title:'Transfer marks and label the pieces',figure:'markPattern',text:'Move pattern markings to the fabric before you take the paper off or separate layers.',actions:[
        ['markPattern','Transfer each useful mark','Test your chalk on a scrap. Copy notches, fold marks and any dart points onto the wrong side. For a notch, make a short chalk line into the allowance so the fabric edge stays intact.'],
        ['separateLayers','Identify mirror pieces or repeated pieces','Label the wrong side with the piece name and left or right as needed. If two panels were stacked, lift them apart and transfer marked points to the second layer.'],
        ['cutRectangle','Stack and compare','Put matching rectangles edge to edge before sewing. The cut edges should meet without stretching either piece.']
      ],check:'Each piece has a readable label and matching marks line up across the pieces that will be joined.'}
    ]
  },
  {
    title:'Sew and press a straight seam',
    tools:'Two woven cotton scraps, ruler or seam guide, fabric chalk, pins or clips, Brother CP2160F machine, all-purpose thread, seam ripper, and iron.',
    result:'Join the scraps with a 1 cm seam and press the seam allowances open.',
    steps:[
      {title:'Put the right sides together',figure:'layer',text:'The right side is the face you want to show. Place those faces against each other so the inner seam allowance will be hidden.',actions:[
        ['layer','Find and flip the right side','Set the first piece right side up. Pick up the second by two corners and turn it face down on the first. Both wrong sides should face outward.'],
        ['layer','Match the ends and then the edge','Line up the top corners, then the bottom corners. Run your fingers down the edge to make sure neither raw edge sticks out.'],
        ['pin','Hold both layers','Clip the ends and then clip between them. If you use pins, pierce both layers across the seam with the heads easy to grasp. Keep the cloth flat between fasteners.']
      ],check:'Both right sides touch inside the stack. No raw edge slips out when you lift the piece.'},
      {title:'Mark and align the 1 cm stitching line',figure:'seamGuide',text:'Measure inward from the paired raw edges. The allowance is the space from that edge to the needle line.',actions:[
        ['seamGuide','Put three marks 1 cm in','Place your ruler at a right angle to the raw edge. Mark 1 cm from the edge near each end and again midway. Join the marks with a light straight line.'],
        ['screen','Set stitch 01 and foot J','Set the Brother to centered straight stitch 01, foot J and a 2.5 mm length. Use the same settings you tested in the setup lesson.'],
        ['startSeam','Find the plate guide','With the pedal released, raise the foot and slide in the aligned scraps. Turn the handwheel toward you to bring the needle down on your first stitching mark. Find the plate line under the fabric edge. Use that line, or removable tape outside the feed dogs, as your guide.']
      ],check:'The needle touches the drawn line and the edge sits on the same guide along the length of the fabric.'},
      {title:'Secure the seam ends and sew the line',figure:'lockSeam',text:'Backstitch at the ends and sew the space in between at a slow, steady pace.',actions:[
        ['foot','Lower the foot onto both layers','Lower foot J. Hold the thread tail lightly toward the back for the first few stitches and keep your fingertips beside the foot.'],
        ['lockSeam','Lock the starting end','Sew two or three stitches forward. Hold the reverse button to sew back over those stitches. Release it and continue forward along the same line.'],
        ['pinOut','Remove each fastener before it reaches the foot','Release the pedal when a clip or pin approaches. Take it out to the side, smooth the next section and resume. Look at the raw edge against the guide as you sew.'],
        ['lockSeam','Lock the far end','As you approach the end, slow down and stop on the line while both layers still sit under the foot. Sew two or three stitches back over the line and stop.'],
        ['check','Lift and inspect the stitching','Turn the handwheel toward you to raise the needle. Raise the foot, slide the work out and cut the tails. Check the line on both faces.']
      ],tip:'If the edge drifts, stop with the needle down. Lift the foot briefly to straighten the edge, lower the foot and continue.',check:'Both ends are secured, the fabric lies flat, and the line measures 1 cm from the raw edge at several points.'},
      {title:'Press open and finish the raw edges',figure:'pressOpen',text:'Pressing sets the seam and lets both layers lie flat. Use the edge finish specified by your project.',actions:[
        ['press','Set the stitches with the layers closed','On the ironing surface, place the sewn stack as it came off the machine. Briefly press along the sewn line with the iron set for the fabric.'],
        ['pressOpen','Open the fabric and spread the allowances','Turn the piece so the wrong side is up. Open the two main layers like a book. Use your fingers to smooth one 1 cm allowance to each side of the stitched line. Lift and set the iron along the opened seam.'],
        ['zigzag','Practice a zigzag finish','On a scrap, select 04 with foot J. Start with the defaults of 3.5 mm width and 1.4 mm length. Use the handwheel to check clearance. Test with one seam allowance under the foot, stopping the swing just inside its raw edge, then finish each allowance separately if your project calls for it.'],
        ['check','Compare both faces','Flatten the seam and check that the allowances stay on their own sides. Turn the work right side up and look for ridges and puckers.']
      ],check:'The seam lies flat and the finish secures loose fibers without pulling the edge into a tunnel.'}
    ]
  },
  {
    title:'Practice project — fabric coaster',
    tools:'Two 12 × 12 cm squares of medium-weight woven cotton, fabric cutting board, Brother CP2160F machine, matching thread, ruler, fabric chalk, clips, fabric shears, a blunt point turner, and iron.',
    result:'Make one coaster about 10 × 10 cm. You will practice pivoting, turning, pressing, and topstitching.',
    steps:[
      {title:'Cut the two squares and mark the turning gap',figure:'squareGap',text:'Cut two 12 × 12 cm squares. Mark a 5 cm gap centered on one side of the stitching line.',actions:[
        ['cutRectangle','Square and cut both pieces','Spread woven cotton wrong side up. Use the ruler and board to mark right angles. Mark all four 12 cm sides of each square, then cut along the marks.'],
        ['layer','Put the squares face to face','Put the printed or right sides together. Match all four corners and clip the stacked squares.'],
        ['squareGap','Mark the line and the opening','Draw a stitching line 1 cm inside each edge. Mark the center of the bottom stitching line, then mark 2.5 cm to each side of the center. Leave the 5 cm between those marks open.']
      ],check:'Two squares match edge to edge. The gap is 5 cm wide and sits between the corners.'},
      {title:'Sew the perimeter and pivot at the corners',figure:'pivot',text:'Start at a gap mark, sew around the four corners and stop at the other gap mark. Use a 1 cm seam allowance.',actions:[
        ['screen','Set up the straight stitch','Set the LCD to 01, foot J and a 2.5 mm stitch length. Turn the handwheel toward you to lower the needle onto the right-hand gap mark.'],
        ['squareGap','Start away from the opening','Lower the foot and sew toward the nearest corner. Secure the start with two or three reverse stitches ending at the mark. Keep the opening clear for turning.'],
        ['pivot','Turn with the needle holding the fabric','As the first crossed stitch lines approach, slow down. Stop with the needle in their intersection. Keep it down, lift the foot, rotate the square a quarter turn, and lower the foot. Verify the next edge is back at the 1 cm guide.'],
        ['pivot','Repeat for all four corners','Keep the seam guide aligned along each side. Remove clips before they reach the foot. At each corner, stop on the line intersection and repeat the pivot.'],
        ['squareGap','Stop at the other gap mark','When you reach the second mark, backstitch a few stitches along the sewn edge. Then raise the needle and foot and take out the work.']
      ],tip:'With your foot off the pedal, turn the handwheel toward you to place the last stitch precisely at a corner.',check:'The line reaches each corner cleanly. Both ends are secured and the 5 cm gap is still open.'},
      {title:'Clip the corners and turn the coaster',figure:'trimCorner',text:'Take out the corner bulk first, then draw the coaster through the gap until the right sides are outside.',actions:[
        ['trimCorner','Trim the corner points','Lay the stitched square flat. Cut a short diagonal across each corner through both allowance layers. Stop just outside the stitches and keep the straight allowances intact.'],
        ['turnSquare','Turn a corner through the gap','Open the gap with two fingers and reach inside. Pinch the fabric near a far corner and pull it through. Keep drawing the rest of the square through a little at a time.'],
        ['pointTurner','Shape all four corners','Push each corner into place gently from inside with a blunt point turner. Roll the seam between your fingers so the stitch line rests on the outer edge.']
      ],tip:'If a corner sticks, roll it between your fingers before you use the point turner. A sharp tool can push through the cloth.',check:'The right sides face out and each corner lies flat without an open seam.'},
      {title:'Tuck, press and topstitch the opening closed',figure:'edgeStitch',text:'Fold both gap edges inward by 1 cm and sew a neat border 0.25 cm from the finished edge.',actions:[
        ['tuckGap','Fold both raw edges inside','At the gap, pinch one raw edge and turn it inward 1 cm. Repeat on the other layer. Match those folds with the sewn edge next to them and clip them together.'],
        ['press','Press the square flat','Lift and set the iron across the edges and corners. Take out each clip just before the iron reaches it, then put it back if the gap needs holding.'],
        ['edgeStitch','Stitch close around the whole square','Keep stitch 01, foot J and a 2.5 mm length. Start on a long section away from a corner. Use the 0.25 cm distance as a guide around the four sides, pivot with the needle down and sew across both folds at the gap. Secure the final few stitches.'],
        ['finishedSquare','Check the finished coaster','Trim the thread tails, press once more and place the coaster on a tabletop. Measure its finished width and length and gently tug both sides of the former gap.']
      ],check:'The coaster is about 10 × 10 cm, sits flat, and the folded opening stays closed.'}
    ]
  }
];

const basicVideos = [
  ['Thread the Brother CP2160 series','Brother','R986D8ipEcw'],
  ['Sew a straight seam','Made to Sew','tg6_ILHQ_q4'],
  ['Finish raw edges with zigzag','Made to Sew','Hi0jN4wlUbA'],
  ['Make a basic hem','Professor Pincushion','1vvCWFmQUhw'],
  ['Finish a neckline with a facing or binding','Seamwork','M6c2YJIPBAI'],
  ['Set in a sleeve','Professor Pincushion','pYlDH7gT7rA']
];

function basics() {
  view.innerHTML = heading('Sewing Basics','Learn your Brother CP2160F, work on your cutting board, and make your first project.') +
    `<div class="actions tight"><button type="button" class="secondary" id="watch-sewing-videos">Watch sewing videos</button></div>
    <div class="lessons">${basicLessons.map((lesson,index) => `<details class="panel lesson"${index===0?' open':''}>
      <summary><h2>${escape(lesson.title)}</h2></summary>
      <p>${escape(lesson.result)}</p>
      <p class="tight"><strong>Tools and materials</strong> ${escape(lesson.tools)}</p>
      ${sewingVisuals.tools(lesson.tools)}${workFigures.lessonSteps(lesson)}
    </details>`).join('')}</div>
    <section class="section" id="sewing-videos" aria-labelledby="sewing-videos-title" tabindex="-1">
      <h2 id="sewing-videos-title">Sewing videos</h2>
      <div class="basic-videos">${basicVideos.map(([title,publisher,id])=>`<details class="panel basic-video" data-basic-video="${id}">
        <summary><strong>${escape(title)}</strong><small>${escape(publisher)}</small></summary>
        <div class="basic-video-player"></div>
        <a class="basic-video-source" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener" aria-label="${escape(title)} on YouTube">Open on YouTube</a>
      </details>`).join('')}</div>
    </section>
    <p class="basics-resources"><a href="https://support.brother.com/g/b/manualtop.aspx?c=us&amp;lang=en&amp;prod=hf_cp2160feus" target="_blank" rel="noopener">Brother CP2160F manuals, setup diagrams and stitch chart</a></p>`;
  const library=view.querySelector('#sewing-videos');
  view.querySelector('#watch-sewing-videos').onclick=()=>{
    library.focus({preventScroll:true});
    library.scrollIntoView({block:'start'});
  };
  const videos=[...library.querySelectorAll('[data-basic-video]')];
  for (const video of videos) video.addEventListener('toggle',()=>{
    const player=video.querySelector('.basic-video-player');
    if (!video.open) {player.replaceChildren();return;}
    if (player.firstChild) return;
    for (const other of videos) if (other!==video) other.open=false;
    const iframe=document.createElement('iframe');
    iframe.src='https://www.youtube-nocookie.com/embed/'+video.dataset.basicVideo+'?autoplay=1&rel=0';
    iframe.title=video.querySelector('strong').textContent;
    iframe.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen=true;
    iframe.referrerPolicy='strict-origin-when-cross-origin';
    player.append(iframe);
  });
}

let fitCleanup;
function render() {
  fitCleanup?.();
  fitCleanup = undefined;
  const route = location.hash.slice(1);
  const page = Object.hasOwn(titles,route)?route:'overview';
  const section=page==='design'?'library':page;
  document.querySelector('#page-name').textContent = titles[section];
  for (const link of document.querySelectorAll('nav a')) {
    if (link.hash === '#'+section) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  }
  ({overview,design:designStudio,brand,library,fabrics:materialLibrary,orders,fitting,models,basics})[page]();
  studioUnits.refresh(view);
}
document.addEventListener('click',event=>{
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const id = button.dataset.id;
  switch (button.dataset.action) {
    case 'close': modal.close(); break;
    case 'new': newOrder(id,undefined,button.hasAttribute('data-use-fit-model')?fitModel:undefined); break;
    case 'pattern': patternDetails(getPattern(id)); break;
    case 'add-pattern': addPattern(); break;
    case 'order-archive-toggle': showArchivedOrders=!showArchivedOrders;orders();break;
    case 'archive-order': archiveItem('orders',id);if (modal.open) modal.close();render();break;
    case 'order': orderDetails(state.orders.find(o=>o.id===id)); break;
    case 'edit-order': newOrder(undefined,state.orders.find(o=>o.id===id)); break;
    case 'fit': startFit(id); break;
    case 'upload-fabric': uploadFabric();break;
    case 'fabric-archive-toggle': showArchivedFabrics=!showArchivedFabrics;materialLibrary();break;
    case 'archive-fabric': archiveItem('fabrics',id);materialLibrary();break;
    case 'fit-fabric': preferredFabric=id;startFit(fitPattern);break;
    case 'add-model': addModel(); break;
    case 'edit-model': addModel(getModel(id)); break;
    case 'toggle-model-archive': showArchivedModels=!showArchivedModels;models();break;
    case 'toggle-pattern-archive': showArchivedPatterns=!showArchivedPatterns;library();break;
    case 'archive-model': archiveItem('models',id);models();break;
    case 'archive-pattern': archiveItem('patterns',id);modal.close();library();break;
    case 'archive-family': {
      const family = getPattern(id).family;
      moveArchive('patterns',allPatterns().filter(item=>item.family===family).map(item=>item.id),isArchived('patterns',id));
      modal.close();
      library();
      break;
    }
    case 'choose-model': startFit(fitPattern,id); break;
    case 'copy-design': {
      const source = getPattern(id);
      designDraft = {...studioDesign.defaults(source.design.model),...source.design,fitModelId:source.fit?.modelId || source.design.fitModelId || 'studio-form',name:source.name+' variation',reference:source.reference || ''};
      modal.close();
      location.hash='design';
      break;
    }
      }
});
window.addEventListener('hashchange',()=>{
  if (modal.open) modal.close();
  render();
  window.scrollTo(0,0);
});
render();

if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).catch(error => {
    console.warn('Offline dashboard setup was unavailable.', error);
  });
}
