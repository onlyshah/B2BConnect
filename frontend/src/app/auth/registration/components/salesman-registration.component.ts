import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationService, Company } from '../services/registration.service';
import { LocationService } from '../../../services/location.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-salesman-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 py-12 px-4">
      <div class="max-w-2xl mx-auto">
        <!-- Back Button -->
        <button 
          (click)="goBack()"
          class="mb-8 flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
          ← Back to Role Selection
        </button>

        <!-- Card -->
        <div class="bg-slate-800 rounded-2xl p-8 md:p-12 border border-slate-700">
          <h1 class="text-3xl font-bold text-white mb-2">Join as Salesman</h1>
          <p class="text-gray-400 mb-8">Fill in your profile and apply to companies</p>

          <!-- Success Message -->
          <div *ngIf="successMessage" class="mb-6 p-4 bg-emerald-900/30 border border-emerald-700 rounded-lg text-emerald-300">
            {{ successMessage }}
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
            {{ errorMessage }}
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!successMessage">
            <!-- Personal Info -->
            <div class="mb-8 pb-8 border-b border-slate-700">
              <h2 class="text-lg font-semibold text-white mb-6">Personal Information</h2>

              <!-- Full Name & Mobile -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="block text-white font-medium mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    formControlName="fullName"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Amit Kumar">
                  <span *ngIf="isFieldInvalid('fullName')" class="text-red-400 text-sm mt-1 block">Full name required</span>
                </div>

                <div>
                  <label class="block text-white font-medium mb-2">Mobile Number *</label>
                  <input 
                    type="tel" 
                    formControlName="mobileNumber"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    placeholder="9876543210">
                  <span *ngIf="isFieldInvalid('mobileNumber')" class="text-red-400 text-sm mt-1 block">Valid mobile required</span>
                </div>
              </div>

              <!-- Email & DOB -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="block text-white font-medium mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    formControlName="email"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    placeholder="amit@example.com">
                  <span *ngIf="isFieldInvalid('email')" class="text-red-400 text-sm mt-1 block">Valid email required</span>
                </div>

                <div>
                  <label class="block text-white font-medium mb-2">Date of Birth *</label>
                  <input 
                    type="date" 
                    formControlName="dateOfBirth"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                  <span *ngIf="isFieldInvalid('dateOfBirth')" class="text-red-400 text-sm mt-1 block">Date of birth required</span>
                </div>
              </div>

              <!-- Address -->
              <div class="mb-6">
                <label class="block text-white font-medium mb-2">Address *</label>
                <textarea 
                  formControlName="address"
                  rows="2"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="123 Street Name"></textarea>
                <span *ngIf="isFieldInvalid('address')" class="text-red-400 text-sm mt-1 block">Address required</span>
              </div>

              <!-- Country, State, City, Area -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <label class="block text-white font-medium mb-2">Country *</label>
                  <select formControlName="country" (change)="onCountryChange()" class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                    <option value="">Select Country</option>
                    <option *ngFor="let country of countries" [value]="country">{{ country }}</option>
                  </select>
                  <span *ngIf="isFieldInvalid('country')" class="text-red-400 text-sm mt-1 block">Required</span>
                </div>
                <div>
                  <label class="block text-white font-medium mb-2">State *</label>
                  <select formControlName="state" (change)="onStateChange()" class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                    <option value="">Select State</option>
                    <option *ngFor="let state of states" [value]="state">{{ state }}</option>
                  </select>
                  <span *ngIf="isFieldInvalid('state')" class="text-red-400 text-sm mt-1 block">Required</span>
                </div>
                <div>
                  <label class="block text-white font-medium mb-2">City *</label>
                  <select formControlName="city" (change)="onCityChange()" class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                    <option value="">Select City</option>
                    <option *ngFor="let city of cities" [value]="city">{{ city }}</option>
                  </select>
                  <span *ngIf="isFieldInvalid('city')" class="text-red-400 text-sm mt-1 block">Required</span>
                </div>
                <div>
                  <label class="block text-white font-medium mb-2">Area *</label>
                  <select formControlName="area" class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                    <option value="">Select Area</option>
                    <option *ngFor="let area of areas" [value]="area">{{ area }}</option>
                  </select>
                  <span *ngIf="isFieldInvalid('area')" class="text-red-400 text-sm mt-1 block">Required</span>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label class="block text-white font-medium mb-2">Pincode *</label>
                  <input type="text" formControlName="pincode" class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500" placeholder="390001">
                  <span *ngIf="isFieldInvalid('pincode')" class="text-red-400 text-sm mt-1 block">Required</span>
                </div>
              </div>
            </div>

            <!-- Professional Info -->
            <div class="mb-8 pb-8 border-b border-slate-700">
              <h2 class="text-lg font-semibold text-white mb-6">Professional Experience</h2>

              <!-- Experience & Previous Company -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="block text-white font-medium mb-2">Years of Experience *</label>
                  <input 
                    type="number" 
                    formControlName="experience"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    placeholder="2">
                  <span *ngIf="isFieldInvalid('experience')" class="text-red-400 text-sm mt-1 block">Experience required</span>
                </div>

                <div>
                  <label class="block text-white font-medium mb-2">Previous Company (Optional)</label>
                  <input 
                    type="text" 
                    formControlName="previousCompany"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    placeholder="ABC Company">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="block text-white font-medium mb-2">Aadhaar Number *</label>
                  <input 
                    type="text" 
                    formControlName="aadhaarNumber"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    placeholder="123412341234">
                  <span *ngIf="isFieldInvalid('aadhaarNumber')" class="text-red-400 text-sm mt-1 block">Valid Aadhaar required</span>
                </div>

                <div>
                  <label class="block text-white font-medium mb-2">PAN Number *</label>
                  <input 
                    type="text" 
                    formControlName="panNumber"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    placeholder="ABCDE1234F">
                  <span *ngIf="isFieldInvalid('panNumber')" class="text-red-400 text-sm mt-1 block">Valid PAN required</span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label class="block text-white font-medium mb-2">Upload CV *</label>
                  <input 
                    type="file" 
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    (change)="handleFileInput($event, 'cv')"
                    class="w-full text-sm text-white file:bg-emerald-600 file:text-white file:px-4 file:py-2 file:rounded-lg file:border-0 bg-slate-700 border border-slate-600 rounded-lg">
                  <span *ngIf="!cvFile && form.touched" class="text-red-400 text-sm mt-1 block">CV is required</span>
                </div>

                <div>
                  <label class="block text-white font-medium mb-2">Upload Aadhaar *</label>
                  <input 
                    type="file" 
                    accept="image/*,application/pdf"
                    (change)="handleFileInput($event, 'aadhaarDocument')"
                    class="w-full text-sm text-white file:bg-emerald-600 file:text-white file:px-4 file:py-2 file:rounded-lg file:border-0 bg-slate-700 border border-slate-600 rounded-lg">
                  <span *ngIf="!aadhaarDocumentFile && form.touched" class="text-red-400 text-sm mt-1 block">Aadhaar doc required</span>
                </div>

                <div>
                  <label class="block text-white font-medium mb-2">Upload PAN *</label>
                  <input 
                    type="file" 
                    accept="image/*,application/pdf"
                    (change)="handleFileInput($event, 'panDocument')"
                    class="w-full text-sm text-white file:bg-emerald-600 file:text-white file:px-4 file:py-2 file:rounded-lg file:border-0 bg-slate-700 border border-slate-600 rounded-lg">
                  <span *ngIf="!panDocumentFile && form.touched" class="text-red-400 text-sm mt-1 block">PAN doc required</span>
                </div>
              </div>

              <div *ngIf="cvParseMessage" class="mb-6 p-4 bg-slate-700 border border-slate-600 rounded-lg text-gray-300">
                {{ cvParseMessage }}
              </div>
            </div>

            <!-- Apply to Companies -->
            <div class="mb-8 pb-8 border-b border-slate-700">
              <h2 class="text-lg font-semibold text-white mb-6">Apply To Companies</h2>

              <div class="mb-6">
                <label class="block text-white font-medium mb-2">Search & Select Companies *</label>
                <input 
                  type="text"
                  [formControl]="companySearchControl"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Search companies...">

                <div *ngIf="filteredCompanies.length > 0" class="mt-4 space-y-2 max-h-64 overflow-y-auto">
                  <div 
                    *ngFor="let company of filteredCompanies"
                    (click)="selectCompany(company)"
                    class="p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 border border-slate-600"
                  >
                    <p class="text-white font-medium">{{ company.name }}</p>
                    <p class="text-gray-400 text-sm">{{ company.city }}, {{ company.state }}</p>
                  </div>
                </div>
              </div>

              <div *ngIf="selectedCompanies.length > 0" class="space-y-2">
                <p class="text-white font-medium mb-3">Selected ({{ selectedCompanies.length }})</p>
                <div *ngFor="let company of selectedCompanies" class="flex items-center justify-between p-3 bg-emerald-900/30 border border-emerald-700 rounded-lg">
                  <p class="text-white">{{ company.name }}</p>
                  <button 
                    type="button"
                    (click)="removeCompany(company._id)"
                    class="text-red-400">
                    ×
                  </button>
                </div>
              </div>

              <span *ngIf="selectedCompanies.length === 0" class="text-red-400 text-sm mt-2 block">Select at least one company</span>
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
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    placeholder="••••••••">
                  <p class="text-gray-400 text-xs mt-2">Min 8 chars, uppercase, number, special char</p>
                  <span *ngIf="isFieldInvalid('password')" class="text-red-400 text-sm mt-1 block">Strong password required</span>
                </div>

                <div>
                  <label class="block text-white font-medium mb-2">Confirm Password *</label>
                  <input 
                    type="password" 
                    formControlName="confirmPassword"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    placeholder="••••••••">
                  <span *ngIf="isFieldInvalid('confirmPassword')" class="text-red-400 text-sm mt-1 block">Passwords must match</span>
                </div>
              </div>
            </div>

            <!-- Submit -->
            <button 
              type="submit"
              [disabled]="!form.valid || isLoading || selectedCompanies.length === 0"
              class="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isLoading ? 'Registering...' : 'Submit Application' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class SalesmanRegistrationComponent implements OnInit {
  form: FormGroup;
  countries: string[] = [];
  states: string[] = [];
  cities: string[] = [];
  areas: string[] = [];
  companySearchControl = new FormBuilder().control('');
  filteredCompanies: Company[] = [];
  selectedCompanies: Company[] = [];
  cvFile: File | null = null;
  aadhaarDocumentFile: File | null = null;
  panDocumentFile: File | null = null;
  cvParseMessage = '';
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
      fullName: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required],
      address: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      area: ['', Validators.required],
      pincode: ['', Validators.required],
      experience: [0, Validators.required],
      previousCompany: [''],
      aadhaarNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      panNumber: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      selectedCompanyIds: [[]]
    });
  }

  ngOnInit(): void {
    this.loadCountryData();

    this.companySearchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query || query.length < 2) {
          return [];
        }
        return this.registrationService.searchCompanies(query);
      })
    ).subscribe({
      next: (result) => {
        this.filteredCompanies = result.companies || [];
      }
    });
  }

  handleFileInput(event: Event, field: 'cv' | 'aadhaarDocument' | 'panDocument'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    if (field === 'cv') {
      this.cvFile = file;
      this.cvParseMessage = this.parseCvForProfile(file);
    } else if (field === 'aadhaarDocument') {
      this.aadhaarDocumentFile = file;
    } else if (field === 'panDocument') {
      this.panDocumentFile = file;
    }
  }

  private parseCvForProfile(file: File): string {
    const fileName = file.name.toLowerCase();
    if (!fileName.match(/\.(txt|md|doc|docx|pdf)$/)) {
      return 'CV uploaded successfully. Manual profile verification is required.';
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const normalizedText = text.replace(/\s+/g, ' ').trim();
      const emailMatch = normalizedText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
      const phoneMatch = normalizedText.match(/(?:\+?\d[\d\s()-]{8,}\d)/);
      const nameMatch = normalizedText.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/);

      if (emailMatch || phoneMatch || nameMatch) {
        this.form.patchValue({
          email: emailMatch?.[0] || this.form.value.email,
          mobileNumber: phoneMatch ? phoneMatch[0].replace(/\D/g, '').slice(-10) : this.form.value.mobileNumber,
          fullName: nameMatch?.[0] || this.form.value.fullName
        });
        this.cvParseMessage = 'Profile details were auto-filled from the uploaded CV where possible.';
      } else {
        this.cvParseMessage = 'CV uploaded successfully. Manual profile verification is required.';
      }
    };

    reader.onerror = () => {
      this.cvParseMessage = 'CV uploaded successfully. Manual profile verification is required.';
    };

    reader.readAsText(file);
    return 'Reading CV for profile details...';
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

  selectCompany(company: Company): void {
    if (!this.selectedCompanies.find(c => c._id === company._id)) {
      this.selectedCompanies.push(company);
      this.form.patchValue({
        selectedCompanyIds: this.selectedCompanies.map(c => c._id)
      });
    }
    this.companySearchControl.reset();
    this.filteredCompanies = [];
  }

  removeCompany(companyId: string): void {
    this.selectedCompanies = this.selectedCompanies.filter(c => c._id !== companyId);
    this.form.patchValue({
      selectedCompanyIds: this.selectedCompanies.map(c => c._id)
    });
  }

  goBack(): void {
    this.router.navigate(['/register']);
  }

  onSubmit(): void {
    if (!this.form.valid || this.selectedCompanies.length === 0 || !this.cvFile || !this.aadhaarDocumentFile || !this.panDocumentFile) {
      this.errorMessage = 'Please fill all required fields, upload CV, Aadhaar, PAN and select at least one company';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = new FormData();
    Object.keys(this.form.value).forEach((key) => {
      const value = this.form.value[key];
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((item: any) => formData.append(key, item));
        } else {
          formData.append(key, value);
        }
      }
    });
    formData.append('companyIds', this.selectedCompanies.map(c => c._id).join(','));
    if (this.cvFile) formData.append('cv', this.cvFile);
    if (this.aadhaarDocumentFile) formData.append('aadhaarDocument', this.aadhaarDocumentFile);
    if (this.panDocumentFile) formData.append('panDocument', this.panDocumentFile);

    this.registrationService.registerSalesman(formData).subscribe({
      next: (response) => {
        this.successMessage = `✓ ${response.message}\n\nApplication ID: ${response.applicationId}\n${response.note}`;
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || error.error?.message || 'Registration failed';
        this.isLoading = false;
      }
    });
  }
}
