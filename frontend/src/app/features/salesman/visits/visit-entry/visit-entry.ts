import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UiCardComponent } from '../../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../../shared/ui/components/ui-page-shell';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { VisitService } from '../../../../services/visit.service';

@Component({
  selector: 'app-visit-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, UiCardComponent, UiPageShellComponent],
  templateUrl: './visit-entry.html',
  styleUrls: ['./visit-entry.scss']
})
export class VisitEntryComponent implements OnInit {
  visitForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  isEditMode = false;
  visitId: string | null = null;

  visitPurposes = [
    'order-collection',
    'stock-verification',
    'product-demo',
    'feedback',
    'complaint',
    'retailer-onboarding',
    'other'
  ];

  visitOutcomes = [
    'order-placed',
    'demo-given',
    'feedback-collected',
    'completed',
    'not-available',
    'shop-closed',
    'follow-up-required'
  ];

  retailerInterests = ['high', 'medium', 'low', 'not-interested'];

  constructor(
    private fb: FormBuilder,
    private visitService: VisitService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.visitId = params['id'];
        this.loadVisit();
      }
    });
  }

  initializeForm() {
    this.visitForm = this.fb.group({
      retailer: ['', Validators.required],
      distributor: ['', Validators.required],
      visitDate: [new Date().toISOString().split('T')[0], Validators.required],
      purpose: ['order-collection', Validators.required],
      discussionNotes: [''],
      retailerInterest: ['medium'],
      followUpDate: [''],
      visitOutcome: ['completed', Validators.required],
      competitorProducts: this.fb.array([])
    });
  }

  loadVisit() {
    if (this.visitId) {
      this.visitService.getVisit(this.visitId).subscribe({
        next: (visit: any) => {
          this.visitForm.patchValue(visit);
        },
        error: (_err: unknown) => {
          this.error = 'Failed to load visit';
        }
      });
    }
  }

  onSubmit() {
    if (this.visitForm.invalid) return;

    this.loading = true;
    const data = this.visitForm.value;

    const request = this.isEditMode
      ? this.visitService.updateVisit(this.visitId!, data)
      : this.visitService.createVisit(data);

    request.subscribe({
      next: (_response: unknown) => {
        this.loading = false;
        this.success = this.isEditMode ? 'Visit updated' : 'Visit recorded';
        setTimeout(() => {
          this.router.navigate(['/salesman/visits']);
        }, 2000);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to save visit';
      }
    });
  }
}
