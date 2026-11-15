/* Hält die verschlüsselte App und die Schriften vor, damit sie auch ohne Netz startet. Eigene Dateien: erst Netz, sonst Vorrat. */
const C='spieleabend-v1';
self.addEventListener('install',e=>{ self.skipWaiting(); e.waitUntil(caches.open(C).then(c=>c.addAll(['./','manifest.webmanifest','icon-180.png']).catch(()=>{}))); });
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(u.origin===location.origin){
    e.respondWith(fetch(r).then(res=>{ const cp=res.clone(); caches.open(C).then(c=>c.put(r,cp)); return res; })
      .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./'))));
  } else if(/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{ const cp=res.clone(); caches.open(C).then(c=>c.put(r,cp)); return res; })));
  }
});
