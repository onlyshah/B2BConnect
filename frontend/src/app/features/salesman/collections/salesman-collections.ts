import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionService } from '../../../services/collection.service';

@Component({
  selector: 'app-salesman-collections',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salesman-collections.html',
  styleUrls: ['./salesman-collections.css']
})
export class SalesmanCollectionsComponent implements OnInit {
  collections = [
    { retailer: 'Jay Ambe Provision Store', amount: '₹2,000', mode: 'UPI', status: 'Collected' },
    { retailer: 'Krishna Mart', amount: '₹1,500', mode: 'Cash', status: 'Pending' },
    { retailer: 'Shiv Shakti Kirana', amount: '₹3,200', mode: 'NEFT', status: 'Collected' }
  ];

  constructor(private collectionService: CollectionService) {}

  ngOnInit(): void {
    this.collectionService.getCollections().subscribe({
      next: (collections) => {
        this.collections = Array.isArray(collections) && collections.length ? collections.slice(0, 5).map((collection: any) => this.toCollectionView(collection)) : this.collections;
      },
      error: () => {
        this.collections = this.collections;
      }
    });
  }

  private toCollectionView(collection: any) {
    return {
      retailer: collection?.retailer?.name || collection?.retailerName || 'Assigned retailer',
      amount: this.formatCurrency(collection?.amountCollected || collection?.amount || 0),
      mode: collection?.paymentMode || 'Cash',
      status: this.capitalize(collection?.status || 'recorded')
    };
  }

  private formatCurrency(value: number) {
    return `₹${value.toLocaleString('en-IN')}`;
  }

  private capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
