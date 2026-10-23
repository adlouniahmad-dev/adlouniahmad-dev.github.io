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

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private language: LanguageService) { }

  /** Content in the page language (info.json / info.ar.json share the same structure) */
  private get data(): typeof en {
    return this.language.lang === 'ar' ? ar as typeof en : en;
  }

  getBasicInfo(): IInfo {
    return this.data.info as IInfo;
  }

  getExperience(): Array<IExperience> {
    return this.data.experience as Array<IExperience>;
  }

  getCategories(): Array<ICategory> {
    return this.data.categories;
  }

  getPortfolioItems(): Array<IPortfolioItem> {
    return this.data.portfolio as Array<IPortfolioItem>;
  }

  getPortfolioItemDetails(id: string): IPortfolioItem {
    return (this.data.portfolio as Array<IPortfolioItem>).find((item: any) => item.id === id);
  }

  getContactInfo(): IContactInfo{
    return this.data.contact;
  }

  getSocialNetworks(): Array<ISocialNetwork> {
    return this.data.social;
  }

}
