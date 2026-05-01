<div className="upcart-internal-component-product-tile__properties upcart-public-component-product-tile__properties">
  {(!!props.subscriptionLabel || !!props.productProperties.length) && (
    <div>
      {props.subscriptionLabel && (
        <p className="upcart-public-product-properties__subscription" key="subscription-label">
          {props.subscriptionLabel}
        </p>
      )}
      {props.productProperties.map(({ key, value, isUrl }) => (
        <div key={key} className="upcart-public-product-properties__item">
          {isUrl ? (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="upcart-internal-product-properties__link upcart-internal-cart-items__key-value-pair upcart-public-product-properties__link"
            >
              {key}
            </a>
          ) : (
            <span className="upcart-internal-cart-items__key-value-pair upcart-public-cart-items__key-value-pair">
              {key}: {value}
            </span>
          )}
        </div>
      ))}
    </div>
  )}
</div>
