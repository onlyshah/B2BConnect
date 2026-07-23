import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-retailer-stories',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiPageShellComponent],
  templateUrl: './retailer-stories.html',
  styleUrls: ['./retailer-stories.css']
})
export class RetailerStoriesComponent {
  stories = [
    { title: 'New Launch', type: 'Product Launch', body: 'Fresh stock arriving this week', likes: 128 },
    { title: 'Festival Offer', type: 'Offer', body: 'Special pricing for retailers this month', likes: 94 },
    { title: 'Training Video', type: 'Training', body: 'Learn the new product demo flow', likes: 67 }
  ];
}
