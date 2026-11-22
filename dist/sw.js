const cachePrefix = 'jessicas-sewing-';
const cacheName = cachePrefix + 'v28';
const files = ['./', './index.html', './style.css?v=28', './app.js?v=28', './cloth-contact.js?v=28', './fitting-render.js?v=28', './atelier.jpg',
  './manifest.webmanifest', './icon-192.png', './icon-512.png',
  './fabric.js?v=28', './handles.js?v=28', './catalog.js?v=28', './vanderwood-wordmark.webp', './units.js?v=28', './work-figures.js?v=28', './visuals.js?v=28', './fit.js?v=28', './design.js?v=28', './photo.js?v=28', './camera.js?v=28', './models.js?v=28', './human-mesh.js?v=28', './human-preview.js?v=28', './brother-cp2160f.jpg',
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
