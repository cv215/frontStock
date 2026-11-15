import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CathegoryDto } from '../../../api/models';
import { CategoryService } from '../../../services/cathegory/category-service';

@Component({
  selector: 'app-page-categories',
  standalone: false,
  templateUrl: './page-categories.html',
  styleUrl: './page-categories.css',
})
export class PageCategories implements OnInit {
  listCategories: Array<CathegoryDto> = [];
  searchTerm = '';
  errorMessage = '';
  isLoading = true;
  deleteCandidateId: number | null = null;

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  get filteredCategories(): CathegoryDto[] {
    const query = this.searchTerm.trim().toLocaleLowerCase();
    if (!query) {
      return this.listCategories;
    }
    return this.listCategories.filter(category =>
      [category.code, category.designation].some(value => value?.toLocaleLowerCase().includes(query))
    );
  }

  private loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.categoryService.findAll().subscribe({
      next: (categories) => {
        this.listCategories = categories ?? [];
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error);
        this.isLoading = false;
      }
    });
  }

  nouvelCategory(): void {
    this.router.navigate(['dashboard','nouvellecategorie']);
  }
  modifierCategory(id: number): void {
    this.router.navigate(['dashboard','nouvellecategorie', id]);
  }
  supprimerCategory(id: number): void {
    this.errorMessage = '';
    this.categoryService.delete(id).subscribe({
      next: () => {
        this.listCategories = this.listCategories.filter(category => category.id !== id);
        this.deleteCandidateId = null;
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error);
        this.deleteCandidateId = null;
      }
    });
  }
  voirDetailsCategory(id: number): void {
    this.router.navigate(['dashboard','nouvellecategorie', id]);
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (typeof error.error === 'string' && error.error.trim()) {
        return error.error;
      }
      if (error.error && typeof error.error === 'object' && 'message' in error.error
        && typeof error.error.message === 'string') {
        return error.error.message;
      }
      return error.status === 0 ? 'Le serveur est indisponible. Réessayez plus tard.' : 'Une erreur est survenue avec les catégories.';
    }
    return 'Une erreur est survenue avec les catégories.';
  }
}

