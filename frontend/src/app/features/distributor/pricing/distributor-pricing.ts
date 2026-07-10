import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PricingService } from '../../../services/pricing.service';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';

@Component({
  selector: 'app-distributor-pricing',
  standalone: true,
  imports: [CommonModule, RouterModule, UiCardComponent],
  templateUrl: './distributor-pricing.html',
  styleUrls: ['./distributor-pricing.css']
})
export class DistributorPricingComponent implements OnInit {
  pricing: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private pricingService: PricingService) {}

  ngOnInit(): void {
    this.pricingService.getPricingRules().subscribe({
      next: (data) => {
        this.pricing = (data as any)?.data ?? data ?? [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load pricing';
        this.loading = false;
      }
    });
  }
}
