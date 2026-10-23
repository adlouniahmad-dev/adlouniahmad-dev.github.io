import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { IExperience } from '../../../shared/interfaces/experience';
import { LanguageService } from '../../../shared/i18n/language.service';
import { MONTHS } from '../../../shared/i18n/strings';
import { InlineTextComponent } from '../../../shared/components/inline-text/inline-text.component';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';


@Component({
    selector: 'adl-experience',
    templateUrl: './experience.component.html',
    styleUrl: './experience.component.css',
    imports: [InlineTextComponent, TranslatePipe]
})
export class ExperienceComponent {

  @Input() experience: IExperience;

  constructor(private language: LanguageService) {}

  /** Smaller variant, used for internships */
  @HostBinding('class.compact')
  @Input() compact = false;

  get period(): string {
    return this.formatPeriod(this.experience.start, this.experience.end);
  }

  /** Cards without a company link aren't clickable */
  @HostBinding('class.linked')
  get linked(): boolean {
    return !!this.experience.company.url;
  }

  @HostListener('click')
  onClick(): void {
    if (this.linked)
      window.open(this.experience.company.url, '_blank');
  }

  formatPeriod(start: string, end: string | null): string {
    return `${this.formatMonth(start)} — ${end ? this.formatMonth(end) : this.language.t('present')}`;
  }

  /** `2023-12` -> `Dec 2023` */
  private formatMonth(value: string): string {
    const [year, month] = value.split('-');
    return `${MONTHS[this.language.lang][+month - 1]} ${year}`;
  }

}
