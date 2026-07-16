import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';

@Component({
  selector: 'app-distributor-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, UiCardComponent],
  templateUrl: './distributor-settings.html',
  styleUrls: ['./distributor-settings.css']
})
export class DistributorSettingsComponent {}
