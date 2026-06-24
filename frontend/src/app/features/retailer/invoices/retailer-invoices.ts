import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-retailer-invoices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './retailer-invoices.html',
  styleUrls: ['./retailer-invoices.css']
})
export class RetailerInvoicesComponent {
  invoices = [
    { id: 'INV-001', amount: '₹4,200', status: 'Paid' },
    { id: 'INV-002', amount: '₹1,180', status: 'Pending' }
  ];
}
