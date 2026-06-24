import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-retailer-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './retailer-settings.html',
  styleUrls: ['./retailer-settings.css']
})
export class RetailerSettingsComponent {
  profile = {
    storeName: 'Arrvi Retail',
    ownerName: 'Ravi Sharma',
    mobile: '+91-9876543210',
    city: 'Mumbai'
  };
}
