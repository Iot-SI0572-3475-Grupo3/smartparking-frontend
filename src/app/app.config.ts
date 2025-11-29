import {APP_INITIALIZER, ApplicationConfig, inject} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authenticationInterceptor} from "./features/iam/services/authentication.interceptor";
import {AuthenticationService} from "./features/iam/services/authentication.service";

export function initAuth() {
  const authService = inject(AuthenticationService);
  return () => authService.initSession();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptors([authenticationInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initAuth,
      multi: true
    }
  ]
};
