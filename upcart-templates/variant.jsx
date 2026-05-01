<div className="upcart-internal-component-product-tile__variant upcart-public-component-product-tile__variant">
  {props.item.options_with_values && !props.item.product_has_only_default_variant && (
    <span className="upcart-internal-cart-items__key-value-pair">
      {props.item.options_with_values
        .map((option) => `${option.name}: ${option.value}`)
        .join(', ')}
    </span>
  )}
</div>
