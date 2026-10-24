import { Component, computed, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ContactService } from '../../shared/services/contact.service';
import { AnalyticsService } from '../../shared/services/analytics.service';
import { GeneralService } from '../../shared/services/general.service';
import { LanguageService } from '../../shared/i18n/language.service';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';
import { ContactState } from '../../shared/enums/contact-state';

@Component({
    selector: 'adl-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css'],
    imports: [ReactiveFormsModule, TranslatePipe]
})
export class ContactComponent {

  readonly email: string;
  // signals, so the view updates when the request settles
  readonly state = signal(ContactState.Idle);
  readonly sending = computed(() => this.state() === ContactState.Sending);
  readonly sent = computed(() => this.state() === ContactState.Sent);
  readonly failed = computed(() => this.state() === ContactState.Error);
  readonly errorMessage = signal('');
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
    private analytics: AnalyticsService,
    generalService: GeneralService,
    private language: LanguageService,
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
    if (this.form.invalid || this.sending())
      return;

    this.state.set(ContactState.Sending);
    this.contactService.send(this.form.getRawValue()).subscribe({
      next: () => {
        this.state.set(ContactState.Sent);
        this.analytics.trackLead('contact_form');
        this.form.reset();
        this.submitted = false;
      },
      error: (error: HttpErrorResponse) => {
        this.state.set(ContactState.Error);
        this.errorMessage.set(this.language.t(error.status === 429 ? 'error.rateLimit' : 'error.generic'));
      },
    });
  }

  sendAnother(): void {
    this.state.set(ContactState.Idle);
  }

}
