export enum ProjectStatus {
  /** Shown with an "In progress" badge and no images */
  InProgress = 'in-progress',
}

/** In-progress work never shows images */
export function isInProgress(item: { status?: ProjectStatus }): boolean {
  return item?.status === ProjectStatus.InProgress;
}
