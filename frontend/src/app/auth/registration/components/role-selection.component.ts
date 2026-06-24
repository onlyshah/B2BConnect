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
    <div class="page-shell">
      <div class="page-frame">
        <div class="hero-panel">
          <span class="badge">Registration</span>
          <h1 class="hero-title">Pick your registration path</h1>
          <p class="hero-copy">
            One clean onboarding experience for every role. Select your profile and continue with a role-specific registration form.
          </p>
        </div>

        <div class="cards-grid">
          <button
            *ngFor="let role of roles"
            class="role-card"
            [style.--accent]="role.accent"
            type="button"
            (click)="selectRole(role)"
          >
            <div class="role-card__media">
              <span>{{ role.icon }}</span>
            </div>
            <div class="role-card__body">
              <h2>{{ role.title }}</h2>
              <p>{{ role.description }}</p>
            </div>
            <div class="role-card__cta">Continue →</div>
          </button>
        </div>

        <div class="footer-panel">
          <p>
            Already have an account?
            <a routerLink="/login">Login here</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .page-shell {
      min-height: 100vh;
      padding: 2rem;
      background: radial-gradient(circle at top left, rgba(96, 165, 250, 0.16), transparent 24%),
                  linear-gradient(180deg, #071118 0%, #111827 100%);
      color: #e2e8f0;
    }

    .page-frame {
      max-width: 1180px;
      margin: 0 auto;
      display: grid;
      gap: 2rem;
    }

    .hero-panel {
      padding: 2.25rem;
      border-radius: 28px;
      background: rgba(15, 23, 42, 0.92);
      border: 1px solid rgba(148, 163, 184, 0.14);
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.22);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 1rem;
      border-radius: 999px;
      background: rgba(99, 102, 241, 0.18);
      color: #c7d2fe;
      font-size: 0.82rem;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      margin-bottom: 1rem;
    }

    .hero-title {
      margin: 0;
      font-size: clamp(2.2rem, 3.5vw, 3.4rem);
      line-height: 1.03;
      color: #f8fafc;
    }

    .hero-copy {
      margin: 1rem 0 0;
      max-width: 680px;
      color: #cbd5e1;
      font-size: 1rem;
      line-height: 1.8;
    }

    .cards-grid {
      display: grid;
      gap: 1.25rem;
      grid-template-columns: 1fr;
    }

    @media (min-width: 980px) {
      .cards-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    .role-card {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      width: 100%;
      padding: 1.8rem;
      border-radius: 22px;
      border: 1px solid rgba(148, 163, 184, 0.12);
      background: rgba(15, 23, 42, 0.94);
      box-shadow: 0 24px 55px rgba(0, 0, 0, 0.20);
      transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
      cursor: pointer;
      text-align: left;
    }

    .role-card:hover {
      transform: translateY(-4px);
      border-color: rgba(99, 102, 241, 0.45);
      background: rgba(30, 41, 59, 1);
    }

    .role-card__media {
      width: 54px;
      height: 54px;
      display: grid;
      place-items: center;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.08);
      color: var(--accent, #8b5cf6);
      font-size: 1.5rem;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
    }

    .role-card__body h2 {
      margin: 0;
      color: #f8fafc;
      font-size: 1.35rem;
      line-height: 1.25;
    }

    .role-card__body p {
      margin: 0.75rem 0 0;
      color: #cbd5e1;
      font-size: 0.96rem;
      line-height: 1.75;
    }

    .role-card__cta {
      align-self: flex-start;
      padding: 0.85rem 1.3rem;
      border-radius: 9999px;
      background: linear-gradient(135deg, var(--accent, #8b5cf6), #4338ca);
      color: white;
      font-weight: 700;
      transition: transform 0.2s ease;
    }

    .role-card:hover .role-card__cta {
      transform: translateY(-1px);
    }

    .footer-panel {
      padding: 1.9rem 2.2rem;
      border-radius: 22px;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.10);
      color: #cbd5e1;
    }

    .footer-panel p {
      margin: 0;
      font-size: 0.98rem;
    }

    .footer-panel a {
      color: #93c5fd;
      font-weight: 700;
      text-decoration: none;
    }

    .footer-panel a:hover {
      text-decoration: underline;
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
