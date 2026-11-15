import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdresseDto, UtilisateurDto } from '../../../api/models';
import { UtilisateurService } from '../../../services/utilisateur/utilisateur-service';
import { User } from '../../../services/user/user';

@Component({
  selector: 'app-nouvel-utilisateur',
  standalone: false,
  templateUrl: './nouvel-utilisateur.html',
  styleUrl: './nouvel-utilisateur.css',
})
export class NouvelUtilisateur implements OnInit {
  utilisateurDto: UtilisateurDto = { actif: true };
  adresse: AdresseDto = {};
  errorMessage = '';
  isSaving = false;

  constructor(
    private router: Router,
    private utilisateurService: UtilisateurService,
    private userService: User
  ) { }

  ngOnInit(): void {
  }

  cancel(): void {
    this.router.navigate(['dashboard','utilisateurs']);
  }

  enregistrerUtilisateur(): void {
    this.errorMessage = '';
    const nom = this.utilisateurDto.nom?.trim() ?? '';
    const prenom = this.utilisateurDto.prenom?.trim() ?? '';
    const email = this.utilisateurDto.email?.trim().toLowerCase() ?? '';
    const motDePasse = this.utilisateurDto.motDePasse ?? '';
    if (!nom || !prenom || !email || motDePasse.length < 8) {
      this.errorMessage = 'Renseignez le nom, le prénom, l’adresse e-mail et un mot de passe d’au moins 8 caractères.';
      return;
    }

    const connectedUser = this.userService.getConnectedUser();
    const idEntreprise = connectedUser?.idEntreprise ?? connectedUser?.entreprise?.id;
    const utilisateur: UtilisateurDto = {
      ...this.utilisateurDto,
      nom,
      prenom,
      email,
      adresse: this.adresse,
      actif: true,
      roles: { libelle: 'UTILISATEUR' },
      ...(idEntreprise != null ? { idEntreprise } : {})
    };

    this.isSaving = true;
    this.utilisateurService.save(utilisateur).subscribe({
      next: () => this.router.navigate(['dashboard', 'utilisateurs']),
      error: error => {
        this.isSaving = false;
        this.errorMessage = this.getErrorMessage(error);
      }
    });
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (typeof error.error === 'string' && error.error.trim()) {
        return error.error;
      }
      if (error.error && typeof error.error === 'object' && 'message' in error.error
        && typeof error.error.message === 'string') {
        return error.error.message;
      }
      return error.status === 0 ? 'Le serveur est indisponible. Réessayez plus tard.' : 'L’enregistrement de l’utilisateur a échoué.';
    }
    return 'L’enregistrement de l’utilisateur a échoué.';
  }
}
