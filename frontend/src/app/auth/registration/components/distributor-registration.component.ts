import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegistrationService, Company } from '../services/registration.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-distributor-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      <div class="max-w-2xl mx-auto">
        <!-- Back Button -->
        <button 
          (click)="goBack()"
          class="mb-8 flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
          ← Back to Role Selection
        </button>

        <!-- Card -->
        <div class="bg-slate-800 rounded-2xl p-8 md:p-12 border border-slate-700">
          <h1 class="text-3xl font-bold text-white mb-2">Register as Distributor</h1>
          <p class="text-gray-400 mb-8">Fill in your business details and apply to companies</p>

          <!-- Success Message -->
          <div *ngIf="successMessage" class="mb-6 p-4 bg-emerald-900/30 border border-emerald-700 rounded-lg text-emerald-300">
            {{ successMessage }}
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
            {{ errorMessage }}
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!successMessage">
            <!-- Basic Info Section -->
            <div class="mb-8 pb-8 border-b border-slate-700">
              <h2 class="text-lg font-semibold text-white mb-6">Business Information</h2>

              <!-- Business Name & GSTIN Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="block text-white font-medium mb-2">Business Name *</label>
                  <input 
                    type="text" 
                    formControlName="businessName"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Patel Distributors">
                  <span *ngIf="isFieldInvalid('businessName')" class="text-red-400 text-sm mt-1 block">Business name required</span>
                </div>

                <div>
                  <label class="block text-white font-medium mb-2">GSTIN *</label>
                  <input 
                    type="text" 
                    formControlName="gstin"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="22AAAAA0000A1Z5">
                  <span *ngIf="isFieldInvalid('gstin')" class="text-red-400 text-sm mt-1 block">Valid GSTIN required</span>
                </div>
              </div>

              <!-- PAN & Owner Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="block text-white font-medium mb-2">PAN Number *</label>
                  <input 
                    type="text" 
                    formControlName="panNumber"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="ABCDE1234F">
                  <span *ngIf="isFieldInvalid('panNumber')" class="text-red-400 text-sm mt-1 block">Valid PAN required</span>
                </div>

                <div>
                  <label class="block text-white font-medium mb-2">Owner Name *</label>
                  <input 
                    type="text" 
                    formControlName="ownerName"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Ramesh Patel">
                  <span *ngIf="isFieldInvalid('ownerName')" class="text-red-400 text-sm mt-1 block">Owner name required</span>
                </div>
              </div>

              <!-- Mobile & Email Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="block text-white font-medium mb-2">Mobile Number *</label>
                  <input 
                    type="tel" 
                    formControlName="mobileNumber"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="9876543210">
                  <span *ngIf="isFieldInvalid('mobileNumber')" class="text-red-400 text-sm mt-1 block">Valid mobile required</span>
                </div>

                <div>
                  <label class="block text-white font-medium mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    formControlName="email"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="contact@pateldist.com">
                  <span *ngIf="isFieldInvalid('email')" class="text-red-400 text-sm mt-1 block">Valid email required</span>
                </div>
              </div>

              <!-- Address, State, City, Pincode -->
              <div class="mb-6">
                <label class="block text-white font-medium mb-2">Address *</label>
                <textarea 
                  formControlName="address"
                  rows="2"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="123 Trade Street"></textarea>
                <span *ngIf="isFieldInvalid('address')" class="text-red-400 text-sm mt-1 block">Address required</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label class="block text-white font-medium mb-2">State *</label>
                  <input type="text" formControlName="state" class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500" placeholder="Gujarat">
                  <span *ngIf="isFieldInvalid('state')" class="text-red-400 text-sm mt-1 block">Required</span>
                </div>
                <div>
                  <label class="block text-white font-medium mb-2">City *</label>
                  <input type="text" formControlName="city" class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500" placeholder="Vadodara">
                  <span *ngIf="isFieldInvalid('city')" class="text-red-400 text-sm mt-1 block">Required</span>
                </div>
                <div>
                  <label class="block text-white font-medium mb-2">Pincode *</label>
                  <input type="text" formControlName="pincode" class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500" placeholder="390001">
                  <span *ngIf="isFieldInvalid('pincode')" class="text-red-400 text-sm mt-1 block">Required</span>
                </div>
              </div>

              <div>
                <label class="block text-white font-medium mb-2">Warehouse Capacity (units/month)</label>
                <input 
                  type="number" 
                  formControlName="warehouseCapacity"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="5000">
              </div>
            </div>

            <!-- Apply to Companies Section -->
            <div class="mb-8 pb-8 border-b border-slate-700">
              <h2 class="text-lg font-semibold text-white mb-6">Apply To Companies</h2>

              <!-- Search Companies -->
              <div class="mb-6">
                <label class="block text-white font-medium mb-2">Search & Select Companies *</label>
                <input 
                  type="text"
                  [formControl]="companySearchControl"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Search companies...">

                <!-- Company List -->
                <div *ngIf="filteredCompanies.length > 0" class="mt-4 space-y-2 max-h-64 overflow-y-auto">
                  <div 
                    *ngFor="let company of filteredCompanies"
                    (click)="selectCompany(company)"
                    class="p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors border border-slate-600"
                  >
                    <p class="text-white font-medium">{{ company.name }}</p>
                    <p class="text-gray-400 text-sm">{{ company.city }}, {{ company.state }}</p>
                  </div>
                </div>
              </div>

              <!-- Selected Companies -->
              <div *ngIf="selectedCompanies.length > 0" class="space-y-2">
                <p class="text-white font-medium mb-3">Selected Companies ({{ selectedCompanies.length }})</p>
                <div *ngFor="let company of selectedCompanies" class="flex items-center justify-between p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
                  <p class="text-white">{{ company.name }}</p>
                  <button 
                    type="button"
                    (click)="removeCompany(company._id)"
                    class="text-red-400 hover:text-red-300 text-lg">
                    ×
                  </button>
                </div>
              </div>

              <span *ngIf="form.get('selectedCompanyIds') && form.get('selectedCompanyIds')?.touched && selectedCompanies.length === 0" class="text-red-400 text-sm mt-2 block">Select at least one company</span>
            </div>

            <!-- Password Section -->
            <div class="mb-8">
              <h2 class="text-lg font-semibold text-white mb-6">Login Credentials</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-white font-medium mb-2">Password *</label>
                  <input 
                    type="password" 
                    formControlName="password"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="••••••••">
                  <p class="text-gray-400 text-xs mt-2">Min 8 chars, 1 uppercase, 1 number, 1 special char</p>
                  <span *ngIf="isFieldInvalid('password')" class="text-red-400 text-sm mt-1 block">Strong password required</span>
                </div>

                <div>
                  <label class="block text-white font-medium mb-2">Confirm Password *</label>
                  <input 
                    type="password" 
                    formControlName="confirmPassword"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="••••••••">
                  <span *ngIf="isFieldInvalid('confirmPassword')" class="text-red-400 text-sm mt-1 block">Passwords must match</span>
                </div>
              </div>
            </div>

            <!-- Terms -->
            <div class="mb-8 p-4 bg-slate-700/50 rounded-lg">
              <p class="text-gray-300 text-sm">
                By registering, you agree to our Terms of Service. 
                Your applications will be reviewed by each company.
              </p>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit"
              [disabled]="!form.valid || isLoading || selectedCompanies.length === 0"
              class="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isLoading ? 'Registering...' : 'Submit Application' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class DistributorRegistrationComponent implements OnInit {
  form: FormGroup;
  companySearchControl = new FormBuilder().control('');
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
      confirmPassword: ['', Validators.required],
      selectedCompanyIds: [[]]
    });
  }

  ngOnInit(): void {
    // Setup company search
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
      },
      error: () => {
        this.filteredCompanies = [];
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
    if (!this.form.valid || this.selectedCompanies.length === 0) {
      this.errorMessage = 'Please fill all required fields and select at least one company';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = {
      ...this.form.value,
      companyIds: this.selectedCompanies.map(c => c._id)
    };

    this.registrationService.registerDistributor(formData).subscribe({
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
