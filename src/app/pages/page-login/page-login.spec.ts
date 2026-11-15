import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthentificationService } from '../../services/authentification/authentification-service';
import { User } from '../../services/user/user';

import { PageLogin } from './page-login';

describe('PageLogin', () => {
  let component: PageLogin;
  let fixture: ComponentFixture<PageLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [PageLogin],
      providers: [
        {
          provide: User,
          useValue: {
            setConnectedUser: vi.fn(),
            setUtilisateur: vi.fn(),
            getUserByEmail: () => of({}),
            clearSession: vi.fn(),
          },
        },
        {
          provide: AuthentificationService,
          useValue: {
            authenticate: () => of({ accessToken: 'token' }),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PageLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
