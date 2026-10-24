import { Inject, Injectable, PLATFORM_ID, DOCUMENT } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SwUpdate } from '@angular/service-worker';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, pairwise, startWith, switchMap, take } from 'rxjs/operators';

/** `/ar/projects/ask?x=1#tech` -> `/ar/projects/ask` */
const pathOf = (url: string) => url.split(/[?#]/)[0];

/** Applies new versions of the site downloaded by the service worker. */
@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {

  constructor(
    private swUpdate: SwUpdate,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  /**
   * A new version is applied on the next move to another page, never under someone who is reading or
   * typing in the contact form. Jumps between sections of the same page (#about, #contact) don't count.
   */
  applyOnNextPage(): void {
    if (!isPlatformBrowser(this.platformId) || !this.swUpdate.isEnabled)
      return;

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
    ).subscribe(() => this.document.location.reload());
  }

}
