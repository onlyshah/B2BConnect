import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchemeService } from '../../../services/scheme.service';
import { AuthService } from '../../../services/auth.service';
import { ResponseHandlerService } from '../../../services/response-handler.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';

@Component({
  selector: 'app-schemes',
  standalone: true,
  imports: [CommonModule, FormsModule, UiButtonComponent, UiCardComponent],
  templateUrl: './schemes.html',
  styleUrls: ['./schemes.css']
})
export class SchemesComponent implements OnInit, OnDestroy {
  schemes: any[] = [];
  loading = false;
  message = '';
  private destroy$ = new Subject<void>();

  constructor(
    private schemeService: SchemeService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private responseHandler: ResponseHandlerService
  ) {}

  ngOnInit() {
    this.loadSchemes();

    this.authService.currentUser$
      .pipe(filter(user => !!user), takeUntil(this.destroy$))
      .subscribe(() => this.loadSchemes());
  }

  loadSchemes() {
    this.loading = true;
    this.schemeService.getSchemes({ page: 1, limit: 20 }).subscribe({
      next: (data) => {
        this.schemes = data || [];
        this.loading = false;
        try { this.cd.detectChanges(); } catch(e) {}
      },
      error: (err) => {
        console.error('Failed to load schemes', err);
        this.message = 'Unable to load schemes.';
        this.loading = false;
        try { this.cd.detectChanges(); } catch(e) {}
      }
    });
  }

  // Modal-driven scheme creation
  schemeModalOpen = false;
  newSchemeTitle = '';
  newSchemeExpiresAt: string | null = null;

  createScheme() {
    this.newSchemeTitle = '';
    this.newSchemeExpiresAt = null;
    this.schemeModalOpen = true;
  }

  submitCreateScheme() {
    if (!this.newSchemeTitle) {
      this.responseHandler.showError('Title is required');
      return;
    }

    const payload: any = { title: this.newSchemeTitle, status: 'draft' };
    if (this.newSchemeExpiresAt) payload.expiresAt = this.newSchemeExpiresAt;

    this.responseHandler.setLoading(true);
    this.schemeService.createScheme(payload).subscribe({
      next: () => {
        this.responseHandler.setLoading(false);
        this.responseHandler.showSuccess('Scheme created');
        this.schemeModalOpen = false;
        this.loadSchemes();
      },
      error: (e) => {
        this.responseHandler.setLoading(false);
        console.error('Failed to create scheme', e);
        if (e?.error?.errors) {
          this.responseHandler.showValidationErrors(e.error.errors);
        } else {
          this.responseHandler.showError('Unable to create scheme');
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

