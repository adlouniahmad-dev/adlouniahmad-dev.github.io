import { Component } from '@angular/core';
import { IExperiece } from 'src/app/shared/interfaces/experiece';
import { GeneralService } from 'src/app/shared/services/general.service';

@Component({
    selector: 'adl-experiences',
    templateUrl: './experiences.component.html',
    styleUrl: './experiences.component.css',
    standalone: false
})
export class ExperiencesComponent {

  constructor(private generalService: GeneralService) {}

  get experiences(): IExperiece[] {
    return this.generalService.getExperience();
  }

}
