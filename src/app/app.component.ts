import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from './shared/i18n/language.service';
import { AppUpdateService } from './shared/services/app-update.service';

@Component({
    selector: 'adl-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [RouterOutlet]
})
export class AppComponent implements OnInit {

  constructor(
    private appUpdate: AppUpdateService,
    // created here so it's listening before the first navigation sets the page language
    _language: LanguageService,
  ) {}

  ngOnInit(): void {
    this.appUpdate.applyOnNextPage();
  }

}
