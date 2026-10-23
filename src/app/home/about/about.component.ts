import { Component } from '@angular/core';
import { IInfo } from '../../shared/interfaces/info';
import { GeneralService } from '../../shared/services/general.service';
import { InlineTextComponent } from '../../shared/components/inline-text/inline-text.component';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';

@Component({
    selector: 'adl-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
    imports: [InlineTextComponent, TranslatePipe]
})
export class AboutComponent {

  info: IInfo;

  constructor(private generalService: GeneralService) { 
    this.info = generalService.getBasicInfo();
  }

}
