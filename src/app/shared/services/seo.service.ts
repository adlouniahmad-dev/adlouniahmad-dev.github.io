import { Inject, Injectable, DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface IPageMeta {
  title: string;
  description: string;
  /** Path relative to the site root, e.g. `/projects/ask` */
  path: string;
}

const ORIGIN = 'https://adlouniahmad-dev.github.io';

/** Keep in sync with the og:image tags in index.html */
const SHARE_IMAGE = {
  url: ORIGIN + '/assets/og-image.png',
  width: '1200',
  height: '630',
  alt: 'Ahmad Adlouni, Senior Software Engineer: Frontend and Angular',
};

/** Keep in sync with the defaults in index.html */
const DEFAULTS: IPageMeta = {
  title: 'Ahmad Adlouni - Senior Software Engineer',
  description: 'Senior Software Engineer at Siren Analytics with 7+ years of experience building responsive, accessible and scalable web applications for government, enterprise and digital-service platforms. Specialised in Angular, TypeScript and frontend architecture.',
  path: '/',
};

/** Updates title, description, canonical URL and share tags per page (also when prerendering). */
@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  reset(): void {
    this.update(DEFAULTS);
  }

  update(page: IPageMeta): void {
    const url = ORIGIN + page.path;
    this.title.setTitle(page.title);

    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ name: 'twitter:title', content: page.title });
    this.meta.updateTag({ name: 'twitter:description', content: page.description });

    // One branded 1200x630 card for every page: project logos are WebP, which some link previews don't support
    const image = SHARE_IMAGE;
    this.meta.updateTag({ property: 'og:image', content: image.url });
    this.meta.updateTag({ property: 'og:image:width', content: image.width });
    this.meta.updateTag({ property: 'og:image:height', content: image.height });
    this.meta.updateTag({ property: 'og:image:alt', content: image.alt });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:image', content: image.url });
    this.meta.updateTag({ name: 'twitter:image:alt', content: image.alt });

    const canonical = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical)
      canonical.href = url;
  }

}
