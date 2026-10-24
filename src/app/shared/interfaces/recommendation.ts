export interface IRecommendation {
  /** The recommendation text, as written by the person (supports **bold**) */
  quote: string;
  name: string;
  /** e.g. "Engineering Manager at Siren Analytics" */
  title: string;
  /** e.g. "Managed Ahmad directly" */
  relationship?: string;
  /** Their LinkedIn profile or the recommendation itself */
  url?: string;
}
