import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilisateurDto } from '../../../api/models';
import { UtilisateurService } from '../../../services/utilisateur/utilisateur-service';
import { User } from '../../../services/user/user';
import { roleLabel } from '../../../utils/user-roles';
import { getHttpErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-page-utilisateur',
  standalone: false,
  templateUrl: './page-utilisateur.html',
  styleUrl: './page-utilisateur.css',
})
export class PageUtilisateur implements OnInit {
  utilisateurs: UtilisateurDto[] = [];
  readonly roleLabel = roleLabel;
  searchTerm = '';
  errorMessage = '';
  isLoading = true;
  deleteCandidateId: number | null = null;
  currentPage = 1;
  readonly pageSize = 8;
  connectedUserId: number | undefined;

  constructor(
    private router: Router,
    private utilisateurService: UtilisateurService,
    private userService: User
  ) { }

  ngOnInit(): void {
    this.connectedUserId = this.userService.getConnectedUser()?.id;
    this.loadUtilisateurs();
  }

  nouveauUtilisateur(): void {
    this.router.navigate(['dashboard','nouvelutilisateur']);
  }

  get filteredUtilisateurs(): UtilisateurDto[] {
    const query = this.searchTerm.trim().toLocaleLowerCase();
    if (!query) {
      return this.utilisateurs;
    }
    return this.utilisateurs.filter(utilisateur =>
      [utilisateur.nom, utilisateur.prenom, utilisateur.email]
        .some(value => value?.toLocaleLowerCase().includes(query))
    );
  }

  get pagedUtilisateurs(): UtilisateurDto[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUtilisateurs.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredUtilisateurs.length / this.pageSize));
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

  supprimerUtilisateur(id: number): void {
    this.errorMessage = '';
    this.utilisateurService.delete(id).subscribe({
      next: () => {
        this.utilisateurs = this.utilisateurs.filter(utilisateur => utilisateur.id !== id);
        this.deleteCandidateId = null;
        this.currentPage = Math.min(this.currentPage, this.totalPages);
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error, 'La suppression de l’utilisateur a échoué.');
        this.deleteCandidateId = null;
      }
    });
  }

  private loadUtilisateurs(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.utilisateurService.findAll().subscribe({
      next: utilisateurs => {
        this.utilisateurs = utilisateurs ?? [];
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error, 'Impossible de charger les utilisateurs.');
        this.isLoading = false;
      }
    });
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    return getHttpErrorMessage(error, fallback);
  }
}

