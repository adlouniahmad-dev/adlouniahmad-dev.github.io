import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IExperience } from '../../shared/interfaces/experience';
import { GeneralService } from '../../shared/services/general.service';

@Component({
    selector: 'adl-experiences',
    templateUrl: './experiences.component.html',
    styleUrl: './experiences.component.css',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ExperiencesComponent {

  constructor(private generalService: GeneralService) {}

  get experiences(): IExperience[] {
    return this.generalService.getExperience();
  }

}
