import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ArticleService } from '../../services/article/article-service';
import { ClientService } from '../../services/client/client-service';
import { CommandeClientService } from '../../services/commandeClient/commande-client-service';
import { FournisseurService } from '../../services/fournisseur/fournisseur-service';
import { User } from '../../services/user/user';

import { PageVueEnsemble } from './page-vue-ensemble';

describe('PageVueEnsemble', () => {
  let component: PageVueEnsemble;
  let fixture: ComponentFixture<PageVueEnsemble>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule],
      declarations: [PageVueEnsemble],
      providers: [
        { provide: ArticleService, useValue: { findAll: () => of([]) } },
        { provide: ClientService, useValue: { findAll: () => of([]) } },
        {
          provide: CommandeClientService,
          useValue: {
            findAll: () => of([
              { id: 1, code: 'CMD-1', etatCommande: 'EN_COURS', client: { email: 'alice@example.com' } },
              { id: 2, code: 'CMD-2', etatCommande: 'LIVREE', client: { email: 'other@example.com' } }
            ])
          }
        },
        { provide: FournisseurService, useValue: { findAll: () => of([]) } },
        {
          provide: User,
          useValue: {
            getConnectedUser: () => ({
              email: 'alice@example.com',
              prenom: 'Alice',
              nom: 'Martin',
              roles: { libelle: 'CLIENT' }
            })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PageVueEnsemble);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the client overview and only counts the connected client’s orders', () => {
    expect(component.isClient).toBe(true);
    expect(component.clientOrders.map(commande => commande.code)).toEqual(['CMD-1']);
    expect(component.clientOrdersInProgress).toBe(1);
    expect(fixture.nativeElement.querySelector('.client-overview')).toBeTruthy();
  });
});
