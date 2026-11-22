const cachePrefix = 'jessicas-sewing-';
const cacheName = cachePrefix + 'v39';
const cameraCacheName = cachePrefix + 'camera-v1';
const cameraAssets = new URL('./vendor/mediapipe/', self.registration.scope).pathname;
const files = ['./', './index.html', './style.css?v=39', './app.js?v=39', './cloth-contact.js?v=39', './fitting-render.js?v=39', './atelier.jpg',
  './manifest.webmanifest', './icon-192.png', './icon-512.png',
  './fabric.js?v=39', './handles.js?v=39', './catalog.js?v=39', './vanderwood-wordmark.webp', './units.js?v=39', './work-figures.js?v=39', './visuals.js?v=39', './fit.js?v=39', './fasteners.js?v=39', './design.js?v=39', './photo.js?v=39', './model-person.js?v=39', './model-outline.js?v=39', './camera.js?v=39', './models.js?v=39', './human-mesh.js?v=39', './human-preview.js?v=39', './brother-cp2160f.jpg',
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
