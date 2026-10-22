import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'adl-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
