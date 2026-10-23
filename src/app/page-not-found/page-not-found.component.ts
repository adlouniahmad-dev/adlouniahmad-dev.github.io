import { Component } from '@angular/core';
import { LanguageService } from '../shared/i18n/language.service';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../shared/i18n/translate.pipe';

@Component({
    selector: 'adl-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.css'],
    imports: [RouterLink, TranslatePipe]
})
export class PageNotFoundComponent {

  readonly home: string;

  constructor(language: LanguageService) {
    this.home = language.pathIn(language.lang, '/');
  }

}
