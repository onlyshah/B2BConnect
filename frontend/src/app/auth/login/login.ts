import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UiButtonComponent } from '../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../shared/ui/components/ui-card';
import { UiBadgeComponent } from '../../shared/ui/components/ui-badge';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, UiButtonComponent, UiCardComponent, UiBadgeComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = null;

    const returnUrl = this.route.snapshot.queryParams['returnUrl'];

    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: (response) => {
        this.loading = false;
        const userRole = response.user?.role ?? 'retailer';
        const targetRoute = returnUrl && returnUrl !== '/login' ? returnUrl : this.getRedirectRoute(userRole);
        this.router.navigateByUrl(targetRoute);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Login failed';
      }
    });
  }

  private getRedirectRoute(role: string): string {
    const normalizedRole = role.toLowerCase().replace(/_/g, '-');
    const roleRedirects: Record<string, string> = {
      'super-admin': '/super-admin',
      'company-admin': '/company',
      'distributor-admin': '/distributor',
      'salesman': '/salesman',
      'retailer': '/retailer'
    };

    return roleRedirects[normalizedRole] || '/dashboard';
  }
}
