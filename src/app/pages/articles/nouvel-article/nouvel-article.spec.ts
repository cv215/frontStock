import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ArticleService } from '../../../services/article/article-service';
import { CategoryService } from '../../../services/cathegory/category-service';
import { User } from '../../../services/user/user';

import { NouvelArticle } from './nouvel-article';

describe('NouvelArticle', () => {
  let component: NouvelArticle;
  let fixture: ComponentFixture<NouvelArticle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [NouvelArticle],
      providers: [
        { provide: ArticleService, useValue: { save: () => of({}) } },
        { provide: CategoryService, useValue: { findAll: () => of([]) } },
        { provide: User, useValue: { getConnectedUser: () => ({ idEntreprise: 1 }) } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NouvelArticle);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
