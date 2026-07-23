import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-salesman-reports',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiPageShellComponent],
  templateUrl: './salesman-reports.html',
  styleUrls: ['./salesman-reports.css']
})
export class SalesmanReportsComponent {
  reports = [
    { title: 'Daily Report', value: 'Submitted', detail: '4 visits • 2 orders' },
    { title: 'Weekly Report', value: 'Pending', detail: 'Target review due' }
  ];
}
