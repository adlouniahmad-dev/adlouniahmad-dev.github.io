import { IPortfolioItemDetails } from './portfolio-item-details';
import { ProjectKind } from '../enums/project-kind';
import { ProjectStage } from '../enums/project-stage';
import { ProjectStatus } from '../enums/project-status';

export interface IPortfolioItem {
    id: string,
    name: string,
    year: number,
    /** Early projects are listed separately, in a compact "Early work" list */
    stage?: ProjectStage,
    /** Work in progress: shown with an "In progress" badge and no images */
    status?: ProjectStatus,
    /** Who the work is for, e.g. "Freelance" or a company name */
    context?: string,
    tags: ProjectKind,
    link?: string,
    languages: string,
    /** 16:9 cover image; a typographic placeholder is shown when missing */
    featuredImage?: string,
    /** Letters for the typographic cover; defaults to the name's initials */
    initials?: string,
    details: IPortfolioItemDetails
}