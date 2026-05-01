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
