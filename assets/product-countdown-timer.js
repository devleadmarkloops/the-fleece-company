/*
 * product-countdown-timer.js
 *
 * Etapa 2 — F6: extraído de snippets/product-v3-block-countdown-timer.liquid
 * para eliminar <script> inline duplicado por bloco.
 *
 * Comportamento idêntico ao inline anterior: para cada .countdown-timer na
 * página, calcula a diferença até a próxima meia-noite local do visitante
 * e atualiza os 4 dígitos (dias/horas/minutos/segundos) a cada segundo.
 *
 * Funciona com múltiplas instâncias e é resiliente a shopify:section:load
 * (usado pelo theme editor) — re-inicializa observando novos containers.
 */
(function () {
  'use strict';

  var INITIALIZED_FLAG = '__countdownInited';

  function pad(num) {
    return String(num).padStart(2, '0');
  }

  function nextLocalMidnight() {
    var now = new Date();
    var target = new Date(now);
    target.setHours(24, 0, 0, 0);
    return target;
  }

  function startTimer(container) {
    if (container[INITIALIZED_FLAG]) return;
    container[INITIALIZED_FLAG] = true;

    var daysEl = container.querySelector('[data-unit="days"]');
    var hoursEl = container.querySelector('[data-unit="hours"]');
    var minutesEl = container.querySelector('[data-unit="mins"]');
    var secondsEl = container.querySelector('[data-unit="seconds"]');

    var target = nextLocalMidnight();

    function tick() {
      var now = new Date();
      if (now >= target) target = nextLocalMidnight();
      var diff = target - now;
      if (diff < 0) diff = 0;
      var total = Math.floor(diff / 1000);
      var days = Math.floor(total / 86400);
      var hours = Math.floor((total % 86400) / 3600);
      var minutes = Math.floor((total % 3600) / 60);
      var seconds = total % 60;
      if (daysEl) daysEl.textContent = pad(days);
      if (hoursEl) hoursEl.textContent = pad(hours);
      if (minutesEl) minutesEl.textContent = pad(minutes);
      if (secondsEl) secondsEl.textContent = pad(seconds);
    }

    tick();
    setInterval(tick, 1000);
  }

  function initAll() {
    document.querySelectorAll('.countdown-timer').forEach(startTimer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Theme editor hooks
  if (typeof Shopify !== 'undefined' && Shopify.designMode) {
    document.addEventListener('shopify:section:load', initAll);
    document.addEventListener('shopify:block:select', initAll);
  }
})();
