import { Inject, Injectable, DOCUMENT } from '@angular/core';

/** Space left above a section when scrolling to it, for the fixed top bar */
export const SCROLL_OFFSET = 64;

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  constructor(@Inject(DOCUMENT) private document: Document) {}

  scrollToTop(): void {
    this.document.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * The router scrolls to `#fragment` as soon as the app starts, smoothly, while
   * the full stylesheet and web fonts are still loading; the layout shifts under
   * the animation and it can end in the wrong place. Once everything has loaded,
   * jump to the section again without animation, unless the user has already
   * started scrolling. Returns a function that cancels the jump.
   */
  settleOnFragment(fragment: string | null): () => void {
    const view = this.document.defaultView;
    if (!fragment || !view)
      return () => {};

    let cancelled = false;
    let onLoad: () => void;
    const userEvents = ['wheel', 'touchstart', 'keydown', 'mousedown'];
    const cancel = () => {
      cancelled = true;
      userEvents.forEach(type => view.removeEventListener(type, cancel));
      if (onLoad)
        view.removeEventListener('load', onLoad);
    };
    userEvents.forEach(type => view.addEventListener(type, cancel, { passive: true }));

    const loaded = this.document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>(resolve => view.addEventListener('load', onLoad = () => resolve(), { once: true }));

    Promise.all([loaded, this.document.fonts?.ready]).then(() => {
      const target = this.document.getElementById(fragment);
      if (!cancelled && target) {
        const top = target.getBoundingClientRect().top + view.scrollY - SCROLL_OFFSET;
        view.scrollTo({ top, behavior: 'instant' });
      }
      cancel();
    });

    return cancel;
  }

}
