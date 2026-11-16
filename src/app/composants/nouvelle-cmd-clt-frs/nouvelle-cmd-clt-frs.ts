import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { ArticleDto, ClientDto, CommandeClientDto, CommandeFournisseurDto, FournisseurDto } from '../../api/models';
import { ArticleService } from '../../services/article/article-service';
import { ClientService } from '../../services/client/client-service';
import { CommandeClientService } from '../../services/commandeClient/commande-client-service';
import { CommandeFournisseurService } from '../../services/commandeFournisseur/commande-fournisseur-service';
import { FournisseurService } from '../../services/fournisseur/fournisseur-service';
import { User } from '../../services/user/user';
import { getHttpErrorMessage } from '../../utils/http-error';

interface LigneSaisie {
  article: ArticleDto;
  quantite: number;
  prixUnitaire: number;
}

@Component({
  selector: 'app-nouvelle-cmd-clt-frs',
  standalone: false,
  templateUrl: './nouvelle-cmd-clt-frs.html',
  styleUrl: './nouvelle-cmd-clt-frs.css',
})
export class NouvelleCmdCltFrs implements OnInit {
  origin = '';
  clients: ClientDto[] = [];
  fournisseurs: FournisseurDto[] = [];
  articles: ArticleDto[] = [];
  code = '';
  dateCommande = new Date().toISOString().slice(0, 10);
  partnerId: number | null = null;

  lignes: LigneSaisie[] = [];
  articleIdToAdd: number | null = null;
  quantiteToAdd: number | null = 1;

  errorMessage = '';
  isLoading = true;
  isSaving = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private fournisseurService: FournisseurService,
    private articleService: ArticleService,
    private commandeClientService: CommandeClientService,
    private commandeFournisseurService: CommandeFournisseurService,
    private userService: User
  ) { }

  ngOnInit(): void {
    this.origin = this.activatedRoute.snapshot.data['origin'] === 'fournisseur' ? 'fournisseur' : 'client';
    this.code = this.generateCode();
    const contacts$: Observable<ClientDto[] | FournisseurDto[]> = this.origin === 'client'
      ? this.clientService.findAll()
      : this.fournisseurService.findAll();
    forkJoin({ contacts: contacts$, articles: this.articleService.findAll() }).subscribe({
      next: ({ contacts, articles }) => {
        if (this.origin === 'client') {
          this.clients = (contacts ?? []) as ClientDto[];
        } else {
          this.fournisseurs = (contacts ?? []) as FournisseurDto[];
        }
        this.articles = articles ?? [];
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = getHttpErrorMessage(error, 'Impossible de charger les contacts et les articles.');
        this.isLoading = false;
      }
    });
  }

  get contactsCount(): number {
    return this.origin === 'client' ? this.clients.length : this.fournisseurs.length;
  }

  get availableArticles(): ArticleDto[] {
    return this.articles.filter(article => !this.lignes.some(ligne => ligne.article.id === article.id));
  }

  get total(): number {
    return this.lignes.reduce((sum, ligne) => sum + ligne.quantite * ligne.prixUnitaire, 0);
  }

  ajouterLigne(): void {
    this.errorMessage = '';
    const article = this.articles.find(item => item.id === this.articleIdToAdd);
    const quantite = Number(this.quantiteToAdd);
    if (!article) {
      this.errorMessage = 'Sélectionnez un article à ajouter.';
      return;
    }
    if (!Number.isFinite(quantite) || quantite <= 0) {
      this.errorMessage = 'La quantité doit être supérieure à zéro.';
      return;
    }
    // Commande client : prix de vente TTC ; commande fournisseur : prix d'achat HT.
    const prix = this.origin === 'client' ? article.prixUnitaireTtc : article.prixUnitaireHt;
    this.lignes = [...this.lignes, { article, quantite, prixUnitaire: Number(prix ?? 0) }];
    this.articleIdToAdd = null;
    this.quantiteToAdd = 1;
  }

  supprimerLigne(index: number): void {
    this.lignes = this.lignes.filter((_, i) => i !== index);
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
    if (this.lignes.length === 0) {
      this.errorMessage = 'Ajoutez au moins un article à la commande.';
      return;
    }
    if (this.lignes.some(ligne => !(ligne.quantite > 0))) {
      this.errorMessage = 'Chaque quantité doit être supérieure à zéro.';
      return;
    }
    const utilisateur = this.userService.getConnectedUser();
    const idEntreprise = utilisateur?.idEntreprise ?? utilisateur?.entreprise?.id;
    const dateIso = new Date(`${this.dateCommande}T00:00:00`).toISOString();
    const lignes = this.lignes.map(ligne => ({
      article: { id: ligne.article.id },
      quantite: Number(ligne.quantite),
      prixUnitaire: Number(ligne.prixUnitaire),
      ...(idEntreprise != null ? { idEntreprise } : {})
    }));

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
        client: { id: client.id },
        ligneCommandeClients: lignes,
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
      fournisseur: { id: fournisseur.id },
      ligneCommandeFournisseurs: lignes,
      ...(idEntreprise != null ? { idEntreprise } : {})
    };
    this.commandeFournisseurService.save(commande).subscribe({
      next: () => this.goToOrders(),
      error: error => this.handleSaveError(error)
    });
  }

  private generateCode(): string {
    const prefix = this.origin === 'client' ? 'CC' : 'CF';
    const now = new Date();
    const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    return `${prefix}-${stamp}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  private goToOrders(): void {
    this.isSaving = false;
    this.router.navigate(['dashboard', this.origin === 'client' ? 'commandeclient' : 'commandefournisseur']);
  }

  private handleSaveError(error: unknown): void {
    this.isSaving = false;
    this.errorMessage = getHttpErrorMessage(error, 'La création de la commande a échoué.');
  }
}
