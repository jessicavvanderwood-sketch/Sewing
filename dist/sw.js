const cachePrefix = 'jessicas-sewing-';
const cacheName = cachePrefix + 'v42';
const cameraCacheName = cachePrefix + 'camera-v1';
const cameraAssets = new URL('./vendor/mediapipe/', self.registration.scope).pathname;
const files = ['./', './index.html', './style.css?v=42', './app.js?v=42', './cloth-contact.js?v=42', './fitting-render.js?v=42', './atelier.jpg',
  './manifest.webmanifest', './icon-192.png', './icon-512.png',
  './fabric.js?v=42', './handles.js?v=42', './catalog.js?v=42', './vanderwood-wordmark.webp', './units.js?v=42', './work-figures.js?v=42', './visuals.js?v=42', './fit.js?v=42', './fasteners.js?v=42', './design.js?v=42', './photo.js?v=42', './model-person.js?v=42', './model-outline.js?v=42', './camera.js?v=42', './models.js?v=42', './human-mesh.js?v=42', './human-preview.js?v=42', './brother-cp2160f.jpg',
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
