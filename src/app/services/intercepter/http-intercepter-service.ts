import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpIntercepterService implements HttpInterceptor {
  constructor(private readonly router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accessToken')?.trim().replace(/^Bearer\s+/i, '');
    const requestPath = req.url.split('?')[0].replace(/\/+$/, '');
    const isPublicAuthRequest = requestPath.endsWith('/auth/connexion')
      || requestPath.endsWith('/auth/token')
      || requestPath.endsWith('/utilisateurs/inscription');

    const authenticatedRequest = token && !isPublicAuthRequest && !req.headers.has('Authorization')
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(authenticatedRequest).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 401 && !isPublicAuthRequest) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('connectedUser');
          localStorage.removeItem('authenticationResponse');
          void this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
