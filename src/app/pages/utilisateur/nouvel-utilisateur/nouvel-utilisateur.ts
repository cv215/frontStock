import { getHttpErrorMessage } from '../../../utils/http-error';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdresseDto, UtilisateurDto } from '../../../api/models';
import { UtilisateurService } from '../../../services/utilisateur/utilisateur-service';
import { User } from '../../../services/user/user';
import { Role, ROLES_EQUIPE } from '../../../utils/permissions';

@Component({
  selector: 'app-nouvel-utilisateur',
  standalone: false,
  templateUrl: './nouvel-utilisateur.html',
  styleUrl: './nouvel-utilisateur.css',
})
export class NouvelUtilisateur implements OnInit {
  utilisateurDto: UtilisateurDto = { actif: true };
  readonly rolesDisponibles = ROLES_EQUIPE;
  role: Role = 'UTILISATEUR';
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
    if (!this.adresse.adresse1?.trim() || !this.adresse.ville?.trim() || !this.adresse.pays?.trim()) {
      this.errorMessage = 'Renseignez l’adresse, la ville et le pays.';
      return;
    }
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
      roles: [{ libelle: this.role }],
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
    return getHttpErrorMessage(error, 'L’enregistrement de l’utilisateur a échoué.');
  }
}
