import { Inject, Injectable, DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { LanguageService } from '../i18n/language.service';
import { Lang } from '../i18n/strings';

export interface IPageMeta {
  title: string;
  description: string;
  /** Path relative to the site root, in the page's language, e.g. `/ar/projects/ask/` */
  path: string;
}

const ORIGIN = 'https://adlouniahmad-dev.github.io';

/** Keep in sync with the og:image tags in index.html */
const SHARE_IMAGE = {
  url: ORIGIN + '/assets/og-image.png',
  width: '1200',
  height: '630',
};

const OG_LOCALE: Record<Lang, string> = { en: 'en_US', ar: 'ar_AR' };

/**
 * Updates title, description, canonical URL, share tags and the hreflang alternates per page
 * (also when prerendering, so every static page ships with its own tags).
 */
@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private title: Title,
    private meta: Meta,
    private language: LanguageService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  update(page: IPageMeta): void {
    const url = ORIGIN + page.path;
    const lang = this.language.lang;
    const other: Lang = lang === 'ar' ? 'en' : 'ar';
    this.title.setTitle(page.title);

    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:locale', content: OG_LOCALE[lang] });
    this.meta.updateTag({ property: 'og:locale:alternate', content: OG_LOCALE[other] });
    this.meta.updateTag({ name: 'twitter:title', content: page.title });
    this.meta.updateTag({ name: 'twitter:description', content: page.description });

    // One branded 1200x630 card for every page: project logos are WebP, which some link previews don't support
    const alt = this.language.t('seo.imageAlt');
    this.meta.updateTag({ property: 'og:image', content: SHARE_IMAGE.url });
    this.meta.updateTag({ property: 'og:image:width', content: SHARE_IMAGE.width });
    this.meta.updateTag({ property: 'og:image:height', content: SHARE_IMAGE.height });
    this.meta.updateTag({ property: 'og:image:alt', content: alt });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:image', content: SHARE_IMAGE.url });
    this.meta.updateTag({ name: 'twitter:image:alt', content: alt });

    this.setLink('canonical', url);
    // Tell search engines about the same page in the other language
    const trailingSlash = page.path !== '/' && page.path.endsWith('/') ? '/' : '';
    const enPath = this.language.pathIn('en', page.path.replace(/\/$/, '') || '/');
    const arPath = this.language.pathIn('ar', page.path.replace(/\/$/, '') || '/');
    this.setLink('alternate', ORIGIN + enPath + (enPath === '/' ? '' : trailingSlash), 'en');
    this.setLink('alternate', ORIGIN + arPath + '/', 'ar');
    this.setLink('alternate', ORIGIN + enPath + (enPath === '/' ? '' : trailingSlash), 'x-default');
  }

  private setLink(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
    let link = this.document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.document.createElement('link');
      link.rel = rel;
      if (hreflang)
        link.hreflang = hreflang;
      this.document.head.appendChild(link);
    }
    link.href = href;
  }

}
