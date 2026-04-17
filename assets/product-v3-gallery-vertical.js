/*
 * product-v3-gallery-vertical.js
 *
 * Extraído de snippets/product-v3-head-assets.liquid (Etapa 2 — F3) para:
 *   - eliminar JS inline no <head> (render-blocking / parsing cost)
 *   - ser carregado via <script defer> apenas quando o layout de galeria
 *     vertical_slider estiver em uso (condicional no parent section).
 *
 * Responsabilidade:
 *   1. Ajustar maxHeight da thumbnail-list para coincidir com a altura do
 *      componente principal <use-animate> via ResizeObserver.
 *   2. Permitir drag-scroll vertical da thumbnail-list em desktop (>=750px).
 *
 * Idempotente: uma única execução por entry em DOMContentLoaded / defer.
 */
(function () {
  'use strict';

  function init() {
    var galleries = document.querySelectorAll('media-gallery[data-desktop-layout="vertical_slider"]');
    if (!galleries.length) return;

    galleries.forEach(function (gallery) {
      var mainMedia = gallery.querySelector('use-animate');
      var thumbList = gallery.querySelector('.thumbnail-list');
      if (!mainMedia || !thumbList) return;

      if (typeof ResizeObserver !== 'undefined') {
        var ro = new ResizeObserver(function (entries) {
          for (var i = 0; i < entries.length; i++) {
            thumbList.style.maxHeight = entries[i].contentRect.height + 'px';
          }
        });
        ro.observe(mainMedia);
      }

      var isDown = false;
      var startY = 0;
      var scrollTop = 0;

      thumbList.addEventListener('mousedown', function (e) {
        if (window.innerWidth < 750) return;
        isDown = true;
        thumbList.classList.add('is-dragging');
        startY = e.pageY - thumbList.offsetTop;
        scrollTop = thumbList.scrollTop;
      });

      thumbList.addEventListener('mouseleave', function () {
        if (window.innerWidth < 750) return;
        isDown = false;
        thumbList.classList.remove('is-dragging');
      });

      thumbList.addEventListener('mouseup', function () {
        if (window.innerWidth < 750) return;
        isDown = false;
        thumbList.classList.remove('is-dragging');
      });

      thumbList.addEventListener('mousemove', function (e) {
        if (!isDown || window.innerWidth < 750) return;
        e.preventDefault();
        var y = e.pageY - thumbList.offsetTop;
        var walk = (y - startY) * 2;
        thumbList.scrollTop = scrollTop - walk;
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
