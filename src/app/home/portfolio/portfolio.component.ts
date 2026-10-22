import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ICategory } from '../../shared/interfaces/category';
import { IPortfolioItem } from '../../shared/interfaces/portfolio-item';
import { GeneralService } from '../../shared/services/general.service';

const ALL = '*';

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
  counts: Record<string, number> = {};
  filterValue = ALL;

  constructor(private generalService: GeneralService) {}

  ngOnInit(): void {
    this.categories = this.generalService.getCategories();
    this.portfolioItems = this.generalService.getPortfolioItems();
    for (const category of this.categories)
      this.counts[category.value] = this.portfolioItems.filter(item => this.matches(item, category.value)).length;
  }

  get visibleItems(): Array<IPortfolioItem> {
    return this.portfolioItems.filter(item => this.matches(item, this.filterValue));
  }

  private matches(item: IPortfolioItem, value: string): boolean {
    return value === ALL || item.tags === value;
  }

}
