import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdresseDto } from '../../api/models';
import { ClientService } from '../../services/client/client-service';
import { FournisseurService } from '../../services/fournisseur/fournisseur-service';
import { User } from '../../services/user/user';

@Component({
  selector: 'app-nouveau-clt-frs',
  standalone: false,
  templateUrl: './nouveau-clt-frs.html',
  styleUrl: './nouveau-clt-frs.css',
})
export class NouveauCltFrs implements OnInit {
  origin = "";
  nom = '';
  prenom = '';
  email = '';
  telephone = '';
  adresse: AdresseDto = {};
  errorMessage = '';
  isSaving = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private fournisseurService: FournisseurService,
    private userService: User
  ) { }

  ngOnInit(): void {
    this.origin = this.activatedRoute.snapshot.data['origin'] === 'fournisseur' ? 'fournisseur' : 'client';
  }

  cancelClick(): void {
    this.router.navigate(['dashboard', this.origin === 'client' ? 'clients' : 'fournisseurs']);
  }

  saveClick(): void {
    this.errorMessage = '';
    const nom = this.nom.trim();
    const prenom = this.prenom.trim();
    const email = this.email.trim().toLowerCase();
    if (!nom || !prenom || !email) {
      this.errorMessage = 'Le nom, le prénom et l’adresse e-mail sont obligatoires.';
      return;
    }

    const connectedUser = this.userService.getConnectedUser();
    const idEntreprise = connectedUser?.idEntreprise ?? connectedUser?.entreprise?.id;
    const common = {
      nom,
      prenom,
      email,
      numTel: this.telephone.trim(),
      adresse: this.adresse,
      ...(idEntreprise != null ? { idEntreprise } : {})
    };

    this.isSaving = true;
    const observer = {
      next: () => {
        this.isSaving = false;
        this.cancelClick();
      },
      error: (error: unknown) => {
        this.isSaving = false;
        this.errorMessage = this.getErrorMessage(error);
      }
    };

    if (this.origin === 'client') {
      this.clientService.save(common).subscribe(observer);
    } else {
      this.fournisseurService.save(common).subscribe(observer);
    }
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
      return error.status === 0 ? 'Le serveur est indisponible. Réessayez plus tard.' : 'L’enregistrement a échoué.';
    }
    return 'L’enregistrement a échoué.';
  }
}
