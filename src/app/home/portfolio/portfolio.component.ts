import { Component, OnInit } from '@angular/core';
import { ICategory } from 'src/app/shared/interfaces/category';
import { IPortfolioItem } from 'src/app/shared/interfaces/portfolio-item';
import { GeneralService } from '../../shared/services/general.service';
declare var $: any;

@Component({
    selector: 'adl-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.css'],
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
