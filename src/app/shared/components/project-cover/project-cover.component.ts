import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/** 16:9 typographic cover for projects that don't have a logo image. */
@Component({
    selector: 'adl-project-cover',
    template: `
      <span class="initials" aria-hidden="true">{{ initials }}</span>
      <span class="label">{{ name }}</span>
    `,
    styles: `
      :host {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: .35rem;
        aspect-ratio: 16 / 9;
        overflow: hidden;
        color: #fff;
        background:
          radial-gradient(120% 90% at 0% 0%, rgba(246, 177, 122, .9), transparent 55%),
          radial-gradient(120% 90% at 100% 100%, rgba(167, 139, 250, .95), transparent 60%),
          #f472b6;
      }

      /* Subtle grid, echoing the page background */
      :host::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(rgba(255, 255, 255, .12) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, .12) 1px, transparent 1px);
        background-size: 24px 24px;
      }

      .initials {
        position: relative;
        font-size: clamp(2rem, 6vw, 3.25rem);
        font-weight: 800;
        letter-spacing: -.04em;
        line-height: 1;
      }

      .label {
        position: relative;
        max-width: 90%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-family: var(--font-mono);
        font-size: .7rem;
        letter-spacing: .12em;
        text-transform: uppercase;
        opacity: .85;
      }
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ProjectCoverComponent {

  @Input() name: string;

  get initials(): string {
    return this.name
      .split(/\s+/)
      // skip abbreviated titles such as "Dt." or "Dr."
      .filter(word => /^\p{L}/u.test(word) && !word.endsWith('.'))
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join('');
  }

}
