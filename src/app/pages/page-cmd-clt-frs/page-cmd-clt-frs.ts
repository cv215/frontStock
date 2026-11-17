import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommandeClientDto, CommandeFournisseurDto } from '../../api/models';
import { CommandeClientService } from '../../services/commandeClient/commande-client-service';
import { CommandeFournisseurService } from '../../services/commandeFournisseur/commande-fournisseur-service';
import { User } from '../../services/user/user';
import { isClientUser } from '../../utils/user-roles';
import { getHttpErrorMessage } from '../../utils/http-error';
import { can } from '../../utils/permissions';

@Component({
  selector: 'app-page-cmd-clt-frs',
  standalone: false,
  templateUrl: './page-cmd-clt-frs.html',
  styleUrl: './page-cmd-clt-frs.css',
})
export class PageCmdCltFrs implements OnInit {
  /** Créer une commande (client : la sienne) / modifier l'état ou supprimer. */
  get canCreate(): boolean { return this.origin === 'client' ? can('creerCommandeClient') : can('gererCommandesFournisseurs'); }
  get canManage(): boolean { return this.origin === 'client' ? can('gererCommandesClients') : can('gererCommandesFournisseurs'); }
  origin = "";
  commandesClient: CommandeClientDto[] = [];
  commandesFournisseur: CommandeFournisseurDto[] = [];
  searchTerm = '';
  errorMessage = '';
  isLoading = true;
  deleteCandidateId: number | null = null;
  statusSavingId: number | null = null;
  selectedStatus: 'LIVREE' | null = null;
  isClient = false;
  connectedUserEmail = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commandeClientService: CommandeClientService,
    private commandeFournisseurService: CommandeFournisseurService,
    private userService: User
  ) { }

  ngOnInit(): void {
    this.origin = this.activatedRoute.snapshot.data['origin'] === 'fournisseur' ? 'fournisseur' : 'client';
    const user = this.userService.getConnectedUser();
    this.isClient = isClientUser(user);
    this.connectedUserEmail = user?.email?.trim().toLocaleLowerCase() ?? '';
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.selectedStatus = params.get('etat') === 'LIVREE' ? 'LIVREE' : null;
    });
    this.loadCommandes();
  }

  nouvelleCommande(): void {
    if (this.origin === "client") {
      this.router.navigate(['dashboard', 'nouvellecommandeclt']);
    } else if (this.origin === "fournisseur") {
      this.router.navigate(['dashboard', 'nouvellecommandefrs']);
    }
  }

  get filteredCommandesClient(): CommandeClientDto[] {
    const query = this.searchTerm.trim().toLocaleLowerCase();
    return this.commandesClient.filter(commande =>
      (!this.isClient || commande.client?.email?.trim().toLocaleLowerCase() === this.connectedUserEmail)
      && (!this.selectedStatus || commande.etatCommande === this.selectedStatus || commande.commandeLivree)
      && (!query || [commande.code, commande.client?.nom, commande.client?.prenom, commande.etatCommande]
        .some(value => value?.toLocaleLowerCase().includes(query)))
    );
  }

  get filteredCommandesFournisseur(): CommandeFournisseurDto[] {
    const query = this.searchTerm.trim().toLocaleLowerCase();
    if (!query) {
      return this.commandesFournisseur;
    }
    return this.commandesFournisseur.filter(commande =>
      [commande.code, commande.fournisseur?.nom, commande.fournisseur?.prenom, commande.etatCommande]
        .some(value => value?.toLocaleLowerCase().includes(query))
    );
  }

  changerEtatClient(commande: CommandeClientDto, etat: 'EN_COURS' | 'VALIDE' | 'LIVREE'): void {
    if (commande.id == null) {
      return;
    }
    const ancienEtat = commande.etatCommande;
    commande.etatCommande = etat;
    this.statusSavingId = commande.id;
    this.commandeClientService.updateEtatCommande(commande.id, etat).subscribe({
      next: updated => {
        Object.assign(commande, updated);
        this.statusSavingId = null;
      },
      error: error => {
        commande.etatCommande = ancienEtat;
        this.statusSavingId = null;
        this.errorMessage = this.getErrorMessage(error, 'La mise à jour du statut a échoué.');
      }
    });
  }

  changerEtatFournisseur(commande: CommandeFournisseurDto, etat: 'EN_COURS' | 'VALIDE' | 'LIVREE'): void {
    if (commande.id == null) {
      return;
    }
    const ancienEtat = commande.etatCommande;
    commande.etatCommande = etat;
    this.statusSavingId = commande.id;
    this.commandeFournisseurService.updateEtatCommande(commande.id, etat).subscribe({
      next: updated => {
        Object.assign(commande, updated);
        this.statusSavingId = null;
      },
      error: error => {
        commande.etatCommande = ancienEtat;
        this.statusSavingId = null;
        this.errorMessage = this.getErrorMessage(error, 'La mise à jour du statut a échoué.');
      }
    });
  }

  supprimerCommande(id: number): void {
    this.errorMessage = '';
    const request = this.origin === 'client'
      ? this.commandeClientService.delete(id)
      : this.commandeFournisseurService.delete(id);
    request.subscribe({
      next: () => {
        this.commandesClient = this.commandesClient.filter(commande => commande.id !== id);
        this.commandesFournisseur = this.commandesFournisseur.filter(commande => commande.id !== id);
        this.deleteCandidateId = null;
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error, 'La suppression de la commande a échoué.');
        this.deleteCandidateId = null;
      }
    });
  }

  private loadCommandes(): void {
    this.isLoading = true;
    this.errorMessage = '';
    if (this.origin === 'client') {
      this.commandeClientService.findAll().subscribe({
        next: commandes => {
          this.commandesClient = commandes ?? [];
          this.isLoading = false;
        },
        error: error => {
          this.errorMessage = this.getErrorMessage(error, 'Impossible de charger les commandes clients.');
          this.isLoading = false;
        }
      });
      return;
    }

    this.commandeFournisseurService.findAll().subscribe({
      next: commandes => {
        this.commandesFournisseur = commandes ?? [];
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error, 'Impossible de charger les commandes fournisseurs.');
        this.isLoading = false;
      }
    });
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    return getHttpErrorMessage(error, fallback);
  }
}
