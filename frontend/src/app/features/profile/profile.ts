import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UiButtonComponent } from '../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../shared/ui/components/ui-page-shell';
import { UiBadgeComponent } from '../../shared/ui/components/ui-badge';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, UiCardComponent, UiPageShellComponent, UiBadgeComponent],
  template: `
    <ui-page-shell title="My Profile" eyebrow="account" description="Review your account details and manage access from one screen.">
      <ng-container slot="actions">
        <ui-button variant="secondary" (clicked)="logout()">Logout</ui-button>
      </ng-container>

      <div *ngIf="loading" class="state-card">Loading profile...</div>
      <div *ngIf="error" class="state-card error">{{ error }}</div>
      <ui-card *ngIf="user && !loading" title="Account overview" subtitle="Your current workspace profile">
        <div class="profile-grid">
          <div class="profile-row"><span>Name</span><strong>{{ user.name || user.firstName + ' ' + user.lastName }}</strong></div>
          <div class="profile-row"><span>Email</span><strong>{{ user.email }}</strong></div>
          <div class="profile-row"><span>Role</span><ui-badge [type]="user.role">{{ user.role }}</ui-badge></div>
          <div class="profile-row" *ngIf="user.tenantId"><span>Tenant</span><strong>{{ user.tenantId }}</strong></div>
          <div class="profile-row" *ngIf="user.companyId"><span>Company</span><strong>{{ user.companyId }}</strong></div>
        </div>
      </ui-card>
    </ui-page-shell>
  `,
  styles: [
    `.profile-grid{display:grid;gap:12px}.profile-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)}.profile-row:last-child{border-bottom:0}.profile-row span{color:var(--text-muted)}.state-card{padding:16px;border:1px dashed var(--border);border-radius:16px;background:var(--surface-muted);color:var(--text-muted)}.state-card.error{color:var(--color-danger);border-color:rgba(229,92,106,.24);background:rgba(229,92,106,.06)}@media (max-width: 640px){.profile-row{flex-direction:column;align-items:flex-start}}`
  ]
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
