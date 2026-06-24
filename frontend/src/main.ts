import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideIonicAngular } from '@ionic/angular/standalone';

import { AppComponent } from './app/app';
import { appRoutes } from './app/app.routes';
import { provideRouter } from '@angular/router';

// Import consolidated interceptors
import { AuthInterceptor } from './app/services/interceptors/auth.interceptor';
import { TenantInterceptor } from './app/services/interceptors/tenant.interceptor';
import { ErrorInterceptor } from './app/services/interceptors/error.interceptor';
import { LoadingInterceptor } from './app/services/interceptors/loading.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule, ReactiveFormsModule, BrowserAnimationsModule),
    provideRouter(appRoutes),
    provideIonicAngular(),
    // Register interceptors in order: Auth → Tenant → Error → Loading
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TenantInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ]
}).catch(err => console.error(err));

