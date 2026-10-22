import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { faLink, faInfo } from '@fortawesome/free-solid-svg-icons';
import { IPortfolioItem } from '../../../shared/interfaces/portfolio-item';

@Component({
    selector: 'adl-product-item',
    templateUrl: './product-item.component.html',
    styleUrls: ['./product-item.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ProductItemComponent implements OnInit {

  @Input() item: IPortfolioItem;
  icons: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.initializeIcons();
  }

  initializeIcons(): void {
    this.icons = {
      link: faLink,
      info: faInfo
    };
  }

  goToLink(): void {
    window.open(this.item.link, '_blank');
  }

  navigateToDetails(id: string): void {
    this.router.navigate(['/portfolio', id]);
  }

}
