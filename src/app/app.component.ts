import { Component, OnInit, ChangeDetectionStrategy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SwUpdate } from '@angular/service-worker';
import { filter } from 'rxjs/operators'
import { LanguageService } from './shared/i18n/language.service';

@Component({
    selector: 'adl-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent implements OnInit {

  constructor(
    private swUpdate: SwUpdate,
    @Inject(PLATFORM_ID) private platformId: object,
    // created here so it's listening before the first navigation sets the page language
    _language: LanguageService,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId))
      return;

    if (this.swUpdate.isEnabled)
      this.swUpdate.versionUpdates
        .pipe(filter(e => e.type === 'VERSION_READY'))
        .subscribe(() => window.location.reload());
  }

}
