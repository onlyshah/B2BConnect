import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkspaceLayoutComponent } from '../../shared/ui/layouts/workspace-layout';

@Component({
  selector: 'app-super-admin-layout',
  standalone: true,
  imports: [RouterModule, WorkspaceLayoutComponent],
  template: `
    <app-workspace-layout [role]="role">
      <div class="page-shell">
        <router-outlet></router-outlet>
      </div>
    </app-workspace-layout>
  `,
  styles: []
})
export class SuperAdminLayoutComponent {
  readonly role = 'super-admin';
}
