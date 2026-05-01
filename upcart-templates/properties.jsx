<div className="fc-properties">
  {(!!props.subscriptionLabel || !!props.productProperties.length) && (
    <div>
      {props.subscriptionLabel && (
        <p className="fc-properties__subscription" key="subscription-label">
          {props.subscriptionLabel}
        </p>
      )}
      {props.productProperties.map(({ key, value, isUrl }) => (
        <div key={key} className="fc-properties__item">
          {isUrl ? (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="fc-properties__link"
            >
              {key}
            </a>
          ) : (
            <span className="fc-properties__pair">
              {key}: {value}
            </span>
          )}
        </div>
      ))}
    </div>
  )}
</div>
