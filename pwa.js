/*
 * App Ed. Marapendi — app instalável (Etapa 10)
 * ---------------------------------------------
 * window.pwa.instalado()   → true quando já está aberto como app (ícone na tela inicial).
 * window.pwa.plataforma()  → 'ios', 'android' ou 'outro' (para mostrar as instruções certas).
 * window.pwa.podeInstalar()→ true quando o navegador oferece o botão "Instalar" (Android/Chrome/Edge).
 * window.pwa.instalar()    → abre a janela de instalação do navegador.
 * Avisa as telas com o evento "pwa-mudou" para redesenhar.
 */
(function () {
  var pedido = null, espera = null, pediuAtualizar = false;
  function avisar() { try { window.dispatchEvent(new Event('pwa-mudou')); } catch (e) { } }

  window.pwa = {
    instalado: function () {
      return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
    },
    plataforma: function () {
      var ua = navigator.userAgent || '';
      if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
      if (/Android/i.test(ua)) return 'android';
      return 'outro';
    },
    podeInstalar: function () { return !!pedido; },
    instalar: function () {
      if (!pedido) return Promise.resolve(false);
      var p = pedido; pedido = null;
      p.prompt();
      return p.userChoice.then(function (r) { avisar(); return r && r.outcome === 'accepted'; });
    },
    atualizarAgora: function () {
      if (espera) { pediuAtualizar = true; espera.postMessage('atualizar'); return true; }
      return false;
    }
  };

  window.addEventListener('beforeinstallprompt', function (ev) { ev.preventDefault(); pedido = ev; avisar(); });
  window.addEventListener('appinstalled', function () { pedido = null; avisar(); });

  function mostrarNovaVersao(sw) {
    espera = sw;
    var b = document.getElementById('atualizar');
    if (!b) return;
    b.hidden = false;
    b.onclick = function () { b.disabled = true; pediuAtualizar = true; sw.postMessage('atualizar'); };
  }

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === '127.0.0.1' || location.hostname === 'localhost')) {
    // Só recarrega quando a pessoa pediu a versão nova (na primeira visita não há recarga).
    navigator.serviceWorker.addEventListener('controllerchange', function () { if (!pediuAtualizar) return; pediuAtualizar = false; location.reload(); });
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').then(function (reg) {
        if (reg.waiting && navigator.serviceWorker.controller) mostrarNovaVersao(reg.waiting);
        reg.addEventListener('updatefound', function () {
          var novo = reg.installing;
          if (!novo) return;
          novo.addEventListener('statechange', function () {
            if (novo.state === 'installed' && navigator.serviceWorker.controller) mostrarNovaVersao(novo);
          });
        });
        // Procura versão nova ao voltar para o app e a cada hora.
        document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') reg.update().catch(function () { }); });
        setInterval(function () { reg.update().catch(function () { }); }, 3600e3);
      }).catch(function () { /* sem service worker: o app funciona normalmente, só não fica guardado */ });
    });
  }
})();
