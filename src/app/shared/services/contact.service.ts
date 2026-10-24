import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** Forminit (formerly Getform) form ID, from the Forminit dashboard */
const FORM_ID = 'c609d121-46a0-489a-a3ed-c5dea446f4c1';
const ENDPOINT = `https://forminit.com/f/${FORM_ID}`;

export interface IContactMessage {
  name: string;
  email: string;
  message: string;
  /** Honeypot: humans never fill it; Forminit rejects submissions where it has a value */
  gotcha: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) {}

  /**
   * Sends the message to Forminit. Field names follow Forminit's `fi-{block}-{property}` convention;
   * fields without that prefix are dropped. Errors carry the HTTP status (429 = sent too soon).
   */
  send({ name, email, message, gotcha }: IContactMessage): Observable<{ success: boolean }> {
    const body = new FormData();
    body.append('fi-sender-fullName', name);
    body.append('fi-sender-email', email);
    body.append('fi-text-message', message);
    body.append('_gotcha', gotcha);

    return this.http.post<{ success: boolean }>(ENDPOINT, body, {
      headers: { Accept: 'application/json' }
    });
  }
}
