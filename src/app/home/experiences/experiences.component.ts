import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IExperiece } from '../../shared/interfaces/experiece';
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

  get experiences(): IExperiece[] {
    return this.generalService.getExperience();
  }

}
