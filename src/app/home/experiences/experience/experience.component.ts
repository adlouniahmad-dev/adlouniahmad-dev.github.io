import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { IExperience, IRole } from '../../../shared/interfaces/experience';
import { LanguageService } from '../../../shared/i18n/language.service';
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
    return this.language.formatPeriod(this.experience.start, this.experience.end);
  }

  /** Cards without a company link aren't clickable */
  @HostBinding('class.linked')
  get linked(): boolean {
    return !!this.experience.company.url;
  }

  rolePeriod(role: IRole): string {
    return this.language.formatPeriod(role.start, role.end);
  }

  @HostListener('click')
  onClick(): void {
    if (this.linked)
      window.open(this.experience.company.url, '_blank');
  }

}
