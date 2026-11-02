const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const source=file=>fs.readFileSync(path.join(root,'next',file),'utf8');

const content={window:{}};
vm.createContext(content);
for(const file of ['next-content.js','next-illustrations.js'])vm.runInContext(source(file),content);
test('every leaf keeps its own complete sequence and a lightweight preview',()=>{
  let leaves=0;
  const motion=content.window.V2Motion;
  for(const [id,skill] of Object.entries(content.window.V2.skills)){
    for(const leaf of content.window.V2.allLeaf(skill)){
      leaves++;
      const frames=[0,1,2,3].map(step=>motion.imageUrl(id,step,leaf));
      assert.equal(new Set(frames).size,4);
      for(const file of frames)assert.ok(fs.existsSync(path.join(root,'next',file)),file);
      const preview=motion.frame(id,0,leaf,{preview:true}).match(/src="([^"]+)"/)[1];
      const stat=fs.statSync(path.join(root,'next',preview));
      assert.ok(preview.includes('assets/previews/'));
      assert.ok(stat.size<25000,preview);
      assert.match(motion.frame(id,0,leaf),/loading="eager".*fetchpriority="high"/);
      assert.match(motion.frame(id,2,leaf,{lazy:true}),/loading="lazy".*fetchpriority="low"/);
    }
  }
  assert.equal(leaves,47);
  assert.ok(fs.statSync(path.join(root,'next/assets/tree-skill-background-fast.webp')).size<300000);
});

function workerHarness({storageFails=false}={}){
  const listeners={},storage=new Map(),removed=[];
  let networkCalls=0,offline=false,claimed=false;
  const scope='https://example.test/kid-fitness-play/next/';
  const cache={
    async match(req){return storage.get(req.url)?.clone()},
    async put(req,res){storage.set(req.url,res.clone())}
  };
  const context={
    URL,Request,Response,Map,Promise,
    self:{registration:{scope},addEventListener:(name,fn)=>listeners[name]=fn,
      skipWaiting:async()=>{},clients:{claim:async()=>{claimed=true}}},
    caches:{open:async()=>{if(storageFails)throw Error('quota');return cache},
      keys:async()=>['unrelated-cache','kid-fitness-next-images-old','kid-fitness-next-images-1'],
      delete:async key=>removed.push(key)},
    fetch:async req=>{
      networkCalls++;
      await new Promise(resolve=>setImmediate(resolve));
      if(offline)throw Error('offline');
      return new Response(req.url.includes('missing')?'not found':'image bytes',{status:req.url.includes('missing')?404:200});
    }
  };
  vm.createContext(context);vm.runInContext(source('sw.js'),context);
  const get=url=>new Promise((resolve,reject)=>{
    let intercepted=false;
    listeners.fetch({request:new Request(new URL(url,scope)),respondWith:p=>{intercepted=true;Promise.resolve(p).then(resolve,reject)}});
    if(!intercepted)resolve(null);
  });
  return {get,listeners,storage,removed,scope,networkCalls:()=>networkCalls,setOffline:()=>offline=true,isClaimed:()=>claimed};
}

test('visited illustrations survive an offline revisit and revisions refresh',async()=>{
  const h=workerHarness();
  assert.equal((await h.get('assets/one.webp?art=first')).status,200);
  assert.equal((await h.get('assets/one.webp?art=first')).status,200);
  assert.equal(h.networkCalls(),1);
  await h.get('assets/one.webp?art=second');
  assert.equal(h.networkCalls(),2);
  h.setOffline();
  assert.equal(await (await h.get('assets/one.webp?art=first')).text(),'image bytes');
  await assert.rejects(h.get('assets/unseen.webp'));
});

test('concurrent requests share a download, while failed images can retry',async()=>{
  const h=workerHarness();
  const results=await Promise.all([h.get('assets/one.webp'),h.get('assets/one.webp')]);
  assert.equal(h.networkCalls(),1);
  assert.equal(await results[0].text(),'image bytes');
  assert.equal(await results[1].text(),'image bytes');
  await h.get('assets/missing.webp');await h.get('assets/missing.webp');
  assert.equal(h.networkCalls(),3);
  assert.equal(h.storage.has(h.scope+'assets/missing.webp'),false);
});

test('cache failure does not block images or intercept scripts and other pages',async()=>{
  const h=workerHarness({storageFails:true});
  assert.equal((await h.get('assets/one.webp')).status,200);
  assert.equal(await h.get('next-app.js'),null);
  assert.equal(await h.get('../v2/assets/one.webp'),null);
  assert.equal(await h.get('https://other.test/assets/one.webp'),null);
});

test('activation only cleans this image cache namespace',async()=>{
  const h=workerHarness();let done;
  h.listeners.activate({waitUntil:p=>done=p});await done;
  assert.deepEqual(h.removed,['kid-fitness-next-images-old']);
  assert.equal(h.isClaimed(),true);
});

test('first-visit cache messages stay restricted to same-site image assets',async()=>{
  const h=workerHarness();let done;
  h.listeners.message({data:{type:'CACHE_IMAGES',urls:[h.scope+'assets/one.webp','https://other.test/image.png',h.scope+'next-app.js']},waitUntil:p=>done=p});
  await done;assert.equal(h.networkCalls(),1);
});

function loaderHarness({saveData=false,slow=false}={}){
  const timers=[],images=[];
  const context={
    navigator:{connection:{saveData,effectiveType:slow?'2g':'4g'}},document:{baseURI:'https://example.test/next/'},
    window:{isSecureContext:false,setTimeout:fn=>timers.push(fn)},
    Image:class {constructor(){images.push(this)}decode(){return Promise.resolve()}}
  };
  vm.createContext(context);vm.runInContext(source('next-images.js'),context);
  return {api:context.window.V2Images,images,flush:()=>timers.splice(0).forEach(fn=>fn())};
}

test('prefetch waits for the visible image, deduplicates and limits concurrency',async()=>{
  const h=loaderHarness(),listeners={};
  h.api.prepare(['one.webp','one.webp','two.webp','three.webp'],{querySelector:()=>({complete:false,addEventListener:(event,fn)=>listeners[event]=fn})});
  h.flush();assert.equal(h.images.length,0);
  listeners.load();h.flush();assert.equal(h.images.length,2);
  await h.images[0].onload();await new Promise(r=>setImmediate(r));
  assert.equal(h.images.length,3);
  h.api.prepare(['one.webp','two.webp','three.webp']);h.flush();
  assert.equal(h.images.length,3);
});

test('save-data and slow connections skip speculative downloads',()=>{
  for(const settings of [{saveData:true},{slow:true}]){
    const h=loaderHarness(settings);h.api.prepare(['one.webp']);h.flush();assert.equal(h.images.length,0);
  }
});
