import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-salesman-followups',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiPageShellComponent],
  templateUrl: './salesman-followups.html',
  styleUrls: ['./salesman-followups.css']
})
export class SalesmanFollowupsComponent {
  followups = [
    { retailer: 'Jay Ambe Super', type: 'Payment', due: 'Today', priority: 'High' },
    { retailer: 'Metro Convenience', type: 'Sample', due: 'Tomorrow', priority: 'Medium' }
  ];
}
