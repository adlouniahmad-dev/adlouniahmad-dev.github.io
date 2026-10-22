import { Pipe, PipeTransform } from '@angular/core';

export type InlineSegment =
  | { type: 'text'; text: string }
  | { type: 'strong'; text: string }
  | { type: 'link'; text: string; href: string };

const TOKEN = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;

/**
 * Splits a string using `**highlight**` and `[text](url)` into segments the
 * template can render, so content never has to go through innerHTML.
 */
@Pipe({
  name: 'inlineMarkdown',
  standalone: false
})
export class InlineMarkdownPipe implements PipeTransform {

  transform(value: string | null | undefined): InlineSegment[] {
    if (!value)
      return [];

    const segments: InlineSegment[] = [];
    let last = 0;
    for (const match of value.matchAll(TOKEN)) {
      if (match.index > last)
        segments.push({ type: 'text', text: value.slice(last, match.index) });

      if (match[1] !== undefined)
        segments.push({ type: 'strong', text: match[1] });
      else
        segments.push({ type: 'link', text: match[2], href: match[3] });

      last = match.index + match[0].length;
    }
    if (last < value.length)
      segments.push({ type: 'text', text: value.slice(last) });

    return segments;
  }

}
