import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IInfo } from '../../shared/interfaces/info';
import { GeneralService } from '../../shared/services/general.service';

@Component({
    selector: 'adl-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AboutComponent {

  info: IInfo;

  constructor(private generalService: GeneralService) { 
    this.info = generalService.getBasicInfo();
  }

}
