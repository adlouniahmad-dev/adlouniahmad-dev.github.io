import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { IPortfolioItem } from '../shared/interfaces/portfolio-item';
import { GeneralService } from '../shared/services/general.service';
import { SeoService } from '../shared/services/seo.service';
import { LanguageService } from '../shared/i18n/language.service';
import { kindKey } from '../shared/i18n/strings';
import { ProjectStage } from '../shared/enums/project-stage';
import { isInProgress } from '../shared/enums/project-status';
import { SiteControlsComponent } from '../shared/components/site-controls/site-controls.component';
import { LogoComponent } from '../shared/components/logo/logo.component';
import { ProjectCoverComponent } from '../shared/components/project-cover/project-cover.component';
import { TranslatePipe } from '../shared/i18n/translate.pipe';

@Component({
    selector: 'adl-portfolio-item',
    templateUrl: './portfolio-item.component.html',
    styleUrls: ['./portfolio-item.component.css'],
    imports: [RouterLink, SiteControlsComponent, LogoComponent, ProjectCoverComponent, TranslatePipe]
})
export class PortfolioItemComponent implements OnInit, OnDestroy {

  @ViewChild('lightbox') lightbox: ElementRef<HTMLDialogElement>;

  product: IPortfolioItem;
  previous: IPortfolioItem;
  next: IPortfolioItem;
  activeShot = 0;

  readonly kindKey = kindKey;

  private routeSub: Subscription;

  constructor(
    private generalService: GeneralService,
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService,
    private language: LanguageService,
    private cdr: ChangeDetectorRef,
  ) {}

  get homeLink(): string {
    return this.language.homePath;
  }

  link(...segments: string[]): string[] {
    return this.language.link(...segments);
  }

  get inProgress(): boolean {
    return isInProgress(this.product);
  }

  get early(): boolean {
    return this.product?.stage === ProjectStage.Early;
  }

  get screenshots(): string[] {
    if (this.inProgress)
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
    const found = this.generalService.getPortfolioItem(id);
    if (!found) {
      // Unknown project: show the 404 page without changing the URL
      this.router.navigate(this.language.link('404'), { skipLocationChange: true });
      return;
    }

    this.closeLightbox();
    ({ item: this.product, previous: this.previous, next: this.next } = found);
    // the param changes outside a template event (e.g. browser back/forward)
    this.cdr.markForCheck();

    this.seo.update({
      title: this.product.name + this.language.t('seo.titleSuffix'),
      description: this.product.details.description[0],
      path: `/projects/${this.product.id}`,
    });
  }

}
