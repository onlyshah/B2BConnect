import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-retailer-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './retailer-notifications.html',
  styleUrls: ['./retailer-notifications.css']
})
export class RetailerNotificationsComponent {
  items = [
    { title: 'New Offer', body: 'Festival pricing is live' },
    { title: 'Order Update', body: 'Your order is packed and ready' }
  ];
}
