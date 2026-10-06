import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AdresseDto, EntrepriseDto, UtilisateurDto } from '../../api/models';
import { Router } from '@angular/router';
import { User } from '../../services/user/user';
import { EntrepriseService } from '../../services/entreprise/entreprise-service';
import { UtilisateurService } from '../../services/utilisateur/utilisateur-service';
import { switchMap, throwError } from 'rxjs';

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
    this.utilisateurDto.dateNaissance = `${this.utilisateurDto.dateNaissance}T00:00:00Z`;
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
    this.entrepriseDto.email = this.entrepriseDto.email?.trim().toLowerCase();
    this.entrepriseDto.adresse = this.adresseEntreprise;
    this.isSubmitting = true;

    this.entrepriseService.sinscrire(this.entrepriseDto).subscribe({
      next: () => {
        this.successMessage = 'Entreprise enregistrée. Aucun compte utilisateur associé n’est créé pour le moment.';
        this.isSubmitting = false;
      },
      error: error => {
        this.errorMsg = this.getErrorMessages(error, 'Une erreur est survenue lors de l’enregistrement de l’entreprise.');
        this.isSubmitting = false;
      }
    });
  }

  private getErrorMessages(error: unknown, fallback: string): string[] {
    if (error instanceof HttpErrorResponse) {
      const response = error.error as { message?: string; errors?: string[] } | null;
      return response?.errors?.length ? response.errors : [response?.message || fallback];
    }
    return [error instanceof Error ? error.message : fallback];
  }
}
