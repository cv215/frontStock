import { PhotoService, PHOTO_TYPES_ACCEPTES, photoUrl, verifierPhoto } from '../../../services/photo/photo-service';
import { getHttpErrorMessage } from '../../../utils/http-error';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilisateurDto } from '../../../api/models';
import { User } from '../../../services/user/user';
import { roleLabel } from '../../../utils/user-roles';

@Component({
  selector: 'app-page-profil',
  standalone: false,
  templateUrl: './page-profil.html',
  styleUrl: './page-profil.css',
})
export class PageProfil implements OnInit {
  connectedUser: UtilisateurDto | null = null;
  readonly roleLabel = roleLabel;
  readonly photoUrl = photoUrl;
  readonly photoTypes = PHOTO_TYPES_ACCEPTES;
  isUploading = false;
  photoError = '';

  constructor(
    private router: Router,
    private userService: User,
    private photoService: PhotoService
  ) { }

  ngOnInit(): void {
    this.connectedUser = this.userService.getConnectedUser();
  }

  /** Envoie la nouvelle photo de profil et met à jour la session (l'en-tête l'affiche aussitôt). */
  changerPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const fichier = input.files?.[0];
    input.value = '';
    const user = this.connectedUser;
    this.photoError = verifierPhoto(fichier) ?? '';
    if (this.photoError || !fichier || user?.id == null) {
      return;
    }
    this.isUploading = true;
    this.photoService.envoyer('utilisateur', user.id, fichier).subscribe({
      next: res => {
        this.isUploading = false;
        this.connectedUser = { ...user, photo: res.photo };
        this.userService.setUtilisateur(this.connectedUser);
      },
      error: error => {
        this.isUploading = false;
        this.photoError = getHttpErrorMessage(error, 'L’envoi de la photo a échoué.');
      }
    });
  }

  modifierMotDePasse(): void {
    this.router.navigate(['dashboard','changermotdepasse']);
  }
}
