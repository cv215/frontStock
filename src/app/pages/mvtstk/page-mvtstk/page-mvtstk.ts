import { Component, OnInit } from '@angular/core';
import { ArticleDto, MvstkDto } from '../../../api/models';
import { ArticleService } from '../../../services/article/article-service';
import { MvstkService } from '../../../services/mouvementStock/mvstk-service';
import { User } from '../../../services/user/user';
import { getHttpErrorMessage } from '../../../utils/http-error';
import { can } from '../../../utils/permissions';

type MouvementType = NonNullable<MvstkDto['typeMvstkt']>;

@Component({
  selector: 'app-page-mvtstk',
  standalone: false,
  templateUrl: './page-mvtstk.html',
  styleUrl: './page-mvtstk.css',
})
export class PageMvtstk implements OnInit {
  readonly canEdit = can('gererStock');
  articles: ArticleDto[] = [];
  mouvements: MvstkDto[] = [];
  selectedArticleId: number | null = null;
  stockReel: number | null = null;
  typeMouvement: MouvementType = 'ENTREE';
  quantite: number | null = null;
  errorMessage = '';
  successMessage = '';
  isLoading = true;
  isSaving = false;
  showForm = false;

  constructor(
    private readonly articleService: ArticleService,
    private readonly mouvementService: MvstkService,
    private readonly userService: User
  ) {}

  ngOnInit(): void {
    this.articleService.findAll().subscribe({
      next: articles => {
        this.articles = articles ?? [];
        this.selectedArticleId = this.articles[0]?.id ?? null;
        if (this.selectedArticleId !== null) {
          this.loadMouvements();
        } else {
          this.isLoading = false;
        }
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error, 'Impossible de charger les articles.');
        this.isLoading = false;
      }
    });
  }

  get selectedArticle(): ArticleDto | undefined {
    return this.articles.find(article => article.id === this.selectedArticleId);
  }

  selectedArticleChanged(): void {
    this.successMessage = '';
    this.loadMouvements();
  }

  enregistrerMouvement(): void {
    this.errorMessage = '';
    this.successMessage = '';
    const article = this.selectedArticle;
    const quantite = Number(this.quantite);
    if (!article || !Number.isInteger(article.id) || !Number.isFinite(quantite) || quantite <= 0) {
      this.errorMessage = 'Sélectionnez un article et saisissez une quantité entière supérieure à zéro.';
      return;
    }

    const utilisateur = this.userService.getConnectedUser();
    const mouvement: MvstkDto = {
      article,
      quantite,
      typeMvstkt: this.typeMouvement,
      dateMvt: new Date().toISOString(),
      ...(utilisateur?.idEntreprise != null ? { idEntreprise: utilisateur.idEntreprise } : {})
    };

    this.isSaving = true;
    const request = this.typeMouvement === 'ENTREE'
      ? this.mouvementService.entreeStock(mouvement)
      : this.typeMouvement === 'SORTIE'
        ? this.mouvementService.sortieStock(mouvement)
        : this.typeMouvement === 'CORRECTION_POS'
          ? this.mouvementService.correctionStockPos(mouvement)
          : this.mouvementService.correctionStockNeg(mouvement);

    request.subscribe({
      next: () => {
        this.isSaving = false;
        this.quantite = null;
        this.showForm = false;
        this.successMessage = 'Le mouvement de stock a été enregistré.';
        this.loadMouvements();
      },
      error: error => {
        this.isSaving = false;
        this.errorMessage = this.getErrorMessage(error, 'L’enregistrement du mouvement a échoué.');
      }
    });
  }

  private loadMouvements(): void {
    if (this.selectedArticleId === null) {
      this.mouvements = [];
      this.stockReel = null;
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const idArticle = this.selectedArticleId;
    this.mouvementService.findByArticle(idArticle).subscribe({
      next: mouvements => {
        this.mouvements = [...(mouvements ?? [])].sort((a, b) =>
          (b.dateMvt ?? '').localeCompare(a.dateMvt ?? '')
        );
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error, 'Impossible de charger les mouvements de cet article.');
        this.isLoading = false;
      }
    });
    this.mouvementService.stockReelArticle(idArticle).subscribe({
      next: stock => this.stockReel = stock,
      error: error => {
        this.stockReel = null;
        this.errorMessage = this.getErrorMessage(error, 'Impossible de calculer le stock réel de cet article.');
      }
    });
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    return getHttpErrorMessage(error, fallback);
  }
}
