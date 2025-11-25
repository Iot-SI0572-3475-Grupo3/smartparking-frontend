import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

export const authenticationInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const token = localStorage.getItem('token');

  if (request.url.includes('/register') || request.url.includes('/login')) {
    return next(request);
  }

  const handledRequest = token
    ? request.clone({ headers: request.headers.set('Authorization', `Bearer ${token}`)} )
    : request;
  console.log('Intercepted HTTP request:', handledRequest);
  return next(handledRequest);
}
