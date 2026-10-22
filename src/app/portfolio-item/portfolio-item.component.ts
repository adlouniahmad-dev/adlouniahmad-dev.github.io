import { Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faExpand, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { IPortfolioItem } from '../shared/interfaces/portfolio-item';
import { GeneralService } from '../shared/services/general.service';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'adl-portfolio-item',
    templateUrl: './portfolio-item.component.html',
    styleUrls: ['./portfolio-item.component.css'],
    standalone: false
})
export class PortfolioItemComponent implements OnInit, OnDestroy {

  @ViewChild('galleryContainer') galleryContainer: ElementRef;

  expandIcon: IconDefinition = faExpand
  product: IPortfolioItem;

  constructor(
    private generalService: GeneralService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.product = this.generalService.getPortfolioItemDetails(id);
    if (!this.product)
      this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    const lb = this.document.querySelector('crystal-lightbox');
    if (lb)
      this.renderer.removeChild(this.document, lb);
  }

  openGallery(): void {
    this.galleryContainer.nativeElement.children[0].click();
  }

}
