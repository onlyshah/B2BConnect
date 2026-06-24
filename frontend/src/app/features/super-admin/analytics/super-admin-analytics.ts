import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-super-admin-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-card">
      <div class="title-row">
        <div>
          <p class="eyebrow">Platform metrics</p>
          <h2>Analytics</h2>
        </div>
        <button class="action-btn">Refresh</button>
      </div>
      <div class="tiles">
        <article class="tile">
          <h3>Active users</h3>
          <strong>1,284</strong>
        </article>
        <article class="tile">
          <h3>Orders</h3>
          <strong>328</strong>
        </article>
      </div>
    </section>
  `,
  styles: [`.page-card{background:white;border:1px solid #e2e8f0;border-radius:18px;padding:20px;box-shadow:0 8px 30px rgba(15,23,42,.04)}.title-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.eyebrow{text-transform:uppercase;letter-spacing:.16em;font-size:.72rem;color:#64748b;margin:0 0 4px}.title-row h2{margin:0;font-size:1.2rem}.action-btn{background:#1d4ed8;color:white;border:none;padding:10px 12px;border-radius:10px;font-weight:600}.tiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.tile{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:14px}.tile h3{margin:0 0 8px;font-size:1rem}.tile strong{font-size:1.4rem}@media(max-width:760px){.title-row{flex-direction:column;align-items:flex-start;gap:8px}.tiles{grid-template-columns:1fr}}`] 
})
export class SuperAdminAnalyticsComponent {}
