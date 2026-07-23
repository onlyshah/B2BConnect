import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DashboardLayoutComponent, DashboardNavGroup, DashboardNavItem } from './dashboard-layout';
import { AuthService } from '../../../services/auth.service';
import { WorkspaceRole, WorkspaceShellConfigService } from '../../../services/workspace-shell-config.service';

export interface WorkspaceRouteContext {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  searchPlaceholder?: string;
  segment?: string;
}

export function humanizeRouteSegment(segment?: string): string {
  if (!segment) {
    return '';
  }

  const lastSegment = segment
    .split('/')
    .filter(Boolean)
    .pop() || segment;

  return lastSegment
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function resolveWorkspaceRouteContext(route: ActivatedRoute | null): WorkspaceRouteContext {
  const context: WorkspaceRouteContext = {};
  let currentRoute: ActivatedRoute | null = route;

  while (currentRoute) {
    const snapshot = currentRoute.snapshot;
    const routeData = snapshot.data ?? {};
    const currentSegment = snapshot.url?.map((segment) => segment.path).filter(Boolean).join('/');

    if (!context.segment && currentSegment) {
      context.segment = currentSegment;
    }

    if (routeData['title']) {
      context.title = String(routeData['title']);
    }

    if (routeData['subtitle']) {
      context.subtitle = String(routeData['subtitle']);
    }

    if (routeData['eyebrow']) {
      context.eyebrow = String(routeData['eyebrow']);
    }

    if (routeData['searchPlaceholder']) {
      context.searchPlaceholder = String(routeData['searchPlaceholder']);
    }

    currentRoute = currentRoute.firstChild;
  }

  if (!context.title && context.segment) {
    context.title = humanizeRouteSegment(context.segment);
  }

  return context;
}

@Component({
  selector: 'app-workspace-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DashboardLayoutComponent],
  template: `
    <dashboard-layout
      [appName]="appName"
      [title]="title"
      [subtitle]="subtitle"
      [eyebrow]="eyebrow"
      [roleLabel]="roleLabel"
      [searchPlaceholder]="searchPlaceholder"
      [storageKey]="storageKey"
      [navGroups]="navGroups"
      [mobileNavItems]="mobileNavItems"
    >
      <div class="page-shell">
        <router-outlet></router-outlet>
      </div>
    </dashboard-layout>
  `
})
export class WorkspaceLayoutComponent implements OnInit, OnChanges, OnDestroy {
  @Input() role: WorkspaceRole | null = null;
  @Input() appName = 'B2BConnect';
  @Input() roleLabel = 'Workspace';
  @Input() eyebrow = 'Operations';
  @Input() title = 'Workspace';
  @Input() subtitle = '';
  @Input() searchPlaceholder = 'Search the workspace';
  @Input() storageKey = 'workspace-shell-collapsed';
  @Input() navGroups: DashboardNavGroup[] = [];
  @Input() mobileNavItems: DashboardNavItem[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private shellConfigService: WorkspaceShellConfigService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe();
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.applyRoleConfiguration());

    this.applyRoleConfiguration();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['role']) {
      this.applyRoleConfiguration();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private applyRoleConfiguration(): void {
    if (!this.role) {
      return;
    }

    const config = this.shellConfigService.getConfig(this.role);
    const routeContext = resolveWorkspaceRouteContext(this.activatedRoute);

    this.appName = config.appName;
    this.roleLabel = config.roleLabel;
    this.eyebrow = routeContext.eyebrow || config.eyebrow;
    this.title = routeContext.title || config.title;
    this.subtitle = routeContext.subtitle || config.subtitle;
    this.searchPlaceholder = routeContext.searchPlaceholder || config.searchPlaceholder;
    this.storageKey = config.storageKey;
    this.navGroups = config.navGroups;
    this.mobileNavItems = config.mobileNavItems;
  }
}
