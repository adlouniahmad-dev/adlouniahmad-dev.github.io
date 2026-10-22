import { Component, OnInit } from '@angular/core';
import { ISocialNetwork } from 'src/app/shared/interfaces/social-network';
import { faInstagram, faFacebookF, faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons';
import { GeneralService } from '../../services/general.service';
import { IContactInfo } from '../../interfaces/contact-info';

@Component({
    selector: 'adl-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css'],
    standalone: false
})
export class FooterComponent implements OnInit {

  icons: any;
  socialNetworks: Array<ISocialNetwork> = [];
  contactInfo: IContactInfo; 

  constructor(private generalService: GeneralService) { }

  ngOnInit(): void {
    this.initializeIcons();
    this.socialNetworks = this.generalService.getSocialNetworks();
    this.contactInfo = this.generalService.getContactInfo();
  }

  initializeIcons(): void {
    this.icons = {
      instagram: faInstagram,
      facebook: faFacebookF,
      linkedIn: faLinkedinIn,
      github: faGithub,
    }
  }

  get currentYear(): number {
    return (new Date()).getFullYear();
  }

}
