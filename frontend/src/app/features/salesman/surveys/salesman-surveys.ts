import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-salesman-surveys',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiPageShellComponent],
  templateUrl: './salesman-surveys.html',
  styleUrls: ['./salesman-surveys.css']
})
export class SalesmanSurveysComponent {
  surveys = [
    { title: 'Demand Survey', status: 'Pending' },
    { title: 'Pricing Survey', status: 'Completed' }
  ];
}
