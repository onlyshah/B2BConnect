import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-salesman-demos',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiPageShellComponent],
  templateUrl: './salesman-demos.html',
  styleUrls: ['./salesman-demos.css']
})
export class SalesmanDemosComponent {
  demos = [
    { retailer: 'Jay Ambe Super', title: 'Product Demo', status: 'Scheduled', agenda: 'New launch' },
    { retailer: 'Metro Convenience', title: 'Launch Activity', status: 'Completed', agenda: 'Sampling' }
  ];
}
