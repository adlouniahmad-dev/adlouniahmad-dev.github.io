import { IPortfolioItem } from './portfolio-item';
import { IPortfolioItemLink } from './portfolio-item-link';

export interface IPortfolioItemDetails {
    description: Array<string>;
    techDescription: Array<string>;
    tags: Array<string>;
    screenshots?: Array<string>;
    links?: Array<IPortfolioItemLink>;
    /** What building the project taught me (shown on early work) */
    lesson?: string;
    /** Shown when the project can no longer be visited, e.g. "No longer online" */
    availability?: string;
}