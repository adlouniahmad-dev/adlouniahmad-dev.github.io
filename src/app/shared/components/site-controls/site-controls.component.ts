import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import { ThemeService } from '../../theme/theme.service';

/** Language switch and light/dark toggle, shown together wherever the site offers controls. */
@Component({
    selector: 'adl-site-controls',
    template: `
      <a class="control lang" [routerLink]="switchLink" [attr.hreflang]="otherLang" [attr.lang]="otherLang"
        [attr.aria-label]="'switchLangLabel' | t" [title]="'switchLangLabel' | t">{{ 'switchLang' | t }}</a>
      <button type="button" class="control theme" (click)="theme.toggle()"
        [attr.aria-label]="(theme.theme === 'light' ? 'theme.toDark' : 'theme.toLight') | t"
        [title]="(theme.theme === 'light' ? 'theme.toDark' : 'theme.toLight') | t">
        @if (theme.theme === 'light') {
          <!-- moon -->
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"/></svg>
        } @else {
          <!-- sun -->
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4.2"/>
            <path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/>
          </svg>
        }
      </button>
    `,
    styles: `
      :host {
        display: inline-flex;
        align-items: center;
        gap: .4rem;
      }

      .control {
        display: inline-grid;
        place-items: center;
        height: 2.6rem;
        color: var(--text-muted);
        border: 1px solid var(--border);
        border-radius: 999px;
        background: var(--bg-raised);
        transition: color .2s ease, border-color .2s ease, transform .2s ease;
      }

      .control:hover {
        color: var(--text);
        border-color: var(--border-strong);
        transform: translateY(-2px);
      }

      .lang {
        padding: 0 1rem;
        font-size: .82rem;
        font-weight: 600;
      }

      .theme {
        width: 2.6rem;
        padding: 0;
      }

      svg {
        width: 1.05rem;
        height: 1.05rem;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SiteControlsComponent {

  /** Language-neutral path of the current page, e.g. `/` or `/projects/ask` */
  @Input() path = '/';

  constructor(private language: LanguageService, public theme: ThemeService) {}

  get otherLang(): 'en' | 'ar' {
    return this.language.lang === 'ar' ? 'en' : 'ar';
  }

  get switchLink(): string {
    return this.language.pathIn(this.otherLang, this.path);
  }

}
