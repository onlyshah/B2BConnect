import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VisitService } from '../../../services/visit.service';

@Component({
  selector: 'app-visit-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './visit-list.html',
  styleUrls: ['./visit-list.scss']
})
export class VisitListComponent implements OnInit {
  visits: any[] = [];
  loading = true;
  filterStatus = 'all';

  statusOptions = ['all', 'completed', 'pending', 'cancelled'];

  constructor(private visitService: VisitService) {}

  ngOnInit() {
    this.loadVisits();
  }

  loadVisits() {
    this.loading = true;
    const filters = this.filterStatus !== 'all' ? { status: this.filterStatus } : {};

    this.visitService.getVisits(filters).subscribe({
      next: (data) => {
        this.visits = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading visits', err);
        this.loading = false;
      }
    });
  }

  onFilterChange() {
    this.loadVisits();
  }

  getStatusBadge(status: string): string {
    const badges: any = {
      completed: '#27ae60',
      pending: '#f39c12',
      cancelled: '#e74c3c'
    };
    return badges[status] || '#95a5a6';
  }
}
