/**
 * chamarServidor(acao, dados, opcoes) → Promise com os dados da resposta.
 * Única porta de saída das telas para o servidor (Apps Script).
 *
 *  - Envia POST com texto JSON (sem cabeçalhos especiais, para o navegador não bloquear).
 *  - Mostra a barra de carregamento enquanto espera.
 *  - Ações que gravam levam um idEnvio: se a internet cair e o pedido for reenviado,
 *    o servidor não grava duas vezes.
 *  - Em caso de erro, rejeita com { codigo, mensagem } (mensagem pronta para mostrar).
 *
 *  opcoes.grava = true   → gera idEnvio e reenvia uma vez se a conexão falhar.
 *  opcoes.silencioso     → não mostra a barra de carregamento.
 */
(function () {
  'use strict';
  var C = window.APP_CONFIG || {};
  var CHAVE_TOKEN = 'marapendi.token.' + (C.ambiente || 'X');
  var pendentes = 0, timerCarga = null;

  function lerToken() { try { return localStorage.getItem(CHAVE_TOKEN) || ''; } catch (e) { return ''; } }
  window.salvarToken = function (t) { try { localStorage.setItem(CHAVE_TOKEN, t); } catch (e) {} };
  window.apagarToken = function () { try { localStorage.removeItem(CHAVE_TOKEN); } catch (e) {} };

  function carregando(delta) {
    pendentes = Math.max(0, pendentes + delta);
    var el = document.getElementById('carregando');
    if (!el) return;
    clearTimeout(timerCarga);
    if (pendentes > 0) timerCarga = setTimeout(function () { el.hidden = false; }, 300);
    else el.hidden = true;
  }

  function mostrarAtualizar() {
    var b = document.getElementById('atualizar');
    if (!b) return;
    b.hidden = false;
    b.onclick = function () { location.reload(); };
  }
  window.mostrarAtualizar = mostrarAtualizar;

  function novoIdEnvio() { return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10); }

  function enviar(corpo) {
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var limite = setTimeout(function () { if (ctrl) ctrl.abort(); }, C.tempoLimiteMs || 30000);
    return fetch(C.servidor, { method: 'POST', body: JSON.stringify(corpo), redirect: 'follow', signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) {
        if (!r.ok) throw { codigo: 'HTTP_' + r.status, mensagem: 'O servidor não respondeu (erro ' + r.status + '). Tente de novo.' };
        return r.json().catch(function () { throw { codigo: 'RESPOSTA_INVALIDA', mensagem: 'O servidor respondeu de um jeito inesperado. Tente de novo.' }; });
      }, function (err) {
        throw { codigo: 'SEM_CONEXAO', rede: true, mensagem: err && err.name === 'AbortError'
          ? 'O servidor demorou para responder. Confira a internet e tente de novo.'
          : 'Não foi possível falar com o servidor. Confira a internet e tente de novo.' };
      })
      .finally(function () { clearTimeout(limite); });
  }

  window.chamarServidor = function (acao, dados, opcoes) {
    opcoes = opcoes || {};
    if (!C.servidor) return Promise.reject({ codigo: 'SEM_CONFIG', mensagem: 'Endereço do servidor não configurado.' });
    var corpo = { acao: acao, token: lerToken(), dados: dados || {}, versao: C.versao };
    if (opcoes.grava) corpo.idEnvio = opcoes.idEnvio || novoIdEnvio();
    if (!opcoes.silencioso) carregando(+1);
    var tentativa = enviar(corpo).catch(function (e) {
      if (!e.rede) throw e;                       // só reenvia quando a conexão falhou
      return new Promise(function (ok) { setTimeout(ok, 1500); }).then(function () { return enviar(corpo); });
    });
    return tentativa.then(function (res) {
      if (res && res.ok) return res.dados;
      var e = (res && res.erro) || { codigo: 'DESCONHECIDO', mensagem: 'Algo deu errado. Tente de novo.' };
      if (e.codigo === 'ATUALIZAR') mostrarAtualizar();
      if (e.codigo === 'SEM_SESSAO') { window.apagarToken(); if (typeof window.aoPerderSessao === 'function') window.aoPerderSessao(e.mensagem); }
      throw e;
    }).finally(function () { if (!opcoes.silencioso) carregando(-1); });
  };
})();
