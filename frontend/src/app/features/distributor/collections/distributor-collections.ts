import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CollectionService } from '../../../services/collection.service';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiEmptyStateComponent } from '../../../shared/ui/components/ui-empty-state';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-distributor-collections',
  standalone: true,
  imports: [CommonModule, RouterModule, UiCardComponent, UiEmptyStateComponent, UiPageShellComponent],
  templateUrl: './distributor-collections.html',
  styleUrls: ['./distributor-collections.css']
})
export class DistributorCollectionsComponent implements OnInit {
  collections: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private collectionService: CollectionService) {}

  ngOnInit(): void {
    this.collectionService.getCollections().subscribe({
      next: (data) => {
        this.collections = data?.data ?? data ?? [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load collections';
        this.loading = false;
      }
    });
  }
}
