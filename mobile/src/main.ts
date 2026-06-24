import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app';
import { appRoutes } from './app/app.routes';

// Import consolidated interceptors
import { AuthInterceptor } from './app/services/interceptors/auth.interceptor';
import { TenantInterceptor } from './app/services/interceptors/tenant.interceptor';
import { ErrorInterceptor } from './app/services/interceptors/error.interceptor';
import { LoadingInterceptor } from './app/services/interceptors/loading.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserAnimationsModule,
      HttpClientModule,
      ReactiveFormsModule,
      IonicModule.forRoot()
    ),
    provideRouter(appRoutes),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Register interceptors in order: Auth → Tenant → Error → Loading
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TenantInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ]
}).catch(err => console.error(err));
