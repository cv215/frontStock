import { Component, OnInit } from '@angular/core';
import { getHttpErrorMessage } from '../../utils/http-error';
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
    const telephone = this.telephone.trim();
    const adresse: AdresseDto = {
      adresse1: this.adresse.adresse1?.trim(),
      adresse2: this.adresse.adresse2?.trim(),
      ville: this.adresse.ville?.trim(),
      codePostale: this.adresse.codePostale?.trim(),
      pays: this.adresse.pays?.trim(),
    };
    if (!nom || !prenom || !email || !telephone || !adresse.adresse1 || !adresse.ville || !adresse.pays) {
      this.errorMessage = 'Renseignez tous les champs obligatoires : nom, prénom, e-mail, téléphone, adresse, ville et pays.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.errorMessage = 'L’adresse e-mail n’est pas valide.';
      return;
    }

    const connectedUser = this.userService.getConnectedUser();
    const idEntreprise = connectedUser?.idEntreprise ?? connectedUser?.entreprise?.id;
    const common = {
      nom,
      prenom,
      email,
      numTel: telephone,
      adresse,
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
    return getHttpErrorMessage(error, 'L’enregistrement a échoué.');
  }
}
