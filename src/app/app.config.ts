import {APP_INITIALIZER, ApplicationConfig, inject} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authenticationInterceptor} from "./features/iam/services/authentication.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptors([authenticationInterceptor])),
  ]
};
