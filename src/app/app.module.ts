import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ContactComponent } from './home/contact/contact.component';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { AboutComponent } from './home/about/about.component';
import { PortfolioComponent } from './home/portfolio/portfolio.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ProductItemComponent } from './home/portfolio/product-item/product-item.component';
import { PortfolioItemComponent } from './portfolio-item/portfolio-item.component';
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ExperiencesComponent } from './home/experiences/experiences.component';
import { ExperienceComponent } from './home/experiences/experience/experience.component';
import { InlineMarkdownPipe } from './shared/pipes/inline-markdown.pipe';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    ContactComponent,
    AboutComponent,
    PortfolioComponent,
    FooterComponent,
    ProductItemComponent,
    PortfolioItemComponent,
    PageNotFoundComponent,
    ExperiencesComponent,
    ExperienceComponent,
    InlineMarkdownPipe
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CarouselModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [SwUpdate, provideHttpClient(withXhr(), withInterceptorsFromDi()), provideClientHydration(withEventReplay())]
})
export class AppModule {

  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far, fab);
  }

}
