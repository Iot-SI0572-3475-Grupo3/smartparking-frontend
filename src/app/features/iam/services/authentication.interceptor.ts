import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Observable } from "rxjs";

export const authenticationInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  const token = isBrowser ? localStorage.getItem('token') : null;

  if (request.url.includes('/register') || request.url.includes('/login')) {
    return next(request);
  }

  const handledRequest = token
    ? request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    : request;

  return next(handledRequest);
};
