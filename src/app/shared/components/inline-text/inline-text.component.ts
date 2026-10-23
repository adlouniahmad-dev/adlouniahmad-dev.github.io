import { Component, Input } from '@angular/core';
import { InlineMarkdownPipe } from '../../pipes/inline-markdown.pipe';

/** Renders a string with `**highlight**` and `[text](url)` markup as plain elements. */
@Component({
    selector: 'adl-inline-text',
    template: `
      <!-- no whitespace inside the cases, or it ends up in the sentence -->
      @for (segment of text | inlineMarkdown; track $index) {
        @switch (segment.type) {
          @case ('strong') {<strong class="highlight">{{ segment.text }}</strong>}
          @case ('link') {<a [href]="segment.href" target="_blank" rel="noopener" (click)="$event.stopPropagation()">{{ segment.text }}</a>}
          @default {<ng-container>{{ segment.text }}</ng-container>}
        }
      }
    `,
    styles: `
      .highlight {
        font-weight: 600;
        color: var(--text);
      }

      a {
        color: var(--text);
        background-image: linear-gradient(var(--accent), var(--accent));
        background-size: 0 1px;
        background-position: 0 100%;
        background-repeat: no-repeat;
        transition: background-size .3s ease, color .2s ease;
      }

      a:hover {
        color: var(--accent-text);
        background-size: 100% 1px;
      }
    `,
    imports: [InlineMarkdownPipe]
})
export class InlineTextComponent {

  @Input() text: string;

}
