import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiEmptyStateComponent } from '../../../shared/ui/components/ui-empty-state';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-distributor-inventory',
  standalone: true,
  imports: [CommonModule, RouterModule, UiCardComponent, UiEmptyStateComponent, UiPageShellComponent],
  templateUrl: './distributor-inventory.html',
  styleUrls: ['./distributor-inventory.css']
})
export class DistributorInventoryComponent implements OnInit {
  inventory: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.inventoryService.getInventory().subscribe({
      next: (data) => {
        this.inventory = (data as any)?.data ?? data ?? [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load inventory';
        this.loading = false;
      }
    });
  }
}
