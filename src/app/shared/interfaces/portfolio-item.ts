import { IPortfolioItemDetails } from './portfolio-item-details';

export interface IPortfolioItem {
    id: string,
    name: string,
    year: number,
    /** Early projects are listed separately, in a compact "Early work" list */
    stage?: 'early',
    tags: string,
    link?: string,
    languages: string,
    /** 16:9 cover image; a typographic placeholder is shown when missing */
    featuredImage?: string,
    details: IPortfolioItemDetails
}