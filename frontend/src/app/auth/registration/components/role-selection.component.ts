import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

interface RoleOption {
  id: string;
  icon: string;
  title: string;
  description: string;
  accent: string;
}

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="auth-content">
      <div class="role-wrapper">
        <div class="role-header">
          <h2>Create your account</h2>
          <p class="subtitle">Select your role to continue with the right registration form</p>
        </div>

        <div class="role-grid">
          <button
            *ngFor="let role of roles"
            class="role-card"
            [style.--accent]="role.accent"
            type="button"
            (click)="selectRole(role)"
          >
            <div class="role-icon">
              <span>{{ role.icon }}</span>
            </div>
            <div class="role-text">
              <h3>{{ role.title }}</h3>
              <p class="role-desc">{{ role.description }}</p>
            </div>
            <span class="role-btn">Continue</span>
            <span class="role-chevron">→</span>
          </button>
        </div>

        <p class="switch-auth">Already have an account? <a routerLink="/login">Log in</a></p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --auth-primary: #3671e9;
      --auth-primary-tint: #eaf1fd;
      --auth-text-primary: #1a1a1a;
      --auth-text-secondary: #6b7280;
      --auth-border: #e5e7eb;
      --auth-surface: #ffffff;
      --auth-bg: #f7f8fa;
      --auth-radius: 12px;
      display: block;
    }

    .auth-content {
      min-height: 100vh;
      background: var(--auth-bg);
      padding: 16px;
    }

    .role-wrapper {
      max-width: 640px;
      margin: 40px auto;
      padding: 0 16px 32px;
    }

    .role-header {
      margin-bottom: 20px;
    }

    .role-header h2 {
      font-size: 20px;
      font-weight: 600;
      color: var(--auth-text-primary);
      margin: 0 0 4px;
    }

    .role-header .subtitle {
      font-size: 13px;
      color: var(--auth-text-secondary);
      margin: 0;
    }

    .role-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .role-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 14px;
      width: 100%;
      padding: 20px;
      height: 100%;
      cursor: pointer;
      text-align: left;
      background: var(--auth-surface);
      border: 1px solid var(--auth-border);
      border-radius: var(--auth-radius);
      transition: border-color 0.15s ease, transform 0.18s ease;
    }

    .role-card:hover {
      border-color: var(--auth-primary);
      transform: translateY(-2px);
    }

    .role-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: var(--auth-primary-tint);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2px;
      font-size: 20px;
      color: var(--auth-primary);
    }

    .role-text h3 {
      font-size: 15px;
      font-weight: 600;
      color: var(--auth-text-primary);
      margin: 0 0 6px;
    }

    .role-desc {
      font-size: 13px;
      color: var(--auth-text-secondary);
      line-height: 1.5;
      margin: 0 0 16px;
    }

    .role-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 38px;
      border-radius: 8px;
      border: 1px solid var(--auth-border);
      color: var(--auth-text-primary);
      background: transparent;
      font-weight: 600;
      text-transform: none;
    }

    .role-chevron {
      display: none;
    }

    .switch-auth {
      font-size: 13px;
      color: var(--auth-text-secondary);
      text-align: center;
      margin: 20px 0 0;
    }

    .switch-auth a {
      color: var(--auth-primary);
      text-decoration: none;
      font-weight: 600;
    }

    @media (max-width: 576px) {
      .role-wrapper {
        margin: 0;
        padding: 20px 0 24px;
      }

      .role-grid {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .role-card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        flex-direction: row;
      }

      .role-icon {
        width: 34px;
        height: 34px;
        margin-bottom: 0;
        flex-shrink: 0;
      }

      .role-text {
        flex: 1;
        min-width: 0;
      }

      .role-text h3 {
        margin: 0;
      }

      .role-desc {
        display: none;
      }

      .role-btn {
        display: none;
      }

      .role-chevron {
        display: block;
        font-size: 18px;
        color: var(--auth-text-secondary);
        flex-shrink: 0;
      }
    }
  `]
})
export class RoleSelectionComponent {
  roles: RoleOption[] = [
    {
      id: 'company',
      icon: '🏢',
      title: 'Company',
      description: 'Register as a manufacturer or brand to manage products, distributors, salesmen and campaigns.',
      accent: '#8b5cf6'
    },
    {
      id: 'distributor',
      icon: '🚚',
      title: 'Distributor',
      description: 'Apply to distribute brands, manage inventory, retailers and order fulfillment.',
      accent: '#2563eb'
    },
    {
      id: 'salesman',
      icon: '👨‍💼',
      title: 'Salesman',
      description: 'Join as a field sales representative to manage visits, orders and retailer onboarding.',
      accent: '#22c55e'
    },
    {
      id: 'retailer',
      icon: '🏪',
      title: 'Retailer',
      description: 'Create an account to browse products, order online and grow your retail business.',
      accent: '#f97316'
    }
  ];

  constructor(private router: Router) {}

  selectRole(role: RoleOption): void {
    this.router.navigate(['/register', role.id]);
  }
}
