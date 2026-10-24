import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, DOCUMENT, ChangeDetectorRef, Input, HostBinding } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StringKey } from '../../i18n/strings';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { NavigationVariant } from '../../enums/navigation-variant';

@Component({
    selector: 'adl-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css'],
    imports: [TranslatePipe]
})
export class NavigationComponent implements AfterViewInit, OnDestroy {

  links: Array<{ label: StringKey, href: string }> = [
    { label: 'nav.about', href: '#about' },
    { label: 'nav.experience', href: '#experience' },
    { label: 'nav.projects', href: '#projects' },
    { label: 'nav.contact', href: '#contact' },
  ];

  @Input() variant = NavigationVariant.Sidebar;

  @HostBinding('class.bar')
  get isBar(): boolean {
    return this.variant === NavigationVariant.Bar;
  }

  activeHref = this.links[0].href;
  private removeListeners: () => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document,
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

    // Plain listeners: scrolling only triggers change detection when the active link changes
    view.addEventListener('scroll', onScroll, { passive: true });
    view.addEventListener('resize', onScroll, { passive: true });
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

    if (active !== this.activeHref) {
      this.activeHref = active;
      this.cdr.markForCheck();
    }
  }

}
