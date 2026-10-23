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

Output goes to `dist/adlouniahmad-portfolio/browser/`. The home page (`/`) is prerendered into `index.html` and each project into `projects/<id>/index.html` (new projects in `info.json` are picked up automatically); other routes are rendered client-side from `index.csr.html`, which the build also copies to `404.html` so GitHub Pages serves the app's own 404 page for unknown URLs.

Prerendered routes are configured in [`app.routes.server.ts`](src/app/app.routes.server.ts). Code that touches `window` or `document` must only run in the browser (guard it with `isPlatformBrowser`), otherwise the build fails while prerendering.

## Deployment

Pushing to `main` triggers the [Deploy workflow](.github/workflows/deploy.yml), which builds the site and publishes it to the `gh-pages` branch that GitHub Pages serves. It can also be run manually from the **Actions** tab.

`npm run deploy` still works as a manual fallback; run `npm run build` first.
