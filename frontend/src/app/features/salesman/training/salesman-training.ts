import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salesman-training',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salesman-training.html',
  styleUrls: ['./salesman-training.css']
})
export class SalesmanTrainingComponent {
  trainings = [
    { title: 'Product Training', status: 'Completed' },
    { title: 'Retail Handling', status: 'In Progress' }
  ];
}
