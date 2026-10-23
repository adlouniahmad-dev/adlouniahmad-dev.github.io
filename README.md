# Ahmad Adlouni — Portfolio

Personal portfolio site, live at **<https://adlouniahmad-dev.github.io/>**.

Built with Angular 22, Bootstrap 5, Font Awesome and AOS scroll animations, and installable as a PWA via the Angular service worker. The home page and every project page are prerendered to static HTML at build time so crawlers and link previews see the full content.

## Getting started

Requires **Node 24** (see [`.nvmrc`](.nvmrc)).

```bash
nvm use          # switch to the Node version in .nvmrc
npm install
npm start        # dev server at http://localhost:4200
```

## Updating content

All site content lives in [`src/app/shared/services/info.json`](src/app/shared/services/info.json), with the Arabic version in [`info.ar.json`](src/app/shared/services/info.ar.json). No component changes are needed to update it.

The site is bilingual: English at `/` and Arabic (right-to-left) at `/ar/`, both prerendered. **The two content files must keep the same structure**, so when you add or change something in `info.json` (a project, an experience entry, a highlight), make the same change in `info.ar.json`, translating only the text. Interface text (buttons, labels, form messages) is in [`strings.ts`](src/app/shared/i18n/strings.ts); templates use it as `{{ 'key' | t }}`.

| Key          | What it controls                                                     |
| ------------ | -------------------------------------------------------------------- |
| `info`       | Name, job title and the paragraphs of the About section              |
| `experience` | Work history entries (position, company, period, description, tags)  |
| `contact`    | Email and location shown in the sidebar                              |
| `social`     | Social profile links shown in the sidebar                            |
| `categories` | Filter categories for the Projects section                           |
| `portfolio`  | Projects with images, links and details (one page per `id`)          |
| `recommendations` | Quotes from colleagues, e.g. LinkedIn recommendations (`quote`, `name`, `title`, optional `relationship` and `url`). The section is hidden while the list is empty. |

Images go in [`src/assets/img/`](src/assets/img/). Keep them small: export at the size they're displayed and prefer WebP.

The contact form posts to [Forminit](https://forminit.com) (formerly Getform). The form ID is in [`contact.service.ts`](src/app/shared/services/contact.service.ts); fields use Forminit's `fi-…` names, and `_gotcha` is the spam honeypot.

## Project structure

```text
src/app/
├── home/              # Main page: about, experience, projects and contact
├── portfolio-item/    # Project detail page (/projects/:id)
├── page-not-found/    # 404 page
└── shared/
    ├── components/    # Navigation and footer
    ├── interfaces/    # TypeScript types for info.json
    └── services/      # Content (info.json) and contact form services
```

## Building

```bash
npm run build
```

Output goes to `dist/adlouniahmad-portfolio/browser/`. Every page is prerendered to static HTML in both languages: `/` and `/ar/`, and each project at `projects/<id>/` and `ar/projects/<id>/` (new projects in `info.json` are picked up automatically). After the Angular build, [`scripts/postbuild.mjs`](scripts/postbuild.mjs) writes `sitemap.xml` and copies the client-side shell to `404.html`, so GitHub Pages serves the app's own 404 page for unknown URLs.

Prerendered routes are configured in [`app.routes.server.ts`](src/app/app.routes.server.ts). Code that touches `window` or `document` must only run in the browser (guard it with `isPlatformBrowser`), otherwise the build fails while prerendering.

## Testing

Both commands run against the production build, so run `npm run build` first. They serve it the way GitHub Pages does ([`scripts/serve-dist.mjs`](scripts/serve-dist.mjs), port 4317).

```bash
npm test             # Playwright end-to-end tests (e2e/): home, projects, contact form, Arabic pages, theme, SEO files
npm run lighthouse   # Lighthouse CI: fails below 70 performance or 95 accessibility, best practices and SEO
```

Locally the tests use your installed Chrome; CI installs Playwright's Chromium. The performance budget is lower than the scores you'll see locally (90+) because GitHub's shared runners are slower and noisier; it's there to catch big regressions. The contact form tests mock Forminit, so nothing is sent.

## Deployment

The [CI workflow](.github/workflows/ci.yml) runs on every push and pull request: it builds the site, runs the end-to-end tests and the Lighthouse budgets. On pushes to `main`, once those pass, it publishes the tested build to the `gh-pages` branch that GitHub Pages serves. It can also be run manually from the **Actions** tab.
