import { Component } from '@angular/core';
import { IRecommendation } from '../../shared/interfaces/recommendation';
import { GeneralService } from '../../shared/services/general.service';
import { InlineTextComponent } from '../../shared/components/inline-text/inline-text.component';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';

/** Quotes from colleagues (e.g. LinkedIn recommendations). The section only renders when there are some. */
@Component({
    selector: 'adl-recommendations',
    templateUrl: './recommendations.component.html',
    styleUrls: ['./recommendations.component.css'],
    imports: [InlineTextComponent, TranslatePipe]
})
export class RecommendationsComponent {

  readonly recommendations: IRecommendation[];

  constructor(generalService: GeneralService) {
    this.recommendations = generalService.getRecommendations();
  }

}
