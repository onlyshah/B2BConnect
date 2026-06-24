import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../../services/company.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company-profile.html',
  styleUrls: ['./company-profile.css']
})
export class CompanyProfileComponent implements OnInit {
  form!: FormGroup;
  constructor(private fb: FormBuilder, private companyService: CompanyService, private auth: AuthService) {}
  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      brand: [''],
      gstin: [''],
      pan: [''],
      website: [''],
      email: ['', Validators.email],
      mobile: [''],
      supportContact: [''],
      address: [''],
      country: ['India'],
      state: [''],
      city: [''],
      pincode: ['']
    });

    const user = this.auth.getCurrentUserSync();
    const companyId = user?.companyId;
    if (companyId) {
      this.companyService.getCompany(companyId).subscribe({ next: (data) => this.form.patchValue(data), error: () => {} });
    }
  }
  save() {
    const user = this.auth.getCurrentUserSync();
    const companyId = user?.companyId;
    if (!companyId) {
      console.warn('No companyId available');
      return;
    }

    this.companyService.updateCompany(companyId, this.form.value).subscribe({
      next: (data) => console.log('Saved', data),
      error: (err) => console.error('Save failed', err)
    });
  }
}

