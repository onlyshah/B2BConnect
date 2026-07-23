import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-salesman-settings',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiPageShellComponent],
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
