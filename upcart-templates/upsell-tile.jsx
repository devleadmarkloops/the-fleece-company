<div
  className="upcart-internal-component-upsell-tile upcart-public-component-upsell-tile cart-upsell__product fc-upsell-tile"
  data-internal-properties={`addLoading=${props.addLoading};productId=${props.productId};hasMultipleVariants=${props.variantOptions && props.variantOptions.length > 1}`}
>
  <div className="cart-upsell__product-inner">
    <div className="cart-upsell__image">
      <a href={props.itemUrl || '#'}>
        {props.imageUrl ? (
          <img
            src={props.imageUrl}
            alt={props.altText || props.productTitle || ''}
            width={80}
            height={80}
            loading="lazy"
          />
        ) : (
          <></>
        )}
      </a>
    </div>

    <div className="cart-upsell__details">
      <div className="cart-upsell__header">
        <a href={props.itemUrl || '#'} className="cart-upsell__title">
          {props.productTitle}
        </a>
        <div className="cart-upsell__price">
          <span
            className="cart-upsell__current-price"
            dangerouslySetInnerHTML={{ __html: props.newPrice }}
            data-upcart-chunk="upsell-new-price"
          />
        </div>
      </div>

      <div className="cart-upsell__row-variants">
        <div className="cart-upsell__variants-wrapper">
          {props.variantOptions && props.variantOptions.length > 1 && (() => {
            /* ── Color map ────────────────────────────────────────────────── */
            var COLOR_MAP = {
              'Vanilla': '#EDD3BF', 'Latte': '#D1A377', 'Caramel': '#6B3E13',
              'Espresso': '#523D32', 'White': '#fafafa', 'Blue': '#5A718D',
              'Dark Grey': '#AFACA8', 'Pink': '#E9B6B7', 'Dune': '#DCBFA4',
              'Brown': '#D29673', 'Green': '#3D8B65', 'Grey': '#808080',
              'Gray': '#808080', 'Limited Edition: Black': '#352C2C',
              'Limited Edition: Wine Red': '#E22C2C', 'Limited Edition: Purple': '#b67ab6',
              'Fawn': '#A67252', 'Grey Fawn': '#8E9297', 'Leopard': '#D29B52',
              'Grey Leopard': '#A5A7AC', 'Brown Cow': '#4B2E1D', 'Black Cow': '#1C1C1C',
              'Beige': '#F9F6F0', 'Khaki': '#8E7B6C', 'Dark Gray': '#42454A',
              'Wine Red': '#722028', 'Dark Green': '#01422C',
              'Limited Edition: Royal Purple': '#782E67', 'Limited Edition: Navy': '#35394C',
              'Limited Edition: White': '#FFFFFF', 'Blueberry': '#3A4B6B',
              'Red Flower': '#A64B44', 'Yellow Dot': '#D9B44A', 'Pink Flora': '#D4959B',
              'Beige Blue': '#8A9EB1', 'Beige Green': '#8DA08E', 'Orange Blue': '#D6814A',
              'Beige Red': '#C1665E', 'Yellow': '#F2D985', 'Lime Green': '#98BF64',
              'Gradient Blue': '#12518C', 'Gradient Green': '#8F9A6F',
              'Light Green': '#D1E2C4', 'Red': '#C41E3A', 'Cream': '#FFF9EE',
              'Rose': '#E29A9A', 'Camel': '#C19A6B', 'Orange': '#e4831d',
            };

            var POPUP_ID = 'fc-upsell-swatch-popup';

            var allOpts = props.variantOptions;
            var firstLabel = allOpts[0].label || '';
            var dimCount = firstLabel.split(' / ').length;

            /* Resolve current option values per dimension */
            var selVar = allOpts.find(function(v) {
              return String(v.value) === String(props.selectedVariantId);
            });
            var selLabel = selVar ? selVar.label : firstLabel;
            var selParts = selLabel.split(' / ');

            /* Helper: find variant ID for a given set of option values */
            function findVariant(parts) {
              return allOpts.find(function(v) {
                var p = v.label.split(' / ');
                return parts.every(function(nv, i) { return p[i] === nv; });
              });
            }

            /* ── Single-dimension fallback ──────────────────────────────── */
            if (dimCount < 2) {
              return (
                <div className="cart-upsell__option-wrapper pw-swatch-wrapper" style={{ minWidth: '60px' }}>
                  <label className="visually-hidden" htmlFor={`fc-upsell-variant-${props.productId}`}>
                    {props.selectedVariantLabel || 'Variant'}
                  </label>
                  <div className="cart-upsell__variant-select">
                    <select
                      id={`fc-upsell-variant-${props.productId}`}
                      className="cart-upsell__option-select cart-upsell__select"
                      value={props.selectedVariantId}
                      onChange={function(e) {
                        if (props.onVariantChange) props.onVariantChange(e.target.value);
                      }}
                      disabled={props.addLoading}
                    >
                      {allOpts.map(function(opt) {
                        return <option key={opt.value} value={opt.value}>{opt.label}</option>;
                      })}
                    </select>
                    <svg className="cart-upsell__select-icon" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              );
            }

            /* ── Multi-dimension: unique values per option position ──────── */
            var dimValues = Array.from({ length: dimCount }, function(_, di) {
              var seen = new Set();
              var vals = [];
              allOpts.forEach(function(v) {
                var p = v.label.split(' / ');
                if (p[di] !== undefined && !seen.has(p[di])) { seen.add(p[di]); vals.push(p[di]); }
              });
              return vals;
            });

            return dimValues.map(function(vals, di) {
              var selectedVal = selParts[di] || '';
              var isColor = vals.some(function(v) { return !!COLOR_MAP[v]; });

              if (isColor) {
                /* ── Swatch picker: popup teleported to document.body ─────── */
                var selectedBg = COLOR_MAP[selectedVal] || '#ccc';

                return (
                  <div key={di} className="cart-upsell__option-wrapper pw-swatch-wrapper" style={{ minWidth: '60px' }}>
                    <div className="pw-custom-swatch-dropdown cart-upsell-swatch-dropdown" style={{ marginTop: 0, minHeight: '38px' }}>
                      <div
                        className="pw-swatch-trigger"
                        style={{ height: '38px', cursor: 'pointer' }}
                        onClick={function(e) {
                          var triggerEl = e.currentTarget;

                          /* Toggle: close if the same trigger's popup is open */
                          var existing = document.getElementById(POPUP_ID);
                          if (existing) {
                            existing.remove();
                            if (
                              existing.getAttribute('data-di') === String(di) &&
                              existing.getAttribute('data-pid') === String(props.productId)
                            ) return;
                          }

                          /* Build popup anchored to trigger via position:fixed */
                          var rect = triggerEl.getBoundingClientRect();
                          var popup = document.createElement('ul');
                          popup.id = POPUP_ID;
                          popup.setAttribute('data-di', String(di));
                          popup.setAttribute('data-pid', String(props.productId));
                          popup.style.cssText = [
                            'position:fixed',
                            'top:' + (rect.bottom + 6) + 'px',
                            'left:' + rect.left + 'px',
                            'width:max-content',
                            'background:#fff',
                            'border:1px solid rgba(0,0,0,0.12)',
                            'border-radius:8px',
                            'padding:1rem',
                            'margin:0',
                            'display:grid',
                            'grid-template-columns:repeat(3,1fr)',
                            'gap:0.8rem',
                            'z-index:2147483647',
                            'box-shadow:0 4px 14px rgba(0,0,0,0.12)',
                            'list-style:none',
                          ].join(';');

                          vals.forEach(function(val) {
                            var bg = COLOR_MAP[val] || '#ccc';
                            var isSelected = selectedVal === val;
                            var li = document.createElement('li');
                            li.title = val;
                            li.style.cssText = [
                              'cursor:pointer',
                              'display:flex',
                              'align-items:center',
                              'justify-content:center',
                              'border-radius:4px',
                              'outline:' + (isSelected ? '2px solid #3b3b3b' : '1px solid transparent'),
                              'outline-offset:2px',
                              'padding:0',
                            ].join(';');

                            var swatch = document.createElement('span');
                            swatch.style.cssText = [
                              'display:block',
                              'width:2.8rem',
                              'height:2.8rem',
                              'border-radius:4px',
                              'border:1px solid rgba(0,0,0,0.12)',
                              'background:' + bg,
                              'pointer-events:none',
                            ].join(';');
                            li.appendChild(swatch);

                            li.addEventListener('mouseenter', function() { li.style.outline = '2px solid #3b3b3b'; });
                            li.addEventListener('mouseleave', function() {
                              li.style.outline = (val === selectedVal) ? '2px solid #3b3b3b' : '1px solid transparent';
                            });

                            li.addEventListener('click', function() {
                              /* Update trigger indicator immediately for responsiveness */
                              var indicator = triggerEl.querySelector('.selected-swatch-indicator');
                              if (indicator) indicator.style.background = bg;
                              popup.remove();
                              /* Fire variant change — UpCart will re-render the tile */
                              var newParts = selParts.slice();
                              newParts[di] = val;
                              var match = findVariant(newParts);
                              if (match && props.onVariantChange) props.onVariantChange(match.value);
                            });

                            popup.appendChild(li);
                          });

                          document.body.appendChild(popup);

                          /* Reposition above the trigger now that height is known */
                          var popupHeight = popup.getBoundingClientRect().height;
                          popup.style.top = (rect.top - popupHeight - 6) + 'px';

                          /* Close on outside click */
                          function closeOnOutside(ev) {
                            if (!popup.contains(ev.target) && !triggerEl.contains(ev.target)) {
                              popup.remove();
                              document.removeEventListener('click', closeOnOutside);
                            }
                          }
                          setTimeout(function() {
                            document.addEventListener('click', closeOnOutside);
                          }, 0);
                        }}
                      >
                        <span
                          className="pw-color-indicator selected-swatch-indicator"
                          style={{
                            background: selectedBg,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            width: '22px',
                            height: '22px',
                          }}
                        />
                        <svg aria-hidden="true" focusable="false" viewBox="0 0 10 6" style={{ width: '10px', fill: 'currentColor', flexShrink: 0 }}>
                          <path fillRule="evenodd" clipRule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor" />
                        </svg>
                      </div>
                      {/* Popup is appended to document.body on click — escapes overflow clipping */}
                    </div>
                  </div>
                );
              }

              /* ── Regular select (size / other dimensions) ────────────── */
              return (
                <div key={di} className="cart-upsell__option-wrapper pw-swatch-wrapper" style={{ minWidth: '60px' }}>
                  <label className="visually-hidden" htmlFor={`fc-upsell-opt${di}-${props.productId}`}>
                    {`Option ${di + 1}`}
                  </label>
                  <div className="cart-upsell__variant-select">
                    <select
                      id={`fc-upsell-opt${di}-${props.productId}`}
                      className="cart-upsell__option-select cart-upsell__select"
                      value={selectedVal}
                      onChange={function(e) {
                        var newParts = selParts.slice();
                        newParts[di] = e.target.value;
                        var match = findVariant(newParts);
                        if (match && props.onVariantChange) props.onVariantChange(match.value);
                      }}
                      disabled={props.addLoading}
                    >
                      {vals.map(function(val) {
                        return <option key={val} value={val}>{val}</option>;
                      })}
                    </select>
                    <svg className="cart-upsell__select-icon" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              );
            });
          })()}
        </div>

        <div className="cart-upsell__actions" data-product-id={props.productId}>
          <button
            type="button"
            className="cart-upsell__add-btn"
            onClick={function() { props.onAddClick(props.productId, props.selectedVariantId); }}
            disabled={props.addLoading}
          >
            {props.addLoading ? (
              <div className="upcart-internal-component-loader upcart-public-component-loader" />
            ) : (
              props.addButtonText
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
