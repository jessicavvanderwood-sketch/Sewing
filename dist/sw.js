const cachePrefix = 'jessicas-sewing-';
const cacheName = cachePrefix + 'v32';
const cameraCacheName = cachePrefix + 'camera-v1';
const cameraAssets = new URL('./vendor/mediapipe/', self.registration.scope).pathname;
const files = ['./', './index.html', './style.css?v=32', './app.js?v=32', './cloth-contact.js?v=32', './fitting-render.js?v=32', './atelier.jpg',
  './manifest.webmanifest', './icon-192.png', './icon-512.png',
  './fabric.js?v=32', './handles.js?v=32', './catalog.js?v=32', './vanderwood-wordmark.webp', './units.js?v=32', './work-figures.js?v=32', './visuals.js?v=32', './fit.js?v=32', './design.js?v=32', './photo.js?v=32', './model-person.js?v=32', './model-outline.js?v=32', './camera.js?v=32', './models.js?v=32', './human-mesh.js?v=32', './human-preview.js?v=32', './brother-cp2160f.jpg',
  ...Array.from({length:12},(_,index)=>'./tools/tool-'+index+'.jpg')];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(files)));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(cachePrefix) && key !== cacheName && key !== cameraCacheName)
      .map(key => caches.delete(key))
  )));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin ||
      !url.href.startsWith(self.registration.scope)) return;

  if (url.pathname.startsWith(cameraAssets) && !request.headers.has('Range')) {
    event.respondWith((async () => {
      const cache = await caches.open(cameraCacheName).catch(() => null);
      const saved = await cache?.match(request);
      if (saved) return saved;
      const response = await fetch(request);
      if (cache && response.status === 200) await cache.put(request, response.clone()).catch(() => {});
      return response;
    })());
    return;
  }

  event.respondWith(
    fetch(request,{cache:'no-cache'}).catch(async () => {
      const cache = await caches.open(cacheName);
      return await cache.match(request) ||
        (request.mode === 'navigate' ? await cache.match('./') : Response.error());
    })
  );
});
