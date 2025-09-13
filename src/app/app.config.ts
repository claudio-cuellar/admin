import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';
import localeDe from '@angular/common/locales/de';

import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { tokenExpirationInterceptor } from './core/interceptors/token-expiration.interceptor';
import { appInitializerFactory } from './core/initializers/app.initializer';

// Register locale data for supported currencies
registerLocaleData(localeEs, 'es');
registerLocaleData(localeEn, 'en');
registerLocaleData(localeDe, 'de');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([jwtInterceptor, tokenExpirationInterceptor])
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      multi: true
    }
  ]
};
