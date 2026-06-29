import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollectionService } from '../../services/collection.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './collections.html',
  styleUrls: ['./collections.scss']
})
export class CollectionsComponent implements OnInit {
  collections: any[] = [];
  filteredCollections: any[] = [];
  isLoading = true;
  showForm = false;
  formData: FormGroup;
  retailers: any[] = [];
  
  statusOptions = ['recorded', 'verified', 'reconciled'];
  paymentModes = ['cash', 'cheque', 'bank-transfer', 'digital'];

  constructor(
    private collectionService: CollectionService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.formData = this.fb.group({
      retailer: ['', Validators.required],
      amountCollected: ['', [Validators.required, Validators.min(0)]],
      paymentMode: ['', Validators.required],
      referenceId: ['']
    });
  }

  ngOnInit() {
    this.loadCollections();
  }

  loadCollections(filters?: any) {
    this.isLoading = true;
    this.collectionService.getCollections(filters).subscribe({
      next: (response: any) => {
        this.collections = response.data || response;
        this.filteredCollections = this.collections;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading collections:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.formData.invalid) return;
    
    const data = {
      ...this.formData.value,
      distributor: this.authService.getCurrentUserSync()?.distributorId || null
    };

    this.collectionService.recordCollection(data).subscribe({
      next: () => {
        this.showForm = false;
        this.formData.reset();
        this.loadCollections();
      },
      error: (err) => console.error('Error recording collection:', err)
    });
  }

  onFilterChange(status: string) {
    if (status === 'all') {
      this.filteredCollections = this.collections;
    } else {
      this.filteredCollections = this.collections.filter(c => c.status === status);
    }
  }
}
