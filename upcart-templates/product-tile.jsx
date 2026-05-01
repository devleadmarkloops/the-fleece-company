<div className="upcart-internal-component-product-tile upcart-public-component-product-tile">
  <div className="upcart-internal-component-product-tile__content upcart-public-component-product-tile__content">
    <a
      href={props.productUrl === null || props.productUrl === undefined ? '/' : props.productUrl}
      data-no-pointer={!props.productUrl}
      className="upcart-internal-component-product-tile__image-wrapper upcart-public-component-product-tile__image-wrapper"
    >
      {props.imageUrl ? (
        <img
          src={props.imageUrl}
          alt={props.title}
          width={88}
          height={88}
          className="upcart-internal-component-product-tile__image upcart-public-component-product-tile__image"
        />
      ) : (
        <></>
      )}
    </a>
    <div className="upcart-internal-component-product-tile__info upcart-public-component-product-tile__info">
      <div className="upcart-internal-component-product-tile__header upcart-public-component-product-tile__header">
        <h4 className="upcart-internal-component-product-tile__product-title upcart-public-component-product-tile__product-title">
          <a
            href={props.productUrl}
            data-internal-properties={`urlIsEmpty=${!props.productUrl};`}
            className="upcart-internal-component-product-tile__title-link upcart-public-component-product-tile__title-link"
          >
            {props.title}
          </a>
        </h4>
        <button
          className="upcart-internal-component-product-tile__remove-button upcart-public-component-product-tile__remove-button"
          onClick={() => {
            props.setLoadingOperation('remove');
            props.onDeleteProduct();
          }}
          disabled={props.isLoading}
        >
          {props.loadingOperation === 'remove' ? (
            <div className="upcart-internal-component-loader upcart-public-component-loader" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M11.5 8.25a.75.75 0 0 1 .75.75v4.25a.75.75 0 0 1-1.5 0v-4.25a.75.75 0 0 1 .75-.75Z" />
              <path d="M9.25 9a.75.75 0 0 0-1.5 0v4.25a.75.75 0 0 0 1.5 0v-4.25Z" />
              <path
                fillRule="evenodd"
                d="M7.25 5.25a2.75 2.75 0 0 1 5.5 0h3a.75.75 0 0 1 0 1.5h-.75v5.45c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311c-.642.327-1.482.327-3.162.327h-.4c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311c-.327-.642-.327-1.482-.327-3.162v-5.45h-.75a.75.75 0 0 1 0-1.5h3Zm1.5 0a1.25 1.25 0 1 1 2.5 0h-2.5Zm-2.25 1.5h7v5.45c0 .865-.001 1.423-.036 1.848-.033.408-.09.559-.128.633a1.5 1.5 0 0 1-.655.655c-.074.038-.225.095-.633.128-.425.035-.983.036-1.848.036h-.4c-.865 0-1.423-.001-1.848-.036-.408-.033-.559-.09-.633-.128a1.5 1.5 0 0 1-.656-.655c-.037-.074-.094-.225-.127-.633-.035-.425-.036-.983-.036-1.848v-5.45Z"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="upcart-internal-component-product-tile__variant upcart-public-component-product-tile__variant">
        {props.variant}
      </div>

      <div className="upcart-internal-component-product-tile__properties upcart-public-component-product-tile__properties">
        {props.properties}
      </div>

      <div className="upcart-internal-component-product-tile__bundle upcart-public-component-product-tile__bundle">
        {props.bundle}
      </div>

      <div className="upcart-internal-component-product-tile__product-pricing upcart-public-component-product-tile__product-pricing">
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

      <div className="upcart-internal-component-product-tile__controls upcart-public-component-product-tile__controls">
        {props.showQuantitySelector && (
          <div className="upcart-internal-component-product-tile__quantity-selector upcart-public-component-product-tile__quantity-selector">
            <button
              className="upcart-internal-component-product-tile__quantity-minus upcart-public-component-product-tile__quantity-minus"
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 10c0-.414.336-.75.75-.75h8.5c.414 0 .75.336.75.75s-.336.75-.75.75h-8.5c-.414 0-.75-.336-.75-.75Z"
                  />
                </svg>
              )}
              <span className="upcart-internal__visually-hidden">Decrease quantity</span>
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
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  props.onDecrease();
                  e.preventDefault();
                } else if (e.key === 'ArrowUp') {
                  props.onIncrease();
                  e.preventDefault();
                }
              }}
              aria-label="Product quantity"
            />
            <button
              className="upcart-internal-component-product-tile__quantity-plus upcart-public-component-product-tile__quantity-plus"
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M10.75 5.75c0-.414-.336-.75-.75-.75s-.75.336-.75.75v3.5h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5Z" />
                </svg>
              )}
              <span className="upcart-internal__visually-hidden">Increase quantity</span>
            </button>
          </div>
        )}
        {props.discountCodes && props.discountCodes.length > 0 && (
          <div className="upcart-internal-component-product-tile__discount-codes upcart-public-component-product-tile__discount-codes">
            {props.discountCodes.map((code) => (
              <>
                <span key={code} className="upcart-internal-component-tag upcart-public-component-tag">
                  <span className="upcart-internal-component-tag__icon upcart-public-component-tag__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M8.575 4.649a3.75 3.75 0 0 1 2.7-1.149h1.975a3.25 3.25 0 0 1 3.25 3.25v2.187a3.25 3.25 0 0 1-.996 2.34l-4.747 4.572a2.5 2.5 0 0 1-3.502-.033l-2.898-2.898a2.75 2.75 0 0 1-.036-3.852l4.254-4.417Zm4.425 3.351a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                      />
                    </svg>
                  </span>
                  <span className="upcart-internal-component-tag__text upcart-public-component-tag__text">{code}</span>
                </span>
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  {(props.subscription.subscriptionUpgradeData || props.subscription.sellingPlansData) && (
    <div className="upcart-internal-component-product-tile__subscription-upgrade upcart-public-component-product-tile__subscription-upgrade">
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
          className="upcart-internal-component__button upcart-public-component__button upcart-internal-component-product-tile__subscription-upgrade-btn upcart-public-component-product-tile__subscription-upgrade-btn"
        >
          {props.loadingOperation === 'subscription' ? (
            <div className="upcart-internal-component-loader upcart-public-component-loader" />
          ) : (
            props.subscription.subscriptionUpgradeData.buttonText
          )}
        </button>
      )}
      {!!props.subscription.sellingPlansData && (
        <div className="upcart-internal-component-product-tile__select-wrapper upcart-public-component-product-tile__select-wrapper">
          <select
            value={props.subscription.sellingPlansData.activeSellingPlanId}
            onChange={(e) => {
              props.subscription.changeSellingPlan(props.rawItem, e.target.value);
            }}
            className="upcart-internal-component-product-tile__select upcart-public-component-product-tile__select"
          >
            {/*
                  (OPTIONAL) A group with:
                    - Title: "Full price"
                    - Options:
                      - "One-time purchase"
                    - Condition: this group should be included if the "Prevent downgrades" setting is disabled AND the item
                        does not require a selling plan (i.e., it can be sold as a one-time purchase)
                */}
            {props.subscription.sellingPlansData.oneTimePurchaseText && (
              <optgroup label="Full price">
                <option value={'otp'}>{props.subscription.sellingPlansData.oneTimePurchaseText}</option>
              </optgroup>
            )}
            {/*
                  A group for each possible selling plan group for the item with:
                    - Title: the name of the selling plan group
                    - Options: the names of the possible selling plans in the group for the item
                */}
            <optgroup label="Subscription plans">
              {props.subscription.sellingPlansData.sellingPlanGroups === null ||
              props.subscription.sellingPlansData.sellingPlanGroups === undefined
                ? []
                : props.subscription.sellingPlansData.sellingPlanGroups.flatMap((group) =>
                    group.selling_plans.map((plan) => (
                      <option
                        key={plan.id}
                        value={plan.id}
                        data-internal-properties={`sellingPlanGroupName=${group.name};sellingPlanName=${plan.name};`}
                      >
                        {props.subscription.getSellingPlanGroupText(group.name, plan.name)}
                      </option>
                    )),
                  )}
            </optgroup>
          </select>
        </div>
      )}
    </div>
  )}
</div>
