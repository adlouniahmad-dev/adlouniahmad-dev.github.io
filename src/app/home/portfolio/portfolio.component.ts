import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ICategory } from '../../shared/interfaces/category';
import { IPortfolioItem } from '../../shared/interfaces/portfolio-item';
import { GeneralService } from '../../shared/services/general.service';

@Component({
    selector: 'adl-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PortfolioComponent implements OnInit {

  portfolioItems: Array<IPortfolioItem> = [];
  categories: Array<ICategory> = [];
  filterValue: string = "*"

  constructor(private generalService: GeneralService) { 
  }

  ngOnInit(): void {
    this.categories = this.generalService.getCategories();
    this.portfolioItems = this.generalService.getPortfolioItems();
  }

  filterPortfolioItems(category: ICategory): void {
    this.categories.forEach(category => {
      category.active = false;
    });
    category.active = true;
    this.filterValue = category.value;
  }

  

}
