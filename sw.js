const CACHE_NAME = 'comentarionista-cache-v1';

// Arquivos que serão salvos IMEDIATAMENTE ao instalar
const PRE_CACHE = [
  './',
  './manifest.json'
];

// Instalação: Salva os arquivos básicos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRE_CACHE))
      .then(self.skipWaiting())
  );
});

// Ativação: Limpa caches antigos se você mudar o nome do CACHE_NAME
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Intercepta as buscas: Tenta internet, se falhar, usa o cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Se a rede funcionar, salva uma cópia no cache
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, resClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request)) // Se a rede falhar, usa o que tem no cache
  );
});
