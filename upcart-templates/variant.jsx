<div className="fc-variant">
  {props.item.options_with_values && !props.item.product_has_only_default_variant && (
    <dl className="fc-variant__list">
      {props.item.options_with_values.map((option) => (
        <div key={option.name} className="fc-variant__row">
          <dt className="fc-variant__name">{option.name}:</dt>
          <dd className="fc-variant__value">{option.value}</dd>
        </div>
      ))}
    </dl>
  )}
</div>
