import { Component, Input } from '@angular/core';
import { IPortfolioItem } from '../../../shared/interfaces/portfolio-item';
import { LanguageService } from '../../../shared/i18n/language.service';
import { kindKey } from '../../../shared/i18n/strings';
import { isInProgress } from '../../../shared/enums/project-status';
import { RouterLink } from '@angular/router';
import { ProjectCoverComponent } from '../../../shared/components/project-cover/project-cover.component';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';

@Component({
    selector: 'adl-product-item',
    templateUrl: './product-item.component.html',
    styleUrls: ['./product-item.component.css'],
    imports: [RouterLink, ProjectCoverComponent, TranslatePipe]
})
export class ProductItemComponent {

  @Input() item: IPortfolioItem;

  readonly kindKey = kindKey;
  get inProgress(): boolean {
    return isInProgress(this.item);
  }

  constructor(private language: LanguageService) {}

  get link(): string[] {
    return this.language.link('projects', this.item.id);
  }

}
