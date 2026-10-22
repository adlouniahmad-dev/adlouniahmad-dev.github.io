import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, DOCUMENT } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type ScrollSpy from 'bootstrap/js/dist/scrollspy';
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
  private scrollSpy: ScrollSpy;
  private destroyed = false;

  constructor(
    generalService: GeneralService,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document,
  ) { 
    this.info = generalService.getBasicInfo();
  }

  ngOnInit(): void {
    this.initializeIcons();
  }

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId))
      return;

    // Bootstrap's scrollspy touches `window` when imported, so load it only in the browser
    const { default: ScrollSpyCtor } = await import('bootstrap/js/dist/scrollspy');
    if (!this.destroyed)
      this.scrollSpy = new ScrollSpyCtor(this.document.body, { target: '#menu' });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.scrollSpy?.dispose();
  }

  initializeIcons(): void {
    this.icons = {
      instagram: faInstagram,
      facebook: faFacebookF,
      linkedIn: faLinkedinIn
    };
  }

}
