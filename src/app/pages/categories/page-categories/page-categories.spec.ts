import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CategoryService } from '../../../services/cathegory/category-service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { PageCategories } from './page-categories';

describe('PageCategories', () => {
  let component: PageCategories;
  let fixture: ComponentFixture<PageCategories>;
  let categoryService: { findAll: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    categoryService = {
      findAll: vi.fn().mockReturnValue(of([
        { id: 12, code: 'CAT-12', designation: 'Boissons' }
      ])),
      delete: vi.fn().mockReturnValue(of(undefined))
    };

    await TestBed.configureTestingModule({
      declarations: [PageCategories],
      imports: [CommonModule, FormsModule],
      providers: [
        { provide: CategoryService, useValue: categoryService },
        { provide: Router, useValue: { navigate: vi.fn() } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PageCategories);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays the category description from its designation', () => {
    const tableText = fixture.nativeElement.querySelector('table').textContent;

    expect(tableText).toContain('Boissons');
    expect(tableText).toContain('Description');
  });
});
