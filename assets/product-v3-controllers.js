/*
 * product-v3-controllers.js
 *
 * Etapa 2 — F4: consolida em um único arquivo externo (carregado via
 * <script defer>) a maior parte dos scripts inline que originalmente
 * viviam no fim de main-product-v2.liquid / main-product-v3.liquid.
 *
 * Responsabilidades (cada init* é independente e idempotente):
 *   1. Sincronização do Sticky Cart com o botão Add to Cart principal.
 *      Origem: snippets/product-v3-footer-scripts.liquid (bloco 1).
 *   2. Handler do upsell complementar (#com-form-d5 / .com-options-d5).
 *      Origem: snippets/product-v3-footer-scripts.liquid (bloco 2).
 *   3. `window.reinitThumbnailClicks` + MutationObserver do botão "next"
 *      da galeria thumbnail_slider.
 *      Origem: snippets/product-v3-footer-scripts.liquid (bloco 3).
 *   4. Sticky Cart Footer Spacer — cria/atualiza um spacer no footer para
 *      compensar a altura do sticky cart.
 *      Origem: snippets/product-v3-footer-scripts.liquid (bloco 4).
 *   5. Donation info popup (click-delegation em document).
 *      Origem: snippets/product-v3-outer-scripts.liquid (bloco 1).
 *   6. Kaching Bundles <-> Sticky Cart sync (precisa de section-id).
 *      Origem: snippets/product-v3-outer-scripts.liquid (bloco 2).
 *
 * Dependência de dados: o elemento <product-info data-section="..."> já
 * emitido pelo snippet head-assets é a fonte da section id — não é mais
 * necessário interpolar {{ section.id }} no JS.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* 1. Sticky cart <-> main form button sync                            */
  /* ------------------------------------------------------------------ */
  function initStickyCartSync(sectionId) {
    var mainForm = document.getElementById('product-form-' + sectionId);
    var stickyBtn = document.querySelector('.sticky-trigger-btn');
    var stickyText = stickyBtn ? stickyBtn.querySelector('.sticky-btn-text') : null;
    if (!mainForm || !stickyBtn || !stickyText) return;

    stickyBtn.addEventListener('click', function () {
      var mainBtn = mainForm.querySelector('button[type=submit][name=add]');
      if (!mainBtn || mainBtn.disabled) return;
      stickyBtn.classList.add('is-loading');
      stickyBtn.disabled = true;
      mainBtn.click();
    });

    // Hook fetch only once, even if multiple sections call init.
    if (!window.__fleeceStickyFetchPatched) {
      window.__fleeceStickyFetchPatched = true;
      var origFetch = window.fetch;
      window.fetch = function () {
        var args = arguments;
        var promise = origFetch.apply(this, args);
        var url = args[0];
        if (url && typeof url === 'string' && url.indexOf('/cart/add') !== -1) {
          promise.finally(function () {
            document.querySelectorAll('.sticky-trigger-btn').forEach(function (btn) {
              btn.classList.remove('is-loading');
              btn.disabled = false;
            });
          });
        }
        return promise;
      };
    }

    var observer = new MutationObserver(function () {
      var mainBtn = mainForm.querySelector('button[type=submit][name=add]');
      if (!mainBtn) return;
      if (!stickyBtn.classList.contains('is-loading')) {
        stickyBtn.disabled = mainBtn.disabled;
      }
    });
    observer.observe(mainForm, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled'],
    });
  }

  /* ------------------------------------------------------------------ */
  /* 2. Complementary upsell option matcher (#com-form-d5)               */
  /* ------------------------------------------------------------------ */
  function initComplementaryUpsell() {
    if (window.__fleeceComUpsellBound) return;
    window.__fleeceComUpsellBound = true;

    document.body.addEventListener('change', function (e) {
      if (!e.target.classList || !e.target.classList.contains('com-options-d5')) return;
      var form = document.querySelector('#com-form-d5');
      var img = document.querySelector('.upsell-img-d5');
      if (!form) return;
      var optionSelects = document.querySelectorAll('.com-options-d5');
      var variantData = form.querySelector('.com-variant-data-d5');
      var variantIdInput = form.querySelector("input[name='id']");
      if (!variantData || !variantIdInput) return;

      var selectedValues = Array.prototype.map.call(optionSelects, function (sel) {
        return sel.options[sel.selectedIndex].text.trim();
      });
      var joined = selectedValues.join(' / ').replace(/\s+/g, '');
      var matched = Array.prototype.find.call(variantData.options, function (opt) {
        return opt.textContent.replace(/\s+/g, '') === joined;
      });

      var btn = form.querySelector('button');
      if (btn) {
        btn.classList.remove('disable');
        btn.textContent = 'Add';
      }
      if (matched) {
        variantIdInput.value = matched.value;
        if (img && matched.hasAttribute('img')) {
          img.src = '';
          img.src = matched.getAttribute('img');
        }
        if (matched.hasAttribute('sold') && btn) {
          btn.classList.add('disable');
          btn.textContent = 'Sold';
        }
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 3. Thumbnail slider re-init + next button watchdog                  */
  /* ------------------------------------------------------------------ */
  function initThumbnailHelpers() {
    window.reinitThumbnailClicks = function () {
      document.querySelectorAll('media-gallery').forEach(function (gallery) {
        if (!gallery.elements || !gallery.elements.thumbnails) return;
        var thumbnails = gallery.elements.thumbnails;
        thumbnails.querySelectorAll('[data-target]').forEach(function (item) {
          var button = item.querySelector('button');
          if (!button) return;
          var newButton = button.cloneNode(true);
          button.replaceWith(newButton);
          newButton.addEventListener(
            'click',
            gallery.setActiveMedia.bind(gallery, item.dataset.target, false, true)
          );
        });
      });
    };

    var nextBtn = document.querySelector('thumbnail-slider .slider-button.slider-button--next');
    if (nextBtn) {
      var observer = new MutationObserver(function () {
        if (nextBtn.hasAttribute('disabled')) {
          nextBtn.removeAttribute('disabled');
        }
      });
      observer.observe(nextBtn, { attributes: true, attributeFilter: ['disabled', 'class'] });
    }
  }

  /* ------------------------------------------------------------------ */
  /* 4. Sticky cart footer spacer                                        */
  /* ------------------------------------------------------------------ */
  function initStickyCartSpacer() {
    var STICKY_CART_SELECTOR = '.sticky-cart-wrapper';
    var FOOTER_SELECTOR = 'footer, .footer, [role="contentinfo"]';
    var SPACER_ID = 'sticky-cart-footer-spacer';
    var TRANSITION_DURATION = 300;

    var stickyCart = null;
    var footer = null;
    var spacer = null;
    var resizeTimeout = null;

    function setup() {
      stickyCart = document.querySelector(STICKY_CART_SELECTOR);
      footer = document.querySelector(FOOTER_SELECTOR);
      if (!stickyCart || !footer) {
        setTimeout(setup, 500);
        return;
      }
      createSpacer();
      observeStickyCart();
      handleResize();
      updateSpacerHeight();
    }

    function createSpacer() {
      var existing = document.getElementById(SPACER_ID);
      if (existing) existing.remove();
      spacer = document.createElement('div');
      spacer.id = SPACER_ID;
      spacer.style.cssText =
        'height: 0px;' +
        'transition: height ' + TRANSITION_DURATION + 'ms ease-in-out;' +
        'width: 100%;' +
        'display: block !important;' +
        'visibility: visible !important;' +
        'opacity: 1 !important;';
      footer.appendChild(spacer);
    }

    function observeStickyCart() {
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          if (m.type === 'attributes' && m.attributeName === 'class') {
            updateSpacerHeight();
          }
        });
      });
      observer.observe(stickyCart, { attributes: true, attributeFilter: ['class', 'style'] });

      var inner = stickyCart.querySelector('.product-sticky-cart, .sticky-cart');
      if (inner) {
        var innerObserver = new MutationObserver(updateSpacerHeight);
        innerObserver.observe(inner, { attributes: true, childList: true, subtree: true });
      }

      var io = new IntersectionObserver(function () { updateSpacerHeight(); }, {
        threshold: [0, 0.1, 0.5, 0.9, 1],
      });
      io.observe(stickyCart);

      var scrollTimeout;
      window.addEventListener(
        'scroll',
        function () {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(updateSpacerHeight, 50);
        },
        { passive: true }
      );
    }

    function updateSpacerHeight() {
      if (!stickyCart || !spacer) return;
      spacer.style.display = 'block';
      spacer.style.visibility = 'visible';
      spacer.style.opacity = '1';
      var inner = stickyCart.querySelector('.product-sticky-cart, .sticky-cart');
      if (!inner) { spacer.style.height = '0px'; return; }
      var innerHeight = inner.offsetHeight;
      var innerStyle = window.getComputedStyle(inner);
      var isVisible = innerHeight > 0 && innerStyle.display !== 'none';
      if (isVisible) {
        var wrapperStyles = window.getComputedStyle(stickyCart);
        var marginTop = parseInt(wrapperStyles.marginTop) || 0;
        var marginBottom = parseInt(wrapperStyles.marginBottom) || 0;
        spacer.style.height = innerHeight + marginTop + marginBottom + 'px';
      } else {
        spacer.style.height = '0px';
      }
    }

    function handleResize() {
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateSpacerHeight, 150);
      });
    }

    window.updateStickyCartSpacer = function () { updateSpacerHeight(); };
    setup();
  }

  /* ------------------------------------------------------------------ */
  /* 5. Donation popup (delegated click)                                 */
  /* ------------------------------------------------------------------ */
  function initDonationPopup() {
    if (window.__fleeceDonationBound) return;
    window.__fleeceDonationBound = true;

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-donation-info]');
      if (trigger) {
        e.stopPropagation();
        var id = trigger.getAttribute('data-donation-info');
        var popup = document.getElementById('donation-info-' + id);
        if (popup) {
          document.querySelectorAll('.donation-info-popup').forEach(function (p) {
            if (p !== popup) p.style.display = 'none';
          });
          popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
        }
        return;
      }
      var closeBtn = e.target.closest('[data-donation-close]');
      if (closeBtn) {
        var cid = closeBtn.getAttribute('data-donation-close');
        var closeTarget = document.getElementById('donation-info-' + cid);
        if (closeTarget) closeTarget.style.display = 'none';
        return;
      }
      // Click outside closes all
      document.querySelectorAll('.donation-info-popup').forEach(function (p) {
        p.style.display = 'none';
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 6. Kaching Bundles <-> Sticky Cart sync                             */
  /* ------------------------------------------------------------------ */
  function initKachingStickySync(sectionId) {
    var kachingBars = document.querySelector('.kaching-bundles__bars');
    if (!kachingBars) return;
    var stickyPriceContainer = document.querySelector('#Price-Alt-' + sectionId);
    var stickyBtnText = document.querySelector('.sticky-btn-text');
    if (!stickyPriceContainer || !stickyBtnText) return;

    var originalPriceHTML = stickyPriceContainer.innerHTML;

    function getSelectedDeal() {
      var selectedBar = kachingBars.querySelector('.kaching-bundles__bar--selected');
      if (!selectedBar) return null;
      var title = selectedBar.querySelector('.kaching-bundles__bar-title');
      var price = selectedBar.querySelector('.kaching-bundles__bar-price');
      var fullPrice = selectedBar.querySelector('.kaching-bundles__bar-full-price');
      var badge = selectedBar.querySelector('.kaching-bundles__bar-most-popular__content');
      return {
        title: title ? title.textContent.trim() : '',
        price: price ? price.textContent.trim() : '',
        fullPrice: fullPrice ? fullPrice.textContent.trim() : '',
        badge: badge ? badge.textContent.trim() : '',
      };
    }

    function updateStickyCart() {
      var deal = getSelectedDeal();
      if (!deal || !deal.price) {
        stickyPriceContainer.innerHTML = originalPriceHTML;
        return;
      }
      var html =
        '<div class="price" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">' +
        '<span class="price-item price-item--sale" style="font-weight:700;">' + deal.price + '</span>';
      if (deal.fullPrice) {
        html += '<s class="price-item price-item--regular" style="opacity:.6;text-decoration:line-through;">' + deal.fullPrice + '</s>';
      }
      html += '</div>';
      html += '<span class="sticky-bundle-label" style="font-size:11px;line-height:1.2;color:var(--color-foreground);opacity:.75;display:block;margin-top:2px;">' + deal.title + '</span>';
      stickyPriceContainer.innerHTML = html;
    }

    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if ((m.type === 'attributes' && (m.attributeName === 'class' || m.attributeName === 'style')) || m.type === 'childList') {
          requestAnimationFrame(updateStickyCart);
          break;
        }
      }
    });
    observer.observe(kachingBars, {
      childList: true, subtree: true, attributes: true,
      attributeFilter: ['class', 'style'],
    });

    kachingBars.addEventListener('change', function (e) {
      if (e.target && e.target.type === 'radio' && e.target.name && e.target.name.indexOf('kaching-bundles-deal') === 0) {
        setTimeout(updateStickyCart, 100);
      }
    });

    setTimeout(updateStickyCart, 500);
  }

  function waitForKachingAndInit(sectionId) {
    var attempts = 0;
    var timer = setInterval(function () {
      attempts++;
      if (document.querySelector('.kaching-bundles__bars')) {
        clearInterval(timer);
        initKachingStickySync(sectionId);
      }
      if (attempts > 50) clearInterval(timer);
    }, 100);
  }

  /* ------------------------------------------------------------------ */
  /* Bootstrap                                                           */
  /* ------------------------------------------------------------------ */
  function boot() {
    var productInfo = document.querySelector('product-info[data-section]');
    var sectionId = productInfo ? productInfo.getAttribute('data-section') : '';

    initComplementaryUpsell();
    initThumbnailHelpers();
    initStickyCartSpacer();
    initDonationPopup();

    if (sectionId) {
      initStickyCartSync(sectionId);
      waitForKachingAndInit(sectionId);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
