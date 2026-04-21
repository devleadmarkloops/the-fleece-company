/**
 * Cart Upsell JavaScript
 * Handles variant selection changes and Add to Cart for upsell products
 * Uses event delegation so it works with dynamically injected cart drawer content
 */

(function() {
  'use strict';

  // Use event delegation on the document body so it works with AJAX-injected content
  document.addEventListener('change', function(e) {
    if (e.target && e.target.matches('[data-upsell-variant-select]')) {
      var productBlock = e.target.closest('.cart-upsell__product');
      var addBtn = productBlock ? productBlock.querySelector('[data-upsell-add-to-cart]') : null;
      if (addBtn) {
        addBtn.setAttribute('data-variant-id', e.target.value);
      }
    }
  });

  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-upsell-add-to-cart]');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    var variantId = btn.getAttribute('data-variant-id');
    if (!variantId) {
      console.error('Cart Upsell: No variant ID found on button');
      return;
    }

    var originalText = btn.textContent.trim();
    btn.classList.add('loading');
    btn.textContent = 'Adding...';
    btn.disabled = true;

    var miniCart = document.querySelector('mini-cart');
    var sections = [];
    if (miniCart && typeof miniCart.getSectionsToRender === 'function') {
      sections = miniCart.getSectionsToRender().map(function(section) { return section.id; });
    }

    var body = JSON.stringify({
      id: parseInt(variantId),
      quantity: 1,
      sections: sections,
      sections_url: window.location.pathname
    });

    fetch(window.Shopify && window.Shopify.routes ? window.Shopify.routes.root + 'cart/add.js' : '/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: body
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.status);
      }
      return response.json();
    })
    .then(function(parsedState) {
      if (parsedState.status === 422) {
        btn.textContent = parsedState.description || 'Error';
        setTimeout(function() {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.classList.remove('loading');
        }, 2000);
        return;
      }

      // If sections were returned, render them
      if (miniCart && parsedState.sections) {
        miniCart.renderContents(parsedState);
      } else {
        // Fallback: reload the cart drawer by fetching the mini-cart section
        fetch(window.location.pathname + '?sections=mini-cart,cart-icon-bubble,mobile-cart-icon-bubble')
          .then(function(r) { return r.json(); })
          .then(function(sections) {
            var miniCartEl = document.getElementById('mini-cart');
            if (miniCartEl && sections['mini-cart']) {
              var parser = new DOMParser();
              var doc = parser.parseFromString(sections['mini-cart'], 'text/html');
              var newContent = doc.querySelector('.shopify-section');
              if (newContent) {
                miniCartEl.innerHTML = newContent.innerHTML;
              }
            }
            var cartBubble = document.getElementById('cart-icon-bubble');
            if (cartBubble && sections['cart-icon-bubble']) {
              var parser2 = new DOMParser();
              var doc2 = parser2.parseFromString(sections['cart-icon-bubble'], 'text/html');
              var newBubble = doc2.querySelector('.shopify-section');
              if (newBubble) {
                cartBubble.innerHTML = newBubble.innerHTML;
              }
            }
          })
          .catch(function(err) { console.error('Cart section refresh error:', err); });
      }

      document.dispatchEvent(new CustomEvent('ajaxProduct:added', {
        detail: { product: parsedState }
      }));
    })
    .catch(function(error) {
      console.error('Cart Upsell: Add to cart error:', error);
      btn.textContent = originalText;
      btn.disabled = false;
      btn.classList.remove('loading');
    });
  });

  // Keep a dummy initCartUpsell for backward compatibility
  window.initCartUpsell = function() {};
})();
