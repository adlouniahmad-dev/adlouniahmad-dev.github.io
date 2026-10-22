import { Component, HostListener, Input, ChangeDetectionStrategy } from '@angular/core';
import { IExperiece } from '../../../shared/interfaces/experiece';

@Component({
    selector: 'adl-experience',
    templateUrl: './experience.component.html',
    styleUrl: './experience.component.css',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ExperienceComponent {

  @Input() experience: IExperiece;

  @HostListener('click')
  onClick(): void {
    window.open(this.experience.companyLink, '_blank');
  }

}
