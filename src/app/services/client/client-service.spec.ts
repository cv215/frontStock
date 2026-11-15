import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { ClientService } from './client-service';

describe('ClientService', () => {
  let service: ClientService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ClientService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deletes the client using its actual identifier', () => {
    service.delete(42).subscribe();

    const request = httpTestingController.expectOne(`${environment.apiUrl}/clients/delete/42`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
