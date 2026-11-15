import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from '../../services/user/user';

import { PageDashboard } from './page-dashboard';

describe('PageDashboard', () => {
  let component: PageDashboard;
  let fixture: ComponentFixture<PageDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [PageDashboard],
      providers: [
        {
          provide: User,
          useValue: {
            getConnectedUser: () => ({
              prenom: 'Test',
              nom: 'Client',
              email: 'client@example.com',
              roles: { libelle: 'CLIENT' },
            }),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PageDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
