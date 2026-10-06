import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpIntercepterService implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('accessToken');
    const isPublicAuthRequest = req.url.endsWith('/auth/connexion')
      || req.url.endsWith('/utilisateurs/inscription');

    if (accessToken && !isPublicAuthRequest && !req.headers.has('Authorization')) {
      return next.handle(req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      }));
    }
    return next.handle(req);
  }
}
