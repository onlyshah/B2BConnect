import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';

@Component({
  selector: 'app-salesman-reports',
  standalone: true,
  imports: [CommonModule, UiButtonComponent],
  templateUrl: './salesman-reports.html',
  styleUrls: ['./salesman-reports.css']
})
export class SalesmanReportsComponent {
  reports = [
    { title: 'Daily Report', value: 'Submitted', detail: '4 visits • 2 orders' },
    { title: 'Weekly Report', value: 'Pending', detail: 'Target review due' }
  ];
}
