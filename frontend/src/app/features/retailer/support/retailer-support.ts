import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-retailer-support',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './retailer-support.html',
  styleUrls: ['./retailer-support.css']
})
export class RetailerSupportComponent {
  supportItems = [
    { title: 'Raise Ticket', detail: 'Contact support instantly' },
    { title: 'Chat Support', detail: 'Talk to distributor support' },
    { title: 'FAQ', detail: 'Find quick answers' }
  ];
}
