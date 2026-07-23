import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RetailerService } from '../../../services/retailer.service';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiEmptyStateComponent } from '../../../shared/ui/components/ui-empty-state';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-distributor-retailers',
  standalone: true,
  imports: [CommonModule, RouterModule, UiButtonComponent, UiCardComponent, UiEmptyStateComponent, UiPageShellComponent],
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
