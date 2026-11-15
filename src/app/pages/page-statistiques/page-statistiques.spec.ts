import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ArticleService } from '../../services/article/article-service';
import { ClientService } from '../../services/client/client-service';
import { CommandeClientService } from '../../services/commandeClient/commande-client-service';
import { FournisseurService } from '../../services/fournisseur/fournisseur-service';

import { PageStatistiques } from './page-statistiques';

describe('PageStatistiques', () => {
  let component: PageStatistiques;
  let fixture: ComponentFixture<PageStatistiques>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [PageStatistiques],
      providers: [
        { provide: ArticleService, useValue: { findAll: () => of([]) } },
        { provide: ClientService, useValue: { findAll: () => of([]) } },
        { provide: FournisseurService, useValue: { findAll: () => of([]) } },
        { provide: CommandeClientService, useValue: { findAll: () => of([]) } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PageStatistiques);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
