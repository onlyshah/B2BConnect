import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { ConfirmOption, ResponseHandlerService, Toast } from './services/response-handler.service';
import { UiConfirmDialogComponent } from './shared/ui/components/ui-confirm-dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule, UiConfirmDialogComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  title = 'B2BConnect';

  constructor(
    public authService: AuthService,
    private router: Router,
    public responseHandler: ResponseHandlerService
  ) {}

  ngOnInit() {
    this.authService.initializeAuthState();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }

  openMobileMenu(): void {
    // Mobile header uses the avatar/menu affordance as a tap target.
    // No extra script is required for the current auth state behavior.
  }

  get toastClass(): string {
    return 'toast';
  }

  trackByToast(index: number, toast: Toast): string {
    return toast.id;
  }

  get confirmState() {
    return this.responseHandler.confirm$;
  }

  confirmDialogOptions(): ConfirmOption | null {
    return this.responseHandler.currentConfirmState.options ?? null;
  }

  handleConfirm(): void {
    this.responseHandler.resolveConfirm(true);
  }

  handleCancel(): void {
    this.responseHandler.resolveConfirm(false);
  }
}
