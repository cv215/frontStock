import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { User } from '../../../services/user/user';
import { UtilisateurService } from '../../../services/utilisateur/utilisateur-service';

import { NouvelUtilisateur } from './nouvel-utilisateur';

describe('NouvelUtilisateur', () => {
  let component: NouvelUtilisateur;
  let fixture: ComponentFixture<NouvelUtilisateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [NouvelUtilisateur],
      providers: [
        { provide: UtilisateurService, useValue: { save: () => of({}) } },
        { provide: User, useValue: { getConnectedUser: () => ({ idEntreprise: 1 }) } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NouvelUtilisateur);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
