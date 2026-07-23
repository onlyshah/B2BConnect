import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-retailer-samples',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiPageShellComponent],
  templateUrl: './retailer-samples.html',
  styleUrls: ['./retailer-samples.css']
})
export class RetailerSamplesComponent {
  samples = [
    { name: 'Trial Pack', status: 'Approved' },
    { name: 'New Launch Sample', status: 'Pending' }
  ];
}
