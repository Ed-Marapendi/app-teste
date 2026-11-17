/*
 * App Ed. Marapendi — service worker (Etapa 10)
 * ---------------------------------------------
 * Guarda as telas no celular para o app abrir rápido e mesmo sem internet
 * (mostra a tela e o aviso de "sem conexão"; dados sempre vêm do servidor).
 * - Nunca guarda nada do servidor (Apps Script): dados de moradores não ficam no cache.
 * - Página: rede primeiro; sem internet, usa a cópia guardada.
 * - Arquivos das telas (com ?v=versão): guardados por versão.
 * - Versão nova: fica "esperando" até a pessoa tocar em "Nova versão disponível".
 * Ao publicar uma versão nova das telas, troque o número em VERSAO (o mesmo de config.js).
 */
var VERSAO = '0.13.0';
var CACHE = 'marapendi-telas-' + VERSAO;
var ESSENCIAIS = ['./', 'index.html', 'app.css?v=' + VERSAO, 'config.js?v=' + VERSAO, 'servidor.js?v=' + VERSAO, 'app.js?v=' + VERSAO, 'pwa.js?v=' + VERSAO,
  'logo.jpg', 'manifest.webmanifest', 'icone-192.png', 'icone-512.png', 'icone-maskable-512.png', 'apple-touch-icon.png', 'favicon-32.png'];

self.addEventListener('install', function (ev) {
  ev.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ESSENCIAIS); }));
});

self.addEventListener('activate', function (ev) {
  ev.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('marapendi-telas-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('message', function (ev) {
  if (ev.data === 'atualizar') self.skipWaiting();
});

self.addEventListener('fetch', function (ev) {
  var req = ev.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;     // servidor, fontes e o resto: direto da internet
  if (req.mode === 'navigate') {
    ev.respondWith(fetch(req).then(function (r) {
      var copia = r.clone();
      if (r.ok) caches.open(CACHE).then(function (c) { c.put('index.html', copia); });
      return r;
    }).catch(function () { return caches.match('index.html'); }));
    return;
  }
  ev.respondWith(caches.match(req).then(function (achou) {
    return achou || fetch(req).then(function (r) {
      if (r.ok && url.search.indexOf('v=') >= 0) { var copia = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, copia); }); }
      return r;
    });
  }));
});
