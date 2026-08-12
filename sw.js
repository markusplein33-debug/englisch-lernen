// Service Worker: Precache aller App-Dateien, cache-first, offline-fähig.
// Bei jeder Änderung an der App die VERSION erhöhen!
var VERSION = 4;
var CACHE = 'notizen-en-v' + VERSION;

var ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'js/app.js',
  'js/router.js',
  'js/storage.js',
  'js/grading.js',
  'js/version.js',
  'js/speech.js',
  'js/srs.js',
  'js/quiz.js',
  'js/pensum.js',
  'js/views/home.js',
  'js/views/flashcards.js',
  'js/views/quizview.js',
  'js/views/grammar.js',
  'js/views/stats.js',
  'js/views/settings.js',
  'js/views/session.js',
  'js/data/index.js',
  'js/data/deck-hotel.js',
  'js/data/deck-restaurant.js',
  'js/data/deck-flughafen.js',
  'js/data/deck-einkaufen.js',
  'js/data/deck-notfall.js',
  'js/data/deck-smalltalk.js',
  'js/data/deck-verkehr.js',
  'js/data/deck-basis.js',
  'js/data/quiz-reise.js',
  'js/data/grammar-lessons.js',
  'js/data/paket-alltag.js',
  'js/data/paket-arbeit.js',
  'js/data/paket-essen.js',
  'js/data/paket-technik.js',
  'js/data/paket-grammatik2.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k.indexOf('notizen-en-') === 0 && k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('message', function (e) {
  if (e.data && e.data.typ === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (resp) {
        return resp;
      }).catch(function () {
        // Navigation offline -> App-Shell
        if (e.request.mode === 'navigate') return caches.match('index.html');
        return new Response('', { status: 504 });
      });
    })
  );
});
