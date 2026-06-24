import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-retailer-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './retailer-products.html',
  styleUrls: ['./retailer-products.css']
})
export class RetailerProductsComponent {
  products = [
    { name: 'Detergent Powder', price: '₹180', stock: 'In stock', badge: 'Trending' },
    { name: 'Toilet Cleaner', price: '₹95', stock: 'Low stock', badge: 'New' },
    { name: 'Soap Pack', price: '₹120', stock: 'In stock', badge: 'Offer' }
  ];
}
