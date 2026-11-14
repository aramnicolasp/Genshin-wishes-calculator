const CACHE_NAME = "genshin-calculadora-v1";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./calculadora.js",
    "./manifest.json",
    "./img/Protogemas.webp",
    "./img/Deseos.webp",
    "./img/Brillo_estelar.webp",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ARCHIVOS))
    );
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;

            return fetch(event.request).then(response => {
                if (response.ok) {
                    const copia = response.clone();
                    caches.open(CACHE_NAME).then(cache =>
                        cache.put(event.request, copia)
                    );
                }
                return response;
            });
        })
    );
});
