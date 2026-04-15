/*! Lazy Image */
class LazyImage extends HTMLImageElement {
  constructor() {
    super();

    this.wrapper = this.closest('.media-wrapper');
    if (this.wrapper === null) return;

    this.handleLazy();
    addEventListener('resize', this.handleLazy.bind(this), true);

    const observer = new MutationObserver((changes) => {
      changes.forEach((change) => {
        if (change.attributeName.includes('src') || change.attributeName.includes('srcset')) {
          this.handleLazy();
        }
      });
    });
    observer.observe(this, {attributes : true});
  }

  handleLazy () {
    if (this.classList.contains('no-lazy') || this.getAttribute('loading') === 'eager' || this.getAttribute('fetchpriority') === 'high') return;

    const mql = window.matchMedia('(min-width: 750px)');
    if (mql.matches && this.classList.contains('medium-hide')) return;
    if (!mql.matches && this.classList.contains('small-hide')) return;
    if (this.complete || this.classList.contains('loaded')) return;
    
    this.wrapper.classList.add('loading');
    this.addEventListener('load', () => {
      const loaded = () => {
        this.classList.add('loaded');
        this.wrapper.classList.remove('loading');
      };

      window.requestIdleCallback ? window.requestIdleCallback(loaded, {timeout: 150}) : setTimeout(loaded);
    }, false);
  }
}
window.customElements.define('lazy-image', LazyImage, { extends: 'img' });

class DirectImage extends HTMLImageElement {
  constructor() {
    super();
  }
}
window.customElements.define('direct-image', DirectImage, { extends: 'img' });

class ProgPicture extends HTMLPictureElement {
  constructor() {
    super();

    this.abortController = new AbortController();
    this.addEventListener('touchmove', this.touchmove_handler, { signal: this.abortController.signal });
  }

  touchmove_handler(ev) {
    if (ev.scale > 1) {
      var hqImage = this.getAttribute('data-hq');
      this.querySelector('source').setAttribute('srcset', hqImage);
      this.abortController.abort();
    }
  }
}
window.customElements.define('prog-picture', ProgPicture, { extends: 'picture' });