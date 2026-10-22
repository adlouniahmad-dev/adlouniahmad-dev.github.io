import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { filter } from 'rxjs/operators'
import AOS from 'aos';

@Component({
    selector: 'adl-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit {

  constructor(private swUpdate: SwUpdate) {}

  ngOnInit(): void {
    AOS.init({
      once: true
    });

    this.swUpdate.versionUpdates
      .pipe(filter(e => e.type === 'VERSION_READY'))
      .subscribe(() => window.location.reload());
  }

}
