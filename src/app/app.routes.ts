import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PortfolioItemComponent } from './portfolio-item/portfolio-item.component';
import { Lang } from './shared/enums/lang';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    data: { lang: Lang.En }
  },
  {
    path: 'projects/:id',
    component: PortfolioItemComponent,
    data: { lang: Lang.En }
  },
  // Arabic: the same pages under /ar, right-to-left
  {
    path: 'ar',
    component: HomeComponent,
    pathMatch: 'full',
    data: { lang: Lang.Ar }
  },
  {
    path: 'ar/projects/:id',
    component: PortfolioItemComponent,
    data: { lang: Lang.Ar }
  },
  {
    // Version 1 URLs
    path: 'portfolio/:id',
    redirectTo: 'projects/:id'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
