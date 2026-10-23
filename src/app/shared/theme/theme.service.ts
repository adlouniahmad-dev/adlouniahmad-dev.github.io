import { Inject, Injectable, PLATFORM_ID, DOCUMENT } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'adl.theme';
const THEME_COLOR: Record<Theme, string> = { dark: '#0a0e1a', light: '#f8fafc' };

/**
 * Light/dark theme. index.html applies it before the first paint (saved choice, otherwise the system
 * setting); this service toggles it, saves the choice, and keeps following the system until one is made.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  theme: Theme = 'dark';

  constructor(@Inject(DOCUMENT) private document: Document, @Inject(PLATFORM_ID) platformId: object) {
    if (!isPlatformBrowser(platformId))
      return;

    this.theme = this.document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    // Follow system changes until the visitor picks a theme
    this.document.defaultView?.matchMedia('(prefers-color-scheme: light)').addEventListener('change', event => {
      if (!this.saved())
        this.apply(event.matches ? 'light' : 'dark');
    });
  }

  toggle(): void {
    const next: Theme = this.theme === 'light' ? 'dark' : 'light';
    this.apply(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage unavailable: the choice lasts for this page view
    }
  }

  private apply(theme: Theme): void {
    this.theme = theme;
    this.document.documentElement.setAttribute('data-theme', theme);
    this.document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  }

  private saved(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

}
