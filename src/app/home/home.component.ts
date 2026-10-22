import { Component, OnInit } from '@angular/core';
import { IInfo } from '../shared/interfaces/info';
import { GeneralService } from '../shared/services/general.service';
import { faFacebookF, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

@Component({
    selector: 'adl-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: false
})
export class HomeComponent implements OnInit {

  icons: any;
  info: IInfo;

  constructor(generalService: GeneralService) { 
    this.info = generalService.getBasicInfo();
  }

  ngOnInit(): void {
    this.initializeIcons();
  }

  initializeIcons(): void {
    this.icons = {
      instagram: faInstagram,
      facebook: faFacebookF,
      linkedIn: faLinkedinIn
    };
  }

}
