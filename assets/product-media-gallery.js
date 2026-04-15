/**
 * Product Media Gallery — ResizeObserver + drag-to-scroll for vertical thumbnail slider
 * Extracted from sections/main-product.liquid for performance (deferred loading)
 */
document.addEventListener('DOMContentLoaded', () => {
  const mediaGalleries = document.querySelectorAll('media-gallery[data-desktop-layout="vertical_slider"]');

  mediaGalleries.forEach((gallery) => {
    const mainMedia = gallery.querySelector('use-animate');
    const thumbList = gallery.querySelector('.thumbnail-list');

    if (!mainMedia || !thumbList) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        thumbList.style.maxHeight = `${entry.contentRect.height}px`;
      }
    });

    resizeObserver.observe(mainMedia);

    let isDown = false;
    let startY;
    let scrollTop;

    thumbList.addEventListener('mousedown', (e) => {
      if (window.innerWidth < 750) return;

      isDown = true;
      thumbList.classList.add('is-dragging');
      startY = e.pageY - thumbList.offsetTop;
      scrollTop = thumbList.scrollTop;
    });

    thumbList.addEventListener('mouseleave', () => {
      if (window.innerWidth < 750) return;
      isDown = false;
      thumbList.classList.remove('is-dragging');
    });

    thumbList.addEventListener('mouseup', () => {
      if (window.innerWidth < 750) return;
      isDown = false;
      thumbList.classList.remove('is-dragging');
    });

    thumbList.addEventListener('mousemove', (e) => {
      if (!isDown || window.innerWidth < 750) return;

      e.preventDefault();
      const y = e.pageY - thumbList.offsetTop;
      const walk = (y - startY) * 2;
      thumbList.scrollTop = scrollTop - walk;
    });
  });
});
