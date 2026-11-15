import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { User } from '../../services/user/user';
import { Deconnexion } from '../deconnexion/deconnexion';

import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [Header, Deconnexion],
      providers: [{
        provide: User,
        useValue: {
          getConnectedUser: () => ({ email: 'client@example.com', prenom: 'Alice', nom: 'Martin' }),
          getUserByEmail: () => of({ email: 'client@example.com', prenom: 'Alice', nom: 'Martin' }),
          setUtilisateur: () => undefined
        }
      }]
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays the connected client name in the greeting', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Bonjour, Alice');
  });
});
