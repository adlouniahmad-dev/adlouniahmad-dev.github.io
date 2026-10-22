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

  readonly positions: IExperience[];
  readonly internships: IExperience[];

  constructor(generalService: GeneralService) {
    const all = generalService.getExperience();
    this.positions = all.filter(experience => experience.type !== 'internship');
    this.internships = all.filter(experience => experience.type === 'internship');
  }

}
