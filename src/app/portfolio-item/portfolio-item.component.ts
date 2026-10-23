import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IPortfolioItem } from '../shared/interfaces/portfolio-item';
import { GeneralService } from '../shared/services/general.service';
import { SeoService } from '../shared/services/seo.service';
import { LanguageService } from '../shared/i18n/language.service';

@Component({
    selector: 'adl-portfolio-item',
    templateUrl: './portfolio-item.component.html',
    styleUrls: ['./portfolio-item.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PortfolioItemComponent implements OnInit, OnDestroy {

  @ViewChild('lightbox') lightbox: ElementRef<HTMLDialogElement>;

  product: IPortfolioItem;
  previous: IPortfolioItem;
  next: IPortfolioItem;
  activeShot = 0;

  private routeSub: Subscription;

  constructor(
    private generalService: GeneralService,
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService,
    private language: LanguageService,
  ) {}

  get homeLink(): string {
    return this.language.pathIn(this.language.lang, '/');
  }

  link(...segments: string[]): string[] {
    return this.language.link(...segments);
  }

  get screenshots(): string[] {
    // in-progress work never shows images
    if (this.product?.status === 'in-progress')
      return [];
    return this.product?.details.screenshots ?? [];
  }

  ngOnInit(): void {
    // The component is reused when moving between projects, so follow the param
    this.routeSub = this.route.paramMap.subscribe(params => this.load(params.get('id')));
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  openShot(index: number): void {
    this.activeShot = index;
    this.lightbox.nativeElement.showModal();
  }

  closeLightbox(): void {
    if (this.lightbox?.nativeElement.open)
      this.lightbox.nativeElement.close();
  }

  step(delta: number): void {
    const count = this.screenshots.length;
    this.activeShot = (this.activeShot + delta + count) % count;
  }

  onLightboxKeydown(event: KeyboardEvent): void {
    // arrow keys follow the reading direction
    const forward = this.language.isRtl ? 'ArrowLeft' : 'ArrowRight';
    const back = this.language.isRtl ? 'ArrowRight' : 'ArrowLeft';
    if (event.key === forward)
      this.step(1);
    else if (event.key === back)
      this.step(-1);
  }

  /** Clicks on the dialog element itself (not its content) are on the backdrop */
  onLightboxClick(event: MouseEvent): void {
    if (event.target === this.lightbox.nativeElement)
      this.closeLightbox();
  }

  private load(id: string): void {
    const items = this.generalService.getPortfolioItems();
    const index = items.findIndex(item => item.id === id);
    if (index < 0) {
      // Unknown project: show the 404 page without changing the URL
      this.router.navigate(this.language.link('404'), { skipLocationChange: true });
      return;
    }

    this.closeLightbox();
    this.product = items[index];
    this.previous = items[(index - 1 + items.length) % items.length];
    this.next = items[(index + 1) % items.length];

    this.seo.update({
      title: this.product.name + this.language.t('seo.titleSuffix'),
      description: this.product.details.description[0],
      // GitHub Pages serves prerendered pages from folders, so the canonical URL has a trailing slash
      path: this.language.pathIn(this.language.lang, `/projects/${this.product.id}`) + '/',
    });
  }

}
