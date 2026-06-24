import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-card">
      <div class="hero">
        <div>
          <p class="eyebrow">Operations overview</p>
          <h2>Platform health and approval queue</h2>
        </div>
        <span class="pill">Live monitoring</span>
      </div>
      <div class="tiles">
        <article class="tile">
          <h3>Companies</h3>
          <strong>124</strong>
          <p>Active tenant accounts</p>
        </article>
        <article class="tile">
          <h3>Pending approvals</h3>
          <strong>18</strong>
          <p>Needs review today</p>
        </article>
        <article class="tile">
          <h3>Revenue</h3>
          <strong>$42.8k</strong>
          <p>Monthly recurring</p>
        </article>
      </div>
    </section>
  `,
  styles: [`.page-card{background:white;border:1px solid #e2e8f0;border-radius:18px;padding:20px;box-shadow:0 8px 30px rgba(15,23,42,.04)}.hero{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.eyebrow{text-transform:uppercase;letter-spacing:.16em;font-size:.72rem;color:#64748b;margin:0 0 4px}.hero h2{margin:0;font-size:1.2rem}.pill{background:#eff6ff;color:#1d4ed8;padding:8px 10px;border-radius:999px;font-weight:600}.tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.tile{background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:16px}.tile h3{margin:0 0 8px;font-size:1rem}.tile strong{font-size:1.4rem}.tile p{margin:6px 0 0;color:#64748b}@media(max-width:760px){.tiles{grid-template-columns:1fr}}`] 
})
export class SuperAdminDashboardComponent {}
