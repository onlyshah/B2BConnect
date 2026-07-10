import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';

@Component({
  selector: 'app-salesman-notifications',
  standalone: true,
  imports: [CommonModule, UiButtonComponent],
  templateUrl: './salesman-notifications.html',
  styleUrls: ['./salesman-notifications.css']
})
export class SalesmanNotificationsComponent {
  notifications = [
    { title: 'Visit Reminder', detail: '3 retailers pending today', time: '10 mins ago' },
    { title: 'Sample Approval', detail: 'Your sample request is approved', time: '1 hour ago' }
  ];
}
