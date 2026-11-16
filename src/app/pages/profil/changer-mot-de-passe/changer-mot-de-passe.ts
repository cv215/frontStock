import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { UtilisateurService } from '../../../services/utilisateur/utilisateur-service';
import { getHttpErrorMessage } from '../../../utils/http-error';

interface ChangerMotDePasseForm {
  nouveauMotDePasse?: string;
  confirmerMotDePasse?: string;
}

@Component({
  selector: 'app-changer-mot-de-passe',
  standalone: false,
  templateUrl: './changer-mot-de-passe.html',
  styleUrl: './changer-mot-de-passe.css',
})
export class ChangerMotDePasse {
  changerMotDePasse: ChangerMotDePasseForm = {};
  ancienMotDePasse = '';
  errorMessage = '';
  successMessage = '';
  isSaving = false;

  constructor(
    private router: Router,
    private utilisateurService: UtilisateurService
  ) { }

  changerMotDePasseUtilisateur(): void {
    this.errorMessage = '';
    this.successMessage = '';
    const nouveauMotDePasse = this.changerMotDePasse.nouveauMotDePasse ?? '';
    const confirmerMotDePasse = this.changerMotDePasse.confirmerMotDePasse ?? '';
    if (!this.ancienMotDePasse || !nouveauMotDePasse || !confirmerMotDePasse) {
      this.errorMessage = 'Tous les champs sont obligatoires.';
      return;
    }
    if (nouveauMotDePasse.length < 8) {
      this.errorMessage = 'Le nouveau mot de passe doit comporter au moins 8 caractères.';
      return;
    }
    if (nouveauMotDePasse !== confirmerMotDePasse) {
      this.errorMessage = 'Les deux nouveaux mots de passe ne correspondent pas.';
      return;
    }
    if (nouveauMotDePasse === this.ancienMotDePasse) {
      this.errorMessage = 'Le nouveau mot de passe doit être différent de l’ancien.';
      return;
    }
    this.isSaving = true;
    this.utilisateurService.changerMotDePasse({
      ancienMotDePasse: this.ancienMotDePasse,
      nouveauMotDePasse,
      confirmerMotDePasse
    }).pipe(finalize(() => this.isSaving = false)).subscribe({
      next: () => {
        this.ancienMotDePasse = '';
        this.changerMotDePasse = {};
        this.successMessage = 'Votre mot de passe a été modifié.';
      },
      error: error => this.errorMessage = getHttpErrorMessage(error, 'La modification du mot de passe a échoué.')
    });
  }

  cancel(): void {
    this.router.navigate(['dashboard', 'profil']);
  }
}
