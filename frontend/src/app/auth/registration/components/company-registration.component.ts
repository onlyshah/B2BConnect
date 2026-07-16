import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationService } from '../services/registration.service';
import { LocationService } from '../../../services/location.service';

@Component({
  selector: 'app-company-registration',
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
          <h1 class="text-3xl font-bold text-white mb-2">Register Your Company</h1>
          <p class="text-gray-400 mb-8">Fill in your company details to get started</p>

          <!-- Success Message -->
          <div *ngIf="successMessage" class="mb-6 p-4 bg-emerald-900/30 border border-emerald-700 rounded-lg text-emerald-300">
            {{ successMessage }}
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
            {{ errorMessage }}
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!successMessage">
            <!-- Company Name & Business Type Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-white font-medium mb-2">Company Name *</label>
                <input 
                  type="text" 
                  formControlName="companyName"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="ARRVI Personal Care">
                <span *ngIf="isFieldInvalid('companyName')" class="text-red-400 text-sm mt-1 block">Company name is required</span>
              </div>

              <div>
                <label class="block text-white font-medium mb-2">Business Type *</label>
                <select 
                  formControlName="businessType"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors">
                  <option value="">Select Business Type</option>
                  <option value="manufacturer">Manufacturer</option>
                  <option value="brand">Brand Owner</option>
                  <option value="importer">Importer</option>
                  <option value="trader">Trader</option>
                </select>
                <span *ngIf="isFieldInvalid('businessType')" class="text-red-400 text-sm mt-1 block">Business type is required</span>
              </div>
            </div>

            <!-- GSTIN & PAN Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-white font-medium mb-2">GSTIN *</label>
                <input 
                  type="text" 
                  formControlName="gstin"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="22AAAAA0000A1Z5">
                <span *ngIf="isFieldInvalid('gstin')" class="text-red-400 text-sm mt-1 block">Valid GSTIN required</span>
              </div>

              <div>
                <label class="block text-white font-medium mb-2">PAN Number *</label>
                <input 
                  type="text" 
                  formControlName="panNumber"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="ABCDE1234F">
                <span *ngIf="isFieldInvalid('panNumber')" class="text-red-400 text-sm mt-1 block">Valid PAN required</span>
              </div>
            </div>

            <!-- Owner Name & Mobile Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-white font-medium mb-2">Owner Name *</label>
                <input 
                  type="text" 
                  formControlName="ownerName"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Rajesh Kumar">
                <span *ngIf="isFieldInvalid('ownerName')" class="text-red-400 text-sm mt-1 block">Owner name is required</span>
              </div>

              <div>
                <label class="block text-white font-medium mb-2">Mobile Number *</label>
                <input 
                  type="tel" 
                  formControlName="mobileNumber"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="9876543210">
                <span *ngIf="isFieldInvalid('mobileNumber')" class="text-red-400 text-sm mt-1 block">Valid mobile number required</span>
              </div>
            </div>

            <!-- Email & Website Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-white font-medium mb-2">Email Address *</label>
                <input 
                  type="email" 
                  formControlName="email"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="hello@arrvi.com">
                <span *ngIf="isFieldInvalid('email')" class="text-red-400 text-sm mt-1 block">Valid email required</span>
              </div>

              <div>
                <label class="block text-white font-medium mb-2">Website (Optional)</label>
                <input 
                  type="url" 
                  formControlName="website"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="https://arrvi.com">
              </div>
            </div>

            <!-- Address -->
            <div class="mb-6">
              <label class="block text-white font-medium mb-2">Address *</label>
              <textarea 
                formControlName="address"
                rows="3"
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="123 Business Street, Industrial Area"></textarea>
              <span *ngIf="isFieldInvalid('address')" class="text-red-400 text-sm mt-1 block">Address is required</span>
            </div>

            <!-- Country, State, City, Area Row -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div>
                <label class="block text-white font-medium mb-2">Country *</label>
                <select
                  formControlName="country"
                  (change)="onCountryChange()"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="">Select Country</option>
                  <option *ngFor="let country of countries" [value]="country">{{ country }}</option>
                </select>
                <span *ngIf="isFieldInvalid('country')" class="text-red-400 text-sm mt-1 block">Country is required</span>
              </div>

              <div>
                <label class="block text-white font-medium mb-2">State *</label>
                <select
                  formControlName="state"
                  (change)="onStateChange()"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="">Select State</option>
                  <option *ngFor="let state of states" [value]="state">{{ state }}</option>
                </select>
                <span *ngIf="isFieldInvalid('state')" class="text-red-400 text-sm mt-1 block">State is required</span>
              </div>

              <div>
                <label class="block text-white font-medium mb-2">City *</label>
                <select
                  formControlName="city"
                  (change)="onCityChange()"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="">Select City</option>
                  <option *ngFor="let city of cities" [value]="city">{{ city }}</option>
                </select>
                <span *ngIf="isFieldInvalid('city')" class="text-red-400 text-sm mt-1 block">City is required</span>
              </div>

              <div>
                <label class="block text-white font-medium mb-2">Area *</label>
                <select
                  formControlName="area"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="">Select Area</option>
                  <option *ngFor="let area of areas" [value]="area">{{ area }}</option>
                </select>
                <span *ngIf="isFieldInvalid('area')" class="text-red-400 text-sm mt-1 block">Area is required</span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label class="block text-white font-medium mb-2">Pincode *</label>
                <input 
                  type="text" 
                  formControlName="pincode"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="390001">
                <span *ngIf="isFieldInvalid('pincode')" class="text-red-400 text-sm mt-1 block">Pincode is required</span>
              </div>
            </div>

            <!-- Password & Confirm Password Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-white font-medium mb-2">Password *</label>
                <input 
                  type="password" 
                  formControlName="password"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="••••••••">
                <p class="text-gray-400 text-xs mt-2">Min 8 chars, 1 uppercase, 1 number, 1 special char</p>
                <span *ngIf="isFieldInvalid('password')" class="text-red-400 text-sm mt-1 block">Strong password required</span>
              </div>

              <div>
                <label class="block text-white font-medium mb-2">Confirm Password *</label>
                <input 
                  type="password" 
                  formControlName="confirmPassword"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="••••••••">
                <span *ngIf="isFieldInvalid('confirmPassword')" class="text-red-400 text-sm mt-1 block">Passwords must match</span>
              </div>
            </div>

            <!-- Terms & Conditions -->
            <div class="mb-8 p-4 bg-slate-700/50 rounded-lg">
              <p class="text-gray-300 text-sm">
                By registering, you agree to our Terms of Service and Privacy Policy. 
                Your company registration will be reviewed by our Super Admin team.
              </p>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit"
              [disabled]="!form.valid || isLoading"
              class="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isLoading ? 'Registering...' : 'Complete Registration' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class CompanyRegistrationComponent implements OnInit {
  form: FormGroup;
  countries: string[] = [];
  states: string[] = [];
  cities: string[] = [];
  areas: string[] = [];
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private locationService: LocationService,
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
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      area: ['', Validators.required],
      pincode: ['', Validators.required],
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

  goBack(): void {
    this.router.navigate(['/register']);
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

  onSubmit(): void {
    if (!this.form.valid) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.registrationService.registerCompany(this.form.value).subscribe({
      next: (response) => {
        this.successMessage = `✓ ${response.message}\n\nApplication ID: ${response.applicationId}\nStatus: ${response.status}\n\n${response.note}`;
        this.isLoading = false;
        
        // Redirect after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Registration failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
