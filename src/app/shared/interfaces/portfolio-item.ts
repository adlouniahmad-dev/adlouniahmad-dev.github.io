import { IPortfolioItemDetails } from './portfolio-item-details';

export interface IPortfolioItem {
    id: string,
    name: string,
    tags: string,
    link?: string,
    languages: string,
    /** 16:9 cover image; a typographic placeholder is shown when missing */
    featuredImage?: string,
    details: IPortfolioItemDetails
}