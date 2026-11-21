const cachePrefix = 'jessicas-sewing-';
const cacheName = cachePrefix + 'v26';
const files = ['./', './index.html', './style.css?v=26', './app.js?v=26', './cloth-contact.js?v=26', './fitting-render.js?v=26', './atelier.jpg',
  './manifest.webmanifest', './icon-192.png', './icon-512.png',
  './fabric.js?v=26', './handles.js?v=26', './catalog.js?v=26', './vanderwood-wordmark.webp', './units.js?v=26', './work-figures.js?v=26', './visuals.js?v=26', './fit.js?v=26', './design.js?v=26', './photo.js?v=26', './camera.js?v=26', './models.js?v=26', './human-mesh.js?v=26', './human-preview.js?v=26', './brother-cp2160f.jpg',
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
