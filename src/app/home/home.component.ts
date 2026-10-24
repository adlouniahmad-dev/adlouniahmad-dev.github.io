import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, DOCUMENT, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../shared/i18n/language.service';
import { SeoService } from '../shared/services/seo.service';
import { ScrollService } from '../shared/services/scroll.service';
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
import { NavigationVariant } from '../shared/enums/navigation-variant';

@Component({
    selector: 'adl-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    imports: [LogoComponent, NavigationComponent, FooterComponent, AboutComponent, ExperiencesComponent, RecommendationsComponent, PortfolioComponent, ContactComponent, TranslatePipe]
})
export class HomeComponent implements AfterViewInit, OnDestroy {

  info: IInfo;
  readonly NavigationVariant = NavigationVariant;
  private removeSpotlight: () => void;
  private cancelFragmentScroll: () => void;

  constructor(
    generalService: GeneralService,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document,
    private host: ElementRef<HTMLElement>,
    private route: ActivatedRoute,
    private scroll: ScrollService,
    language: LanguageService,
    seo: SeoService,
  ) { 
    this.info = generalService.getBasicInfo();
    seo.update({
      title: language.t('seo.homeTitle'),
      description: language.t('seo.homeDescription'),
      path: '/',
    });
  }


  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId))
      return;

    this.initializeSpotlight();
    this.cancelFragmentScroll = this.scroll.settleOnFragment(this.route.snapshot.fragment);
  }

  ngOnDestroy(): void {
    this.removeSpotlight?.();
    this.cancelFragmentScroll?.();
  }

  scrollToTop(event: Event): void {
    event.preventDefault();
    this.scroll.scrollToTop();
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
