<div className="upcart-internal-component-product-tile__bundle upcart-public-component-product-tile__bundle">
  {props.item.hasComponents && (
    <div className="upcart-internal-bundle-properties upcart-public-bundle-properties">
      {props.item.variantTitle && (
        <div className="upcart-internal-bundle-properties__variant-title upcart-public-bundle-properties__variant-title">
          {props.item.variantTitle}
        </div>
      )}
      <>
        <div
          onClick={props.toggleCollapsible}
          className="upcart-internal-component-collapse__dropdown-container upcart-public-component-collapse__dropdown-container"
        >
          <span className="upcart-internal-bundle-properties__header upcart-public-bundle-properties__header">
            {props.isExpanded ? props.hideDetailsText : props.showDetailsText}
          </span>
          <span
            className="upcart-internal-component-collapse__expand-icon upcart-public-component-collapse__expand-icon"
            data-expanded={props.isExpanded}
          >
            {props.chevronDownIconComponent}
          </span>
        </div>
        <div
          className="upcart-internal-component-collapse__children upcart-public-notes__text-container"
          data-expanded={props.isExpanded}
        >
          <div className="upcart-internal-bundle-properties__header upcart-public-bundle-properties__header">
            <div className="upcart-internal-bundle-properties__item-components upcart-public-bundle-properties__item-components">
              {props.item.itemComponents.map((comp) => (
                <div
                  key={comp.product.title}
                  className="upcart-internal-bundle-properties__item-component-row upcart-public-bundle-properties__item-component-row"
                >
                  <div className="upcart-internal-bundle-properties__image-wrapper upcart-public-bundle-properties__image-wrapper">
                    {comp.image && comp.image.url ? (
                      <img
                        src={props.getSizedImageUrl({ src: comp.image.url, height: 32 })}
                        alt={comp.image.alt || comp.product.title}
                        width={32}
                        height={32}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="upcart-internal-bundle-properties__content upcart-public-bundle-properties__content">
                    <p className="upcart-internal-bundle-properties__product-title upcart-public-bundle-properties__product-title">
                      {comp.quantity} × {comp.product.title}
                    </p>
                    {!comp.product.has_only_default_variant && (
                      <p className="upcart-internal-bundle-properties__variant-title upcart-public-bundle-properties__variant-title">
                        {comp.variantTitle}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    </div>
  )}
</div>
