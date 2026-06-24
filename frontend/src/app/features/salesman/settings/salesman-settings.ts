import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salesman-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salesman-settings.html',
  styleUrls: ['./salesman-settings.css']
})
export class SalesmanSettingsComponent {
  settings = {
    offlineMode: true,
    gpsEnabled: true,
    notificationsEnabled: true
  };
}
