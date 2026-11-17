import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleDto } from '../../../api/models';
import { ArticleService } from '../../../services/article/article-service';
import { getHttpErrorMessage } from '../../../utils/http-error';
import { PhotoService, PHOTO_TYPES_ACCEPTES, photoUrl, verifierPhoto } from '../../../services/photo/photo-service';
import { ArticleDto as ArticleModel } from '../../../api/models';
import { can } from '../../../utils/permissions';

@Component({
  selector: 'app-page-article',
  standalone: false,
  templateUrl: './page-article.html',
  styleUrl: './page-article.css',
})
export class PageArticle implements OnInit {
  readonly canEdit = can('gererCatalogue');
  readonly photoUrl = photoUrl;
  readonly photoTypes = PHOTO_TYPES_ACCEPTES;
  photoUploadId: number | null = null;
  /** Message transmis par la page de création (ex. photo non envoyée). */
  avertissement = (history.state?.['avertissement'] as string | undefined) ?? '';
  articles: ArticleDto[] = [];
  searchTerm = '';
  errorMessage = '';
  isLoading = true;
  deleteCandidateId: number | null = null;
  currentPage = 1;
  readonly pageSize = 8;

  constructor(
    private router: Router,
    private articleService: ArticleService,
    private photoService: PhotoService
  ) { }

  ngOnInit(): void {
    this.loadArticles();
  }

  nouvelArticle(): void {
    this.router.navigate(['dashboard', 'nouvelarticle']);
  }

  get filteredArticles(): ArticleDto[] {
    const query = this.searchTerm.trim().toLocaleLowerCase();
    if (!query) {
      return this.articles;
    }
    return this.articles.filter(article =>
      [article.codeArticle, article.designation, article.cathegory?.designation]
        .some(value => value?.toLocaleLowerCase().includes(query))
    );
  }

  get pagedArticles(): ArticleDto[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredArticles.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredArticles.length / this.pageSize));
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.deleteCandidateId = null;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  supprimerArticle(id: number): void {
    this.errorMessage = '';
    this.articleService.delete(id).subscribe({
      next: () => {
        this.articles = this.articles.filter(article => article.id !== id);
        this.deleteCandidateId = null;
        this.currentPage = Math.min(this.currentPage, this.totalPages);
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error, 'La suppression de l’article a échoué.');
        this.deleteCandidateId = null;
      }
    });
  }

  /** Envoie la photo choisie pour l'article puis met à jour la miniature. */
  changerPhoto(article: ArticleModel, event: Event): void {
    const input = event.target as HTMLInputElement;
    const fichier = input.files?.[0];
    input.value = '';
    const erreur = verifierPhoto(fichier);
    if (erreur || !fichier || article.id == null) {
      this.errorMessage = erreur ?? '';
      return;
    }
    this.errorMessage = '';
    this.photoUploadId = article.id;
    this.photoService.envoyer('article', article.id, fichier).subscribe({
      next: res => {
        article.photo = res.photo;
        this.photoUploadId = null;
      },
      error: error => {
        this.photoUploadId = null;
        this.errorMessage = this.getErrorMessage(error, 'L’envoi de la photo a échoué.');
      }
    });
  }

  private loadArticles(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.articleService.findAll().subscribe({
      next: articles => {
        this.articles = articles ?? [];
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error, 'Impossible de charger les articles.');
        this.isLoading = false;
      }
    });
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    return getHttpErrorMessage(error, fallback);
  }

}
