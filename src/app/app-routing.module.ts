import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { PortfolioItemComponent } from './portfolio-item/portfolio-item.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    data: { lang: 'en' }
  },
  {
    path: 'projects/:id',
    component: PortfolioItemComponent,
    data: { lang: 'en' }
  },
  // Arabic: the same pages under /ar, right-to-left
  {
    path: 'ar',
    component: HomeComponent,
    pathMatch: 'full',
    data: { lang: 'ar' }
  },
  {
    path: 'ar/projects/:id',
    component: PortfolioItemComponent,
    data: { lang: 'ar' }
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

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
      scrollOffset: [0, 64]
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
