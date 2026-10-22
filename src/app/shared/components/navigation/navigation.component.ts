import { Component, ChangeDetectionStrategy, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, DOCUMENT, NgZone, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'adl-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NavigationComponent implements AfterViewInit, OnDestroy {

  links: Array<{ name: string, href: string }> = [
    { name: 'about', href: '#about' },
    { name: 'experience', href: '#experience' },
    // { name: 'projects', href: '#projects' },
  ];

  activeHref = this.links[0].href;
  private removeListeners: () => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId))
      return;

    const view = this.document.defaultView;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => this.updateActive(view));
    };

    // Outside Angular so scrolling only triggers change detection when the active link changes
    this.zone.runOutsideAngular(() => {
      view.addEventListener('scroll', onScroll, { passive: true });
      view.addEventListener('resize', onScroll, { passive: true });
    });
    this.removeListeners = () => {
      cancelAnimationFrame(frame);
      view.removeEventListener('scroll', onScroll);
      view.removeEventListener('resize', onScroll);
    };

    this.updateActive(view);
  }

  ngOnDestroy(): void {
    this.removeListeners?.();
  }

  /**
   * The active section is the last one whose top has scrolled past a line a
   * third of the way down the viewport; at the very bottom it's the last one.
   */
  private updateActive(view: Window): void {
    const sections = this.links
      .map(link => ({ href: link.href, el: this.document.querySelector<HTMLElement>(link.href) }))
      .filter(s => s.el);
    if (!sections.length)
      return;

    const atBottom = view.innerHeight + view.scrollY >= this.document.documentElement.scrollHeight - 2;
    const line = view.innerHeight / 3;
    let active = sections[0].href;
    for (const { href, el } of sections) {
      if (el.getBoundingClientRect().top <= line)
        active = href;
    }
    if (atBottom)
      active = sections[sections.length - 1].href;

    if (active !== this.activeHref)
      this.zone.run(() => {
        this.activeHref = active;
        this.cdr.markForCheck();
      });
  }

}
