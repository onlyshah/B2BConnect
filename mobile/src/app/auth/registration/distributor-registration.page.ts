import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem, IonLabel, IonNote, IonTextarea, IonBackButton, IonSpinner, IonList } from '@ionic/angular/standalone';
import { RegistrationService, Company } from '../../auth/services/registration.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-distributor-registration',
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
    IonTextarea,
    IonBackButton,
    IonSpinner,
    IonList
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-back-button default-href="/auth/register"></ion-back-button>
        <ion-title>Register as Distributor</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div *ngIf="errorMessage" class="p-4 mb-4 bg-red-100 rounded-lg text-red-800">
        {{ errorMessage }}
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!successMessage">
        <!-- Basic Info -->
        <h3 class="font-bold mb-2">Business Information</h3>

        <ion-item>
          <ion-label position="floating">Business Name *</ion-label>
          <ion-input formControlName="businessName"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">GSTIN *</ion-label>
          <ion-input formControlName="gstin"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">PAN Number *</ion-label>
          <ion-input formControlName="panNumber"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Owner Name *</ion-label>
          <ion-input formControlName="ownerName"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Mobile *</ion-label>
          <ion-input formControlName="mobileNumber" type="tel"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Email *</ion-label>
          <ion-input formControlName="email" type="email"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Address *</ion-label>
          <ion-textarea formControlName="address"></ion-textarea>
        </ion-item>

        <ion-item>
          <ion-label position="floating">State *</ion-label>
          <ion-input formControlName="state"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">City *</ion-label>
          <ion-input formControlName="city"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Pincode *</ion-label>
          <ion-input formControlName="pincode"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Warehouse Capacity</ion-label>
          <ion-input formControlName="warehouseCapacity" type="number"></ion-input>
        </ion-item>

        <!-- Company Selection -->
        <h3 class="font-bold mb-2 mt-6">Apply To Companies</h3>

        <ion-item>
          <ion-label position="floating">Search Companies</ion-label>
          <ion-input [formControl]="companySearchControl" placeholder="Search..."></ion-input>
        </ion-item>

        <div *ngIf="filteredCompanies.length > 0" class="ion-margin">
          <ion-list>
            <ion-item *ngFor="let company of filteredCompanies" button="true" (click)="selectCompany(company)">
              <ion-label>
                <p class="font-bold">{{ company.name }}</p>
                <p>{{ company.city }}, {{ company.state }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </div>

        <div *ngIf="selectedCompanies.length > 0" class="ion-margin">
          <h4 class="font-bold mb-2">Selected ({{ selectedCompanies.length }})</h4>
          <ion-list>
            <ion-item *ngFor="let company of selectedCompanies" button="true" (click)="removeCompany(company._id)">
              <ion-label>{{ company.name }}</ion-label>
            </ion-item>
          </ion-list>
        </div>

        <!-- Password -->
        <h3 class="font-bold mb-2 mt-6">Credentials</h3>

        <ion-item>
          <ion-label position="floating">Password *</ion-label>
          <ion-input formControlName="password" type="password"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Confirm Password *</ion-label>
          <ion-input formControlName="confirmPassword" type="password"></ion-input>
        </ion-item>

        <div class="ion-margin-top">
          <ion-button [disabled]="!form.valid || isLoading || selectedCompanies.length === 0" expand="block" color="primary" type="submit">
            <ion-spinner *ngIf="isLoading" name="crescent"></ion-spinner>
            Submit
          </ion-button>
        </div>
      </form>

      <div *ngIf="successMessage" class="p-4 bg-green-100 rounded-lg text-green-800">
        ✓ {{ successMessage }}
      </div>
    </ion-content>
  `
})
export class DistributorRegistrationPage implements OnInit {
  form: FormGroup;
  companySearchControl = new FormControl('');
  filteredCompanies: Company[] = [];
  selectedCompanies: Company[] = [];
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private router: Router
  ) {
    this.form = this.fb.group({
      businessName: ['', Validators.required],
      gstin: ['', Validators.required],
      panNumber: ['', Validators.required],
      ownerName: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', Validators.required],
      warehouseCapacity: [null],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.companySearchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query || query.length < 2) return [];
        return this.registrationService.searchCompanies(query);
      })
    ).subscribe({
      next: (result) => {
        this.filteredCompanies = result.companies || [];
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  selectCompany(company: Company): void {
    if (!this.selectedCompanies.find(c => c._id === company._id)) {
      this.selectedCompanies.push(company);
    }
    this.companySearchControl.reset();
    this.filteredCompanies = [];
  }

  removeCompany(companyId: string): void {
    this.selectedCompanies = this.selectedCompanies.filter(c => c._id !== companyId);
  }

  onSubmit(): void {
    if (!this.form.valid || this.selectedCompanies.length === 0) {
      this.errorMessage = 'Please fill all fields and select companies';
      return;
    }

    this.isLoading = true;
    const formData = {
      ...this.form.value,
      companyIds: this.selectedCompanies.map(c => c._id)
    };

    this.registrationService.registerDistributor(formData).subscribe({
      next: (response) => {
        this.successMessage = `${response.message}\n\nID: ${response.applicationId}`;
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
