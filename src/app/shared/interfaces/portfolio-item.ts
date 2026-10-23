import { IPortfolioItemDetails } from './portfolio-item-details';

export interface IPortfolioItem {
    id: string,
    name: string,
    year: number,
    /** Early projects are listed separately, in a compact "Early work" list */
    stage?: 'early',
    /** Work in progress: shown with an "In progress" badge and no images */
    status?: 'in-progress',
    /** Who the work is for, e.g. "Freelance" or a company name */
    context?: string,
    tags: string,
    link?: string,
    languages: string,
    /** 16:9 cover image; a typographic placeholder is shown when missing */
    featuredImage?: string,
    details: IPortfolioItemDetails
}