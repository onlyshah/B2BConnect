import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UiBottomTabsComponent } from '../components/ui-bottom-tabs';
import { AuthService } from '../../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

export interface DashboardNavItem {
  label: string;
  route: string;
  icon: string;
  exact?: boolean;
  permission?: string;
}

export interface DashboardNavGroup {
  title: string;
  items: DashboardNavItem[];
}

@Component({
  selector: 'dashboard-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UiBottomTabsComponent],
  template: `
    <div class="fortress-shell">
      <aside class="fortress-sidebar" [class.is-collapsed]="isCollapsed">
        <div class="brand-strip">
          <div class="brand-mark">{{ appMark }}</div>
          <div class="brand-copy" *ngIf="!isCollapsed">
            <div class="brand-title">{{ appName }}</div>
            <div class="brand-subtitle">{{ roleLabel || eyebrow }}</div>
          </div>
          <button type="button" class="icon-button sidebar-toggle" (click)="toggleSidebar()" [attr.aria-label]="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'">
            <span>{{ isCollapsed ? '›' : '‹' }}</span>
          </button>
        </div>

        <div class="sidebar-search" *ngIf="!isCollapsed">
          <label class="search-field search-field-sidebar">
            <span>⌕</span>
            <input type="search" [(ngModel)]="searchTerm" [placeholder]="searchPlaceholder" />
          </label>
        </div>

        <div class="nav-stack">
          <section class="nav-group" *ngFor="let group of visibleNavGroups">
            <p class="nav-group-title" *ngIf="!isCollapsed">{{ group.title }}</p>
            <nav class="nav-links">
              <a
                *ngFor="let item of group.items"
                [routerLink]="item.route"
                routerLinkActive="is-active"
                [routerLinkActiveOptions]="{ exact: item.exact ?? item.route === '/'}"
                class="nav-link"
                [class.has-permission]="item.permission"
              >
                <span class="nav-icon">{{ item.icon }}</span>
                <span class="nav-label" *ngIf="!isCollapsed">{{ item.label }}</span>
              </a>
            </nav>
          </section>
        </div>

        <div class="sidebar-footer" *ngIf="currentUser as user">
          <div class="user-chip">
            <div class="avatar">{{ userInitials }}</div>
            <div class="user-copy" *ngIf="!isCollapsed">
              <div class="user-name">{{ user.name || user.email }}</div>
              <div class="user-role">{{ currentUserRole }}</div>
            </div>
          </div>
          <button type="button" class="icon-button logout-button" (click)="logout()" [attr.aria-label]="'Log out'">
            <span>↪</span>
          </button>
        </div>
      </aside>

      <div class="fortress-main">
        <header class="fortress-topbar">
          <div class="title-block">
            <div class="page-context">
              <span class="page-context__pill" *ngIf="eyebrow">{{ eyebrow }}</span>
              <span class="page-context__divider" *ngIf="eyebrow && title">/</span>
              <span class="page-context__title">{{ title }}</span>
            </div>
            <p class="subtitle" *ngIf="subtitle">{{ subtitle }}</p>
          </div>

          <div class="topbar-tools">
            <label class="search-field search-field-topbar">
              <span>⌕</span>
              <input type="search" [(ngModel)]="searchTerm" [placeholder]="searchPlaceholder" />
            </label>

            <div class="topbar-actions">
              <ng-content select="[slot=header-actions]"></ng-content>
            </div>

            <div class="profile-chip" *ngIf="currentUser as user">
              <div class="avatar avatar-sm">{{ userInitials }}</div>
              <div class="profile-copy">
                <div class="profile-name">{{ user.name || user.email }}</div>
                <div class="profile-role">{{ currentUserRole }}</div>
              </div>
            </div>
          </div>
        </header>

        <main class="fortress-content">
          <section class="content-surface">
            <ng-content></ng-content>
          </section>
        </main>
      </div>
    </div>

    <ui-bottom-tabs [items]="mobileNavItems"></ui-bottom-tabs>
  `,
  styleUrls: ['./dashboard-layout.css']
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  @Input() appName = 'B2BConnect';
  @Input() title = 'Workspace';
  @Input() subtitle = '';
  @Input() eyebrow = 'Operations';
  @Input() roleLabel = '';
  @Input() searchPlaceholder = 'Search the workspace';
  @Input() storageKey = 'dashboard-shell-collapsed';
  @Input() navGroups: DashboardNavGroup[] = [];
  @Input() mobileNavItems: DashboardNavItem[] = [];

  isCollapsed = localStorage.getItem(this.storageKey) === 'true';
  searchTerm = '';
  currentUser: { name?: string; email: string; role: string } | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUserSync();

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get appMark(): string {
    return (this.appName || 'B2BConnect').slice(0, 1).toUpperCase();
  }

  get currentUserRole(): string {
    const role = this.currentUser?.role?.replace(/-/g, ' ') || this.roleLabel || this.eyebrow;
    return role
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  get userInitials(): string {
    const name = this.currentUser?.name || this.currentUser?.email || 'U';
    const parts = name.split(' ').filter(Boolean);
    const first = parts[0]?.charAt(0) ?? name.charAt(0);
    const second = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return `${first}${second}`.toUpperCase();
  }

  get visibleNavGroups(): DashboardNavGroup[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => this.canShowItem(item) && (!term || item.label.toLowerCase().includes(term)))
      }))
      .filter((group) => group.items.length > 0);
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem(this.storageKey, String(this.isCollapsed));
  }

  logout(): void {
    this.authService.logout().pipe(takeUntil(this.destroy$)).subscribe({
      next: () => void this.router.navigateByUrl('/login'),
      error: () => void this.router.navigateByUrl('/login')
    });
  }

  private canShowItem(item: DashboardNavItem): boolean {
    if (!item.permission) {
      return true;
    }

    return this.authService.hasPermission(item.permission);
  }
}
