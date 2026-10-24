import { Inject, Injectable, PLATFORM_ID, DOCUMENT, computed, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from '../services/storage.service';
import { Theme } from '../enums/theme';
import { StorageArea } from '../enums/storage-area';

const STORAGE_KEY = 'adl.theme';
const THEME_COLOR: Record<Theme, string> = { [Theme.Dark]: '#0a0e1a', [Theme.Light]: '#f8fafc' };

/**
 * Light/dark theme. Dark is the default; index.html applies the saved choice before the first paint,
 * and this service toggles and saves it.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  /** A signal, so every toggle on the page updates, not just the one clicked */
  readonly theme = signal<Theme>(Theme.Dark);
  readonly isLight = computed(() => this.theme() === Theme.Light);

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: object,
    private storage: StorageService,
  ) {
    if (!isPlatformBrowser(platformId))
      return;

    this.theme.set(this.document.documentElement.getAttribute('data-theme') === Theme.Light ? Theme.Light : Theme.Dark);
  }

  toggle(): void {
    const next = this.theme() === Theme.Light ? Theme.Dark : Theme.Light;
    this.apply(next);
    this.storage.set(StorageArea.Local, STORAGE_KEY, next);
  }

  private apply(theme: Theme): void {
    this.theme.set(theme);
    this.document.documentElement.setAttribute('data-theme', theme);
    this.document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  }

}
