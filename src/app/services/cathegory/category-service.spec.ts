import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment.development';

import { CategoryService } from './category-service';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(CategoryService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns a category list when the API responds with a single category object', () => {
    const category = { id: 12, code: 'CAT-12', designation: 'Boissons' };

    service.findAll().subscribe(categories => {
      expect(categories).toEqual([category]);
    });

    httpTestingController
      .expectOne(`${environment.apiUrl}/cathegory/all`)
      .flush(category);
  });

  it('keeps the category list when the API responds with an array', () => {
    const categories = [
      { id: 12, code: 'CAT-12', designation: 'Boissons' },
      { id: 13, code: 'CAT-13', designation: 'Épicerie' }
    ];

    service.findAll().subscribe(result => {
      expect(result).toEqual(categories);
    });

    httpTestingController
      .expectOne(`${environment.apiUrl}/cathegory/all`)
      .flush(categories);
  });
});
