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
const titles = {overview:'Overview',design:'Design Studio',brand:'Brand Kit',library:'Pattern Library',fabrics:'Fabric Library',orders:'Work Orders',fitting:'3D Fitting Room',models:'Model Library',basics:'Sewing Basics'};
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
const hasSleeves = pattern => pattern.fit?.changes.hasSleeves ?? Boolean(pattern.sleeves);
const option = (value,name,selected) => `<option value="${escape(value)}"${value===selected?' selected':''}>${escape(name)}</option>`;
const patternCategory=pattern=>pattern.category || ({dress:'Dresses by silhouette',top:'Tops by silhouette',skirt:'Skirts by silhouette',trousers:'Pants by silhouette'}[basePattern(pattern).id]);
const options = (selected,fittingOnly=false) => {
  const groups=new Map();
  for (const p of activeChoices(allPatterns(),'patterns',selected).filter(p=>!fittingOnly||!p.external)) {
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
    <button class="secondary" data-action="fabric-archive-toggle">${showArchivedFabrics?'Show active':'Show archive'}</button><button data-action="upload-fabric">＋ Upload fabric swatch</button></div>
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
  showDialog('Upload fabric swatch',`<form id="fabric-form">
    <label class="field">Fabric name<input name="name" maxlength="100" required></label>
    <label class="field">Swatch photo (JPEG, PNG or WebP)<input name="photo" type="file" accept="image/jpeg,image/png,image/webp" required></label>
    <label class="field">Category<select name="category">${Object.keys(fabricFit.materialGroups).map(key=>option(key,key)).join('')}</select></label>
    <div class="fields"><label class="field">Weight (g/m²)<input name="gsm" type="number" min="45" max="900" value="150" required></label>
    <label class="field">Drape<select name="bend"><option value=".2">Fluid</option><option value=".42" selected>Balanced</option><option value=".65">Structured</option></select></label>
    <label class="field">Crosswise stretch (%)<input name="cross" type="number" min="0" max="100" step=".1" value="3" required></label>
    <label class="field">Lengthwise stretch (%)<input name="length" type="number" min="0" max="100" step=".1" value="2" required></label></div>
    <p class="muted">Use a close-up photo in even light. Your photo and measurements stay in this browser.</p>
    <p class="tight" role="alert"></p><button class="tight">Save fabric</button></form>`);
  const form=modal.querySelector('#fabric-form');
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const data=new FormData(form);
    const name=data.get('name').trim();
    const error=form.querySelector('[role=alert]');
    if (!name || allFabrics().some(item=>item.name.toLowerCase()===name.toLowerCase())) {
      error.textContent='Enter a unique fabric name.';return;
    }
    const file=data.get('photo');
    if (!file?.size || file.size>15000000 || !['image/jpeg','image/png','image/webp'].includes(file.type)) {
      error.textContent='Choose a JPEG, PNG or WebP under 15 MB.';return;
    }
    const button=form.querySelector('button');
    button.disabled=true;
    try {
      const photo=await fabricFit.readSwatch(file);
      if (!form.isConnected || !modal.open) return;
      const cross=Number(data.get('cross'))/100;
      state.fabrics.unshift({name,photo,category:data.get('category'),gsm:Number(data.get('gsm')),
        cross,length:Number(data.get('length'))/100,bend:Number(data.get('bend')),power:cross>.14?1.58:1.2});
      save('Fabric swatch saved');
      modal.close();
      showArchivedFabrics=false;
      materialLibrary();
    } catch {
      error.textContent='The swatch could not be read.';
      button.disabled=false;
    }
  });
}
function library() {
  view.innerHTML = heading('Pattern Library','Browse garment cuts and construction guides, or add a style from your own pattern collection.') + `<div class="toolbar"><label class="field">Search patterns<input id="pattern-search" type="search" placeholder="Search by style or cut"></label><label class="field">Garment type<select id="pattern-filter"><option value="">All garments</option>${[...new Set(patterns.map(p=>p.type))].map(type=>option(type,type)).join('')}</select></label><label class="field">Collection<select id="pattern-category"><option value="">All collections</option></select></label><button class="secondary" data-action="toggle-pattern-archive">${showArchivedPatterns?'Show active':'Show archive'}</button><button data-action="add-pattern">＋ Add style</button></div><p class="muted tight" id="pattern-count"></p><div class="patterns" id="patterns"></div><button class="secondary tight" id="more-patterns" hidden>Show more garments</button>`;
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
    container.innerHTML = matches.length ? matches.slice(0,limit).map(p=>`<article class="card pattern"><div class="pattern-art">${p.external?`<span class="pattern-source">${escape(p.external.publisher)}<small>Free pattern</small></span>`:`<canvas width="360" height="155" data-pattern="${escape(p.id)}" role="img" aria-label="${escape(p.cut)} illustration"></canvas>`}</div><div class="pattern-body"><span class="badge">${escape(p.type)} · ${escape(patternCategory(p))}</span><h3 class="tight">${escape(p.name)}</h3><p>${escape(p.cut)} · ${p.revision?'Revision '+p.revision:escape(p.level)}</p><button class="secondary" data-action="pattern" data-id="${escape(p.id)}">View ${p.fit?'tailoring guide':'construction guide'}</button> ${p.external?'':`<button class="secondary" data-action="fit" data-id="${escape(p.id)}">${p.fit?'Revise fit':'Alter garment'}</button>`}</div></article>`).join('') : '<p>No styles match your search.</p>';
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
  if (after.external) return `<div class="wo-preview wo-reference"><span>${escape(after.cut)}</span></div>`;
  const before=orderKind(order)==='Tailoring'?getPattern(order.before || after.fit?.source):null;
  const frames=[...(before?[[before,'Before']]:[]),[after,before?'After':'Garment preview']];
  return `<div class="wo-preview">${frames.map(([pattern,label])=>`<figure><canvas width="150" height="130" data-order-preview="${escape(pattern.id)}" role="img" aria-label="${escape(label+' · '+pattern.name)}"></canvas><figcaption>${label}</figcaption></figure>`).join('')}</div>`;
}

