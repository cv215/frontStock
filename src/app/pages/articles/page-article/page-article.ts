import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleDto } from '../../../api/models';
import { ArticleService } from '../../../services/article/article-service';

@Component({
  selector: 'app-page-article',
  standalone: false,
  templateUrl: './page-article.html',
  styleUrl: './page-article.css',
})
export class PageArticle implements OnInit {
  articles: ArticleDto[] = [];
  searchTerm = '';
  errorMessage = '';
  isLoading = true;
  deleteCandidateId: number | null = null;
  currentPage = 1;
  readonly pageSize = 8;

  constructor(
    private router: Router,
    private articleService: ArticleService
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
