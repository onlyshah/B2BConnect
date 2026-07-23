import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-salesman-competitors',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiPageShellComponent],
  templateUrl: './salesman-competitors.html',
  styleUrls: ['./salesman-competitors.css']
})
export class SalesmanCompetitorsComponent {
  reports = [
    { brand: 'Brand X', price: '₹95', remark: 'Offer active' },
    { brand: 'Brand Y', price: '₹88', remark: 'Visible at shelf' }
  ];
}
