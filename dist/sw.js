const cachePrefix = 'jessicas-sewing-';
const cacheName = cachePrefix + 'v31';
const files = ['./', './index.html', './style.css?v=31', './app.js?v=31', './cloth-contact.js?v=31', './fitting-render.js?v=31', './atelier.jpg',
  './manifest.webmanifest', './icon-192.png', './icon-512.png',
  './fabric.js?v=31', './handles.js?v=31', './catalog.js?v=31', './vanderwood-wordmark.webp', './units.js?v=31', './work-figures.js?v=31', './visuals.js?v=31', './fit.js?v=31', './design.js?v=31', './photo.js?v=31', './camera.js?v=31', './models.js?v=31', './human-mesh.js?v=31', './human-preview.js?v=31', './brother-cp2160f.jpg',
  ...Array.from({length:12},(_,index)=>'./tools/tool-'+index+'.jpg')];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(files)));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(cachePrefix) && key !== cacheName)
      .map(key => caches.delete(key))
  )));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin ||
      !url.href.startsWith(self.registration.scope)) return;

  event.respondWith(
    fetch(request,{cache:'no-cache'}).catch(async () => {
      const cache = await caches.open(cacheName);
      return await cache.match(request) ||
        (request.mode === 'navigate' ? await cache.match('./') : Response.error());
    })
  );
});
