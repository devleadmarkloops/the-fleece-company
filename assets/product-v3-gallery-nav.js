/*
 * product-v3-gallery-nav.js
 *
 * Extraído de snippets/product-v3-gallery.liquid (CWV / Forced Reflow fix).
 *
 * O que faz:
 *   - Touch swipe (touchstart/touchend) na galeria → next/prev
 *   - Click handler para slider-button next/prev (delegação no <media-gallery>)
 *   - Sincronização do estado dos botões (opacity/cursor) com o thumbnail ativo
 *   - MutationObserver: re-avalia o estado quando classes/atributos da galeria mudam
 *
 * Por que extrair?
 *   1. O script estava INLINE em toda PDP, parseado a cada page render
 *   2. A função updateUI lia layout (offsetHeight implícito via querySelectorAll +
 *      style write logo após) — Forced Reflow listado pelo Lighthouse
 *   3. Inline + DOMContentLoaded bloqueava o main thread perto do FCP
 *
 * Como?
 *   - Carregado com `defer` no fim do snippet → roda depois do parse, antes de window.load
 *   - Usa requestAnimationFrame para coalescer atualizações de estado e evitar reflow forçado
 *   - Auto-detecta a galeria via data-attribute (não depende mais de section.id hardcoded)
 *   - Suporta múltiplas galerias por página (caso raro mas defensivo)
 */

