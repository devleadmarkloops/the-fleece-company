/*
 * theme-inline-body.js
 *
 * Extracted from layout/theme.liquid (CWV fix).
 *
 * Contém:
 *   - open_cart query param → abre mini-cart
 *   - Timer countdown (5min) em #timer-d5, só roda quando o elemento existe
 *   - checkout-btn-d5 click handler (inserir cozycare protection antes do checkout)
 *   - window.initOrderProtection / window.handleProtectionChange
 *   - Cleanup de protection no load quando há item de protection no cart
 *
 * Antes: ~135 linhas inline, síncronas, rodando em toda pageview.
 * Agora: carregado com defer, encapsulado em IIFE, setInterval só roda quando
 * há #timer-d5, e fetch /cart/change.js só dispara com key válida (>0).
 */

(function () {
  'use strict';

  // --- open_cart query param → abre mini-cart ---
  try {
    var params = new URLSearchParams(window.location.search);
    if (params.has('open_cart')) {
      var cleanUrl = new URL(window.location);
      cleanUrl.searchParams.delete('open_cart');
      window.history.replaceState({}, '', cleanUrl);

      var tryOpenMiniCart = function () {
        var miniCart = document.querySelector('mini-cart');
        if (miniCart && typeof miniCart.open === 'function') {
          miniCart.open();
        } else {
          setTimeout(tryOpenMiniCart, 150);
        }
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
          setTimeout(tryOpenMiniCart, 300);
        });
      } else {
        setTimeout(tryOpenMiniCart, 300);
      }
    }
  } catch (e) { /* noop */ }

  // --- Timer countdown (5min) em #timer-d5 ---
  // CWV FIX: só inicia quando o elemento existe; para quando ele sai do DOM.
  var TIMER_DURATION = 300; // segundos
  var timerInterval = null;
  var timerEndTime = null;

  window.initializeTimer = function () {
    var timerElement = document.getElementById('timer-d5');
    if (!timerElement) return; // não há timer nesta página → não inicia interval

    if (!timerEndTime || timerEndTime <= Date.now()) {
      timerEndTime = Date.now() + (TIMER_DURATION * 1000);
    }

    if (timerInterval) {
      clearInterval(timerInterval);
    }

    // CWV FIX: 1000ms (1s) em vez de 100ms — o timer exibe segundos,
    // 10 ticks por segundo era 10x mais trabalho do que necessário.
    timerInterval = setInterval(function () {
      var el = document.getElementById('timer-d5');
      if (!el) {
        // elemento saiu do DOM (navegação SPA) → limpa interval
        clearInterval(timerInterval);
        timerInterval = null;
        return;
      }
      var remaining = Math.max(0, timerEndTime - Date.now());
      var seconds = Math.ceil(remaining / 1000);

      if (seconds <= 0) {
        timerEndTime = Date.now() + (TIMER_DURATION * 1000);
      }

      var mins = Math.floor(seconds / 60);
      var secs = seconds % 60;
      el.textContent =
        String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
    }, 1000);
  };

  // --- checkout-btn-d5: inserir cozycare protection antes do checkout ---
  document.addEventListener('click', function (e) {
    var target = e.target;
    if (!target || !target.classList || !target.classList.contains('checkout-btn-d5')) return;

    var savedState = null;
    try { savedState = localStorage.getItem('cozycare_protection'); } catch (_) {}
    if (savedState !== 'true') return;

    var variantId = target.getAttribute('data-variant-id');
    if (!variantId) return;

    e.preventDefault();
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: 1 })
    })
      .then(function (r) { return r.json(); })
      .then(function () { window.location.href = '/checkout'; })
      .catch(function () { window.location.href = '/checkout'; });
  });

  // --- Order protection UI helpers ---
  window.initOrderProtection = function () {
    var toggle = document.getElementById('orderProtection');
    var subtotal = document.querySelector('.text-price-d5');
    if (!toggle) return;

    var savedState = null;
    try { savedState = localStorage.getItem('cozycare_protection'); } catch (_) {}

    if (savedState === 'true') {
      toggle.checked = true;
      if (subtotal) subtotal.textContent = subtotal.getAttribute('data-checked-price');
    } else if (subtotal) {
      subtotal.textContent = subtotal.getAttribute('data-unchecked-price');
    }
  };

  window.handleProtectionChange = function (toggle) {
    var subtotal = document.querySelector('.text-price-d5');
    if (!toggle || toggle.checked === undefined || !subtotal) return;

    subtotal.textContent = toggle.checked
      ? subtotal.getAttribute('data-checked-price')
      : subtotal.getAttribute('data-unchecked-price');

    try {
      localStorage.setItem('cozycare_protection', toggle.checked.toString());
    } catch (_) { /* noop */ }
  };

  // --- Cleanup inicial: remove item de protection antigo do cart ---
  // CWV FIX: antes disparava fetch em TODA pageview mesmo sem protection
  // (key=NaN → 422). Agora só dispara se data-key é número válido (>0).
  function cleanupProtectionItem() {
    var el = document.querySelector('.remove-protection-d5');
    if (!el) return;
    var raw = el.getAttribute('data-key');
    var key = parseInt(raw, 10);
    if (!key || key <= 0) return;

    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line: key, quantity: 0 })
    }).catch(function (err) {
      console.error('Error removing protection item:', err);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanupProtectionItem);
  } else {
    cleanupProtectionItem();
  }
})();
