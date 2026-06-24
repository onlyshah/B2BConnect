import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-super-admin-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-card">
      <div class="title-row">
        <div>
          <p class="eyebrow">Exports</p>
          <h2>Reports</h2>
        </div>
        <button class="action-btn">Download</button>
      </div>
      <div class="list">
        <article class="item">
          <strong>Sales summary</strong>
          <span>Updated 2h ago</span>
        </article>
      </div>
    </section>
  `,
  styles: [`.page-card{background:white;border:1px solid #e2e8f0;border-radius:18px;padding:20px;box-shadow:0 8px 30px rgba(15,23,42,.04)}.title-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.eyebrow{text-transform:uppercase;letter-spacing:.16em;font-size:.72rem;color:#64748b;margin:0 0 4px}.title-row h2{margin:0;font-size:1.2rem}.action-btn{background:#1d4ed8;color:white;border:none;padding:10px 12px;border-radius:10px;font-weight:600}.list{display:grid;gap:10px}.item{display:flex;justify-content:space-between;align-items:center;border:1px solid #e2e8f0;border-radius:12px;padding:12px 14px;background:#f8fafc}.item span{color:#64748b}@media(max-width:760px){.title-row,.item{flex-direction:column;align-items:flex-start;gap:8px}}`] 
})
export class SuperAdminReportsComponent {}
