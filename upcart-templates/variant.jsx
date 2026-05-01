<div className="upcart-internal-component-product-tile__variant upcart-public-component-product-tile__variant">
  {props.item.options_with_values && !props.item.product_has_only_default_variant && (
    <dl className="upcart-cart-drawer__variant-options">
      {props.item.options_with_values.map((option) => (
        <div key={option.name} className="upcart-cart-drawer__option-row">
          <dt>{option.name}:</dt>
          <dd>{option.value}</dd>
        </div>
      ))}
    </dl>
  )}
</div>
