import { TestBed } from '@angular/core/testing';

import { EntrepriseService } from './entreprise-service';
import { provideHttpClient } from '@angular/common/http';

describe('EntrepriseService', () => {
  let service: EntrepriseService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(EntrepriseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
