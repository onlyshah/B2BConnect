import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonInput, IonSelect, IonSelectOption, IonSegment, IonSegmentButton, IonLabel, IonIcon, IonSpinner, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { CollectionService } from '../../services/collection.service';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonIcon,
    IonSpinner,
    IonFab,
    IonFabButton
  ],
  templateUrl: './collections.html',
  styleUrls: ['./collections.scss']
})
export class CollectionsPage implements OnInit {
  collections: any[] = [];
  filteredCollections: any[] = [];
  isLoading = true;
  showForm = false;
  selectedStatus = 'all';
  formData: FormGroup;

  constructor(
    private collectionService: CollectionService,
    private fb: FormBuilder
  ) {
    addIcons({ add });
    this.formData = this.fb.group({
      retailer: ['', Validators.required],
      amountCollected: ['', [Validators.required, Validators.min(0)]],
      paymentMode: ['cash', Validators.required],
      referenceId: ['']
    });
  }

  ngOnInit() {
    this.loadCollections();
  }

  loadCollections() {
    this.isLoading = true;
    this.collectionService.getCollections().subscribe({
      next: (response: any) => {
        this.collections = response.data || response;
        this.filterCollections();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading collections:', err);
        this.isLoading = false;
      }
    });
  }

  filterCollections() {
    if (this.selectedStatus === 'all') {
      this.filteredCollections = this.collections;
    } else {
      this.filteredCollections = this.collections.filter(c => c.status === this.selectedStatus);
    }
  }

  onStatusChange(status: string) {
    this.selectedStatus = status;
    this.filterCollections();
  }

  onSubmit() {
    if (this.formData.invalid) return;

    const data = {
      ...this.formData.value,
      distributor: localStorage.getItem('distributorId')
    };

    this.collectionService.recordCollection(data).subscribe({
      next: () => {
        this.showForm = false;
        this.formData.reset();
        this.loadCollections();
      },
      error: (err) => console.error('Error:', err)
    });
  }
}
