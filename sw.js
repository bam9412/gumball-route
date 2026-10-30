const C='gumball-v7',F=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F.map(u=>new Request(u,{cache:'reload'})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
function isPage(req){if(req.mode==='navigate')return true;const u=new URL(req.url);return u.origin===location.origin&&(/\/index\.html$/.test(u.pathname)||u.pathname===new URL('./',location.href).pathname)}
function netFirst(req){return new Promise(res=>{let done=false;const fb=()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('index.html')).then(r=>{if(!done){done=true;res(r||Response.error())}});
const t=setTimeout(fb,3000);fetch(req,{cache:'no-store'}).then(n=>{if(n&&n.ok){const c=n.clone();caches.open(C).then(x=>x.put(isPage(req)&&req.mode==='navigate'?'index.html':req,c))}clearTimeout(t);if(!done){done=true;res(n)}}).catch(()=>{clearTimeout(t);fb()})})}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!='GET')return;if(isPage(r)){e.respondWith(netFirst(r));return}
e.respondWith(caches.match(r,{ignoreSearch:true}).then(c=>c||fetch(r).then(n=>{const cl=n.clone();caches.open(C).then(x=>x.put(r,cl));return n})))});
