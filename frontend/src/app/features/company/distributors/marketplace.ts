import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributorService } from '../../../services/distributor.service';

@Component({
  selector: 'app-distributor-marketplace',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './marketplace.html',
  styleUrls: ['./marketplace.css']
})
export class DistributorMarketplaceComponent implements OnInit {
  distributors: any[] = [];
  loading = false;

  constructor(private distributorService: DistributorService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.distributorService.list({ page: 1, limit: 50 }).subscribe({
      next: (data: any[]) => { this.distributors = data || []; this.loading = false; },
      error: (err) => { console.error('Failed to load distributors', err); this.loading = false; }
    });
  }

  approve(id: string) {
    this.distributorService.approve(id).subscribe({ next: () => this.load(), error: (e) => console.error(e) });
  }

  reject(id: string) {
    const reason = prompt('Rejection reason (optional)') || '';
    this.distributorService.reject(id, reason).subscribe({ next: () => this.load(), error: (e) => console.error(e) });
  }
}
