import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salesman-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salesman-reports.html',
  styleUrls: ['./salesman-reports.css']
})
export class SalesmanReportsComponent {
  reports = [
    { title: 'Daily Report', value: 'Submitted' },
    { title: 'Weekly Report', value: 'Pending' }
  ];
}
