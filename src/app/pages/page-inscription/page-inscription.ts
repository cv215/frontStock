import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AdresseDto, ClientDto, EntrepriseDto, FournisseurDto, UtilisateurDto } from '../../api/models';
import { Router } from '@angular/router';
import { User } from '../../services/user/user';
import { EntrepriseService } from '../../services/entreprise/entreprise-service';
import { UtilisateurService } from '../../services/utilisateur/utilisateur-service';
import { finalize, map, switchMap, throwError } from 'rxjs';
import { ClientService } from '../../services/client/client-service';
import { FournisseurService } from '../../services/fournisseur/fournisseur-service';

type InscriptionRole = 'client' | 'entreprise';

@Component({
  selector: 'app-page-inscription',
  standalone: false,
  templateUrl: './page-inscription.html',
  styleUrl: './page-inscription.css',
})
export class PageInscription {
  role: InscriptionRole = 'client';
  utilisateurDto: UtilisateurDto = {};
  adresseUtilisateur: AdresseDto = {};
  entrepriseDto: EntrepriseDto = {};
  clientDto: ClientDto = {};
  fournisseurDto: FournisseurDto = {};
  adresseEntreprise: AdresseDto = {};
  confirmationMotDePasse = '';
  errorMsg: string[] = [];
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;

  constructor(
    private entrepriseService: EntrepriseService,
    private utilisateurService: UtilisateurService,
    private clientService: ClientService,
    private fournisseurService: FournisseurService,
    private userService: User,
    private router: Router
  ) {}

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
      return;
    }
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  selectRole(role: InscriptionRole): void {
    this.role = role;
    this.errorMsg = [];
    this.successMessage = '';
  }

  inscrire(): void {
    this.errorMsg = [];
    this.successMessage = '';

    if (this.role === 'entreprise') {
      this.inscrireEntreprise();
      return;
    }
    /*else if (this.role === 'fournisseur') {
      this.inscrireFournisseur();
      return;
    }*/

    this.inscrireClient();
  }

  private inscrireClient(): void {
    const email = this.utilisateurDto.email?.trim().toLowerCase() ?? '';
    const password = this.utilisateurDto.motDePasse ?? '';

    if (password.length < 8) {
      this.errorMsg = ['Le mot de passe doit contenir au moins 8 caractères.'];
      return;
    }
    if (password !== this.confirmationMotDePasse) {
      this.errorMsg = ['Les deux mots de passe ne correspondent pas.'];
      return;
    }

    this.utilisateurDto.email = email;
    this.utilisateurDto.adresse = this.adresseUtilisateur;
    this.isSubmitting = true;

    this.utilisateurService.save(this.utilisateurDto).pipe(
      switchMap(() => this.userService.login({ email, password })),
      switchMap(response => {
        if (!response.accessToken) {
          return throwError(() => new Error('Le compte est créé, mais le serveur n’a pas retourné de jeton.'));
        }
        this.userService.setConnectedUser(response);
        return this.userService.getUserByEmail(email);
      })
    ).subscribe({
      next: utilisateur => {
        this.userService.setUtilisateur(utilisateur);
        this.router.navigate(['/dashboard']);
      },
      error: error => {
        this.userService.clearSession();
        this.errorMsg = this.getErrorMessages(error, 'Une erreur est survenue lors de la création du compte.');
        this.isSubmitting = false;
      }
    });
  }

  private inscrireEntreprise(): void {
    const email = this.entrepriseDto.email?.trim().toLowerCase() ?? '';
    const password = this.entrepriseDto.motDePasse ?? '';

    this.utilisateurDto.adresse = this.adresseEntreprise;

    if (password.length < 8) {
      this.errorMsg = ['Le mot de passe doit contenir au moins 8 caractères.'];
      return;
    }
    if (password !== this.confirmationMotDePasse) {
      this.errorMsg = ['Les deux mots de passe ne correspondent pas.'];
      return;
    }

    this.entrepriseDto.email = email;
    this.entrepriseDto.adresse = this.adresseEntreprise;
    this.entrepriseDto.utilisateurs = [{
      adresse: this.adresseEntreprise,
      email,
      motDePasse: password,
      roles: [{ libelle: 'ADMIN_ENTREPRISE' }],
    }];

    this.isSubmitting = true;

    this.entrepriseService.sinscrire(this.entrepriseDto).pipe(
      switchMap(entreprise =>
        this.userService.login({ email, password }).pipe(
          map(response => ({ entreprise, response }))
        )
      ),
      switchMap(({ entreprise, response }) => {
        if (!response.accessToken) {
          return throwError(() => new Error('Le compte est créé, mais le serveur n’a pas retourné de jeton.'));
        }
        this.userService.setConnectedUser(response);
        return this.userService.getUserByEmail(email).pipe(
          map(utilisateur => {
            const idEntreprise = [
              utilisateur.idEntreprise,
              utilisateur.entreprise?.id,
              entreprise.id
            ].find((id): id is number =>
              typeof id === 'number' && Number.isInteger(id) && id > 0
            );
            if (idEntreprise == null) {
              return utilisateur;
            }

            return {
              ...utilisateur,
              idEntreprise,
              entreprise: {
                ...utilisateur.entreprise,
                id: utilisateur.entreprise?.id ?? idEntreprise
              }
            };
          })
        );
      }),
      finalize(() => {
    this.isSubmitting = false;
  })
    ).subscribe({
      next: utilisateur => {
        this.userService.setUtilisateur(utilisateur);
        this.router.navigate(['/dashboard']);
      },
      error: error => {
        this.userService.clearSession();
        this.errorMsg = this.getErrorMessages(error, 'Une erreur est survenue lors de l’enregistrement de l’entreprise.');
        this.isSubmitting = false;
      }
    });
  }

  private getErrorMessages(error: unknown, fallback: string): string[] {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        return [
          'Votre inscription a peut-être été enregistrée, mais la connexion a échoué. Réessayez de vous connecter; si le problème persiste, l’API doit émettre un JWT accepté par sa configuration de validation.'
        ];
      }
      const response = error.error as { message?: string; errors?: string[] } | null;
      return response?.errors?.length ? response.errors : [response?.message || fallback];
    }
    return [error instanceof Error ? error.message : fallback];
  }
}
