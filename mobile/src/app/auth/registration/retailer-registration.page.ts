import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem, IonLabel, IonNote, IonTextarea, IonBackButton, IonSpinner, IonList, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { RegistrationService, Distributor } from '../../auth/services/registration.service';

@Component({
  selector: 'app-retailer-registration',
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
    IonList,
    IonSelect,
    IonSelectOption
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-back-button default-href="/auth/register"></ion-back-button>
        <ion-title>Register Store</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <h3 class="font-bold mb-2">Store Information</h3>

        <ion-item>
          <ion-label position="floating">Store Name *</ion-label>
          <ion-input formControlName="storeName"></ion-input>
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
          <ion-label position="floating">Category *</ion-label>
          <ion-select formControlName="storeCategory">
            <ion-select-option value="kirana">Kirana</ion-select-option>
            <ion-select-option value="super-market">Super Market</ion-select-option>
            <ion-select-option value="medical">Medical</ion-select-option>
            <ion-select-option value="cosmetics">Cosmetics</ion-select-option>
            <ion-select-option value="general-store">General Store</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Address *</ion-label>
          <ion-textarea formControlName="address"></ion-textarea>
        </ion-item>

        <ion-item>
          <ion-label position="floating">State *</ion-label>
          <ion-input formControlName="state" (ionChange)="onLocationChange()"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">City *</ion-label>
          <ion-input formControlName="city" (ionChange)="onLocationChange()"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Pincode *</ion-label>
          <ion-input formControlName="pincode"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Latitude *</ion-label>
          <ion-input formControlName="latitude" type="number" step="0.0001" (ionChange)="onLocationChange()"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Longitude *</ion-label>
          <ion-input formControlName="longitude" type="number" step="0.0001" (ionChange)="onLocationChange()"></ion-input>
        </ion-item>

        <h3 class="font-bold mb-2 mt-6">Select Distributor</h3>

        <div *ngIf="isSearchingDistributors" class="ion-margin">
          Searching nearby distributors...
        </div>

        <ion-list *ngIf="!isSearchingDistributors && nearbyDistributors.length > 0">
          <ion-item 
            *ngFor="let dist of nearbyDistributors"
            button="true"
            (click)="selectDistributor(dist)"
            [color]="selectedDistributorId === dist.id ? 'primary' : ''">
            <ion-label>
              <p class="font-bold">{{ dist.name }}</p>
              <p>{{ dist.city }}, {{ dist.state }}</p>
            </ion-label>
          </ion-item>
        </ion-list>

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
          <ion-button [disabled]="!form.valid || isLoading || !selectedDistributorId" expand="block" color="primary" type="submit">
            <ion-spinner *ngIf="isLoading" name="crescent"></ion-spinner>
            Register
          </ion-button>
        </div>
      </form>
    </ion-content>
  `
})
export class RetailerRegistrationPage implements OnInit {
  form: FormGroup;
  nearbyDistributors: Distributor[] = [];
  selectedDistributorId: string | null = null;
  isLoading = false;
  isSearchingDistributors = false;

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private router: Router
  ) {
    this.form = this.fb.group({
      storeName: ['', Validators.required],
      ownerName: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gstin: [''],
      address: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', Validators.required],
      storeCategory: ['', Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onLocationChange(): void {
    const lat = this.form.get('latitude')?.value;
    const lon = this.form.get('longitude')?.value;
    const state = this.form.get('state')?.value;
    const city = this.form.get('city')?.value;

    if (lat && lon) {
      this.searchNearbyDistributors(lat, lon, state, city);
    }
  }

  searchNearbyDistributors(latitude: number, longitude: number, state?: string, city?: string): void {
    this.isSearchingDistributors = true;
    this.nearbyDistributors = [];
    this.selectedDistributorId = null;

    this.registrationService.searchDistributors(latitude, longitude, state, city).subscribe({
      next: (result) => {
        this.nearbyDistributors = result.distributors || [];
        this.isSearchingDistributors = false;
      },
      error: () => {
        this.isSearchingDistributors = false;
      }
    });
  }

  selectDistributor(distributor: Distributor): void {
    this.selectedDistributorId = distributor.id;
  }

  onSubmit(): void {
    this.isLoading = true;
    const formData = {
      ...this.form.value,
      distributorId: this.selectedDistributorId
    };

    this.registrationService.registerRetailer(formData).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      }
    });
  }
}
