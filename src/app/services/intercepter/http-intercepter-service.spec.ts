import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { HttpIntercepterService } from './http-intercepter-service';

describe('HttpIntercepterService', () => {
  let httpMock: HttpTestingController;
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('connectedUser');
    router = { navigate: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
        { provide: HTTP_INTERCEPTORS, useClass: HttpIntercepterService, multi: true },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('connectedUser');
  });

  it('adds the stored JWT as a Bearer token to protected requests', () => {
    localStorage.setItem('accessToken', 'test-jwt');

    TestBed.inject(HttpClient).get('/api/articles').subscribe();

    const request = httpMock.expectOne('/api/articles');
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-jwt');
    request.flush([]);
  });

  it('does not duplicate a Bearer prefix already present in the stored JWT', () => {
    localStorage.setItem('accessToken', 'Bearer test-jwt');

    TestBed.inject(HttpClient).get('/api/articles').subscribe();

    const request = httpMock.expectOne('/api/articles');
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-jwt');
    request.flush([]);
  });

  it('does not add the JWT to public authentication requests', () => {
    localStorage.setItem('accessToken', 'test-jwt');

    TestBed.inject(HttpClient).post('/api/auth/connexion', {}).subscribe();

    const request = httpMock.expectOne('/api/auth/connexion');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });

  it('does not add the JWT to password-reset requests with query parameters', () => {
    localStorage.setItem('accessToken', 'test-jwt');

    TestBed.inject(HttpClient).post('/api/auth/token?username=test@example.com', null).subscribe();

    const request = httpMock.expectOne('/api/auth/token?username=test@example.com');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush('reset-token');
  });

  it('clears the rejected JWT and redirects to login after a protected request returns 401', () => {
    localStorage.setItem('accessToken', 'rejected-jwt');
    localStorage.setItem('connectedUser', JSON.stringify({ email: 'user@example.com' }));
    let requestError: unknown;

    TestBed.inject(HttpClient).get('/api/articles').subscribe({
      error: error => requestError = error
    });

    httpMock.expectOne('/api/articles').flush({}, {
      status: 401,
      statusText: 'Unauthorized'
    });

    expect(requestError).toBeTruthy();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('connectedUser')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
