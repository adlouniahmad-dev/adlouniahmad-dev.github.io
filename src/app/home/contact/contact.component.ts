import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ContactService } from '../../shared/services/contact.service';
import { GeneralService } from '../../shared/services/general.service';

type State = 'idle' | 'sending' | 'sent' | 'error';

@Component({
    selector: 'adl-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ContactComponent {

  readonly email: string;
  state: State = 'idle';
  errorMessage = '';
  submitted = false;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
    gotcha: [''],
  });

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    generalService: GeneralService,
  ) {
    this.email = generalService.getContactInfo().email;
  }

  /** Show a field's error once the user has left it or tried to submit */
  showError(field: 'name' | 'email' | 'message'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted);
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid || this.state === 'sending')
      return;

    this.state = 'sending';
    this.contactService.send(this.form.getRawValue()).subscribe({
      next: () => {
        this.state = 'sent';
        // Google Analytics' recommended event for contact requests (gtag is a no-op stub off the live site)
        (window as { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'generate_lead', { method: 'contact_form' });
        this.form.reset();
        this.submitted = false;
      },
      error: (error: HttpErrorResponse) => {
        this.state = 'error';
        this.errorMessage = error.status === 429
          ? 'Messages can only be sent once every few seconds. Please wait a moment and try again.'
          : 'Something went wrong and your message wasn\'t sent.';
      },
    });
  }

  sendAnother(): void {
    this.state = 'idle';
  }

}
