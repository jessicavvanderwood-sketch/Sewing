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

const initial = {
  brand:{name:'Jessica’s Sewing',tagline:'Made with care, fitted with intention.',primary:'#752c40',accent:'#c49399',neutral:'#f2e5dd',notes:'',logo:''},
  orders:[
    {id:'WO-001',title:'Studio dress sample',pattern:'dress',due:'',notes:'Use the first toile to check waist placement.',done:[0,1]},
    {id:'WO-002',title:'Linen shell prototype',pattern:'top',due:'',notes:'',done:[]}
  ],
  next:3,
  custom:[],
  models:[]
};

const storageKey = 'jessicas-sewing-v1';
let state = structuredClone(initial);
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved) state = {...state, ...saved, brand:{...initial.brand,...saved.brand}};
} catch {}
const view = document.querySelector('#view');
const modal = document.querySelector('#modal');
const notice = document.querySelector('#notice');
const titles = {overview:'Overview',brand:'Brand Kit',library:'Pattern Library',orders:'Work Orders',fitting:'3D Fitting Room',models:'Model Library',basics:'Sewing Basics'};
const features = [['brand','◈','Define your palette, logo and brand voice.'],['library','▤','Browse garment styles, cuts and construction guides.'],['fitting','◇','Preview fit changes and plan your alterations.']];
const escape = (value = '') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const allPatterns = () => [...patterns, ...state.custom];
const getPattern = id => allPatterns().find(pattern => pattern.id === id);
const getOrderPattern = order => order.snapshot || getPattern(order.pattern);
const allModels = () => [...sewingModels.defaults,...state.models];
const getModel = id => allModels().find(model => model.id === id) || allModels()[0];
const basePattern = pattern => patterns.find(base => base.id === (pattern.model || pattern.id)) || patterns[0];
const hasSleeves = pattern => pattern.fit?.changes.hasSleeves ?? Boolean(pattern.sleeves);
const option = (value,name,selected) => `<option value="${escape(value)}"${value===selected?' selected':''}>${escape(name)}</option>`;
const options = selected => allPatterns().map(p => option(p.id,p.name+(p.revision?' · Revision '+p.revision:''),selected)).join('');
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
  const complete = state.orders.filter(o => o.done.length === getOrderPattern(o).steps.length).length;
  const stats = [['▤',new Set(allPatterns().map(p=>p.family||p.id)).size,'Library styles'],['▣',state.orders.length-complete,'Open work orders'],['✓',complete,'Completed orders']];
  view.innerHTML = `<section class="hero"><div><div class="eyebrow">THE SEWING STUDIO</div><h1>Jessica’s Sewing<br>Dashboard</h1><p>Manage your patterns, plan the next make, and refine the fit in one workspace.</p><a class="button" href="#library">Browse patterns</a></div></section>
    <div class="stats">${stats.map(([icon,count,label])=>`<div class="stat"><span class="icon" aria-hidden="true">${icon}</span><div><b>${count}</b><span>${label}</span></div></div>`).join('')}</div>
    <section><div class="section-head"><h2>Studio tools</h2></div><div class="features">${features.map(([key,icon,description])=>`<a class="card feature" href="#${key}"><span class="icon" aria-hidden="true">${icon}</span><h3>${titles[key]}</h3><p>${description}</p></a>`).join('')}</div></section>
    <section class="section"><div class="section-head"><h2>Recent work orders</h2><a href="#orders">View all</a></div>${orderTable(state.orders.slice(0,4))}</section>`;
}
function brand() {
  const b = state.brand;
  view.innerHTML = heading('Brand Kit','Keep your logo, colors and brand guidelines together.') + `<div class="split"><form id="brand-form" class="panel">
    <label class="field">Brand name<input required maxlength="80" name="name" value="${escape(b.name)}"></label>
    <label class="field">Tagline<input maxlength="140" name="tagline" value="${escape(b.tagline)}"></label>
    <div class="fields">${[['primary','Primary'],['accent','Accent'],['neutral','Neutral']].map(([key,label])=>`<label class="field">${label}<input type="color" name="${key}" value="${color(b[key])}"></label>`).join('')}</div>
    <label class="field">Logo (PNG, JPEG or WebP, up to 1 MB)<input type="file" name="logo" accept="image/png,image/jpeg,image/webp"></label>
    ${b.logo ? '<label class="field"><span><input style="min-height:auto;width:auto" type="checkbox" name="removeLogo"> Remove saved logo</span></label>' : ''}
    <label class="field">Brand guidelines<textarea name="notes" rows="4" maxlength="5000">${escape(b.notes)}</textarea></label><button>Save brand kit</button></form><div class="panel brand-preview" id="brand-preview"></div></div>`;
  const form = document.querySelector('#brand-form');
  const preview = document.querySelector('#brand-preview');
  function update() {
    const data = new FormData(form);
    const logo = !data.has('removeLogo') && /^data:image\/(png|jpeg|webp);base64,[\da-z+/=]+$/i.test(b.logo) ? b.logo : '';
    preview.style.background = color(data.get('neutral'));
    preview.innerHTML = `<div>${logo ? `<img src="${logo}" alt="Brand logo">` : ''}<h2 style="color:${color(data.get('primary'))}">${escape(data.get('name'))}</h2><p>${escape(data.get('tagline'))}</p><div class="swatches">${['primary','accent','neutral'].map(key=>`<span title="${color(data.get(key))}" style="background:${color(data.get(key))}"></span>`).join('')}</div></div>`;
  }
  update();
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
function library() {
  view.innerHTML = heading('Pattern Library','Browse garment cuts and construction guides, or add a style from your own pattern collection.') + `<div class="toolbar"><label class="field">Search patterns<input id="pattern-search" type="search" placeholder="Search by style or cut"></label><label class="field">Garment type<select id="pattern-filter"><option value="">All garments</option>${[...new Set(patterns.map(p=>p.type))].map(type=>option(type,type)).join('')}</select></label><button data-action="add-pattern">＋ Add style</button></div><div class="patterns" id="patterns"></div>`;
  const search = document.querySelector('#pattern-search');
  const filter = document.querySelector('#pattern-filter');
  const container = document.querySelector('#patterns');
  function results() {
    const query = search.value.trim().toLowerCase();
    const latest = new Map();
    for (const p of allPatterns()) latest.set(p.family || p.id,p);
    const matches = [...latest.values()].filter(p => (!filter.value || p.type===filter.value) && [p.name,p.type,p.cut].join(' ').toLowerCase().includes(query));
    container.innerHTML = matches.length ? matches.map(p=>`<article class="card pattern"><div class="pattern-art"><canvas width="360" height="155" data-pattern="${escape(p.id)}" role="img" aria-label="${escape(p.cut)} illustration"></canvas></div><div class="pattern-body"><span class="badge">${escape(p.type)}</span><h3 class="tight">${escape(p.name)}</h3><p>${escape(p.cut)} · ${p.revision?'Revision '+p.revision:escape(p.level)}</p><button class="secondary" data-action="pattern" data-id="${escape(p.id)}">View ${p.fit?'tailoring guide':'construction guide'}</button> <button class="secondary" data-action="fit" data-id="${escape(p.id)}">${p.fit?'Revise fit':'Alter garment'}</button></div></article>`).join('') : '<p>No styles match your search.</p>';
    for (const canvas of container.querySelectorAll('canvas')) drawModel(canvas,getPattern(canvas.dataset.pattern),-.35,getPattern(canvas.dataset.pattern).fit?.changes || {hasSleeves:hasSleeves(getPattern(canvas.dataset.pattern))}, {},true);
  }
  search.addEventListener('input',results);
  filter.addEventListener('change',results);
  results();
}
function orders() {
  view.innerHTML = heading('Work Orders','Create a work order and check off the construction steps as you sew.') + orderTable(state.orders);
}
function showDialog(title, body) {
  modal.innerHTML = `<div class="dialog-head"><h2>${escape(title)}</h2><button class="secondary close" type="button" data-action="close" aria-label="Close dialog">×</button></div>${body}`;
  if (!modal.open) modal.showModal();
}
function patternDetails(pattern) {
  const revisions = pattern.family ? allPatterns().filter(p=>p.family===pattern.family).sort((a,b)=>b.revision-a.revision) : [];
  const revisionPicker = revisions.length ? `<label class="field">Revision<select id="revision-picker">${revisions.map(p=>option(p.id,'Revision '+p.revision,p.id===pattern.id?p.id:null)).join('')}</select></label>` : '';
  showDialog(pattern.name,`${revisionPicker}<p>${escape(pattern.cut)} · ${escape(pattern.level)}</p><p class="tight"><strong>Suggested fabric</strong> ${escape(pattern.fabric)}</p><p class="tight"><strong>Tools and notions</strong> ${escape(pattern.tools)}</p>${sewingVisuals.tools(pattern.tools)}${sewingVisuals.steps(pattern.steps, pattern.visuals || sewingVisuals.patterns[pattern.id])}<div class="actions"><button data-action="new" data-id="${escape(pattern.id)}">${pattern.revision?'Make this revision again':'Create work order'}</button><button class="secondary" data-action="fit" data-id="${escape(pattern.id)}">${pattern.revision?'Revise this fit':'Open fitting room'}</button></div>`);
  modal.querySelector('#revision-picker')?.addEventListener('change',event=>patternDetails(getPattern(event.target.value)));
}
function addPattern() {
  showDialog('Add a style',`<form id="pattern-form"><label class="field">Style name<input required maxlength="100" name="name"></label><div class="fields"><label class="field">Garment type<select name="model">${patterns.map(p=>option(p.id,p.id==='shirt'?'Shirt with sleeves':p.id==='top'?'Sleeveless top':p.type)).join('')}</select></label><label class="field">Clothing cut<input required maxlength="100" name="cut"></label></div><label class="field">Skill level<select name="level"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label><label class="field">Fabric and quantity<input required maxlength="200" name="fabric"></label><label class="field">Tools and notions<textarea required maxlength="2000" name="tools" rows="2"></textarea></label><label class="field">Construction steps (one per line)<textarea required maxlength="10000" name="steps" rows="6"></textarea></label><button>Save style</button></form>`);
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
  showDialog(existing ? 'Edit work order' : 'New work order', `<form id="order-form"><label class="field">Work order name<input name="title" required maxlength="120" value="${escape(existing?.title || (getPattern(id)?.revision?getPattern(id).name+' · Revision '+getPattern(id).revision:''))}"></label><label class="field">Pattern<select name="pattern" ${(existing?.done.length || existing?.snapshot || getPattern(id)?.revision) ? 'disabled' : ''}>${options(existing?.pattern || id)}</select></label><label class="field">Due date<input type="date" name="due" value="${escape(existing?.due || '')}"></label><label class="field">Fabric, sizing or fitting notes<textarea name="notes" rows="4" maxlength="7000">${escape(existing?.notes || '')}</textarea></label><button>Save work order</button></form>`);
  const form = document.querySelector('#order-form');
  form.addEventListener('submit',event => {
    event.preventDefault();
    const data = new FormData(form);
    const title = data.get('title').trim();
    if (!title) { notify('Enter a work order name.'); return; }
    const details = {title,pattern:data.get('pattern') || existing?.pattern || id,due:data.get('due'),notes:data.get('notes')};
    const order = existing || {id:'WO-'+String(state.next++).padStart(3,'0'),done:[]};
    Object.assign(order,details);
    if (!existing) {
      const selected = getPattern(order.pattern);
      if (selected?.rebuildSteps) order.snapshot = {name:selected.name,steps:selected.rebuildSteps,visuals:selected.rebuildVisuals,fabric:selected.buildFabric,tools:selected.buildTools};
      state.orders.unshift(order);
    }
    save('Work order saved');
    modal.close();
    if (location.hash === '#orders') orders();
    else location.hash = 'orders';
  });
}
function orderDetails(order) {
  const pattern = getOrderPattern(order);
  showDialog(order.title,`<p>${order.id} · ${escape(pattern.name)}</p>${order.notes ? `<p class="tight" style="white-space:pre-wrap">${escape(order.notes)}</p>` : ''}<p class="tight"><strong>Fabric</strong> ${escape(pattern.fabric)}</p><p class="tight"><strong>Tools and notions</strong> ${escape(pattern.tools)}</p>${sewingVisuals.tools(pattern.tools)}<h3 class="tight">Step checklist</h3><p id="order-progress" aria-live="polite">${order.done.length} of ${pattern.steps.length} steps completed</p><ol class="check-list">${pattern.steps.map((step,index)=>`<li><label><input type="checkbox" value="${index}" ${order.done.includes(index)?'checked':''}><span><strong>${index+1}.</strong> ${escape(step)}</span></label>${sewingVisuals.diagram((pattern.visuals || sewingVisuals.patterns[pattern.id])?.[index] || sewingVisuals.identify(step))}</li>`).join('')}</ol><button class="secondary" data-action="edit-order" data-id="${order.id}">Edit work order</button>`);
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

function drawModel(canvas,pattern,angle,changes,body,thumbnail=false) {
  const context = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const scale = height * (thumbnail ? .44 : .41);
  const cx = width/2;
  const cy = height*(thumbnail ? .49 : .47);
  const faces = [];
  const model = pattern ? basePattern(pattern).id : null;
  const segments = 38;
  const spin = Math.cos(angle);
  const sine = Math.sin(angle);
  const tilt = -.105;
  const project = ([x,y,z]) => {
    const px = x*spin-z*sine;
    const pz = x*sine+z*spin;
    const py = y*Math.cos(tilt)-pz*Math.sin(tilt);
    const depth = y*Math.sin(tilt)+pz*Math.cos(tilt);
    const perspective = 3.7/(3.7-depth);
    return [cx+px*scale*perspective,cy+py*scale*perspective,depth];
  };
  function mesh(rings,hex,offset=0,neck=false,detail=false) {
    const channels = hex.match(/[0-9a-f]{2}/gi).map(c=>parseInt(c,16));
    function point(ring,index,ringIndex) {
      const [y,w,d,center=0] = ring;
      const theta = index*2*Math.PI/segments;
      const x = Math.cos(theta);
      const z = Math.sin(theta);
      const neckWidth = .56+(changes.neckWidth||0)/42;
      const neckDepth = Math.max(.015,.115+(changes.neckDepth||0)/80);
      const neckline = neck && ringIndex===0 ? Math.max(0,1-(Math.abs(x)/neckWidth)**2)*(z>0?neckDepth:.0575) : 0;
      const fold = detail ? Math.max(0,y-.1)*.016*Math.sin(theta*9) : 0;
      return project([offset+center+x*(w+fold),y+neckline,z*(d+fold)]);
    }
    for (let ring=0;ring<rings.length-1;ring++) {
      for (let i=0;i<segments;i++) {
        if (neck && !changes.hasSleeves && ring===0 && (i>=17&&i<=21 || i<2 || i>=36)) continue;
        const points = [point(rings[ring],i,ring),point(rings[ring],i+1,ring),point(rings[ring+1],i+1,ring+1),point(rings[ring+1],i,ring+1)];
        const [a,b,c] = points;
        if ((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]) >= 0) continue;
        const theta = (i+.5)*2*Math.PI/segments+angle;
        const light = .73+.24*Math.cos(theta-1.95)+.12*Math.sin(theta);
        const depth = points.reduce((sum,p)=>sum+p[2],0)/4;
        const paint = channels.map(c=>Math.max(0,Math.min(255,Math.round(c*light))));
        faces.push({points,depth,paint:'rgb('+paint.join(',')+')',seam:detail&&(i===0||i===19||ring===rings.length-2)});
      }
    }
  }
  const waistDelta = (changes.waist || 0)/450;
  const hipDelta = (changes.hip || 0)/450;
  const bodyWaist = ((body.waist || 74)-74)/450;
  const bodyHip = ((body.hip || 98)-98)/450;
  const lengthDelta = (changes.length || 0)/95;
  const modeledBust = (body.bust || 92)-92;
  const modeledShoulder = (body.shoulder || 39)-39;
  const waistWeight = y=>Math.max(0,1-Math.abs(y+.25)/.32);
  const hipWeight = y=>Math.max(0,1-Math.abs(y-.16)/.38);
  function resize(rings,waist,hip,length=0,fit={}) {
    return rings.map(([y,w,d],index)=>{
      const bustWeight = Math.max(0,1-Math.abs(y+.49)/.24);
      const shoulderWeight = Math.max(0,1-Math.abs(y+.75)/.18);
      const thighWeight = Math.max(0,1-Math.abs(y-.36)/.25);
      const legWeight = Math.max(0,1-Math.abs(y-.93)/.38);
      const widthChange = waistWeight(y)*waist+hipWeight(y)*hip+
        (bustWeight*(fit.bust||0)+thighWeight*(fit.thigh||0)+legWeight*(fit.leg||0))/450+
        shoulderWeight*(fit.shoulder||0)/220;
      const heightChange = index===0 ? 0 : length*(index/(rings.length-1))**2;
      const riseShift = Math.max(0,1-Math.abs(y+.25)/.36)*(fit.rise||0)/100;
      const armholeShift = Math.max(0,1-Math.abs(y+.64)/.1)*(fit.armhole||0)/100;
      return [y+heightChange-riseShift+armholeShift,w+widthChange,d+widthChange*.68];
    });
  }
  context.clearRect(0,0,width,height);
  context.fillStyle='#3a1e271f';
  context.beginPath();
  context.ellipse(cx,height*.91,scale*.41,scale*.065,0,0,Math.PI*2);
  context.fill();
  if (!thumbnail || !pattern) {
    mesh([[.2,.014,.014],[.89,.014,.014]],'#6d5150');
    if (body.mesh) {
      const points = body.mesh.vertices.map(project);
      for (const triangle of body.mesh.triangles) {
        const corners = triangle.map(index=>points[index]);
        const [a,b,c] = corners;
        const area = (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
        if (Math.abs(area)<.1) continue;
        const depth = (a[2]+b[2]+c[2])/3;
        const light = Math.round(Math.max(-40,Math.min(40,depth*65)));
        faces.push({points:corners,depth,paint:`rgb(${208+light},${173+light},${151+light})`});
      }
    } else mesh(resize(mannequin,bodyWaist,bodyHip,0,{bust:modeledBust,shoulder:modeledShoulder}),'#d7b69d');
  }
  if (pattern) mesh(resize(shells[model],bodyWaist+waistDelta,bodyHip+hipDelta,model==='trousers'?0:lengthDelta,{...changes,bust:modeledBust+(changes.bust||0),shoulder:modeledShoulder+(changes.shoulder||0)}),color(pattern.color),0,model==='top'||model==='dress',true);
  if (changes.hasSleeves && (model==='dress'||model==='top')) {
    const shoulder = (modeledShoulder+(changes.shoulder||0))/220;
    const sleeve = (changes.sleeveWidth||0)/410;
    const length = (changes.sleeveLength||0)/75;
    const cuff = (changes.cuff||0)/410;
    for (const side of [-1,1]) {
      const rings = [[-.71,.075+sleeve,.091, side*(.221+shoulder)],
        [-.60,.085+sleeve,.105,side*(.259+shoulder)],
        [-.46+length*.48,.068+sleeve*.6,.077,side*(.312+shoulder+length*.13)],
        [-.35+length,.057+cuff,.064+cuff*.64,side*(.344+shoulder+length*.19)]];
      mesh(rings,color(pattern.color),0,false,true);
    }
  }
  if (model==='trousers') {
    const leg = [[.19,.12,.128],[.36,.123,.132],[.57,.107,.112],[.8,.103,.108],[.93,.103,.106]];
    for (const side of [-1,1]) mesh(resize(leg,0,hipDelta,lengthDelta,changes),color(pattern.color),side*.12,false,true);
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
}

let fitPattern = 'dress';
let fitModel = 'studio-form';
let fitRevision = null;

function models() {
  view.innerHTML = heading('Model Library','Choose a dress form or add a custom 3D model before fitting a garment.')+
    `<div class="section-head"><h2>Dress forms</h2><button data-action="add-model">＋ Add custom model</button></div><div class="patterns">${allModels().map(model=>`<article class="card pattern"><div class="pattern-art"><canvas width="350" height="155" data-form="${escape(model.id)}" role="img" aria-label="${escape(model.name)} preview"></canvas></div><div class="pattern-body"><h3>${escape(model.name)}</h3><p>${model.mesh?'Imported OBJ':'Measurement-based form'} · Bust ${model.bust} cm · Waist ${model.waist} cm · Hip ${model.hip} cm</p><button data-action="choose-model" data-id="${escape(model.id)}">Fit a garment</button></div></article>`).join('')}</div>`;
  for (const canvas of view.querySelectorAll('canvas')) drawModel(canvas,null,-.34,{},getModel(canvas.dataset.form),true);
}

function addModel() {
  showDialog('Add custom model',`<form id="model-form"><label class="field">Model name<input name="name" maxlength="90" required></label><div class="fields">${Object.entries(sewingModels.dimensions).map(([key,[label,min,max]])=>`<label class="field">${label} (cm)<input type="number" name="${key}" min="${min}" max="${max}" value="${getModel('studio-form')[key]}" step="0.5" required></label>`).join('')}</div><label class="field">Optional 3D torso file (.obj)<input type="file" name="mesh" accept=".obj"></label><p class="muted">Use a low-poly torso with Y pointing up and the front facing +Z. The preview aligns it by its bounds. Enter real measurements for the tailoring guide.</p><p id="model-error" class="tight" role="alert"></p><button class="tight">Save model</button></form>`);
  const form = document.querySelector('#model-form');
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get('name').trim();
    const error = form.querySelector('#model-error');
    if (!name) { error.textContent = 'Enter a model name.'; return; }
    const file = data.get('mesh');
    let mesh;
    if (file.size) {
      try {
        if (!/\.obj$/i.test(file.name) || file.size>1000000) throw Error('Choose an OBJ file under 1 MB.');
        mesh = sewingModels.parseObj(await file.text());
      } catch (problem) { error.textContent = problem.message; return; }
    }
    const dimensions = Object.fromEntries(Object.keys(sewingModels.dimensions).map(key=>[key,Number(data.get(key))]));
    state.models.push({id:'form-'+Date.now().toString(36),name,...dimensions,mesh});
    save('Model added');
    modal.close();
    models();
  });
}

function startFit(id,modelId) {
  fitPattern = id;
  fitRevision = getPattern(id).fit || null;
  fitModel = modelId || fitRevision?.modelId || fitModel;
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
  for (const [key,value] of Object.entries(changes)) {
    if (!value || ['waist','hip','length','hasSleeves'].includes(key)) continue;
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
function fitting() {
  const pattern = getPattern(fitPattern);
  const modelType = basePattern(pattern).id;
  const sleeveEligible = ['dress','top'].includes(modelType);
  view.innerHTML = heading('3D Fitting Room','Choose a model and garment, preview your fit changes, then create an illustrated work order.') + `<div class="split"><section class="panel viewer fitting-viewer"><canvas id="model" tabindex="0" role="img" aria-label="Rotatable three-dimensional garment preview. Use left and right keys to turn the garment."></canvas><div class="viewer-footer"><span class="muted">Drag or use left and right keys to rotate</span><button class="secondary" id="reset-view">Front view</button></div></section><section class="panel fitting-controls"><h2>Fit adjustments</h2><form id="fitting-form">
    <label class="field">3D model<select name="model">${allModels().map(model=>option(model.id,model.name,fitModel)).join('')}</select></label>
    <p class="model-link"><a href="#models">Open Model Library</a></p>
    <label class="field">Garment<select name="pattern">${allPatterns().map(p=>option(p.id,p.name+(p.revision?' · Revision '+p.revision:''),fitPattern)).join('')}</select></label>
    ${sleeveEligible?`<label class="sleeve-choice"><input name="sleeves" type="checkbox" ${hasSleeves(pattern)?'checked':''}> Show sleeves and sleeve adjustments</label>`:''}
    ${pattern.revision?`<p class="muted fit-baseline">Changes are measured from revision ${pattern.revision}. Saving creates a new revision.</p>`:''}
    <div id="fit-sliders"></div>
    <p class="muted fit-baseline">The 3D preview approximates shape and ease. Check the actual fabric, seam allowances and comfort before cutting.</p><div class="actions"><button>Generate tailoring instructions</button><button type="reset" class="secondary">Reset changes</button></div></form></section></div><section id="fit-guide" class="panel instructions" hidden></section>`;
  const form = document.querySelector('#fitting-form');
  const canvas = document.querySelector('#model');
  const fitGuide = document.querySelector('#fit-guide');
  const sliders = document.querySelector('#fit-sliders');
  let angle = 0;
  let pointer;
  const sleeves = () => form.elements.namedItem('sleeves')?.checked || false;
  const keys = () => garmentFit.keys(modelType,sleeves());
  const changes = () => Object.fromEntries(keys().map(key=>[key,Number(form.elements.namedItem(key)?.value || 0)]));
  const adjustments = () => {
    const result = {hasSleeves:sleeves()};
    for (const [key,n] of Object.entries(changes())) result[key] = (fitRevision?.changes[key] || 0)+n;
    return result;
  };
  const body = () => getModel(fitModel);
  function drawControls(values={}) {
    sliders.innerHTML = keys().map(key=>{
      const [label,max,minus,plus] = garmentFit.fields[key];
      const n = values[key] || 0;
      return `<label class="field adjustment"><span>${label} <output id="${key}-value">${adjustmentText(n)}</output></span><input name="${key}" type="range" min="-${max}" max="${max}" step="0.5" value="${n}"><span class="adjustment-ends"><span>${minus}</span><span>${plus}</span></span></label>`;
    }).join('');
  }
  drawControls();
  function draw() {
    if (!canvas.isConnected) return;
    const ratio = Math.min(window.devicePixelRatio||1,2);
    canvas.width = Math.round(canvas.clientWidth*ratio);
    canvas.height = Math.round(canvas.clientHeight*ratio);
    drawModel(canvas,pattern,angle,adjustments(),body());
  }
  const size = new ResizeObserver(draw);
  size.observe(canvas);
  fitCleanup = () => size.disconnect();
  form.addEventListener('input',event=>{
    if (event.target.name==='pattern') { startFit(event.target.value); return; }
    if (event.target.name==='model') fitModel = event.target.value;
    if (event.target.name==='sleeves') drawControls(changes());
    for (const [key,n] of Object.entries(changes())) document.querySelector('#'+key+'-value').textContent = adjustmentText(n);
    fittingDraft = undefined;
    fitGuide.hidden = true;
    draw();
  });
  form.addEventListener('reset',event=>{
    event.preventDefault();
    if (sleeveEligible) form.elements.namedItem('sleeves').checked = hasSleeves(pattern);
    drawControls();
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
    const delta = changes();
    if (!Object.values(delta).some(Boolean)) {notify('Move at least one fit slider to generate instructions.');return;}
    const tools = 'Measuring tape, pins or clips, tailor’s chalk, seam ripper, matching thread, sewing machine, iron and press cloth. Keep shears handy for a confirmed hem alteration.';
    const {steps,visuals} = guide(pattern,delta,body());
    const summary = Object.entries(delta).filter(([,amount])=>amount).map(([key,amount])=>garmentFit.fields[key][0]+' '+adjustmentText(amount)).join(' · ');
    fittingDraft = {garment:pattern,tools,steps,visuals,summary,modelId:fitModel,changes:adjustments()};
    fitGuide.hidden = false;
    fitGuide.innerHTML = `<h2>Tailoring instructions</h2><p class="tight">${escape(pattern.name)} · ${escape(body().name)} · ${escape(summary)}</p><p class="tight"><strong>Tools and materials</strong> ${tools}</p>${sewingVisuals.tools(tools)}${sewingVisuals.steps(steps,visuals)}<form id="save-fit-form"><label class="field">Garment name<input name="garmentName" required maxlength="100" value="${escape(pattern.family?pattern.name:pattern.name+' fitted')}" ${pattern.family?'readonly':''}></label><button>Save revision and create work order</button></form>`;
    fitGuide.querySelector('#save-fit-form').addEventListener('submit',event=>{
      event.preventDefault();
      const name = new FormData(event.target).get('garmentName').trim();
      if (!name) {notify('Enter a garment name.');return;}
      saveFit(name);
    });
    fitGuide.scrollIntoView({block:'nearest'});
  });
  draw();
}
function saveFit(name) {
  if (!fittingDraft) return;
  const {garment,tools,steps,visuals,summary,modelId,changes} = fittingDraft;
  const base = basePattern(garment);
  const id = 'alteration-'+crypto.randomUUID();
  const family = garment.family || id;
  const revision = state.custom.filter(p=>p.family===family).length+1;
  const garmentVisuals = garment.visuals || sewingVisuals.patterns[garment.id] || garment.steps.map(sewingVisuals.identify);
  const rebuildSteps = [...(garment.rebuildSteps || garment.steps),...steps];
  const rebuildVisuals = [...(garment.rebuildVisuals || garmentVisuals),...visuals];
  const plan = {id,family,revision,name,type:garment.type,level:'Intermediate',cut:garment.cut,
    model:base.id,color:garment.color,fabric:'Existing garment and compatible fabric if an extension is needed.',
    tools,steps,visuals,rebuildSteps,rebuildVisuals,
    buildFabric:garment.buildFabric || garment.fabric,buildTools:[garment.buildTools || garment.tools,tools].filter(Boolean).join(' · '),
    fit:{modelId,changes,source:garment.id}};
  state.custom.push(plan);
  state.orders.unshift({id:'WO-'+String(state.next++).padStart(3,'0'),title:name+' · Revision '+revision,pattern:id,
    due:'',notes:getModel(modelId).name+' · '+summary,done:[]});
  save('Revision and work order saved');
  fittingDraft = undefined;
  fitPattern = id;
  fitRevision = plan.fit;
  location.hash = 'orders';
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
  ({overview,brand,library,orders,fitting,models,basics})[page]();
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
    case 'order': orderDetails(state.orders.find(o=>o.id===id)); break;
    case 'edit-order': newOrder(undefined,state.orders.find(o=>o.id===id)); break;
    case 'fit': startFit(id); break;
    case 'add-model': addModel(); break;
    case 'choose-model': startFit(fitPattern,id); break;
      }
});
window.addEventListener('hashchange',()=>{
  if (modal.open) modal.close();
  render();
  window.scrollTo(0,0);
});
render();

if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  navigator.serviceWorker.register('./sw.js').catch(error => {
    console.warn('Offline dashboard setup was unavailable.', error);
  });
}
