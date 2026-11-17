import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FournisseurDto } from '../../../api/models';
import { FournisseurService } from '../../../services/fournisseur/fournisseur-service';
import { getHttpErrorMessage } from '../../../utils/http-error';
import { can } from '../../../utils/permissions';

@Component({
  selector: 'app-page-fournisseur',
  standalone: false,
  templateUrl: './page-fournisseur.html',
  styleUrl: './page-fournisseur.css',
})
export class PageFournisseur implements OnInit {
  readonly canEdit = can('gererFournisseurs');
  fournisseurs: FournisseurDto[] = [];
  searchTerm = '';
  errorMessage = '';
  isLoading = true;
  deleteCandidateId: number | null = null;
  currentPage = 1;
  readonly pageSize = 8;

  constructor(
    private router: Router,
    private fournisseurService: FournisseurService
  ) { }

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  nouveauFournisseur(): void {
    this.router.navigate(['dashboard', 'nouveaufournisseur']);
  }

  get filteredFournisseurs(): FournisseurDto[] {
    const query = this.searchTerm.trim().toLocaleLowerCase();
    if (!query) {
      return this.fournisseurs;
    }
    return this.fournisseurs.filter(fournisseur =>
      [fournisseur.nom, fournisseur.prenom, fournisseur.email, fournisseur.numTel]
        .some(value => value?.toLocaleLowerCase().includes(query))
    );
  }

  get pagedFournisseurs(): FournisseurDto[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredFournisseurs.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredFournisseurs.length / this.pageSize));
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

  supprimerFournisseur(id: number): void {
    this.errorMessage = '';
    this.fournisseurService.delete(id).subscribe({
      next: () => {
        this.fournisseurs = this.fournisseurs.filter(fournisseur => fournisseur.id !== id);
        this.deleteCandidateId = null;
        this.currentPage = Math.min(this.currentPage, this.totalPages);
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error, 'La suppression du fournisseur a échoué.');
        this.deleteCandidateId = null;
      }
    });
  }

  private loadFournisseurs(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.fournisseurService.findAll().subscribe({
      next: fournisseurs => {
        this.fournisseurs = fournisseurs ?? [];
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error, 'Impossible de charger les fournisseurs.');
        this.isLoading = false;
      }
    });
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    return getHttpErrorMessage(error, fallback);
  }
}
