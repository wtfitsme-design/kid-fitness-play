'use strict';
// Images only: page scripts still follow the normal HTTP update flow.
const CACHE_PREFIX='kid-fitness-next-images-';
const CACHE_NAME=`${CACHE_PREFIX}1`;
const assetBase=new URL('assets/',self.registration.scope);
const inFlight=new Map();
function isImage(url){
  const value=new URL(url);
  return value.origin===assetBase.origin&&value.pathname.startsWith(assetBase.pathname)&&/\.(webp|png|jpe?g)$/.test(value.pathname);
}
async function imageResponse(request){
  let cache;
  try{
    cache=await caches.open(CACHE_NAME);
    const saved=await cache.match(request);
    if(saved)return saved;
  }catch(_){ }
  if(!inFlight.has(request.url)){
    const response=fetch(request).then(async result=>{
      if(result.ok&&cache){try{await cache.put(request,result.clone())}catch(_){ }}
      return result;
    }).finally(()=>inFlight.delete(request.url));
    inFlight.set(request.url,response);
  }
  return (await inFlight.get(request.url)).clone();
}
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  try{
    const names=await caches.keys();
    await Promise.all(names.filter(name=>name.startsWith(CACHE_PREFIX)&&name!==CACHE_NAME).map(name=>caches.delete(name)));
  }catch(_){ }
  await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
  if(event.request.method==='GET'&&isImage(event.request.url))event.respondWith(imageResponse(event.request));
});
self.addEventListener('message',event=>{
  if(event.data?.type!=='CACHE_IMAGES'||!Array.isArray(event.data.urls))return;
  // The initial page can load before this worker takes control. Copy only its
  // successfully loaded images from the HTTP cache into the persistent cache.
  event.waitUntil(Promise.allSettled(event.data.urls.slice(0,16).filter(isImage).map(url=>
    imageResponse(new Request(url,{cache:'force-cache'}))
  )));
});
