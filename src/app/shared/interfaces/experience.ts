export interface ICompany {
  name: string;
  url: string;
}

/** A bullet point, optionally with its own nested list. */
export type IHighlight = string | { text: string; items: string[] };

export interface IExperience {
  position: string;
  company: ICompany;
  /** `YYYY-MM` */
  start: string;
  /** `YYYY-MM`, or `null` for a current position */
  end: string | null;
  summary?: string;
  highlights?: IHighlight[];
  skills: string[];
}
