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
const previewDialog = document.querySelector('#garment-preview-dialog');
const notice = document.querySelector('#notice');
studioUnits.watch(document.querySelector('#length-units'),view,modal,previewDialog);
const titles = {overview:'Overview',design:'New custom piece',brand:'Brand Kit',library:'Pattern Library',fabrics:'Fabric Library',orders:'Work Orders',fitting:'Fit and revise garment',models:'Model Library',basics:'Sewing Basics'};
const features = [['design','✧','Create an original garment or start from a reference photo.'],['library','▤','Browse patterns, try on garments in 3D, and revisit saved revisions.']];
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
const getFabric=name=>state.fabrics.find(item=>item.name===name) ||
  (Object.hasOwn(fabricFit.fabrics,name)?fabricFit.fabrics[name]:fabricFit.fabrics['Cotton poplin']);
const fabricOptions=selected=>Object.keys(fabricFit.materialGroups).map(category=>{
  const group=allFabrics().filter(item=>item.category===category && (item.name===selected||!isArchived('fabrics',item.name)));
  return group.length?`<optgroup label="${escape(category)}">${group.map(item=>option(item.name,item.name,selected)).join('')}</optgroup>`:'';
}).join('');
const fitBendPresets=[['.2','Fluid'],['.42','Balanced'],['.65','Structured']];
const stretchPercent=value=>Math.round(value*1000)/10;
function fitBendOptions(bend) {
  const matches=fitBendPresets.some(([value])=>Number(value)===bend);
  const category=bend<.31?'Fluid':bend<.55?'Balanced':'Structured';
  const choices=matches?fitBendPresets:[[String(bend),`Fabric setting (${category.toLowerCase()})`],...fitBendPresets];
  const selected=choices.find(([value])=>Number(value)===bend)[0];
  return choices.map(([value,label])=>option(value,label,selected)).join('');
}
function fitFabricValues(name,settings) {
  const preset=getFabric(name);
  const baseline=fabricFit.fabrics['Cotton poplin'];
  const limit=(key,min,max)=>{
    const estimate=Number.isFinite(preset[key])?preset[key]:baseline[key];
    return fabricFit.clamp(Number.isFinite(settings?.[key])?settings[key]:estimate,min,max);
  };
  return {power:preset.power??baseline.power,gsm:limit('gsm',45,900),cross:limit('cross',0,1),length:limit('length',0,1),bend:limit('bend',0,1)};
}
function fitFabricFields(name,settings,{open=false}={}) {
  const {gsm,cross,length,bend}=fitFabricValues(name,settings);
  const found=allFabrics().some(item=>item.name===name && Object.hasOwn(fabricFit.materialGroups,item.category));
  const stored=name&&!found?option(name,name,name):'';
  return `<div class="fields">
    <label class="field">Fabric<select name="fabric">${stored}${fabricOptions(name)}</select></label>
    <label class="field">Fabric weight (g/m²)<input name="fabricWeight" type="number" value="${gsm}" min="45" max="900" step="1" required></label>
  </div>
  <details class="design-options" data-fit-fabric-details${open?' open':''}><summary>Fabric stretch and drape</summary>
    <div class="fields tight">
      <label class="field">Crosswise stretch (%)<input type="number" name="fabricCross" min="0" max="100" step="0.1" value="${stretchPercent(cross)}" required></label>
      <label class="field">Lengthwise stretch (%)<input type="number" name="fabricLength" min="0" max="100" step="0.1" value="${stretchPercent(length)}" required></label>
    </div>
    <label class="field">Drape firmness<select name="fabricBend">${fitBendOptions(bend)}</select></label>
    <p>Set stretch to the amount you can pull a swatch before you feel firm resistance.</p>
  </details>`;
}
function readFitFabric(form,name=form.elements.namedItem('fabric').value) {
  const field=key=>form.elements.namedItem(key);
  const stretch=key=>Number((field(key).valueAsNumber/100).toFixed(3));
  return fitFabricValues(name,{gsm:field('fabricWeight').valueAsNumber,cross:stretch('fabricCross'),
    length:stretch('fabricLength'),bend:field('fabricBend').value===''?NaN:Number(field('fabricBend').value)});
}
function setFitFabric(form,settings) {
  const field=key=>form.elements.namedItem(key);
  const {gsm,cross,length,bend}=fitFabricValues(field('fabric').value,settings);
  field('fabricWeight').value=gsm;
  field('fabricCross').value=stretchPercent(cross);
  field('fabricLength').value=stretchPercent(length);
  field('fabricBend').innerHTML=fitBendOptions(bend);
}
function revealInvalidFitFabric(event) {
  const details=event.target.closest('[data-fit-fabric-details]');
  if (details) details.open=true;
}
function patternPreviewFabric(pattern) {
  const revision=pattern.fit?.fabric;
  const fabricName=revision?.name || pattern.design?.fabric;
  return fabricName?{fabricName,material:fitFabricValues(fabricName,revision||pattern.design?.fabricSettings)}:{};
}
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
const hasSleeves = pattern => pattern.fit?.changes?.hasSleeves ?? Boolean(pattern.sleeves);
function snapshotModelMeasurements(body) {
  const keys=[...Object.keys(sewingModels.dimensions),'name','profile','cup','braSize','braSystem','skin','scan'];
  return Object.fromEntries(keys.filter(key=>Object.hasOwn(body,key)).map(key=>[key,body[key]]));
}
function garmentReference(pattern,fallbackId) {
  const model=getModel(pattern.fit?.modelId || pattern.design?.fitModelId || fallbackId);
  const reference=pattern.fit?.modelMeasurements || pattern.fitReference;
  if (reference?.profile) return {id:model.id,name:model.name,...reference};
  if (!reference && pattern.design && pattern.measurements?.make && pattern.measurements.rows) {
    const values=new Map(pattern.measurements.rows);
    const entries=Object.entries(sewingModels.dimensions).flatMap(([key,[label]])=>{
      const raw=values.get(label);
      const value=typeof raw==='string' && raw.endsWith(' cm')?Number(raw.slice(0,-3)):0;
      return Number.isFinite(value)&&value>0?[[key,value]]:[];
    });
    return {...model,...Object.fromEntries(entries)};
  }
  return {...model,...reference};
}
function garmentPreviewChanges(pattern,size) {
  const changes={...pattern.design?.fitAdjustments,...pattern.fit?.changes,hasSleeves:hasSleeves(pattern)};
  const type=pattern.design?.model || basePattern(pattern).id;
  return garmentFit.applyGrade(changes,type,size);
}
function shoulderSettings(pattern) {
  const design=pattern.design||{};
  const fit=pattern.fit?.changes||{};
  const model=design.model || basePattern(pattern).id;
  const options=studioDesign.supportChoices(model);
  const requested=fit.support || studioDesign.selectedSupport({...design,model});
  const support=options.includes(requested)?requested:options[0];
  return {support,straplessSupport:studioDesign.selectedStraplessSupport({...design,model,straplessSupport:fit.straplessSupport??design.straplessSupport}),
    ...studioDesign.strapShape({...design,...fit,support}),
    strapWidth:support==='Strapless'?undefined:fit.strapWidth??design.strapWidth??studioDesign.supportWidth(support),
    strapPlacement:fit.strapPlacement??design.strapPlacement??0,
    sleeveStyle:fit.sleeveStyle || (design.sleeve==='Sleeveless'?null:design.sleeve) || 'Short'};
}
function designForFit(design,changes) {
  if (!design) return design;
  const fitAdjustments=Object.fromEntries(Object.entries(changes).filter(([key,value])=>garmentFit.fields[key]&&Number.isFinite(value)&&value!==0));
  const fitted={...design,fitAdjustments,neckline:changes.neckline??design.neckline};
  if (!changes.support) return fitted;
  const shape=studioDesign.strapShape({...design,...changes});
  for (const key of Object.keys(shape)) delete fitted[key];
  return {...fitted,support:changes.support,strapWidth:changes.strapWidth,strapPlacement:changes.strapPlacement,
    straplessSupport:changes.support==='Strapless'?studioDesign.selectedStraplessSupport({...design,straplessSupport:changes.straplessSupport??design.straplessSupport}):undefined,
    ...(studioDesign.supportsStrapShape(changes.support)?shape:{}),
    sleeve:changes.support!=='Strapless'&&changes.hasSleeves?changes.sleeveStyle||design.sleeve:'Sleeveless'};
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
      <div class="actions">${showArchivedFabrics?'':`<button data-action="fit-fabric" data-id="${escape(item.name)}">Try this fabric on a garment</button>`}
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
function previewTrigger(pattern,art,attributes='',label='Preview in 3D') {
  return `<button type="button" class="garment-preview-trigger" data-action="preview-garment" data-id="${escape(pattern.id)}" ${attributes}
    aria-label="${escape(label+' · '+pattern.name)}">${art}<span class="garment-preview-label">${escape(label)}</span></button>`;
}
function library() {
  view.innerHTML = heading('Pattern Library','Click a garment to preview it on a model, browse construction guides, or start a new design.') + `<div class="toolbar"><label class="field">Search patterns<input id="pattern-search" type="search" placeholder="Search by style or cut"></label><label class="field">Garment type<select id="pattern-filter"><option value="">All garments</option>${[...new Set(patterns.map(p=>p.type))].map(type=>option(type,type)).join('')}</select></label><label class="field">Collection<select id="pattern-category"><option value="">All collections</option></select></label><button class="secondary" data-action="toggle-pattern-archive">${showArchivedPatterns?'Show active':'Show archive'}</button><a class="button" href="#design">＋ New custom piece</a><button class="secondary" data-action="add-pattern">Add existing pattern</button></div><p class="muted tight" id="pattern-count"></p><div class="patterns" id="patterns"></div><button class="secondary tight" id="more-patterns" hidden>Show more garments</button>`;
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
    container.innerHTML = matches.length ? matches.slice(0,limit).map(p=>{
      const art=canTryOn(p)?previewTrigger(p,`<canvas width="360" height="155" data-pattern="${escape(p.id)}" aria-hidden="true"></canvas>`)
        :`<span class="pattern-source">${escape(p.external.publisher)}<small>Free pattern</small></span>`;
      return `<article class="card pattern"><div class="pattern-art">${art}</div><div class="pattern-body"><span class="badge">${escape(p.type)} · ${escape(patternCategory(p))}</span><h3 class="tight">${escape(p.name)}</h3><p>${escape(p.cut)} · ${p.revision?'Revision '+p.revision:escape(p.level)}</p><div class="actions"><button class="secondary" data-action="pattern" data-id="${escape(p.id)}">${p.family?'View guide and revisions':'View construction guide'}</button>${canTryOn(p)&&!p.external?`<button class="secondary" data-action="fit" data-id="${escape(p.id)}">Fit and revise</button>`:''}</div></div></article>`;
    }).join('') : '<p>No styles match your search.</p>';
    for (const canvas of container.querySelectorAll('canvas')) {
      const item=getPattern(canvas.dataset.pattern);
      drawModel(canvas,item,-.35,garmentPreviewChanges(item),garmentReference(item),true,
        {pose:fabricFit.poses.stand,show:false,...patternPreviewFabric(item),redraw:results});
    }
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

function orderPreviewPattern(order,frame) {
  const item=getPattern(order.pattern);
  if (frame==='before') return getPattern(order.before || item?.fit?.source);
  const snapshot=order.snapshot;
  return item?{...item,...snapshot}:snapshot?.id?snapshot:null;
}
function orderPreview(order) {
  const after=orderPreviewPattern(order,'after');
  if (!after) return '';
  if (!canTryOn(after)) return `<div class="wo-preview wo-reference"><span>${escape(after.cut)}</span></div>`;
  const before=orderKind(order)==='Tailoring'?orderPreviewPattern(order,'before'):null;
  const frames=[...(before && canTryOn(before)?[[before,'before','Before']]:[]),[after,'after',before?'After':'Garment preview']];
  return `<div class="wo-preview">${frames.map(([pattern,frame,label])=>{
    const art=`<canvas width="150" height="130" data-order-preview="${escape(pattern.id)}" aria-hidden="true"></canvas>`;
    const attributes=`data-order-id="${escape(order.id)}" data-preview-frame="${frame}"`;
    return `<figure>${previewTrigger(pattern,art,attributes,'Preview in 3D')}<figcaption>${label}${frame==='after'&&order.size?' · '+escape(order.size):''}</figcaption></figure>`;
  }).join('')}</div>`;
}

function drawOrderPreviews(root) {
  for (const canvas of root.querySelectorAll('[data-order-preview]')) {
    const {orderId,previewFrame}=canvas.closest('button').dataset;
    const order=state.orders.find(item=>item.id===orderId);
    if (!order) continue;
    const item=orderPreviewPattern(order,previewFrame);
    const size=previewFrame==='after'?order.size:undefined;
    drawModel(canvas,item,-.27,garmentPreviewChanges(item,size),garmentReference(item,order.plan?.modelId),true,
      {pose:fabricFit.poses.stand,show:false,...patternPreviewFabric(item),redraw:()=>drawOrderPreviews(root)});
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
let previewCleanup;
previewDialog.addEventListener('close',()=>{
  if (previewDialog.open) return;
  previewCleanup?.();
  previewCleanup=undefined;
  previewDialog.replaceChildren();
});
function showGarmentPreview(pattern,{size,modelId}={}) {
  if (!pattern || !canTryOn(pattern)) return;
  previewCleanup?.();
  const originalBody=garmentReference(pattern,modelId);
  const originalSize=garmentFit.normalizeSize(size);
  const originalModel=originalBody.id;
  const startModel=modelId || originalModel;
  const garmentType=pattern.design?.model || basePattern(pattern).id;
  const materialName=/denim/i.test(pattern.fabric)?'Rigid denim':garmentType==='trousers'?'Medium-weight twill':'Cotton poplin';
  const fabric={fabricName:materialName,material:fitFabricValues(materialName),...patternPreviewFabric(pattern)};
  previewDialog.innerHTML=`<div class="dialog-head"><div><h2 id="preview-title">${escape(pattern.name)}</h2>
      <p class="preview-caption">View only${pattern.revision?' · Revision '+escape(pattern.revision):''}</p></div>
    <button class="secondary close" type="button" data-action="close-garment-preview" aria-label="Close 3D preview">×</button></div>
    <div class="preview-layout"><section class="panel viewer preview-stage" aria-label="Garment model">
      <canvas id="preview-canvas" tabindex="0" role="img" aria-label="3D garment preview. Drag or use the arrow keys to rotate and tilt."></canvas>
      <div class="preview-rotation-controls"><div class="fields preview-orientation">
        <label class="field">Rotate left or right<input type="range" id="preview-rotation" min="-180" max="180" step="1" value="0"></label>
        <label class="field">Tilt up or down<input type="range" id="preview-tilt" min="-70" max="70" step="1" value="0"></label>
      </div>
        <div class="actions preview-angles" role="group" aria-label="Preset views">
          <button type="button" class="secondary" data-preview-angle="0" aria-pressed="true">Front</button>
          <button type="button" class="secondary" data-preview-angle="90" aria-pressed="false">Side</button>
          <button type="button" class="secondary" data-preview-angle="180" aria-pressed="false">Back</button>
        </div>
      </div>
    </section><section class="preview-settings" aria-label="Try-on controls">
      <div class="preview-fit-fields">
        <label class="field">3D model<select id="preview-model">${modelOptions(startModel)}</select></label>
        <label class="field">Garment size<select id="preview-size" aria-describedby="preview-size-note">${garmentFit.sizes.map(value=>option(value,value===garmentFit.baseSize?'M · Saved fit':value,originalSize)).join('')}</select></label>
        <p id="preview-size-note" class="muted">${pattern.external?'Approximate publisher style and sizing. ':''}Sizes are relative to this garment’s base fit. Changing the model keeps the selected garment size.</p>
        <p class="preview-size-delta" id="preview-size-delta" aria-live="polite"></p>
        <p class="preview-fit-note muted" id="preview-fit-note" role="status" hidden></p>
      </div>
      ${fitAnalysisControls('preview','',{viewOnly:true})}
    </section></div>`;
  const canvas=previewDialog.querySelector('#preview-canvas');
  const modelField=previewDialog.querySelector('#preview-model');
  const sizeField=previewDialog.querySelector('#preview-size');
  const rotationField=previewDialog.querySelector('#preview-rotation');
  const tiltField=previewDialog.querySelector('#preview-tilt');
  const deltaLabel=previewDialog.querySelector('#preview-size-delta');
  const fitNote=previewDialog.querySelector('#preview-fit-note');
  const angles=previewDialog.querySelectorAll('[data-preview-angle]');
  let angle=0;
  let pitch=0;
  let pointer;
  let wearer=getModel(modelField.value);
  let garmentGrade,changes;
  function draw() {
    if (!previewDialog.open || !canvas.isConnected) return;
    const ratio=Math.min(window.devicePixelRatio||1,2);
    const width=Math.round(canvas.clientWidth*ratio),height=Math.round(canvas.clientHeight*ratio);
    if (!width || !height) return;
    if (canvas.width!==width) canvas.width=width;
    if (canvas.height!==height) canvas.height=height;
    drawModel(canvas,pattern,angle*Math.PI/180,changes,wearer,false,
      {...fabric,pose:analysis.pose(),show:false,pitch:pitch*Math.PI/180,garmentBody:originalBody,garmentGrade,tryOn:true,redraw:draw});
  }
  function selectSize() {
    const size=sizeField.value;
    garmentGrade=garmentFit.grade(garmentType,size,hasSleeves(pattern));
    changes=garmentPreviewChanges(pattern,size);
    const measured=[['bust','Chest / bust'],['waist','Waist'],['hip','Hip / seat']]
      .filter(([key])=>garmentGrade[key]).map(([key,label])=>label+' '+adjustmentText(garmentGrade[key]));
    deltaLabel.textContent=measured.length?measured.join(' · '):'Base garment measurements';
    studioUnits.refresh(deltaLabel);
    reportFit();
    draw();
  }
  function reportFit() {
    const upper=studioDesign.isBodice(garmentType);
    const ease=pattern.design?.ease ?? 5;
    const areas=[
      ...(upper?[['bust','chest / bust',ease]]:[]),
      ['waist','waist',upper?ease:2.7],
      ...(!upper || garmentType==='dress' || pattern.design?.length==='Low hip'?[['hip','hip / seat',ease]]:[])
    ];
    const tight=areas.filter(([key,,room])=>{
      if (!Number.isFinite(wearer[key]) || !Number.isFinite(originalBody[key])) return false;
      const available=originalBody[key]+room+(changes[key]||0);
      return wearer[key]>available*(1+fabric.material.cross)+1;
    }).map(([,label])=>label);
    fitNote.textContent=tight.length?'This size may be tight at the '+tight.join(', ')+'.':'';
    fitNote.hidden=!tight.length;
  }
  function rotate(value,tilt=pitch) {
    angle=((value+180)%360+360)%360-180;
    pitch=fabricFit.clamp(tilt,Number(tiltField.min),Number(tiltField.max));
    rotationField.value=angle===-180 && value>0?180:angle;
    tiltField.value=pitch;
    for (const button of angles) {
      const selected=Number(button.dataset.previewAngle);
      button.setAttribute('aria-pressed',String(pitch===0 && (angle===selected || Math.abs(angle)===180&&selected===180)));
    }
    draw();
  }
  const analysis=bindFitAnalysis('preview',{draw});
  const observer=new ResizeObserver(draw);
  modelField.addEventListener('change',()=>{
    wearer=getModel(modelField.value);
    reportFit();
    draw();
  });
  sizeField.addEventListener('change',selectSize);
  rotationField.addEventListener('input',()=>rotate(Number(rotationField.value)));
  tiltField.addEventListener('input',()=>rotate(angle,Number(tiltField.value)));
  for (const button of angles) {
    button.addEventListener('click',()=>rotate(Number(button.dataset.previewAngle),0));
  }
  canvas.addEventListener('pointerdown',event=>{
    if (!event.isPrimary || event.button!==0) return;
    pointer={id:event.pointerId,x:event.clientX,y:event.clientY};
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove',event=>{
    if (pointer?.id!==event.pointerId) return;
    rotate(angle+(event.clientX-pointer.x)*.55,pitch+(event.clientY-pointer.y)*.5);
    pointer.x=event.clientX;
    pointer.y=event.clientY;
  });
  canvas.addEventListener('lostpointercapture',()=>{pointer=undefined;});
  canvas.addEventListener('keydown',event=>{
    const yaw={ArrowLeft:-10,ArrowRight:10};
    const tilt={ArrowUp:10,ArrowDown:-10};
    if (!Object.hasOwn(yaw,event.key) && !Object.hasOwn(tilt,event.key)) return;
    event.preventDefault();
    rotate(angle+(yaw[event.key]||0),pitch+(tilt[event.key]||0));
  });
  previewCleanup=()=>{
    observer.disconnect();
    analysis.cleanup();
  };
  if (!previewDialog.open) previewDialog.showModal();
  selectSize();
  observer.observe(canvas);
}
const referenceLinks=pattern=>pattern?.external?`<div class="actions tight"><a href="${escape(pattern.external.url)}" target="_blank" rel="noopener" class="button">Open free pattern at ${escape(pattern.external.publisher)}</a>${pattern.external.sewing?`<a href="${escape(pattern.external.sewing)}" target="_blank" rel="noopener" class="button secondary">Publisher sewing instructions</a>`:''}<a href="${escape(pattern.external.terms)}" target="_blank" rel="noopener" class="button secondary">Publisher terms</a></div>`:'';
function patternDetails(pattern) {
  const revisions = pattern.family ? allPatterns().filter(p=>p.family===pattern.family && isArchived('patterns',p.id)===isArchived('patterns',pattern.id)).sort((a,b)=>b.revision-a.revision) : [];
  const revisionPicker = revisions.length ? `<label class="field">Revision<select id="revision-picker">${revisions.map(p=>option(p.id,'Revision '+p.revision,p.id===pattern.id?p.id:null)).join('')}</select></label>` : '';
  const preview=canTryOn(pattern)?`<button type="button" class="secondary" data-action="preview-garment" data-id="${escape(pattern.id)}">Preview in 3D</button>`:'';
  showDialog(pattern.name,`${revisionPicker}${preview}${referenceLinks(pattern)}${pattern.reference?.startsWith('data:image/jpeg;base64,')?`<figure class="design-reference"><img src="${escape(pattern.reference)}" alt="Uploaded garment reference"><figcaption>Reference photo</figcaption></figure>`:''}<p class="tight">${escape(pattern.cut)} · ${escape(pattern.level)}</p><p class="tight"><strong>Suggested fabric</strong> ${escape(pattern.fabric)}</p><p class="tight"><strong>Tools and notions</strong> ${escape(pattern.tools)}</p>${sewingVisuals.tools(pattern.tools)}${sewingVisuals.steps(pattern.steps, pattern.visuals || sewingVisuals.patterns[pattern.id])}<div class="actions"><button data-action="new" data-id="${escape(pattern.id)}">${pattern.revision?'Make this revision again':'Create work order'}</button>${canTryOn(pattern)&&!pattern.external?`<button class="secondary" data-action="fit" data-id="${escape(pattern.id)}">Fit and revise</button>`:''}${pattern.design && !pattern.external?`<button class="secondary" data-action="copy-design" data-id="${escape(pattern.id)}">Customize design copy</button>`:''}<button class="secondary" data-action="archive-pattern" data-id="${escape(pattern.id)}">${isArchived('patterns',pattern.id)?'Restore':pattern.revision?'Archive this revision':'Archive garment'}</button>${revisions.length>1?`<button class="secondary" data-action="archive-family" data-id="${escape(pattern.id)}">${isArchived('patterns',pattern.id)?'Restore all revisions':'Archive all revisions'}</button>`:''}</div>`);
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
function productionSizeField(value='',locked=false) {
  return `<label class="field">Production size<select name="productionSize"${locked?' disabled':''}>
    ${option('','As fitted',value)}${garmentFit.sizes.map(size=>option(size,size,value)).join('')}
    </select></label>${locked?'':'<p class="muted tight">M uses the saved fit. Other sizes grade the same garment from M. For publisher patterns, use the publisher’s sizing instructions.</p>'}`;
}

function withProductionSize(order,pattern,value,modelId) {
  if (!pattern || !garmentFit.sizes.includes(value)) return order;
  const size=garmentFit.normalizeSize(value);
  const body=garmentReference(pattern,modelId);
  const model=pattern.design?.model || basePattern(pattern).id;
  const sleeves=hasSleeves(pattern);
  const original={...pattern.design?.fitAdjustments,...pattern.fit?.changes,hasSleeves:sleeves};
  const bodice=studioDesign.isBodice(model);
  const referenceChanges={...original};
  if (bodice) {
    const {support,straplessSupport,strapWidth,strapPlacement,sleeveStyle}=shoulderSettings(pattern);
    Object.assign(referenceChanges,{support,neckline:original.neckline??pattern.design?.neckline,sleeveStyle});
    if (support==='Strapless') referenceChanges.straplessSupport=straplessSupport;
    else Object.assign(referenceChanges,{strapWidth,strapPlacement});
    if (studioDesign.supportsStrapShape(support)) Object.assign(referenceChanges,studioDesign.strapShape({...pattern.design,...original,support}));
  }
  const grade=pattern.external?{}:garmentFit.grade(model,size,sleeves);
  const entries=Object.entries(grade);
  const measurements=fitMeasurementSheet(body,referenceChanges,{},true,pattern,body);
  measurements.headings=['Reference model measurement',`Saved ${garmentFit.baseSize} fit`];
  if (pattern.external) measurements.targets=[];
  else {
    const key=bodice?'bust':'hip';
    measurements.targets=measurements.targets.map(([label])=>[
      label.replace(/^Finished/,'Estimated finished'),
      `${Number((body[key]+pattern.design.ease+(original[key]||0)+(grade[key]||0)).toFixed(3))} cm`
    ]);
  }
  const gradeRows=entries.map(([key,delta])=>[garmentFit.fields[key][0],adjustmentText(delta)]);
  measurements.adjustments.unshift(...gradeRows.map(([label,change])=>[`${label} · size grade from M`,change]));
  const sizingStep=pattern.external
    ?`Production size ${size} is the work-order label. Use the reference measurements to select a size or generate a draft using the publisher’s own sizing instructions. Confirm the publisher’s finished ease, cut dimensions and allowances on a fitted sample.`
    :entries.length?`Grade the paper pattern for size ${size} from the saved M fit before cutting. Trace the fitted M stitch lines on fresh paper. Mark the listed grade changes at each garment level, then redraw the curves and check matching seams and notches. These are garment changes around the full circumference, except sleeves and legs, which are measured around one piece, and widths or depths as named. Split a change across the pattern edges that meet at that level. Check the grade on a fitting sample, then restore the cutting allowances.`
      :`Production size ${size} uses the saved fit. Check the fitted M stitch lines and their allowances on paper before cutting.`;
  const dimensions=gradeRows.map(([label,change])=>`${label} ${change}`).join(', ');
  const base=order.snapshot || pattern;
  const steps=[sizingStep,...(dimensions?[`Mark the following changes from M. ${dimensions}. Recheck finished lengths and fit before cutting the final fabric.`]:[]),...base.steps];
  const baseVisuals=base.visuals || sewingVisuals.patterns[pattern.id] || base.steps.map(sewingVisuals.identify);
  const modelMeasurements=snapshotModelMeasurements(body);
  const {id,name,type,cut,color,design,external,tryOn}=pattern;
  return {...order,size,snapshot:{id,name,type,cut,color,design:design?structuredClone(design):undefined,external,tryOn,model:pattern.model,sleeves,
    fit:{modelId:body.id,modelMeasurements,changes:original,fabric:pattern.fit?.fabric},
    steps,visuals:['measure',...(dimensions?['designCut']:[]),...baseVisuals],fabric:base.fabric,tools:base.tools,measurements}};
}

function newOrder(id,existing,modelId) {
  if (!id && !existing && !activeChoices(allPatterns(),'patterns').length) {
    showDialog('New work order','<p>Add or restore a garment in the Pattern Library to create a work order.</p><a class="button tight" href="#library">Open Pattern Library</a>');
    return;
  }
  showDialog(existing ? 'Edit work order' : 'New work order', `<form id="order-form"><label class="field">Work order name<input name="title" required maxlength="120" value="${escape(existing?.title || (getPattern(id)?.revision?getPattern(id).name+' · Revision '+getPattern(id).revision:''))}"></label><label class="field">Pattern<select name="pattern" ${(existing?.done.length || existing?.snapshot || getPattern(id)?.revision) ? 'disabled' : ''}>${options(existing?.pattern || id)}</select></label>${!existing || existing.size?productionSizeField(existing?.size,Boolean(existing)):''}<label class="field">Due date<input type="date" name="due" value="${escape(existing?.due || '')}"></label><label class="field">Fabric, sizing or fitting notes<textarea name="notes" rows="4" maxlength="7000">${escape(existing?.notes || '')}</textarea></label><button>Save work order</button></form>`);
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
      state.orders.unshift(withProductionSize(order,selected,data.get('productionSize'),modelId));
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
  const pattern={...original,...getOrderPattern(order)};
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
  const wearer=body;
  const independentFit=Boolean(pattern && analysis?.tryOn && analysis.garmentBody);
  if (independentFit) body=analysis.garmentBody;
  changes={...pattern?.design?.fitAdjustments,...changes};
  const context = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const lifted=analysis?.pose?.arm||0;
  const shoulderRaising=Math.max(0,lifted-.45*(analysis?.pose?.reach||0)-.12*(analysis?.pose?.sit||0));
  const zoom=fabricFit.clamp(Number(analysis?.editor?.zoom)||1,.7,1.45);
  const scale = Math.min(height * (thumbnail && pattern ? .44 : .345)/Math.max(1,(wearer.height||168)/174),width*.57)*(1-.21*lifted)*zoom;
  const cx = width/2;
  const cy = height*(thumbnail && pattern ? .49 : .51+.05*lifted);
  const faces = [];
  const markings = [];
  const surfaces = {};
  const surfaceParts={};
  const editorMetadata={};
  const componentHits={};
  const editing=analysis?.editor;
  const componentKeys=new Set(editing?.componentKeys || []);
  const near=Math.PI/2-angle;
  const pixelsPerCssPixel=width/(canvas.clientWidth || width || 1);
  const model = pattern ? basePattern(pattern).id : null;
  const skirtFit=model==='dress'||model==='skirt';
  const design = pattern?.design;
  const centimeter=2.368/168;
  const {left={},right={}}=studioDesign.asymmetry?.(design) || {};
  const sideValues=side=>side>0?left:right;
  const offsetOnSide=(side,key)=>sideValues(side)[key]||0;
  const focusedSide=editing?.componentSide==='left'?1:editing?.componentSide==='right'?-1:0;
  const shellFitKeys=['shoulder','armhole','neckDepth','bust','waist','hip','sweep','length'];
  const hasAsymmetricShell=shellFitKeys.some(key=>left[key]||right[key]);
  function blendSide(cosine,spread=.28) {
    const t=fabricFit.clamp((cosine+spread)/(2*spread),0,1);
    return t*t*(3-2*t);
  }
  const sideOffset=(key,leftWeight)=>fabricFit.mix(right[key]||0,left[key]||0,leftWeight);
  const fitBand=(y,center,width)=>Math.max(0,1-Math.abs(y-center)/width);
  const sizeGrade=independentFit?analysis.garmentGrade:null;
  function gradeClearance(y,part) {
    if (!sizeGrade) return 0;
    if (part==='arm') return Math.min(0,fabricFit.mix(sizeGrade.sleeveWidth||0,sizeGrade.cuff||0,
      fabricFit.clamp((y+.57)/.50,0,1)))/450;
    if (part==='leg') return Math.min(0,(sizeGrade.thigh||0)*fitBand(y,.33,.31)+(sizeGrade.knee||0)*fitBand(y,.62,.27)
      +(sizeGrade.leg||0)*fitBand(y,.99,.35))/450;
    return Math.min(0,((sizeGrade.bust||0)*fitBand(y,-.49,.26)+(sizeGrade.waist||0)*fitBand(y,-.25,.31)
      +(sizeGrade.hip||0)*fitBand(y,.16,.42)+2*(sizeGrade.shoulder||0)*fitBand(y,-.75,.18))/450);
  }
  const garmentLayers=studioDesign.layers(design);
  const garmentSeams=studioDesign.seams?.(design) || {};
  const garmentLace=studioDesign.laceTrims(design);
  const seamLace=garmentLace.seams?studioDesign.laceSeamPlacement(design):null;
  const stitchDetails=studioDesign.stitchDetails?.(design) || [];
  const designClosure=Number.isFinite(garmentSeams.panelZipper)?null:design?.closure;
  const fastener=designClosure?garmentFasteners.saved(design):null;
  const casing=fastener?.kind==='drawstring'?fastener.casingDepth*centimeter:0;
  const designShape = design ? studioDesign.measurements(design) : null;
  const necklineStyle = changes.neckline || design?.neckline;
  const support=changes.support || (design?studioDesign.selectedSupport(design):'Integrated shoulders');
  if (support==='Strapless') changes.hasSleeves=false;
  const elasticStrapless=support==='Strapless' && studioDesign.selectedStraplessSupport({
    ...design,model:design?.model||model,support,straplessSupport:changes.straplessSupport??design?.straplessSupport
  })==='Elastic top edge';
  const oneShoulderSide=(changes.shoulderSide??studioDesign.selectedShoulderSide?.(design)??design?.shoulderSide)==='right'?-1:1;
  const sleeveStyle=changes.sleeveStyle || design?.sleeve || 'Short';
  const backStyle=design?studioDesign.selectedBack(design):'Classic back';
  const structured=design?.model==='corset';
  const fairyHem=design && studioDesign.hasFairyHem(design);
  const mainHem=skirtFit && design ? studioDesign.hemContour?.(design) : null;
  const customMainHem=mainHem && (fairyHem && (mainHem.hemPointCount!==4 || mainHem.hemRotation) ||
    mainHem.hemFront || mainHem.hemLeft || mainHem.hemBack || mainHem.hemRight);
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
  const regions = analysis?.show ? fabricFit.estimate(pattern,model,wearer,changes,analysis.pose,analysis.material) : null;
  const sided=regions?sideFitRegions(pattern,model,wearer,changes,analysis.pose,analysis.material,{left,right}):null;
  const splitRegions=sided?{[-1]:sided.right,[1]:sided.left}:null;
  const spin = Math.cos(angle);
  const sine = Math.sin(angle);
  const tilt = -.105+(analysis?.pitch||0);
  const proportions=sewingModels.proportions(body);
  const wearerProportions=independentFit?sewingModels.proportions(wearer):proportions;
  const bustGeometry=sewingModels.bustGeometry(body,proportions);
  const avatar=pattern && !thumbnail && !body.mesh && typeof humanPreview!=='undefined'
    ?humanPreview.fittingSurface(body,proportions):null;
  const wearerAvatar=independentFit && (wearer!==body || !avatar) && !thumbnail && typeof humanPreview!=='undefined'
    ?humanPreview.fittingSurface(wearer,wearerProportions):avatar;
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
  const projectView=point=>screen(rotateView(point));
  let garmentOffset;
  const project=point=>projectView(garmentOffset?point.map((n,i)=>n+garmentOffset[i]):point);
  const coordinate=([x,y])=>[100*x/width,100*y/height];
  function addComponent(key,paths,{radius=10,guide=false,priority=0}={}) {
    if (!componentKeys.has(key)) return;
    const valid=paths.filter(path=>path.length>1);
    if (!valid.length) return;
    const hit=componentHits[key]??={paths:[],points:[],radius,priority};
    hit.paths.push(...valid.map(path=>path.map(coordinate)));
    const selected=editing.selectedComponent===key;
    const hovered=editing.hoveredComponent===key;
    if (!selected && !hovered && !guide && !editing.guidedComponents?.includes(key)) return;
    for (const path of valid) {
      if (selected || hovered) markings.push({points:path,style:'rgba(23,42,42,.90)',width:5*pixelsPerCssPixel});
      const style=selected?'rgba(108,246,222,.98)':hovered?'rgba(235,255,250,.96)':'rgba(241,254,249,.42)';
      markings.push({points:path,style,width:(selected||hovered?2.9:1.45)*pixelsPerCssPixel});
    }
  }
  const liftedPoint=([x,y,z],theta)=>project([x+.0045*Math.cos(theta),y,z+.0045*Math.sin(theta)]);
  const viewArc=(sample,center=near,span=1.48,count=25)=>
    Array.from({length:count},(_,i)=>sample(center+span*(2*i/(count-1)-1)));
  function visiblePaths(points,angles,side=0) {
    const paths=[];
    let path=[];
    for (const [i,point] of points.entries()) {
      if (Math.sin(angles[i]+angle)>.045 && (!side || side*Math.cos(angles[i])>=-.001)) path.push(point);
      else if (path.length) {
        if (path.length>1) paths.push(path);
        path=[];
      }
    }
    if (path.length>1) paths.push(path);
    return paths;
  }
  let shellContact;
  let seatContact;
  let legContact;
  let skinPoints=null;
  let skinTopology=null;
  let skinCovered;
  let posedSkin=null;
  function drawLace(trim,edge,inside,key,{visible,contact=null,opacity=1,closed=true,alignment=0,normalAt,acrossAt}={}) {
    const size=edge.length;
    if (size<2) return;
    const center=[0,1,2].map(axis=>edge.reduce((sum,p)=>sum+p[axis],0)/size);
    const distance=(a,b)=>Math.hypot(...a.map((n,i)=>n-b[i]));
    const spanCount=closed?size:size-1;
    const perimeter=edge.slice(0,spanCount).reduce((sum,p,i)=>sum+distance(p,edge[(i+1)%size]),0);
    const width=trim.width*centimeter, overlap=Math.min(.0065,width*.20);
    const scalloped=trim.style==='Scalloped lace';
    const eyelet=trim.style==='Eyelet lace';
    const neckline=key==='laceNeckline';
    const span=fabricFit.clamp(width*(scalloped?1.3:1.10),.035,.11);
    const repeats=fabricFit.clamp(Math.round(perimeter/span),closed?10:1,38);
    const cells=8, count=repeats*cells;
    const colors=trim.color.slice(1).match(/../g).map(n=>parseInt(n,16));
    const paints=[0,1].map(row=>{
      const tone=row===0?.81:1;
      const alpha=opacity*(row===0?.98:scalloped?.88:eyelet?.91:.66);
      return 'rgba('+colors.map(n=>Math.round(n*tone)).join(',')+','+alpha+')';
    });
    const sections=Array.from({length:count+(closed?0:1)},(_,i)=>{
      const s=i*spanCount/count, j=Math.min(Math.floor(s),closed?size-1:size-2), k=(j+1)%size;
      const t=s-j;
      const a=edge[j].map((n,i)=>fabricFit.mix(n,edge[k][i],t));
      const inner=inside[j].map((n,i)=>fabricFit.mix(n,inside[k][i],t));
      const direction=a.map((n,i)=>n-inner[i]);
      const length=Math.hypot(...direction)||1;
      const radial=a.map((n,i)=>n-center[i]);
      const tangent=edge[k].map((n,i)=>n-edge[closed?(j+size-1)%size:Math.max(0,j-1)][i]);
      const normal=[tangent[1]*direction[2]-tangent[2]*direction[1],
        tangent[2]*direction[0]-tangent[0]*direction[2],tangent[0]*direction[1]-tangent[1]*direction[0]];
      const outside=normal.reduce((sum,n,k)=>sum+n*radial[k],0)<0?-1:1;
      const magnitude=Math.hypot(...normal)||1;
      const unit=normalAt?.(j,k,t) || normal.map(n=>n*outside/magnitude);
      const theta=s*2*Math.PI/size;
      if (neckline) {
        // Roll the trim toward the neck over the shoulder rather than
        // carrying the bodice's outward flare past the neckline.
        const side=Math.cos(theta);
        const weight=fabricFit.clamp((Math.abs(side)-.4)/.55,0,1)**2;
        direction[0]=fabricFit.mix(direction[0],-Math.sign(side)*length*.52,weight);
        direction[1]=fabricFit.mix(direction[1],-length*.85,weight);
      }
      const drop=Math.hypot(...direction)||1;
      const crest=scalloped?.76+.24*Math.sin(Math.PI*(i%cells)/cells)**2:1;
      const rows=[0,.17,.41,.69,1].map(fraction=>{
        const offset=width*(fraction*crest-alignment)-overlap;
        const base=acrossAt?.(j,k,t,offset) || a.map((n,k)=>n+direction[k]/drop*offset);
        let p=base.map((n,k)=>n+unit[k]*.0038);
        if (p[1]>1.126) p=[p[0]+unit[0]*(p[1]-1.126)*.45,1.126,p[2]+unit[2]*(p[1]-1.126)*.45];
        if (contact) p=contact(p,theta);
        return project(p);
      });
      return {rows,visible:!visible || visible(j)&&visible(k),near:rotateView(unit)[2]>(closed?.05:-.045)};
    });
    const hitPaths=[];
    let path=[];
    for (let i=0;i<=count;i++) {
      const a=sections[i%sections.length];
      if (a.visible && a.near) path.push(a.rows[2]);
      else if (path.length) {
        if (path.length>1) hitPaths.push(path);
        path=[];
      }
      if (i===count) break;
      const b=sections[(i+1)%sections.length];
      if (!a.visible || !b.visible) continue;
      const u=i%cells;
      for (let row=0;row<4;row++) {
        const open=scalloped ? row===2 && (u===3 || u===4) || row===1 && (u===1 || u===6)
          : eyelet ? (row===1 || row===2) && (u===3 || u===4)
            : (row===1 || row===2) && (u+row)%3===0;
        if (open) continue;
        const points=[a.rows[row],b.rows[row],b.rows[row+1],a.rows[row+1]];
        const paint=paints[row===0?0:1];
        faces.push({points,depth:points.reduce((sum,p)=>sum+p[2],0)/4,paint,skipStroke:true});
      }
    }
    if (path.length>1) hitPaths.push(path);
    addComponent(key,hitPaths,{radius:8,priority:4});
  }
  function mesh(rings,hex,offset=0,neck=false,detail=false,fabricBody=false,transform=null,part=null,visibleBand=null) {
    const trouserJoin=part==='leg' && model==='trousers'?surfaces.shell:null;
    const segments = part==='shell' || trouserJoin ? 64 : hex===skin && !detail ? 54 : 38;
    const channels = hex.match(/[0-9a-f]{2}/gi).map(c=>parseInt(c,16));
    const side = part==='sleeve'||part==='leg' ? Math.sign((rings[0][3]||0)+offset) : 0;
    const asymmetricShell=part==='shell' && hasAsymmetricShell;
    const splitShellFit=splitRegions && part==='shell';
    const pieceFit=splitRegions && side ? splitRegions[side] : regions;
    const shapedHem=part==='shell' && (customMainHem || fairyHem && (left.length || right.length));
    const hemCurve=shapedHem?{
      waist:proportions.yAt(shell[model==='dress'?3:0][0]),
      floor:proportions.yAt(1.105),
      angles:new Map(),standingAngles:new Map()
    }:null;
    function restPoint(ring,theta,ringIndex,shoulderMotion=shoulderRaising,applyHemContour=true) {
      const [y,w,d,center=0,centerZ=0] = ring;
      const x = Math.cos(theta);
      const z = Math.sin(theta);
      const leftWeight=asymmetricShell?blendSide(x):.5;
      const neckOffset=asymmetricShell && neck ? sideOffset('neckDepth',blendSide(x,.15))*centimeter : 0;
      const frontDepth=neckDepth*({Crew:.58,Boat:.45,'V-neck':1.5,Square:1.18,Sweetheart:1.1,'U-neck':1.4,'Mock neck':.27}[necklineStyle]||1);
      const backDepth=fabricFit.clamp(({'Low scoop back':.20,'V-back':.25,'Square back':.17,'Open back':.36,'Racerback':.12}[backStyle]||.0575)+(changes.backNeck||0)/92,.012,.44);
      const absX=Math.abs(x);
      const backWidth=backStyle==='Open back'?.9:backStyle==='Classic back'?neckWidth:.72;
      let edge=z>=0?(neckOffset?Math.max(.004,frontDepth+neckOffset):frontDepth)*neckProfile(necklineStyle,absX/neckWidth)
        :backDepth*neckProfile(backStyle,absX/backWidth);
      if (z<0 && backStyle==='Racerback') edge=.035+.17*Math.sin(absX*Math.PI)**2;
      if (neck && !changes.hasSleeves && support==='Integrated shoulders') {
        edge+=.135*absX**8+.11*shoulderMotion*absX**5;
      }
      if (support!=='Integrated shoulders') {
        const lowered=support==='Strapless'?.18:z>=0?.111:.156;
        edge=edge*.55+lowered+(.04+.11*shoulderMotion)*absX**4;
        if (support==='One-shoulder') edge-=.066*x*oneShoulderSide;
      }
      if (structured && design.cut==='Underbust') edge=.36+(z<0?backDepth*.37:0);
      const transition=structured?.56:.70;
      const shoulderCap=avatar && changes.hasSleeves && neck?.065*absX**2*Math.max(0,1-(y-rings[0][0])/.12):0;
      const neckline=neck ? Math.max(0,1-(y-rings[0][0])/transition)*edge-shoulderCap : 0;
      const ribbed=design?.ribbing && (part==='sleeve'||part==='shell') && y>rings.at(-1)[0]-.06;
      const gathered=(designClosure==='Elastic waistband'||casing) && part==='shell' && y<rings[0][0]+(casing||.07);
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
      const armhole=asymmetricShell && neck ? sideOffset('armhole',leftWeight)*centimeter*fitBand(y,-.64,.16)*absX**2 : 0;
      const sideDrop=asymmetricShell && model!=='trousers' ? sideOffset('length',leftWeight)*centimeter : 0;
      let sideLength=0;
      if (sideDrop) {
        const start=proportions.yAt(rings[0][0]);
        const span=Math.max(.03,proportions.yAt(rings.at(-1)[0])-start);
        const level=proportions.yAt(y);
        const drop=Math.max(-span*.80,sideDrop);
        const taper=drop<0?Math.min(4,.90*span/-drop):4;
        const fall=fabricFit.clamp((level-start)/span,0,1)**taper;
        sideLength=proportions.baseAt((1.128-level-drop*fall)/centimeter)-y;
      }
      const seatedSkirt=skirtFit && part==='shell';
      const front=Math.max(0,z),rear=Math.max(0,-z);
      const seatPanel=seatedSkirt?Math.exp(-(((y-.15)/.25)**2))*rear**2*(changes.seatDepth||0)*.013:0;
      const lapPanel=seatedSkirt?Math.exp(-(((y-.35)/.31)**2))*front*(changes.lapEase||0)*.0038:0;
      const backLength=seatedSkirt?rear**2*fabricFit.clamp((y+.31)/.77,0,1)*(changes.sittingLength||0)*.011:0;
      let measuredY=Math.min(y+sideLength+backLength,1.12)+neckline+slope+pelvisY+armhole;
      if (hemCurve && applyHemContour) {
        const cached=shoulderMotion===0?hemCurve.standingAngles:hemCurve.angles;
        if (!cached.has(theta)) {
          const end=proportions.yAt(restPoint(rings.at(-1),theta,rings.length-1,shoulderMotion,false)[1]);
          const start=Math.min(hemCurve.waist,end-.02);
          const span=end-start;
          const offset=fabricFit.clamp(studioDesign.hemOffsetAt(design,theta)*centimeter,-.82*span,Math.max(0,hemCurve.floor-end));
          // Taper from the already fitted y coordinate so shortening both
          // the contour and one side still preserves the order of the rings.
          const taper=offset<0?Math.min(4,.94*span/-offset):4;
          cached.set(theta,{start,span,offset,taper});
        }
        const {start,span,offset,taper}=cached.get(theta);
        const level=proportions.yAt(measuredY);
        const fall=fabricFit.clamp((level-start)/span,0,1)**taper;
        if (offset && fall) measuredY=proportions.baseAt((1.128-level-offset*fall)/centimeter);
      } else if (fairyHem && part==='shell' && applyHemContour) {
        const corner=(1/Math.max(Math.abs(x),Math.abs(z))-1)/(Math.SQRT2-1);
        const drop=studioDesign.hemDrop(design)*.0138*progress**4*(corner-.5);
        const hemLimited=drop?Math.min(y+sideLength+drop,1.105):y+sideLength;
        measuredY=Math.min(hemLimited+backLength,1.12)+neckline+slope+pelvisY+armhole;
      }
      let wide=w, deep=d;
      if (asymmetricShell) {
        // Circumference offsets act on a half-ring. Shoulder offsets are direct widths.
        const circumference=fitBand(y,-.49,.24)*sideOffset('bust',leftWeight)+fitBand(y,-.25,.32)*sideOffset('waist',leftWeight)
          +fitBand(y,.16,.38)*sideOffset('hip',leftWeight)+fitBand(y,rings.at(-1)[0],.42)*sideOffset('sweep',leftWeight);
        const widthOffset=circumference*centimeter/Math.PI;
        const shoulderOffset=fitBand(y,-.75,.18)*sideOffset('shoulder',leftWeight)*centimeter;
        const [minimumWidth,minimumDepth]=widthOffset+shoulderOffset<0 && fullBody && !shellContact
          ? shellClearance(y) : [.013,.013];
        wide=Math.max(minimumWidth,w+widthOffset+shoulderOffset);
        deep=Math.max(minimumDepth,d+.68*widthOffset+.25*shoulderOffset);
      }
      return [offset+center+x*(wide+fold+lapPanel*.55),measuredY,
        centerZ+z*(deep+fold)+projectedBust+lapPanel-seatPanel];
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
    const outsideLeg=i=>side*Math.cos(thetaAt(i))>=-1e-7;
    if (trouserJoin) {
      const hip=trouserJoin.geometry.at(-1);
      const front=hip[segments/4],back=hip[segments*3/4];
      const transition=Math.min(.24,Math.max(.06,(rings.at(-1)[0]-rings[0][0])*.78));
      for (let i=0;i<segments;i++) {
        const theta=thetaAt(i);
        const u=(1-Math.sin(theta))*.5;
        // Outer arcs share the hip edge. Inner arcs share one recessed
        // crotch seam so the two leg openings close into the same cloth.
        let join=outsideLeg(i)?hip[i]:front.map((n,k)=>fabricFit.mix(n,back[k],u)+(k===1?.092*4*u*(1-u):0));
        if (seatContact && !outsideLeg(i) && u>.55) join=seatContact(join,pose.sit*(u-.55)/.45);
        const base=targets[0][i];
        targets[0][i]=join;
        for (let row=1;row<targets.length;row++) {
          const t=fabricFit.clamp((rest[row][i][1]-rest[0][i][1])/transition,0,1);
          if (t===1) break;
          const blend=1-t*t*(3-2*t);
          targets[row][i]=targets[row][i].map((n,k)=>n+(join[k]-base[k])*blend);
        }
      }
    }
    const seat=skirtFit && part==='shell'
      ? {top:proportions.yAt(-.12),bottom:proportions.yAt(.32),weight:1-pose.sit**.7}
      : null;
    const geometry=contact?clothContact.drape(targets,rest.map(row=>row.map(([x,y,z])=>[x,proportions.yAt(y),z])),
      contact,material,{free:model==='dress'?.29:.13,seat}):targets;
    if (seatContact && (part==='shell'||trouserJoin)) for (let j=trouserJoin?1:0;j<geometry.length;j++) {
      for (let i=0;i<segments;i++) {
        const y=rest[j][i][1];
        const back=Math.max(0,-Math.sin(thetaAt(i)));
        if (y<.06 || y>.43 || back<.05) continue;
        const band=trouserJoin?fabricFit.clamp((.43-y)/.095,0,1):fabricFit.clamp((y-.06)/.11,0,1);
        const support=fabricFit.clamp((back-.05)/.43,0,1);
        geometry[j][i]=seatContact(geometry[j][i],pose.sit*band*support);
      }
    }
    if (trouserJoin && legContact && rings.at(-1)[0]<.71) {
      const limit=Math.min(.09,(rings.at(-1)[0]-rings[0][0])*.67);
      for (let j=1;j<geometry.length;j++) {
        const y=rings[j][0];
        const t=fabricFit.clamp((y-rings[0][0])/Math.max(.035,limit),0,1);
        const barrier=t*t*(3-2*t);
        const size=gradeClearance(y,'leg');
        for (let i=0;i<segments;i++) geometry[j][i]=legContact(geometry[j][i],y,thetaAt(i),side,barrier,size);
      }
    }
    const projected=geometry.map((row,j)=>row.map((point,i)=>trouserJoin && j===0 && outsideLeg(i)
      ?trouserJoin.projected.at(-1)[i]:project(point)));
    function sampleRing(theta,index) {
      const position=((theta/(2*Math.PI)*segments)%segments+segments)%segments;
      const column=Math.floor(position);
      return geometry[index][column].map((value,axis)=>fabricFit.mix(value,geometry[index][(column+1)%segments][axis],position-column));
    }
    if (part && part!=='torso-skin') surfaces[part]={rings,rest,geometry,projected,opening:neckWidth,sampleRing,side,
      moveEnd:(point,theta)=>movePoint(point,theta,rings.length-1),
      standingPoint:(theta,index,applyHemContour=true)=>restPoint(rings[index],theta,index,0,applyHemContour),projectPoint:(row,theta,index)=>{
      const point=sampleRing(theta,index);
      if (row!==rings[index]) {
        const current=movePoint(restPoint(row,theta,index),theta,index);
        const base=movePoint(restPoint(rings[index],theta,index),theta,index);
        return project(point.map((n,i)=>n+current[i]-base[i]));
      }
      return project(point);
    }};
    if ((componentKeys.size || stitchDetails.length) && surfaces[part] && part!=='torso-skin') {
      (surfaceParts[part]??=[]).push(surfaces[part]);
    }
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
        const position=(ring+.5)/(rings.length-1);
        const level=splitShellFit?fabricFit.mix(
          fabricFit.levelAt(splitRegions[-1],band,theta-angle,part,position),
          fabricFit.levelAt(splitRegions[1],band,theta-angle,part,position),blendSide(Math.cos(theta-angle)))
          :pieceFit && part?fabricFit.levelAt(pieceFit,band,theta-angle,part,position):0;
        const swatch=part && detail && !contrastPanel?fabricFit.sample(selectedSwatch?.photo,i/segments*3,band*2.5,analysis?.redraw):null;
        const grain=part && detail?(weave==='twill'?Math.sin(theta*11+band*40)*.015:
          weave==='knit'?Math.cos(theta*13)*Math.sin(band*36)*.012:
          weave==='satin'?Math.max(0,Math.cos(theta-1.95))**12*.13:Math.sin(theta*9+band*48)*.009):0;
        const waistband=(designClosure==='Elastic waistband'||casing) && part==='shell' && band<rings[0][0]+(casing||.061);
        const palette=contrastPanel||ribbed?contrast:waistband?channels.map(c=>c*.93):swatch || channels;
        const fiber=(level>0?fabricFit.tint(palette,level):palette).map(c=>fabricFit.clamp(Math.round(c*(light+grain)),0,255));
        const panelSeam=structured && neck && [0,3,6,segments/2,segments/2+3,segments/2+6].includes(i);
        const finishedEdge=ring===rings.length-2 && (part!=='shell'||model!=='trousers');
        faces.push({points,depth,paint:'rgb('+fiber.join(',')+')',seam:detail&&(i===0||i===segments/2||finishedEdge||panelSeam)});
      }
    }
    if (part==='shell' && neck && garmentLace.neckline) {
      drawLace(garmentLace.neckline,geometry[0],geometry[1],'laceNeckline',{contact});
    }
    if (part==='sleeve' && garmentLace.sleeves) {
      drawLace(garmentLace.sleeves,geometry.at(-1),geometry.at(-2),'laceSleeves');
    }
    if ((part==='shell' && model!=='trousers' || part==='leg') && garmentLace.hem) {
      drawLace(garmentLace.hem,geometry.at(-1),geometry.at(-2),'laceHem',{contact});
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
  const wearerRig=independentFit?fabricFit.rig(pose,wearerProportions.yAt):rig;
  const [floorX,floorY]=projectView(wearerRig.foot([0,1.127,.055]));
  context.ellipse(floorX,floorY+2,scale*.35,scale*.055,0,0,Math.PI*2);
  context.fill();
  const skin = color(wearer.skin||'#d7b69d');
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
  const torsoClearance=pattern && body.mesh?importedEnvelope(body.mesh,torso):torso;
  const coveredLegs=skirtFit?legBody.map(([y,w,d])=>[y,(w+legSpacing)*1.045,d*1.32]):null;
  function shellClearance(y) {
    const detailed=avatar?.sectionAt(skirtFit && y>.30?'bothLegs':'torso',y);
    if (detailed) return [detailed[0]+.012,detailed[1]+.014];
    const [tw,td]=fabricFit.envelope(torsoClearance,y);
    const [lw,ld]=coveredLegs?fabricFit.envelope(coveredLegs,y):[0,0];
    return [Math.max(tw,lw)+.012,Math.max(td,ld)+.012];
  }
  const shoulders = modeledShoulder/240;
  const armScale=avatar?1:fabricFit.clamp((body.arm||56)/56,.78,1.27);
  const articulated=avatar?.pose?.(pose);
  const wearerPose=independentFit?wearerAvatar?.pose?.(pose):articulated;
  const torsoMove=articulated?.torso||rig.torso;
  const legMove=articulated?.leg||rig.leg;
  const wearerTorso=wearerPose?.torso||wearerRig.torso;
  if (independentFit) {
    const anchor=[0,model==='trousers'||model==='skirt'?-.25:support==='Strapless'?-.56:-.71,0];
    const source=model==='trousers'?rig.pelvis(anchor,Math.PI/2):torsoMove(anchor);
    const target=model==='trousers'?wearerRig.pelvis(anchor,Math.PI/2):wearerTorso(anchor);
    // Move the whole piece to the new wearer without grading it to them.
    garmentOffset=target.map((n,i)=>n-source[i]);
  }
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
  if (model==='trousers') {
    const [hipY,hipW,hipD]=shell.at(-2);
    const [tailY,tailW,tailD]=shell.at(-1);
    const y=Math.min(tailY,Math.max(.19,hipY+.036));
    const t=(y-hipY)/Math.max(.001,tailY-hipY);
    shell[shell.length-1]=[y,fabricFit.mix(hipW,tailW,t),fabricFit.mix(hipD,tailD,t)];
  }
  const legRings=[[.19,.12,.128],[.36,.123,.132],[.57,.107,.112],[.8,.103,.108],[.93,.103,.106]];
  const trouserFitKeys=['thigh','knee','leg'];
  function trouserRings(side) {
    const fit={...changes};
    for (const key of trouserFitKeys) fit[key]=(fit[key]||0)+offsetOnSide(side,key);
    const baseHem=fabricFit.clamp(.93+lengthDelta,.35,1.09);
    const length=offsetOnSide(side,'length');
    const legHem=length?fabricFit.clamp(proportions.baseAt((1.128-proportions.yAt(baseHem))/centimeter-length),.35,1.09):baseHem;
    const start=shell.at(-1)[0];
    return expanded(hang(resize(legRings,0,hipDelta+offsetOnSide(side,'hip')/450,0,fit,true).map(([y,w,d])=>{
      const t=(y-.19)/.74;
      const [thigh,knee,hem]=designShape?.leg || [0,0,0];
      const variation=t<.53?fabricFit.mix(thigh,knee,t/.53):fabricFit.mix(knee,hem,(t-.53)/.47);
      return [fabricFit.mix(start,legHem,t),w+variation,d+variation*.82];
    })));
  }
  const trouserLegs=model==='trousers'?{[-1]:trouserRings(-1),[1]:trouserRings(1)}:null;
  const restingHem=skirtFit?shell.at(-1)[0]+Math.min(0,offsetOnSide(-1,'length'),offsetOnSide(1,'length'))*centimeter:0;
  const torsoCover=shell ? Math.max(shell[0][0],(model==='dress'||model==='top')?-.27:-Infinity) : 2;
  const shortestShell=shell?shell.at(-1)[0]+Math.min(0,offsetOnSide(-1,'length'),offsetOnSide(1,'length'))*centimeter:0;
  const visibleTorso=y=>!shell||y<torsoCover||y>shortestShell;

  // Each row gives the fraction down the sleeve and its two pattern radii.
  const sleeveProfile=({
    Flutter:{length:-.12,armFraction:.55,radii:[[0,.074,.092],[.24,.084,.102],[.52,.108,.117],[.78,.131,.133],[1,.151,.147]]},
    Bishop:{length:.39,wrist:true,radii:[[0,.076,.092],[.22,.086,.104],[.48,.105,.107],[.69,.129,.121],
      [.83,.136,.131],[.91,.115,.112],[.95,.057,.063],[1,.052,.060]]},
    Tapered:{length:.38,wrist:true,radii:[[0,.075,.091],[.24,.083,.096],[.46,.073,.077],
      [.64,.061,.068],[.81,.052,.056],[1,.043,.048]]}
  })[sleeveStyle];
  const detailedSleeveEnd=side=>{
    const [shoulder,elbow,wrist]=avatar.joints;
    const start=shoulder[1]-.085;
    const naturalEnd=sleeveProfile?.wrist?wrist[1]:({Long:wrist[1],Bell:wrist[1],Elbow:elbow[1]})[sleeveStyle] ??
      fabricFit.mix(shoulder[1]-.027,elbow[1],sleeveProfile?.armFraction??({Cap:.35,Puff:.91})[sleeveStyle]??.77);
    return [start,Math.max(start+.11,naturalEnd+(changes.sleeveLength||0)/75+offsetOnSide(side,'sleeveLength')*centimeter)];
  };
  function drawImportedTorso(mesh,move,projectPoint,visible=()=>true) {
    const points=mesh.vertices.map(v=>projectPoint(move(v)));
    for (const triangle of mesh.triangles) {
      if (triangle.every(index=>!visible(mesh.vertices[index][1]))) continue;
      const corners=triangle.map(index=>points[index]);
      const [a,b,c]=corners;
      const area=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
      if (Math.abs(area)<.1) continue;
      const depth=(a[2]+b[2]+c[2])/3;
      const light=Math.round(Math.max(-36,Math.min(36,depth*62)));
      const paint=skin.slice(1).match(/../g).map(channel=>fabricFit.clamp(parseInt(channel,16)+light,0,255));
      faces.push({points:corners,depth,paint:'rgb('+paint.join(',')+')'});
    }
  }
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
    if (!independentFit) {
      skinPoints=bodyPoints.map(rotateView);
      skinTopology=humanPreview.topology;
    }
    if (typeof clothContact!=='undefined' && humanPreview.topology) {
      // A seated thigh and pelvis can share a posed height. Use only the
      // nearby avatar area for the trouser seat's collision envelope.
      const contact=clothContact.fromAvatar(bodyPoints,avatar.vertices,humanPreview.topology,model==='trousers'?.305:Infinity);
      if (model==='trousers' && pose.sit>.005) seatContact=clothContact.beneathSeat(bodyPoints,avatar.vertices,humanPreview.topology);
      if (trouserLegs && Object.values(trouserLegs).some(leg=>leg.at(-1)[0]<.71)) {
        legContact=clothContact.legSections(bodyPoints,avatar.vertices,humanPreview.topology,legMove);
      }
      if (sizeGrade && Object.values(sizeGrade).some(value=>value<0)) {
        shellContact=(point,theta)=>{
          const y=proportions.baseAt((1.128-point[1])/centimeter);
          const setback=-gradeClearance(y,'torso');
          if (!setback) return contact(point,theta);
          const dx=setback*Math.cos(theta),dz=setback*.70*Math.sin(theta);
          const sample=[point[0]+dx,point[1],point[2]+dz];
          const guarded=contact(sample,theta);
          return guarded===sample?point:[guarded[0]-dx,guarded[1],guarded[2]-dz];
        };
      } else shellContact=contact;
    }
  } else if (fullBody && !independentFit) {
    if (body.mesh) drawImportedTorso(body.mesh,torsoMove,projectView,visibleTorso);
    else mesh(torso,skin,0,false,false,false,torsoMove,'torso-skin',visibleTorso);
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
      const legCover=trouserLegs?.[side].at(-1)[0] ?? Math.max(0,restingHem-pose.sit*.14);
      const exposedLeg=legBody.filter(([y])=>y>legCover);
      if (legCover>=legBody[0][0] && legCover<legBody.at(-1)[0]) {
        exposedLeg.unshift([legCover,...fabricFit.envelope(legBody,legCover)]);
      }
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

  if (independentFit && wearerPose) {
    skinPoints=wearerPose.vertices.map(rotateView);
    skinTopology=humanPreview.topology;
    if (wearer.mesh) {
      const range=wearer.mesh.vertices.reduce(([lo,hi],[,y])=>[Math.min(lo,y),Math.max(hi,y)],[Infinity,-Infinity]);
      skinCovered=wearerAvatar.vertices.map(([,y,,arm])=>arm<.46 && y>=range[0] && y<=range[1]);
      const uncovered=[];
      for (let i=0;i<skinTopology.length;i+=4) {
        const face=skinTopology.slice(i,i+4);
        if (!face.every(index=>skinCovered[index])) uncovered.push(...face);
      }
      skinTopology=uncovered;
      drawImportedTorso(wearer.mesh,wearerTorso,projectView);
    }
  }

  function bridgeShoulders() {
    if (!strapWidth || (model!=='dress' && model!=='top') || structured && design.cut==='Underbust') return;
    const {sampleRing,standingPoint,rings}=surfaces.shell;
    const bind=avatar?.joints[0] || [.214+shoulders,-.73,0];
    const rows=changes.hasSleeves?2:1;
    const baseWidth=rings[rows][1];
    const integrated=support==='Integrated shoulders', halter=support==='Halter strap';
    const adjustable=studioDesign.supportsStrapShape(support);
    const strapShape=adjustable ? studioDesign.strapShape({...design,...changes}) : null;
    const frontJoin=strapShape?.strapFrontJoin||0, backJoin=halter?0:strapShape?.strapBackJoin||0;
    const frontSkew=Math.tan((strapShape?.strapFrontAngle||0)*Math.PI/180);
    const backSkew=halter?0:Math.tan((strapShape?.strapBackAngle||0)*Math.PI/180);
    const fitCenter=bind[0]*(integrated?.81:halter?.64:.76)+strapPlacement-(changes.hasSleeves?0:.021*shoulderRaising);
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
          const ux=q[0]-p[0], uy=q[1]-p[1], uz=q[2]-p[2];
          const vx=r[0]-p[0], vy=r[1]-p[1], vz=r[2]-p[2];
          const determinant=ux*vz-uz*vx;
          const backDeterminant=ux*vy-uy*vx;
          shoulderTriangles.push({
            p,ux,uy,uz,vx,vy,vz,determinant,backDeterminant,wp,wu:wq-wp,wv:wr-wp,
            x0:Math.min(p[0],q[0],r[0]),x1:Math.max(p[0],q[0],r[0]),
            y0:Math.min(p[1],q[1],r[1]),y1:Math.max(p[1],q[1],r[1]),
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
        if (x<tri.x0 || x>tri.x1 || z<tri.z0 || z>tri.z1 || Math.abs(tri.determinant)<1e-8) continue;
        const dx=x-tri.p[0],dz=z-tri.p[2];
        const a=(dx*tri.vz-dz*tri.vx)/tri.determinant;
        const b=(tri.ux*dz-tri.uz*dx)/tri.determinant;
        const armWeight=tri.wp+a*tri.wu+b*tri.wv;
        if (!changes.hasSleeves && shoulderRaising>.12 && armWeight>.58) continue;
        if (a>=0 && b>=0 && a+b<=1) y=Math.min(y,tri.p[1]+a*tri.uy+b*tri.vy-.012);
      }
      return y;
    }
    // A depth ray clears the parts of the ribbon that descend along the
    // bodice, where a vertical ray alone cannot see the skin surface.
    function outsideShoulder([x,y,z],direction) {
      for (const tri of shoulderTriangles) {
        if (x<tri.x0 || x>tri.x1 || y<tri.y0 || y>tri.y1 || Math.abs(tri.backDeterminant)<1e-8 ||
            (direction<0?tri.z0>=z:tri.z1<=z)) continue;
        const dx=x-tri.p[0],dy=y-tri.p[1];
        const a=(dx*tri.vy-dy*tri.vx)/tri.backDeterminant;
        const b=(tri.ux*dy-tri.uy*dx)/tri.backDeterminant;
        if (a<0 || b<0 || a+b>1 || tri.wp+a*tri.wu+b*tri.wv>.70) continue;
        const skin=tri.p[2]+a*tri.uz+b*tri.vz;
        z=direction<0?Math.min(z,skin-.008):Math.max(z,skin+.008);
      }
      return z;
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
      return projected;
    }
    for (const side of support==='One-shoulder'?[oneShoulderSide]:[-1,1]) {
      const shoulder=offsetOnSide(side,'shoulder')*centimeter;
      const width=shoulder?Math.max(.084,baseWidth+shoulder*fitBand(rings[rows][0],-.75,.18)):baseWidth;
      const edge=Math.min(bind[0]+(changes.hasSleeves?.061:.018-.029*shoulderRaising)+shoulder,width*.95);
      const available=shoulder?Math.max(.006,edge-.067):edge-.067;
      const halfWidth=Math.min(Math.max(.003,strapWidth*centimeter/2),available*.5);
      const center=fabricFit.clamp(fitCenter+shoulder*.72,.067+halfWidth,edge-halfWidth);
      const stations=18;
      function attachment(curve=0,taper=100,collar=false) {
        if (!curve && taper===100) return null;
        const inner=collar?.008:.067, outer=collar?.057:edge;
        const nominalCenter=collar?.044:center;
        const nominalHalf=halfWidth*(collar?.32:1);
        const outerHalf=Math.min(nominalHalf*taper/100,(outer-inner)*.5);
        return {
          center:fabricFit.clamp(nominalCenter-curve*centimeter,inner+outerHalf,outer-outerHalf),
          half:outerHalf
        };
      }
      const frontEnd=attachment(strapShape?.strapFrontCurve,strapShape?.strapFrontTaper);
      const backEnd=attachment(strapShape?.strapBackCurve,strapShape?.strapBackTaper,halter);
      function shellPoint(x,front,depth=0) {
        const theta=(front?1:-1)*Math.acos(fabricFit.clamp(x/width,-.95,.95));
        if (!depth) return sampleRing(theta,rows);
        // Measure down or up the standing cloth, then use the same strip
        // and fraction on the posed surface. The neckline limits the top.
        const direction=Math.sign(depth);
        let distance=Math.abs(depth)*centimeter;
        let index=rows, a=standingPoint(theta,index);
        while (index+direction>=0 && index+direction<rings.length) {
          const next=index+direction, b=standingPoint(theta,next);
          const length=Math.hypot(a[0]-b[0],proportions.yAt(a[1])-proportions.yAt(b[1]),a[2]-b[2]);
          if (length>0 && distance<=length) {
            const start=sampleRing(theta,index), end=sampleRing(theta,next);
            return start.map((value,axis)=>fabricFit.mix(value,end[axis],distance/length));
          }
          distance-=length;
          index=next;
          a=b;
        }
        return sampleRing(theta,index);
      }
      const target=Array.from({length:lanes+1},(_,lane)=>{
        const position=lane/lanes*2-1;
        const across=position*halfWidth;
        const x=side*(center+across);
        const front=shellPoint(x,true);
        const back=halter?collarPoint(side*(.044+across*.32),bind[1]-.167):shellPoint(x,false);
        const crown=torsoMove([x,bind[1]-.066,bind[2]]);
        const raise=Math.max(.028,(front[1]+back[1])*.5-crown[1]);
        const frontAcross=position*(frontEnd?.half??halfWidth);
        const frontX=side*((frontEnd?.center??center)+frontAcross);
        const frontDelta=(frontEnd || frontJoin || frontSkew) &&
          shellPoint(frontX,true,frontJoin-frontSkew*frontAcross/centimeter).map((value,i)=>value-front[i]);
        const backAcross=position*(backEnd?.half??halfWidth);
        const backX=side*((backEnd?.center??center)+backAcross);
        const backDelta=(backEnd || backJoin || backSkew) &&
          (halter?collarPoint(backX,bind[1]-.167):shellPoint(backX,false,backJoin-backSkew*backAcross/centimeter)).map((value,i)=>value-back[i]);
        return {front,back,crown,raise,frontDelta,backDelta};
      });
      const strip=Array.from({length:stations+1},(_,index)=>{
        const t=index/stations;
        const arch=Math.sin(Math.PI*t);
        // Each shaped end converges to the unchanged shoulder crown.
        const blend=(1+Math.cos(2*Math.PI*t))*.5;
        return target.map(({front,back,crown,raise,frontDelta,backDelta})=>{
          const delta=t<.5?frontDelta:backDelta;
          const offset=axis=>delta ? delta[axis]*blend : 0;
          const x=fabricFit.mix(front[0],back[0],t)-(changes.hasSleeves?0:side*arch*.031*shoulderRaising)+offset(0);
          const z=fabricFit.mix(front[2],back[2],t)+offset(2);
          const height=fabricFit.mix(front[1],back[1],t)-raise*arch+offset(1);
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
      const crownStation=stations/2;
      const rendered=adjustable?[]:strip;
      function clearSegment(first,last,direction) {
        for (let i=first+1;i<=last;i++) {
          const a=strip[i-1],b=strip[i];
          // Sample extra points where the strap drops down the shoulder.
          // Clearing only the ends of a long panel can leave its middle inside skin.
          const steps=Math.max(1,Math.ceil(Math.max(...a.map((p,j)=>Math.abs(p[1]-b[j][1])))/.012));
          for (let step=1;step<=steps;step++) {
            if (i===last && step===steps) rendered.push(b);
            else rendered.push(a.map((p,j)=>{
              const point=p.map((n,k)=>fabricFit.mix(n,b[j][k],step/steps));
              point[2]=outsideShoulder(point,direction);
              return point;
            }));
          }
        }
      }
      let crown=crownStation;
      if (adjustable) {
        if (frontJoin || frontSkew) {
          rendered.push(strip[0]);
          clearSegment(0,crownStation,1);
        } else rendered.push(...strip.slice(0,crownStation+1));
        crown=rendered.length-1;
        clearSegment(crownStation,stations,-1);
      }
      const projected=drawStrip(rendered);
      if (adjustable && componentKeys.size) {
        for (const [name,front] of [['Front',true],['Back',false]]) {
          if ((front?spin:-spin)+side*sine*.53<.10) continue;
          const half=front?projected.slice(0,crown+1):projected.slice(crown).reverse();
          const division=Math.max(2,Math.floor(half.length*.25));
          addComponent('strap'+name+'Curve',[half.slice(division).map(line=>line[lanes/2])]);
          addComponent('strap'+name+'Taper',[half[1]]);
          if (front || !halter) {
            addComponent('strap'+name+'Join',[half.slice(0,division+1).map(line=>line[lanes/2])],{radius:8,priority:2});
            addComponent('strap'+name+'Angle',[half[0]],{radius:8,priority:2});
          }
        }
      }
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
  const decorMix=(a,b,t)=>a.map((n,i)=>fabricFit.mix(n,b[i],t));
  const decorDistance=(a,b)=>Math.hypot(...a.map((n,i)=>n-b[i]));
  const thetaDelta=(a,b)=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)));
  function surfaceRowPoint(surface,theta,row) {
    const at=fabricFit.clamp(row,0,surface.geometry.length-1);
    const low=Math.floor(at), high=Math.ceil(at);
    return decorMix(surface.sampleRing(theta,low),surface.sampleRing(theta,high),at-low);
  }
  function shellHeightPoint(theta,height) {
    const columns=columnsOfShell();
    const position=((theta/(2*Math.PI)*columns.length)%columns.length+columns.length)%columns.length;
    const i=Math.floor(position);
    return decorMix(pointAtHeight(columns[i].levels,height),pointAtHeight(columns[(i+1)%columns.length].levels,height),position-i);
  }
  function pocketBounds(surface) {
    const start=Math.max(surface.rings[0][0]+.065,model==='top'?-.47:model==='trousers'?-.10:-.035);
    const end=Math.min(surface.rings.at(-1)[0]-.025,start+(model==='top'?.155:.21));
    return {start,end};
  }
  function verticalTrim(surface,path,trim,{skip,frontEdge=false,key='laceSeam'}={}) {
    let run=[];
    function paintRun() {
      if (run.length<2) {run=[];return;}
      const edge=run.map(({theta,row})=>surfaceRowPoint(surface,theta,row));
      const normalAt=(j,k,t)=>{
        const theta=fabricFit.mix(run[j].theta,run[k].theta,t);
        return [Math.cos(theta),0,Math.sin(theta)];
      };
      const direction=frontEdge && Math.cos(run[0].theta)<0?-1:1;
      drawLace(trim,edge,edge,key,{closed:false,alignment:frontEdge?0:.5,normalAt,
        acrossAt:(j,k,t,offset)=>{
          const row=fabricFit.mix(run[j].row,run[k].row,t);
          const theta=fabricFit.mix(run[j].theta,run[k].theta,t);
          const radius=Math.max(.045,decorDistance(surfaceRowPoint(surface,theta-.03,row),surfaceRowPoint(surface,theta+.03,row))/.06);
          const shift=frontEdge?Math.max(.005,offset+.007)*direction:offset;
          return surfaceRowPoint(surface,theta+shift/radius,row);
        }});
      run=[];
    }
    for (const entry of path) {
      if (skip?.(entry)) paintRun();
      else run.push(entry);
    }
    paintRun();
  }
  function decorativeSeam(surface,angles,trim,panel=false) {
    const pocket=pocketBounds(surface);
    const closure=designClosure;
    const closureTheta=closure==='Invisible zipper'||closure==='Back lacing'||closure==='Back button and loop'?
      1.5*Math.PI:closure==='Side zipper'?.14:Math.PI/2;
    const closureStop=({ 'Invisible zipper':.68,'Side zipper':.43,'Zip fly':.26,'Separating zipper':1,
      'Button fly':.30,'Front buttons':.87,'Front busk':.87,'Back lacing':.86,'Back button and loop':.16 })[closure];
    const skipClosures=surface===surfaces.shell;
    const zipped=skipClosures && panel && Number.isFinite(garmentSeams.panelZipper);
    let distance=0;
    let previous;
    const path=angles.map((theta,row)=>{
      const [x,y,z]=surface.standingPoint(theta,row);
      const point=[x,proportions.yAt(y),z];
      if (previous) distance+=decorDistance(point,previous);
      previous=point;
      return {theta,row,y,distance};
    });
    verticalTrim(surface,path,trim,{skip:({theta,row,y,distance})=>
      (zipped && distance<(garmentSeams.panelZipper+1)*centimeter) ||
      (skipClosures && closureStop && thetaDelta(theta,closureTheta)<.15+trim.width*.024 && row/path.length<closureStop+.03) ||
      (skipClosures && design.pocket==='In-seam pockets' && Math.abs(Math.cos(theta))>.95 &&
        y>=pocket.start-.011 && y<=pocket.end+.011)});
  }
  function waistbandTrim(surface,trim) {
    const edge=surface.geometry[0];
    const columns=columnsOfShell();
    const count=edge.length;
    const opening=designClosure==='Side zipper'?.14:/^(?:Zip fly|Button fly)$/.test(designClosure)?Math.PI/2:null;
    drawLace(trim,edge,surface.geometry[1],'laceWaistband',{
      visible:opening===null?null:index=>thetaDelta(index/count*2*Math.PI,opening)>.06,
      normalAt:(j,k,t)=>{const theta=(j+t)/count*2*Math.PI;return [Math.cos(theta),0,Math.sin(theta)];},
      acrossAt:(j,k,t,offset)=>{
        const a=columns[j].levels, b=columns[k].levels;
        const drop=Math.max(0,offset+.007);
        return decorMix(pointAtHeight(a,a[0].height+drop),pointAtHeight(b,b[0].height+drop),t);
      }
    });
  }
  function paintStitchedDetails() {
    for (const [index,detail] of stitchDetails.entries()) {
      const part=detail.placement==='sleeves'?'sleeve':detail.placement==='hem'&&model==='trousers'?'leg':'shell';
      for (const surface of surfaceParts[part] || []) drawStitchedDetail(surface,detail,'stitchDetail:'+index);
    }
  }
  function drawStitchedDetail(surface,detail,key) {
    const {style,placement,depth,spacing,fullness}=detail;
    const gathered=style==='Gathered ruffle';
    const pintuck=style==='Pintucks';
    const atEnd=placement==='hem'||placement==='sleeves';
    const waist=placement==='waist'&&model==='dress'?
      proportions.yAt(-.25)+(garmentSeams.waistSeam||0)*centimeter:null;
    const drop=depth*centimeter;
    const count=surface.geometry[0].length;
    const centerRing=Array.from({length:count},(_,i)=>waist===null?
      surface.geometry[atEnd?surface.geometry.length-1:0][i]:
      shellHeightPoint(i/count*2*Math.PI,waist));
    const perimeter=centerRing.reduce((sum,p,i)=>sum+decorDistance(p,centerRing[(i+1)%count]),0);
    const repeat=fabricFit.clamp(Math.round(perimeter/(gathered?.115/Math.sqrt(fullness||1):spacing*centimeter)),1,42);
    const samples=Math.max(count,repeat*(pintuck?10:6));
    const softness=(1-.60*(material?.bend||0))/(1+(material?.gsm||0)/720);
    const fold=studioDesign.stitchFoldDepth(detail)*centimeter;
    const wrinkle=fabricFit.clamp((fullness-1)*.42,.14,1);
    const fullnessLift=gathered?Math.min(.091,drop*.48)*(.49+.51*softness)*wrinkle:
      Math.min(.060,drop*.36,fold*.68)*(1-.32*softness);
    const paintBase=color(pattern.color).slice(1).match(/../g).map(hex=>parseInt(hex,16));
    const frontClosures=['Front buttons','Front busk','Separating zipper','Zip fly','Button fly'];
    const backClosures=['Back button and loop','Back lacing','Invisible zipper'];
    const opening=atEnd?null:placement==='neckline'&&Number.isFinite(garmentSeams.panelZipper)?
      Math.PI/2-(garmentSeams.panelAngle||0)*Math.PI/180:frontClosures.includes(designClosure)?Math.PI/2:
        backClosures.includes(designClosure)?1.5*Math.PI:designClosure==='Side zipper'?.14:null;
    const rows=5;
    const outline=centerRing.map((_,i)=>{
      if (waist!==null) {
        const {levels}=columnsOfShell()[i];
        return [centerRing[i],...levels.filter(level=>level.height>waist+.0001).map(level=>level.point)];
      }
      if (!atEnd) return surface.geometry.map(row=>row[i]);
      const last=surface.geometry.at(-1)[i];
      if (pintuck) return surface.geometry.map((_,j)=>surface.geometry.at(-1-j)[i]);
      const previous=surface.geometry.at(-2)[i];
      const distance=decorDistance(previous,last);
      return [last,last.map((n,k)=>n+(n-previous[k])*drop/Math.max(.003,distance))];
    });
    function pointAlong(path,distance) {
      if (!distance) return path[0];
      for (let i=1;i<path.length;i++) {
        const edge=decorDistance(path[i-1],path[i]);
        if (distance<=edge) return decorMix(path[i-1],path[i],distance/Math.max(.0001,edge));
        distance-=edge;
      }
      const last=path.at(-1), previous=path.at(-2);
      if (!previous) return last;
      return last.map((n,k)=>n+(n-previous[k])*distance/Math.max(.003,decorDistance(last,previous)));
    }
    function normalBetween(a,b,c,theta) {
      const u=b.map((n,k)=>n-a[k]);
      const v=c.map((n,k)=>n-a[k]);
      const cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
      const magnitude=Math.hypot(...cross);
      if (magnitude<.0000001) return [Math.cos(theta),0,Math.sin(theta)];
      const winding=atEnd&&pintuck?1:-1;
      return cross.map(n=>winding*n/magnitude);
    }
    function foldProfile(value) {
      if (gathered) return .5+.5*Math.cos(2*Math.PI*value);
      const t=value-Math.floor(value);
      if (pintuck) return Math.max(0,1-Math.abs(t-.25)*7);
      if (style==='Knife pleats') return t<.72?t/.72:(1-t)/.28;
      const box=fabricFit.clamp(1-Math.max(0,Math.abs(t-.5)-.22)*8,0,1);
      return style==='Inverted pleats'?1-box:box;
    }
    const ribbon=Array.from({length:samples},(_,i)=>{
      const theta=i/samples*2*Math.PI;
      const station=i/samples*count;
      const column=Math.floor(station), next=(column+1)%count, t=station-column;
      const start=centerRing[column], adjacent=centerRing[next];
      const inward=pointAlong(outline[column],.03);
      const norm=normalBetween(start,adjacent,inward,theta);
      const points=Array.from({length:rows+1},(_,j)=>{
        const fall=j/rows;
        const profile=foldProfile(i*repeat/samples+fall*(gathered?.26:0));
        const base=decorMix(pointAlong(outline[column],drop*fall),pointAlong(outline[next],drop*fall),t);
        const amplitude=pintuck?fold*Math.sin(Math.PI*fall)**.58:fullnessLift*fall**.73;
        const flare=gathered?drop*.16*fall**1.8:0;
        const lift=.006+amplitude*profile+flare;
        let point=base.map((n,k)=>n+norm[k]*lift);
        if (point[1]>1.126) point=[point[0]+norm[0]*(point[1]-1.126)*.4,1.126,point[2]+norm[2]*(point[1]-1.126)*.4];
        return {projected:project(point),profile};
      });
      return {points,theta};
    });
    for (let i=0;i<samples;i++) {
      const a=ribbon[i],b=ribbon[(i+1)%samples],theta=a.theta+Math.PI/samples+angle;
      if (opening!==null && thetaDelta(theta-angle,opening)<.09) continue;
      for (let j=0;j<rows;j++) {
        const vertices=[a.points[j],b.points[j],b.points[j+1],a.points[j+1]];
        const points=vertices.map(p=>p.projected);
        const profile=vertices.reduce((sum,p)=>sum+p.profile,0)/4;
        const light=(.78+.17*Math.cos(theta-1.95)+.086*Math.sin(theta))*(.82+profile*.24);
        const swatch=fabricFit.sample(selectedSwatch?.photo,i/samples*3,j/rows*drop*3,analysis?.redraw);
        const paint='rgb('+(swatch||paintBase).map(n=>Math.min(255,Math.round(n*light))).join(',')+')';
        faces.push({points,depth:points.reduce((sum,p)=>sum+p[2],0)/4,paint,skipStroke:true});
      }
    }
    const angles=ribbon.map(({theta})=>opening!==null && thetaDelta(theta,opening)<.09?-angle:theta);
    const mid=ribbon.map(station=>station.points[Math.ceil(rows/2)].projected);
    const edge=ribbon.map(station=>station.points.at(-1).projected);
    const rail=ribbon.map(station=>station.points[0].projected);
    addComponent(key,[...visiblePaths(mid,angles),...visiblePaths(edge,angles)],{radius:12,priority:4});
    for (const points of visiblePaths(rail,angles)) markings.push({points,style:'rgba(53,30,43,.39)'});
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
    const panelSaved=Object.hasOwn(garmentSeams,'panelSeam');
    if (eligible.includes('waistSeam') && (waistSaved || showGuides)) {
      const y=proportions.yAt(-.25)+(garmentSeams.waistSeam||0)*unit;
      const points=columnsOfShell().map(({theta,levels})=>onSurface(pointAtHeight(levels,y),theta));
      markings.push({points,closed:true,style:style(waistSaved)});
      if (componentKeys.has('waistSeam')) addComponent('waistSeam',[viewArc(theta=>aroundAt(theta,points))],{radius:9});
    }
    if (eligible.includes('panelSeam') && (panelSaved || showGuides)) {
      const target=model==='skirt'?fabricFit.mix(surface.rings[0][0],surface.rings.at(-1)[0],.32):model==='top'?-.39:-.34;
      const selected=surface.rings.reduce((best,row,i)=>Math.abs(row[0]-target)<Math.abs(surface.rings[best][0]-target)?i:best,0);
      const single=garmentSeams.panelSeam===studioDesign.centerFrontSeam;
      const rows=surface.rings.map(([y],i)=>{
        const row=surface.rest[i];
        return [y,(row[0][0]-row[row.length/2][0])/(2*unit)];
      });
      const panelOffsets=offsetOnSide(-1,'panelSeam') || offsetOnSide(1,'panelSeam');
      const paths=!single && (panelOffsets || hasAsymmetricShell) ? [-1,1].map((side,index)=>{
        const localRows=hasAsymmetricShell?rows.map(([y],i)=>{
          const ring=surface.rest[i];
          return [y,side*ring[side>0?0:ring.length/2][0]/unit];
        }):rows;
        return studioDesign.panelSeamPaths(model,(garmentSeams.panelSeam||0)+offsetOnSide(side,'panelSeam'),localRows)[index];
      }):studioDesign.panelSeamPaths(model,garmentSeams.panelSeam,rows,garmentSeams.panelAngle);
      if (showGuides && !single) editorMetadata.panelSeamSnapOffset=studioDesign.panelSeamSnapOffset(model,...rows[selected]);
      for (const [index,path] of paths.entries()) {
        const points=path.map((theta,i)=>onSurface(surface.sampleRing(theta,i),theta));
        if (!single || Math.sin(path[selected]+angle)>0) markings.push({points,style:style(panelSaved)});
        const matchesSide=!focusedSide || single || (index===0?-1:1)===focusedSide;
        if (matchesSide && (!single || !Number.isFinite(garmentSeams.panelZipper))) {
          addComponent(single?'panelAngle':'panelSeam',visiblePaths(points,path),{radius:9});
        }
        if (panelSaved && garmentLace.seams) decorativeSeam(surface,path,garmentLace.seams,true);
      }
      if (single && (analysis?.editor || Number.isFinite(garmentSeams.panelZipper))) {
        const theta=paths[0][0];
        const rest=surface.rings.map((_,index)=>{
          const [x,y,z]=surface.standingPoint(theta,index);
          return [x,proportions.yAt(y),z];
        });
        const distances=[0];
        for (let i=1;i<rest.length;i++) {
          const length=Math.hypot(...rest[i].map((n,k)=>n-rest[i-1][k]))/unit;
          distances.push(distances[i-1]+length);
        }
        const maxLength=Math.min(studioDesign.panelZipperLimits[1],Math.max(0,Math.floor((distances.at(-1)-1)*2)/2));
        if (editing) editorMetadata.panelZipperMaxLength=maxLength;
        if (Number.isFinite(garmentSeams.panelZipper) && Math.sin(theta+angle)>0) {
          const length=Math.min(garmentSeams.panelZipper,maxLength);
          const invisible=garmentSeams.panelZipperKind==='Invisible zipper';
          const railWidth=invisible?.012:.028;
          function zipPoint(around,distance) {
            const end=Math.max(1,distances.findIndex(value=>value>=distance));
            const t=(distance-distances[end-1])/Math.max(.00001,distances[end]-distances[end-1]);
            const a=surface.sampleRing(around,end-1), b=surface.sampleRing(around,end);
            return onSurface(a.map((n,k)=>fabricFit.mix(n,b[k],t)),around);
          }
          for (const offset of [-railWidth,railWidth]) {
            const around=theta+offset;
            const points=distances.filter(distance=>distance<length).map(distance=>zipPoint(around,distance));
            points.push(zipPoint(around,length));
            const style=invisible?'rgba('+tone+',.72)':'rgba(212,175,110,.94)';
            markings.push({points,style});
          }
          if (componentKeys.has('panelZipper') || componentKeys.has('panelAngle')) {
            const bottom=zipPoint(theta,length);
            const top=distances.filter(distance=>distance<length).map(distance=>zipPoint(theta,distance));
            const lower=distances.filter(distance=>distance>length).map(distance=>zipPoint(theta,distance));
          addComponent('panelZipper',[[...top,bottom]],{radius:9,priority:4});
            addComponent('panelAngle',[[bottom,...lower]],{radius:9});
          }
          const pull=[[-.027,1.1],[.027,1.1],[.049,2.6],[-.049,2.6]]
            .map(([around,distance])=>zipPoint(theta+around,Math.min(distance,length)));
          markings.push({points:pull,closed:true,style:'rgba(244,216,152,.99)'});
        }
      }
    }
  }

  function paintLayer(section,rows,cloth,weave,opacity,channels,joined,ruffle,fluteCount) {
    const segments=section.length;
    for (let i=0;i<segments;i++) {
      const a=section[i],b=section[(i+1)%segments];
      if (!a.supported || !b.supported || a.hidden && b.hidden) continue;
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
        const fluteLight=ruffle?.18*(a.gather+b.gather)*.5*Math.cos(fluteCount*(theta-angle)+.64*band):0;
        const light=(.76+.23*Math.cos(theta-1.95)+.11*Math.sin(theta)+grain+fluteLight)*(inner?.90:1)*(edge?.91:1);
        const tint=channels.map(c=>fabricFit.clamp(Math.round(c*light*swatch),0,255));
        const paint=opacity===1?'rgb('+tint.join(',')+')':'rgba('+tint.join(',')+','+opacity+')';
        const depth=points.reduce((sum,p)=>sum+p[2],0)/4;
        faces.push({points,depth,paint,skipStroke:opacity<1,seam:edge});
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
    const shellSurface=surfaces.shell;
    const regularHems=garmentLayers.some(layer=>Object.hasOwn(layer,'hemStyle') || ['Overskirt','Underskirt'].includes(layer.kind))
      ?columns.map(({theta})=>proportions.yAt(shellSurface.standingPoint(theta,shellSurface.rings.length-1,false)[1]))
      :null;
    const entries=garmentLayers.map((layer,index)=>({layer,index}));
    const ordered=[...entries.filter(({layer})=>layer.kind==='Underskirt'),...entries.filter(({layer})=>layer.kind!=='Underskirt')];
    const stack=[];
    // Keep most of the main garment's color visible even through a full stack.
    const mapOpacity=regions?1-.68**(1/garmentLayers.length):1;
    for (const {layer,index} of ordered) {
      const under=layer.kind==='Underskirt';
      const tier=layer.kind==='Tier';
      const ruffle=layer.kind==='Ruffle';
      const waistLayer=under || layer.kind==='Overskirt';
      const waistMounted=waistLayer && !layer.attachment && !layer.leftAttachment && !layer.rightAttachment;
      const ownContour=Object.hasOwn(layer,'hemStyle');
      const attachmentReference=ownContour || waistLayer?regularHems[segments/4]:frontHem;
      const minimumDrop=.036;
      const plans=columns.map(({theta,hem,levels},i)=>{
        const percent=studioDesign.layerAttachmentAt(layer,theta,model);
        const requested=fabricFit.mix(waist,attachmentReference,percent/100);
        const top=levels[0].height;
        const clothEnd=Math.min(hem,floor);
        const supported=clothEnd>top;
        const reference=ownContour?regularHems[i]:hem;
        const contour=ownContour?studioDesign.hemOffsetAt(layer,theta)*unit:0;
        const fixedHem=reference+unit*(layer.hemOffset??0)+contour;
        // A legacy waist-mounted layer could already have an impossible
        // shortened hem. Keep its old minimum-depth fallback until moved.
        const lastJoin=ruffle || waistMounted?clothEnd:Math.min(clothEnd,fixedHem);
        const bottom=Math.max(top,lastJoin-minimumDrop);
        // An attachment must land on cloth, even where a fairy point rises
        // above the requested seam. Keep enough room for a finished edge.
        const attachment=supported?fabricFit.clamp(requested,top,bottom):top;
        const desiredHem=ruffle?attachment+unit*layer.depth+contour:fixedHem;
        const end=supported?Math.min(floor,Math.max(attachment+minimumDrop,desiredHem)):attachment;
        const sweepCm=studioDesign.layerSweepAt?.(layer,theta) ?? layer.sweep;
        return {attachment,end,supported,sweep:unit*sweepCm/(2*Math.PI),gather:sweepCm/(sweepCm+70)};
      });
      const joined=tier || ruffle || plans.some(plan=>plan.attachment!==waist);
      const gap=under?-.012:.008;
      const cloth=getFabric(layer.fabric);
      const weave=fabricFit.weave(layer.fabric,cloth.category);
      const opacity=Math.min(layer.opacity/100,mapOpacity);
      const channels=color(layer.color).slice(1).match(/../g).map(n=>parseInt(n,16));
      const front=plans[segments/4];
      const frontLength=Math.max(.042,front.end-front.attachment);
      const variableLength=ownContour || plans.some(plan=>plan.attachment!==front.attachment);
      const length=variableLength?Math.max(.042,...plans.map(plan=>plan.end-plan.attachment)):frontLength;
      const rows=Math.max(8,Math.ceil(length/(thumbnail?.078:.050)));
      const fluteCount=11;
      const section=columns.map(({theta,levels,restHem,hem,posedHem},i)=>{
        const {attachment,end,supported,sweep,gather}=plans[i];
        const localLength=variableLength?Math.max(.042,end-attachment):frontLength;
        const start=under?Math.min(end,Math.max(attachment,hem-.014)):attachment;
        const hidden=!supported || under && end<=hem+.001;
        const dx=Math.cos(theta),dz=Math.sin(theta);
        const movedHem=skirtMove(restHem,theta,cloth);
        const correction=posedHem.map((n,i)=>n-movedHem[i]);
        const vertices=Array.from({length:rows+1},(_,j)=>{
          const fraction=j/rows;
          const y=fabricFit.mix(start,end,fraction);
          const drop=fabricFit.clamp((y-attachment)/Math.max(minimumDrop,end-attachment),0,1);
          const extension=Math.max(0,y-hem);
          let point;
          if (extension>0) {
            const canonical=proportions.baseAt((1.128-y)/unit);
            const fade=Math.max(0,1-extension/.24);
            point=skirtMove([restHem[0],canonical,restHem[2]],theta,cloth)
              .map((n,i)=>n+correction[i]*fade);
          } else point=pointAtHeight(levels,y);
          const spread=ruffle?Math.min(.28,localLength*.9)*gather*drop**.85:drop**(tier?.73:1.28)*sweep;
          const fullness=ruffle?Math.min(.14,localLength*.64)*gather*(1-.43*cloth.bend)*drop**.8:
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
        return {start,end,vertices,points:vertices.map(project),supported,hidden,gather};
      });
      stack.push(section);
      const active=editing?.layerIndex===index;
      const layerKey=key=>active?key:key+':'+index;
      const priority=1+stack.length*.05+(active?.015:0);
      function layerPaths(edge,center=near,span=1.48,count=25,visibleOnly=false) {
        const paths=[];
        let path=[];
        for (const theta of viewArc(theta=>theta,center,span,count)) {
          const position=((theta/(2*Math.PI)*segments)%segments+segments)%segments;
          const i=Math.floor(position);
          const a=section[i],b=section[(i+1)%segments];
          if (a.supported && b.supported && (!visibleOnly || !a.hidden && !b.hidden)) path.push(aroundAt(theta,edge));
          else {
            if (path.length>1) paths.push(path);
            path=[];
          }
        }
        if (path.length>1) paths.push(path);
        return paths;
      }
      if (regions && section.some(column=>!column.hidden)) {
        const near=Math.PI/2-angle;
        const edgeTint=channels.map(channel=>Math.round(channel*.60+52));
        const style='rgba('+edgeTint.join(',')+',.68)';
        for (const row of joined?[0,rows]:[rows]) {
          const edge=section.map(column=>column.points[row]);
          for (const points of layerPaths(edge,near,Math.PI/2,segments/2)) markings.push({points,style});
        }
      }
      if (editing) {
        const cssScale=scale*Math.cos(tilt)*(canvas.clientHeight||height)/Math.max(1,height);
        const span=Math.max(30,(attachmentReference-waist)*cssScale);
        (editorMetadata.layerAttachmentDragSpans??={})[index]=span;
        if (active) editorMetadata.layerAttachmentDragSpan=span;
      }
      const joinKey=layerKey('layerAttachment');
      if ((active || !under) && componentKeys.has(joinKey)) {
        // The inside join is concealed by the main shell. Put the guide on
        // the shell over that same attachment line, not at the visible hem.
        const first=under?columns.map(({theta,levels},i)=>liftedPoint(pointAtHeight(levels,plans[i].attachment),theta)):
          section.map(column=>column.points[0]);
        addComponent(joinKey,layerPaths(first),{radius:9,guide:active,priority});
      }
      if (section.some(column=>!column.hidden)) {
        const hem=section.map(column=>column.points.at(-1));
        addComponent(layerKey('layerHem'),layerPaths(hem,near,.59,25,true),{radius:10,guide:active,priority});
        const sweepKey=layerKey('layerSweep');
        if (componentKeys.has(sweepKey)) {
          const edge=section.map(column=>column.points[Math.round(rows*.77)]);
          addComponent(sweepKey,[-1,1].flatMap(side=>layerPaths(edge,near+side*1.07,.32,25,true)),
            {radius:12,guide:active,priority});
        }
      }
      paintLayer(section,rows,cloth,weave,opacity,channels,joined,ruffle,fluteCount);
      if (layer.laceTrim && section.some(column=>!column.hidden)) {
        drawLace(layer.laceTrim,section.map(column=>column.vertices[rows]),section.map(column=>column.vertices[rows-1]),
          layerKey('layerLaceTrim'),{visible:i=>section[i].supported && !section[i].hidden,opacity});
      }
    }
  }

  function drawFittedLayers(surface) {
    if (!garmentLayers.length) return;
    const {rest,geometry,side,moveEnd}=surface;
    const segments=rest[0].length;
    const hemRow=geometry.at(-1);
    const restHem=rest.at(-1);
    const centerOf=row=>[0,1,2].map(axis=>row.reduce((sum,p)=>sum+p[axis],0)/segments);
    const centers=geometry.map(centerOf);
    const restCenter=centerOf(restHem);
    const floor=proportions.yAt(1.105);
    const minimumDrop=.036;
    const legJoin=side?proportions.yAt(shell.at(-1)[0])+.041:-Infinity;
    const mapOpacity=regions?1-.68**(1/garmentLayers.length):1;
    const stack=[];
    const columns=restHem.map((end,i)=>{
      const theta=i*2*Math.PI/segments;
      const levels=rest.map((row,j)=>({height:proportions.yAt(row[i][1]),point:geometry[j][i],center:centers[j]}))
        .sort((a,b)=>a.height-b.height);
      const centerLevels=levels.map(({height,center})=>({height,point:center}));
      const hem=levels.at(-1).height;
      const baseEnd=moveEnd(end,theta);
      const correction=hemRow[i].map((n,k)=>n-baseEnd[k]);
      function sample(height) {
        if (height<=hem) {
          const point=pointAtHeight(levels,height);
          const center=pointAtHeight(centerLevels,height);
          return {point,center};
        }
        const canonical=proportions.baseAt((1.128-height)/centimeter);
        const extension=height-hem;
        const fade=Math.max(0,1-extension/.24);
        const section=side?avatar?.sectionAt('leg',canonical):null;
        const across=Math.cos(theta), depth=Math.sin(theta);
        const center=[section?side*section[2]:restCenter[0],canonical,section?.[3]??restCenter[2]];
        const x=section?center[0]+Math.sign(across)*Math.max(Math.abs(end[0]-restCenter[0]),(section[0]+.014)*Math.abs(across)):end[0];
        const z=section?center[2]+Math.sign(depth)*Math.max(Math.abs(end[2]-restCenter[2]),(section[1]+.016)*Math.abs(depth)):end[2];
        const blend=Math.min(1,extension/.085);
        const placed=[fabricFit.mix(end[0],x,blend),canonical,fabricFit.mix(end[2],z,blend)];
        return {point:moveEnd(placed,theta).map((n,k)=>n+correction[k]*fade),center:moveEnd(center,theta)};
      }
      // The leg mesh overlaps the seat shell at its first rings. Use the
      // exposed upper leg edge so its layer stays clear of the hip panel.
      const top=Math.max(levels[0].height,Math.min(legJoin,hem-minimumDrop));
      return {theta,top,hem,sample};
    });
    const entries=garmentLayers.map((layer,index)=>({layer,index,inside:studioDesign.layerIsInner(layer)}));
    const ordered=[...entries.filter(entry=>entry.inside),...entries.filter(entry=>!entry.inside)];
    for (const {layer,index,inside} of ordered) {
      const cloth=getFabric(layer.fabric);
      const weave=fabricFit.weave(layer.fabric,cloth.category);
      const opacity=Math.min(layer.opacity/100,mapOpacity);
      const channels=color(layer.color).slice(1).match(/../g).map(n=>parseInt(n,16));
      const ruffle=layer.kind==='Ruffle';
      const tier=layer.kind==='Tier';
      const fluteCount=side?7:11;
      const plans=columns.map(({theta,top,hem})=>{
        const sideAngle=side?(side>0?0:Math.PI):theta;
        const percent=studioDesign.layerAttachmentAt(layer,sideAngle,model)/100;
        const sweep=studioDesign.layerSweepAt(layer,sideAngle)*(side?.5:1);
        const profile=studioDesign.hemOffsetAt(layer,theta)*centimeter;
        const fixed=hem+(layer.hemOffset??0)*centimeter+profile;
        const requested=fabricFit.mix(top,hem,percent);
        const lastJoin=Math.min(hem,floor,ruffle?Infinity:fixed)-minimumDrop;
        const attachment=fabricFit.clamp(requested,top,Math.max(top,lastJoin));
        const end=Math.min(floor,Math.max(attachment+minimumDrop,ruffle?attachment+layer.depth*centimeter+profile:fixed));
        const start=inside?Math.min(end,Math.max(attachment,hem-.014)):attachment;
        return {attachment,start,end,gather:sweep/(sweep+70),spread:sweep*centimeter/(2*Math.PI)};
      });
      const rows=Math.max(8,Math.ceil(Math.max(...plans.map(plan=>plan.end-plan.start))/(thumbnail?.078:.050)));
      const section=columns.map(({theta,hem,sample},i)=>{
        const {attachment,start,end,gather,spread}=plans[i];
        const length=Math.max(minimumDrop,end-attachment);
        const supported=end>attachment;
        const hidden=!supported || inside && end<=hem+.001;
        const vertices=Array.from({length:rows+1},(_,j)=>{
          const height=fabricFit.mix(start,end,j/rows);
          const fraction=fabricFit.clamp((height-attachment)/length,0,1);
          const extension=Math.max(0,height-hem);
          const {point,center}=sample(height);
          const radial=[point[0]-center[0],side?point[1]-center[1]:0,point[2]-center[2]];
          const magnitude=Math.hypot(...radial)||1;
          const normal=radial.map(n=>n/magnitude);
          const wave=theta*(ruffle?fluteCount:tier?10:8)+fraction*(ruffle?.64:1.9);
          const fullness=ruffle?Math.min(.13,length*.63)*gather*(1-.43*cloth.bend)*fraction**.8:
            (.012+spread*.10)*(1-.64*cloth.bend)*fraction**1.45;
          const drape=ruffle?Math.min(.26,length*.86)*gather*fraction**.85:spread*fraction**(tier?.73:1.28);
          const release=inside?fabricFit.clamp(extension/.105,0,1):1;
          let offset=(inside?-.009:.008)+release*Math.max(0,drape+Math.cos(wave)*fullness);
          if (!inside || extension>.014) for (const previous of stack) {
            const panel=previous[i];
            if (panel.hidden || height<panel.start-.045 || height>panel.end+.045) continue;
            const t=fabricFit.clamp((height-panel.start)/Math.max(.001,panel.end-panel.start),0,1)*(panel.vertices.length-1);
            const a=panel.vertices[Math.floor(t)],b=panel.vertices[Math.ceil(t)];
            const depth=normal.reduce((sum,n,k)=>sum+(fabricFit.mix(a[k],b[k],t%1)-point[k])*n,0);
            const edge=fabricFit.clamp(1-Math.max(panel.start-height,height-panel.end,0)/.045,0,1);
            offset+=Math.max(0,depth+.009-offset)*edge*edge*(3-2*edge);
          }
          // Keep each trouser layer on its own leg even at a large sweep.
          if (side && side*normal[0]<-.01) offset=Math.min(offset,Math.max(.004,(side*point[0]+.006)/(-side*normal[0])));
          const moved=fabricFit.followThrough(point,theta,fraction,pose,cloth);
          const position=point.map((n,k)=>n+normal[k]*offset+(moved[k]-n)*.52*release);
          if (ruffle) position[1]+=Math.sin(wave)*fullness*.24*fraction;
          return !side && extension && shellContact?shellContact(position,theta):position;
        });
        return {start,end,vertices,points:vertices.map(project),supported,hidden,gather};
      });
      stack.push(section);
      const active=editing?.layerIndex===index;
      const key=name=>active?name:name+':'+index;
      const priority=1+stack.length*.05+(active?.015:0);
      function paths(points,center,span,visibleOnly=true) {
        const result=[];
        let path=[];
        for (const theta of viewArc(theta=>theta,center,span,25)) {
          const i=Math.floor(((theta/2/Math.PI*segments)%segments+segments)%segments);
          const a=section[i],b=section[(i+1)%segments];
          if (a.supported && b.supported && (!visibleOnly || !a.hidden && !b.hidden)) path.push(aroundAt(theta,points));
          else {
            if (path.length>1) result.push(path);
            path=[];
          }
        }
        if (path.length>1) result.push(path);
        return result;
      }
      if (editing) {
        const reference=columns[Math.round(segments/4)];
        const cssScale=scale*Math.cos(tilt)*(canvas.clientHeight||height)/Math.max(1,height);
        const spans=editorMetadata.layerAttachmentDragSpans??={};
        spans[index]=Math.max(spans[index]||30,(reference.hem-reference.top)*cssScale);
        if (active) editorMetadata.layerAttachmentDragSpan=spans[index];
      }
      const attachmentKey=key('layerAttachment');
      if ((active || !inside) && componentKeys.has(attachmentKey)) {
        const edge=inside?columns.map(({theta,sample},i)=>liftedPoint(sample(plans[i].attachment).point,theta)):
          section.map(column=>column.points[0]);
        addComponent(attachmentKey,paths(edge,near,1.48,false),{radius:9,guide:active,priority});
      }
      if (section.some(column=>!column.hidden)) {
        const edge=section.map(column=>column.points.at(-1));
        if (componentKeys.has(key('layerHem'))) {
          addComponent(key('layerHem'),paths(edge,near,.73),{radius:10,guide:active,priority});
        }
        if (componentKeys.has(key('layerSweep'))) {
          const band=section.map(column=>column.points[Math.round(rows*.77)]);
          addComponent(key('layerSweep'),[-1,1].flatMap(n=>paths(band,near+n*1.07,.32)),{radius:12,guide:active,priority});
        }
        if (regions) {
          const style='rgba('+channels.map(n=>Math.round(n*.60+52)).join(',')+',.68)';
          for (const points of paths(edge,near,1.48)) markings.push({points,style});
        }
        paintLayer(section,rows,cloth,weave,opacity,channels,true,ruffle,fluteCount);
        if (layer.laceTrim) drawLace(layer.laceTrim,section.map(column=>column.vertices.at(-1)),
          section.map(column=>column.vertices.at(-2)),key('layerLaceTrim'),{visible:i=>!section[i].hidden,opacity});
      }
    }
  }

  function drawConfiguredClosure(surface,closure,detail) {
    const theta=closure==='Back button and loop'?Math.PI*1.5:
      detail.placement==='left'?.38:detail.placement==='right'?Math.PI-.38:Math.PI/2;
    const vector=(a,b)=>a.map((n,i)=>n-b[i]);
    const dot=(a,b)=>a.reduce((sum,n,i)=>sum+n*b[i],0);
    const normalized=points=>{
      const length=Math.hypot(...points)||1;
      return points.map(n=>n/length);
    };
    const cross=([x,y,z],[a,b,c])=>[y*c-z*b,z*a-x*c,x*b-y*a];
    const ringCount=surface.rings.length;
    function trace(around) {
      const rest=surface.rings.map((_,i)=>{
        const [x,y,z]=surface.standingPoint(around,i);
        return [x,proportions.yAt(y),z];
      });
      const distances=[0];
      for (let i=1;i<ringCount;i++) distances.push(distances[i-1]+Math.hypot(...vector(rest[i],rest[i-1]))/centimeter);
      function point(distance) {
        const i=distances.findIndex(value=>value>=distance);
        const hi=i<0?ringCount-1:Math.max(1,i),lo=hi-1;
        const t=fabricFit.clamp((distance-distances[lo])/Math.max(.001,distances[hi]-distances[lo]),0,1);
        const a=surface.sampleRing(around,lo),b=surface.sampleRing(around,hi);
        return a.map((n,k)=>fabricFit.mix(n,b[k],t));
      }
      return {distances,length:distances.at(-1),point};
    }
    const channel=detail.color.slice(1).match(/../g).map(n=>parseInt(n,16));
    const colorAt=light=>'rgb('+channel.map(n=>Math.round(fabricFit.clamp(n*light,0,255))).join(',')+')';
    const plain=colorAt(1),rim=colorAt(.74);
    const track=trace(theta);
    const left=trace(theta-.032),right=trace(theta+.032);
    const outward=[Math.cos(theta),0,Math.sin(theta)];
    function frame(distance) {
      const center=track.point(distance);
      const across=normalized(vector(left.point(distance),right.point(distance)));
      const heading=vector(track.point(distance+1),track.point(distance-1));
      const along=dot(heading,across);
      const down=normalized(heading.map((n,i)=>n-along*across[i]));
      let normal=normalized(cross(across,down));
      if (dot(normal,outward)<0) normal=normal.map(n=>-n);
      const local=(x,y,depth)=>center.map((n,i)=>n+across[i]*x+down[i]*y+normal[i]*depth);
      return {local,normal,down};
    }
    function surfaceFace(vertices,paint) {
      const points=vertices.map(project);
      faces.push({points,depth:points.reduce((sum,p)=>sum+p[2],0)/points.length,paint});
    }
    function circle(local,x,y,depth,radius,paint) {
      surfaceFace(Array.from({length:14},(_,i)=>{
        const a=2*Math.PI*i/14;
        return local(x+radius*Math.cos(a),y+radius*Math.sin(a),depth);
      }),paint);
    }
    const hits=[];
    if (detail.kind==='buttons') {
      const end=closure==='Button fly'?Math.min(track.length*.64,20):track.length;
      const radius=detail.diameter*centimeter*.5;
      for (let i=0;i<detail.count;i++) {
        const distance=detail.offset+i*(detail.spacing||0);
        if (distance>end) break;
        const {local,normal}=frame(distance);
        if (rotateView(normal)[2]<.06) continue;
        circle(local,0,0,.0045,radius,rim);
        circle(local,0,0,.0063,radius*.85,plain);
        for (const x of [-radius*.28,radius*.28]) circle(local,x,0,.0075,radius*.12,colorAt(.58));
        hits.push([project(local(-radius,0,.0075)),project(local(radius,0,.0075))]);
      }
    } else {
      const drawstring=detail.kind==='drawstring';
      const seamY=-.25+(garmentSeams.waistSeam||0)*centimeter;
      const waistRow=surface.rings.reduce((best,[y],i)=>Math.abs(y-seamY)<Math.abs(surface.rings[best][0]-seamY)?i:best,0);
      const distance=drawstring?detail.casingDepth*.52:(skirtFit && model==='skirt'?1.2:track.distances[waistRow]);
      if (drawstring) {
        const casingPath=viewArc(around=>{
          const point=trace(around).point(detail.casingDepth);
          return liftedPoint(point,around);
        });
        markings.push({points:casingPath,style:colorAt(.86)});
        hits.push(casingPath);
      }
      const {local,normal,down}=frame(distance);
      if (rotateView(normal)[2]>.085) {
        const top=surface.geometry[0];
        const waist=top.reduce((sum,p,i)=>sum+Math.hypot(...vector(p,top[(i+1)%top.length])),0)/centimeter;
        const loose=drawstring?Math.max(5,(detail.length-waist)*.50):detail.length;
        const length=loose*centimeter;
        const width=detail.width*centimeter;
        const spread=Math.min(.21,Math.max(width*1.05,length*.28));
        const bowRise=Math.min(.104,spread*.52);
        const depth=.021+width*.20;
        const loop=(sign,t)=>local(sign*(width*.36+spread*Math.sin(Math.PI*t)),
          bowRise*(-.84*Math.sin(2*Math.PI*t)+.14*Math.sin(Math.PI*t)),depth+spread*.10*Math.sin(Math.PI*t));
        const tail=(sign,t)=>{
          const overhang=length*.56*t;
          const at=track.point(distance+overhang/centimeter);
          const after=Math.max(0,overhang-(track.length-distance)*centimeter);
          const drift=(pose.flow||0)*Math.sin((pose.phase||0)*2+t*4)*.030*t;
          const offset=local(sign*(width*.36+spread*.78*Math.sin(t*1.5))+drift,0,depth*(1-.36*t));
          const anchor=track.point(distance);
          return at.map((n,k)=>n+offset[k]-anchor[k]+down[k]*after);
        };
        function ribbon(path,ribbonWidth) {
          const edges=path.map((point,i)=>{
            const flow=vector(path[Math.min(path.length-1,i+1)],path[Math.max(0,i-1)]);
            const lateral=normalized(cross(normal,flow));
            return [-1,1].map(side=>point.map((n,k)=>n+side*lateral[k]*ribbonWidth*.5));
          });
          for (let i=1;i<edges.length;i++) {
            surfaceFace([edges[i-1][0],edges[i-1][1],edges[i][1],edges[i][0]],plain);
          }
          hits.push(path.map(project));
        }
        circle(local,0,0,depth+.002,Math.max(.008,width*.63),plain);
        for (const sign of [-1,1]) {
          if (drawstring) {
            circle(local,sign*Math.max(.016,width*1.45),-.004,.004,Math.max(.004,width*.76),rim);
            ribbon([local(sign*Math.max(.016,width*1.45),-.004,.005),local(sign*width*.36,0,depth)],width);
          }
          ribbon(Array.from({length:15},(_,i)=>loop(sign,i/14)),width);
          ribbon(Array.from({length:13},(_,i)=>tail(sign,i/12)),width);
        }
      }
    }
    addComponent('designClosure',hits,{radius:9,priority:3});
  }

  function addFitComponents() {
    if (componentKeys.has('mainHem') && skirtFit && surfaces.shell) {
      const {rings,sampleRing}=surfaces.shell;
      const last=rings.length-1;
      addComponent('mainHem',[viewArc(theta=>liftedPoint(sampleRing(theta,last),theta))],{guide:true,radius:10});
    }
    const nearest=(rings,y)=>rings.reduce((best,row,i)=>Math.abs(row[0]-y)<Math.abs(rings[best][0]-y)?i:best,0);
    const supplementary={
      upperHip:{y:-.045},seatDepth:{y:.16,back:true},lapEase:{y:.39},kneeEase:{y:.64},
      sittingLength:{y:.055,back:true},backRise:{y:.13,back:true},crotch:{y:.25},kneeFlex:{y:.68,part:'leg'}
    };
    for (const key of componentKeys) {
      const spec=fitHandles.specs[key] || supplementary[key];
      if (!spec) continue;
      const part=key==='armhole'&&surfaceParts.sleeve?'sleeve':spec.part || (key==='length'&&surfaces.leg?'leg':'shell');
      const pieces=surfaceParts[part]||[];
      for (const surface of pieces) {
        const {rings,opening,sampleRing,side}=surface;
        if (focusedSide && side && side!==focusedSide) continue;
        const last=rings.length-1;
        if (supplementary[key] && spec.y>rings[last][0]+.07) continue;
        const index=spec.neck || key==='armhole'&&part==='sleeve'?0:spec.end?last:nearest(rings,spec.y);
        const at=(row,theta)=>liftedPoint(sampleRing(theta,row),theta);
        const arc=(row,center,span)=>{
          const angles=viewArc(theta=>theta,center,span,17);
          const points=angles.map(theta=>at(row,theta));
          return focusedSide && part==='shell'?visiblePaths(points,angles,focusedSide):[points];
        };
        let paths;
        if (spec.neck) {
          const center=spec.back?-Math.PI/2:Math.PI/2;
          const half=Math.asin(opening);
          const bands=key==='neckWidth'?[-1,1].map(side=>[center+side*half,.22]):[[center,Math.min(half,.34)]];
          paths=bands.flatMap(([center,span])=>{
            const angles=viewArc(theta=>theta,center,span,17);
            return visiblePaths(angles.map(theta=>at(index,theta)),angles,focusedSide);
          });
        } else if (spec.back) {
          const angles=viewArc(theta=>theta,-Math.PI/2,key==='sittingLength'?.36:.9,17);
          paths=visiblePaths(angles.map(theta=>at(index,theta)),angles,focusedSide);
        } else if (key==='sweep' || key==='shoulder' || key==='shoulderSlope' || key==='armhole'&&part==='shell') {
          const theta=key==='shoulderSlope'?1.09:1;
          const span=key==='shoulderSlope'?.19:.36;
          paths=[-1,1].flatMap(direction=>arc(index,near+direction*theta,span));
        } else if (key==='sleeveLength' || key==='kneeFlex') {
          const first=key==='kneeFlex'?Math.max(0,index-3):Math.floor(last*.35);
          const end=key==='kneeFlex'?Math.min(last,index+3):last;
          paths=[Array.from({length:end-first+1},(_,i)=>at(first+i,near))];
        } else {
          const span=key==='length'?.53:key==='waistHeight'?.34:1.33;
          paths=arc(index,near,span);
        }
        const trouserHip=model==='trousers' && key==='hip';
        const guide=!trouserHip && (componentKeys.size<=7 || ['waist','hip','neckDepth','length'].includes(key));
        addComponent(key,paths,{radius:part==='sleeve'?10:11,guide});
      }
    }
  }

  if (pattern) {
    const aroundAvatar=([y,w,d,center=0,centerZ=0],part,side=1)=>{
      const sample=avatar?.sectionAt(part,y);
      if (!sample) return [y,w,d,center,centerZ];
      const [bw,bd,x,z]=sample;
      const grade=gradeClearance(y,part);
      if (part!=='leg') return [y,Math.max(w,bw+.012+grade),Math.max(d,bd+.014+grade*.70),side*x,z];
      // The upper leg buckets still contain some of the pelvis. Ease into
      // the independent thigh width after the cloth branches into legs.
      const end=Math.min(.41,Math.max(.32,trouserLegs[side].at(-1)[0]-.012));
      const t=fabricFit.clamp((y-.26)/(end-.26),0,1);
      const blend=t*t*(3-2*t);
      return [y,fabricFit.mix(w,Math.max(w,bw+.012+grade),blend),fabricFit.mix(d,Math.max(d,bd+.014+grade*.70),blend),
        fabricFit.mix(center,side*x,blend),fabricFit.mix(centerZ,z,blend)];
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
    if (!avatar && fullBody && coveredLegs) guarded=fabricFit.clearance(guarded,coveredLegs);
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
        if (model==='trousers') {
          const settled=rig.pelvis(moved,theta);
          const wrap=pose.sit*back**1.25*fabricFit.clamp((y+.11)/.31,0,1)**2;
          settled[1]+=.112*wrap;
          settled[2]-=.020*wrap;
          return settled;
        }
        return torsoMove(moved);
      },'shell');
    if (support==='Strapless' && (model==='dress' || model==='top') &&
        (elasticStrapless || componentKeys.has('straplessSupport'))) {
      const {sampleRing}=surfaces.shell;
      const channels=color(pattern.color).slice(1).match(/../g).map(n=>parseInt(n,16));
      const bright=channels[0]*.213+channels[1]*.715+channels[2]*.072>145;
      const points=viewArc(theta=>{
        const edge=sampleRing(theta,0), next=sampleRing(theta,1);
        const fraction=Math.min(1,.012/Math.max(.001,Math.hypot(...next.map((n,i)=>n-edge[i]))));
        return liftedPoint(edge.map((n,i)=>fabricFit.mix(n,next[i],fraction)),theta);
      },near,1.49,33);
      if (elasticStrapless) markings.push({points,style:bright?'rgba(70,48,56,.46)':'rgba(242,222,212,.47)'});
      addComponent('straplessSupport',[points],{radius:8,priority:2});
    }
    markSeams();
    if (skirtFit) drawSkirtLayers();
    else if (model==='top') drawFittedLayers(surfaces.shell);
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
      const addMark=(coordinates,style,closed=false,key)=>{
        const points=coordinates.map(([level,theta])=>fromSurface(level,theta));
        markings.push({points,style,closed});
        if (key) addComponent(key,[closed?[...points,points[0]]:points],{radius:8,priority:3});
      };
      if (visible(front) && design.kangaroo) {
        addMark([[.87,1.02],[.77,1.05],[.61,1.23],[.61,1.91],[.77,2.09],[.87,2.12]],'rgba(29,22,38,.60)',true,'designPocket');
      }
      if (!design.kangaroo && ['Patch pockets','In-seam pockets'].includes(design.pocket)) {
        const {start,end}=pocketBounds(surface);
        const level=y=>surface.rings.reduce((best,row,i)=>Math.abs(row[0]-y)<Math.abs(surface.rings[best][0]-y)?i:best,0)/(surface.rings.length-1);
        const channels=color(pattern.color).slice(1).match(/../g).map(n=>parseInt(n,16));
        const light=channels[0]*.213+channels[1]*.715+channels[2]*.072>135;
        const ink=light?'rgba(57,37,44,.68)':'rgba(246,220,207,.70)';
        if (end-start>.055) for (const side of [-1,1]) {
          if (design.pocket==='Patch pockets') {
            const center=front+side*(model==='top'?.58:.74), half=model==='top'?.24:.27;
            if (garmentLace.pockets) {
              const angles=Array.from({length:17},(_,i)=>center-half+2*half*i/16);
              const y=proportions.yAt(start);
              const edge=angles.map(theta=>shellHeightPoint(theta,y));
              drawLace(garmentLace.pockets,edge,edge,'lacePocket',{closed:false,
                normalAt:(j,k,t)=>{const theta=fabricFit.mix(angles[j],angles[k],t);return [Math.cos(theta),0,Math.sin(theta)];},
                acrossAt:(j,k,t,offset)=>shellHeightPoint(fabricFit.mix(angles[j],angles[k],t),y+Math.min(end-start-.012,Math.max(.004,offset+.008)))});
            }
            if (!visible(center)) continue;
            const top=level(start), low=level(end), bend=level(end-.030);
            addMark([[top,center-half],[top,center+half],[bend,center+half],[low,center+half*.74],
              [low,center-half*.74],[bend,center-half]],ink,true,'designPocket');
          } else {
            const sideTheta=side>0?.09:Math.PI-.09;
            if (garmentLace.pockets) {
              const ringCount=surface.rings.length-1;
              const path=Array.from({length:10},(_,i)=>({theta:sideTheta,row:fabricFit.mix(level(start),level(end),i/9)*ringCount}));
              verticalTrim(surface,path,garmentLace.pockets,{frontEdge:true,key:'lacePocket'});
            }
            if (!visible(sideTheta)) continue;
            addMark(Array.from({length:8},(_,i)=>[level(fabricFit.mix(start,end,i/7)),sideTheta]),ink,false,'designPocket');
          }
        }
      }
      if (visible(front) && design.raglan) for (const sign of [-1,1]) {
        addMark([[.025,front+sign*.41],[.105,front+sign*.63],[.20,front+sign*.87],[.28,front+sign*1.09]],'rgba(31,25,39,.51)');
      }
      const closure=designClosure;
      const center=closure==='Invisible zipper'||closure==='Back lacing'||closure==='Back button and loop'?back:closure==='Side zipper'?.14:front;
      if (fastener) drawConfiguredClosure(surface,closure,fastener);
      else if (visible(center)) {
        if (['Front buttons','Button fly','Front busk','Back button and loop'].includes(closure)) {
          const last=closure==='Button fly'?.29:.87;
          const buttons=[];
          for (let level=.08;level<last;level+=last/7) {
            const [x,y,depth]=fromSurface(level,center);
            const radius=Math.max(1,scale*.012);
            markings.push({circle:[x,y,radius],depth,style:'#463632'});
            buttons.push([[x-radius,y,depth],[x+radius,y,depth]]);
            if (closure==='Back button and loop') break;
          }
          addComponent('designClosure',buttons,{radius:9,priority:3});
        } else if (closure==='Back lacing') {
          addMark(Array.from({length:14},(_,i)=>[.05+i*.057,center+(i%2===0?-.14:.14)]),'rgba(39,24,35,.83)',false,'designClosure');
        } else if (['Invisible zipper','Side zipper','Separating zipper','Zip fly'].includes(closure)) {
          const length=closure==='Zip fly'?.26:closure==='Side zipper'?.43:.68;
          addMark(Array.from({length:8},(_,i)=>[i*length/7,center]),'rgba(58,42,47,.55)',false,'designClosure');
        }
      }
      if (closure==='Elastic waistband' && componentKeys.has('designClosure')) {
        const row=surface.rings.findIndex(([y])=>y>=surface.rings[0][0]+.035);
        addComponent('designClosure',[viewArc(theta=>liftedPoint(surface.sampleRing(theta,Math.max(0,row)),theta))],
          {radius:8,priority:3});
      }
      if (garmentLace.waistband) waistbandTrim(surface,garmentLace.waistband);
      if (seamLace?.kind==='sides') {
        for (const theta of [0,Math.PI]) decorativeSeam(surface,surface.rings.map(()=>theta),garmentLace.seams);
      }
    }
    if (changes.hasSleeves && (model==='dress'||model==='top')) {
      for (const side of [-1,1]) {
        const sleeve=((changes.sleeveWidth||0)+offsetOnSide(side,'sleeveWidth'))/410+(sleeveStyle==='Puff'?.045:0);
        const length=(changes.sleeveLength||0)/75+offsetOnSide(side,'sleeveLength')*centimeter+
          (sleeveProfile?.length??({Cap:-.16,Short:-.08,Elbow:.07,Long:.39,Puff:.02,Bell:.36}[sleeveStyle]||0));
        const cuff=((changes.cuff||0)+offsetOnSide(side,'cuff'))/410+(sleeveStyle==='Bell'?.085:0);
        let rings=[[-.71,.075+sleeve+(changes.sleeveCap||0)/460,.091],[-.60,.085+sleeve+(changes.sleeveCap||0)/620,.105],
          [Math.max(-.595,-.46+length*.48),.068+sleeve*.6,.077],
          [Math.max(-.585,-.35+length),.057+cuff,.064+cuff*.64]];
        if (sleeveProfile) {
          const [start,end]=avatar?detailedSleeveEnd(side):[-.71,Math.max(-.585,-.35+length)];
          rings=sleeveProfile.radii.map(([t,w,d])=>{
            const cap=(changes.sleeveCap||0)/460*Math.max(0,1-t/.44);
            const width=sleeve*(1-.79*t**4)+cuff*t**4+cap;
            return [fabricFit.mix(start,end,t),w+width,d+.67*width];
          });
        } else if (avatar) {
          const [start,end]=detailedSleeveEnd(side);
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
        let posedSleeve=moveSleeve;
        if (sleeveStyle==='Flutter') {
          const end=shellSleeve.at(-1)[0];
          const softness=(1-.55*(material?.bend||0))/(1+(material?.gsm||0)/690);
          posedSleeve=(point,theta)=>{
            const x=Math.cos(theta),z=Math.sin(theta);
            const progress=fabricFit.clamp((point[1]-start)/Math.max(.035,end-start),0,1);
            const edge=Math.max(0,(progress-.48)/.52)**2*softness;
            const fold=Math.sin(4*Math.atan2(z,side*x)+progress*1.7);
            // The open edge hangs lower at the outside arm and flares into soft folds.
            const outward=edge*fold*.018;
            const drop=edge*(.016+side*x*.022+fold*.012);
            return moveSleeve([point[0]+x*outward,point[1]+drop,point[2]+z*outward],theta);
          };
        }
        mesh(shellSleeve,color(pattern.color),0,false,true,false,posedSleeve,'sleeve');
      }
    }
    if (trouserLegs) {
      for (const side of [-1,1]) {
        const leg=trouserLegs[side];
        const fitted=avatar?leg.map(row=>aroundAvatar([...row,side*legSpacing],'leg',side)):fabricFit.clearance(leg,legBody);
        const localFit=trouserFitKeys.some(key=>offsetOnSide(side,key)) || offsetOnSide(side,'length') || offsetOnSide(side,'hip');
        mesh(fitted,color(pattern.color),avatar?0:side*legSpacing,false,true,true,(point,theta)=>{
          const moved=articulated && localFit?articulated.leg(point,side):legMove(point);
          const knee=Math.max(0,1-Math.abs(point[1]-.64)/.19);
          moved[2]+=pose.sit*knee*Math.max(0,Math.sin(theta))*(changes.kneeFlex||0)/145;
          return moved;
        },'leg');
        if (seamLace?.kind==='sides') decorativeSeam(surfaces.leg,surfaces.leg.rings.map(()=>side>0?0:Math.PI),garmentLace.seams);
        drawFittedLayers(surfaces.leg);
      }
    }
    if (stitchDetails.length) paintStitchedDetails();
  }
  if (analysis && pose.sit>.15 && fullBody) {
    const height=wearerAvatar?.pose?.(fabricFit.poses.sit).seatY ??
      (pose.sit===1?wearerRig:fabricFit.rig(fabricFit.poses.sit,wearerProportions.yAt)).seatY;
    const wide=Math.max(.30,.28+((wearer.hip||98)-98)/450);
    const near=.24, far=-.27, floor=1.126;
    const opacity=Math.min(1,(pose.sit-.15)*1.4);
    function seatFace(vertices,fill) {
      const points=vertices.map(projectView);
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
  if (componentKeys.size) addFitComponents();
  const depthRendered=(skinPoints||garmentLayers.length||componentKeys.size) && typeof fittingRender!=='undefined' && fittingRender.paint(context,{
    faces,skinPoints,skinTopology,skinColor:skin,width,height,cx,cy,scale,markings
  });
  if (!depthRendered && skinPoints) {
    const channels=skin.slice(1).match(/../g).map(value=>parseInt(value,16));
    faces.push(...humanPreview.skinFaces(skinPoints,skinPoints.map(screen),channels,skinCovered));
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
    context.lineWidth=mark.width||Math.max(.8,scale*.008);
    context.stroke();
  }
  return {...editorMetadata,componentHits};
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
      <p class="tight">Stand with your head and feet in view and your arms relaxed. Capture one front view and one side view from the same camera position. If someone else is in view, tap yourself in the preview to move the guide.</p>
      <p class="tight">Your measurements set the size. The camera refines the shape using the outline. The app processes frames on this device and saves only the outline measurements.</p>
      <div class="model-camera-frame" data-camera-frame hidden>
        <video class="model-camera" muted autoplay playsinline aria-label="Live camera preview"></video>
        <div class="model-camera-guide" data-camera-guide hidden aria-hidden="true"></div>
      </div>
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
const fitSliderGroups={
  body:['Body fit',['bust','waist','hip']],
  shoulders:['Shoulders and armholes',['shoulder','shoulderSlope','armhole']],
  neckline:['Neckline',['neckDepth','neckWidth','backNeck']],
  sleeves:['Sleeves',['sleeveWidth','sleeveCap','sleeveLength','cuff']],
  length:['Waistline and hem',['waistHeight','sweep','length']],
  legs:['Pants legs and rise',['rise','backRise','crotch','thigh','knee','kneeFlex','leg']],
  seated:['Seated fit',garmentFit.seatedKeys],
  panels:['Panel seams',['panelSeam']]
};
function sliderGroups(keys,render,open=new Set()) {
  return Object.entries(fitSliderGroups).map(([group,[label,members]])=>{
    const current=keys.filter(key=>members.includes(key));
    return current.length?`<details class="design-options slider-group" data-slider-group="${group}"${open.has(group)?' open':''}>
      <summary>${label}</summary><div class="slider-group-content">${current.map(render).join('')}</div></details>`:'';
  }).join('');
}
const openSliderGroups=root=>new Set([...root.querySelectorAll('details[data-slider-group][open]')].map(section=>section.dataset.sliderGroup));
function fitSlidersMarkup(keys,values,neckline,open) {
  const slider=key=>fitSlider(key,values[key]||0,
    key==='neckDepth'?`${neckline} depth`:key==='neckWidth'?`${neckline} width`:garmentFit.fields[key][0]);
  return sliderGroups(keys,slider,open);
}
function focusSlider(input) {
  if (!input || input.disabled) return;
  openSliderSections(input);
  input.focus({preventScroll:true});
  input.closest('.field').scrollIntoView({block:'center'});
}
function openSliderSections(input) {
  for (let panel=input.closest('details');panel;panel=panel.parentElement.closest('details')) panel.open=true;
}
function slider(label,attributes,[min,max],value,{step=.5,unit='cm',disabled=false,signed=false,ends,reference}={}) {
  const display=sliderValue(value,unit,signed,reference);
  return `<label class="field adjustment"><span>${label} <output>${display}</output></span><input ${attributes} type="range" min="${min}" max="${max}" step="${step}" value="${value}" data-slider-unit="${unit}"${reference?` data-slider-reference="${escape(reference)}"`:''}${signed?' data-slider-offset':''}${disabled?' disabled':''}>${ends?`<span class="adjustment-ends"><span>${ends[0]}</span><span>${ends[1]}</span></span>`:''}</label>`;
}
function sliderValue(value,unit,signed,reference) {
  if (unit==='attachment') return layerAttachmentLabel(value,reference);
  const prefix=signed && value>0?'+':'';
  return `${prefix}${value}${unit==='cm'?' cm':unit==='percentage points'?' points':unit}`;
}
function writeSlider(input,value) {
  input.value=value;
  const output=input.closest('.field').querySelector('output');
  output.textContent=sliderValue(value,input.dataset.sliderUnit,input.hasAttribute('data-slider-offset'),input.dataset.sliderReference);
  studioUnits.refresh(output);
}
const strapShapeLabels={strapFrontCurve:'Front curve toward neckline',strapFrontTaper:'Width at front join',
  strapFrontJoin:'Front join depth',strapFrontAngle:'Front join angle',
  strapBackCurve:'Back curve toward neckline',strapBackTaper:'Width at back join',
  strapBackJoin:'Back join depth',strapBackAngle:'Back join angle'};
const strapShapeKeys=Object.keys(strapShapeLabels);
const strapShapeUnit=key=>key.endsWith('Taper')?'%':key.endsWith('Angle')?'°':'cm';
const strapShapeSigned=key=>key.endsWith('Curve')||key.endsWith('Angle');
function strapShapePreset(shape) {
  return Object.keys(studioDesign.strapShapeChoices).find(name=>strapShapeKeys.every(key=>shape[key]===studioDesign.strapShapeChoices[name][key])) || 'Custom';
}
function strapShapeControls(support,settings,construction) {
  const shape=studioDesign.strapShape(settings);
  const preset=strapShapePreset(shape);
  const active=studioDesign.supportsStrapShape(support);
  const choices=construction?studioDesign.onePieceChoices(construction):{};
  const continuous=construction?studioDesign.onePiece(construction):{};
  const group=(side,label)=>{
    const join=`strap${side}`;
    return `<details class="design-options slider-group"><summary>${label}</summary><div class="slider-group-content">
    ${construction?`<div data-one-piece-wrap${choices[join]?'':' hidden'}><label class="sleeve-choice"><input type="checkbox" data-one-piece="${join}" data-highlight-component="${join}Join"${continuous[join]?' checked':''}${choices[join]?'':' disabled'}> ${escape(choices[join]||`Cut the strap and ${side.toLowerCase()} bodice in one piece`)}</label></div>`:''}
    ${strapShapeKeys.filter(key=>key.startsWith(`strap${side}`)).map(key=>{
      const unit=strapShapeUnit(key);
      const backBodice=['strapBackJoin','strapBackAngle'].includes(key);
      const attachment=key.endsWith('Join')||key.endsWith('Angle');
      return slider(strapShapeLabels[key],`name="${key}" data-strap-shape-field data-component-slider="${key}"${backBodice?' data-back-bodice-join':''}${attachment?` data-separate-strap-join="${join}"`:''}`,
        studioDesign.strapShapeLimits[key],shape[key],{unit,step:unit==='cm'?.5:1,signed:strapShapeSigned(key),disabled:!active});
    }).join('')}</div></details>`;
  };
  return `<details class="design-options" data-strap-shape${active?'':' hidden'}><summary>Strap curve and taper</summary>
    <div class="slider-group-content"><label class="field">Strap shape<select data-strap-preset${active?'':' disabled'}>${[...Object.keys(studioDesign.strapShapeChoices),'Custom'].map(name=>option(name,name,preset)).join('')}</select></label>
    <p>Join depth extends the strap onto the bodice. A positive angle lowers the neckline side of the join. Join width is a percentage of shoulder width.</p>
    ${group('Front','Front neckline join')}${group('Back','Back neckline or collar join')}</div></details>`;
}
function readStrapShape(form) {
  const values=Object.fromEntries(strapShapeKeys.map(key=>[key,form.elements.namedItem(key).valueAsNumber]));
  return studioDesign.strapShape({...values,support:form.elements.namedItem('support').value});
}
function updateStrapShape(form,input) {
  const preset=form.querySelector('[data-strap-preset]');
  if (input===preset) {
    const shape=studioDesign.strapShapeChoices[preset.value];
    if (shape) for (const key of strapShapeKeys) writeSlider(form.elements.namedItem(key),shape[key]);
  } else {
    writeSlider(input,input.valueAsNumber);
    preset.value=strapShapePreset(readStrapShape(form));
  }
  return readStrapShape(form);
}
function straplessControls(model,support,finish) {
  const active=support==='Strapless';
  const choices=studioDesign.straplessSupportChoices(model);
  return `<div class="actions strapless-choice"><button class="secondary" type="button" data-choose-strapless aria-pressed="${active}">Strapless</button></div>
    <label class="field" data-strapless-finish${active?'':' hidden'}>Strapless support
      <select name="straplessSupport"${active?'':' disabled'}>${choices.map(value=>option(value,value,finish)).join('')}</select></label>`;
}
function refreshStraplessControls(form) {
  const finish=form.elements.namedItem('straplessSupport');
  if (!finish) return;
  const active=form.elements.namedItem('support').value==='Strapless';
  finish.disabled=!active;
  finish.closest('[data-strapless-finish]').hidden=!active;
  form.querySelector('[data-choose-strapless]').setAttribute('aria-pressed',active);
  const shape=form.querySelector('[data-strap-shape]');
  if (shape) {
    const support=form.elements.namedItem('support').value;
    shape.hidden=!studioDesign.supportsStrapShape(support);
    for (const field of shape.querySelectorAll('input,select')) {
      const collar=support==='Halter strap' && field.hasAttribute('data-back-bodice-join');
      field.disabled=shape.hidden||collar;
      if (field.hasAttribute('data-back-bodice-join')) field.closest('.field').hidden=collar;
    }
  }
}
function refreshOnePieceStraps(form,construction) {
  const shape=form.querySelector('[data-strap-shape]');
  if (!shape) return;
  const choices=studioDesign.onePieceChoices(construction);
  const continuous=studioDesign.onePiece(construction);
  for (const toggle of shape.querySelectorAll('[data-one-piece]')) {
    const key=toggle.dataset.onePiece;
    toggle.checked=Boolean(continuous[key]);
    toggle.disabled=shape.hidden||!choices[key];
    toggle.closest('[data-one-piece-wrap]').hidden=toggle.disabled;
  }
  for (const input of shape.querySelectorAll('[data-separate-strap-join]')) {
    const collar=form.elements.support.value==='Halter strap' && input.hasAttribute('data-back-bodice-join');
    const hidden=collar||Boolean(continuous[input.dataset.separateStrapJoin]);
    input.disabled=shape.hidden||hidden;
    input.closest('.field').hidden=hidden;
  }
}
function bindStraplessChoice(form) {
  form.addEventListener('click',event=>{
    if (!event.target.closest('[data-choose-strapless]')) return;
    const support=form.elements.namedItem('support');
    if (support.value==='Strapless') return;
    support.value='Strapless';
    support.dispatchEvent(new Event('input',{bubbles:true}));
  });
}
function sideFitRegions(pattern,model,body,changes,pose,material,offsets=studioDesign.asymmetry(pattern.design)) {
  if (!Object.values(offsets).some(side=>Object.keys(side).some(key=>key!=='panelSeam'))) return null;
  return Object.fromEntries(Object.entries(offsets).map(([side,settings])=>{
    const local={...changes};
    for (const [key,value] of Object.entries(settings)) {
      if (key==='panelSeam') continue;
      const multiplier=['bust','waist','hip','shoulder','sweep'].includes(key)?2:1;
      local[key]=(local[key]||0)+value*multiplier;
    }
    return [side,fabricFit.estimate(pattern,model,body,local,pose,material)];
  }));
}
function fitRegionSummary(pattern,model,body,changes,pose,material) {
  const sided=sideFitRegions(pattern,model,body,changes,pose,material);
  if (!sided) return fabricFit.estimate(pattern,model,body,changes,pose,material);
  return Object.fromEntries(Object.entries(sided.left).map(([key,left])=>{
    const right=sided.right[key];
    const difference=left.level-right.level || (left.load??0)-(right.load??0);
    if (Math.abs(difference)<.00001) return [key,left];
    const [side,region]=difference>0?['left',left]:['right',right];
    return [key,{...region,label:`${region.label} · Wearer’s ${side}`}];
  }));
}
function fitAnalysisId(prefix,key) {
  const legacy=['motion-controls','play-motion','motion-progress','motion-speed'];
  return prefix==='fit' && legacy.includes(key)?key:`${prefix}-${key}`;
}
const fitEaseLabels={
  stand:'Add standing ease',sit:'Add sitting ease',reach:'Add ease for reaching forward',raise:'Add ease with arms raised',
  walk:'Add walking ease',lift:'Add ease for arm motion',reachCycle:'Add ease for reaching and returning',sitCycle:'Add ease for sitting and standing'
};
function fitEaseControls(prefix) {
  const legacyPrefix=prefix==='fit'?'':`${prefix}-`;
  const hintId=prefix==='fit'?'seat-fit-hint':`${prefix}-seat-hint`;
  return `<div class="seat-fit" id="${prefix}-seat-fit">
    <div class="actions tight"><button type="button" class="secondary" id="${legacyPrefix}add-seat-ease" data-current-fit-ease="${prefix}">${fitEaseLabels.stand}</button>
      <button type="button" class="secondary" id="${legacyPrefix}add-all-ease">Add ease for all movements</button></div>
    <p id="${hintId}" class="fit-reading">Uses the selected fabric and available fit sliders to ease tight areas.</p>
    <p id="${prefix}-ease-status" class="fit-reading" role="status" hidden></p>
  </div>`;
}
function bindFitEase(prefix,analysis,solve) {
  const idPrefix=prefix==='fit'?'':`${prefix}-`;
  const status=document.getElementById(`${prefix}-ease-status`);
  function run(all) {
    const changed=solve(analysis.easePoses(all));
    const names=changed.map(key=>garmentFit.fields[key][0]);
    const remaining=names.length>4?` and ${names.length-4} more`:'';
    status.textContent=names.length?`Updated ${names.slice(0,4).join(', ').toLowerCase()}${remaining}.`:'No further slider changes were suggested.';
    status.hidden=false;
  }
  document.getElementById(`${idPrefix}add-seat-ease`).onclick=()=>run(false);
  document.getElementById(`${idPrefix}add-all-ease`).onclick=()=>run(true);
}
function fitAnalysisControls(prefix,extra='',{viewOnly=false}={}) {
  const id=key=>fitAnalysisId(prefix,key);
  return `<div class="fit-preview-controls">
    <label class="field">Movement<select id="${id('pose')}"><optgroup label="Poses">${Object.entries(fabricFit.poses).map(([key,value])=>option(key,value.name,'stand')).join('')}</optgroup><optgroup label="Motion loops">${Object.entries(fabricFit.motions).map(([key,value])=>option(key,value.name)).join('')}</optgroup></select></label>
    ${viewOnly?'':`<label class="fit-map-toggle"><input type="checkbox" id="${id('map')}" checked> Show tightness</label>`}
    <div class="fit-motion-controls" id="${id('motion-controls')}" hidden>
      <button type="button" class="secondary" id="${id('play-motion')}">Play motion</button>
      <label class="field">Motion progress<input id="${id('motion-progress')}" type="range" min="0" max="100" step=".1" value="0"></label>
      <label class="field">Speed<select id="${id('motion-speed')}"><option value=".5">Half speed</option><option value="1" selected>Normal</option><option value="1.5">1.5×</option></select></label>
    </div>
    ${extra}
    ${viewOnly?'':`<div class="fit-legend" id="${id('legend')}"><div class="fit-legend-gradient" aria-hidden="true"></div><div class="fit-legend-labels"><span>Ease</span><span>Snug</span><span>Restricted</span></div></div>
    <p id="${id('reading')}" class="fit-reading" aria-live="polite"></p>`}
  </div>`;
}
function bindFitAnalysis(prefix,{draw,estimate}) {
  const get=key=>document.getElementById(fitAnalysisId(prefix,key));
  const poseField=get('pose');
  const motionControls=get('motion-controls');
  const playButton=get('play-motion');
  const timeline=get('motion-progress');
  const speed=get('motion-speed');
  const map=get('map');
  const legend=get('legend');
  const reading=get('reading');
  const currentEase=document.querySelector(`[data-current-fit-ease="${prefix}"]`);
  let pose={...fabricFit.poses.stand};
  let animation=0;
  let playing=false;
  let progress=0;

  function report() {
    if (!estimate || !reading) return;
    const regions=estimate(pose);
    const [peak]=Object.values(regions).sort((a,b)=>b.level-a.level||(b.load??0)-(a.load??0));
    if (peak) {
      const level=peak.level>.66?'Restricted':peak.level>.26?'Snug':'Room to move';
      const demand=(100*Math.max(peak.cross,peak.length)).toFixed(1);
      reading.textContent=`${level} · ${peak.label} · ${demand}% estimated stretch demand`;
    } else reading.textContent='';
  }

  function pause() {
    cancelAnimationFrame(animation);
    playing=false;
    playButton.textContent='Play motion';
    reading?.setAttribute('aria-live','polite');
  }

  function scrub(next) {
    progress=next;
    pose=fabricFit.motionAt(poseField.value,next);
    timeline.value=(next*100).toFixed(1);
    draw();
  }

  playButton.addEventListener('click',()=>{
    if (playing) {
      pause();
      report();
      return;
    }
    const motion=fabricFit.motions[poseField.value];
    if (!motion) return;
    playing=true;
    playButton.textContent='Pause motion';
    reading?.setAttribute('aria-live','off');
    let last=performance.now(),lastRead=0;
    function frame(now) {
      if (!playing || !poseField.isConnected) return;
      const elapsed=now-last;
      if (elapsed>=40) {
        scrub((progress+Math.min(elapsed,110)*Number(speed.value)/motion.duration)%1);
        last=now;
        if (now-lastRead>=160) {
          report();
          lastRead=now;
        }
      }
      animation=requestAnimationFrame(frame);
    }
    animation=requestAnimationFrame(frame);
  });

  timeline.addEventListener('input',()=>{
    pause();
    scrub(Number(timeline.value)/100);
    report();
  });

  map?.addEventListener('change',()=>{
    legend.hidden=!map.checked;
    draw();
  });

  poseField.addEventListener('change',()=>{
    pause();
    const looping=Object.hasOwn(fabricFit.motions,poseField.value);
    if (currentEase) currentEase.textContent=fitEaseLabels[poseField.value]||'Add ease for this movement';
    motionControls.hidden=!looping;
    if (looping) {
      scrub(0);
      report();
      return;
    }
    const target=fabricFit.poses[poseField.value];
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      pose={...target};
      draw();
      report();
      return;
    }
    const previous=pose,start=performance.now();
    function transition(now) {
      const t=fabricFit.clamp((now-start)/580,0,1);
      const blend=t*t*(3-2*t);
      pose=Object.fromEntries(['sit','arm','reach'].map(key=>[key,fabricFit.mix(previous[key],target[key],blend)]));
      draw();
      if (t<1) animation=requestAnimationFrame(transition);
      else report();
    }
    animation=requestAnimationFrame(transition);
  });

  function easePoses(all=false) {
    const selected=poseField.value;
    if (!all && Object.hasOwn(fabricFit.poses,selected)) return [fabricFit.poses[selected]];
    const loops=all?Object.keys(fabricFit.motions):[selected];
    const samples=loops.flatMap(loop=>Array.from({length:8},(_,index)=>fabricFit.motionAt(loop,index/8)));
    if (Object.hasOwn(fabricFit.motions,selected) && !Number.isInteger(progress*8)) samples.push(pose);
    return all?[...Object.values(fabricFit.poses),...samples]:samples;
  }

  return {pose:()=>pose,show:()=>Boolean(map?.checked),report,easePoses,cleanup:pause};
}
function straplessFitDesign(pattern,changes) {
  return {...pattern.design,model:pattern.design?.model || basePattern(pattern).id,support:'Strapless',
    straplessSupport:changes.straplessSupport??pattern.design?.straplessSupport};
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
  if (Object.hasOwn(changes,'sleeves') && changes.support!=='Strapless') {
    steps.push(changes.sleeves
      ? 'Trace a compatible sleeve for the armhole and make a test sleeve in matching fabric. Baste it at the notches and check reach before sewing and finishing the armhole.'
      : 'Unpick the sleeves and check the shape and coverage of both armholes on the wearer. Staystitch and finish the openings with a compatible facing or binding.');
    visuals.push('sleeve');
  }
  if (changes.sleeveStyle) {
    steps.push(`Use a ${changes.sleeveStyle.toLowerCase()} sleeve pattern matched to the armhole. ${studioDesign.sleeveDrafting(changes.sleeveStyle)} Baste it in at the shoulder and underarm marks, then check coverage and reach before stitching.`);
    visuals.push('sleeve');
  }
  if (changes.support==='Strapless' || changes.straplessSupport) {
    if (changes.support==='Strapless') {
      steps.push('Baste a strapless fitting sample and check coverage before removing any shoulders, straps or sleeves from the original garment.');
      visuals.push('strapless');
    }
    for (const {text,visual} of studioDesign.straplessInstructions(straplessFitDesign(pattern,changes))) {
      steps.push(text);
      visuals.push(visual);
    }
  } else if (changes.support || strapShapeKeys.some(key=>Object.hasOwn(changes,key))) {
    const strap=studioDesign.strapInstructions({...pattern.design,...shoulderSettings(pattern),...changes,model:pattern.design?.model||model});
    steps.push(strap.text);
    visuals.push(strap.visual);
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
    if (selected.support==='Strapless' && (selected.support!==original.support || selected.straplessSupport!==original.straplessSupport)) {
      difference.straplessSupport=selected.straplessSupport;
    }
    if (studioDesign.supportsStrapShape(selected.support) && strapShapeKeys.some(key=>original[key]!==selected[key])) {
      for (const key of strapShapeKeys) difference[key]=selected[key];
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
    if (key==='support' || key==='straplessSupport') return amount;
    if (key==='strapWidth' && Number.isFinite(amount)) return 'Finished shoulder width '+amount+' cm';
    if (key==='strapPlacement' && amount) return 'Shoulder placement '+adjustmentText(amount);
    if (Object.hasOwn(strapShapeLabels,key)) return `${strapShapeLabels[key]} ${sliderValue(amount,strapShapeUnit(key),strapShapeSigned(key))}`;
    if (key==='sleeveStyle') return amount+' sleeves';
    if (key==='sleeves') return amount?'Add sleeves':'Remove sleeves';
    return garmentFit.fields[key]?garmentFit.fields[key][0]+' '+adjustmentText(amount):[];
  }).join(' · ');
}
function layerAttachmentLabel(value,reference='Waist') {
  const edge=reference.toLowerCase();
  return value?`${Math.abs(value)}% ${value<0?'above':'below'} ${edge}`:`At ${edge}`;
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
  if (changes.straplessSupport) adjustments.push(['Strapless support',changes.straplessSupport]);
  if (Number.isFinite(changes.strapWidth)) adjustments.push(['Finished shoulder width',cm(changes.strapWidth)]);
  if (changes.strapPlacement) adjustments.push(['Shoulder placement',adjustmentText(changes.strapPlacement)]);
  if (strapShapeKeys.some(key=>Object.hasOwn(changes,key))) {
    const shape=studioDesign.strapShape(changes);
    for (const key of strapShapeKeys) adjustments.push([strapShapeLabels[key],sliderValue(shape[key],strapShapeUnit(key),strapShapeSigned(key))]);
  }
  if (changes.sleeveStyle && (make?targetChanges.hasSleeves:true)) adjustments.push(['Sleeve style',changes.sleeveStyle]);
  if (make) {
    const {waistSeam,panelSeam,panelAngle,panelZipper}=studioDesign.seams(pattern.design);
    if (Number.isFinite(waistSeam)) adjustments.push(['Waist join seam offset',adjustmentText(waistSeam)]);
    if (Number.isFinite(panelSeam)) adjustments.push(['Front panel seam offset',adjustmentText(panelSeam)]);
    if (panelSeam===studioDesign.centerFrontSeam) adjustments.push(['Single vertical seam',studioDesign.singleSeamLocation(panelAngle)]);
    if (Number.isFinite(panelZipper)) adjustments.push(['Zipper opening from the top of the seam',cm(panelZipper)]);
    if (pattern.design && studioDesign.selectedSupport(pattern.design)==='One-shoulder') {
      adjustments.push(['One-shoulder strap',`Wearer’s ${studioDesign.selectedShoulderSide(pattern.design)}`]);
    }
    const hem=studioDesign.hemContour(pattern.design);
    if (studioDesign.hasFairyHem(pattern.design)) {
      adjustments.push(['Main fairy hem',`${hem.hemPointCount} points · ${hem.hemDrop} cm drop · ${hem.hemRotation}° rotation`]);
    }
    for (const [key,label] of [['hemFront','Center front'],['hemLeft','Left'],['hemBack','Center back'],['hemRight','Right']]) {
      if (hem[key]) adjustments.push([`Main hem · ${label}`,adjustmentText(hem[key])]);
    }
    for (const [side,offsets] of Object.entries(studioDesign.asymmetry(pattern.design))) {
      for (const [key,value] of Object.entries(offsets)) {
        adjustments.push([`${key==='panelSeam'?'Panel seam':garmentFit.fields[key][0]} · ${side} offset`,adjustmentText(value)]);
      }
    }
    const laceLabels=studioDesign.lacePlacements(pattern.design);
    for (const [key,trim] of Object.entries(studioDesign.laceTrims(pattern.design))) {
      adjustments.push([`${laceLabels[key]} trim`,`${trim.style} · ${cm(trim.width)}`]);
    }
    const detailPositions=studioDesign.stitchPlacements(pattern.design);
    for (const [index,detail] of studioDesign.stitchDetails(pattern.design).entries()) {
      const repeat=detail.spacing?`${cm(detail.spacing)} spacing`:`${detail.fullness}× gathering ratio`;
      adjustments.push([`Detail ${index+1} · ${detail.style}`,`${detailPositions[detail.placement]} · ${cm(detail.depth)} depth · ${repeat}`]);
    }
    const fastener=studioDesign.effectiveClosure(pattern.design)===pattern.design?.closure && garmentFasteners.saved(pattern.design);
    if (fastener) {
      for (const [key,[label]] of Object.entries(garmentFasteners.fields[fastener.kind])) {
        if (Number.isFinite(fastener[key])) adjustments.push([label,key==='count'?String(fastener[key]):cm(fastener[key])]);
      }
      if (fastener.placement) adjustments.push([fastener.kind==='ties'?'Tie placement':'Drawstring exit',garmentFasteners.placements[fastener.placement]]);
    }
    studioDesign.layers(pattern.design).forEach((layer,index)=>{
      if (layer.laceTrim) adjustments.push([`Layer ${index+1} hem trim`,`${layer.laceTrim.style} · ${cm(layer.laceTrim.width)}`]);
    });
  }
  const targets=[];
  if (make && Number.isFinite(pattern.design?.ease)) {
    const model=basePattern(pattern).id;
    const key=['top','dress'].includes(model)?'bust':'hip';
    targets.push([key==='bust'?'Finished chest / bust target':'Finished hip / seat target',cm(body[key]+pattern.design.ease+(targetChanges[key]||0))]);
  }
  const layers=make?studioDesign.layers(pattern.design).map((layer,index)=>{
    const model=pattern.design.model;
    const reference=studioDesign.layerStartsAt(model);
    const center=layer.attachment;
    const sides=[['Left',0],['Right',Math.PI]].flatMap(([side,angle])=>{
      const height=studioDesign.layerAttachmentAt(layer,angle,model);
      return height===center?[]:[`${side} ${layerAttachmentLabel(height,reference).toLowerCase()}`];
    });
    return [`Layer ${index+1} · ${layer.kind}`,layer.fabric,layer.kind==='Ruffle'?cm(layer.depth)+' drop':adjustmentText(layer.hemOffset),cm(layer.sweep),
      [layerAttachmentLabel(center,reference),...sides].join(' · ')];
  }):[];
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
  const design=pattern.design || base.design;
  if (design && changes.support==='Strapless') {
    delete delta.support;
    delete delta.straplessSupport;
    delete delta.sleeves;
  }
  if (design && studioDesign.supportsStrapShape(changes.support)) for (const key of strapShapeKeys) delete delta[key];
  const settings=Object.keys(delta).length?guide(base,delta,body):null;
  const steps=[`For this new garment, choose a block in the selected model’s size and check the bust (${body.bust} cm), waist (${body.waist} cm), hip (${body.hip} cm), and shoulders (${body.shoulder} cm) against the pattern. Test ${fabric.name} (${fabric.gsm} g/m²) for the intended ease and finish.`];
  const visuals=['measure'];
  if (settings) {
    steps.push('Make a fitting sample in similar fabric. Apply the changes below to that sample, then transfer them to the paper pattern and check the adjoining seam lengths before cutting your final fabric.',...settings.steps.slice(2));
    visuals.push('designCut',...settings.visuals.slice(2));
  }
  const instructions=design?studioDesign.make({...designForFit(design,changes),fabric:fabric.name},pattern.name,body):base;
  const baseVisuals=instructions.visuals || sewingVisuals.patterns[base.id] || instructions.steps.map(sewingVisuals.identify);
  const extraTools=!design && changes.support==='Strapless'?studioDesign.straplessTools(straplessFitDesign(pattern,changes)):[];
  return {steps:[...steps,...instructions.steps],visuals:[...visuals,...baseVisuals],tools:[instructions.tools,...extraTools].join(', '),
    fabric:`${fabric.name} (${fabric.gsm} g/m²). ${instructions.fabric}`};
}

function fitting() {
  const pattern = getPattern(fitPattern);
  const modelType = basePattern(pattern).id;
  const publisher=pattern.external;
  const sleeveEligible = ['dress','top'].includes(modelType);
  const supportModel=pattern.design?.model || modelType;
  const fabricName=preferredFabric || fitRevision?.fabric?.name || pattern.design?.fabric ||
    (/denim/i.test(pattern.fabric)?'Rigid denim':/twill|suiting/i.test(pattern.fabric)?'Medium-weight twill':'Cotton poplin');
  const startingFabric=preferredFabric?undefined:fitRevision?.fabric || pattern.design?.fabricSettings;
  preferredFabric='';
  const siblings=pattern.family?allPatterns().filter(item=>item.family===pattern.family && item.id!==pattern.id && !isArchived('patterns',item.id)):[];
  const startingNeck=fitRevision?.changes.neckline || pattern.design?.neckline || 'Scoop';
  const startingFit=fitRevision?.changes || pattern.design?.fitAdjustments || {};
  const shoulders=shoulderSettings(pattern);
  const supportStyles=studioDesign.supportChoices(supportModel);
  const canHaveSleeves=shoulders.support==='Integrated shoulders';
  const fitTools=`${fitEaseControls('fit')}
    ${studioDesign.layers(pattern.design).length?'<p id="fit-layer-map-note" class="fit-reading muted">The map shows tightness on the main garment. Layers are faded in this view.</p>':''}`;
  view.innerHTML = `<div class="page-title"><p class="model-link"><a href="#library">Back to Pattern Library</a></p><h1>${publisher?'Try on garment':titles.fitting}</h1><p>${publisher?'Choose a model to preview this pattern in 3D.':'Preview the fit on a model, then save a revision or create an illustrated work order.'}</p></div><div class="split"><section class="panel viewer fitting-viewer"><div class="fit-canvas"><canvas id="model" tabindex="0" role="img" aria-label="Rotatable three-dimensional garment preview. Select a garment area to open its fit slider. Use arrow keys to rotate and tilt."></canvas></div><div class="viewer-footer"><span class="muted">Select a garment area to jump to its slider. Drag or use arrow keys to turn.</span><div class="actions"><button type="button" class="secondary" id="reset-view">Front view</button><button type="button" class="secondary" id="preview-current-fit">Preview on models</button></div></div><label class="field fitting-tilt">Tilt up or down<input type="range" id="fit-tilt" min="-70" max="70" step="1" value="0"></label>${fitAnalysisControls('fit',fitTools)}
</section><section class="panel fitting-controls"><h2>Fit adjustments</h2><form id="fitting-form">
    <label class="field">3D model<select name="model">${modelOptions(fitModel)}</select></label>
    <p class="model-link"><a href="#models">Open Model Library</a></p>
    <label class="field">Garment<select name="pattern">${options(fitPattern,true)}</select></label>
    ${publisher?'<p class="fit-baseline muted">This style preview estimates the silhouette. Use the publisher’s draft for cutting dimensions.</p>':''}
    ${fitFabricFields(fabricName,startingFabric)}
    ${sleeveEligible?`<label class="field">Neckline style<select name="neckline">${studioDesign.necklines.map(name=>option(name,name,startingNeck)).join('')}</select></label>
      <fieldset class="wo-path"><legend>Shoulders and sleeves</legend>
        <label class="field">Shoulder support<select name="support">${supportStyles.map(name=>option(name,name,shoulders.support)).join('')}</select></label>
        ${straplessControls(supportModel,shoulders.support,shoulders.straplessSupport)}${strapShapeControls(shoulders.support,shoulders)}
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
  bindStraplessChoice(form);
  const canvas = document.querySelector('#model');
  const tiltControl = document.querySelector('#fit-tilt');
  const fitGuide = document.querySelector('#fit-guide');
  const sliders = document.querySelector('#fit-sliders');
  let angle = 0;
  let hoveredComponent=null;
  let selectedComponent=null;
  const pickedFabric=()=>form.elements.namedItem('fabric').value;
  const material=()=>readFitFabric(form,pickedFabric());
  const neckline=()=>form.elements.namedItem('neckline')?.value || startingNeck;
  const supportField=form.elements.namedItem('support');
  const straplessSupport=form.elements.namedItem('straplessSupport');
  const sleeveToggle=form.elements.namedItem('sleeves');
  const sleeveStyle=form.elements.namedItem('sleeveStyle');
  const strapWidth=form.elements.namedItem('strapWidth');
  const strapPlacement=form.elements.namedItem('strapPlacement');
  const sleeves = () => supportField?.value==='Integrated shoulders' && sleeveToggle.checked;
  function refreshShoulders() {
    if (!supportField) return;
    const strapless=supportField.value==='Strapless';
    refreshStraplessControls(form);
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
      if (result.support==='Strapless') result.straplessSupport=straplessSupport.value;
      if (studioDesign.supportsStrapShape(result.support)) Object.assign(result,readStrapShape(form));
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
    sliders.innerHTML=fitSlidersMarkup(keys(),values,neckline(),openSliderGroups(sliders));
  }
  drawControls();
  const picker=fitHandles.selection(canvas,{
    select:key=>{
      const input=key?form.elements.namedItem(key):null;
      if (!input?.matches('[data-fit-slider],[data-strap-shape-field]')) return;
      selectedComponent=key;
      focusSlider(input);
      draw();
    },
    hover:key=>{
      if (hoveredComponent===key) return;
      hoveredComponent=key;
      draw();
    },
    rotate:dx=>{
      angle+=dx*.016;
      draw();
    }
  });
  form.addEventListener('focusin',event=>{
    if (!event.target.matches('[data-fit-slider],[data-strap-shape-field]') || selectedComponent===event.target.name) return;
    selectedComponent=event.target.name;
    draw();
  });
  const layerMapNote=document.querySelector('#fit-layer-map-note');
  const analysis=bindFitAnalysis('fit',{
    draw,
    estimate:pose=>fitRegionSummary(pattern,modelType,body(),adjustments(),pose,material())
  });
  bindFitEase('fit',analysis,poses=>{
    const draft=changes();
    const next=garmentFit.suggestEase(pattern,modelType,body(),draft,adjustments(),material(),poses);
    const changed=Object.keys(next).filter(key=>next[key]!==draft[key]);
    if (changed.length) {
      drawControls(next);
      form.dispatchEvent(new Event('input'));
    }
    return changed;
  });
  function draw() {
    if (!canvas.isConnected) return;
    const ratio = Math.min(window.devicePixelRatio||1,2);
    const width=Math.round(canvas.clientWidth*ratio),height=Math.round(canvas.clientHeight*ratio);
    if (canvas.width!==width) canvas.width=width;
    if (canvas.height!==height) canvas.height=height;
    const componentKeys=keys();
    if (studioDesign.supportsStrapShape(supportField?.value)) componentKeys.push(...strapShapeKeys);
    if (!componentKeys.includes(selectedComponent)) selectedComponent=null;
    if (!componentKeys.includes(hoveredComponent)) hoveredComponent=null;
    const preview=drawModel(canvas,pattern,angle,adjustments(),body(),false,
      {pose:analysis.pose(),material:material(),show:analysis.show(),fabricName:pickedFabric(),redraw:draw,pitch:Number(tiltControl.value)*Math.PI/180,
        editor:{componentKeys,hoveredComponent,selectedComponent}});
    picker.targets(preview?.componentHits || {});
    if (layerMapNote) layerMapNote.hidden=!analysis.show();
  }
  const size = new ResizeObserver(draw);
  size.observe(canvas);
  fitCleanup = () => {size.disconnect();analysis.cleanup();picker.cleanup();};
  form.addEventListener('input',event=>{
    if (event.target.name==='pattern') { startFit(event.target.value); return; }
    if (event.target.name==='model') fitModel = event.target.value;
    if (event.target.name==='fabric') setFitFabric(form);
    if (event.target===supportField) {
      studioUnits.writeLength(strapWidth,studioDesign.supportWidth(supportField.value));
    }
    if (event.target.matches('[data-strap-shape-field],[data-strap-preset]')) {
      updateStrapShape(form,event.target);
      if (event.target.name) selectedComponent=event.target.name;
    }
    if (['sleeves','neckline','support'].includes(event.target.name)) {
      refreshShoulders();
      drawControls(changes());
    }
    if (event.target.matches('[data-fit-slider]')) selectedComponent=event.target.name;
    for (const [key,n] of Object.entries(changes())) document.querySelector('#'+key+'-value').textContent = adjustmentText(n);
    fittingDraft = undefined;
    fitGuide.hidden = true;
    draw();
    analysis.report();
  });
  form.addEventListener('invalid',revealInvalidFitFabric,true);
  form.addEventListener('reset',event=>{
    event.preventDefault();
    if (sleeveEligible) {
      supportField.value=shoulders.support;
      straplessSupport.value=shoulders.straplessSupport;
      for (const key of strapShapeKeys) writeSlider(form.elements.namedItem(key),shoulders[key]);
      form.querySelector('[data-strap-preset]').value=strapShapePreset(shoulders);
      sleeveToggle.checked=canHaveSleeves&&hasSleeves(pattern);
      sleeveStyle.value=shoulders.sleeveStyle;
      studioUnits.writeLength(strapWidth,shoulders.strapWidth);
      studioUnits.writeLength(strapPlacement,shoulders.strapPlacement);
      form.elements.namedItem('neckline').value=startingNeck;
      refreshShoulders();
    }
    form.elements.namedItem('fabric').value=fabricName;
    setFitFabric(form,startingFabric);
    drawControls();
    selectedComponent=hoveredComponent=null;
    form.dispatchEvent(new Event('input'));
  });
  tiltControl.addEventListener('input',draw);
  canvas.addEventListener('keydown',event=>{
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    if (event.key==='ArrowUp' || event.key==='ArrowDown') tiltControl.value=Number(tiltControl.value)+(event.key==='ArrowUp'?10:-10);
    else angle += event.key==='ArrowLeft'?-.2:.2;
    draw();
  });
  document.querySelector('#reset-view').onclick = ()=>{angle=0;tiltControl.value=0;draw();};
  document.querySelector('#preview-current-fit').onclick=()=>{
    analysis.cleanup();
    const reference=body();
    showGarmentPreview({...pattern,fit:{modelId:reference.id,modelMeasurements:snapshotModelMeasurements(reference),
      changes:adjustments(),fabric:{name:pickedFabric(),...material()}}});
  };
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
    const supportTools=compare.straplessSupport?studioDesign.straplessTools(straplessFitDesign(pattern,targetChanges)):[];
    const kit=make?constructionGuide(pattern,targetChanges,targetBody,fabric):{
      ...guide(pattern,compare,targetBody),
      tools:['Measuring tape, pins or clips, tailor’s chalk, seam ripper, matching thread, sewing machine, iron and press cloth',...supportTools].join(', '),
      fabric:'Existing garment and compatible fabric if an extension is needed.'
    };
    const route=make?'New garment':`Revision ${pattern.revision || 'base'} to ${savedTarget?'revision '+savedTarget.revision:'a new revision'}`;
    const summary=fitSummary(compare);
    const {tools,steps,visuals}=kit;
    const measurements=fitMeasurementSheet(targetBody,targetChanges,compare,make,pattern,sourceBody);
    const modelMeasurements=snapshotModelMeasurements(targetBody);
    const packet={...(savedTarget||pattern),design:designForFit((savedTarget||pattern).design,targetChanges),steps,visuals,measurements};
    const draftOrder={kind:make?'Construction':'Tailoring',plan:{
      ...(studioDesign.supportsStrapShape(targetChanges.support)?{strapWidth:targetChanges.strapWidth,...studioDesign.strapShape(targetChanges)}:{}),
      straplessSupport:targetChanges.straplessSupport
    }};
    const drawings=()=>orderFigureSections(draftOrder,packet,measurements)+workFigures.stepList(packet,draftOrder,measurements);
    fittingDraft={garment:pattern,...kit,summary,modelId:targetBody.id,modelMeasurements,changes:targetChanges,fabric,make,savedTarget,route,materials:kit.fabric,measurements};
    fitGuide.hidden = false;
    fitGuide.innerHTML = `<h2>${make?'Construction work order':'Tailoring work order'}</h2><p class="tight"><strong>${escape(route)}</strong></p><p class="tight">${escape(pattern.name)} · ${escape(targetBody.name)} · ${escape(fabric.name)} (${fabric.gsm} g/m²) · ${escape(summary)}</p>${fitMeasurementTable(measurements)}${workFigures.bodySheet(measurements)}<p class="tight"><strong>Materials</strong> ${escape(kit.fabric)}</p><p class="tight"><strong>Tools and materials</strong> ${escape(tools)}</p>${sewingVisuals.tools(tools)}${allowanceEditor(draftOrder,packet,'preview-allowance-form')}<p id="preview-fit-status" role="status"></p>
      <form id="save-fit-form">${savedTarget?'':`<label class="field">Garment name<input name="garmentName" required maxlength="100" value="${escape(make?pattern.name+' new':pattern.family?pattern.name:pattern.name+' fitted')}" ${!make&&pattern.family?'readonly':''}></label>`}${make?productionSizeField():''}<button>${savedTarget?'Save tailoring work order':make?'Save new garment and work order':'Save revision and create work order'}</button></form>
      <div id="fit-packet-drawings">${drawings()}</div>`;
    studioUnits.refresh(fitGuide);
    const readPreviewMeasurements=bindMeasurementEditor(fitGuide,settings=>{
      Object.assign(draftOrder,settings,{plan:{...draftOrder.plan,...settings.plan}});
      const figures=fitGuide.querySelector('#fit-packet-drawings');
      figures.innerHTML=drawings();
      studioUnits.refresh(figures);
      fitGuide.querySelector('#preview-fit-status').textContent='Updated the dimensions in the work-order preview.';
    });
    fitGuide.querySelector('#save-fit-form').addEventListener('submit',event=>{
      event.preventDefault();
      const fields=new FormData(event.target);
      const name = savedTarget?.name || fields.get('garmentName').trim();
      if (!name) {notify('Enter a garment name.');return;}
      const figureForm=fitGuide.querySelector('#preview-allowance-form');
      if (!figureForm.checkValidity()) {
        figureForm.closest('details').open=true;
        for (const section of figureForm.querySelectorAll('details')) section.open=true;
        figureForm.reportValidity();
        return;
      }
      const figureSettings=readPreviewMeasurements();
      fittingDraft.figureSettings={...figureSettings,plan:{...draftOrder.plan,...figureSettings.plan}};
      saveFit(name,fields.get('productionSize'));
    });
    fitGuide.scrollIntoView({block:'nearest'});
  });
  draw();
  analysis.report();
}
function saveFit(name,productionSize) {
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
  const design=designForFit(garment.design,changes);
  if (design) {
    const {name,gsm,cross,length,bend}=fabric;
    design.fabric=name;
    design.fabricSettings={gsm,cross,length,bend};
  }
  const plan = {id,family,revision,name,type:garment.type,level:'Intermediate',cut:garment.cut,
    model:base.id,color:garment.color,design,reference:garment.reference,fabric:materials,
    tools,steps,visuals,rebuildSteps,rebuildVisuals,measurements,
    buildFabric:make?materials:garment.buildFabric || garment.fabric,buildTools:make?tools:[garment.buildTools || garment.tools,tools].filter(Boolean).join(' · '),
    fit:{modelId,modelMeasurements,changes,fabric,source:garment.id}};
  state.custom.push(plan);
  const order={id:'WO-'+String(state.next++).padStart(3,'0'),title:name+' · Revision '+revision,pattern:id,kind:make?'Construction':'Tailoring',before:make?undefined:garment.id,
    due:'',notes,done:[],...figureSettings};
  state.orders.unshift(withProductionSize(order,plan,make?productionSize:''));
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
          <label class="field">Edit on garment<select id="design-edit-mode"><option value="fit">Shape and fit</option><option value="seams">Seam placement</option><option value="layers">Layers and ruffles</option><option value="sides">Left and right fit</option><option value="view">View only</option></select></label>
          <label class="field" id="design-target-field"><span>Controls</span><select id="design-edit-target"></select></label>
        </div>
        <div class="actions tight"><button type="button" class="secondary" id="design-open-fit" aria-controls="design-fit-panel">Fit sliders</button><button type="button" class="secondary" id="design-undo" disabled>Undo</button><button type="button" class="secondary" id="design-redo" disabled>Redo</button>
          <button type="button" class="secondary" id="design-merge-seams" hidden>Merge front seams</button>
          <button type="button" class="secondary" id="design-seam-settings" aria-controls="design-seams" hidden>Seam and zipper settings</button>
          <button type="button" class="secondary" id="design-quick-layer" hidden>＋ Add layer</button><button type="button" class="secondary" id="add-design-ruffle" hidden>＋ Add ruffle</button></div>
      </div>
      <div class="fit-canvas"><canvas id="design-model" role="img" tabindex="0" aria-label="Three-dimensional design preview" aria-describedby="design-editor-help"></canvas></div>
      <div class="viewer-footer design-editor-footer">
        <p class="muted tight" id="design-editor-help">Select a garment detail to open its slider. Drag to rotate.</p>
        <div class="fields design-orientation tight"><label class="field design-rotate">Rotate preview<input type="range" id="design-angle" min="-180" max="180" step="0.1" value="-21"></label>
          <label class="field">Tilt up or down<input type="range" id="design-tilt" min="-70" max="70" step="1" value="0"></label>
          <label class="field">Zoom<input type="range" id="design-zoom" min="70" max="145" value="100"></label></div>
        <div class="actions"><button type="button" class="secondary" id="design-front-view">Front view</button>
          <button type="button" class="secondary" id="preview-current-design">Preview on models</button></div>
      </div>
      ${fitAnalysisControls('design',`${fitEaseControls('design')}
        <p id="design-layer-map-note" class="fit-reading muted" hidden>The map shows tightness on the main garment. Layers are faded in this view.</p>`)}
    </div><div class="panel design-controls">
      <div class="actions design-panel-tabs" aria-label="Design controls">
        ${[['design','Design'],['fit','Fit'],['seams','Seams'],['layers','Layers'],['lace','Trims & details']].map(([key,label])=>`<button type="button" class="secondary" data-design-panel-tab="${key}" aria-pressed="${key==='design'}">${label}</button>`).join('')}
      </div><form id="design-form">
      <section data-design-panel="design" aria-label="Design settings">
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
      </section><section data-design-panel="fit" aria-label="Fit settings" hidden>
      <details class="design-options" id="design-fit-panel"><summary>Fit adjustments</summary>
        <p class="muted tight">Adjust the starting shape and use Show tightness to check the fit in different poses.</p>
        <div id="design-fit-sliders"></div>
        <button type="button" class="secondary" id="reset-design-fit">Reset fit adjustments</button>
      </details>
      <details class="design-options" id="design-asymmetry"><summary>Left and right fit</summary>
        <label class="field">Side to adjust<select id="design-asymmetry-side"><option value="left">Wearer’s left</option><option value="right">Wearer’s right</option></select></label>
        <p class="muted tight">These offsets add to the shared fit sliders on the selected side. Zero follows the shared fit.</p>
        <div id="design-asymmetry-fields"></div>
      </details>
      </section><section data-design-panel="seams" aria-label="Seam settings" hidden>
        <details class="design-options" id="design-seams"><summary>Seam placement</summary><div id="design-seam-fields"></div></details>
      </section><section data-design-panel="lace" aria-label="Trim and detail settings" hidden>
        <details class="design-options" id="design-lace"><summary>Lace trim</summary><div id="design-lace-fields"></div></details>
        <details class="design-options" id="design-stitch-details" open><summary>Stitched details</summary>
          <div id="design-stitch-fields"></div>
          <button type="button" class="secondary" id="add-stitch-detail">＋ Add stitched detail</button>
        </details>
      </section><section data-design-panel="layers" aria-label="Layer settings" hidden>
      <details class="design-options" id="design-layers">
        <summary>Fabric layers</summary>
        <p id="design-layer-hint" class="muted tight"></p>
        <div id="design-layer-list"></div>
        <button type="button" class="secondary" id="add-design-layer">＋ Add layer</button>
      </details>
      </section>${productionSizeField()}<div class="actions design-save"><button name="save" value="library">Save to Pattern Library</button><button class="secondary" name="save" value="order">Save and create work order</button></div>
    </form></div></div>
    <details class="panel instructions" id="design-guide"><summary>Preview illustrated construction plan</summary><div id="design-guide-content"></div></details>`;
  const form = document.querySelector('#design-form');
  bindStraplessChoice(form);
  const designTabs = [...view.querySelectorAll('[data-design-panel-tab]')];
  const designPanels = [...form.querySelectorAll('[data-design-panel]')];
  let designPanel='design';
  function showDesignPanel(key) {
    if (key===designPanel) return;
    designPanel=key;
    for (const button of designTabs) button.setAttribute('aria-pressed',button.dataset.designPanelTab===key);
    for (const section of designPanels) section.hidden=section.dataset.designPanel!==key;
    form.scrollTop=0;
  }
  function openDesignPanel(key) {
    showDesignPanel(key);
    const section=designPanels.find(panel=>panel.dataset.designPanel===key);
    const first=section.querySelector('details');
    if (first && key!=='design') first.open=true;
  }
  function revealDesignControl(input) {
    const panel=input?.closest('[data-design-panel]');
    if (!panel) return;
    showDesignPanel(panel.dataset.designPanel);
    focusSlider(input);
  }
  for (const button of designTabs) button.addEventListener('click',()=>openDesignPanel(button.dataset.designPanelTab));
  form.addEventListener('invalid',event=>{
    const panel=event.target.closest('[data-design-panel]');
    if (panel) showDesignPanel(panel.dataset.designPanel);
  },true);
  form.addEventListener('invalid',revealInvalidFitFabric,true);
  const canvas = document.querySelector('#design-model');
  const angle = document.querySelector('#design-angle');
  const tiltControl = document.querySelector('#design-tilt');
  const zoom = document.querySelector('#design-zoom');
  const mode = document.querySelector('#design-edit-mode');
  const target = document.querySelector('#design-edit-target');
  const targetField = document.querySelector('#design-target-field');
  const quickLayer = document.querySelector('#design-quick-layer');
  const addRuffle = document.querySelector('#add-design-ruffle');
  const mergeButton = document.querySelector('#design-merge-seams');
  const seamSettingsButton = document.querySelector('#design-seam-settings');
  const editorHelp = document.querySelector('#design-editor-help');
  const settings = document.querySelector('#design-settings');
  const fitSliders = document.querySelector('#design-fit-sliders');
  const fitPanel = document.querySelector('#design-fit-panel');
  const layerMapNote = document.querySelector('#design-layer-map-note');
  const seamPanel = document.querySelector('#design-seams');
  const seamFields = document.querySelector('#design-seam-fields');
  const laceFields = document.querySelector('#design-lace-fields');
  const stitchFields = document.querySelector('#design-stitch-fields');
  const addStitch = document.querySelector('#add-stitch-detail');
  const asymmetryPanel = document.querySelector('#design-asymmetry');
  const asymmetryFields = document.querySelector('#design-asymmetry-fields');
  const asymmetrySide = document.querySelector('#design-asymmetry-side');
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
  const modelType=()=>studioDesign.baseModel(designDraft.model);
  const fitKeys=()=>garmentFit.keys(modelType(),studioDesign.isSleeved(designDraft));
  const activeDesignFit=()=>Object.fromEntries(fitKeys().flatMap(key=>{
    const value=designDraft.fitAdjustments?.[key];
    return Number.isFinite(value)&&value!==0 ? [[key,value]] : [];
  }));
  const draftPattern=()=>({model:modelType(),design:designDraft,color:designDraft.primary});
  const adjustments=()=>({...activeDesignFit(),hasSleeves:studioDesign.isSleeved(designDraft)});
  const material=()=>readFitFabric(form,designDraft.fabric);
  function fabricSettings() {
    const {gsm,cross,length,bend}=material();
    return {gsm,cross,length,bend};
  }
  const fitAnalysis=bindFitAnalysis('design',{
    draw:preview,
    estimate:pose=>fitRegionSummary(draftPattern(),modelType(),body(),adjustments(),pose,material())
  });
  view.querySelector('#preview-current-design').onclick=()=>{
    fitAnalysis.cleanup();
    const reference=body();
    showGarmentPreview({...draftPattern(),name:designDraft.name || 'New custom piece',
      fit:{modelId:reference.id,modelMeasurements:snapshotModelMeasurements(reference),changes:adjustments(),
        fabric:{name:designDraft.fabric,...material()}}},{size:form.elements.namedItem('productionSize').value});
  };
  function refreshFitPreview() {
    preview();
    fitAnalysis.report();
  }
  const seamNames={waistSeam:'Waist join seam',panelSeam:'Front panel seams'};
  const layerComponents={attachment:'layerAttachment',hemOffset:'layerHem',depth:'layerHem',sweep:'layerSweep'};
  const laceComponents={neckline:'laceNeckline',sleeves:'laceSleeves',hem:'laceHem',pockets:'lacePocket',
    waistband:'laceWaistband',seams:'laceSeam',layer:'layerLaceTrim'};
  const hemLabels={hemDrop:'High-to-low drop',hemPointCount:'Number of points',hemRotation:'Rotate the points',
    hemFront:'Center front',hemLeft:'Left side',hemBack:'Center back',hemRight:'Right side'};
  const hemSides=['hemFront','hemLeft','hemBack','hemRight'];
  const layeredSideFields={leftSweep:'Extra fullness on the left',rightSweep:'Extra fullness on the right',
    leftAttachment:'Left attachment offset',rightAttachment:'Right attachment offset'};
  let fitTarget='all';
  let layerTarget=0;
  let componentKeys=[];
  let selectedComponent=null;
  let hoveredComponent=null;
  let panelSnapOffset;
  let panelZipperMaxLength;
  let layerAttachmentDragSpan;
  let layerAttachmentDragSpans={};
  let guidedComponents=[];
  const editorSnapshot=()=>({fit:activeDesignFit(),seams:studioDesign.seams(designDraft),layers:studioDesign.layers(designDraft),layerTarget,
    hem:studioDesign.hemContour(designDraft),asymmetry:studioDesign.asymmetry(designDraft),shoulderSide:designDraft.shoulderSide,
    strapShape:studioDesign.strapShape(designDraft),straplessSupport:designDraft.straplessSupport,laceTrims:designDraft.laceTrims,
    stitchDetails:designDraft.stitchDetails,closure:designDraft.closure,fastener:designDraft.fastener});
  const editor=fitHandles.history({
    undoButton:document.querySelector('#design-undo'),redoButton:document.querySelector('#design-redo'),
    snapshot:editorSnapshot,
    restore:restoreEditor});
  let activeInput;
  function rememberInput(input) {
    if (activeInput!==input) editor.checkpoint();
    activeInput=input;
  }
  form.addEventListener('change',()=>{activeInput=null;});
  const picker=fitHandles.selection(canvas,{
    select:key=>{
      const input=componentSlider(key);
      if (input) revealDesignControl(input);
    },
    hover:key=>{
      hoveredComponent=key;
      preview();
    },
    rotate:dx=>rotatePreview(dx/Math.max(1,canvas.clientWidth)*275),
    dragVertical:dragLayerAttachment
  });

  function changeLayerValue(index,key,value) {
    const layers=studioDesign.layers(designDraft);
    layers[index]={...layers[index],[key]:value};
    designDraft.layers=studioDesign.layers({...designDraft,layers});
  }

  function dragLayerAttachment(key) {
    const target=layerComponent(key);
    if (target?.key!=='layerAttachment') return null;
    const input=componentSlider(key);
    if (!input) return null;
    const before=editorSnapshot();
    const {index}=target;
    const initial=input.valueAsNumber;
    const span=layerAttachmentDragSpans[index] ?? (index===layerTarget?layerAttachmentDragSpan:undefined) ?? Math.max(30,canvas.clientHeight*.45);
    let height=initial;
    layerTarget=index;
    mode.value='layers';
    selectedComponent=target.key;
    refreshEditor();
    canvas.setAttribute('data-layer-attachment-dragging','');
    const apply=next=>{
      changeLayerValue(index,'attachment',next);
      if (input.isConnected) writeSlider(input,next);
      height=next;
      preview();
    };
    return {
      move(dy) {
        const next=fabricFit.clamp(initial+Math.round(100*dy/span),Number(input.min),Number(input.max));
        if (next!==height) apply(next);
      },
      finish(cancelled) {
        canvas.removeAttribute('data-layer-attachment-dragging');
        if (height===initial) return;
        if (cancelled) apply(initial);
        else {
          editor.checkpoint(before);
          showDesignPanel('layers');
          openSliderSections(input);
        }
        updateGuide();
      }
    };
  }

  function componentSlider(key) {
    if (key==null) return null;
    const layer=layerComponent(key);
    if (layer) return layerList.querySelector(`[data-layer-index="${layer.index}"] [data-component-slider="${layer.key}"]`);
    if (mode.value==='sides') {
      const input=asymmetryFields.querySelector(`[data-asymmetry-field="${key}"]`);
      if (input) return input;
    }
    const name={designClosure:'closure',designPocket:'pocket',straplessSupport:'straplessSupport'}[key];
    if (name) {
      if (key==='designClosure') {
        const controls=settings.querySelector('#design-fastener-fields:not([hidden])');
        if (controls) return controls.querySelector('[data-fastener-field]') || form.elements.namedItem(name);
      }
      return form.elements.namedItem(name);
    }
    return settings.querySelector(`[data-component-slider="${key}"]`) ||
      laceFields.querySelector(`[data-component-slider="${key}"]`) ||
      stitchFields.querySelector(`[data-component-slider="${key}"]`) ||
      seamFields.querySelector(`[data-component-slider="${key}"]`) ||
      layerList.querySelector(`[data-layer-index="${layerTarget}"] [data-component-slider="${key}"]`) ||
      fitSliders.querySelector(`[data-fit-slider][name="${key}"]`);
  }

  function layerComponent(key) {
    const match=/^(layerAttachment|layerHem|layerSweep|layerLaceTrim)(?::(\d+))?$/.exec(key);
    return match?{key:match[1],index:match[2]===undefined?layerTarget:Number(match[2])}:null;
  }

  function selectComponent(input) {
    const component=input.dataset.componentSlider || input.dataset.highlightComponent || input.dataset.asymmetryField ||
      (input.hasAttribute('data-fit-slider')?input.name:{closure:'designClosure',pocket:'designPocket',straplessSupport:'straplessSupport'}[input.name]);
    if (!component) return;
    const layer=input.closest('[data-layer-index]');
    if (layer) {
      mode.value='layers';
      layerTarget=Number(layer.dataset.layerIndex);
    } else if (asymmetryFields.contains(input)) {
      mode.value='sides';
    } else if (input.dataset.mainHem) {
      mode.value='fit';
      fitTarget='length';
    } else if (laceFields.contains(input) || stitchFields.contains(input)) {
      mode.value='fit';
    } else if (seamFields.contains(input)) mode.value='seams';
    else {
      mode.value='fit';
      const groups=fitHandles.available(fitKeys());
      if (fitTarget!=='all' && !groups.find(([key])=>key===fitTarget)?.[1].keys.includes(component)) {
        fitTarget=groups.find(([,group])=>group.keys.includes(component))?.[0]??fitTarget;
      }
      if (component==='backNeck' && selectedComponent!==component) angle.value=180;
      if (['neckDepth','neckWidth'].includes(component)&&selectedComponent==='backNeck') angle.value=0;
      if (component.startsWith('strapBack')&&Math.abs(Number(angle.value))<90) angle.value=180;
      if (component.startsWith('strapFront')&&Math.abs(Number(angle.value))>90) angle.value=0;
    }
    selectedComponent=component;
    refreshEditor();
    preview();
  }
  form.addEventListener('focusin',event=>selectComponent(event.target));

  const singleSeam=seams=>seams.panelSeam===studioDesign.centerFrontSeam;
  const wrapAngle=value=>((value+180)%360+360)%360-180;
  function describeSeamAngle(value) {
    const location=studioDesign.singleSeamLocation(value);
    const title=location[0].toUpperCase()+location.slice(1);
    return value%90===0?title:`${title} · ${Math.abs(value)}° from center front`;
  }
  function zipperLimit() {
    return panelZipperMaxLength ?? studioDesign.panelZipperLimits[1];
  }

  function hemOptions(source,layer=false) {
    const hem=studioDesign.hemContour(source);
    const marker=layer?'data-layer-field':'data-main-hem';
    const values=key=>slider(hemLabels[key],`${marker}="${key}"${layer?' data-highlight-component="layerHem"':` name="${key}" ${key==='hemDrop'?'data-component-slider':'data-highlight-component'}="mainHem"`}`,
      studioDesign.hemContourLimits[key],hem[key],{unit:key==='hemPointCount'?'':key==='hemRotation'?'°':'cm',
        step:['hemPointCount','hemRotation'].includes(key)?1:.5,signed:hemSides.includes(key)});
    return `<label class="field">Hem shape<select ${marker}="hemStyle"${layer?'':' name="hemStyle"'}>${studioDesign.hemStyles.map(style=>option(style,style,hem.hemStyle)).join('')}</select></label>
      <div class="fields" data-fairy-sliders${hem.hemStyle===studioDesign.hemStyles[1]?'':' hidden'}>${['hemDrop','hemPointCount','hemRotation'].map(values).join('')}</div>
      <details class="design-options" data-hem-asymmetry${hemSides.some(key=>hem[key])?' open':''}><summary>Uneven hem</summary>
        <p class="muted tight">Positive values lengthen each area. Negative values shorten it. The hem blends between them.</p>
        <div class="fields">${hemSides.map(values).join('')}</div></details>`;
  }

  function drawMainHem() {
    const fields=settings.querySelector('#design-main-hem-fields');
    if (fields) {
      const uneven=fields.querySelector('[data-hem-asymmetry]')?.open;
      fields.innerHTML=hemOptions(designDraft);
      if (uneven) fields.querySelector('[data-hem-asymmetry]').open=true;
      studioUnits.refresh(fields);
    }
  }

  function drawAsymmetry() {
    const side=asymmetrySide.value;
    const settings=studioDesign.asymmetry(designDraft)[side];
    const keys=studioDesign.asymmetryKeys(designDraft);
    asymmetryPanel.hidden=!keys.length;
    asymmetryFields.innerHTML=sliderGroups(keys,key=>slider(key==='panelSeam'?'Front panel seam offset':garmentFit.fields[key][0],
      `data-asymmetry-field="${key}"`,studioDesign.asymmetryLimits[key],settings[key]??0,{signed:true}),openSliderGroups(asymmetryFields));
    studioUnits.refresh(asymmetryFields);
  }

  function laceGroup(placement,label,trim,open) {
    const display=trim||studioDesign.newLaceTrim();
    return `<details class="design-options slider-group" data-lace-placement="${placement}"${placement==='layer'?' data-layer-section="lace"':''}${open?' open':''}>
      <summary>${label}</summary><div class="slider-group-content">
        <label class="sleeve-choice"><input type="checkbox" data-lace-enable${trim?' checked':''}> Add lace trim</label>
        ${placement==='seams'?'<p class="muted tight" data-lace-seam-location></p>':''}
        <fieldset class="lace-settings"${trim?'':' disabled'}><div class="fields">
          <label class="field">Lace style<select data-lace-field="style">${studioDesign.laceStyles.map(style=>option(style,style,display.style)).join('')}</select></label>
          <label class="field">Lace color<input type="color" data-lace-field="color" value="${escape(display.color)}"></label>
        </div>${slider('Trim width',`data-lace-field="width" data-component-slider="${laceComponents[placement]}"`,studioDesign.laceWidthLimits,display.width)}</fieldset>
      </div></details>`;
  }

  function drawLace() {
    const placements=studioDesign.lacePlacements(designDraft);
    const trims=studioDesign.laceTrims(designDraft);
    const open=new Set([...laceFields.querySelectorAll('[data-lace-placement][open]')].map(section=>section.dataset.lacePlacement));
    laceFields.innerHTML=Object.entries(placements).map(([key,label])=>laceGroup(key,label,trims[key],open.has(key))).join('');
    studioUnits.refresh(laceFields);
  }

  const stitchSources=()=>Array.isArray(designDraft.stitchDetails)?designDraft.stitchDetails:[];
  function visibleStitchDetails() {
    return stitchSources().flatMap((entry,sourceIndex)=>{
      const detail=studioDesign.stitchDetail(entry,designDraft);
      return detail?[{detail,sourceIndex}]:[];
    });
  }

  function drawStitchDetails() {
    const placements=studioDesign.stitchPlacements(designDraft);
    const open=new Set([...stitchFields.querySelectorAll('[data-stitch-index][open]')].map(card=>Number(card.dataset.stitchSource)));
    const current=stitchSources();
    const visible=visibleStitchDetails();
    const visibleSources=new Set(visible.map(({sourceIndex})=>sourceIndex));
    const unavailable=current.flatMap((detail,sourceIndex)=>visibleSources.has(sourceIndex)?[]:[{detail,sourceIndex}]);
    const cards=visible.map(({detail,sourceIndex},index)=>{
      const gathered=detail.style==='Gathered ruffle';
      const pick=(key,label,items)=>`<label class="field">${label}<select data-stitch-field="${key}">${items.map(([value,text])=>option(value,text,detail[key])).join('')}</select></label>`;
      const depth=slider(gathered?'Ruffle depth':'Folded section length',`data-stitch-field="depth" data-component-slider="stitchDetail:${index}"`,studioDesign.stitchLimits.depth,detail.depth,{step:.1});
      const repeat=gathered
        ?slider('Gathering fullness',`data-stitch-field="fullness" data-highlight-component="stitchDetail:${index}"`,studioDesign.stitchLimits.fullness,detail.fullness,{unit:'×',step:.05})
        :slider('Spacing between folds',`data-stitch-field="spacing" data-highlight-component="stitchDetail:${index}"`,studioDesign.stitchLimits.spacing,detail.spacing,{step:.1});
      return `<details class="design-options slider-group" data-stitch-index="${index}" data-stitch-source="${sourceIndex}"${open.has(sourceIndex)?' open':''}>
        <summary>${escape(detail.style)} · ${escape(placements[detail.placement])}</summary><div class="slider-group-content">
          <div class="fields">${pick('style','Technique',studioDesign.stitchStyles.map(style=>[style,style]))}${pick('placement','Placement',Object.entries(placements))}</div>
          ${depth}${repeat}${gathered?'<p class="muted tight">2× fullness uses a strip twice the length of the sewn edge.</p>':''}
          <button type="button" class="secondary" data-remove-stitch-detail aria-label="Remove ${escape(detail.style)} at ${escape(placements[detail.placement].toLowerCase())}">Remove</button>
        </div></details>`;
    }).join('');
    const unavailableOpen=stitchFields.querySelector('[data-inactive-stitch-details]')?.open;
    stitchFields.innerHTML=cards+(unavailable.length?`<details class="design-options" data-inactive-stitch-details${unavailableOpen?' open':''}>
      <summary>Unavailable placements (${unavailable.length})</summary><div class="slider-group-content">
        <p class="muted tight">These details will return if you switch back to a garment type or sleeve that supports them.</p>
        ${unavailable.map(({detail,sourceIndex})=>`<div class="actions tight" data-stitch-source="${sourceIndex}">
          <button type="button" class="secondary" data-remove-stitch-detail>Remove ${escape(String(detail?.style||'detail').toLowerCase())}</button></div>`).join('')}
      </div></details>`:'');
    addStitch.disabled=current.length>=studioDesign.maxStitchDetails;
    studioUnits.refresh(stitchFields);
  }

  function refreshEditor() {
    const groups=fitHandles.available(fitKeys());
    const seamKeys=studioDesign.seamKeys(designDraft.model);
    const asymmetryKeys=studioDesign.asymmetryKeys(designDraft);
    const seams=studioDesign.seams(designDraft);
    const single=singleSeam(seams);
    const seamLaceNote=laceFields.querySelector('[data-lace-seam-location]');
    if (seamLaceNote) {
      const seam=studioDesign.laceSeamPlacement(designDraft);
      const overlay=seam.kind==='single'?`the seam at ${studioDesign.singleSeamLocation(seam.angle)}`:seam.kind==='panels'?'the two front panel seams':'the side seams';
      const location=`Lace follows ${overlay}.`;
      if (seamLaceNote.textContent!==location) seamLaceNote.textContent=location;
    }
    const layerAllowed=studioDesign.layerKindChoices(designDraft.model).length>0;
    mode.querySelector('[value=seams]').disabled=!seamKeys.length;
    mode.querySelector('[value=layers]').disabled=!layerAllowed;
    designTabs.find(button=>button.dataset.designPanelTab==='seams').hidden=!seamKeys.length;
    designTabs.find(button=>button.dataset.designPanelTab==='layers').hidden=!layerAllowed;
    if ((designPanel==='seams'&&!seamKeys.length)||(designPanel==='layers'&&!layerAllowed)) showDesignPanel('design');
    mode.querySelector('[value=sides]').disabled=!asymmetryKeys.length;
    if (mode.selectedOptions[0]?.disabled) mode.value='fit';
    const layers=studioDesign.layers(designDraft);
    layerTarget=Math.max(0,Math.min(layerTarget,layers.length-1));
    quickLayer.hidden=addRuffle.hidden=mode.value!=='layers';
    quickLayer.disabled=addRuffle.disabled=layers.length>=studioDesign.maxLayers;
    mergeButton.hidden=mode.value!=='seams'||!seamKeys.includes('panelSeam');
    mergeButton.textContent=single?'Split into front seams':'Merge front seams';
    seamSettingsButton.hidden=mergeButton.hidden||!single;
    targetField.hidden=true;
    guidedComponents=[];
    const layerKeys=layers.flatMap((layer,index)=>{
      const keys=Object.keys(layerComponents).filter(field=>Object.hasOwn(layer,field)).map(field=>layerComponents[field]);
      if (layer.laceTrim) keys.push(laceComponents.layer);
      return index===layerTarget?keys:keys.map(key=>`${key}:${index}`);
    });
    const seamComponents=seamKeys.map(key=>key==='panelSeam'&&single?'panelAngle':key);
    if (single && Number.isFinite(seams.panelZipper)) seamComponents.push('panelZipper');
    if (mode.value==='fit') {
      if (fitTarget!=='all' && !groups.some(([key])=>key===fitTarget)) fitTarget='all';
      target.innerHTML=option('all','All fit areas',fitTarget)+groups.map(([key,{label}])=>option(key,label,fitTarget)).join('');
      targetField.hidden=!groups.length;
      guidedComponents=groups.find(([key])=>key===fitTarget)?.[1].keys || [];
    } else if (mode.value==='layers') {
      target.innerHTML=layers.map((layer,i)=>option(String(i),`${i+1}. ${layer.kind}`,String(layerTarget))).join('');
      targetField.hidden=!layers.length;
    } else if (mode.value==='sides') {
      target.innerHTML=['left','right'].map(side=>option(side,`Wearer’s ${side}`,asymmetrySide.value)).join('');
      targetField.hidden=false;
    }
    componentKeys=[];
    if (mode.value!=='view') {
      const support=studioDesign.selectedSupport(designDraft);
      const fitComponents=studioDesign.hasFairyHem(designDraft)&&mode.value!=='sides'
        ?fitKeys().map(key=>key==='length'?'mainHem':key):fitKeys();
      const indicatedSeams=mode.value==='seams'?seamComponents:
        seamComponents.filter(key=>Object.hasOwn(seams,key==='panelAngle'?'panelSeam':key));
      componentKeys=[...fitComponents,...layerKeys,...indicatedSeams,'designClosure','designPocket',
        ...Object.keys(studioDesign.laceTrims(designDraft)).map(key=>laceComponents[key]),
        ...studioDesign.stitchDetails(designDraft).map((_,index)=>`stitchDetail:${index}`)];
      if (studioDesign.supportsStrapShape(support)) componentKeys.push(...strapShapeKeys);
      if (support==='Strapless') componentKeys.push('straplessSupport');
    }
    targetField.querySelector('span').textContent=mode.value==='layers'?'Active layer':mode.value==='sides'?'Side to adjust':'Controls';
    editorHelp.textContent=mode.value==='view'?'Drag the canvas to rotate.':mode.value==='layers'&&!layers.length
      ?'Add a layer or ruffle to start.':componentKeys.includes('layerAttachment')
        ?'Drag the attachment line up or down. Select a detail to open its slider, or drag beside the garment to rotate.'
        :'Select a garment detail to open its slider. Drag to rotate.';
    if (!componentKeys.includes(selectedComponent)) selectedComponent=null;
    if (!componentKeys.includes(hoveredComponent)) hoveredComponent=null;
  }

  function drawSeams() {
    const keys=studioDesign.seamKeys(designDraft.model);
    const seams=studioDesign.seams(designDraft);
    const open=new Set([...seamFields.querySelectorAll('[data-seam-group][open]')].map(group=>group.dataset.seamGroup));
    seamPanel.hidden=!keys.length;
    seamFields.innerHTML=keys.map(key=>{
      const enabled=Object.hasOwn(seams,key);
      const group=`data-seam-group="${key}"${open.has(key)?' open':''}`;
      if (key==='panelSeam' && singleSeam(seams)) {
        const [min,max]=studioDesign.panelAngleLimits;
        const [minLength]=studioDesign.panelZipperLimits;
        const zipper=Number.isFinite(seams.panelZipper);
        const tooShort=zipperLimit()<minLength;
        return `<details class="design-options slider-group" ${group}><summary>Single vertical seam and zipper</summary><div class="slider-group-content">
          <button class="secondary" type="button" data-seam-merge>Split into front seams</button>
          <label class="field">Seam position <output data-seam-position>${escape(describeSeamAngle(seams.panelAngle??0))}</output>
            <input type="range" data-seam-angle data-component-slider="panelAngle" min="${min}" max="${max}" step="1" value="${seams.panelAngle??0}"></label>
          <div class="actions tight" aria-label="Seam positions">${[[-90,'Right side'],[0,'Center front'],[90,'Left side'],[180,'Center back']].map(([value,label])=>`<button class="secondary" type="button" data-seam-side="${value}">${label}</button>`).join('')}</div>
          <label class="sleeve-choice"><input type="checkbox" data-seam-zipper${zipper?' checked':''}${tooShort?' disabled':''}> Use this seam for the zipper</label>
          <label class="field" data-seam-zipper-style${zipper?'':' hidden'}>Zipper style<select data-seam-zipper-kind${zipper?'':' disabled'}>${studioDesign.panelZipperKinds.map(kind=>option(kind,kind,studioDesign.panelZipperStyle(designDraft))).join('')}</select></label>
          ${slider('Opening length from top of seam','data-seam-zipper-length data-component-slider="panelZipper"',[minLength,Math.max(minLength,zipperLimit())],seams.panelZipper??Math.max(minLength,Math.min(studioDesign.panelZipperDefault,zipperLimit())),{disabled:!zipper})}
          <p class="muted tight" data-seam-zipper-note>${tooShort?'This seam is too short for the zipper.':'The opening starts at the upper edge. Its length sets the zipper stop.'}</p></div></details>`;
      }
      const [min,max]=studioDesign.seamLimits[key];
      const direction=key==='waistSeam'?'Positive moves the seam down from the pattern waist.':'Positive moves the mirrored seams toward the sides.';
      return `<details class="design-options slider-group" ${group}><summary>${seamNames[key]}</summary><div class="slider-group-content">
        <label class="sleeve-choice"><input type="checkbox" data-seam-enable="${key}"${enabled?' checked':''}> Include on garment</label>
        ${slider('Offset from starting seam',`data-seam-value="${key}" data-component-slider="${key}"`,[min,max],seams[key]??0,{signed:true})}
        <p class="muted tight">${direction}</p>${key==='panelSeam'?'<button class="secondary" type="button" data-seam-merge>Merge front seams</button>':''}</div></details>`;
    }).join('');
    studioUnits.refresh(seamFields);
    syncSeamClosure();
  }

  function syncSeamClosure() {
    const select=form.elements.namedItem('closure');
    if (!select) return;
    const active=Number.isFinite(studioDesign.seams(designDraft).panelZipper);
    select.disabled=active;
    select.closest('label').hidden=active;
    settings.querySelector('#design-fastener-fields').hidden=active;
    const note=settings.querySelector('[data-seam-closure-note]');
    if (note) {
      note.hidden=!active;
      if (active) note.textContent=`Closure uses the ${studioDesign.effectiveClosure(designDraft).toLowerCase()} in Seam placement.`;
    }
    const style=seamFields.querySelector('[data-seam-zipper-style]');
    if (style) {
      style.hidden=!active;
      style.querySelector('select').disabled=!active;
    }
  }

  function setSingleSeamAngle(value,follow=false) {
    designDraft.seams={...studioDesign.seams(designDraft),panelAngle:value};
    const relative=wrapAngle(value-Number(angle.value));
    if (follow) angle.value=value;
    else if (Math.abs(relative)>52) angle.value=wrapAngle(value-Math.sign(relative)*52);
    seamFields.querySelector('[data-seam-angle]').value=value;
    seamFields.querySelector('[data-seam-position]').textContent=describeSeamAngle(value);
  }

  function setZipperLength(value) {
    designDraft.seams={...studioDesign.seams(designDraft),panelZipper:Math.max(studioDesign.panelZipperLimits[0],Math.min(value,zipperLimit()))};
  }

  function syncZipperLimit(maximum) {
    if (!Number.isFinite(maximum)||panelZipperMaxLength===maximum) return false;
    panelZipperMaxLength=maximum;
    const input=seamFields.querySelector('[data-seam-zipper-length]');
    if (!input) return false;
    const toggle=seamFields.querySelector('[data-seam-zipper]');
    const min=studioDesign.panelZipperLimits[0];
    const usable=maximum>=min;
    const cap=Math.max(min,maximum);
    input.max=cap;
    toggle.disabled=!usable;
    seamFields.querySelector('[data-seam-zipper-note]').textContent=usable
      ?'The opening starts at the upper edge. Its length sets the zipper stop.':'This seam is too short for the zipper.';
    const seams=studioDesign.seams(designDraft);
    if (!Number.isFinite(seams.panelZipper)) {
      writeSlider(input,Math.min(studioDesign.panelZipperDefault,cap));
    } else if (!usable || seams.panelZipper>maximum) {
      if (usable) setZipperLength(maximum);
      else {
        delete seams.panelZipper;
        designDraft.seams=seams;
        toggle.checked=false;
        input.disabled=true;
      }
      writeSlider(input,usable?maximum:min);
      syncSeamClosure();
      refreshEditor();
      return true;
    }
    refreshEditor();
    return false;
  }

  function togglePanelSeams() {
    const seams=studioDesign.seams(designDraft);
    const split=singleSeam(seams);
    const panelSeam=split?0:studioDesign.centerFrontSeam;
    designDraft.seams=studioDesign.seams({...designDraft,seams:{waistSeam:seams.waistSeam,panelSeam}});
    panelZipperMaxLength=undefined;
    angle.value=0;
    drawSeams();
    drawAsymmetry();
    refreshEditor();
  }

  function restoreEditor(snapshot) {
    Object.assign(designDraft,snapshot.hem);
    Object.assign(designDraft,snapshot.strapShape);
    designDraft.fitAdjustments=snapshot.fit;
    designDraft.seams=snapshot.seams;
    designDraft.asymmetry=snapshot.asymmetry;
    designDraft.shoulderSide=snapshot.shoulderSide;
    designDraft.straplessSupport=snapshot.straplessSupport;
    if (studioDesign.closureChoices(designDraft.model).includes(snapshot.closure)) {
      form.elements.closure.value=designDraft.closure=snapshot.closure;
      designDraft.fastener=snapshot.fastener;
      drawFastenerFields();
    }
    designDraft.laceTrims=snapshot.laceTrims;
    designDraft.stitchDetails=snapshot.stitchDetails;
    panelZipperMaxLength=undefined;
    if (mode.value==='seams') angle.value=snapshot.seams.panelAngle??0;
    designDraft.layers=snapshot.layers;
    layerTarget=snapshot.layerTarget;
    drawFitSliders();
    drawSeams();
    drawLayers();
    drawLace();
    drawStitchDetails();
    drawMainHem();
    drawAsymmetry();
    if (form.elements.shoulderSide) form.elements.shoulderSide.value=studioDesign.selectedShoulderSide(designDraft);
    if (form.elements.straplessSupport) {
      form.elements.straplessSupport.value=studioDesign.selectedStraplessSupport(designDraft);
      for (const key of strapShapeKeys) writeSlider(form.elements.namedItem(key),snapshot.strapShape[key]);
      form.querySelector('[data-strap-preset]').value=strapShapePreset(snapshot.strapShape);
    }
    refreshEditor();
    showMeasurements();
    refreshFitPreview();
    updateGuide();
  }
  function showMeasurements() {
    const model = body();
    const target = studioDesign.isBodice(designDraft.model)?['bust',model.bust]:['hip',model.hip];
    const finished=target[1]+Number(designDraft.ease)+(designDraft.fitAdjustments?.[target[0]]||0);
    measurementSummary.textContent = `Bust ${model.bust} cm · Waist ${model.waist} cm · Hip ${model.hip} cm · Shoulders ${model.shoulder} cm. Finished ${target[0]} target ${finished} cm.`;
  }
  function drawFitSliders() {
    fitSliders.innerHTML=fitSlidersMarkup(fitKeys(),activeDesignFit(),designDraft.neckline,openSliderGroups(fitSliders));
    studioUnits.refresh(fitSliders);
  }
  function refreshDesignStraps(resetWidth=false) {
    const width=form.elements.namedItem('strapWidth');
    if (!width) return;
    const placement=form.elements.namedItem('strapPlacement');
    const support=studioDesign.selectedSupport(designDraft);
    const strapless=support==='Strapless';
    refreshStraplessControls(form);
    const sleeve=form.elements.namedItem('sleeve');
    if (sleeve) {
      sleeve.disabled=strapless;
      sleeve.closest('.field').hidden=strapless;
    }
    for (const row of settings.querySelectorAll('[data-design-strap-sizing]')) row.hidden=strapless;
    const side=settings.querySelector('[data-one-shoulder-side]');
    if (side) side.hidden=support!=='One-shoulder';
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
  function drawFastenerFields(open=false) {
    const host=settings.querySelector('#design-fastener-fields');
    const detail=garmentFasteners.settings(designDraft);
    if (!detail) {
      host.replaceChildren();
      return;
    }
    const titles={buttons:'Button layout',ties:'Wrap tie details',drawstring:'Drawstring and casing'};
    const controls=Object.entries(garmentFasteners.fields[detail.kind]).filter(([key])=>
      Object.hasOwn(detail,key) && (key!=='count'||designDraft.closure!=='Back button and loop'));
    const expanded=open || host.querySelector('details')?.open;
    host.innerHTML=`<details class="design-options"${expanded?' open':''}><summary>${titles[detail.kind]}</summary>
      <div class="slider-group-content"><div class="fields">${controls.map(([key,[label,min,max,step]])=>
        slider(label,`data-fastener-field="${key}" data-highlight-component="designClosure"`,[min,max],detail[key],{unit:key==='count'?'':'cm',step})).join('')}
      ${detail.placement?`<label class="field">${detail.kind==='ties'?'Tie placement':'Exit placement'}<select data-fastener-field="placement" data-highlight-component="designClosure">${Object.entries(garmentFasteners.placements).map(([key,label])=>option(key,label,detail.placement)).join('')}</select></label>`:''}
      <label class="field">${{buttons:'Button',ties:'Tie',drawstring:'Drawstring'}[detail.kind]} color<input type="color" data-fastener-field="color" data-highlight-component="designClosure" value="${escape(detail.color)}"></label></div>
      ${detail.kind==='buttons'&&detail.count>1?'<p class="muted">Check that the last button lands on the finished placket.</p>':''}
      </div></details>`;
    studioUnits.refresh(host);
  }
  function drawLayers() {
    const model=designDraft.model;
    const kinds=studioDesign.layerKindChoices(model);
    const reference=studioDesign.layerStartsAt(model);
    layerPanel.hidden=!kinds.length;
    layerPanel.querySelector('#design-layer-hint').textContent=model==='trousers'
      ?'Layers wrap both legs. Hem offsets are relative to the main leg openings.'
      :'Hem offsets are relative to the main hem. Outer layers stack in list order.';
    const layers=studioDesign.layers(designDraft);
    const attachmentLimits=studioDesign.layerAttachmentLimits(model);
    const field=(layer,key,label,unit='cm')=>slider(label,
      `data-layer-field="${key}"${layerComponents[key]?` data-component-slider="${layerComponents[key]}"`:''}`,
      studioDesign.layerLimits[key],layer[key],{unit,step:unit==='%'?1:.5,signed:key==='hemOffset'});
    const openLayers=new Map([...layerList.querySelectorAll('.layer-card')].map(card=>[Number(card.dataset.layerIndex),
      [...card.querySelectorAll('details[open]')].map(section=>section.dataset.layerSection || 'uneven').concat(card.open?'card':[])]));
    layerList.innerHTML=layers.map((layer,index)=>{
      const open=openLayers.get(index)||[];
      return `<details class="design-options layer-card" data-layer-index="${index}"${open.includes('card')?' open':''}>
      <summary>Layer ${index+1} · ${layer.kind}</summary><div class="slider-group-content">
      <label class="field">Layer type<select data-layer-field="kind">${kinds.map(kind=>option(kind,kind,layer.kind)).join('')}</select></label>
      <details class="design-options" data-layer-section="fabric"${open.includes('fabric')?' open':''}><summary>Fabric and color</summary><div class="fields tight">
        <label class="field">Fabric<select data-layer-field="fabric">${fabricOptions(layer.fabric)}</select></label>
        <label class="field">Color<input type="color" data-layer-field="color" value="${color(layer.color)}"></label>
        ${field(layer,'opacity','Opacity','%')}
      </div></details>
      <details class="design-options" data-layer-section="fit"${open.includes('fit')?' open':''}><summary>Attachment and fullness</summary>
        <div class="slider-group-content">
          ${slider('Attachment height','data-layer-field="attachment" data-component-slider="layerAttachment"',attachmentLimits,layer.attachment,
            {unit:'attachment',step:1,reference,ends:[attachmentLimits[0]===0?reference:'Higher','Lower']})}
          <p>Measure from the ${reference.toLowerCase()} to the base hem to convert the percentage to a length.</p>
          ${field(layer,'sweep','Extra hem sweep')}
        </div></details>
      <details class="design-options" data-layer-section="hem"${open.includes('hem')?' open':''}><summary>Hem and points</summary><div class="slider-group-content">
        ${layer.kind==='Ruffle'?field(layer,'depth','Ruffle depth'):field(layer,'hemOffset','Hem offset')}
        ${hemOptions(layer,true)}
      </div></details>
      <details class="design-options" data-layer-section="sides"${open.includes('sides')?' open':''}><summary>Left and right layer shape</summary>
        <p class="muted tight">Adjust each side relative to the layer’s shared fullness or attachment.</p><div class="fields tight">
          ${Object.entries(layeredSideFields).map(([key,label])=>slider(label,`data-layer-field="${key}" data-highlight-component="${key.endsWith('Attachment')?'layerAttachment':'layerSweep'}"`,
            studioDesign.layerLimits[key],layer[key]??0,{signed:true,unit:key.endsWith('Attachment')?'percentage points':'cm',step:key.endsWith('Attachment')?1:.5})).join('')}
      </div></details>
      ${laceGroup('layer','Lace trim',layer.laceTrim,open.includes('lace'))}
      <div class="actions tight">
        <button type="button" class="secondary" data-layer-edit>Edit on garment</button>
        ${index?`<button type="button" class="secondary" data-layer-move="-1" aria-label="Move layer ${index+1} up">Move up</button>`:''}
        ${index<layers.length-1?`<button type="button" class="secondary" data-layer-move="1" aria-label="Move layer ${index+1} down">Move down</button>`:''}
        <button type="button" class="secondary" data-layer-remove aria-label="Remove layer ${index+1}">Remove</button>
      </div>
    </div></details>`;}).join('');
    for (const [index,open] of openLayers) if (open.includes('uneven')) {
      const details=layerList.querySelector(`[data-layer-index="${index}"] [data-hem-asymmetry]`);
      if (details) details.open=true;
    }
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
        ${straplessControls(model,support,studioDesign.selectedStraplessSupport(designDraft))}
        <label class="field" data-one-shoulder-side${support==='One-shoulder'?'':' hidden'}>One-shoulder strap side<select name="shoulderSide">${['left','right'].map(side=>option(side,`Wearer’s ${side}`,studioDesign.selectedShoulderSide(designDraft))).join('')}</select></label>
        <div data-design-strap-sizing${strapless?' hidden':''}><div class="fields">
          <label class="field">Finished strap / shoulder width (cm)<input name="strapWidth" type="number" data-length-input min=".4" max="12" step=".1" value="${designDraft.strapWidth??studioDesign.supportWidth(support)??''}"${strapless?' disabled':''}></label>
          <label class="field">Shoulder placement (cm)<input name="strapPlacement" type="number" data-length-input min="-4" max="4" step=".1" value="${designDraft.strapPlacement??0}"${strapless?' disabled':''}></label>
        </div><p class="muted">Negative placement moves toward the neck. Positive placement moves toward the arm.</p></div>
        ${strapShapeControls(support,designDraft)}`:''}
      ${['dress','skirt'].includes(model)?'<details class="design-options" id="design-main-hem"><summary>Main hem and points</summary><div id="design-main-hem-fields" class="slider-group-content"></div></details>':''}
      <div class="fields">${select('closure','Closure',studioDesign.closureChoices(model))}${model==='trousers'?select('rise','Waist rise',studioDesign.rises):''}</div>
      <p class="muted tight" data-seam-closure-note hidden>The zipper in Seam placement is the closure for this design.</p>
      <div id="design-fastener-fields"></div>
      <label class="field">Main color<input type="color" name="primary" value="${color(designDraft.primary)}"></label>
      ${fitFabricFields(designDraft.fabric,designDraft.fabricSettings)}
      <details class="design-options"${open?' open':''}><summary>Finishes, pockets and fit</summary>
        <div class="fields tight">${select('pocket','Pockets',studioDesign.pocketChoices(model))}${select('finish','Hem finish',studioDesign.finishes)}${select('tone','Color layout',studioDesign.tones)}
        <label class="field">Contrast color<input type="color" name="accent" value="${color(designDraft.accent)}"></label>
        <label class="field">Target wearing ease (cm)<input type="number" data-length-input name="ease" min="0" max="24" step="1" value="${Number(designDraft.ease)}" required></label></div>
        <label class="field">Custom detail notes<textarea name="details" rows="3" maxlength="2000" placeholder="e.g. Contrast stitching, back tie placement or special hardware">${escape(designDraft.details || '')}</textarea></label>
      </details>`;
    studioUnits.refresh(settings);
    drawFastenerFields();
    refreshDesignStraps();
    drawFitSliders();
    drawSeams();
    drawLayers();
    drawLace();
    drawStitchDetails();
    drawMainHem();
    drawAsymmetry();
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
    const anchors=drawModel(canvas,draftPattern(),Number(angle.value)*Math.PI/180,adjustments(),body(),false,
      {pose:fitAnalysis.pose(),show:fitAnalysis.show(),material:material(),fabricName:designDraft.fabric,redraw:preview,pitch:Number(tiltControl.value)*Math.PI/180,
        editor:{layerIndex:componentKeys.some(key=>key.startsWith('layer'))?layerTarget:null,showSeams:mode.value==='seams'||mode.value==='sides',zoom:Number(zoom.value)/100,
          componentKeys,guidedComponents,componentSide:mode.value==='sides'?asymmetrySide.value:null,selectedComponent,hoveredComponent}});
    panelSnapOffset=anchors.panelSeamSnapOffset;
    layerAttachmentDragSpan=anchors.layerAttachmentDragSpan;
    layerAttachmentDragSpans=anchors.layerAttachmentDragSpans||{};
    if (syncZipperLimit(anchors.panelZipperMaxLength)) {
      updateGuide();
      preview();
      return;
    }
    picker.targets(anchors.componentHits);
    layerMapNote.hidden=!fitAnalysis.show()||!studioDesign.layers(designDraft).length;
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
      if (support==='Strapless') changes.straplessSupport=studioDesign.selectedStraplessSupport(design);
      if (studioDesign.supportsStrapShape(support)) Object.assign(changes,studioDesign.strapShape(design));
    }
    return fitMeasurementSheet(model,changes,{},true,item,model);
  }
  function changeModel(model) {
    form.elements.namedItem('model').value = model;
    const {name,reference,photoOutline,fitModelId,primary,accent,details,layers,seams,laceTrims,stitchDetails,asymmetry,shoulderSide,straplessSupport}=designDraft;
    designDraft = {...studioDesign.defaults(model),...studioDesign.hemContour(designDraft),...studioDesign.strapShape(designDraft),
      name,reference,photoOutline,fitModelId,primary,accent,details,layers,seams,laceTrims,stitchDetails,asymmetry,shoulderSide,straplessSupport};
    panelZipperMaxLength=undefined;
    editor.reset();
    settingsForModel();
  }
  settingsForModel();
  refreshReference();
  showMeasurements();
  const size = new ResizeObserver(preview);
  size.observe(canvas);
  fitCleanup = () => {size.disconnect();picker.cleanup();editor.cleanup();fitAnalysis.cleanup();stopCamera();};
  document.querySelector('#design-open-fit').onclick=()=>{
    showDesignPanel('fit');
    fitPanel.open=true;
    fitPanel.querySelector('summary').focus({preventScroll:true});
    fitPanel.scrollIntoView({block:'start'});
  };
  bindFitEase('design',fitAnalysis,poses=>{
    const draft=Object.fromEntries(fitKeys().map(key=>[key,designDraft.fitAdjustments?.[key]||0]));
    const next=garmentFit.suggestEase(draftPattern(),modelType(),body(),draft,adjustments(),material(),poses);
    const changed=Object.keys(next).filter(key=>next[key]!==draft[key]);
    if (changed.length) {
      editor.checkpoint();
      designDraft.fitAdjustments={...designDraft.fitAdjustments,...next};
      drawFitSliders();
      refreshEditor();
      showMeasurements();
      refreshFitPreview();
      updateGuide();
    }
    return changed;
  });
  angle.addEventListener('input',preview);
  tiltControl.addEventListener('input',preview);
  zoom.addEventListener('input',preview);
  document.querySelector('#design-front-view').onclick=()=>{angle.value=0;tiltControl.value=0;preview();};
  function rotatePreview(change) {
    angle.value=wrapAngle(Number(angle.value)+change);
    preview();
  }
  canvas.addEventListener('keydown',event=>{
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    if (event.key==='ArrowUp' || event.key==='ArrowDown') {
      tiltControl.value=Number(tiltControl.value)+(event.key==='ArrowUp'?10:-10);
      preview();
    } else rotatePreview(event.key==='ArrowLeft'?-10:10);
  });
  function activateEditor(value) {
    mode.value=value;
    if (value!=='view') angle.value=value==='fit'&&fitTarget==='back'?180:value==='seams'?(studioDesign.seams(designDraft).panelAngle??0):0;
    refreshEditor();
    const panel={seams:'seams',layers:'layers',sides:'fit'}[mode.value];
    if (panel) openDesignPanel(panel);
    preview();
  }
  mode.addEventListener('change',()=>activateEditor(mode.value));
  target.addEventListener('change',()=>{
    if (mode.value==='fit') {
      fitTarget=target.value;
      angle.value=fitTarget==='back'?180:0;
    } else if (mode.value==='sides') {
      asymmetrySide.value=target.value;
      drawAsymmetry();
    } else layerTarget=Number(target.value);
    refreshEditor();
    preview();
  });
  asymmetrySide.addEventListener('change',()=>{
    mode.value='sides';
    drawAsymmetry();
    refreshEditor();
    preview();
  });
  guide.addEventListener('toggle',updateGuide);
  seamSettingsButton.onclick=()=>{
    showDesignPanel('seams');
    seamPanel.open=true;
    seamPanel.querySelector('summary').focus({preventScroll:true});
    seamPanel.scrollIntoView({block:'start'});
  };
  function changePanelMode() {
    editor.checkpoint();
    togglePanelSeams();
    revealDesignControl(seamFields.querySelector('[data-seam-angle],[data-seam-value="panelSeam"]'));
    updateGuide();
  }
  mergeButton.onclick=changePanelMode;
  seamFields.addEventListener('click',event=>{
    const button=event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-seam-merge')) {
      changePanelMode();
    } else if (button.hasAttribute('data-seam-side')) {
      editor.checkpoint();
      setSingleSeamAngle(Number(button.dataset.seamSide),true);
      refreshEditor();
      preview();
      updateGuide();
    }
  });
  seamFields.addEventListener('change',event=>{
    const input=event.target;
    if (input.dataset.seamValue==='panelSeam' && input.valueAsNumber<=(panelSnapOffset??Number(input.min))) {
      togglePanelSeams();
      revealDesignControl(seamFields.querySelector('[data-seam-angle]'));
      preview();
      updateGuide();
    }
  });
  const refreshLayers=()=>{drawLayers();refreshEditor();preview();updateGuide();};
  function appendLayer(kind) {
    const current=studioDesign.layers(designDraft);
    if (current.length>=studioDesign.maxLayers) return;
    editor.checkpoint();
    designDraft.layers=[...current,{...studioDesign.newLayer(kind,designDraft.model),color:designDraft.accent}];
    layerTarget=current.length;
    mode.value='layers';
    angle.value=0;
    refreshLayers();
    showDesignPanel('layers');
    layerPanel.open=true;
    layerList.querySelector('.layer-card:last-child').open=true;
  }
  addLayer.onclick=()=>{
    appendLayer();
    layerList.querySelector('.layer-card:last-child select')?.focus();
  };
  quickLayer.onclick=()=>appendLayer();
  addRuffle.onclick=()=>appendLayer('Ruffle');
  const refreshStitchDetails=()=>{drawStitchDetails();refreshEditor();preview();updateGuide();};
  addStitch.onclick=()=>{
    const current=stitchSources();
    if (current.length>=studioDesign.maxStitchDetails) return;
    editor.checkpoint();
    designDraft.stitchDetails=[...current,studioDesign.newStitchDetail()];
    refreshStitchDetails();
    const card=stitchFields.querySelector(`[data-stitch-source="${current.length}"]`);
    card.open=true;
    card.querySelector('[data-stitch-field=style]').focus();
  };
  stitchFields.addEventListener('click',event=>{
    const remove=event.target.closest('[data-remove-stitch-detail]');
    if (!remove) return;
    const card=remove.closest('[data-stitch-source]');
    editor.checkpoint();
    designDraft.stitchDetails=stitchSources().filter((_,index)=>index!==Number(card.dataset.stitchSource));
    refreshStitchDetails();
    const remaining=stitchFields.querySelectorAll('[data-stitch-index]');
    const follow=card.hasAttribute('data-stitch-index')?remaining[Math.min(Number(card.dataset.stitchIndex),remaining.length-1)]:
      stitchFields.querySelector('[data-inactive-stitch-details]');
    (follow?.querySelector('summary')||addStitch).focus();
  });
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
    const follow=layerList.querySelectorAll('.layer-card')[Math.min(index+move,current.length-1)];
    (follow?.querySelector('summary')||addLayer).focus();
  });
  form.querySelector('#reset-design-fit').onclick=()=>{
    editor.checkpoint();
    designDraft.fitAdjustments={};
    drawFitSliders();
    refreshEditor();
    showMeasurements();
    refreshFitPreview();
    updateGuide();
  };
  form.addEventListener('input',event=>{
    const field = event.target;
    if (field.dataset.fastenerField) {
      const key=field.dataset.fastenerField;
      const previous=garmentFasteners.settings(designDraft);
      if (!previous) return;
      rememberInput(field);
      const changed={...previous,[key]:field.type==='range'?field.valueAsNumber:field.value};
      designDraft.fastener=garmentFasteners.settings({...designDraft,fastener:changed});
      for (const input of settings.querySelectorAll('[data-fastener-field][type=range]')) {
        writeSlider(input,designDraft.fastener[input.dataset.fastenerField]);
      }
      selectedComponent='designClosure';
      refreshEditor();
      preview();
      updateGuide();
      return;
    }
    if (field.name==='productionSize') return;
    const stitchKey=field.dataset.stitchField;
    if (stitchKey) {
      rememberInput(field);
      const card=field.closest('[data-stitch-index]');
      const index=Number(card.dataset.stitchSource);
      const current=designDraft.stitchDetails[index];
      const value=field.type==='range'?field.valueAsNumber:field.value;
      const entry=stitchKey==='style'?{...studioDesign.newStitchDetail(value,current.placement),depth:current.depth}:{...current,[stitchKey]:value};
      const next=studioDesign.stitchDetail(entry,designDraft);
      designDraft.stitchDetails=designDraft.stitchDetails.map((detail,i)=>i===index?next:detail);
      if (field.type==='range') {
        writeSlider(field,next[stitchKey]);
        preview();
        updateGuide();
      } else {
        activeInput=null;
        refreshStitchDetails();
        stitchFields.querySelector(`[data-stitch-source="${index}"] [data-stitch-field="${stitchKey}"]`)?.focus({preventScroll:true});
      }
      return;
    }
    if (field.matches('[data-lace-enable],[data-lace-field]')) {
      rememberInput(field);
      const group=field.closest('[data-lace-placement]');
      const placement=group.dataset.lacePlacement;
      const enabled=group.querySelector('[data-lace-enable]').checked;
      const width=group.querySelector('[data-lace-field=width]');
      group.querySelector('fieldset').disabled=!enabled;
      const trim=enabled?studioDesign.laceTrim({style:group.querySelector('[data-lace-field=style]').value,
        color:group.querySelector('[data-lace-field=color]').value,width:width.valueAsNumber}):null;
      if (field===width) writeSlider(width,width.valueAsNumber);
      if (placement==='layer') {
        changeLayerValue(Number(group.closest('[data-layer-index]').dataset.layerIndex),'laceTrim',trim);
      } else {
        const trims={...designDraft.laceTrims};
        if (trim) trims[placement]=trim;
        else delete trims[placement];
        designDraft.laceTrims=trims;
      }
      refreshEditor();
      preview();
      updateGuide();
      return;
    }
    if (field.matches('[data-strap-shape-field],[data-strap-preset]')) {
      rememberInput(field);
      Object.assign(designDraft,updateStrapShape(form,field));
      refreshFitPreview();
      updateGuide();
      return;
    }
    const asymmetric=field.dataset.asymmetryField;
    const mainHem=field.dataset.mainHem;
    if (asymmetric || mainHem) {
      rememberInput(field);
      const value=field.type==='range'?field.valueAsNumber:field.value;
      if (asymmetric) {
        const side=asymmetrySide.value;
        const adjustments=studioDesign.asymmetry(designDraft);
        adjustments[side][asymmetric]=value;
        designDraft.asymmetry=adjustments;
      } else {
        designDraft[mainHem]=value;
        if (mainHem==='hemStyle') field.closest('#design-main-hem-fields').querySelector('[data-fairy-sliders]').hidden=!studioDesign.hasFairyHem(designDraft);
      }
      if (field.type==='range') writeSlider(field,value);
      refreshEditor();
      refreshFitPreview();
      updateGuide();
      return;
    }
    if (field.matches('[data-seam-angle],[data-seam-zipper],[data-seam-zipper-length],[data-seam-zipper-kind]')) {
      rememberInput(field);
      if (field.hasAttribute('data-seam-angle')) setSingleSeamAngle(field.valueAsNumber);
      if (field.hasAttribute('data-seam-zipper')) {
        const seams=studioDesign.seams(designDraft);
        if (field.checked) setZipperLength(studioDesign.panelZipperDefault);
        else {
          delete seams.panelZipper;
          designDraft.seams=seams;
        }
        const input=seamFields.querySelector('[data-seam-zipper-length]');
        input.disabled=!field.checked;
        if (field.checked) writeSlider(input,designDraft.seams.panelZipper);
        syncSeamClosure();
      }
      if (field.hasAttribute('data-seam-zipper-length')) {
        setZipperLength(field.valueAsNumber);
        writeSlider(field,designDraft.seams.panelZipper);
      }
      if (field.hasAttribute('data-seam-zipper-kind')) {
        designDraft.seams={...studioDesign.seams(designDraft),panelZipperKind:field.value};
        syncSeamClosure();
      }
      refreshEditor();
      preview();
      updateGuide();
      return;
    }
    const seamKey=field.dataset.seamEnable || field.dataset.seamValue;
    if (seamKey) {
      rememberInput(field);
      const seams=studioDesign.seams(designDraft);
      if (field.dataset.seamEnable) {
        const input=seamFields.querySelector(`[data-seam-value="${seamKey}"]`);
        if (field.checked) seams[seamKey]=input.valueAsNumber;
        else {
          delete seams[seamKey];
          writeSlider(input,0);
        }
      } else {
        seams[seamKey]=field.valueAsNumber;
        seamFields.querySelector(`[data-seam-enable="${seamKey}"]`).checked=true;
        writeSlider(field,seams[seamKey]);
      }
      designDraft.seams=studioDesign.seams({...designDraft,seams});
      if (field.dataset.seamEnable || (seamKey==='panelSeam'&&!asymmetryFields.querySelector('[data-asymmetry-field=panelSeam]'))) drawAsymmetry();
      refreshEditor();
      preview();
      updateGuide();
      return;
    }
    const layerKey=field.dataset.layerField;
    if (layerKey) {
      const index=Number(field.closest('[data-layer-index]').dataset.layerIndex);
      const value=field.type==='range'?field.valueAsNumber:field.value;
      rememberInput(field);
      changeLayerValue(index,layerKey,value);
      if (field.type==='range') writeSlider(field,value);
      if (layerKey==='kind') {
        drawLayers();
        layerList.querySelector(`[data-layer-index="${index}"] select`)?.focus();
      } else if (layerKey==='hemStyle') {
        field.closest('[data-layer-section=hem]').querySelector('[data-fairy-sliders]').hidden=value!==studioDesign.hemStyles[1];
      }
      refreshEditor();
      preview();
      updateGuide();
      return;
    }
    if (!field.name || field.type==='file') return;
    const oldSupport=studioDesign.selectedSupport(designDraft);
    if (field.name==='model') changeModel(field.value);
    else if (field.name==='fabric') {
      designDraft.fabric=field.value;
      setFitFabric(form);
      designDraft.fabricSettings=fabricSettings();
    } else if (['fabricWeight','fabricCross','fabricLength','fabricBend'].includes(field.name)) {
      designDraft.fabricSettings=fabricSettings();
    }
    else if (field.hasAttribute('data-fit-slider')) {
      const value=Number(field.value);
      rememberInput(field);
      designDraft.fitAdjustments={...designDraft.fitAdjustments,[field.name]:value};
      const output=fitSliders.querySelector(`#${field.name}-value`);
      output.textContent=adjustmentText(value);
      studioUnits.refresh(output);
    } else if (field.name==='strapWidth' || field.name==='strapPlacement') {
      const value=studioUnits.lengthValue(field);
      const [min,max]=field.name==='strapWidth'?[.4,12]:[-4,4];
      designDraft[field.name]=value==null?undefined:fabricFit.clamp(value,min,max);
    }
    else {
      if (['shoulderSide','straplessSupport','closure'].includes(field.name)) rememberInput(field);
      designDraft[field.name]=field.name==='ease'?(studioUnits.lengthValue(field)??0):field.type==='number'?Number(field.value):field.value;
    }
    if (field.name==='closure') {
      designDraft.fastener=garmentFasteners.settings(designDraft);
      drawFastenerFields(true);
    }
    if (field.name==='support' || field.name==='sleeve') editedSupport=true;
    if (field.name==='support' && field.value!=='Integrated shoulders' && form.elements.sleeve) {
      form.elements.sleeve.value=designDraft.sleeve='Sleeveless';
    }
    if (field.name==='sleeve' && field.value!=='Sleeveless') {
      form.elements.support.value=designDraft.support='Integrated shoulders';
    }
    if (field.name==='support' || field.name==='sleeve') refreshDesignStraps(oldSupport!==studioDesign.selectedSupport(designDraft));
    if (['support','sleeve','neckline'].includes(field.name)) {
      drawFitSliders();
      drawAsymmetry();
      drawStitchDetails();
    }
    if (['support','sleeve','pocket'].includes(field.name)) {
      drawLace();
    }
    refreshEditor();
    showMeasurements();
    refreshFitPreview();
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
    refreshFitPreview();
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
    const design={...draft,fabricSettings:fabricSettings(),layers:studioDesign.layers(designDraft),
      seams:studioDesign.seams(designDraft),fitAdjustments:activeDesignFit()};
    const item = {id:'design-'+createId(),...applyDesignFit(studioDesign.make(design,name,body()),body()),reference,
      fitReference:snapshotModelMeasurements(body())};
    item.measurements=designMeasurementSheet(item);
    state.custom.push(item);
    showArchivedPatterns=false;
    if (event.submitter?.value==='order') state.orders.unshift(withProductionSize({
      id:'WO-'+String(state.next++).padStart(3,'0'),title:name,kind:'Construction',pattern:item.id,due:'',notes:['Fitted to '+body().name+'.',reference?'Check the design details against the reference photo.':'',design.details].filter(Boolean).join('\n'),done:[]
    },item,form.elements.namedItem('productionSize').value));
    if (event.submitter?.value==='order') showNewOrders();
    save(event.submitter?.value==='order'?'Garment and work order saved':'Garment saved to Pattern Library');
    designDraft = {...studioDesign.defaults(),name:'',reference:'',fitModelId:design.fitModelId};
    location.hash=event.submitter?.value==='order'?'orders':'library';
  });
  refreshFitPreview();
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
  const section=page==='design'||page==='fitting'?'library':page;
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
    case 'close-garment-preview': previewDialog.close();break;
    case 'preview-garment': {
      const order=state.orders.find(item=>item.id===button.dataset.orderId);
      const frame=button.dataset.previewFrame;
      const pattern=order?orderPreviewPattern(order,frame):getPattern(id);
      showGarmentPreview(pattern,{size:frame==='after'?order?.size:undefined,modelId:order?.plan?.modelId});
      break;
    }
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
      const design=source.fit?.changes?designForFit(source.design,source.fit.changes):source.design;
      const {fabricName,material}=patternPreviewFabric(source);
      designDraft = {...studioDesign.defaults(design.model),...design,fitModelId:source.fit?.modelId || design.fitModelId || 'studio-form',name:source.name+' variation',reference:source.reference || ''};
      if (fabricName) {
        const {gsm,cross,length,bend}=material;
        designDraft.fabric=fabricName;
        designDraft.fabricSettings={gsm,cross,length,bend};
      }
      modal.close();
      location.hash='design';
      break;
    }
      }
});
window.addEventListener('hashchange',()=>{
  if (previewDialog.open) previewDialog.close();
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
