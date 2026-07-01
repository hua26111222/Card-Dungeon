// 版本号写死在缓存名里：以后更新了 card_dungeon.html，把这里的 v1 改成 v2，
// 手机上就会自动清掉旧缓存、换上新版本，不用玩家自己清缓存
const CACHE_NAME='card-dungeon-v1';
const ASSETS=[
  './card_dungeon.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

// 优先用缓存（离线也能秒开），同时偷偷去网络上要一份新的存起来，下次打开就是新版本
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request).then(cached=>{
      const fetchPromise=fetch(e.request).then(res=>{
        if(res&&res.status===200){
          const copy=res.clone();
          caches.open(CACHE_NAME).then(c=>c.put(e.request,copy));
        }
        return res;
      }).catch(()=>cached);
      return cached||fetchPromise;
    })
  );
});
