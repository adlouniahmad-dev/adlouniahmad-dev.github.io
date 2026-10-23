import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LanguageService } from '../shared/i18n/language.service';

@Component({
    selector: 'adl-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PageNotFoundComponent {

  readonly home: string;

  constructor(language: LanguageService) {
    this.home = language.pathIn(language.lang, '/');
  }

}
