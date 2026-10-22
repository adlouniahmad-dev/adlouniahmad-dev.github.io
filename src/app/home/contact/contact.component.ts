import { Component, OnInit } from '@angular/core';
import { ContactService } from 'src/app/shared/services/contact.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'adl-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css'],
    standalone: false
})
export class ContactComponent implements OnInit {

  constructor(private contactService: ContactService, private fb: UntypedFormBuilder) { }

  contactForm: UntypedFormGroup;
  showLoader: boolean = false;
  showSuccess: boolean = false;
  isSubmitted: boolean = false;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    })
  }

  get form() { return this.contactForm.controls; }

  onSubmit(): void {

    if (this.contactForm.invalid) {
      this.isSubmitted = true;
      return;
    }

    this.showLoader = true;
    const { name, email, message } = this.contactForm.value;
    this.contactService.send(name, email, message)
      .subscribe((response: string) => {
        this.isSubmitted = false;
        this.showLoader = false;
        if (response.includes('Thank You!')) {
          this.showSuccess = true;
        }
      }, (e) => {
        this.isSubmitted = false;
        this.showLoader = false;
      });
  }

}
