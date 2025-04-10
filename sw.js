const CACHE_NAME = 'my-cache-v2';
const ASSETS = [
    '/',
    '/frontend/index.html',
    '/frontend/app.js',
    '/frontend/style.css',
    '/frontend/script.js',
    '/manifest.json'
];

// Установка Service Worker и кэширование ресурсов
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
    console.log('Service Worker установлен.');

});

// Активация и очистка старых кэшей
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key=>key !==CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        })
    );
    console.log('Service Worker активирован.');

});

// Перехват запросов и возврат из кэша
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});