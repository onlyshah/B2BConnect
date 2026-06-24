import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salesman-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salesman-notifications.html',
  styleUrls: ['./salesman-notifications.css']
})
export class SalesmanNotificationsComponent {
  notifications = [
    { title: 'Visit Reminder', detail: '3 retailers pending today' },
    { title: 'Sample Approval', detail: 'Your sample request is approved' }
  ];
}
