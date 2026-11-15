import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { EntrepriseService } from '../../services/entreprise/entreprise-service';
import { FournisseurService } from '../../services/fournisseur/fournisseur-service';
import { ClientService } from '../../services/client/client-service';
import { User } from '../../services/user/user';
import { UtilisateurService } from '../../services/utilisateur/utilisateur-service';

import { PageInscription } from './page-inscription';

describe('PageInscription', () => {
  let component: PageInscription;
  let fixture: ComponentFixture<PageInscription>;
  let utilisateurService: { save: ReturnType<typeof vi.fn> };
  let entrepriseService: { sinscrire: ReturnType<typeof vi.fn> };
  let userService: {
    login: ReturnType<typeof vi.fn>;
    setConnectedUser: ReturnType<typeof vi.fn>;
    getUserByEmail: ReturnType<typeof vi.fn>;
    setUtilisateur: ReturnType<typeof vi.fn>;
    clearSession: ReturnType<typeof vi.fn>;
  };
  let router: Router;

  beforeEach(async () => {
    utilisateurService = { save: vi.fn().mockReturnValue(EMPTY) };
    entrepriseService = { sinscrire: vi.fn().mockReturnValue(EMPTY) };
    userService = {
      login: vi.fn().mockReturnValue(EMPTY),
      setConnectedUser: vi.fn(),
      getUserByEmail: vi.fn().mockReturnValue(EMPTY),
      setUtilisateur: vi.fn(),
      clearSession: vi.fn()
    };
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterModule.forRoot([])],
      declarations: [PageInscription],
      providers: [
        { provide: EntrepriseService, useValue: entrepriseService },
        { provide: UtilisateurService, useValue: utilisateurService },
        { provide: ClientService, useValue: {} },
        { provide: FournisseurService, useValue: {} },
        { provide: User, useValue: userService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(PageInscription);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sends the birth date in the date-only format required by the API', () => {
    component.utilisateurDto = {
      email: 'client@example.com',
      motDePasse: 'password123',
      dateNaissance: '2012-06-13',
    };
    component.confirmationMotDePasse = 'password123';

    component.inscrire();

    expect(utilisateurService.save).toHaveBeenCalledWith(
      expect.objectContaining({ dateNaissance: '2012-06-13' })
    );
    expect(component.utilisateurDto.dateNaissance).toBe('2012-06-13');
  });

  it('sends the UTILISATEUR role with the associated company user', () => {
    component.selectRole('entreprise');
    component.entrepriseDto = {
      email: 'contact@entreprise.com',
      motDePasse: 'password123',
    };
    component.confirmationMotDePasse = 'password123';

    component.inscrire();

    expect(entrepriseService.sinscrire).toHaveBeenCalledWith(
      expect.objectContaining({
        utilisateurs: [
          expect.objectContaining({
            email: 'contact@entreprise.com',
            motDePasse: 'password123',
            roles: [{ libelle: 'ADMIN_ENTREPRISE' }],
          }),
        ],
      })
    );
  });

  it('keeps the created enterprise id on the connected user', () => {
    entrepriseService.sinscrire.mockReturnValue(of({ id: 42 }));
    userService.login.mockReturnValue(of({ accessToken: 'token' }));
    userService.getUserByEmail.mockReturnValue(of({
      email: 'contact@entreprise.com',
      idEntreprise: 0
    }));
    component.selectRole('entreprise');
    component.entrepriseDto = {
      email: 'contact@entreprise.com',
      motDePasse: 'password123',
    };
    component.confirmationMotDePasse = 'password123';

    component.inscrire();

    expect(userService.setUtilisateur).toHaveBeenCalledWith(
      expect.objectContaining({
        idEntreprise: 42,
        entreprise: expect.objectContaining({ id: 42 }),
      })
    );
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
