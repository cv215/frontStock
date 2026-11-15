import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ArticleService } from '../../../services/article/article-service';
import { MvstkService } from '../../../services/mouvementStock/mvstk-service';
import { User } from '../../../services/user/user';

import { PageMvtstk } from './page-mvtstk';

describe('PageMvtstk', () => {
  let component: PageMvtstk;
  let fixture: ComponentFixture<PageMvtstk>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [PageMvtstk],
      providers: [
        { provide: ArticleService, useValue: { findAll: () => of([]) } },
        {
          provide: MvstkService,
          useValue: {
            findByArticle: () => of([]),
            stockReelArticle: () => of(0),
            entreeStock: () => of({}),
            sortieStock: () => of({}),
            correctionStockPos: () => of({}),
            correctionStockNeg: () => of({}),
          },
        },
        { provide: User, useValue: { getConnectedUser: () => ({ idEntreprise: 1 }) } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PageMvtstk);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
