import { ProjectKind } from '../enums/project-kind';

/** `*` shows every kind */
export type CategoryValue = ProjectKind | '*';

export interface ICategory {
    name: string;
    value: CategoryValue;
    active: boolean;
}