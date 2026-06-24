import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salesman-surveys',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salesman-surveys.html',
  styleUrls: ['./salesman-surveys.css']
})
export class SalesmanSurveysComponent {
  surveys = [
    { title: 'Demand Survey', status: 'Pending' },
    { title: 'Pricing Survey', status: 'Completed' }
  ];
}
