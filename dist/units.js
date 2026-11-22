'use strict';

const studioUnits = (() => {
  const key='jessicas-sewing-length-unit';
  const ratio=2.54;
  let unit='cm';
  try { if (localStorage.getItem(key)==='in') unit='in'; } catch {}
  const source=new WeakMap();
  const precision=(value,digits=3)=>String(Number(value.toFixed(digits)));
  const number=cm=>unit==='in'?precision(cm/ratio):precision(cm);
  function text(metric) {
    if (unit==='cm') return metric;
    return metric
      .replace(/([+−-]?\d+(?:\.\d+)?)\s*([×x–])\s*([+−-]?\d+(?:\.\d+)?)\s*cm\b/g,
        (_,a,separator,b)=>number(Number(a.replace('−','-')))+' '+separator+' '+number(Number(b.replace('−','-')))+' in')
      .replace(/([+−-]?\d+(?:\.\d+)?)\s*cm\b/g,
        (_,raw)=>(raw.startsWith('+')?'+':'')+number(Number(raw.replace('−','-')))+' in')
      .replaceAll('(cm)','(in)');
  }
  function lengthValue(input) {
    if (!input.value) return null;
    if (input.value===input.dataset.shownLength && input.dataset.metricLength!==undefined) return Number(input.dataset.metricLength);
    return Number(precision(Number(input.value)*(input.dataset.lengthUnit==='in'?ratio:1),6));
  }
  function writeLength(input,metric) {
    input.value=metric==null?'':number(metric);
    input.dataset.metricLength=metric??'';
    input.dataset.shownLength=input.value;
  }
  function showEstimate(input) {
    const metric=Number(input.dataset.estimatedLength);
    input.placeholder=Number.isFinite(metric)?`Est. ${precision(unit==='in'?metric/ratio:metric,1)} ${unit}`:'';
  }
  function writeEstimate(input,metric) {
    if (Number.isFinite(metric)) input.dataset.estimatedLength=metric;
    else delete input.dataset.estimatedLength;
    showEstimate(input);
  }
  function inputUnits(input) {
    if (input.dataset.estimatedLength!==undefined) showEstimate(input);
    if (input.dataset.lengthUnit===unit) return;
    const old=input.dataset.lengthUnit || 'cm';
    const metric=lengthValue(input);
    if (!input.dataset.metricMin && input.min!=='') input.dataset.metricMin=old==='in'?Number(input.min)*ratio:input.min;
    if (!input.dataset.metricMax && input.max!=='') input.dataset.metricMax=old==='in'?Number(input.max)*ratio:input.max;
    input.min=input.dataset.metricMin!==undefined?number(Number(input.dataset.metricMin)):'';
    input.max=input.dataset.metricMax!==undefined?number(Number(input.dataset.metricMax)):'';
    input.step='any';
    input.dataset.lengthUnit=unit;
    writeLength(input,metric);
  }
  function convert(node) {
    if (node.nodeType!==Node.TEXT_NODE || !node.parentElement || /^(TEXTAREA|SCRIPT|STYLE|OPTION)$/.test(node.parentElement.tagName)) return;
    const previous=source.get(node);
    const original=previous?.shown===node.nodeValue?previous.metric:node.nodeValue;
    if (!original.includes('cm')) return;
    const shown=text(original);
    source.set(node,{metric:original,shown});
    if (shown!==node.nodeValue) node.nodeValue=shown;
  }
  function refresh(root) {
    if (root.nodeType===Node.TEXT_NODE) {convert(root);return;}
    if (root.matches?.('[data-length-input]')) inputUnits(root);
    for (const input of root.querySelectorAll?.('[data-length-input]') || []) inputUnits(input);
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) convert(walker.currentNode);
  }
  function watch(selector,...roots) {
    selector.value=unit;
    selector.addEventListener('change',()=>{
      unit=selector.value==='in'?'in':'cm';
      try { localStorage.setItem(key,unit); } catch {}
      for (const root of roots) refresh(root);
    });
    const observer=new MutationObserver(changes=>{
      for (const change of changes) {
        if (change.type==='characterData') convert(change.target);
        else for (const node of change.addedNodes) refresh(node);
      }
    });
    for (const root of roots) observer.observe(root,{childList:true,subtree:true,characterData:true});
  }
  return {text,refresh,watch,lengthValue,writeLength,writeEstimate};
})();
