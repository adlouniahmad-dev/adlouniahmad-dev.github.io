import { Inject, Injectable, DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { LanguageService } from '../i18n/language.service';
import { Lang } from '../enums/lang';

export interface IPageMeta {
  title: string;
  description: string;
  /** Language-neutral path of the page, e.g. `/` or `/projects/ask` */
  path: string;
}

const ORIGIN = 'https://adlouniahmad-dev.github.io';

/** Keep in sync with the og:image tags in index.html */
const SHARE_IMAGE = {
  url: ORIGIN + '/assets/og-image.png',
  width: '1200',
  height: '630',
};

const OG_LOCALE: Record<Lang, string> = { [Lang.En]: 'en_US', [Lang.Ar]: 'ar_AR' };

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
    const lang = this.language.lang;
    const url = ORIGIN + this.canonicalPath(lang, page.path);
    this.title.setTitle(page.title);

    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:locale', content: OG_LOCALE[lang] });
    this.meta.updateTag({ property: 'og:locale:alternate', content: OG_LOCALE[this.language.otherLang] });
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
    const enUrl = ORIGIN + this.canonicalPath(Lang.En, page.path);
    this.setLink('alternate', enUrl, Lang.En);
    this.setLink('alternate', ORIGIN + this.canonicalPath(Lang.Ar, page.path), Lang.Ar);
    this.setLink('alternate', enUrl, 'x-default');
  }

  /**
   * GitHub Pages serves prerendered pages from folders, so canonical URLs have a trailing slash,
   * except the site root: `/`, `/ar/`, `/projects/ask/`, `/ar/projects/ask/`
   */
  private canonicalPath(lang: Lang, path: string): string {
    const localized = this.language.pathIn(lang, path.replace(/\/+$/, '') || '/');
    return localized === '/' ? localized : localized + '/';
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
