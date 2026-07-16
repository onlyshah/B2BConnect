import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationService, Distributor } from '../services/registration.service';
import { LocationService } from '../../../services/location.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-retailer-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-frame">
        <!-- Back Button -->
        <button 
          (click)="goBack()"
          class="auth-back">
          ← Back to Role Selection
        </button>

        <!-- Card -->
        <div class="auth-card">
          <h1 class="text-3xl font-bold text-white mb-2">Register Your Retail Store</h1>
          <p class="text-gray-400 mb-8">Connect with distributors and manage your orders</p>

          <!-- Success -->
          <div *ngIf="successMessage" class="mb-6 p-4 bg-emerald-900/30 border border-emerald-700 rounded-lg text-emerald-300">
            {{ successMessage }}
          </div>

          <!-- Error -->
          <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
            {{ errorMessage }}
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!successMessage">
            <!-- Store Info -->
            <div class="mb-8 pb-8 border-b border-slate-700">
              <h2 class="text-lg font-semibold text-white mb-6">Store Information</h2>

              <!-- Store Name & Owner -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="block text-white font-medium mb-2">Store Name *</label>
                  <input 
                    type="text" 
                    formControlName="storeName"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="Main Street Market">
                  <span *ngIf="isFieldInvalid('storeName')" class="text-red-400 text-sm mt-1 block">Store name required</span>
                </div>

                <div>
                  <label class="block text-white font-medium mb-2">Owner Name *</label>
                  <input 
                    type="text" 
                    formControlName="ownerName"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="Priya Singh">
                  <span *ngIf="isFieldInvalid('ownerName')" class="text-red-400 text-sm mt-1 block">Owner name required</span>
                </div>
              </div>

              <!-- Mobile & Email -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="block text-white font-medium mb-2">Mobile Number *</label>
                  <input 
                    type="tel" 
                    formControlName="mobileNumber"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="9876543210">
                  <span *ngIf="isFieldInvalid('mobileNumber')" class="text-red-400 text-sm mt-1 block">Valid mobile required</span>
                </div>

                <div>
                  <label class="block text-white font-medium mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    formControlName="email"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="priya@store.com">
                  <span *ngIf="isFieldInvalid('email')" class="text-red-400 text-sm mt-1 block">Valid email required</span>
                </div>
              </div>

              <!-- GSTIN & Category -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="block text-white font-medium mb-2">GSTIN (Optional)</label>
                  <input 
                    type="text" 
                    formControlName="gstin"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="22AAAAA0000A1Z5">
                </div>

                <div>
                  <label class="block text-white font-medium mb-2">Store Category *</label>
                  <select 
                    formControlName="storeCategory"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500">
                    <option value="">Select Category</option>
                    <option value="kirana">Kirana</option>
                    <option value="super-market">Super Market</option>
                    <option value="medical">Medical</option>
                    <option value="cosmetics">Cosmetics</option>
                    <option value="general-store">General Store</option>
                    <option value="specialty">Specialty</option>
                    <option value="other">Other</option>
                  </select>
                  <span *ngIf="isFieldInvalid('storeCategory')" class="text-red-400 text-sm mt-1 block">Category required</span>
                </div>
              </div>

              <!-- Address -->
              <div class="mb-6">
                <label class="block text-white font-medium mb-2">Address *</label>
                <textarea 
                  formControlName="address"
                  rows="2"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="123 Market Street"></textarea>
                <span *ngIf="isFieldInvalid('address')" class="text-red-400 text-sm mt-1 block">Address required</span>
              </div>

              <!-- Location -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="block text-white font-medium mb-2">Latitude *</label>
                  <input 
                    type="number" 
                    step="0.0001"
                    formControlName="latitude"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="22.3072">
                  <span *ngIf="isFieldInvalid('latitude')" class="text-red-400 text-sm mt-1 block">Latitude required</span>
                </div>

                <div>
                  <label class="block text-white font-medium mb-2">Longitude *</label>
                  <input 
                    type="number" 
                    step="0.0001"
                    formControlName="longitude"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="73.1812">
                  <span *ngIf="isFieldInvalid('longitude')" class="text-red-400 text-sm mt-1 block">Longitude required</span>
                </div>
              </div>

              <!-- Country, State, City, Area -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <label class="block text-white font-medium mb-2">Country *</label>
                  <select formControlName="country" (change)="onCountryChange()" class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500">
                    <option value="">Select Country</option>
                    <option *ngFor="let country of countries" [value]="country">{{ country }}</option>
                  </select>
                  <span *ngIf="isFieldInvalid('country')" class="text-red-400 text-sm mt-1 block">Required</span>
                </div>
                <div>
                  <label class="block text-white font-medium mb-2">State *</label>
                  <select formControlName="state" (change)="onStateChange()" class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500">
                    <option value="">Select State</option>
                    <option *ngFor="let state of states" [value]="state">{{ state }}</option>
                  </select>
                  <span *ngIf="isFieldInvalid('state')" class="text-red-400 text-sm mt-1 block">Required</span>
                </div>
                <div>
                  <label class="block text-white font-medium mb-2">City *</label>
                  <select formControlName="city" (change)="onCityChange()" class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500">
                    <option value="">Select City</option>
                    <option *ngFor="let city of cities" [value]="city">{{ city }}</option>
                  </select>
                  <span *ngIf="isFieldInvalid('city')" class="text-red-400 text-sm mt-1 block">Required</span>
                </div>
                <div>
                  <label class="block text-white font-medium mb-2">Area *</label>
                  <select formControlName="area" class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500">
                    <option value="">Select Area</option>
                    <option *ngFor="let area of areas" [value]="area">{{ area }}</option>
                  </select>
                  <span *ngIf="isFieldInvalid('area')" class="text-red-400 text-sm mt-1 block">Required</span>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label class="block text-white font-medium mb-2">Pincode *</label>
                  <input type="text" formControlName="pincode" class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500" placeholder="390001">
                  <span *ngIf="isFieldInvalid('pincode')" class="text-red-400 text-sm mt-1 block">Required</span>
                </div>
              </div>
            </div>

            <!-- Nearby Distributors -->
            <div class="mb-8 pb-8 border-b border-slate-700">
              <h2 class="text-lg font-semibold text-white mb-4">Available Distributors In Your Area</h2>

              <div *ngIf="isSearchingDistributors" class="text-center py-4 text-gray-400">
                Searching for nearby distributors...
              </div>

              <div *ngIf="!isSearchingDistributors && nearbyDistributors.length > 0" class="space-y-3">
                <div 
                  *ngFor="let dist of nearbyDistributors"
                  (click)="selectDistributor(dist)"
                  [class]="selectedDistributorId === dist.id ? 'p-4 bg-orange-900/40 border-2 border-orange-500 rounded-lg cursor-pointer' : 'p-4 bg-slate-700 border-2 border-slate-600 rounded-lg cursor-pointer hover:border-orange-400'"
                >
                  <p class="text-white font-medium">{{ dist.name }}</p>
                  <p class="text-gray-400 text-sm">{{ dist.city }}, {{ dist.state }}</p>
                </div>
              </div>

              <div *ngIf="!isSearchingDistributors && nearbyDistributors.length === 0" class="p-4 bg-slate-700/50 rounded-lg text-gray-300">
                No distributors found in your area. Please enter valid coordinates.
              </div>

              <span *ngIf="selectedDistributorId" class="text-emerald-400 text-sm mt-2 block">✓ Distributor selected</span>
              <span *ngIf="!selectedDistributorId && form.get('latitude')?.valid" class="text-red-400 text-sm mt-2 block">Select a distributor *</span>
            </div>

            <!-- Password -->
            <div class="mb-8">
              <h2 class="text-lg font-semibold text-white mb-6">Login Credentials</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-white font-medium mb-2">Password *</label>
                  <input 
                    type="password" 
                    formControlName="password"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="••••••••">
                  <p class="text-gray-400 text-xs mt-2">Min 8 chars, uppercase, number, special char</p>
                  <span *ngIf="isFieldInvalid('password')" class="text-red-400 text-sm mt-1 block">Strong password required</span>
                </div>

                <div>
                  <label class="block text-white font-medium mb-2">Confirm Password *</label>
                  <input 
                    type="password" 
                    formControlName="confirmPassword"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="••••••••">
                  <span *ngIf="isFieldInvalid('confirmPassword')" class="text-red-400 text-sm mt-1 block">Passwords must match</span>
                </div>
              </div>
            </div>

            <!-- Submit -->
            <button 
              type="submit"
              [disabled]="!form.valid || isLoading || !selectedDistributorId"
              class="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isLoading ? 'Registering...' : 'Complete Registration' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class RetailerRegistrationComponent implements OnInit {
  form: FormGroup;
  countries: string[] = [];
  states: string[] = [];
  cities: string[] = [];
  areas: string[] = [];
  nearbyDistributors: Distributor[] = [];
  selectedDistributorId: string | null = null;
  isLoading = false;
  isSearchingDistributors = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private locationService: LocationService,
    private router: Router
  ) {
    this.form = this.fb.group({
      storeName: ['', Validators.required],
      ownerName: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gstin: [''],
      address: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      area: ['', Validators.required],
      pincode: ['', Validators.required],
      storeCategory: ['', Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCountryData();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onCountryChange(): void {
    const country = this.form.get('country')?.value;
    this.states = [];
    this.cities = [];
    this.areas = [];
    this.form.patchValue({ state: '', city: '', area: '' });

    if (country) {
      this.locationService.getStates(country).subscribe((states) => {
        this.states = states.length ? states : [country === 'India' ? 'Gujarat' : ''];
      });
    }
  }

  onStateChange(): void {
    const country = this.form.get('country')?.value;
    const state = this.form.get('state')?.value;
    this.cities = [];
    this.areas = [];
    this.form.patchValue({ city: '', area: '' });

    if (country && state) {
      this.locationService.getCities(country, state).subscribe((cities) => {
        this.cities = cities.length ? cities : [state === 'Gujarat' ? 'Vadodara' : ''];
      });
    }
  }

  onCityChange(): void {
    const city = this.form.get('city')?.value;
    this.areas = [];
    this.form.patchValue({ area: '' });

    if (city) {
      this.locationService.getAreas(city).subscribe((areas) => {
        this.areas = areas;
      });
    }
  }

  private loadCountryData(): void {
    this.locationService.getCountries().subscribe((countries) => {
      this.countries = countries.length ? countries : ['India'];

      const activeCountry = this.form.get('country')?.value || 'India';
      if (!this.countries.includes(activeCountry)) {
        this.countries.unshift(activeCountry);
      }
    });
  }

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
        this.errorMessage = 'Could not fetch nearby distributors';
      }
    });
  }

  selectDistributor(distributor: Distributor): void {
    this.selectedDistributorId = distributor.id;
  }

  goBack(): void {
    this.router.navigate(['/register']);
  }

  onSubmit(): void {
    if (!this.form.valid || !this.selectedDistributorId) {
      this.errorMessage = 'Please fill all required fields and select a distributor';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = {
      ...this.form.value,
      distributorId: this.selectedDistributorId
    };

    this.registrationService.registerRetailer(formData).subscribe({
      next: (response) => {
        this.successMessage = `✓ ${response.message}\n\nApplication ID: ${response.applicationId}\n${response.note}`;
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Registration failed';
        this.isLoading = false;
      }
    });
  }
}
