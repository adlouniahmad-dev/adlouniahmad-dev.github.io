import { Component } from '@angular/core';
import { IExperience } from '../../shared/interfaces/experience';
import { ExperienceType } from '../../shared/enums/experience-type';
import { GeneralService } from '../../shared/services/general.service';
import { ExperienceComponent } from './experience/experience.component';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';

@Component({
    selector: 'adl-experiences',
    templateUrl: './experiences.component.html',
    styleUrl: './experiences.component.css',
    imports: [ExperienceComponent, TranslatePipe]
})
export class ExperiencesComponent {

  readonly positions: IExperience[];
  readonly internships: IExperience[];

  constructor(generalService: GeneralService) {
    const all = generalService.getExperience();
    this.positions = all.filter(experience => experience.type !== ExperienceType.Internship);
    this.internships = all.filter(experience => experience.type === ExperienceType.Internship);
  }

}
