import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ClientService } from '../../services/client/client-service';
import { FournisseurService } from '../../services/fournisseur/fournisseur-service';
import { User } from '../../services/user/user';

import { NouveauCltFrs } from './nouveau-clt-frs';

describe('NouveauCltFrs', () => {
  let component: NouveauCltFrs;
  let fixture: ComponentFixture<NouveauCltFrs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [NouveauCltFrs],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { origin: 'client' } } },
        },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ClientService, useValue: { save: () => of({}) } },
        { provide: FournisseurService, useValue: { save: () => of({}) } },
        { provide: User, useValue: { getConnectedUser: () => ({ idEntreprise: 1 }) } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NouveauCltFrs);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
