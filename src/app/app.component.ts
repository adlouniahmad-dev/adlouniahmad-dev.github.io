import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SwUpdate } from '@angular/service-worker';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, pairwise, startWith, switchMap, take } from 'rxjs/operators';
import { LanguageService } from './shared/i18n/language.service';

/** `/ar/projects/ask?x=1#tech` -> `/ar/projects/ask` */
const pathOf = (url: string) => url.split(/[?#]/)[0];

@Component({
    selector: 'adl-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [RouterOutlet]
})
export class AppComponent implements OnInit {

  constructor(
    private swUpdate: SwUpdate,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    // created here so it's listening before the first navigation sets the page language
    _language: LanguageService,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.swUpdate.isEnabled)
      return;

    // A new version is applied on the next move to another page, never under someone who is reading or
    // typing in the contact form. Jumps between sections of the same page (#about, #contact) don't count.
    this.swUpdate.versionUpdates.pipe(
      filter(event => event.type === 'VERSION_READY'),
      take(1),
      switchMap(() => this.router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map(event => pathOf(event.urlAfterRedirects)),
        startWith(pathOf(this.router.url)),
        pairwise(),
        filter(([before, after]) => before !== after),
        take(1),
      )),
    ).subscribe(() => window.location.reload());
  }

}
