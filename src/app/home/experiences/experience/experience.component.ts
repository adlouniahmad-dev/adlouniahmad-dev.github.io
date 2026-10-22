import { Component, HostListener, Input, ChangeDetectionStrategy } from '@angular/core';
import { IExperience } from '../../../shared/interfaces/experience';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

@Component({
    selector: 'adl-experience',
    templateUrl: './experience.component.html',
    styleUrl: './experience.component.css',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ExperienceComponent {

  @Input() experience: IExperience;

  get period(): string {
    const { start, end } = this.experience;
    return `${this.formatMonth(start)} — ${end ? this.formatMonth(end) : 'Present'}`;
  }

  @HostListener('click')
  onClick(): void {
    window.open(this.experience.company.url, '_blank');
  }

  /** `2023-12` -> `Dec 2023` */
  private formatMonth(value: string): string {
    const [year, month] = value.split('-');
    return `${MONTHS[+month - 1]} ${year}`;
  }

}