(function () {
  'use strict';

  function initGalleryNav(gallery) {
    if (!gallery || gallery._navInitialized) return;
    gallery._navInitialized = true;

    var sectionId = gallery.getAttribute('data-section-id');
    var slidesSelector = sectionId
      ? '#Slider-Gallery-' + CSS.escape(sectionId) + ' .product__media-item'
      : '.product__media-list .product__media-item';

    function getValidSibling(li, direction) {
      var sibling = direction === 'next' ? li.nextElementSibling : li.previousElementSibling;
      while (sibling) {
        if (
          sibling.style.display !== 'none' &&
          !sibling.classList.contains('visually-hidden') &&
          !sibling.hasAttribute('hidden')
        ) {
          return sibling;
        }
        sibling = direction === 'next' ? sibling.nextElementSibling : sibling.previousElementSibling;
      }
      return null;
    }

    function navigateGallery(direction) {
      var activeThumbBtn = gallery.querySelector('.thumbnail-list__item button[aria-current="true"]');
      if (!activeThumbBtn) return;

      var currentLi = activeThumbBtn.closest('.thumbnail-list__item');
      var targetLi = getValidSibling(currentLi, direction);
      if (targetLi) {
        var btnToClick = targetLi.querySelector('button');
        if (btnToClick) btnToClick.click();
      }
    }

    // ---- Click delegation (only on the gallery slider buttons) ----
    gallery.addEventListener(
      'click',
      function (e) {
        var btn = e.target.closest('.slider-button');
        if (!btn || !btn.closest('product-gallery')) return;

        e.preventDefault();
        e.stopPropagation();

        if (btn.style.cursor === 'not-allowed') return;

        if (btn.classList.contains('slider-button--next') || btn.name === 'next') {
          navigateGallery('next');
        } else if (btn.classList.contains('slider-button--prev') || btn.name === 'previous') {
          navigateGallery('prev');
        }
      },
      true
    );

    // ---- Touch swipe ----
    var touchStartX = 0;
    var touchStartY = 0;

    gallery.addEventListener(
      'touchstart',
      function (e) {
        if (!e.target.closest('.product__media-item')) return;
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      },
      { passive: true }
    );

    gallery.addEventListener(
      'touchend',
      function (e) {
        if (!e.target.closest('.product__media-item')) return;
        var touchEndX = e.changedTouches[0].screenX;
        var touchEndY = e.changedTouches[0].screenY;
        var deltaX = touchStartX - touchEndX;
        var deltaY = touchStartY - touchEndY;
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
          navigateGallery(deltaX > 0 ? 'next' : 'prev');
        }
      },
      { passive: true }
    );

    // ---- UI sync: button opacity/cursor based on thumbnail neighbors ----
    // CWV FIX: rAF-coalesced para evitar Forced Reflow. Antes era setTimeout 50ms
    // disparado a cada mutation → várias leituras de layout enfileiradas.
    var uiUpdatePending = false;
    function scheduleUpdateUI() {
      if (uiUpdatePending) return;
      uiUpdatePending = true;
      requestAnimationFrame(function () {
        uiUpdatePending = false;
        updateUI();
      });
    }

    // ---- Sync slider container height to active slide (mobile only) ----
    // Problema: cada slide tem `aspect-ratio` inline com a proporção natural da
    // imagem. Todos os slides ficam empilhados na mesma grid-area ("stack") e
    // a célula do grid tem a altura do slide mais alto — deixando espaço em
    // branco quando o slide ativo é mais "largo" que os demais.
    //
    // Solução para slider--fade (display:grid + overflow:visible!important):
    //   Colapsar os slides não-ativos para height:0 para que não inflem a
    //   célula do grid. O slide ativo determina a altura livremente.
    //
    // Solução para slider horizontal (sem slider--fade):
    //   Aplicar o aspect-ratio do slide ativo no container (ul) com
    //   overflow-y:hidden para clicar os slides mais altos.
    function syncGalleryHeight() {
      var mediaList = gallery.querySelector('.product__media-list');
      if (!mediaList) return;

      // Em desktop limpa overrides e sai
      if (window.matchMedia('(min-width: 750px)').matches) {
        mediaList.style.aspectRatio = '';
        mediaList.style.overflowY = '';
        var slidesClean = mediaList.querySelectorAll('.slider__slide');
        for (var k = 0; k < slidesClean.length; k++) {
          slidesClean[k].style.height = '';
          slidesClean[k].style.overflow = '';
        }
        return;
      }

      var isFade = mediaList.classList.contains('slider--fade');
      var activeSlide = mediaList.querySelector('.product__media-item.is-active');
      if (!activeSlide) return;

      var wrapper = activeSlide.querySelector('[style*="aspect-ratio"]');
      if (!wrapper) return;

      var styleStr = wrapper.getAttribute('style') || '';
      var match = styleStr.match(/aspect-ratio\s*:\s*([\d.]+)/i);
      if (!match) return;

      var ratio = parseFloat(match[1]);
      if (!ratio || ratio <= 0) return;

      if (isFade) {
        // slider--fade usa display:grid + overflow:visible!important →
        // overflow-y:hidden seria anulado. Colapsamos os slides não-ativos
        // para que não inflem a célula do grid.
        var slides = mediaList.querySelectorAll('.slider__slide');
        for (var i = 0; i < slides.length; i++) {
          if (slides[i].classList.contains('is-active')) {
            slides[i].style.height = '';
            slides[i].style.overflow = '';
          } else {
            slides[i].style.height = '0';
            slides[i].style.overflow = 'hidden';
          }
        }
      } else {
        // Slider horizontal padrão
        mediaList.style.aspectRatio = String(ratio);
        mediaList.style.overflowY = 'hidden';
      }
    }

    function updateUI() {
      var buttonsWrapper = gallery.querySelector('product-gallery .slider-buttons');
      if (!buttonsWrapper) return;

      var allSlides = gallery.querySelectorAll(slidesSelector);
      if (!allSlides.length) return;

      var nextBtn = gallery.querySelector('product-gallery .slider-button--next');
      var prevBtn = gallery.querySelector('product-gallery .slider-button--prev');
      var activeThumbBtn = gallery.querySelector('.thumbnail-list__item button[aria-current="true"]');

      var validSlides = 0;
      for (var i = 0; i < allSlides.length; i++) {
        var slide = allSlides[i];
        if (
          slide.style.display !== 'none' &&
          !slide.classList.contains('visually-hidden') &&
          !slide.hasAttribute('hidden')
        ) {
          validSlides++;
        }
      }

      // Batched writes (no read between them → no forced reflow):
      buttonsWrapper.style.display = validSlides <= 1 ? 'none' : '';

      if (activeThumbBtn && nextBtn && prevBtn) {
        var currentLi = activeThumbBtn.closest('.thumbnail-list__item');
        var hasNext = !!getValidSibling(currentLi, 'next');
        var hasPrev = !!getValidSibling(currentLi, 'prev');

        nextBtn.disabled = false;
        nextBtn.removeAttribute('disabled');
        prevBtn.disabled = false;
        prevBtn.removeAttribute('disabled');

        nextBtn.style.opacity = hasNext ? '1' : '0.3';
        nextBtn.style.cursor = hasNext ? 'pointer' : 'not-allowed';

        prevBtn.style.opacity = hasPrev ? '1' : '0.3';
        prevBtn.style.cursor = hasPrev ? 'pointer' : 'not-allowed';
      }

      // Ajusta a altura do container ao slide ativo (elimina espaço em branco)
      syncGalleryHeight();
    }

    // First paint: schedule after layout settles
    scheduleUpdateUI();

    // React to DOM mutations (variant changes etc.)
    var observer = new MutationObserver(scheduleUpdateUI);
    observer.observe(gallery, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'hidden', 'disabled', 'aria-current'],
    });
  }

  function initAll() {
    var galleries = document.querySelectorAll('media-gallery[data-gallery-nav]');
    for (var i = 0; i < galleries.length; i++) {
      initGalleryNav(galleries[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
