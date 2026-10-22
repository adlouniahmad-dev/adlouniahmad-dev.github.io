import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { GeneralService } from './shared/services/general.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'projects/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => inject(GeneralService).getPortfolioItems().map(item => ({ id: item.id }))
  },
  {
    path: 'portfolio/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
