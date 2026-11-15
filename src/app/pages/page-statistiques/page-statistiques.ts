import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ArticleDto, CommandeClientDto } from '../../api/models';
import { ArticleService } from '../../services/article/article-service';
import { ClientService } from '../../services/client/client-service';
import { CommandeClientService } from '../../services/commandeClient/commande-client-service';
import { FournisseurService } from '../../services/fournisseur/fournisseur-service';

interface CategoryStatistic {
  designation: string;
  count: number;
  percent: number;
}

@Component({
  selector: 'app-page-statistiques',
  standalone: false,
  templateUrl: './page-statistiques.html',
  styleUrl: './page-statistiques.css',
})
export class PageStatistiques implements OnInit {
  articles: ArticleDto[] = [];
  clientsCount = 0;
  fournisseursCount = 0;
  commandes: CommandeClientDto[] = [];
  categoryStats: CategoryStatistic[] = [];
  errorMessage = '';
  isLoading = true;

  constructor(
    private readonly articleService: ArticleService,
    private readonly clientService: ClientService,
    private readonly fournisseurService: FournisseurService,
    private readonly commandeClientService: CommandeClientService
  ) {}

  ngOnInit(): void {
    forkJoin({
      articles: this.articleService.findAll(),
      clients: this.clientService.findAll(),
      fournisseurs: this.fournisseurService.findAll(),
      commandes: this.commandeClientService.findAll()
    }).subscribe({
      next: result => {
        this.articles = result.articles ?? [];
        this.clientsCount = result.clients?.length ?? 0;
        this.fournisseursCount = result.fournisseurs?.length ?? 0;
        this.commandes = result.commandes ?? [];
        this.buildCategoryStats();
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error);
        this.isLoading = false;
      }
    });
  }

  get commandesEnCours(): number {
    return this.commandes.filter(commande => commande.etatCommande === 'EN_COURS').length;
  }

  get commandesLivrees(): number {
    return this.commandes.filter(commande => commande.etatCommande === 'LIVREE' || commande.commandeLivree).length;
  }

  get tauxLivraison(): number {
    return this.commandes.length ? Math.round((this.commandesLivrees / this.commandes.length) * 100) : 0;
  }

  private buildCategoryStats(): void {
    const counts = new Map<string, number>();
    for (const article of this.articles) {
      const designation = article.cathegory?.designation?.trim() || 'Sans catégorie';
      counts.set(designation, (counts.get(designation) ?? 0) + 1);
    }
    this.categoryStats = Array.from(counts, ([designation, count]) => ({
      designation,
      count,
      percent: this.articles.length ? Math.round((count / this.articles.length) * 100) : 0
    })).sort((a, b) => b.count - a.count);
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse && error.status === 0) {
      return 'Le serveur est indisponible. Vérifiez que l’API est démarrée.';
    }
    if (error instanceof HttpErrorResponse && error.error && typeof error.error === 'object'
      && 'message' in error.error && typeof error.error.message === 'string') {
      return error.error.message;
    }
    return 'Les statistiques n’ont pas pu être chargées.';
  }
}
