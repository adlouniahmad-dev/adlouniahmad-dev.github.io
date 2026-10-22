import { Injectable } from '@angular/core';
import { IPortfolioItem } from '../interfaces/portfolio-item';
import { ICategory } from '../interfaces/category';
import data from './info.json';
import { ISocialNetwork } from '../interfaces/social-network';
import { IInfo } from '../interfaces/info';
import { IExperiece } from '../interfaces/experiece';
import { IContactInfo } from '../interfaces/contact-info';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor() { }

  getBasicInfo(): IInfo {
    return data.info as IInfo;
  }

  getExperience(): Array<IExperiece> {
    return data.experience;
  }

  getCategories(): Array<ICategory> {
    return data.categories;
  }

  getPortfolioItems(): Array<IPortfolioItem> {
    return data.portfolio;
  }

  getPortfolioItemDetails(id: string): IPortfolioItem {
    return (data.portfolio as Array<IPortfolioItem>).find((item: any) => item.id === id);
  }

  getContactInfo(): IContactInfo{
    return data.contact;
  }

  getSocialNetworks(): Array<ISocialNetwork> {
    return data.social;
  }

}
