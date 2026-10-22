export interface IAbout {
    /** Supports `**highlight**` and `[link text](url)` */
    paragraphs: string[];
    skills: string[];
    signOff?: string;
}

export interface IInfo {
    name: string;
    position: string;
    about: IAbout;
}
