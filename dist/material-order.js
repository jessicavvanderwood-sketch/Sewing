'use strict';

const workMaterials = (() => {
  const sourceLabels={
    pieces:'Recorded cut pieces',
    estimate:'Garment-based estimate',
    guide:'Pattern guide',
    unresolved:'Quantity to confirm'
  };
  const number=(value,precision=3)=>String(Number(value.toFixed(precision)));
  const supplied=value=>Number.isFinite(value)&&value>0;
  // Round each purchase unit up to its displayed precision.
  const purchaseUnit=(cm,unit)=>number(Math.ceil(cm/unit*100-1e-8)/100,2);

  function publisherLink(publisher) {
    if (!publisher?.url) return '';
    try {
      const url=new URL(publisher.url);
      if (!['http:','https:'].includes(url.protocol)) return '';
      return `<p class="tight"><a href="${escape(url.href)}" target="_blank" rel="noopener">View ${escape(publisher.name||'the publisher’s')} pattern and fabric requirements</a></p>`;
    } catch {
      return '';
    }
  }

  function cuttingSchedule(groups) {
    const layouts=groups.filter(group=>group.layout?.ready);
    if (!layouts.length) return '';
    const length=value=>`${number(value,2)} cm`;
    const headings=['Paper piece','Cut','Across from selvage','Down from start of section','Space on fabric','Placement'];
    const materials=layouts.map(({id,name,layout})=>`<section class="wo-cut-schedule-material" data-cutting-material="${escape(id)}"><h4>${escape(name)}</h4>
      ${layout.batches.map((batch,index)=>{
        const folded=batch.layout==='folded';
        return `<section class="wo-cut-schedule-batch" data-cutting-batch="${batch.layout}"><h5>${index+1}. ${folded?'Fold selvage to selvage':'Lay in a single layer'}</h5>
          <p class="tight">Start ${length(batch.start)} from the usable cut end. This section uses ${length(batch.length)} along the fabric and ${length(batch.width)} across.</p>
          <div class="table"><table><thead><tr>${headings.map(heading=>`<th scope="col">${heading}</th>`).join('')}</tr></thead><tbody>${batch.shelves.flatMap(shelf=>shelf.placements.map(piece=>{
            const placement=piece.onFold?'Place on fold':piece.cutCount===2?'Cut through both layers':piece.mirror?'Flip paper to mirror':piece.mode==='fold'?'Use the full traced outline':'Right side as marked on paper';
            const values=[piece.cutCount,length(piece.x),length(piece.y),`${number(piece.width,2)} × ${length(piece.length)}`,placement];
            return `<tr><th scope="row">${escape(piece.piece.name)}</th>${values.map(value=>`<td>${escape(value)}</td>`).join('')}</tr>`;
          })).join('')}</tbody></table></div></section>`;
      }).join('')}</section>`).join('');
    return `<details class="design-options wo-cut-schedule" open><summary>Cutting order and placement</summary>
      <p>Confirm each usable width. Square off the cut end, then mark each row from the listed section start and the selvage. Align the grainline with the selvage and check any recorded grainline offset. Fit the full-size paper pieces in the marked spaces and cut along their paper outlines. Match any print before cutting.</p>${materials}</details>`;
  }

  function render(estimate,{planFormId='allowance-form',editable=true}={}) {
    if (!estimate) return '';
    const {groups=[],notes=[],notions=[],publisher}=estimate;
    const guide=publisherLink(publisher);
    if (!groups.length&&!notes.length&&!notions.length&&!guide) return '';
    const cards=groups.map(group=>{
      const source=Object.hasOwn(sourceLabels,group.source)?group.source:'unresolved';
      const quantity=supplied(group.lengthCm)
        ?`<p class="wo-material-quantity">${purchaseUnit(group.lengthCm,91.44)} yd · ${purchaseUnit(group.lengthCm,100)} m</p>`
        :'<p class="wo-material-issue">Quantity to confirm</p>';
      const width=supplied(group.widthCm)?`<p class="wo-material-width">Usable width ${number(group.widthCm)} cm</p>`:'';
      return `<article class="wo-material-card" data-material-source="${source}">
        <h4>${escape(group.name||'Fabric')}</h4>${quantity}${width}
        ${source!=='unresolved'?`<p class="muted">${sourceLabels[source]}</p>`:''}
        ${group.details?`<p>${escape(group.details)}</p>`:''}</article>`;
    }).join('');
    const action=editable?`<button type="button" class="secondary" data-edit-material-plan="${escape(planFormId)}">Edit fabric width and cutting list</button>`:'';
    return `<section class="wo-materials" aria-label="Fabric quantities">
      <div class="wo-material-heading"><h3>Fabric quantities</h3>${action}</div>
      ${cards?`<div class="wo-material-list">${cards}</div>`:''}
      ${notions.length?`<div class="wo-material-notions"><h4>Notions with recorded quantities</h4><ul>${notions.map(({name,quantity})=>`<li><strong>${escape(name)}</strong> ${escape(quantity)}</li>`).join('')}</ul></div>`:''}
      ${cuttingSchedule(groups)}
      ${notes.length?`<details class="wo-material-basis" open><summary>How quantities were estimated</summary><ul>${notes.map(note=>`<li>${escape(note)}</li>`).join('')}</ul></details>`:''}
      ${guide}</section>`;
  }

  function bind(root) {
    for (const button of root.querySelectorAll('[data-edit-material-plan]')) {
      button.onclick=()=>{
        const form=Array.from(root.querySelectorAll('form')).find(form=>form.id===button.dataset.editMaterialPlan);
        if (!form) return;
        const width=form.querySelector('[name="usableWidth"], [data-material-width]');
        const target=width||form;
        for (let panel=target.closest('details');panel;panel=panel.parentElement.closest('details')) panel.open=true;
        width?.focus({preventScroll:true});
        target.scrollIntoView({block:'center'});
      };
    }
  }

  return {render,bind};
})();
