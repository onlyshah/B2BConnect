import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
  IonIcon,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mapOutline, callOutline } from 'ionicons/icons';
import { VisitService } from '../../../services/visit.service';

addIcons({ mapOutline, callOutline });

@Component({
  selector: 'app-visit-entry-mobile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonButton,
    IonItem,
    IonLabel,
    IonText,
    IonIcon,
    IonSpinner
  ],
  templateUrl: './visit-entry-mobile.html',
  styleUrls: ['./visit-entry-mobile.scss']
})
export class VisitEntryMobileComponent implements OnInit {
  visitForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private visitService: VisitService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.visitForm = this.fb.group({
      retailer: ['', Validators.required],
      purpose: ['order-collection', Validators.required],
      discussionNotes: [''],
      retailerInterest: ['medium'],
      visitOutcome: ['completed', Validators.required]
    });
  }

  onSubmit() {
    if (this.visitForm.invalid) return;

    this.loading = true;
    const data = this.visitForm.value;

    this.visitService.createVisit(data).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = 'Visit recorded successfully!';
        setTimeout(() => {
          this.router.navigate(['/home/visits']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to record visit';
      }
    });
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log('Location:', position.coords);
      });
    }
  }
}
