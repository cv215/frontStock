import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleDto, CathegoryDto } from '../../../api/models';
import { ArticleService } from '../../../services/article/article-service';
import { CategoryService } from '../../../services/cathegory/category-service';
import { User } from '../../../services/user/user';

@Component({
  selector: 'app-nouvel-article',
  standalone: false,
  templateUrl: './nouvel-article.html',
  styleUrl: './nouvel-article.css',
})
export class NouvelArticle implements OnInit {
  articleDto: ArticleDto = { tauxTva: 0 };
  categories: CathegoryDto[] = [];
  categoryId: number | null = null;
  errorMessage = '';
  isLoadingCategories = true;
  isSaving = false;

  constructor(
    private router: Router,
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private userService: User
  ) { }

  ngOnInit(): void {
    this.categoryService.findAll().subscribe({
      next: categories => {
        this.categories = categories ?? [];
        this.isLoadingCategories = false;
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error, 'Impossible de charger les catégories.');
        this.isLoadingCategories = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['dashboard','articles']);
  }

  updatePrixTtc(): void {
    const prixHt = Number(this.articleDto.prixUnitaireHt ?? 0);
    const tauxTva = Number(this.articleDto.tauxTva ?? 0);
    this.articleDto.prixUnitaireTtc = Number((prixHt * (1 + tauxTva / 100)).toFixed(2));
  }

  enregistrerArticle(): void {
    this.errorMessage = '';
    const codeArticle = this.articleDto.codeArticle?.trim() ?? '';
    const designation = this.articleDto.designation?.trim() ?? '';
    const prixHt = Number(this.articleDto.prixUnitaireHt);
    const tauxTva = Number(this.articleDto.tauxTva);
    const category = this.categories.find(item => item.id === this.categoryId);

    if (!codeArticle || !designation || !category) {
      this.errorMessage = 'Le code, la désignation et la catégorie sont obligatoires.';
      return;
    }
    if (!Number.isFinite(prixHt) || prixHt < 0 || !Number.isFinite(tauxTva) || tauxTva < 0 || tauxTva > 100) {
      this.errorMessage = 'Saisissez un prix positif et un taux de TVA compris entre 0 et 100 %.';
      return;
    }

    const user = this.userService.getConnectedUser();
    const idEntreprise = user?.idEntreprise ?? user?.entreprise?.id;
    const articleToSave: ArticleDto = {
      ...this.articleDto,
      codeArticle,
      designation,
      prixUnitaireHt: prixHt,
      tauxTva,
      prixUnitaireTtc: Number((prixHt * (1 + tauxTva / 100)).toFixed(2)),
      cathegory: category,
      ...(idEntreprise != null ? { idEntreprise } : {})
    };

    this.isSaving = true;
    this.articleService.save(articleToSave).subscribe({
      next: () => {
        this.router.navigate(['dashboard', 'articles']);
      },
      error: error => {
        this.isSaving = false;
        this.errorMessage = this.getErrorMessage(error, 'L’enregistrement de l’article a échoué.');
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
