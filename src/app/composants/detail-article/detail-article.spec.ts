import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailArticle } from './detail-article';

describe('DetailArticle', () => {
  let component: DetailArticle;
  let fixture: ComponentFixture<DetailArticle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailArticle],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailArticle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
