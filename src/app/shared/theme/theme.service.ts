import { Inject, Injectable, PLATFORM_ID, DOCUMENT, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'adl.theme';
const THEME_COLOR: Record<Theme, string> = { dark: '#0a0e1a', light: '#f8fafc' };

/**
 * Light/dark theme. Dark is the default; index.html applies the saved choice before the first paint,
 * and this service toggles and saves it.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  /** A signal, so every toggle on the page updates, not just the one clicked */
  readonly theme = signal<Theme>('dark');

  constructor(@Inject(DOCUMENT) private document: Document, @Inject(PLATFORM_ID) platformId: object) {
    if (!isPlatformBrowser(platformId))
      return;

    this.theme.set(this.document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  }

  toggle(): void {
    const next: Theme = this.theme() === 'light' ? 'dark' : 'light';
    this.apply(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage unavailable: the choice lasts for this page view
    }
  }

  private apply(theme: Theme): void {
    this.theme.set(theme);
    this.document.documentElement.setAttribute('data-theme', theme);
    this.document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  }

}
