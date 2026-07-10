import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UiButtonComponent } from '../../shared/ui/components/ui-button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, UiButtonComponent],
  template: `
    <div class="p-4">
      <h2>My Profile</h2>
      <div *ngIf="loading">Loading profile...</div>
      <div *ngIf="error" class="text-red-600">{{ error }}</div>
      <div *ngIf="user && !loading" class="mt-4 space-y-2">
        <p><strong>Name:</strong> {{ user.name || user.firstName + ' ' + user.lastName }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Role:</strong> {{ user.role }}</p>
        <p *ngIf="user.tenantId"><strong>Tenant:</strong> {{ user.tenantId }}</p>
        <p *ngIf="user.companyId"><strong>Company:</strong> {{ user.companyId }}</p>
        <ui-button variant="secondary" class="mt-4" (clicked)="logout()">Logout</ui-button>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user: any = null;
  loading = true;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load profile';
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: (error) => {
        this.error = error?.error?.message || 'Unable to logout right now. Please close location first.';
      }
    });
  }
}
