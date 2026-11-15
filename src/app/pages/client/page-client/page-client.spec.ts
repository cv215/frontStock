import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ClientDto } from '../../../api/models';
import { ClientService } from '../../../services/client/client-service';
import { BouttonAction } from '../../../composants/boutton-action/boutton-action';
import { PageClient } from './page-client';

describe('PageClient', () => {
  let component: PageClient;
  let fixture: ComponentFixture<PageClient>;
  const clients: ClientDto[] = [
    { id: 1, nom: 'Martin', prenom: 'Alice', email: 'alice@example.com' },
    { id: 2, nom: 'Durand', prenom: 'Benoît', email: 'benoit@example.com' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [PageClient, BouttonAction],
      providers: [{
        provide: ClientService,
        useValue: { findAll: () => of(clients), delete: () => of(undefined) }
      }]
    }).compileComponents();

    fixture = TestBed.createComponent(PageClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters the real client list by name and email', () => {
    component.searchTerm = 'benoit@example.com';
    expect(component.filteredClients.map(client => client.id)).toEqual([2]);
  });
});
