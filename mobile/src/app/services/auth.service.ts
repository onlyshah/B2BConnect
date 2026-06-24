import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api/auth';
  private userSubject = new BehaviorSubject<any>(this.getStoredUser());
  public user$ = this.userSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(!!this.getToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => this.storeSession(response))
    );
  }

  registerRetailer(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-retailer`, data);
  }

  refresh(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh`, {
      refreshToken: this.getRefreshToken()
    }).pipe(
      tap((response) => {
        this.setToken(response.accessToken);
        this.setRefreshToken(response.refreshToken);
      })
    );
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe({ error: () => undefined });
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  storeSession(response: any): void {
    this.setToken(response.accessToken);
    this.setRefreshToken(response.refreshToken);
    this.setUser(response.user);
  }

  setToken(token: string): void {
    localStorage.setItem('accessToken', token);
    this.isLoggedInSubject.next(true);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token);
  }

  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  getUser(): any {
    return this.userSubject.value;
  }

  getStoredUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}
