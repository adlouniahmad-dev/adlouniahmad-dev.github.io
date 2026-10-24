import { Component, OnInit } from '@angular/core';
import { CategoryValue, ICategory } from '../../shared/interfaces/category';
import { IPortfolioItem } from '../../shared/interfaces/portfolio-item';
import { GeneralService } from '../../shared/services/general.service';
import { LanguageService } from '../../shared/i18n/language.service';
import { StorageService } from '../../shared/services/storage.service';
import { ProjectStage } from '../../shared/enums/project-stage';
import { ProductItemComponent } from './product-item/product-item.component';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';
import { StorageArea } from '../../shared/enums/storage-area';

const ALL: CategoryValue = '*';
/** Remembers whether "Early work" is expanded, so it stays open when coming back from a project */
const EARLY_OPEN_KEY = 'adl.earlyWorkOpen';

@Component({
    selector: 'adl-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.css'],
    imports: [ProductItemComponent, RouterLink, TranslatePipe]
})
export class PortfolioComponent implements OnInit {

  featured: Array<IPortfolioItem> = [];
  early: Array<IPortfolioItem> = [];
  categories: Array<ICategory> = [];
  counts: Partial<Record<CategoryValue, number>> = {};
  filterValue: CategoryValue = ALL;
  /** e.g. "2019 – 2020" */
  earlyRange = '';
  earlyOpen = false;

  constructor(
    private generalService: GeneralService,
    private language: LanguageService,
    private storage: StorageService,
  ) {}

  link(...segments: string[]): string[] {
    return this.language.link(...segments);
  }

  ngOnInit(): void {
    const items = this.generalService.getPortfolioItems();
    const newestFirst = (a: IPortfolioItem, b: IPortfolioItem) => b.year - a.year;
    this.featured = items.filter(item => item.stage !== ProjectStage.Early).sort(newestFirst);
    this.early = items.filter(item => item.stage === ProjectStage.Early).sort(newestFirst);

    const years = this.early.map(item => item.year);
    const [from, to] = [Math.min(...years), Math.max(...years)];
    this.earlyRange = from === to ? `${from}` : `${from} – ${to}`;

    // The filters only apply to the early-work list
    this.categories = this.generalService.getCategories();
    for (const category of this.categories)
      this.counts[category.value] = this.early.filter(item => this.matches(item, category.value)).length;

    this.earlyOpen = this.storage.get(StorageArea.Session, EARLY_OPEN_KEY) === '1';
  }

  onEarlyToggle(event: Event): void {
    this.earlyOpen = (event.target as HTMLDetailsElement).open;
    this.storage.set(StorageArea.Session, EARLY_OPEN_KEY, this.earlyOpen ? '1' : '0');
  }

  get visibleEarly(): Array<IPortfolioItem> {
    return this.early.filter(item => this.matches(item, this.filterValue));
  }

  private matches(item: IPortfolioItem, value: CategoryValue): boolean {
    return value === ALL || item.tags === value;
  }

}
