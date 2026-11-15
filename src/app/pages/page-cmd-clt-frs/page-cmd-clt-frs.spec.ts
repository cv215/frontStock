import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { CommandeClientService } from '../../services/commandeClient/commande-client-service';
import { CommandeFournisseurService } from '../../services/commandeFournisseur/commande-fournisseur-service';
import { User } from '../../services/user/user';

import { PageCmdCltFrs } from './page-cmd-clt-frs';

describe('PageCmdCltFrs', () => {
  let component: PageCmdCltFrs;
  let fixture: ComponentFixture<PageCmdCltFrs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule],
      declarations: [PageCmdCltFrs],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: { origin: 'client' } },
            queryParamMap: of(convertToParamMap({}))
          }
        },
        {
          provide: CommandeClientService,
          useValue: {
            findAll: () => of([
              { id: 1, code: 'CMD-1', etatCommande: 'EN_COURS', client: { email: 'alice@example.com' } },
              { id: 2, code: 'CMD-2', etatCommande: 'LIVREE', client: { email: 'other@example.com' } }
            ])
          }
        },
        { provide: CommandeFournisseurService, useValue: { findAll: () => of([]) } },
        {
          provide: User,
          useValue: {
            getConnectedUser: () => ({
              email: 'alice@example.com',
              roles: { libelle: 'CLIENT' }
            })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PageCmdCltFrs);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('limits customer orders to the connected customer and the selected delivery status', () => {
    expect(component.filteredCommandesClient.map(commande => commande.code)).toEqual(['CMD-1']);

    component.selectedStatus = 'LIVREE';
    expect(component.filteredCommandesClient).toEqual([]);
  });
});
