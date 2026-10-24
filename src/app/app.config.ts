import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ViewportScroller } from '@angular/common';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { SCROLL_OFFSET } from './shared/services/scroll.service';

// No zone.js: Angular is zoneless by default, and components refresh through signals,
// template events and markForCheck
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })),
    // Anchor scrolling leaves the same space above the section as ScrollService.settleOnFragment
    provideAppInitializer(() => inject(ViewportScroller).setOffset([0, SCROLL_OFFSET])),
    provideHttpClient(withXhr()),
    provideClientHydration(withEventReplay()),
    provideServiceWorker('ngsw-worker.js', { enabled: environment.production }),
    // Register only the icons used by name in templates; whole packs added ~1.3 MB to the bundle
    provideAppInitializer(() => inject(FaIconLibrary).addIcons(faEnvelope, faLocationDot)),
  ]
};
