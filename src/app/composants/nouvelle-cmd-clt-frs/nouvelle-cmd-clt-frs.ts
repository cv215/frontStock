import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientDto, CommandeClientDto, CommandeFournisseurDto, FournisseurDto } from '../../api/models';
import { ClientService } from '../../services/client/client-service';
import { CommandeClientService } from '../../services/commandeClient/commande-client-service';
import { CommandeFournisseurService } from '../../services/commandeFournisseur/commande-fournisseur-service';
import { FournisseurService } from '../../services/fournisseur/fournisseur-service';
import { User } from '../../services/user/user';

@Component({
  selector: 'app-nouvelle-cmd-clt-frs',
  standalone: false,
  templateUrl: './nouvelle-cmd-clt-frs.html',
  styleUrl: './nouvelle-cmd-clt-frs.css',
})
export class NouvelleCmdCltFrs implements OnInit {
   origin = "";
  clients: ClientDto[] = [];
  fournisseurs: FournisseurDto[] = [];
  code = '';
  dateCommande = new Date().toISOString().slice(0, 10);
  partnerId: number | null = null;
  errorMessage = '';
  isLoading = true;
  isSaving = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private fournisseurService: FournisseurService,
    private commandeClientService: CommandeClientService,
    private commandeFournisseurService: CommandeFournisseurService,
    private userService: User
  ) { }

  ngOnInit(): void {
    this.origin = this.activatedRoute.snapshot.data['origin'] === 'fournisseur' ? 'fournisseur' : 'client';
    if (this.origin === 'client') {
      this.clientService.findAll().subscribe({
        next: clients => {
          this.clients = clients ?? [];
          this.isLoading = false;
        },
        error: error => this.handleLoadError(error)
      });
    } else {
      this.fournisseurService.findAll().subscribe({
        next: fournisseurs => {
          this.fournisseurs = fournisseurs ?? [];
          this.isLoading = false;
        },
        error: error => this.handleLoadError(error)
      });
    }
  }

  cancelClick(): void {
    this.router.navigate(['dashboard', this.origin === 'client' ? 'commandeclient' : 'commandefournisseur']);
  }

  saveClick(): void {
    this.errorMessage = '';
    const code = this.code.trim();
    if (!code || !this.dateCommande || this.partnerId === null) {
      this.errorMessage = 'Le code, la date et le contact associé sont obligatoires.';
      return;
    }

    const utilisateur = this.userService.getConnectedUser();
    const idEntreprise = utilisateur?.idEntreprise ?? utilisateur?.entreprise?.id;
    const dateIso = new Date(`${this.dateCommande}T00:00:00`).toISOString();
    this.isSaving = true;

    if (this.origin === 'client') {
      const client = this.clients.find(item => item.id === this.partnerId);
      if (!client) {
        this.errorMessage = 'Le client sélectionné est introuvable.';
        this.isSaving = false;
        return;
      }
      const commande: CommandeClientDto = {
        code,
        dateCommande: dateIso,
        etatCommande: 'EN_COURS',
        client,
        ...(idEntreprise != null ? { idEntreprise } : {})
      };
      this.commandeClientService.save(commande).subscribe({
        next: () => this.goToOrders(),
        error: error => this.handleSaveError(error)
      });
      return;
    }

    const fournisseur = this.fournisseurs.find(item => item.id === this.partnerId);
    if (!fournisseur) {
      this.errorMessage = 'Le fournisseur sélectionné est introuvable.';
      this.isSaving = false;
      return;
    }
    const commande: CommandeFournisseurDto = {
      code,
      dateCommande: dateIso,
      etatCommande: 'EN_COURS',
      fournisseur,
      ...(idEntreprise != null ? { idEntreprise } : {})
    };
    this.commandeFournisseurService.save(commande).subscribe({
      next: () => this.goToOrders(),
      error: error => this.handleSaveError(error)
    });
  }

  get contactsCount(): number {
    return this.origin === 'client' ? this.clients.length : this.fournisseurs.length;
  }

  private goToOrders(): void {
    this.isSaving = false;
    this.router.navigate(['dashboard', this.origin === 'client' ? 'commandeclient' : 'commandefournisseur']);
  }

  private handleSaveError(error: unknown): void {
    this.isSaving = false;
    this.errorMessage = this.getErrorMessage(error, 'La création de la commande a échoué.');
  }

  private handleLoadError(error: unknown): void {
    this.errorMessage = this.getErrorMessage(error, 'Impossible de charger les contacts.');
    this.isLoading = false;
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      if (typeof error.error === 'string' && error.error.trim()) {
        return error.error;
      }
      if (error.error && typeof error.error === 'object' && 'message' in error.error
        && typeof error.error.message === 'string') {
        return error.error.message;
      }
      return error.status === 0 ? 'Le serveur est indisponible. Réessayez plus tard.' : fallback;
    }
    return fallback;
  }
}
