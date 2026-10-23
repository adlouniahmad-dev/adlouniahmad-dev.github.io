import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from './language.service';
import { StringKey } from './strings';

/**
 * `{{ 'send' | t }}` or `{{ 'showProjects' | t: { n: 9 } }}`. Pure is fine: switching language navigates to
 * a different route, which recreates the components.
 */
@Pipe({
  name: 't',
  standalone: false
})
export class TranslatePipe implements PipeTransform {

  constructor(private language: LanguageService) {}

  transform(key: StringKey, params?: Record<string, string | number>): string {
    return this.language.t(key, params);
  }

}
