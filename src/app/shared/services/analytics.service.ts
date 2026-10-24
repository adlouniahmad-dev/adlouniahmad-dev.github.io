import { Inject, Injectable, DOCUMENT } from '@angular/core';

type Gtag = (...args: unknown[]) => void;

/** Google Analytics events. gtag is a no-op stub off the live site (see index.html). */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(@Inject(DOCUMENT) private document: Document) {}

  /** Google Analytics' recommended event for contact requests */
  trackLead(method: string): void {
    this.gtag?.('event', 'generate_lead', { method });
  }

  private get gtag(): Gtag | undefined {
    return (this.document.defaultView as { gtag?: Gtag } | null)?.gtag;
  }

}
