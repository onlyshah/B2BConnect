import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-distributor-module-page',
  standalone: true,
  imports: [CommonModule, RouterModule, UiCardComponent, UiPageShellComponent],
  templateUrl: './distributor-module.html',
  styleUrls: ['./distributor-module.css']
})
export class DistributorModulePageComponent {
  title = 'Module';
  description = 'Advanced distributor module';
  icon = '📦';

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data) => {
      this.title = data['title'] || this.title;
      this.description = data['description'] || this.description;
      this.icon = data['icon'] || this.icon;
    });
  }
}