function drawOrderPreviews(root) {
  for (const canvas of root.querySelectorAll('[data-order-preview]')) {
    const item=getPattern(canvas.dataset.orderPreview);
    if (!item) continue;
    drawModel(canvas,item,-.27,item.fit?.changes||{hasSleeves:hasSleeves(item)},item.fit?.modelMeasurements||{},true,
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
const referenceLinks=pattern=>pattern?.external?`<div class="actions tight"><a href="${escape(pattern.external.url)}" target="_blank" rel="noopener" class="button">Open free pattern at ${escape(pattern.external.publisher)}</a><a href="${escape(pattern.external.terms)}" target="_blank" rel="noopener" class="button secondary">Publisher terms</a></div>`:'';
function patternDetails(pattern) {
  const revisions = pattern.family ? allPatterns().filter(p=>p.family===pattern.family && isArchived('patterns',p.id)===isArchived('patterns',pattern.id)).sort((a,b)=>b.revision-a.revision) : [];
  const revisionPicker = revisions.length ? `<label class="field">Revision<select id="revision-picker">${revisions.map(p=>option(p.id,'Revision '+p.revision,p.id===pattern.id?p.id:null)).join('')}</select></label>` : '';
  showDialog(pattern.name,`${revisionPicker}${referenceLinks(pattern)}${pattern.reference?.startsWith('data:image/jpeg;base64,')?`<figure class="design-reference"><img src="${escape(pattern.reference)}" alt="Uploaded garment reference"><figcaption>Reference photo</figcaption></figure>`:''}<p>${escape(pattern.cut)} · ${escape(pattern.level)}</p><p class="tight"><strong>Suggested fabric</strong> ${escape(pattern.fabric)}</p><p class="tight"><strong>Tools and notions</strong> ${escape(pattern.tools)}</p>${sewingVisuals.tools(pattern.tools)}${sewingVisuals.steps(pattern.steps, pattern.visuals || sewingVisuals.patterns[pattern.id])}<div class="actions"><button data-action="new" data-id="${escape(pattern.id)}">${pattern.revision?'Make this revision again':'Create work order'}</button>${pattern.external?'':`<button class="secondary" data-action="fit" data-id="${escape(pattern.id)}">${pattern.revision?'Revise this fit':'Open fitting room'}</button>`}${pattern.design?`<button class="secondary" data-action="copy-design" data-id="${escape(pattern.id)}">Customize design copy</button>`:''}<button class="secondary" data-action="archive-pattern" data-id="${escape(pattern.id)}">${isArchived('patterns',pattern.id)?'Restore':pattern.revision?'Archive this revision':'Archive garment'}</button>${revisions.length>1?`<button class="secondary" data-action="archive-family" data-id="${escape(pattern.id)}">${isArchived('patterns',pattern.id)?'Restore all revisions':'Archive all revisions'}</button>`:''}</div>`);
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
function newOrder(id,existing) {
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
function orderDetails(order) {
  const pattern = getOrderPattern(order);
  showDialog(order.title,`${orderPreview(order)}<p>${order.id} · ${escape(pattern.name)}</p>${order.notes ? `<p class="tight" style="white-space:pre-wrap">${escape(order.notes)}</p>` : ''}<p class="tight"><strong>Fabric</strong> ${escape(pattern.fabric)}</p><p class="tight"><strong>Tools and notions</strong> ${escape(pattern.tools)}</p>${referenceLinks(getPattern(order.pattern))}${sewingVisuals.tools(pattern.tools)}${fitMeasurementTable(pattern.measurements)}${sewingVisuals.machineGuide()}<h3 class="tight">Step checklist</h3><p id="order-progress" aria-live="polite">${order.done.length} of ${pattern.steps.length} steps completed</p><ol class="check-list">${pattern.steps.map((step,index)=>{
    const visual=(pattern.visuals || sewingVisuals.patterns[pattern.id])?.[index] || sewingVisuals.identify(step);
    return `<li><label><input type="checkbox" value="${index}" ${order.done.includes(index)?'checked':''}><span><strong>${index+1}.</strong> ${escape(step)}</span></label>${sewingVisuals.diagram(visual)}${sewingVisuals.operationDetails(step,visual)}</li>`;
  }).join('')}</ol><button class="secondary" data-action="edit-order" data-id="${order.id}">Edit work order</button> <button class="secondary" data-action="archive-order" data-id="${order.id}">${isArchived('orders',order.id)?'Restore':'Archive'} work order</button>`);
  drawOrderPreviews(modal);
  modal.querySelector('.check-list').addEventListener('change',event => {
    if (!event.target.matches('input')) return;
    order.done = [...modal.querySelectorAll('.check-list input:checked')].map(box=>Number(box.value));
    save();
    document.querySelector('#order-progress').textContent = `${order.done.length} of ${pattern.steps.length} steps completed`;
    render();
  });
}

const mannequin = [[-.9,.075,.07],[-.79,.09,.085],[-.75,.21,.105],[-.63,.255,.133],[-.45,.206,.128],[-.25,.155,.104],[-.04,.194,.127],[.16,.232,.14],[.3,.192,.13]];
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
  const context = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const scale = Math.min(height * (thumbnail && pattern ? .44 : .345)/Math.max(1,(body.height||168)/174),width*.57);
  const cx = width/2;
  const cy = height*(thumbnail && pattern ? .49 : .51);
  const faces = [];
  const surfaces = {};
  const model = pattern ? basePattern(pattern).id : null;
  const design = pattern?.design;
  const designShape = design ? studioDesign.measurements(design) : null;
  const necklineStyle = changes.neckline || design?.neckline;
  const materialName=analysis?.fabricName || design?.fabric;
  const selectedSwatch=materialName?getFabric(materialName):null;
  const weave=materialName?fabricFit.weave(materialName,selectedSwatch?.category):'plain';
  const regions = analysis?.show ? fabricFit.estimate(pattern,model,body,changes,analysis.pose,analysis.material) : null;
  const segments = 38;
  const spin = Math.cos(angle);
  const sine = Math.sin(angle);
  const tilt = -.105;
  const tall=fabricFit.clamp((body.height||168)/168,.85,1.14);
  const inseamBias=body.inseam && body.height ? fabricFit.clamp(body.inseam/body.height-.452,-.075,.075)*2.1:0;
  const project = ([x,y,z]) => {
    const legBlend=y<.2?Math.max(0,(y+1.23)/1.43):Math.max(0,(1.128-y)/.928);
    y=1.128+(y-1.128)*tall-inseamBias*legBlend;
    const px = x*spin-z*sine;
    const pz = x*sine+z*spin;
    const py = y*Math.cos(tilt)-pz*Math.sin(tilt);
    const depth = y*Math.sin(tilt)+pz*Math.cos(tilt);
    const perspective = 3.7/(3.7-depth);
    return [cx+px*scale*perspective,cy+py*scale*perspective,depth];
  };
  function mesh(rings,hex,offset=0,neck=false,detail=false,fabricBody=false,transform=null,part=null,visibleBand=null) {
    const channels = hex.match(/[0-9a-f]{2}/gi).map(c=>parseInt(c,16));
    function point(ring,theta,ringIndex) {
      const [y,w,d,center=0] = ring;
      const x = Math.cos(theta);
      const z = Math.sin(theta);
      const neckWidth = fabricFit.clamp(.56+(changes.neckWidth||0)/37,.21,.94);
      const neckDepth = fabricFit.clamp(.115+(changes.neckDepth||0)/75,.012,.39);
      const neckProfile = Math.abs(x)/(neckWidth * (necklineStyle==='Boat'?1.27:1));
      const outline = necklineStyle==='V-neck' ? Math.max(0,1-neckProfile)
        : necklineStyle==='Square' ? Math.max(0,1-neckProfile**7)
        : Math.max(0,1-neckProfile**2);
      const frontDepth = neckDepth * ({Crew:.58,Boat:.45,'V-neck':1.5,Square:1.18}[necklineStyle] || 1);
      const neckline = neck ? Math.max(0,1-(y-rings[0][0])/.70)* outline*(z>0?frontDepth:fabricFit.clamp(.0575+(changes.backNeck||0)/92,.012,.25)) : 0;
      const fold = detail ? Math.max(0,y-.34)*.008*Math.sin(theta*9) : 0;
      const slope = neck?Math.abs(x)*(changes.shoulderSlope||0)/120*Math.max(0,1-ringIndex/5):0;
      const projectedBust=(part==='torso-skin'||neck)?sewingModels.bustShape(body,x,y,z):0;
      const vertex=[offset+center+x*(w+fold),y+neckline+slope,z*(d+fold)+projectedBust];
      return project(transform?transform(vertex,theta):vertex);
    }
    if (part && part!=='torso-skin') surfaces[part]={rings,projectPoint:point,
      opening:fabricFit.clamp((.56+(changes.neckWidth||0)/37)*(necklineStyle==='Boat'?1.27:1),.2,.97)};
    const projected = rings.map((row,index)=>Array.from({length:segments},(_,i)=>point(row,i*2*Math.PI/segments,index)));
    const contrast = design?.accent ? color(design.accent).match(/[0-9a-f]{2}/gi).map(c=>parseInt(c,16)) : channels;
    for (let ring=0;ring<rings.length-1;ring++) {
      const band=(rings[ring][0]+rings[ring+1][0])*.5;
      if (visibleBand && !visibleBand(band)) continue;
      for (let i=0;i<segments;i++) {
        if (neck && !changes.hasSleeves && ring===0 && (i>=17&&i<=21 || i<2 || i>=36)) continue;
        const next=(i+1)%segments;
        const points=[projected[ring][i],projected[ring][next],projected[ring+1][next],projected[ring+1][i]];
        const [a,b,c] = points;
        if ((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]) >= 0) continue;
        const theta = (i+.5)*2*Math.PI/segments+angle;
        const light = .73+.24*Math.cos(theta-1.95)+.12*Math.sin(theta);
        const depth = points.reduce((sum,p)=>sum+p[2],0)/4;
        const contrastPanel = detail && design && fabricBody && (design.tone==='Contrast lower panel' && ring>=Math.floor(rings.length*.54) || design.finish==='Contrast hem band' && ring===rings.length-2);
        const level = regions && part ? fabricFit.levelAt(regions,band,theta-angle,part) : 0;
        const swatch=part && detail && !contrastPanel?fabricFit.sample(selectedSwatch?.photo,i/segments*3,band*2.5,analysis?.redraw):null;
        const grain=part && detail?(weave==='twill'?Math.sin(i*2.1+band*116)*.043:
          weave==='knit'?Math.cos(i*3.2)*Math.sin(band*125)*.035:
          weave==='satin'?Math.max(0,Math.cos(theta-1.95))**12*.17:Math.sin(i*3.5+band*127)*.024):0;
        const palette=contrastPanel?contrast:swatch || channels;
        const fiber=(level>0?fabricFit.tint(palette,level):palette).map(c=>fabricFit.clamp(Math.round(c*(light+grain)),0,255));
        faces.push({points,depth,paint:'rgb('+fiber.join(',')+')',seam:detail&&(i===0||i===19||ring===rings.length-2)});
      }
    }
  }
  const waistDelta = (changes.waist || 0)/450;
  const hipDelta = (changes.hip || 0)/450;
  const bodyWaist = ((body.waist || 74)-74)/450;
  const bodyHip = ((body.hip || 98)-98)/450;
  const lengthDelta = (changes.length || 0)/95+(designShape?.lower || 0)*(model==='top'?.16:.22);
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
      const widthChange = waistWeight(y)*waist+hipWeight(y)*hip+designWidth+extraSweep+
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
  const rig = fabricFit.rig(pose);
  const [floorX,floorY]=project(rig.foot([0,1.127,.055]));
  context.ellipse(floorX,floorY+2,scale*.35,scale*.055,0,0,Math.PI*2);
  context.fill();
  const skin = color(body.skin||'#d7b69d');
  const torso = sewingModels.shape(body,resize(body.scan?modelCamera.rings(mannequin,body.scan):mannequin,bodyWaist,bodyHip,0,
    {bust:modeledBust,shoulder:modeledShoulder}),'torso');
  const head = [[-1.24,.015,.023],[-1.219,.065,.062],[-1.17,.084,.078],[-1.105,.084,.082],
    [-1.063,.082,.081],[-1.035,.072,.077],[-1.009,.057,.066],[-.986,.047,.053],[-.962,.047,.053],[-.917,.051,.058],[-.875,.065,.07]]
    .map(([y,w,d])=>[y,w*(sewingModels.profileOf(body)==='male'?1.06:1),d]);
  const upperLeg = Math.max(.083,.112+bodyHip*.37);
  const legBody = sewingModels.shape(body,[[.20,upperLeg,.114],[.28,upperLeg,.119],[.38,upperLeg*.94,.108],
    [.56,.081,.086],[.66,.069,.067],[.76,.071,.069],[.88,.056,.057],[.996,.036,.041],[1.045,.04,.039]],'leg');
  const foot = [[1.014,.031,.037],[1.054,.058,.086],[1.096,.059,.103],[1.116,.052,.094],[1.128,.009,.029]];
  const armBody = sewingModels.shape(body,[[-.728,.027,.046,.19],[-.668,.058,.064,.244],[-.52,.052,.052,.285],
    [-.365,.045,.044,.317],[-.28,.043,.041,.33],[-.14,.032,.032,.35],
    [-.038,.026,.026,.367],[-.006,.032,.03,.373],[.055,.036,.027,.384],[.103,.019,.015,.397],[.123,.005,.005,.40]],'arm');
  const legSpacing = .116 + bodyHip*.24;
  const shoulders = modeledShoulder/240;
  const armScale=fabricFit.clamp((body.arm||56)/56,.78,1.27);
  const torsoMove=rig.torso;
  const legMove=rig.leg;
  const skirtMove=(point,theta)=>rig.skirt(point,theta,analysis?.material);
  function armMove(side) {
    const pivot=.218+shoulders;
    const lift=pose.arm*2.3;
    const reach=pose.reach*.98;
    const elbowAngle=pose.sit*.7+pose.reach*.22+pose.arm*.17;
    return ([x,y,z])=>{
      const u=x*side-pivot;
      let v=(y+.68)*armScale;
      const forearm=Math.max(0,y+.28)*armScale;
      v-=forearm*(1-Math.cos(elbowAngle));
      z+=forearm*Math.sin(elbowAngle);
      const sagittalY=v*Math.cos(reach)-z*Math.sin(reach);
      const sagittalZ=v*Math.sin(reach)+z*Math.cos(reach);
      return torsoMove([side*(pivot+u*Math.cos(lift)+sagittalY*Math.sin(lift)),
        -.68+sagittalY*Math.cos(lift)-u*Math.sin(lift),sagittalZ]);
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
  const tailored = {...changes,bust:modeledBust+(changes.bust||0),shoulder:modeledShoulder+(changes.shoulder||0)};
  const shell = pattern?hang(resize(shells[model],bodyWaist+waistDelta,bodyHip+hipDelta,model==='trousers'?0:lengthDelta,tailored,true)):null;
  const trouserLeg=model==='trousers'?expanded(hang(resize(
    [[.19,.12,.128],[.36,.123,.132],[.57,.107,.112],[.8,.103,.108],[.93,.103,.106]],0,hipDelta,lengthDelta,changes,true))):null;
  const restingHem=['dress','skirt'].includes(model)?shell.at(-1)[0]:0;
  const legCover=trouserLeg?.at(-1)[0] ?? Math.max(0,restingHem-pose.sit*.14);
  const torsoCover=shell ? Math.max(shell[0][0],(model==='dress'||model==='top')?-.27:-Infinity) : 2;
  const visibleTorso=y=>!shell||y<torsoCover||y>shell.at(-1)[0];
  const exposedLeg=legBody.filter(([y])=>y>legCover);
  if (legCover>=legBody[0][0] && legCover<legBody.at(-1)[0]) {
    exposedLeg.unshift([legCover,...fabricFit.envelope(legBody,legCover)]);
  }

  if (fullBody) {
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
    } else mesh(expanded(torso),skin,0,false,false,false,torsoMove,'torso-skin',visibleTorso);
    mesh(fabricFit.resample(head,.021),skin,0,false,false,false,(point,theta)=>{
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
      mesh(expanded(arms),skin,0,false,false,false,moveArm);
      for (const [index,length] of [.056,.069,.062,.046].entries()) {
        const x=side*(.36+shoulders+index*.014);
        const fingers=[[.04,.011,.017,x],[.072,.009,.012,x+side*.006],[.05+length,.005,.006,x+side*.011],[.055+length,.002,.003,x+side*.012]];
        mesh(fingers,skin,0,false,false,false,moveArm);
      }
      mesh([[.002,.014,.017,side*(.356+shoulders)],[.045,.011,.011,side*(.337+shoulders)],
        [.073,.006,.006,side*(.337+shoulders)]],skin,0,false,false,false,moveArm);
      if (exposedLeg.length>1) mesh(expanded(exposedLeg),skin,side*legSpacing,false,false,false,legMove);
      mesh(foot,skin,side*legSpacing,false,false,false,p=>rig.foot([p[0],p[1],p[2]+.045]),null,y=>y>legCover);
    }
  }

  if (pattern) {
    const torsoClearance = body.mesh ? importedEnvelope(body.mesh,torso) : torso;
    let guarded = fullBody?fabricFit.clearance(expanded(shell),torsoClearance):expanded(shell);
    if (fullBody && ['dress','skirt'].includes(model)) {
      const coveredLegs=legBody.map(([y,w,d])=>[y,(w+legSpacing)*1.045,d*1.32]);
      guarded=fabricFit.clearance(guarded,coveredLegs);
    }
    mesh(guarded,color(pattern.color),0,model==='top'||model==='dress',true,true,
      (point,theta)=>{
        const [x,y,z]=point;
        const side=Math.abs(Math.cos(theta));
        const shoulderEase=Math.max(0,1-Math.abs(y+.63)/.43)*side**2;
        const rise=pose.arm*.12*shoulderEase;
        const reach=pose.reach*.075*shoulderEase;
        const back=model==='trousers'?Math.max(0,-Math.sin(theta)):0;
        const seatWeight=Math.max(0,1-Math.abs(y-.13)/.27);
        const extraBack=back*(changes.backRise||0)/100*Math.max(0,1-Math.abs(y+.16)/.46);
        const extraCrotch=(changes.crotch||0)/135*seatWeight*Math.sin(theta);
        const moved=[x,y-rise-extraBack,z+reach+extraCrotch];
        return model==='dress'||model==='skirt'?skirtMove(moved,theta):torsoMove(moved);
      },'shell');
    if (changes.hasSleeves && (model==='dress'||model==='top')) {
      const sleeve=(changes.sleeveWidth||0)/410+(design?.sleeve==='Puff'?.045:0);
      const length=(changes.sleeveLength||0)/75+({Short:-.08,Elbow:.07,Long:.39,Puff:.02,Bell:.36}[design?.sleeve]||0);
      const cuff=(changes.cuff||0)/410+(design?.sleeve==='Bell'?.085:0);
      for (const side of [-1,1]) {
        const rings=[[-.71,.075+sleeve+(changes.sleeveCap||0)/460,.091],[-.60,.085+sleeve+(changes.sleeveCap||0)/620,.105],
          [Math.max(-.595,-.46+length*.48),.068+sleeve*.6,.077],
          [Math.max(-.585,-.35+length),.057+cuff,.064+cuff*.64]];
        const shellSleeve=expanded(hang(rings)).map(([y,w,d])=>{
          const [bw,bd]=fabricFit.envelope(armBody,y);
          const next=armBody.findIndex(ring=>ring[0]>=y);
          const i=fabricFit.clamp(next<0?armBody.length-1:next,1,armBody.length-1);
          const a=armBody[i-1],b=armBody[i];
          const t=fabricFit.clamp((y-a[0])/(b[0]-a[0]),0,1);
          const center=fabricFit.mix(a[3],b[3],t);
          return [y,Math.max(w,bw+.012),Math.max(d,bd+.012),side*(center+shoulders)];
        });
        mesh(shellSleeve,color(pattern.color),0,false,true,false,armMove(side),'sleeve');
      }
    }
    if (trouserLeg) {
      const fitted=fabricFit.clearance(trouserLeg,legBody);
      for (const side of [-1,1]) mesh(fitted,color(pattern.color),side*legSpacing,false,true,true,(point,theta)=>{
        const moved=legMove(point);
        const knee=Math.max(0,1-Math.abs(point[1]-.64)/.19);
        moved[2]+=pose.sit*knee*Math.max(0,Math.sin(theta))*(changes.kneeFlex||0)/145;
        return moved;
      },'leg');
    }
  }
  for (const face of faces.sort((a,b)=>a.depth-b.depth)) {
    context.beginPath();
    face.points.forEach(([x,y],index)=>index?context.lineTo(x,y):context.moveTo(x,y));
    context.closePath();
    context.fillStyle = face.paint;
    context.fill();
    context.lineWidth = .85;
    context.strokeStyle = face.paint;
    context.stroke();
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
  return Object.fromEntries((analysis?.handleKeys || []).map(key=>[key,fitHandles.place(key,surfaces,canvas)]));
}

let fitPattern = 'dress';
let fitModel = 'studio-form';
let fitRevision = null;

function models() {
  const visible = allModels().filter(model=>isArchived('models',model.id)===showArchivedModels);
  view.innerHTML = heading('Model Library','Choose a female or male form, enter your measurements, or shape a custom form with your camera.')+
    `<div class="section-head"><h2>${showArchivedModels?'Archived models':'Saved models'}</h2><div class="actions"><button class="secondary" data-action="toggle-model-archive">${showArchivedModels?'Show active':'Show archive'}</button><button data-action="add-model">＋ Add custom model</button></div></div>
    <div class="patterns">${visible.length?visible.map(model=>`<article class="card pattern"><div class="pattern-art"><canvas width="350" height="155" data-form="${escape(model.id)}" role="img" aria-label="${escape(model.name)} preview"></canvas></div><div class="pattern-body"><h3>${escape(model.name)}</h3><p>${sewingModels.profiles[sewingModels.profileOf(model)]} · ${model.mesh?'Imported OBJ':model.scan?'Camera-shaped form':'Measurement-based form'} · Chest ${model.bust} cm · Waist ${model.waist} cm · Hip ${model.hip} cm</p>${sewingModels.summary(model)?`<p>${sewingModels.summary(model)}</p>`:''}<div class="actions">${showArchivedModels?'':`<button data-action="choose-model" data-id="${escape(model.id)}">Fit a garment</button>${state.models.includes(model)?`<button class="secondary" data-action="edit-model" data-id="${escape(model.id)}">Edit</button>`:''}`}<button class="secondary" data-action="archive-model" data-id="${escape(model.id)}">${showArchivedModels?'Restore':'Archive'}</button></div></div></article>`).join(''):'<p>No models in this view.</p>'}</div>`;
  for (const canvas of view.querySelectorAll('canvas')) drawModel(canvas,null,-.34,{},getModel(canvas.dataset.form),true);
}

function addModel(existing) {
  const starting = existing || getModel('studio-form');
  const fields=(optional)=>Object.entries(sewingModels.dimensions).filter(([key])=>sewingModels.extra.has(key)===optional)
    .map(([key,[label,min,max]])=>`<label class="field">${label} (cm)<input type="number" data-length-input name="${key}" min="${min}" max="${max}" value="${starting[key] || ''}" step="0.5" ${optional?'':'required'}></label>`).join('');
  showDialog(existing?'Edit model':'Add custom model',`<form id="model-form"><label class="field">Model name<input name="name" maxlength="90" value="${escape(existing?.name || '')}" required></label>
    <label class="field">Starting profile<select name="profile">${Object.entries(sewingModels.profiles).map(([key,name])=>option(key,name,sewingModels.profileOf(starting))).join('')}</select></label>
    <div class="fields">${fields(false)}</div>
    <label class="field" id="cup-field"${sewingModels.profileOf(starting)==='male'?' hidden':''}>Bust cup profile
      <select name="cup"><option value="">From bust and underbust</option>${sewingModels.cups.map(cup=>option(cup,cup,existing?.cup)).join('')}</select>
    </label>
    <details class="design-options"><summary>More measurements (optional)</summary><div class="fields tight">${fields(true)}</div></details>
    <details class="design-options"><summary>Shape your form with a camera</summary>
      <p class="tight">Stand head to toe against a plain, contrasting background. Wear fitted clothes and keep your arms down and a little away from your torso. Capture one front view and one side view. Use the same camera position for both.</p>
      <p class="tight">Your measurements set the sizing. Only the outline is kept. Camera frames stay on this device and aren’t saved.</p>
      <video class="model-camera" muted autoplay playsinline hidden aria-label="Live camera preview"></video>
      <p class="tight" role="status">${existing?.scan?'This model has a saved outline.':''}</p>
      <div class="actions tight"><button type="button" data-camera-start>Turn camera on</button><button type="button" class="secondary" data-camera-front>Capture front</button><button type="button" class="secondary" data-camera-side>Capture side</button><button type="button" class="secondary" data-camera-stop>Turn off</button><button type="button" class="secondary" data-camera-clear>Clear outline</button></div>
      <label class="field tight">Form skin tone<input type="color" name="skin" value="${color(existing?.skin || '#d7b69d')}"></label>
      <canvas id="model-scan-preview" class="model-scan-preview" width="300" height="157" role="img" aria-label="Preview of the shaped dress form"></canvas>
    </details>
    <details class="design-options"><summary>Import a 3D torso instead</summary><label class="field tight">Optional 3D torso file (.obj)<input type="file" name="mesh" accept=".obj"></label>
      <p>Use a low-poly torso with Y pointing up and the front facing +Z. An imported mesh takes priority over a camera outline.</p>
      ${existing?.mesh?'<label class="sleeve-choice tight"><input type="checkbox" name="removeMesh"> Remove the saved OBJ mesh</label>':''}
    </details>
    <p id="model-error" class="tight" role="alert"></p><button>Save model</button></form>`);
  const form = document.querySelector('#model-form');
  const canvas = form.querySelector('#model-scan-preview');
  let scan = existing?.scan || null;
  const readDimensions=()=>Object.fromEntries(Object.keys(sewingModels.dimensions).flatMap(key=>{
    const metric=studioUnits.lengthValue(form.elements.namedItem(key));
    return metric==null?[]:[[key,metric]];
  }));
  function preview() {
    const data = new FormData(form);
    drawModel(canvas,null,-.24,{}, {...readDimensions(),profile:data.get('profile'),cup:data.get('cup'),scan,skin:color(data.get('skin'))},true);
  }
  modalCleanup = modelCamera.setup(form,scan,next=>{
    scan=next;
    preview();
  });
  form.addEventListener('input',event=>{
    form.querySelector('#cup-field').hidden=form.elements.namedItem('profile').value==='male';
    if (event.target.name==='profile' && !existing) {
      const preset=sewingModels.starter[event.target.value];
      for (const key of Object.keys(sewingModels.dimensions)) studioUnits.writeLength(form.elements.namedItem(key),preset[key]??null);
    }
    preview();
  });
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get('name').trim();
    const error = form.querySelector('#model-error');
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
    const item = {id:existing?.id || 'form-'+createId(),name,...readDimensions(),profile:data.get('profile'),cup:data.get('profile')==='female'?data.get('cup'):'',mesh,scan,skin:color(data.get('skin'))};
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
  for (const [key,value] of Object.entries(changes)) {
    if (!value || ['waist','hip','length','hasSleeves','neckline','sleeves'].includes(key)) continue;
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
  const before=source.fit?.changes || {};
  const after=target.fit?.changes || {};
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
  return difference;
}
function fitSummary(delta) {
  return Object.entries(delta).map(([key,amount])=>key==='neckline'?amount+' neckline':
    key==='sleeves'?(amount?'Add sleeves':'Remove sleeves'):garmentFit.fields[key][0]+' '+adjustmentText(amount)).join(' · ');
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
  const targets=[];
  if (make && Number.isFinite(pattern.design?.ease)) {
    const model=basePattern(pattern).id;
    const key=['top','dress'].includes(model)?'bust':'hip';
    targets.push([key==='bust'?'Finished chest / bust target':'Finished hip / seat target',cm(body[key]+pattern.design.ease+(targetChanges[key]||0))]);
  }
  return {headings:make?['Model measurement','Size']:['Model measurement','Source','Target'],
    rows,adjustments,targets,make};
}
function fitMeasurementTable(sheet) {
  if (!sheet) return '';
  const table=(headings,rows)=>`<div class="table"><table><thead><tr>${headings.map(h=>`<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(([label,...cells])=>
    `<tr><th scope="row">${escape(label)}</th>${cells.map(cell=>`<td>${escape(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  return `<section class="wo-measurements"><h3>Measurement sheet</h3>${table(sheet.headings,sheet.rows)}
    ${sheet.adjustments.length?table(['Garment setting',sheet.make?'Change from the base pattern':'Change from source to target'],sheet.adjustments):''}
    ${sheet.targets.length?table(['Finished garment','Target including design ease'],sheet.targets):''}
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
  const instructions=base.design?studioDesign.make({...base.design,fabric:fabric.name},base.name,body):base;
  const baseVisuals=instructions.visuals || sewingVisuals.patterns[base.id] || instructions.steps.map(sewingVisuals.identify);
  return {steps:[...steps,...instructions.steps],visuals:[...visuals,...baseVisuals],tools:instructions.tools,
    fabric:`${fabric.name} (${fabric.gsm} g/m²). ${instructions.fabric}`};
}

function fitting() {
  const pattern = getPattern(fitPattern);
  const modelType = basePattern(pattern).id;
  const sleeveEligible = ['dress','top'].includes(modelType);
  const fabricName=preferredFabric || fitRevision?.fabric?.name || pattern.design?.fabric ||
    (/denim/i.test(pattern.fabric)?'Rigid denim':/twill|suiting/i.test(pattern.fabric)?'Medium-weight twill':'Cotton poplin');
  preferredFabric='';
  const initialMaterial=getFabric(fabricName);
  const initialWeight=fitRevision?.fabric?.gsm || initialMaterial.gsm;
  const siblings=pattern.family?allPatterns().filter(item=>item.family===pattern.family && item.id!==pattern.id && !isArchived('patterns',item.id)):[];
  const startingNeck=fitRevision?.changes.neckline || pattern.design?.neckline || 'Scoop';
  view.innerHTML = heading('3D Fitting Room','Choose a model and garment, preview your fit changes, then create an illustrated work order.') + `<div class="split"><section class="panel viewer fitting-viewer"><div class="fit-canvas"><canvas id="model" tabindex="0" role="img" aria-label="Rotatable three-dimensional garment preview. Use left and right keys to turn the garment."></canvas><div id="fit-handles" hidden></div></div><div class="viewer-footer"><span class="muted">Drag or use left and right keys to rotate</span><button class="secondary" id="reset-view">Front view</button></div>    <div class="fit-preview-controls">
      <label class="field">Movement<select id="fit-pose">${Object.entries(fabricFit.poses).map(([key,value])=>option(key,value.name,'stand')).join('')}</select></label>
      <label class="fit-map-toggle"><input type="checkbox" id="fit-map" checked> Show tightness</label>
      <label class="field">Sculpt with handles<select id="fit-handle-group"><option value="">Off</option></select></label><button type="button" class="secondary" id="fit-undo" disabled>Undo drag</button>
      <p id="fit-handle-help" class="fit-handle-help" hidden>Drag horizontally for width or vertically for length. Arrow keys adjust a focused handle. Use Shift for larger steps.</p>
      <div id="fit-legend"><div class="fit-legend-gradient" aria-hidden="true"></div><div class="fit-legend-labels"><span>Ease</span><span>Snug</span><span>Restricted</span></div></div>
      <p id="fit-reading" class="fit-reading" aria-live="polite"></p>
      ${modelType==='trousers'?'<div class="seat-fit"><button type="button" class="secondary" id="add-seat-ease">Add sitting ease</button><p id="seat-fit-hint" class="fit-reading"></p></div>':''}
    </div>
</section><section class="panel fitting-controls"><h2>Fit adjustments</h2><form id="fitting-form">
    <label class="field">3D model<select name="model">${modelOptions(fitModel)}</select></label>
    <p class="model-link"><a href="#models">Open Model Library</a></p>
    <label class="field">Garment<select name="pattern">${options(fitPattern,true)}</select></label>
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
    ${sleeveEligible?`<label class="field">Neckline style<select name="neckline">${studioDesign.necklines.map(name=>option(name,name,startingNeck)).join('')}</select></label>`:''}
    ${sleeveEligible?`<label class="sleeve-choice"><input name="sleeves" type="checkbox" ${hasSleeves(pattern)?'checked':''}> Show sleeves and sleeve adjustments</label>`:''}
    ${pattern.revision?`<p class="muted fit-baseline">Changes are measured from revision ${pattern.revision}. Saving creates a new revision.</p>`:''}
    <div id="fit-sliders"></div>
    <p class="muted fit-baseline">The map estimates how much each area will resist movement. Presets are illustrative. Check fit and fabric stretch on a sample before cutting.</p><fieldset class="wo-path"><legend>Create work order</legend>
      <label class="field">Tailoring target<select name="tailorTarget"><option value="">Current fit as a new revision</option>${siblings.map(item=>option(item.id,'Saved revision '+item.revision)).join('')}</select></label>
      ${pattern.revision?`<p class="muted">Source garment is revision ${pattern.revision}. Choose a saved revision to use its recorded settings as the tailoring target.</p>`:''}
      <p class="muted">Make a new garment uses the fit shown above and creates a separate design.</p>
      <div class="actions tight"><button name="workType" value="tailor">Tailor between revisions</button><button class="secondary" name="workType" value="make">Make a new garment</button><button type="reset" class="secondary">Reset changes</button></div>
    </fieldset></form></section></div><section id="fit-guide" class="panel instructions" hidden></section>`;
  const form = document.querySelector('#fitting-form');
  const canvas = document.querySelector('#model');
  const fitGuide = document.querySelector('#fit-guide');
  const sliders = document.querySelector('#fit-sliders');
  let angle = 0;
  let pointer;
  let pose={...fabricFit.poses.stand};
  let animation=0;
  const poseField=document.querySelector('#fit-pose');
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
  const sleeves = () => form.elements.namedItem('sleeves')?.checked || false;
  const keys = () => garmentFit.keys(modelType,sleeves());
  const changes = () => Object.fromEntries(keys().map(key=>[key,Number(form.elements.namedItem(key)?.value || 0)]));
  const adjustments = () => {
    const result = {hasSleeves:sleeves(),neckline:neckline()};
    for (const [key,n] of Object.entries(changes())) result[key] = (fitRevision?.changes[key] || 0)+n;
    return result;
  };
  const body = () => getModel(fitModel);
  function drawControls(values={}) {
    sliders.innerHTML = keys().map(key=>{
      const [defaultLabel,max,minus,plus] = garmentFit.fields[key];
      const label=key==='neckDepth'?`${neckline()} depth`:key==='neckWidth'?`${neckline()} width`:defaultLabel;
      const n = values[key] || 0;
      return `<label class="field adjustment"><span>${label} <output id="${key}-value">${adjustmentText(n)}</output></span><input name="${key}" type="range" min="-${max}" max="${max}" step="0.5" value="${n}"><span class="adjustment-ends"><span>${minus}</span><span>${plus}</span></span></label>`;
    }).join('');
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
  const seatControls={waist:['waist'],hip:['hip'],thigh:['thigh'],knee:['knee','kneeFlex'],
    leg:['leg'],rise:['rise'],backRise:['backRise'],crotch:['crotch']};
  if (easeButton) easeButton.onclick=()=>{
    const values=adjustments();
    const seated=fabricFit.poses.sit;
    const estimate=()=>fabricFit.estimate(pattern,modelType,body(),values,seated,material());
    const draft=changes();
    for (const [region,controls] of Object.entries(seatControls)) {
      const details=estimate()[region];
      const ordered=region==='knee' && details.length>details.cross?controls.slice().reverse():controls;
      for (const key of ordered) {
        const input=form.elements.namedItem(key);
        // Crosswise and lengthwise room can be solved independently.
        const component=key==='knee'?'cross':key==='kneeFlex'?'length':null;
        const needsRoom=current=>component?current[component]>0:current.level>.24;
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
    if (seatHint) seatHint.textContent=peak.level>.26 && pose.sit>.6
      ? `Check ${seatControls[Object.keys(regions).find(key=>regions[key]===peak)].map(key=>garmentFit.fields[key][0].toLowerCase()).join(' and ')}.`
      : 'Adds room where the seated fit needs it using the selected fabric.';
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
  fitCleanup = () => {size.disconnect();cancelAnimationFrame(animation);};
  mapField.addEventListener('change',()=>{
    document.querySelector('#fit-legend').hidden=!mapField.checked;
    draw();
  });
  poseField.addEventListener('change',()=>{
    cancelAnimationFrame(animation);
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
    if (['sleeves','neckline'].includes(event.target.name)) {
      drawControls(changes());
      if (event.target.name==='sleeves') refreshGroups();
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
      form.elements.namedItem('sleeves').checked = hasSleeves(pattern);
      form.elements.namedItem('neckline').value=startingNeck;
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
    fittingDraft={garment:pattern,...kit,summary,modelId:targetBody.id,modelMeasurements,changes:targetChanges,fabric,make,savedTarget,route,materials:kit.fabric,measurements};
    fitGuide.hidden = false;
    fitGuide.innerHTML = `<h2>${make?'Construction work order':'Tailoring work order'}</h2><p class="tight"><strong>${escape(route)}</strong></p><p class="tight">${escape(pattern.name)} · ${escape(targetBody.name)} · ${escape(fabric.name)} (${fabric.gsm} g/m²) · ${escape(summary)}</p>${fitMeasurementTable(measurements)}<p class="tight"><strong>Materials</strong> ${escape(kit.fabric)}</p><p class="tight"><strong>Tools and materials</strong> ${escape(tools)}</p>${sewingVisuals.tools(tools)}${sewingVisuals.steps(steps,visuals)}<form id="save-fit-form">${savedTarget?'':`<label class="field">Garment name<input name="garmentName" required maxlength="100" value="${escape(make?pattern.name+' new':pattern.family?pattern.name:pattern.name+' fitted')}" ${!make&&pattern.family?'readonly':''}></label>`}<button>${savedTarget?'Save tailoring work order':make?'Save new garment and work order':'Save revision and create work order'}</button></form>`;
    fitGuide.querySelector('#save-fit-form').addEventListener('submit',event=>{
      event.preventDefault();
      const name = savedTarget?.name || new FormData(event.target).get('garmentName').trim();
      if (!name) {notify('Enter a garment name.');return;}
      saveFit(name);
    });
    fitGuide.scrollIntoView({block:'nearest'});
  });
  draw();
  reportFit();
}
function saveFit(name) {
  if (!fittingDraft) return;
  const {garment,tools,steps,visuals,summary,modelId,modelMeasurements,changes,fabric,make,savedTarget,route,materials,measurements} = fittingDraft;
  const notes=[route,getModel(modelId).name,fabric.name,fabric.gsm+' g/m²',summary].filter(Boolean).join(' · ');
  if (savedTarget) {
    state.orders.unshift({id:'WO-'+String(state.next++).padStart(3,'0'),title:garment.name+' · Revision '+garment.revision+' to '+savedTarget.revision,
      pattern:savedTarget.id,kind:'Tailoring',before:garment.id,due:'',notes,done:[],snapshot:{name:savedTarget.name,tools,steps,visuals,fabric:materials,measurements}});
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
    model:base.id,color:garment.color,design:garment.design,reference:garment.reference,fabric:materials,
    tools,steps,visuals,rebuildSteps,rebuildVisuals,measurements,
    buildFabric:make?materials:garment.buildFabric || garment.fabric,buildTools:make?tools:[garment.buildTools || garment.tools,tools].filter(Boolean).join(' · '),
    fit:{modelId,modelMeasurements,changes,fabric,source:garment.id}};
  state.custom.push(plan);
  state.orders.unshift({id:'WO-'+String(state.next++).padStart(3,'0'),title:name+' · Revision '+revision,pattern:id,kind:make?'Construction':'Tailoring',before:make?undefined:garment.id,
    due:'',notes,done:[]});
  save('Revision and work order saved');
  showNewOrders();
  fittingDraft = undefined;
  fitPattern = id;
  fitRevision = plan.fit;
  location.hash = 'orders';
}

let designDraft = {...studioDesign.defaults(),name:'',reference:'',fitModelId:'studio-form'};

function designStudio() {
  view.innerHTML = heading('Design Studio','Combine garment details into a new design, or use a photo to suggest a starting shape.')+`
    <div class="split"><div class="panel viewer fitting-viewer">
      <canvas id="design-model" role="img" aria-label="Three-dimensional design preview"></canvas>
      <div class="viewer-footer"><label class="field design-rotate">Rotate preview <input type="range" id="design-angle" min="-180" max="180" value="-21" aria-label="Rotate preview"></label></div>
    </div><div class="panel"><form id="design-form">
      <label class="field">Fit to model<select name="fitModelId">${modelOptions(designDraft.fitModelId)}</select></label>
      <p class="model-link"><a href="#models">Open Model Library</a></p><p id="design-measurements" class="fit-baseline"></p>
      <details class="design-options"><summary>Start from a garment photo</summary>
        <label class="field tight">Upload a front-view photo<input type="file" id="design-photo" accept="image/jpeg,image/png,image/webp"></label>
        <p>Lay the garment flat against a plain, contrasting background and include all its edges. Photo analysis runs in your browser.</p>
        <p id="photo-status" class="tight" role="status"></p><div id="design-reference"></div>
      </details>
      <label class="field">Garment name<input name="name" required maxlength="100" value="${escape(designDraft.name)}" placeholder="e.g. Plum bell-sleeve dress"></label>
      <label class="field">Garment type<select name="model">${Object.entries(studioDesign.silhouettes).map(([id,entry])=>option(id,entry.label,designDraft.model)).join('')}</select></label>
      <div id="design-settings"></div>
      <div class="actions"><button name="save" value="library">Save to Pattern Library</button><button class="secondary" name="save" value="order">Save and create work order</button></div>
    </form></div></div>
    <details class="panel instructions" id="design-guide"><summary>Preview illustrated construction plan</summary><div id="design-guide-content"></div></details>`;
  const form = document.querySelector('#design-form');
  const canvas = document.querySelector('#design-model');
  const angle = document.querySelector('#design-angle');
  const settings = document.querySelector('#design-settings');
  const guide = document.querySelector('#design-guide');
  const photo = document.querySelector('#design-photo');
  const photoStatus = document.querySelector('#photo-status');
  const reference = document.querySelector('#design-reference');
  const measurementSummary = document.querySelector('#design-measurements');
  const body = () => getModel(designDraft.fitModelId);
  function showMeasurements() {
    const model = body();
    const target = studioDesign.isBodice(designDraft.model)?['bust',model.bust]:['hip',model.hip];
    measurementSummary.textContent = `Bust ${model.bust} cm · Waist ${model.waist} cm · Hip ${model.hip} cm · Shoulders ${model.shoulder} cm. Finished ${target[0]} target ${target[1]+Number(designDraft.ease)} cm.`;
  }
  const select = (key,label,items) => `<label class="field">${label}<select name="${key}">${items.map(item=>option(item,item,designDraft[key])).join('')}</select></label>`;
  function settingsForModel(open=false) {
    const spec = studioDesign.silhouettes[designDraft.model];
    settings.innerHTML = `<div class="fields">${select('cut','Silhouette',spec.cuts)}${select('length','Finished length',spec.lengths)}</div>
      ${studioDesign.isBodice(designDraft.model)?`<div class="fields">${select('neckline','Neckline',studioDesign.necklines)}${select('sleeve','Sleeves',studioDesign.sleeves)}</div>`:''}
      <div class="fields"><label class="field">Main color<input type="color" name="primary" value="${color(designDraft.primary)}"></label><label class="field">Fabric<select name="fabric">${fabricOptions(designDraft.fabric)}</select></label></div>
      <details class="design-options"${open?' open':''}><summary>Finishes, pockets and fit</summary>
        <div class="fields tight">${select('closure','Closure',studioDesign.closureChoices(designDraft.model))}${select('pocket','Pockets',studioDesign.pocketChoices(designDraft.model))}
        ${select('finish','Hem finish',studioDesign.finishes)}${select('tone','Color layout',studioDesign.tones)}
        <label class="field">Contrast color<input type="color" name="accent" value="${color(designDraft.accent)}"></label>
        <label class="field">Target wearing ease (cm)<input type="number" data-length-input name="ease" min="0" max="24" step="1" value="${Number(designDraft.ease)}" required></label></div>
      </details>`;
  }
  function refreshReference() {
    reference.innerHTML = designDraft.reference ? `<figure class="design-reference tight"><img src="${escape(designDraft.reference)}" alt="Your reference garment photo"><figcaption>Reference photo</figcaption></figure><button type="button" class="secondary tight" id="remove-reference">Remove photo</button>` : '';
    reference.querySelector('button')?.addEventListener('click',()=>{
      designDraft.reference='';
      photo.value='';
      photoStatus.textContent='';
      refreshReference();
    });
  }
  function preview() {
    if (!canvas.isConnected) return;
    const ratio = Math.min(window.devicePixelRatio||1,2);
    canvas.width = Math.round(canvas.clientWidth*ratio);
    canvas.height = Math.round(canvas.clientHeight*ratio);
    const item = {model:designDraft.model,design:designDraft,color:designDraft.primary};
    drawModel(canvas,item,Number(angle.value)*Math.PI/180,{hasSleeves:studioDesign.isSleeved(designDraft)},body(),false,{pose:fabricFit.poses.stand,show:false,material:getFabric(designDraft.fabric),redraw:preview});
  }
  function updateGuide() {
    if (!guide.open) return;
    const item = studioDesign.make(designDraft,designDraft.name,body());
    guide.querySelector('#design-guide-content').innerHTML = `<p class="tight"><strong>Fabric</strong> ${escape(item.fabric)}</p><p class="tight"><strong>Tools and materials</strong> ${escape(item.tools)}</p>${sewingVisuals.tools(item.tools)}${sewingVisuals.steps(item.steps,item.visuals)}`;
  }
  function changeModel(model) {
    form.elements.namedItem('model').value = model;
    designDraft = {...studioDesign.defaults(model),name:designDraft.name,reference:designDraft.reference,fitModelId:designDraft.fitModelId,primary:designDraft.primary,accent:designDraft.accent};
    settingsForModel();
  }
  settingsForModel();
  refreshReference();
  showMeasurements();
  const size = new ResizeObserver(preview);
  size.observe(canvas);
  fitCleanup = () => size.disconnect();
  angle.addEventListener('input',preview);
  guide.addEventListener('toggle',updateGuide);
  form.addEventListener('input',event=>{
    const field = event.target;
    if (!field.name || field.type==='file') return;
    if (field.name==='model') changeModel(field.value);
    else designDraft[field.name] = field.name==='ease'?(studioUnits.lengthValue(field)??0):field.type==='number'?Number(field.value):field.value;
    showMeasurements();
    preview();
    updateGuide();
  });
  photo.addEventListener('change',async ()=>{
    const file = photo.files[0];
    if (!file) return;
    if (file.size>15000000 || !['image/jpeg','image/png','image/webp'].includes(file.type)) {
      photoStatus.textContent='Choose a JPG, PNG or WebP photo under 15 MB.';
      photo.value='';
      return;
    }
    photoStatus.textContent='Reading silhouette and colors…';
    try {
      const result = await garmentPhoto.read(file);
      if (!photo.isConnected || photo.files[0]!==file) return;
      if (result.model) changeModel(result.model);
      if (result.cut) designDraft.cut=result.cut;
      if (result.sleeve && studioDesign.isBodice(designDraft.model)) designDraft.sleeve=result.sleeve;
      if (result.primary) designDraft.primary=result.primary;
      designDraft.reference=result.thumbnail;
      settingsForModel();
      refreshReference();
      showMeasurements();
      photoStatus.textContent=result.model
        ? 'Starting shape suggested. Review the garment type and silhouette, then choose the neckline, fabric, and closure yourself.'
        : 'Photo added. The outline was unclear, so choose a garment type and silhouette yourself.';
      preview();
      updateGuide();
    } catch {
      if (photo.isConnected) photoStatus.textContent='This image couldn’t be read. Try another JPG, PNG or WebP.';
    }
  });
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const name = form.elements.namedItem('name').value.trim();
    if (!name) {notify('Enter a garment name.');return;}
    const {name:_,reference,...design} = designDraft;
    const item = {id:'design-'+createId(),...studioDesign.make(design,name,body()),reference};
    state.custom.push(item);
    showArchivedPatterns=false;
    if (event.submitter?.value==='order') state.orders.unshift({
      id:'WO-'+String(state.next++).padStart(3,'0'),title:name,kind:'Construction',pattern:item.id,due:'',notes:'Fitted to '+body().name+'.'+(reference?' Check the design details against the reference photo.':''),done:[]
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
    tools:'Brother CP2160F, foot controller, SA156 Class 15 bobbin, all-purpose polyester thread, universal 80/12 needle, zigzag foot J, and two layers of woven cotton scrap.',
    steps:[
      'Switch off the machine. Raise the needle by turning the handwheel toward you. Insert the needle with its flat side to the back, push it up to the stop, and tighten the clamp.',
      'Wind the bobbin using the numbered winding path and the cutter on the bobbin-winder seat. Switch off the machine before inserting the wound bobbin into the top-loading compartment. Follow the arrows to guide the thread through the slot and cutter, then snap the cover back on.',
      'Raise the presser foot and needle before threading the top. With the power off, follow the numbered path on the machine, catch the take-up lever, and pass the thread behind the needle-bar guide. Thread the needle from front to back and leave about 10 cm of thread under foot J.',
      'Turn on the machine. Use the stitch selection keys to display 01 for a centered straight stitch. The LCD shows foot J. Start with the default 2.5 mm stitch length and test on layered scraps. With this straight stitch, the width control moves the needle sideways.',
      'Lower the presser foot and start gently with the foot controller. Hold the reverse stitch button briefly at the start and end to secure the seam. Let the feed dogs move the fabric while you guide it.',
      'If the machine skips stitches or loops thread, raise the foot and rethread the top, check the bobbin against the arrows, and verify the needle is seated fully. Test again before adjusting tension.'
    ]
  },
  {
    title:'Measure and cut fabric',
    tools:'Fabric cutting board, ruler, fabric chalk, pins or pattern weights, fabric shears or a rotary cutter with a compatible cutting mat, and an iron.',
    steps:[
      'Prewash and dry washable fabric the way you plan to care for the finished item. Press it flat before measuring.',
      'Find the selvage, the finished edge of woven fabric. For pieces with a grainline, measure from both ends of the grainline to the selvage and adjust until the distances match.',
      'Lay the fabric flat on the cutting board. Mark the cutting lines and check whether seam allowance is already included. Secure any paper pattern with pins or weights.',
      'Cut along the marks with fabric shears. If the board is rated for rotary blades, use a ruler and rotary cutter on the mat, cutting away from yourself and closing the blade after each cut.',
      'Mark matching points and seam lines where needed. Keep pieces together and label them before moving to the machine.'
    ]
  },
  {
    title:'Sew and press a straight seam',
    tools:'Two cotton scraps, ruler or seam guide, pins or clips, machine, thread, and iron.',
    steps:[
      'Put the right sides of the fabric together and align the raw edges. Pin or clip the layers so they stay aligned.',
      'Line the fabric edge up with the seam allowance mark on the needle plate. Practice with a 1 cm allowance, or use the amount specified by your project.',
      'Lower the presser foot, backstitch, and follow the guide. Remove pins before the needle reaches them. Backstitch again at the end.',
      'Press the seam as stitched first, then press the allowances open or to one side, as the project calls for. Finish raw edges with a zigzag stitch if the woven fabric frays.'
    ]
  },
  {
    title:'Practice project — fabric coaster',
    tools:'Two 12 × 12 cm squares of medium-weight woven cotton, machine, matching thread, ruler, clips, shears, a blunt point turner, and iron.',
    steps:[
      'Measure and cut two squares. Put them right sides together and mark a 5 cm turning gap in the middle of one side.',
      'Sew around the squares with a 1 cm seam allowance, leaving the gap open. Backstitch at both ends of the gap. At each corner, stop with the needle down, raise the foot, pivot, lower the foot and continue.',
      'Trim the corners diagonally without cutting through the stitches. Turn the coaster through the gap and gently shape the corners with a blunt point turner.',
      'Press the coaster flat with the gap edges folded inward by 1 cm. Topstitch 2–3 mm from the edge all the way around to close the gap.'
    ]
  }
];

function basics() {
  view.innerHTML = heading('Sewing Basics','Set up your machine, cut fabric accurately, and practice on a simple coaster.') +
    `<p class="basics-intro">Machine setup is written for your Brother CP2160F. Start with woven cotton scraps and stitch 01 to practice a centered straight seam.</p>
    <div class="lessons">${basicLessons.map((lesson,index) => `<details class="panel lesson"${index===0?' open':''}>
      <summary><h2>${escape(lesson.title)}</h2></summary>
      <p class="tight"><strong>Tools and materials</strong> ${escape(lesson.tools)}</p>
      ${sewingVisuals.tools(lesson.tools)}${sewingVisuals.steps(lesson.steps,sewingVisuals.basics[index])}
    </details>`).join('')}</div>
    <p class="basics-resources"><a href="https://support.brother.com/g/b/manualtop.aspx?c=us&amp;lang=en&amp;prod=hf_cp2160feus" target="_blank" rel="noopener">Brother CP2160F manuals, setup diagrams and stitch chart</a></p>`;
}

let fitCleanup;
function render() {
  fitCleanup?.();
  fitCleanup = undefined;
  const route = location.hash.slice(1);
  const page = Object.hasOwn(titles,route)?route:'overview';
  document.querySelector('#page-name').textContent = titles[page];
  for (const link of document.querySelectorAll('nav a')) {
    if (link.hash === '#'+page) link.setAttribute('aria-current','page');
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
    case 'new': newOrder(id); break;
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
      designDraft = {...source.design,fitModelId:source.fit?.modelId || source.design.fitModelId || 'studio-form',name:source.name+' variation',reference:source.reference || ''};
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
