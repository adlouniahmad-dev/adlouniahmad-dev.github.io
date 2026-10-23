import { Inject, Injectable, DOCUMENT } from '@angular/core';
import { ActivationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Lang, STRINGS, StringKey } from './strings';

/**
 * The page language comes from the route: Arabic pages live under /ar. Set before each route's components
 * are created (ActivationStart), so they read the right language from the start, also when prerendering.
 */
@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  lang: Lang = 'en';

  constructor(router: Router, @Inject(DOCUMENT) private document: Document) {
    router.events
      .pipe(filter((event): event is ActivationStart => event instanceof ActivationStart))
      .subscribe(({ snapshot }) => {
        const lang: Lang = snapshot.data['lang'] ?? (snapshot.url[0]?.path === 'ar' ? 'ar' : 'en');
        this.setLang(lang);
      });
  }

  get isRtl(): boolean {
    return this.lang === 'ar';
  }

  /** Interface text, with `{name}` placeholders filled from `params` */
  t(key: StringKey, params?: Record<string, string | number>): string {
    let text = STRINGS[this.lang][key] ?? STRINGS.en[key] ?? key;
    for (const [name, value] of Object.entries(params ?? {}))
      text = text.replace(`{${name}}`, String(value));
    return text;
  }

  /** Router link for a path in the current language, e.g. ['projects', 'ask'] -> /ar/projects/ask */
  link(...segments: string[]): string[] {
    return this.lang === 'ar' ? ['/ar', ...segments] : ['/', ...segments];
  }

  /** URL path of the same page in a given language */
  pathIn(lang: Lang, path: string): string {
    const neutral = path.replace(/^\/ar(?=\/|$)/, '') || '/';
    if (lang === 'en')
      return neutral;
    return neutral === '/' ? '/ar' : `/ar${neutral}`;
  }

  private setLang(lang: Lang): void {
    this.lang = lang;
    const html = this.document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

}
