import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageVueEnsemble } from './page-vue-ensemble';

describe('PageVueEnsemble', () => {
  let component: PageVueEnsemble;
  let fixture: ComponentFixture<PageVueEnsemble>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageVueEnsemble],
    }).compileComponents();

    fixture = TestBed.createComponent(PageVueEnsemble);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
