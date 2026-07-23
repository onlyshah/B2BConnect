import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-salesman-training',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiPageShellComponent],
  templateUrl: './salesman-training.html',
  styleUrls: ['./salesman-training.css']
})
export class SalesmanTrainingComponent {
  trainings = [
    { title: 'Product Training', status: 'Completed' },
    { title: 'Retail Handling', status: 'In Progress' }
  ];
}
