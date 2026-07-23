/**
 * Authentication Service
 * Handles login, logout, token management, and user authentication
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError, finalize } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { StorageService } from './storage.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
  token?: string;
}

export interface UserProfile {
  _id?: string;
  id?: string;
  name?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  tenantId: string;
  companyId?: string;
  distributorId?: string;
  retailerId?: string;
  salesmanId?: string;
  permissions?: string[];
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_profile';

  private currentUserSubject = new BehaviorSubject<UserProfile | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();
  public user$ = this.currentUser$; // Alias for backward compatibility

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  private isLogoutInProgress = false;
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public isLoggedIn$ = this.isAuthenticated$; // Alias for backward compatibility

  private authInitializationSubject = new BehaviorSubject<boolean>(false);
  public authInitialization$ = this.authInitializationSubject.asObservable();
  public authInitializationStarted = false;
  public isAuthInitializationInProgress = false;

  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) {}

  /**
   * Initialize auth state from stored data
   */
  public initializeAuthState(): void {
    if (this.authInitializationStarted) {
      return;
    }

    this.authInitializationStarted = true;
    this.isAuthInitializationInProgress = true;
    console.debug('[AuthService] initializeAuthState: start');
    this.authInitializationSubject.next(false);

    const user = this.getUserFromStorage();
    const token = this.getToken();
    const refreshToken = this.getRefreshToken();

    const finishInitialization = () => {
      this.isAuthInitializationInProgress = false;
      console.debug('[AuthService] initializeAuthState: finished');
      this.authInitializationSubject.next(true);
    };

    if (token && !this.isTokenExpired(token)) {
      if (user) {
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        finishInitialization();
        return;
      }

      this.getCurrentUser().subscribe({
        next: () => {
          this.isAuthenticatedSubject.next(true);
          finishInitialization();
        },
        error: () => {
          if (refreshToken) {
            this.refreshToken().subscribe({
              next: () => {
                const storedUser = this.getUserFromStorage();
                if (storedUser) {
                  this.currentUserSubject.next(storedUser);
                  this.isAuthenticatedSubject.next(true);
                  finishInitialization();
                } else {
                  this.getCurrentUser().subscribe({
                    next: () => {
                      this.isAuthenticatedSubject.next(true);
                      finishInitialization();
                    },
                    error: () => {
                      this.clearAuthData();
                      finishInitialization();
                    }
                  });
                }
              },
              error: () => {
                this.clearAuthData();
                finishInitialization();
              }
            });
          } else {
            this.clearAuthData();
            finishInitialization();
          }
        }
      });
      return;
    }

    if (refreshToken) {
      this.refreshToken().subscribe({
        next: () => {
          const storedUser = this.getUserFromStorage();
          if (storedUser) {
            this.currentUserSubject.next(storedUser);
            this.isAuthenticatedSubject.next(true);
            finishInitialization();
          } else {
            this.getCurrentUser().subscribe({
              next: () => {
                this.isAuthenticatedSubject.next(true);
                finishInitialization();
              },
              error: () => {
                this.clearAuthData();
                finishInitialization();
              }
            });
          }
        },
        error: () => {
          this.clearAuthData();
          finishInitialization();
        }
      });
      return;
    }

    this.clearAuthData();
    finishInitialization();
  }

  /**
   * Login user
   */
  login(credentialsOrEmail: LoginRequest | string, password?: string): Observable<LoginResponse> {
    let credentials: LoginRequest;
    
    // Support both patterns: login(credentials) and login(email, password)
    if (typeof credentialsOrEmail === 'string' && password) {
      credentials = { email: credentialsOrEmail, password };
    } else {
      credentials = credentialsOrEmail as LoginRequest;
    }

    return this.apiService
      .post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials)
      .pipe(
        map((response: any) => (response?.data ? response.data : response)),
        tap((response: LoginResponse) => this.setAuthData(response)),
        catchError((error) => {
          console.error('Login failed:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Logout user
   */
  logout(): Observable<any> {
    this.isLogoutInProgress = true;

    const refreshToken = this.getRefreshToken();
    this.clearAuthData();

    if (!refreshToken) {
      this.isLogoutInProgress = false;
      return of({ message: 'Logged out' });
    }

    return this.apiService.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken }).pipe(
      map((response) => response?.data ?? response),
      catchError((error) => {
        return of({ message: 'Logged out locally', error });
      }),
      finalize(() => {
        this.isLogoutInProgress = false;
      })
    );
  }

  /**
   * Get current user profile
   */
  getCurrentUser(): Observable<UserProfile> {
    return this.apiService
      .get<UserProfile>(API_ENDPOINTS.AUTH.ME)
      .pipe(
        map((response) => response.data),
        tap((user) => {
          this.storageService.setItem(this.USER_KEY, JSON.stringify(user));
          this.currentUserSubject.next(user);
        }),
        catchError((error) => {
          console.error('Failed to fetch current user:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Refresh authentication token
   */
  refreshToken(): Observable<{ token: string; refreshToken: string }> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      console.debug('[AuthService] refreshToken: no refresh token');
      return throwError(() => new Error('No refresh token available'));
    }

    return this.apiService
      .post<{ token: string; refreshToken: string }>(
        API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        { refreshToken }
      )
      .pipe(
        map((response: any) => (response?.data ? response.data : response)),
        tap((response: any) => {
          console.debug('[AuthService] refreshToken: success');
          const token = response?.token ?? response?.accessToken;
          const nextRefreshToken = response?.refreshToken;

          if (!token) {
            throw new Error('Authentication response missing access token');
          }

          this.setToken(token);
          if (nextRefreshToken) {
            this.setRefreshToken(nextRefreshToken);
          }

          const storedUser = this.getUserFromStorage();
          if (storedUser) {
            this.currentUserSubject.next(storedUser);
          }
          this.isAuthenticatedSubject.next(true);
        }),
        catchError((error) => {
          console.debug('[AuthService] refreshToken: failed', error?.message ?? error);
          this.clearAuthData();
          return throwError(() => error);
        })
      );
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  /**
   * Get current user synchronously
   */
  getCurrentUserSync(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user has permission
   */
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUserSync();
    return user?.permissions?.includes(permission) ?? false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasRole(roles: string | string[]): boolean {
    const user = this.getCurrentUserSync();
    if (!user) return false;

    const normalizedRole = user.role?.toLowerCase().replace(/_/g, '-') || '';

    if (typeof roles === 'string') {
      return normalizedRole === roles.toLowerCase().replace(/_/g, '-');
    }

    return roles.some((role) => normalizedRole === role.toLowerCase().replace(/_/g, '-'));
  }

  /**
   * Register retailer
   */
  registerRetailer(data: any): Observable<any> {
    return this.apiService
      .post(API_ENDPOINTS.AUTH.REGISTER_RETAILER, data)
      .pipe(
        tap((response) => {
          const authPayload = response.data as LoginResponse | undefined;
          if (authPayload?.token || authPayload?.accessToken) {
            this.setAuthData(authPayload);
          }
        }),
        catchError((error) => {
          console.error('Registration failed:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Set auth data (token, refresh token, user)
   */
  private setAuthData(response: LoginResponse): void {
    const token = response.token ?? response.accessToken;
    if (!token) {
      throw new Error('Authentication response missing access token');
    }

    console.debug('[AuthService] setAuthData: storing tokens and user');
    this.setToken(token);
    this.setRefreshToken(response.refreshToken);
    this.storageService.setItem(this.USER_KEY, JSON.stringify(response.user));

    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Clear all auth data
   */
  private clearAuthData(): void {
    console.debug('[AuthService] clearAuthData: clearing stored auth');
    const authKeys = [
      this.TOKEN_KEY,
      this.REFRESH_TOKEN_KEY,
      this.USER_KEY,
      'token',
      'accessToken',
      'refreshToken',
      'user',
      'currentUser'
    ];

    authKeys.forEach((key) => {
      this.storageService.removeItem(key);
      this.storageService.removeSessionItem(key);
    });

    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Token management methods
   */
  setToken(token: string): void {
    this.storageService.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return this.storageService.getItem(this.TOKEN_KEY);
  }

  setRefreshToken(refreshToken: string): void {
    this.storageService.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  getRefreshToken(): string | null {
    return this.storageService.getItem(this.REFRESH_TOKEN_KEY);
  }

  isLogoutActive(): boolean {
    return this.isLogoutInProgress;
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Check if token is expired (basic check)
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.parseJwt(token);
      if (!payload.exp) return false;

      const expirationTime = payload.exp * 1000;
      return Date.now() >= expirationTime;
    } catch {
      return true;
    }
  }

  /**
   * Parse JWT token
   */
  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to parse JWT:', error);
      return {};
    }
  }

  private getUserFromStorage(): UserProfile | null {
    const userStr = this.storageService.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
}
