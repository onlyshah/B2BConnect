import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-salesman-stories',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiPageShellComponent],
  templateUrl: './salesman-stories.html',
  styleUrls: ['./salesman-stories.css']
})
export class SalesmanStoriesComponent {
  stories = [
    { title: 'New Launch', detail: 'Fresh campaign available', type: 'Product Launch' },
    { title: 'Festival Offer', detail: 'Special scheme for the week', type: 'Offer' }
  ];
}
