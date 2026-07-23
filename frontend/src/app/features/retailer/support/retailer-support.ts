import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-retailer-support',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiPageShellComponent],
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
