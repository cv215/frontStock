import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface ChangerMotDePasseUtilisateurDto {
  nouveauMotDePasse?: string;
  confirmerMotDePasse?: string;
}

@Component({
  selector: 'app-changer-mot-de-passe',
  standalone: false,
  templateUrl: './changer-mot-de-passe.html',
  styleUrl: './changer-mot-de-passe.css',
})
export class ChangerMotDePasse implements OnInit {
  changerMotDePasse: ChangerMotDePasseUtilisateurDto = {};
  ancienMotDePasse = '';
  errorMessage = '';

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  changerMotDePasseUtilisateur(): void {
    this.errorMessage = '';
    const nouveauMotDePasse = this.changerMotDePasse.nouveauMotDePasse?.trim() ?? '';
    const confirmerMotDePasse = this.changerMotDePasse.confirmerMotDePasse?.trim() ?? '';

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

    this.errorMessage = 'La modification du mot de passe n’est pas encore prise en charge par l’API. Contactez un administrateur.';
  }

  cancel(): void {
    this.router.navigate(['dashboard', 'profil']);
  }
}
