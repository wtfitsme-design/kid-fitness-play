'use strict';
(() => {
  // Bump this key whenever an existing illustration is replaced.
  const revision='fast-images-1';
  const url=path=>`${path}?art=${revision}`;
  const tree=url('assets/tree-skill-background-fast.webp');
  const loaded=new Map();
  let queue=[],active=0,scheduled=false,generation=0;
  const canPrefetch=()=>!navigator.connection?.saveData&&!/^(slow-)?2g$/.test(navigator.connection?.effectiveType||'');
  const workerReady=('serviceWorker' in navigator&&window.isSecureContext)
    ? navigator.serviceWorker.register('sw.js',{updateViaCache:'none'})
      .then(()=>navigator.serviceWorker.ready).then(registration=>registration.active).catch(()=>null)
    : Promise.resolve(null);

  function remember(src){
    workerReady.then(worker=>worker?.postMessage({type:'CACHE_IMAGES',urls:[new URL(src,document.baseURI).href]}));
  }
  function preload(src){
    if(loaded.has(src))return loaded.get(src).job;
    const image=new Image();
    const job=new Promise(resolve=>{
      image.decoding='async';image.fetchPriority='low';
      image.onload=async()=>{
        try{await image.decode()}catch(_){ }
        remember(src);resolve(true);
      };
      image.onerror=()=>{loaded.delete(src);resolve(false)};
      image.src=src;
    });
    loaded.set(src,{image,job});
    // Keep the current sequences decoded without retaining an entire library.
    if(loaded.size>20)loaded.delete(loaded.keys().next().value);
    return job;
  }
  function pump(){
    scheduled=false;
    while(active<2&&queue.length){
      const src=queue.shift();
      if(loaded.has(src))continue;
      active++;
      preload(src).finally(()=>{active--;pump()});
    }
  }
  function schedule(){
    if(scheduled)return;scheduled=true;
    if('requestIdleCallback' in window)window.requestIdleCallback(pump,{timeout:1500});
    else window.setTimeout(pump,120);
  }
  function prepare(sources,root){
    const current=++generation;
    queue=[];
    if(!canPrefetch())return;
    const start=()=>{
      if(current!==generation)return;
      queue=[...new Set(sources.filter(Boolean))].filter(src=>!loaded.has(src));schedule();
    };
    const visible=root?.querySelector('img');
    if(visible&&!visible.complete)visible.addEventListener('load',start,{once:true});
    else start();
  }
  function observe(root){
    root.querySelectorAll('[data-image]').forEach(wrap=>{
      const image=wrap.querySelector('img');
      if(!image||image.dataset.observed)return;
      image.dataset.observed='true';
      const status=document.createElement('span');status.className='image-status';status.textContent='图片加载中…';
      wrap.append(status);
      const success=()=>{wrap.classList.add('is-loaded');status.remove();remember(image.src)};
      const failure=()=>{
        const fallback=image.dataset.fallback;
        if(fallback&&new URL(fallback,document.baseURI).href!==image.src){image.src=fallback;return}
        status.replaceChildren(document.createTextNode('图片暂时没加载出来'));
        const retry=document.createElement('button');retry.type='button';retry.className='image-retry';retry.textContent='点击重试';
        retry.onclick=()=>{status.textContent='图片加载中…';const src=image.src;image.removeAttribute('src');image.src=src};status.append(retry);
      };
      image.onload=success;image.onerror=failure;
      if(image.complete){if(image.naturalWidth)success();else failure()}
    });
  }
  window.V2Images={url,tree,prepare,observe};
})();
