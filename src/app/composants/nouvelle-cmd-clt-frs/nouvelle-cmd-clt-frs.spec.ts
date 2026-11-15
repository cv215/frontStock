import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ClientService } from '../../services/client/client-service';
import { CommandeClientService } from '../../services/commandeClient/commande-client-service';
import { CommandeFournisseurService } from '../../services/commandeFournisseur/commande-fournisseur-service';
import { FournisseurService } from '../../services/fournisseur/fournisseur-service';
import { User } from '../../services/user/user';

import { NouvelleCmdCltFrs } from './nouvelle-cmd-clt-frs';

describe('NouvelleCmdCltFrs', () => {
  let component: NouvelleCmdCltFrs;
  let fixture: ComponentFixture<NouvelleCmdCltFrs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [NouvelleCmdCltFrs],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { origin: 'client' } } },
        },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ClientService, useValue: { findAll: () => of([]) } },
        { provide: FournisseurService, useValue: { findAll: () => of([]) } },
        { provide: CommandeClientService, useValue: { save: () => of({}) } },
        { provide: CommandeFournisseurService, useValue: { save: () => of({}) } },
        { provide: User, useValue: { getConnectedUser: () => ({ idEntreprise: 1 }) } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NouvelleCmdCltFrs);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
