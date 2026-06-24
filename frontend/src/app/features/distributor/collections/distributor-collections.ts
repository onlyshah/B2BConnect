import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CollectionService } from '../../../services/collection.service';

@Component({
  selector: 'app-distributor-collections',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
