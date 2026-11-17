import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientDto } from '../../../api/models';
import { ClientService } from '../../../services/client/client-service';
import { getHttpErrorMessage } from '../../../utils/http-error';
import { can } from '../../../utils/permissions';

@Component({
  selector: 'app-page-client',
  standalone: false,
  templateUrl: './page-client.html',
  styleUrl: './page-client.css',
})
export class PageClient implements OnInit {
  readonly canEdit = can('gererClients');
  clients: ClientDto[] = [];
  searchTerm = '';
  errorMessage = '';
  isLoading = true;
  deleteCandidateId: number | null = null;
  currentPage = 1;
  readonly pageSize = 8;

  constructor(
    private router: Router,
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.loadClients();
  }

  nouveauClient(): void {
    this.router.navigate(['dashboard', 'nouveauclient']);
  }

  get filteredClients(): ClientDto[] {
    const query = this.searchTerm.trim().toLocaleLowerCase();
    if (!query) {
      return this.clients;
    }

    return this.clients.filter(client =>
      [client.nom, client.prenom, client.email, client.numTel]
        .some(value => value?.toLocaleLowerCase().includes(query))
    );
  }

  get pagedClients(): ClientDto[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredClients.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredClients.length / this.pageSize));
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

  supprimerClient(id: number): void {
    this.errorMessage = '';
    this.clientService.delete(id).subscribe({
      next: () => {
        this.clients = this.clients.filter(client => client.id !== id);
        this.deleteCandidateId = null;
        this.currentPage = Math.min(this.currentPage, this.totalPages);
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error, 'La suppression du client a échoué.');
        this.deleteCandidateId = null;
      }
    });
  }

  private loadClients(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.clientService.findAll().subscribe({
      next: clients => {
        this.clients = clients ?? [];
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error, 'Impossible de charger les clients.');
        this.isLoading = false;
      }
    });
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    return getHttpErrorMessage(error, fallback);
  }
}
