import { Component, Input } from '@angular/core';

let nextId = 0;

/**
 * The AA monogram (two interlocked A's), optionally followed by the
 * "ahmad adlouni." wordmark. The first A uses the current text color.
 * Same artwork as src/assets/icons/monogram.svg.
 */
@Component({
    selector: 'adl-logo',
    template: `
      <svg class="monogram" viewBox="20 20 472 456" aria-hidden="true">
        <defs>
          <linearGradient [attr.id]="id + '-accent'" gradientUnits="userSpaceOnUse" x1="60" y1="60" x2="452" y2="452">
            <stop offset="0" stop-color="#f6b17a"/>
            <stop offset=".55" stop-color="#f472b6"/>
            <stop offset="1" stop-color="#a78bfa"/>
          </linearGradient>
          <!-- gaps where one A passes over the other -->
          <mask [attr.id]="id + '-under-first'" maskUnits="userSpaceOnUse">
            <rect width="512" height="512" fill="#fff"/>
            <path d="M190 452 L322 100 L454 452" fill="none" stroke="#000" stroke-width="92" stroke-miterlimit="10"/>
          </mask>
          <clipPath [attr.id]="id + '-weave'"><rect y="312" width="512" height="200"/></clipPath>
          <mask [attr.id]="id + '-under-second'" maskUnits="userSpaceOnUse">
            <rect width="512" height="512" fill="#fff"/>
            <path d="M58 452 L190 100 L322 452" fill="none" stroke="#000" stroke-width="92" stroke-miterlimit="10"
              [attr.clip-path]="'url(#' + id + '-weave)'"/>
          </mask>
        </defs>
        <g fill="none" stroke-miterlimit="10">
          <g [attr.mask]="'url(#' + id + '-under-first)'">
            <path d="M58 452 L190 100 L322 452" stroke="currentColor" stroke-width="50"/>
            <path d="M110 340 H270" stroke="currentColor" stroke-width="40"/>
          </g>
          <g [attr.mask]="'url(#' + id + '-under-second)'">
            <path d="M190 452 L322 100 L454 452" [attr.stroke]="'url(#' + id + '-accent)'" stroke-width="50"/>
            <path d="M242 340 H402" [attr.stroke]="'url(#' + id + '-accent)'" stroke-width="40"/>
          </g>
        </g>
      </svg>
      @if (wordmark) {
        <span class="wordmark">ahmad adlouni<span class="dot">.</span></span>
      }
    `,
    styles: `
      :host {
        /* a Latin brand lockup: keep "ahmad adlouni." left-to-right on Arabic pages too */
        direction: ltr;
        display: inline-flex;
        align-items: center;
        gap: .6em;
        color: var(--text);
      }

      .monogram {
        display: block;
        width: 1.9em;
        height: auto;
        flex: none;
      }

      .wordmark {
        font-weight: 800;
        letter-spacing: -.045em;
        white-space: nowrap;
      }

      .dot {
        background: var(--gradient);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
    `,
})
export class LogoComponent {

  @Input() wordmark = false;

  readonly id = `adl-logo-${nextId++}`;

}
