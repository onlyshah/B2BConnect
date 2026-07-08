import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../../services/company.service';
import { AuthService } from '../../../services/auth.service';
import { LocationService } from '../../../services/location.service';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company-profile.html',
  styleUrls: ['./company-profile.css']
})
export class CompanyProfileComponent implements OnInit {
  form!: FormGroup;
  companyData: any = null;
  tabs = ['overview', 'brands', 'business', 'contacts', 'documents', 'subscription'] as const;
  selectedTab: (typeof this.tabs)[number] = 'overview';
  editing = false;
  loading = false;
  statusMessage = '';
  statusType: 'success' | 'error' | '' = '';
  brands = [] as Array<{ name: string; category: string; products: number; campaigns: number; status: string }>;
  contacts = [] as Array<{ role: string; name: string; email: string; mobile: string }>;
  documents = [] as Array<{ label: string; status: string; available: boolean }>;
  countries: string[] = [];
  states: string[] = [];
  cities: string[] = [];
  areas: string[] = [];
  subscription = {
    plan: 'Enterprise',
    license: 'Annual',
    users: 120,
    storage: '225GB / 500GB',
    renewal: '2027-03-15'
  };
  performance = {
    orders: 1540,
    revenue: '₹18.7M',
    products: 126,
    campaigns: 24,
    stories: 42,
    views: '1.2M'
  };

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private auth: AuthService,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      legalName: [''],
      industry: ['FMCG'],
      gstin: [''],
      pan: [''],
      cin: [''],
      yearEstablished: [''],
      website: [''],
      email: ['', Validators.email],
      phone: [''],
      supportContact: [''],
      address: [''],
      country: ['India'],
      state: [''],
      city: [''],
      area: [''],
      pincode: [''],
      description: ['']
    });

    this.loadCountryData();
    this.loadCompany();
  }

  private loadCompany() {
    const user = this.auth.getCurrentUserSync();
    const companyId = user?.companyId;

    if (companyId) {
      this.fetchCompany(companyId);
      return;
    }

    this.auth.getCurrentUser().subscribe({
      next: (freshUser) => {
        const freshCompanyId = freshUser?.companyId;
        if (freshCompanyId) {
          this.fetchCompany(freshCompanyId);
        } else {
          console.warn('No companyId found for current user', freshUser);
          this.buildSections(null);
        }
      },
      error: (err) => {
        console.error('Failed to load current user', err);
        this.buildSections(null);
      }
    });
  }

  private fetchCompany(companyId: string) {
    this.loading = true;
    this.statusMessage = '';
    this.statusType = '';

    console.log('Fetching company by ID:', companyId);
    this.companyService.getCompany(companyId).subscribe({
      next: (data) => {
        console.log('Company by ID response:', data);
        this.companyData = data;
        this.form.patchValue({
          name: data?.name || '',
          legalName: data?.legalName || data?.name || '',
          industry: data?.industry || data?.businessType || 'FMCG',
          gstin: data?.gstin || data?.gstNumber || '',
          pan: data?.pan || data?.panNumber || '',
          cin: data?.cin || '',
          yearEstablished: data?.yearEstablished || '',
          website: data?.website || '',
          email: data?.email || '',
          phone: data?.phone || '',
          supportContact: data?.supportContact || '',
          address: data?.address || '',
          country: data?.country ?? 'India',
          state: data?.state || '',
          city: data?.city || '',
          area: data?.area || '',
          pincode: data?.pincode || '',
          description: data?.description || ''
        });

        this.onCountryChange();
        this.onStateChange();
        this.buildSections(data);
      },
      error: (err) => {
        console.error('Failed to fetch company by ID', err);
        this.statusMessage = 'Unable to load company details. Please try again.';
        this.statusType = 'error';
        this.buildSections(null);
      },
      complete: () => {
        this.loading = false;
        this.resetStatus();
      }
    });
  }

  buildSections(data: any) {
    this.brands = data?.brands?.length
      ? data.brands
      : [
          { name: 'FreshSip', category: 'Beverages', products: 12, campaigns: 7, status: 'Active' },
          { name: 'Royal', category: 'Dairy', products: 8, campaigns: 3, status: 'Active' },
          { name: 'GreenLeaf', category: 'Snacks', products: 15, campaigns: 5, status: 'Pilot' }
        ];

    this.contacts = data?.contacts?.length
      ? data.contacts
      : [
          { role: 'Owner', name: 'Arun Sharma', email: 'arun@arrvi.com', mobile: '+91 98765 43210' },
          { role: 'Sales Head', name: 'Mira Patel', email: 'mira.patel@arrvi.com', mobile: '+91 91234 56789' },
          { role: 'Accounts Head', name: 'Rajesh Gupta', email: 'rajesh.gupta@arrvi.com', mobile: '+91 99876 54321' }
        ];

    this.documents = data?.documents?.length
      ? data.documents
      : [
          { label: 'GST Certificate', status: 'Verified', available: true },
          { label: 'PAN', status: 'Verified', available: true },
          { label: 'Trade License', status: 'Pending', available: false },
          { label: 'FSSAI', status: 'Verified', available: true },
          { label: 'ISO Certificate', status: 'Expired', available: false }
        ];
  }

  switchTab(tab: 'overview' | 'brands' | 'business' | 'contacts' | 'documents' | 'subscription') {
    this.selectedTab = tab;
  }

  save() {
    const user = this.auth.getCurrentUserSync();
    const companyId = user?.companyId;
    if (!companyId) {
      console.warn('No companyId available');
      this.statusMessage = 'Unable to update profile. Company not selected.';
      this.statusType = 'error';
      this.resetStatus();
      return;
    }

    if (!this.form.value.country) {
      this.form.patchValue({ country: 'India' });
    }

    this.loading = true;
    this.statusMessage = '';
    this.statusType = '';

    const updatedPayload = this.form.value;
    this.companyService.updateCompany(companyId, updatedPayload).subscribe({
      next: (data) => {
        const updatedData = data || updatedPayload;
        this.companyData = updatedData;
        this.form.patchValue({
          name: updatedData?.name || updatedPayload.name || '',
          legalName: updatedData?.legalName || updatedPayload.legalName || updatedPayload.name || '',
          industry: updatedData?.industry || updatedData?.businessType || updatedPayload.industry || updatedPayload.businessType || 'FMCG',
          gstin: updatedData?.gstin || updatedData?.gstNumber || updatedPayload.gstin || '',
          pan: updatedData?.pan || updatedData?.panNumber || updatedPayload.pan || '',
          cin: updatedData?.cin || updatedPayload.cin || '',
          yearEstablished: updatedData?.yearEstablished || updatedPayload.yearEstablished || '',
          website: updatedData?.website || updatedPayload.website || '',
          email: updatedData?.email || updatedPayload.email || '',
          phone: updatedData?.phone || updatedPayload.phone || '',
          supportContact: updatedData?.supportContact || updatedPayload.supportContact || '',
          address: updatedData?.address || updatedPayload.address || '',
          country: updatedData?.country ?? updatedPayload.country ?? 'India',
          state: updatedData?.state || updatedPayload.state || '',
          city: updatedData?.city || updatedPayload.city || '',
          pincode: updatedData?.pincode || updatedPayload.pincode || '',
          description: updatedData?.description || updatedPayload.description || ''
        });
        this.buildSections(updatedData);
        this.editing = false;
        this.statusMessage = 'Company profile updated successfully.';
        this.statusType = 'success';
      },
      error: (err) => {
        console.error('Save failed', err);
        this.statusMessage = 'Failed to update company profile. Please try again.';
        this.statusType = 'error';
      },
      complete: () => {
        this.loading = false;
        this.resetStatus();
      }
    });
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

  private resetStatus(delayMs = 5000) {
    setTimeout(() => {
      this.statusMessage = '';
      this.statusType = '';
    }, delayMs);
  }
}

