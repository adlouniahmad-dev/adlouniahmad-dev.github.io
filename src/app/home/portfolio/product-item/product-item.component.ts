import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { IPortfolioItem } from '../../../shared/interfaces/portfolio-item';

@Component({
    selector: 'adl-product-item',
    templateUrl: './product-item.component.html',
    styleUrls: ['./product-item.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ProductItemComponent {

  @Input() item: IPortfolioItem;

}
