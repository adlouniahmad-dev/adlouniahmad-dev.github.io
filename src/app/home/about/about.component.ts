import { Component, OnInit } from '@angular/core';
import { faTerminal } from '@fortawesome/free-solid-svg-icons';
import { IInfo } from 'src/app/shared/interfaces/info';
import { GeneralService } from 'src/app/shared/services/general.service';

@Component({
    selector: 'adl-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
    standalone: false
})
export class AboutComponent implements OnInit {

  icons: any;
  info: IInfo;

  constructor(private generalService: GeneralService) { 
    this.info = generalService.getBasicInfo();
  }

  ngOnInit(): void {
    this.initializeIcons();
  }

  initializeIcons(): void {
    this.icons = {
      terminal: faTerminal
    };
  }

}
