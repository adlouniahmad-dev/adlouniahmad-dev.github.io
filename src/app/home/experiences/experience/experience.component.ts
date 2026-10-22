import { Component, HostListener, Input } from '@angular/core';
import { IExperiece } from 'src/app/shared/interfaces/experiece';

@Component({
    selector: 'adl-experience',
    templateUrl: './experience.component.html',
    styleUrl: './experience.component.css',
    standalone: false
})
export class ExperienceComponent {

  @Input() experience: IExperiece;

  @HostListener('click')
  onClick(): void {
    window.open(this.experience.companyLink, '_blank');
  }

}
