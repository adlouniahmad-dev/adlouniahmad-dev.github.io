import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { IPortfolioItem } from '../../../shared/interfaces/portfolio-item';
import { LanguageService } from '../../../shared/i18n/language.service';

@Component({
    selector: 'adl-product-item',
    templateUrl: './product-item.component.html',
    styleUrls: ['./product-item.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ProductItemComponent {

  @Input() item: IPortfolioItem;

  constructor(private language: LanguageService) {}

  get link(): string[] {
    return this.language.link('projects', this.item.id);
  }

}
