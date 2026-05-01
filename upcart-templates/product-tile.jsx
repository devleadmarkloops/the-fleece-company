<div className="upcart-internal-component-product-tile upcart-public-component-product-tile">

  {/* ── ROW 1: Imagem | Info | Preços ───────────────────────────────────── */}
  <div className="upcart-internal-component-product-tile__content upcart-public-component-product-tile__content fc-tile__row1">

    {/* Col 1 — Imagem */}
    <a
      href={props.productUrl === null || props.productUrl === undefined ? '/' : props.productUrl}
      data-no-pointer={!props.productUrl}
      className="upcart-internal-component-product-tile__image-wrapper upcart-public-component-product-tile__image-wrapper"
    >
      {props.imageUrl ? (
        <img
          src={props.imageUrl}
          alt={props.title}
          width={88}
          height={88}
          className="upcart-internal-component-product-tile__image upcart-public-component-product-tile__image"
        />
      ) : (
        <></>
      )}
    </a>

    {/* Col 2 — Título, variantes, propriedades, badges */}
    <div className="upcart-internal-component-product-tile__info upcart-public-component-product-tile__info fc-tile__info">
      <div className="upcart-internal-component-product-tile__header upcart-public-component-product-tile__header">
        <h4 className="upcart-internal-component-product-tile__product-title upcart-public-component-product-tile__product-title">
          <a
            href={props.productUrl}
            data-internal-properties={`urlIsEmpty=${!props.productUrl};`}
            className="upcart-internal-component-product-tile__title-link upcart-public-component-product-tile__title-link"
          >
            {props.title}
          </a>
        </h4>
      </div>

      <div className="upcart-internal-component-product-tile__variant upcart-public-component-product-tile__variant">
        {props.variant}
      </div>

      <div className="upcart-internal-component-product-tile__properties upcart-public-component-product-tile__properties">
        {props.properties}
      </div>

      <div className="upcart-internal-component-product-tile__bundle upcart-public-component-product-tile__bundle">
        {props.bundle}
      </div>

      {props.discountCodes && props.discountCodes.length > 0 && (
        <div className="upcart-internal-component-product-tile__discount-codes upcart-public-component-product-tile__discount-codes">
          {props.discountCodes.map((code) => (
            <>
              <span key={code} className="upcart-internal-component-tag upcart-public-component-tag">
                <span className="upcart-internal-component-tag__icon upcart-public-component-tag__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.575 4.649a3.75 3.75 0 0 1 2.7-1.149h1.975a3.25 3.25 0 0 1 3.25 3.25v2.187a3.25 3.25 0 0 1-.996 2.34l-4.747 4.572a2.5 2.5 0 0 1-3.502-.033l-2.898-2.898a2.75 2.75 0 0 1-.036-3.852l4.254-4.417Zm4.425 3.351a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                    />
                  </svg>
                </span>
                <span className="upcart-internal-component-tag__text upcart-public-component-tag__text">{code}</span>
              </span>
            </>
          ))}
        </div>
      )}
    </div>

    {/* Col 3 — Preços (fora do __info para ficar em coluna própria) */}
    <div className="upcart-internal-component-product-tile__product-pricing upcart-public-component-product-tile__product-pricing fc-tile__pricing">
      {props.compareAtPrice && (
        <span
          className="upcart-internal-component-product-tile__price-compare-at upcart-public-component-product-tile__price-compare-at"
          data-upcart-chunk="cart-item-compare-at-price"
          dangerouslySetInnerHTML={{
            __html: props.compareAtPrice,
          }}
        />
      )}
      <span
        className="upcart-internal-component-product-tile__price upcart-public-component-product-tile__price"
        data-upcart-chunk="cart-item-price"
        dangerouslySetInnerHTML={{
          __html: props.price,
        }}
      />
      {props.savings && (
        <span
          className="upcart-internal-component-product-tile__savings upcart-public-component-product-tile__savings"
          data-upcart-chunk="cart-item-savings"
          dangerouslySetInnerHTML={{
            __html: props.savings,
          }}
        />
      )}
    </div>

  </div>

  {/* ── ROW 2: Quantidade | Remover ─────────────────────────────────────── */}
  <div className="fc-tile__row2">

    <div className="upcart-internal-component-product-tile__controls upcart-public-component-product-tile__controls">
      {props.showQuantitySelector && (
        <div className="upcart-internal-component-product-tile__quantity-selector upcart-public-component-product-tile__quantity-selector">
          <button
            className="upcart-internal-component-product-tile__quantity-minus upcart-public-component-product-tile__quantity-minus"
            onClick={() => {
              props.setLoadingOperation('decrease');
              props.onDecrease();
            }}
            disabled={props.isLoading}
            aria-label="Decrease quantity"
          >
            {props.loadingOperation === 'decrease' ? (
              <div className="upcart-internal-component-loader upcart-public-component-loader" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 10c0-.414.336-.75.75-.75h8.5c.414 0 .75.336.75.75s-.336.75-.75.75h-8.5c-.414 0-.75-.336-.75-.75Z"
                />
              </svg>
            )}
            <span className="upcart-internal__visually-hidden">Decrease quantity</span>
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={props.quantity}
            onChange={(e) => {
              props.setLoadingOperation('inputChange');
              props.handleInputChange(e);
            }}
            disabled={props.isLoading}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                props.onDecrease();
                e.preventDefault();
              } else if (e.key === 'ArrowUp') {
                props.onIncrease();
                e.preventDefault();
              }
            }}
            aria-label="Product quantity"
          />
          <button
            className="upcart-internal-component-product-tile__quantity-plus upcart-public-component-product-tile__quantity-plus"
            onClick={() => {
              props.setLoadingOperation('increase');
              props.onIncrease();
            }}
            disabled={props.isLoading}
            aria-label="Increase quantity"
          >
            {props.loadingOperation === 'increase' ? (
              <div className="upcart-internal-component-loader upcart-public-component-loader" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M10.75 5.75c0-.414-.336-.75-.75-.75s-.75.336-.75.75v3.5h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5Z" />
              </svg>
            )}
            <span className="upcart-internal__visually-hidden">Increase quantity</span>
          </button>
        </div>
      )}
    </div>

    <button
      className="upcart-internal-component-product-tile__remove-button upcart-public-component-product-tile__remove-button fc-tile__remove-btn"
      onClick={() => {
        props.setLoadingOperation('remove');
        props.onDeleteProduct();
      }}
      disabled={props.isLoading}
    >
      {props.loadingOperation === 'remove' ? (
        <div className="upcart-internal-component-loader upcart-public-component-loader" />
      ) : (
        'Remove'
      )}
    </button>

  </div>
</div>
