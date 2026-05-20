
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('lab-cache').then(cache => {
      return cache.addAll(['index.html', 'script.js', 'courses.json']);
    })
  );
});
