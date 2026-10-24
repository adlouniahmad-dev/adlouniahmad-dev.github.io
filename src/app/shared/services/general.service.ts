import { Injectable } from '@angular/core';
import { IPortfolioItem } from '../interfaces/portfolio-item';
import { ICategory } from '../interfaces/category';
import en from './info.json';
import ar from './info.ar.json';
import { LanguageService } from '../i18n/language.service';
import { ISocialNetwork } from '../interfaces/social-network';
import { IInfo } from '../interfaces/info';
import { IExperience } from '../interfaces/experience';
import { IContactInfo } from '../interfaces/contact-info';
import { IRecommendation } from '../interfaces/recommendation';
import { Lang } from '../enums/lang';
import { ProjectKind } from '../enums/project-kind';
import { ProjectStage } from '../enums/project-stage';
import { ProjectStatus } from '../enums/project-status';
import { ExperienceType } from '../enums/experience-type';

/**
 * The JSON is only cast to the interfaces, so check the values the code branches on. A misspelled value
 * throws while the pages are prerendered, which fails the build.
 */
function checkContent(file: string, data: typeof en): void {
  const check = (value: unknown, allowed: unknown[], where: string) => {
    if (!allowed.includes(value))
      throw new Error(`${file}: unknown value ${JSON.stringify(value)} in ${where}`);
  };
  const optional = (values: string[]) => [undefined, ...values];

  for (const item of data.portfolio as Array<{ id: string, tags: string, stage?: string, status?: string }>) {
    check(item.tags, Object.values(ProjectKind), `${item.id}.tags`);
    check(item.stage, optional(Object.values(ProjectStage)), `${item.id}.stage`);
    check(item.status, optional(Object.values(ProjectStatus)), `${item.id}.status`);
  }
  for (const category of data.categories)
    check(category.value, ['*', ...Object.values(ProjectKind)], `categories.${category.name}`);
  for (const experience of data.experience as Array<{ position: string, type?: string }>)
    check(experience.type, optional(Object.values(ExperienceType)), `${experience.position}.type`);
}

checkContent('info.json', en);
checkContent('info.ar.json', ar as typeof en);

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private language: LanguageService) { }

  /** Content in the page language (info.json / info.ar.json share the same structure) */
  private get data(): typeof en {
    return this.language.lang === Lang.Ar ? ar as typeof en : en;
  }

  getBasicInfo(): IInfo {
    return this.data.info as IInfo;
  }

  getExperience(): Array<IExperience> {
    return this.data.experience as Array<IExperience>;
  }

  getCategories(): Array<ICategory> {
    return this.data.categories as Array<ICategory>;
  }

  getPortfolioItems(): Array<IPortfolioItem> {
    return this.data.portfolio as Array<IPortfolioItem>;
  }

  /** A project with the ones before and after it (wrapping around), or null for an unknown ID */
  getPortfolioItem(id: string): { item: IPortfolioItem, previous: IPortfolioItem, next: IPortfolioItem } | null {
    const items = this.getPortfolioItems();
    const index = items.findIndex(item => item.id === id);
    if (index < 0)
      return null;
    return {
      item: items[index],
      previous: items[(index - 1 + items.length) % items.length],
      next: items[(index + 1) % items.length],
    };
  }

  getRecommendations(): Array<IRecommendation> {
    return (this.data.recommendations ?? []) as Array<IRecommendation>;
  }

  getContactInfo(): IContactInfo{
    return this.data.contact;
  }

  getSocialNetworks(): Array<ISocialNetwork> {
    return this.data.social;
  }

}
