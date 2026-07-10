import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';

@Component({
  selector: 'app-salesman-demos',
  standalone: true,
  imports: [CommonModule, UiButtonComponent],
  templateUrl: './salesman-demos.html',
  styleUrls: ['./salesman-demos.css']
})
export class SalesmanDemosComponent {
  demos = [
    { retailer: 'Jay Ambe Super', title: 'Product Demo', status: 'Scheduled', agenda: 'New launch' },
    { retailer: 'Metro Convenience', title: 'Launch Activity', status: 'Completed', agenda: 'Sampling' }
  ];
}
