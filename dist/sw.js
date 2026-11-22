const cachePrefix = 'jessicas-sewing-';
const cacheName = cachePrefix + 'v41';
const cameraCacheName = cachePrefix + 'camera-v1';
const cameraAssets = new URL('./vendor/mediapipe/', self.registration.scope).pathname;
const files = ['./', './index.html', './style.css?v=41', './app.js?v=41', './cloth-contact.js?v=41', './fitting-render.js?v=41', './atelier.jpg',
  './manifest.webmanifest', './icon-192.png', './icon-512.png',
  './fabric.js?v=41', './handles.js?v=41', './catalog.js?v=41', './vanderwood-wordmark.webp', './units.js?v=41', './work-figures.js?v=41', './visuals.js?v=41', './fit.js?v=41', './fasteners.js?v=41', './design.js?v=41', './photo.js?v=41', './model-person.js?v=41', './model-outline.js?v=41', './camera.js?v=41', './models.js?v=41', './human-mesh.js?v=41', './human-preview.js?v=41', './brother-cp2160f.jpg',
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
