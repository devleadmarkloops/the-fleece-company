<div className="fc-product-tile">

  {/* Coluna esquerda: imagem + seletor de quantidade */}
  <div className="fc-product-tile__left">
    <a
      href={props.productUrl ?? '/'}
      data-no-pointer={!props.productUrl}
      className="fc-product-tile__img-link"
    >
      {props.imageUrl && (
        <img
          src={props.imageUrl}
          alt={props.title}
          width={88}
          height={88}
          className="fc-product-tile__img"
        />
      )}
    </a>

    {props.showQuantitySelector && (
      <div className="fc-product-tile__qty">
        <button
          className="fc-product-tile__qty-btn"
          onClick={() => {
            props.setLoadingOperation('decrease');
            props.onDecrease();
          }}
          disabled={props.isLoading}
          aria-label="Decrease quantity"
        >
          {props.loadingOperation === 'decrease' ? (
            <div className="upcart-internal-component-loader upcart-public-component-loader" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="10" height="10">
              <path
                fillRule="evenodd"
                d="M5 10c0-.414.336-.75.75-.75h8.5c.414 0 .75.336.75.75s-.336.75-.75.75h-8.5c-.414 0-.75-.336-.75-.75Z"
              />
            </svg>
          )}
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={props.quantity}
          onChange={(e) => {
            props.setLoadingOperation('inputChange');
            props.handleInputChange(e);
          }}
          disabled={props.isLoading}
          className="fc-product-tile__qty-input"
          aria-label="Product quantity"
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              props.onDecrease();
              e.preventDefault();
            } else if (e.key === 'ArrowUp') {
              props.onIncrease();
              e.preventDefault();
            }
          }}
        />
        <button
          className="fc-product-tile__qty-btn"
          onClick={() => {
            props.setLoadingOperation('increase');
            props.onIncrease();
          }}
          disabled={props.isLoading}
          aria-label="Increase quantity"
        >
          {props.loadingOperation === 'increase' ? (
            <div className="upcart-internal-component-loader upcart-public-component-loader" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="10" height="10">
              <path d="M10.75 5.75c0-.414-.336-.75-.75-.75s-.75.336-.75.75v3.5h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5Z" />
            </svg>
          )}
        </button>
      </div>
    )}
  </div>

  {/* Coluna direita: título, preço, variante, propriedades, remover */}
  <div className="fc-product-tile__desc">

    {/* Linha superior: título (esq) + preço (dir) */}
    <div className="fc-product-tile__top-row">
      <a href={props.productUrl} className="fc-product-tile__title">
        {props.title}
      </a>
      <div className="fc-product-tile__price-wrap">
        {props.price}
      </div>
    </div>

    {/* Variante, propriedades e bundle */}
    <div className="fc-product-tile__meta">
      {props.variant}
      {props.properties}
      {props.bundle}
    </div>

    {/* Rodapé: desconto + botão remover */}
    <div className="fc-product-tile__footer">

      {props.discountCodes && props.discountCodes.length > 0 && (
        <div className="fc-product-tile__discounts">
          {props.discountCodes.map((code) => (
            <span key={code} className="fc-product-tile__discount-badge">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="10" height="10">
                <path
                  fillRule="evenodd"
                  d="M8.575 4.649a3.75 3.75 0 0 1 2.7-1.149h1.975a3.25 3.25 0 0 1 3.25 3.25v2.187a3.25 3.25 0 0 1-.996 2.34l-4.747 4.572a2.5 2.5 0 0 1-3.502-.033l-2.898-2.898a2.75 2.75 0 0 1-.036-3.852l4.254-4.417Zm4.425 3.351a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                />
              </svg>
              {code}
            </span>
          ))}
        </div>
      )}

      <button
        className="fc-product-tile__remove-btn"
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

    {/* Upgrade / seleção de plano de assinatura */}
    {(props.subscription.subscriptionUpgradeData || props.subscription.sellingPlansData) && (
      <div className="fc-product-tile__subscription">
        {!!props.subscription.subscriptionUpgradeData && (
          <button
            onClick={() => {
              props.setLoadingOperation('subscription');
              props.subscription.upgradeSellingPlan(
                props.rawItem,
                props.subscription.subscriptionUpgradeData.defaultSellingPlanId,
              );
            }}
            disabled={props.isLoading}
            className="fc-product-tile__sub-upgrade-btn"
          >
            {props.loadingOperation === 'subscription' ? (
              <div className="upcart-internal-component-loader upcart-public-component-loader" />
            ) : (
              props.subscription.subscriptionUpgradeData.buttonText
            )}
          </button>
        )}

        {!!props.subscription.sellingPlansData && (
          <select
            value={props.subscription.sellingPlansData.activeSellingPlanId}
            onChange={(e) => {
              props.subscription.changeSellingPlan(props.rawItem, e.target.value);
            }}
            className="fc-product-tile__sub-select"
          >
            {props.subscription.sellingPlansData.oneTimePurchaseText && (
              <optgroup label="Full price">
                <option value="otp">
                  {props.subscription.sellingPlansData.oneTimePurchaseText}
                </option>
              </optgroup>
            )}
            <optgroup label="Subscription plans">
              {(props.subscription.sellingPlansData.sellingPlanGroups ?? []).flatMap((group) =>
                group.selling_plans.map((plan) => (
                  <option
                    key={plan.id}
                    value={plan.id}
                    data-internal-properties={`sellingPlanGroupName=${group.name};sellingPlanName=${plan.name};`}
                  >
                    {props.subscription.getSellingPlanGroupText(group.name, plan.name)}
                  </option>
                ))
              )}
            </optgroup>
          </select>
        )}
      </div>
    )}

  </div>
</div>