import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, DOCUMENT, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../shared/i18n/language.service';
import { SeoService } from '../shared/services/seo.service';
import { IInfo } from '../shared/interfaces/info';
import { GeneralService } from '../shared/services/general.service';
import { LogoComponent } from '../shared/components/logo/logo.component';
import { NavigationComponent } from '../shared/components/navigation/navigation.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { AboutComponent } from './about/about.component';
import { ExperiencesComponent } from './experiences/experiences.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ContactComponent } from './contact/contact.component';
import { TranslatePipe } from '../shared/i18n/translate.pipe';

@Component({
    selector: 'adl-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    imports: [LogoComponent, NavigationComponent, FooterComponent, AboutComponent, ExperiencesComponent, RecommendationsComponent, PortfolioComponent, ContactComponent, TranslatePipe]
})
export class HomeComponent implements AfterViewInit, OnDestroy {

  info: IInfo;
  private removeSpotlight: () => void;
  private cancelFragmentScroll: () => void;

  constructor(
    generalService: GeneralService,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document,
    private host: ElementRef<HTMLElement>,
    private route: ActivatedRoute,
    private language: LanguageService,
    seo: SeoService,
  ) { 
    this.info = generalService.getBasicInfo();
    seo.update({
      title: language.t('seo.homeTitle'),
      description: language.t('seo.homeDescription'),
      // GitHub Pages serves /ar from a folder, so it's canonical with a trailing slash
      path: language.lang === 'ar' ? '/ar/' : '/',
    });
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
  scrollToTop(event: Event): void {
    event.preventDefault();
    this.document.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
  }

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

    // A plain listener, so mouse movement doesn't trigger change detection
    view.addEventListener('mousemove', onMove, { passive: true });
    this.removeSpotlight = () => {
      cancelAnimationFrame(frame);
      view.removeEventListener('mousemove', onMove);
    };
  }


}
