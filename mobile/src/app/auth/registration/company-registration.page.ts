import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem, IonLabel, IonNote, IonSelect, IonSelectOption, IonTextarea, IonBackButton, IonSpinner } from '@ionic/angular/standalone';
import { RegistrationService } from '../../auth/services/registration.service';

@Component({
  selector: 'app-company-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonNote,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonBackButton,
    IonSpinner
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-back-button default-href="/auth/register"></ion-back-button>
        <ion-title>Register Company</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div *ngIf="successMessage" class="p-4 mb-4 bg-green-100 rounded-lg text-green-800">
        ✓ {{ successMessage }}
      </div>

      <div *ngIf="errorMessage" class="p-4 mb-4 bg-red-100 rounded-lg text-red-800">
        {{ errorMessage }}
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!successMessage">
        <ion-item>
          <ion-label position="floating">Company Name *</ion-label>
          <ion-input formControlName="companyName" placeholder="ARRVI Personal Care"></ion-input>
        </ion-item>
        <ion-note *ngIf="isFieldInvalid('companyName')" color="danger">Company name required</ion-note>

        <ion-item>
          <ion-label position="floating">Business Type *</ion-label>
          <ion-select formControlName="businessType">
            <ion-select-option value="manufacturer">Manufacturer</ion-select-option>
            <ion-select-option value="brand">Brand Owner</ion-select-option>
            <ion-select-option value="importer">Importer</ion-select-option>
            <ion-select-option value="trader">Trader</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-note *ngIf="isFieldInvalid('businessType')" color="danger">Business type required</ion-note>

        <ion-item>
          <ion-label position="floating">GSTIN *</ion-label>
          <ion-input formControlName="gstin" placeholder="22AAAAA0000A1Z5"></ion-input>
        </ion-item>
        <ion-note *ngIf="isFieldInvalid('gstin')" color="danger">Valid GSTIN required</ion-note>

        <ion-item>
          <ion-label position="floating">PAN Number *</ion-label>
          <ion-input formControlName="panNumber" placeholder="ABCDE1234F"></ion-input>
        </ion-item>
        <ion-note *ngIf="isFieldInvalid('panNumber')" color="danger">Valid PAN required</ion-note>

        <ion-item>
          <ion-label position="floating">Owner Name *</ion-label>
          <ion-input formControlName="ownerName" placeholder="Rajesh Kumar"></ion-input>
        </ion-item>
        <ion-note *ngIf="isFieldInvalid('ownerName')" color="danger">Owner name required</ion-note>

        <ion-item>
          <ion-label position="floating">Mobile Number *</ion-label>
          <ion-input formControlName="mobileNumber" type="tel" placeholder="9876543210"></ion-input>
        </ion-item>
        <ion-note *ngIf="isFieldInvalid('mobileNumber')" color="danger">Valid mobile required</ion-note>

        <ion-item>
          <ion-label position="floating">Email *</ion-label>
          <ion-input formControlName="email" type="email" placeholder="hello@arrvi.com"></ion-input>
        </ion-item>
        <ion-note *ngIf="isFieldInvalid('email')" color="danger">Valid email required</ion-note>

        <ion-item>
          <ion-label position="floating">Website (Optional)</ion-label>
          <ion-input formControlName="website" type="url" placeholder="https://arrvi.com"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Address *</ion-label>
          <ion-textarea formControlName="address" placeholder="123 Business Street"></ion-textarea>
        </ion-item>
        <ion-note *ngIf="isFieldInvalid('address')" color="danger">Address required</ion-note>

        <ion-item>
          <ion-label position="floating">State *</ion-label>
          <ion-input formControlName="state" placeholder="Gujarat"></ion-input>
        </ion-item>
        <ion-note *ngIf="isFieldInvalid('state')" color="danger">State required</ion-note>

        <ion-item>
          <ion-label position="floating">City *</ion-label>
          <ion-input formControlName="city" placeholder="Vadodara"></ion-input>
        </ion-item>
        <ion-note *ngIf="isFieldInvalid('city')" color="danger">City required</ion-note>

        <ion-item>
          <ion-label position="floating">Pincode *</ion-label>
          <ion-input formControlName="pincode" placeholder="390001"></ion-input>
        </ion-item>
        <ion-note *ngIf="isFieldInvalid('pincode')" color="danger">Pincode required</ion-note>

        <ion-item>
          <ion-label position="floating">Password *</ion-label>
          <ion-input formControlName="password" type="password" placeholder="••••••••"></ion-input>
        </ion-item>
        <ion-note *ngIf="isFieldInvalid('password')" color="danger">Strong password required</ion-note>

        <ion-item>
          <ion-label position="floating">Confirm Password *</ion-label>
          <ion-input formControlName="confirmPassword" type="password" placeholder="••••••••"></ion-input>
        </ion-item>
        <ion-note *ngIf="isFieldInvalid('confirmPassword')" color="danger">Passwords must match</ion-note>

        <div class="ion-margin-top">
          <ion-button [disabled]="!form.valid || isLoading" expand="block" color="primary" type="submit">
            <ion-spinner *ngIf="isLoading" name="crescent"></ion-spinner>
            {{ isLoading ? 'Registering...' : 'Register' }}
          </ion-button>
        </div>
      </form>
    </ion-content>
  `
})
export class CompanyRegistrationPage implements OnInit {
  form: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private router: Router
  ) {
    this.form = this.fb.group({
      companyName: ['', Validators.required],
      businessType: ['', Validators.required],
      gstin: ['', Validators.required],
      panNumber: ['', Validators.required],
      ownerName: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      website: [''],
      address: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.registrationService.registerCompany(this.form.value).subscribe({
      next: (response) => {
        this.successMessage = `${response.message}\n\nID: ${response.applicationId}\n${response.note}`;
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Registration failed';
        this.isLoading = false;
      }
    });
  }
}
