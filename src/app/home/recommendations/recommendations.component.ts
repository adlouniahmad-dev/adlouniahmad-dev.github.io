import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IRecommendation } from '../../shared/interfaces/recommendation';
import { GeneralService } from '../../shared/services/general.service';

/** Quotes from colleagues (e.g. LinkedIn recommendations). The section only renders when there are some. */
@Component({
    selector: 'adl-recommendations',
    templateUrl: './recommendations.component.html',
    styleUrls: ['./recommendations.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class RecommendationsComponent {

  readonly recommendations: IRecommendation[];

  constructor(generalService: GeneralService) {
    this.recommendations = generalService.getRecommendations();
  }

}
