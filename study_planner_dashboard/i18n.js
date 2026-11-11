(() => {
  'use strict';
  const storageKey = 'llm-finance-language';
  let lang = 'zh';
  try { lang = localStorage.getItem(storageKey) === 'en' ? 'en' : 'zh'; } catch (_) {}
  if (window.FINANCE_EXPORT_LANG) lang = window.FINANCE_EXPORT_LANG;
  const originals = new WeakMap();
  const attributes = new WeakMap();
  const dataOriginals = new WeakMap();
  const translatedFields = new Set(['title','description','risk','risks','failure_mode','downstream_impact','evaluation_metric','claim','note']);
  const dictionary = window.NETWORK_ZH || {};
  const sourceText = (object,key) => dataOriginals.get(object)?.[key] ?? object[key] ?? '';
  const patterns = (window.NETWORK_ZH_PATTERNS || []).map(([pattern,replacement]) => [new RegExp(pattern, 'g'),replacement]);
  function t(value) {
    if (lang === 'en' || typeof value !== 'string') return value;
    if (Object.prototype.hasOwnProperty.call(dictionary,value)) return dictionary[value];
    let result = value;
    for (const [pattern,replacement] of patterns) result = result.replace(pattern,replacement);
    return result;
  }
  function translateData(object) {
    if (!object || typeof object !== 'object') return;
    if (Array.isArray(object)) { object.forEach(translateData); return; }
    let saved = dataOriginals.get(object);
    if (!saved) { saved = {}; dataOriginals.set(object,saved); }
    for (const [key,value] of Object.entries(object)) {
      if (typeof value === 'object') translateData(value);
      else if (typeof value === 'string' && translatedFields.has(key)) {
        if (!(key in saved)) saved[key] = value;
        object[key] = t(saved[key]);
      }
    }
  }
  function localizeElement(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;
    while ((node=walker.nextNode())) {
      if (node.parentElement?.closest('script,style,[data-original-title]')) continue;
      const current=node.nodeValue;
      let saved=originals.get(node);
      if (!saved || current!==saved.rendered) saved={original:current,rendered:current};
      const raw=saved.original, trimmed=raw.trim();
      const result=trimmed && !/^https?:\/\//.test(trimmed) ? raw.replace(trimmed,t(trimmed)) : raw;
      saved.rendered=result;originals.set(node,saved);
      if (current!==result) node.nodeValue=result;
    }
    for (const el of [root,...root.querySelectorAll('[aria-label],[title],[placeholder]')]) {
      if (!el.getAttribute) continue;
      let saved=attributes.get(el);if (!saved) { saved={};attributes.set(el,saved); }
      for (const key of ['aria-label','title','placeholder']) {
        const value=el.getAttribute(key);if (value===null) continue;
        if (!(key in saved)) saved[key]=value;
        const rendered=t(saved[key]);if(value!==rendered)el.setAttribute(key,rendered);
      }
    }
  }
  function prepareExport(clone) {
    const originalWalker=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_TEXT);
    const cloneWalker=document.createTreeWalker(clone,NodeFilter.SHOW_TEXT);
    let originalNode,cloneNode;
    while((originalNode=originalWalker.nextNode()) && (cloneNode=cloneWalker.nextNode())) {
      const saved=originals.get(originalNode);if(saved)cloneNode.nodeValue=saved.original;
    }
    const sourceElements=[document.documentElement,...document.documentElement.querySelectorAll('*')];
    const cloneElements=[clone,...clone.querySelectorAll('*')];
    sourceElements.forEach((el,index)=>{const saved=attributes.get(el);if(saved)for(const [key,value]of Object.entries(saved))cloneElements[index].setAttribute(key,value);});
  }
  let pending=false;
  function apply() {
    document.documentElement.lang=lang==='zh'?'zh-CN':'en';
    document.title=lang==='zh'?'LLM in Finance | 研究热点与功能网络':'LLM in Finance | Research Radar & Functionality Network';
    for (const [selector,zh,en] of [['.workspace-nav','主导航','Workspace navigation'],['.language-picker','语言','Language'],['#researchWorkspace','研究雷达','Research radar']]) document.querySelector(selector)?.setAttribute('aria-label',lang==='zh'?zh:en);
    document.querySelectorAll('[data-zh][data-en]').forEach(el=>{el.textContent=el.dataset[lang];});
    document.querySelectorAll('[data-lang]').forEach(button=>{const active=button.dataset.lang===lang;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});
    for(const selector of ['#networkWorkspace','#detailDrawer','#toast','.footer','.topbar']) localizeElement(document.querySelector(selector));
  }
  function queue() { if (pending) return;pending=true;queueMicrotask(()=>{pending=false;observer.disconnect();apply();observe();}); }
  const observer = new MutationObserver(queue);
  function observe() { for(const selector of ['#networkWorkspace','#detailDrawer','#toast']) {const el=document.querySelector(selector);if(el)observer.observe(el,{subtree:true,childList:true,characterData:true});} }
  function setLanguage(value) {
    if (!['zh','en'].includes(value) || value===lang) return;
    lang=value;try{localStorage.setItem(storageKey,value);}catch(_){}
    translateData(window.STUDY_DATA);
    window.dispatchEvent(new CustomEvent('finance-language-change'));
    apply();
  }
  window.FINANCE_I18N={get lang(){return lang;},t,apply,setLanguage,sourceText,prepareExport};
  translateData(window.STUDY_DATA);
  document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.lang)));
  apply();observe();
})();
