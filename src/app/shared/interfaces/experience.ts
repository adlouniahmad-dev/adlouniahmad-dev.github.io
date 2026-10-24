import { ExperienceType } from '../enums/experience-type';

export interface ICompany {
  name: string;
  url?: string;
}

/** A title held during part of a position, e.g. before and after a promotion. */
export interface IRole {
  title: string;
  /** `YYYY-MM` */
  start: string;
  /** `YYYY-MM`, or `null` for the current title */
  end: string | null;
}

/** A bullet point (supports `**bold**` and `[text](url)`), optionally with its own nested list. */
export type IHighlight = string | { text: string; items: string[] };

export interface IExperience {
  position: string;
  /** Internships are listed separately, after regular positions */
  type?: ExperienceType;
  company: ICompany;
  location?: string;
  /** `YYYY-MM` */
  start: string;
  /** `YYYY-MM`, or `null` for a current position */
  end: string | null;
  /** Title history, newest first; only needed when the title changed */
  roles?: IRole[];
  summary?: string;
  highlights?: IHighlight[];
  skills: string[];
}
