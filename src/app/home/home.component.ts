import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, DOCUMENT, ElementRef, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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

  constructor(
    generalService: GeneralService,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document,
    private host: ElementRef<HTMLElement>,
    private zone: NgZone,
  ) { 
    this.info = generalService.getBasicInfo();
  }

  ngOnInit(): void {
    this.initializeIcons();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId))
      this.initializeSpotlight();
  }

  ngOnDestroy(): void {
    this.removeSpotlight?.();
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
