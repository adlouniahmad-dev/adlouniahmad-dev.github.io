import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, DOCUMENT, ElementRef, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IInfo } from '../shared/interfaces/info';
import { GeneralService } from '../shared/services/general.service';
import { faFacebookF, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

@Component({
    selector: 'adl-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  icons: any;
  info: IInfo;
  private removeSpotlight: () => void;
  private cancelFragmentScroll: () => void;

  constructor(
    generalService: GeneralService,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document,
    private host: ElementRef<HTMLElement>,
    private zone: NgZone,
    private route: ActivatedRoute,
  ) { 
    this.info = generalService.getBasicInfo();
  }

  ngOnInit(): void {
    this.initializeIcons();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId))
      return;

    this.initializeSpotlight();
    this.settleOnFragment();
  }

  ngOnDestroy(): void {
    this.removeSpotlight?.();
    this.cancelFragmentScroll?.();
  }

  /**
   * The router scrolls to `#fragment` as soon as the app starts, smoothly, while
   * the full stylesheet and web fonts are still loading; the layout shifts under
   * the animation and it can end in the wrong place. Once everything has loaded,
   * jump to the section again without animation, unless the user has already
   * started scrolling.
   */
  private settleOnFragment(): void {
    const fragment = this.route.snapshot.fragment;
    const view = this.document.defaultView;
    if (!fragment || !view)
      return;

    let cancelled = false;
    const userEvents = ['wheel', 'touchstart', 'keydown', 'mousedown'];
    const cancel = () => {
      cancelled = true;
      userEvents.forEach(type => view.removeEventListener(type, cancel));
    };
    userEvents.forEach(type => view.addEventListener(type, cancel, { passive: true }));
    this.cancelFragmentScroll = cancel;

    const loaded = this.document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise(resolve => view.addEventListener('load', resolve, { once: true }));

    Promise.all([loaded, this.document.fonts?.ready]).then(() => {
      const target = this.document.getElementById(fragment);
      if (!cancelled && target) {
        // Same offset as the router's `scrollOffset`
        const top = target.getBoundingClientRect().top + view.scrollY - 64;
        view.scrollTo({ top, behavior: 'instant' });
      }
      cancel();
    });
  }

  private initializeSpotlight(): void {
    const view = this.document.defaultView;
    if (!view?.matchMedia('(pointer: fine)').matches)
      return;

    const el = this.host.nativeElement;
    let frame = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--spot-x', `${e.clientX}px`);
        el.style.setProperty('--spot-y', `${e.clientY}px`);
        el.classList.add('spotlight-on');
      });
    };

    // Outside Angular so mouse movement doesn't trigger change detection
    this.zone.runOutsideAngular(() => view.addEventListener('mousemove', onMove, { passive: true }));
    this.removeSpotlight = () => {
      cancelAnimationFrame(frame);
      view.removeEventListener('mousemove', onMove);
    };
  }

  initializeIcons(): void {
    this.icons = {
      instagram: faInstagram,
      facebook: faFacebookF,
      linkedIn: faLinkedinIn
    };
  }

}
