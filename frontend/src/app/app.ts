import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationStart, NavigationCancel, NavigationEnd, NavigationError } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { ResponseHandlerService, Toast } from './services/response-handler.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  title = 'B2BConnect';
  isLoggedIn = false;
  user: any = null;
  isLoading = false;
  toasts: Toast[] = [];

  constructor(
    public authService: AuthService,
    private router: Router,
    private responseHandler: ResponseHandlerService
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.isLoading = false;
      }
    });

    this.authService.currentUser$.subscribe((user: any) => {
      this.user = user;
      if (user) {
        this.isLoading = false;
      }
    });

    this.responseHandler.loading$.subscribe((loading: boolean) => {
      this.isLoading = loading;
    });

    this.responseHandler.toasts$.subscribe((toasts: Toast[]) => {
      this.toasts = toasts;
    });

    this.authService.initializeAuthState();

    this.router.events.subscribe((event) => {
      if (
        event instanceof NavigationStart ||
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => this.responseHandler.setLoading(false), 0);
      }
    });
  }

  closeToast(id: string) {
    this.responseHandler.removeToast(id);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.user = null;
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.responseHandler.showError(error?.error?.message || 'Unable to logout right now. Please close location first.');
      }
    });
  }
}
