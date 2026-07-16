import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationStart, NavigationCancel, NavigationEnd, NavigationError } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { ResponseHandlerService } from './services/response-handler.service';

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
  userRole = 'User';
  userTitle = 'Member';
  userName = 'Guest';
  userInitials = 'G';
  isLoading = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    public responseHandler: ResponseHandlerService
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
      this.syncHeaderProfile(user);
      if (user) {
        this.isLoading = false;
      }
    });

    this.responseHandler.loading$.subscribe((loading: boolean) => {
      this.isLoading = loading;
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

  logout() {
    this.resetSessionState();

    this.authService.logout().subscribe({
      next: () => {
        this.resetSessionState();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.resetSessionState();
        this.router.navigate(['/login']);
      }
    });
  }

  openMobileMenu(): void {
    // Mobile header uses the avatar/menu affordance as a tap target.
    // No extra script is required for the current auth state behavior.
  }

  private resetSessionState(): void {
    this.user = null;
    this.isLoggedIn = false;
    this.isLoading = false;
    this.syncHeaderProfile(null);
  }

  private syncHeaderProfile(user: any): void {
    const rawName = user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'Guest';
    const role = (user?.role || 'user').toString().replace(/-/g, ' ').replace(/\b\w/g, (match: string) => match.toUpperCase());
    const initials = rawName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part[0]?.toUpperCase() || '')
      .join('') || 'G';

    this.userName = rawName;
    this.userRole = role;
    this.userTitle = user?.role ? role : 'Member';
    this.userInitials = initials;
  }
}
