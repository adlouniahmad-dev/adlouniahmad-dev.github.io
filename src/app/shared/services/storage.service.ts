import { Inject, Injectable, DOCUMENT } from '@angular/core';
import { StorageArea } from '../enums/storage-area';

/**
 * Web Storage that never throws: storage can be unavailable (prerendering, or blocked by the browser),
 * in which case reads return null and writes are dropped.
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(@Inject(DOCUMENT) private document: Document) {}

  get(area: StorageArea, key: string): string | null {
    try {
      return this.storage(area)?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }

  set(area: StorageArea, key: string, value: string): void {
    try {
      this.storage(area)?.setItem(key, value);
    } catch {
      // storage unavailable: the value lasts for this page view only
    }
  }

  private storage(area: StorageArea): Storage | undefined {
    const view = this.document.defaultView;
    return area === StorageArea.Local ? view?.localStorage : view?.sessionStorage;
  }

}
