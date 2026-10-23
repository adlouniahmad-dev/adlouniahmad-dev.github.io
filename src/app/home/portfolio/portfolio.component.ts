import { Component, OnInit, ChangeDetectionStrategy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ICategory } from '../../shared/interfaces/category';
import { IPortfolioItem } from '../../shared/interfaces/portfolio-item';
import { GeneralService } from '../../shared/services/general.service';
import { LanguageService } from '../../shared/i18n/language.service';

const ALL = '*';
/** Remembers whether "Early work" is expanded, so it stays open when coming back from a project */
const EARLY_OPEN_KEY = 'adl.earlyWorkOpen';

@Component({
    selector: 'adl-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PortfolioComponent implements OnInit {

  featured: Array<IPortfolioItem> = [];
  early: Array<IPortfolioItem> = [];
  categories: Array<ICategory> = [];
  counts: Record<string, number> = {};
  filterValue = ALL;
  /** e.g. "2019 – 2020" */
  earlyRange = '';
  earlyOpen = false;

  constructor(
    private generalService: GeneralService,
    @Inject(PLATFORM_ID) private platformId: object,
    private language: LanguageService,
  ) {}

  link(...segments: string[]): string[] {
    return this.language.link(...segments);
  }

  ngOnInit(): void {
    const items = this.generalService.getPortfolioItems();
    const newestFirst = (a: IPortfolioItem, b: IPortfolioItem) => b.year - a.year;
    this.featured = items.filter(item => item.stage !== 'early').sort(newestFirst);
    this.early = items.filter(item => item.stage === 'early').sort(newestFirst);

    const years = this.early.map(item => item.year);
    const [from, to] = [Math.min(...years), Math.max(...years)];
    this.earlyRange = from === to ? `${from}` : `${from} – ${to}`;

    // The filters only apply to the early-work list
    this.categories = this.generalService.getCategories();
    for (const category of this.categories)
      this.counts[category.value] = this.early.filter(item => this.matches(item, category.value)).length;

    this.earlyOpen = this.readEarlyOpen();
  }

  onEarlyToggle(event: Event): void {
    this.earlyOpen = (event.target as HTMLDetailsElement).open;
    try {
      sessionStorage.setItem(EARLY_OPEN_KEY, this.earlyOpen ? '1' : '0');
    } catch {
      // storage can be unavailable (e.g. blocked); the section just won't be remembered
    }
  }

  get visibleEarly(): Array<IPortfolioItem> {
    return this.early.filter(item => this.matches(item, this.filterValue));
  }

  private readEarlyOpen(): boolean {
    if (!isPlatformBrowser(this.platformId))
      return false;
    try {
      return sessionStorage.getItem(EARLY_OPEN_KEY) === '1';
    } catch {
      return false;
    }
  }

  private matches(item: IPortfolioItem, value: string): boolean {
    return value === ALL || item.tags === value;
  }

}
