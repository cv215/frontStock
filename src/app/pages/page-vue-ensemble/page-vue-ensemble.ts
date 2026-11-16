import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ArticleDto, ClientDto, CommandeClientDto, FournisseurDto, UtilisateurDto } from '../../api/models';
import { ArticleService } from '../../services/article/article-service';
import { ClientService } from '../../services/client/client-service';
import { CommandeClientService } from '../../services/commandeClient/commande-client-service';
import { FournisseurService } from '../../services/fournisseur/fournisseur-service';
import { User } from '../../services/user/user';
import { isClientUser } from '../../utils/user-roles';

@Component({
  selector: 'app-page-vue-ensemble',
  standalone: false,
  templateUrl: './page-vue-ensemble.html',
  styleUrl: './page-vue-ensemble.css',
})
export class PageVueEnsemble implements OnInit {
  articles: ArticleDto[] = [];
  clients: ClientDto[] = [];
  fournisseurs: FournisseurDto[] = [];
  commandesClient: CommandeClientDto[] = [];
  connectedUser: UtilisateurDto | null = null;
  isClient = false;
  errorMessage = '';
  isLoading = true;

  constructor(
    private readonly articleService: ArticleService,
    private readonly clientService: ClientService,
    private readonly fournisseurService: FournisseurService,
    private readonly commandeClientService: CommandeClientService,
    private readonly userService: User
  ) {}

  ngOnInit(): void {
    this.connectedUser = this.userService.getConnectedUser();
    this.isClient = isClientUser(this.connectedUser);
    if (this.isClient) {
      this.loadClientOverview();
      return;
    }

    this.loadBusinessOverview();
  }

  get recentClientOrders(): CommandeClientDto[] {
    return this.clientOrders.slice(0, 5);
  }

  get clientOrders(): CommandeClientDto[] {
    const email = this.connectedUser?.email?.trim().toLocaleLowerCase();
    if (!email) {
      return [];
    }
    return this.commandesClient
      .filter(commande => commande.client?.email?.trim().toLocaleLowerCase() === email)
      .sort((left, right) =>
        Date.parse(right.dateCommande ?? '') - Date.parse(left.dateCommande ?? '')
      );
  }

  get clientOrdersInProgress(): number {
    return this.clientOrders.filter(commande => commande.etatCommande === 'EN_COURS').length;
  }

  get clientDeliveriesExpected(): number {
    return this.clientOrders.filter(commande =>
      commande.etatCommande === 'VALIDE' && !commande.commandeLivree
    ).length;
  }

  get clientDeliveriesCompleted(): number {
    return this.clientOrders.filter(commande =>
      commande.etatCommande === 'LIVREE' || commande.commandeLivree
    ).length;
  }

  get profileComplete(): boolean {
    return Boolean(this.connectedUser?.nom && this.connectedUser?.prenom && this.connectedUser?.email);
  }

  get setupStepsCompleted(): number {
    return Number(this.profileComplete) + Number(this.articles.length > 0) + Number(this.clientOrders.length > 0);
  }

  get setupProgress(): number {
    return Math.round((this.setupStepsCompleted / 3) * 100);
  }

  private loadClientOverview(): void {
    forkJoin({
      articles: this.articleService.findAll(),
      fournisseurs: this.fournisseurService.findAll(),
      commandesClient: this.commandeClientService.findAll()
    }).subscribe({
      next: result => {
        this.articles = result.articles ?? [];
        this.fournisseurs = result.fournisseurs ?? [];
        this.commandesClient = result.commandesClient ?? [];
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error);
        this.isLoading = false;
      }
    });
  }

  private loadBusinessOverview(): void {
    forkJoin({
      articles: this.articleService.findAll(),
      clients: this.clientService.findAll(),
      fournisseurs: this.fournisseurService.findAll(),
      commandesClient: this.commandeClientService.findAll()
    }).subscribe({
      next: result => {
        this.articles = result.articles ?? [];
        this.clients = result.clients ?? [];
        this.fournisseurs = result.fournisseurs ?? [];
        this.commandesClient = result.commandesClient ?? [];
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error);
        this.isLoading = false;
      }
    });
  }

  get commandesEnCours(): number {
    return this.commandesClient.filter(commande => commande.etatCommande === 'EN_COURS').length;
  }

  get recentArticles(): ArticleDto[] {
    return this.articles.slice(0, 5);
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse && error.status === 0) {
      return 'Le serveur est indisponible. Vérifiez que l’API de gestion de stock est démarrée.';
    }
    if (error instanceof HttpErrorResponse && error.error && typeof error.error === 'object'
      && 'message' in error.error && typeof error.error.message === 'string') {
      return error.error.message;
    }
    return 'Les données du tableau de bord n’ont pas pu être chargées.';
  }
}
