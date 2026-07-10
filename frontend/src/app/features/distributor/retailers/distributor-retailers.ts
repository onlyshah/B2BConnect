import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RetailerService } from '../../../services/retailer.service';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';

@Component({
  selector: 'app-distributor-retailers',
  standalone: true,
  imports: [CommonModule, RouterModule, UiCardComponent],
  templateUrl: './distributor-retailers.html',
  styleUrls: ['./distributor-retailers.css']
})
export class DistributorRetailersComponent implements OnInit {
  retailers: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private retailerService: RetailerService) {}

  ngOnInit(): void {
    this.retailerService.getRetailers().subscribe({
      next: (data) => {
        this.retailers = (data as any)?.data ?? data ?? [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load retailers';
        this.loading = false;
      }
    });
  }
}
