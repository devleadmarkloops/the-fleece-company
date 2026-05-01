<div className="fc-bundle">
  {props.item.hasComponents && (
    <div>
      {props.item.variantTitle && (
        <p className="fc-bundle__variant-title">{props.item.variantTitle}</p>
      )}

      <div
        onClick={props.toggleCollapsible}
        className="fc-bundle__toggle"
        role="button"
        tabIndex={0}
      >
        <span className="fc-bundle__toggle-label">
          {props.isExpanded ? props.hideDetailsText : props.showDetailsText}
        </span>
        <span
          className="fc-bundle__toggle-icon"
          data-expanded={props.isExpanded}
        >
          {props.chevronDownIconComponent}
        </span>
      </div>

      {props.isExpanded && (
        <div className="fc-bundle__content">
          {props.item.itemComponents.map((comp) => (
            <div key={comp.product.title} className="fc-bundle__item">
              <div className="fc-bundle__item-img-wrap">
                {comp.image && comp.image.url ? (
                  <img
                    src={props.getSizedImageUrl({ src: comp.image.url, height: 32 })}
                    alt={comp.image.alt || comp.product.title}
                    width={32}
                    height={32}
                    className="fc-bundle__item-img"
                  />
                ) : null}
              </div>
              <div className="fc-bundle__item-info">
                <p className="fc-bundle__item-title">
                  {comp.quantity} × {comp.product.title}
                </p>
                {!comp.product.has_only_default_variant && (
                  <p className="fc-bundle__item-variant">{comp.variantTitle}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )}
</div>
