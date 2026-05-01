<div className="fc-price">
  {props.compareAtPrice && (
    <span
      className="fc-price__compare-at"
      dangerouslySetInnerHTML={{ __html: props.compareAtPrice }}
    />
  )}
  <span
    className="fc-price__current"
    dangerouslySetInnerHTML={{ __html: props.price }}
  />
  {props.savings && (
    <span
      className="fc-price__savings"
      dangerouslySetInnerHTML={{ __html: props.savings }}
    />
  )}
</div>
