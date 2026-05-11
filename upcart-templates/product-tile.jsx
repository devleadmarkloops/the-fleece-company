<div className={`upcart-internal-component-product-tile upcart-public-component-product-tile product-container fc-mini-cart-item ${props.productUrl && props.productUrl.indexOf('the-muslin-blanket-100-muslin-cotton-b1g1') !== -1 ? 'fc-tile-img--tall' : ''}`}>

  {/* Coluna esquerda — espelha sections/mini-cart.liquid: product-img-wr */}
  <div className="product-img-wr">
    <a
      href={props.productUrl === null || props.productUrl === undefined ? '/' : props.productUrl}
      data-no-pointer={!props.productUrl}
      className="upcart-internal-component-product-tile__image-wrapper upcart-public-component-product-tile__image-wrapper product-image media-wrapper media-wrapper--small"
    >
      {props.imageUrl ? (
        <img
          src={props.imageUrl}
          alt={props.title}
          width={92}
          height={props.productUrl && props.productUrl.indexOf('the-muslin-blanket-100-muslin-cotton-b1g1') !== -1 ? 115 : 92}
          className="upcart-internal-component-product-tile__image upcart-public-component-product-tile__image"
        />
      ) : (
        <></>
      )}
    </a>

    <div className="product-quantity">
      <div className="upcart-internal-component-product-tile__controls upcart-public-component-product-tile__controls">
        {props.showQuantitySelector && (
          <div className="upcart-internal-component-product-tile__quantity-selector upcart-public-component-product-tile__quantity-selector quantity">
            <button
              className="upcart-internal-component-product-tile__quantity-minus upcart-public-component-product-tile__quantity-minus quantity__button"
              onClick={() => {
                props.setLoadingOperation('decrease');
                props.onDecrease();
              }}
              disabled={props.isLoading}
              aria-label="Decrease quantity"
              type="button"
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
              className="quantity__input"
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
              className="upcart-internal-component-product-tile__quantity-plus upcart-public-component-product-tile__quantity-plus quantity__button"
              onClick={() => {
                props.setLoadingOperation('increase');
                props.onIncrease();
              }}
              disabled={props.isLoading}
              aria-label="Increase quantity"
              type="button"
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
    </div>
  </div>

  {/* Coluna direita — product-description (mini-cart.liquid) */}
  <div className="product-description">
    <div className="product-content">
      <a
        href={props.productUrl}
        data-internal-properties={`urlIsEmpty=${!props.productUrl};`}
        className="upcart-internal-component-product-tile__title-link upcart-public-component-product-tile__title-link link product-title"
      >
        {props.title}
      </a>

      <div className="quantity-price-d5">
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
          className="upcart-internal-component-product-tile__price upcart-public-component-product-tile__price price"
          data-upcart-chunk="cart-item-price"
          dangerouslySetInnerHTML={{
            __html: props.price,
          }}
        />
        {props.savings && (
          <span
            className="upcart-internal-component-product-tile__savings upcart-public-component-product-tile__savings price-save"
            data-upcart-chunk="cart-item-savings"
            dangerouslySetInnerHTML={{
              __html: props.savings,
            }}
          />
        )}
      </div>
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
      <ul className="discounts list-unstyled" role="list" aria-label="Discount">
        {props.discountCodes.map((code) => (
          <li key={code} className="discounts__discount">
            <svg
              className="icon icon-discount icon-discount-new"
              viewBox="0 0 14 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M13.2487 9.13923L8.17321 15.1727C7.75161 15.6739 7.0025 15.7393 6.50005 15.3187L2.51118 11.9801C2.00873 11.5596 1.94318 10.8124 2.36478 10.3112L7.44028 4.27772C7.66314 4.01279 7.99092 3.85823 8.3376 3.85463L11.7664 3.81879C12.3521 3.81266 12.8549 4.23345 12.9505 4.80987L13.5106 8.18428C13.5672 8.52545 13.4716 8.87431 13.2487 9.13923Z"
                fill="white"
              />
              <path
                d="M2.5202 13.2816C3.95568 12.7976 4.70412 11.7624 4.61036 10.0515C4.60271 9.91205 4.47688 9.80882 4.33882 9.83006C3.7789 9.9162 3.03102 9.75145 2.59891 9.22627C2.51291 9.12171 2.35792 9.11189 2.2582 9.20347C1.96548 9.47229 1.35264 9.909 0.53626 9.81235C0.404072 9.79669 0.283041 9.88935 0.268739 10.0217C0.00991032 12.4175 1.95445 13.1533 2.37132 13.2828C2.41977 13.2978 2.47211 13.2978 2.5202 13.2816Z"
                fill="white"
              />
              <path
                d="M2.29929 13.5174C2.39512 13.5472 2.50182 13.5472 2.59937 13.5145C2.59944 13.5145 2.59953 13.5145 2.5996 13.5145C2.92572 13.4045 3.21497 13.2666 3.47104 13.1041L6.34216 15.5071C6.95127 16.0168 7.85632 15.9309 8.36107 15.3309L13.4366 9.29738C13.706 8.977 13.8214 8.55663 13.7529 8.14405L13.1928 4.76961C13.0868 4.13144 12.5745 3.65656 11.95 3.58398V0.98067C11.95 0.439954 11.5092 0 10.9675 0C10.4256 0 9.98487 0.439954 9.98487 0.98067V3.59169L8.3349 3.60895C7.91605 3.61336 7.52147 3.79944 7.2521 4.1195L2.95124 9.23223C2.89319 9.18339 2.83865 9.12991 2.78958 9.07024C2.70623 8.96889 2.58355 8.90549 2.45288 8.89628C2.32092 8.88668 2.19023 8.93305 2.0929 9.02247C1.83115 9.26287 1.28402 9.65347 0.566067 9.56831C0.435307 9.55297 0.306557 9.58935 0.203849 9.67098C0.102601 9.75167 0.0391667 9.86677 0.0253512 9.99519C-0.254817 12.5884 1.87046 13.3842 2.29929 13.5174ZM10.4763 0.98067C10.4763 0.710912 10.6966 0.491389 10.9675 0.491389C11.2383 0.491389 11.4586 0.710912 11.4586 0.98067V3.57629L10.4763 3.58657V0.98067ZM7.6282 4.4359C7.80517 4.22549 8.06462 4.10319 8.34005 4.1003L9.98493 4.08312V5.41692C9.72542 5.45694 9.47957 5.58874 9.30298 5.80859C8.92695 6.27711 9.00235 6.9614 9.47253 7.33695C9.94164 7.71162 10.6273 7.63327 11.0017 7.16685C11.3778 6.69816 11.3025 6.01634 10.8324 5.64099C10.7234 5.55385 10.6023 5.4921 10.4763 5.45295V4.07799L11.7689 4.0645C11.7724 4.06444 11.7758 4.06444 11.7792 4.06444C12.2425 4.06444 12.6323 4.39338 12.7081 4.85013L13.2681 8.22458C13.3131 8.49514 13.2374 8.7709 13.0606 8.98108L7.98503 15.0146C7.65106 15.4117 7.05538 15.4634 6.65758 15.1303L3.87519 12.8014C4.59224 12.1632 4.92235 11.2392 4.85655 10.038C4.84912 9.90208 4.78416 9.77502 4.6786 9.68927C4.57326 9.60395 4.43628 9.56626 4.3024 9.58721C4.03339 9.62856 3.6954 9.59895 3.38475 9.48029L7.6282 4.4359ZM10.5258 6.02484C10.7814 6.22905 10.8256 6.60126 10.6184 6.85921C10.4123 7.11593 10.036 7.15816 9.77916 6.95303C9.52448 6.74956 9.4783 6.37525 9.68622 6.11616C9.89218 5.8595 10.2691 5.81987 10.5258 6.02484ZM0.508244 10.0564C1.42276 10.1648 2.10153 9.68175 2.41007 9.38238C2.91113 9.99133 3.75864 10.1677 4.36597 10.0649C4.45042 11.607 3.82204 12.5829 2.44487 13.048C1.9326 12.8889 0.281099 12.2025 0.508244 10.0564Z"
                fill="#3B3B3B"
              />
              <path
                d="M2.02482 11.7651C2.12078 11.861 2.27626 11.861 2.37225 11.7651L3.12026 11.0171C3.21623 10.9212 3.21623 10.7657 3.12026 10.6697C3.0243 10.5737 2.86883 10.5737 2.77284 10.6697L2.19852 11.2439L2.0903 11.1357C1.99434 11.0397 1.83886 11.0397 1.74287 11.1357C1.64691 11.2316 1.64691 11.3872 1.74287 11.4831L2.02482 11.7651Z"
                fill="#3B3B3B"
              />
            </svg>
            {code}
          </li>
        ))}
      </ul>
    )}

    <div className="cart-remove-wr">
      <button
        type="button"
        className="upcart-internal-component-product-tile__remove-button upcart-public-component-product-tile__remove-button delete-product fc-tile__remove-btn"
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
</div>
