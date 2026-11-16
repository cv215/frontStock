import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommandeClientDto, LigneCommandeClientDto } from '../../api/models';
import { Observable } from 'rxjs';

export type EtatCommande = 'EN_COURS' | 'VALIDE' | 'LIVREE';

@Injectable({
  providedIn: 'root',
})
export class CommandeClientService {
  private apiUrl = `${environment.apiUrl}/commandesclients`;

  constructor(
    private http: HttpClient
  ) {}

  save(commandeClient: CommandeClientDto): Observable<CommandeClientDto> {
    return this.http.post<CommandeClientDto>(`${this.apiUrl}/create`, commandeClient);
  }

  findById(idCommandeClient: number): Observable<CommandeClientDto> {
    return this.http.get<CommandeClientDto>(`${this.apiUrl}/${idCommandeClient}`);
  }

  findByCode(codeCommandeClient: string): Observable<CommandeClientDto> {
    return this.http.get<CommandeClientDto>(`${this.apiUrl}/code/${encodeURIComponent(codeCommandeClient)}`);
  }

  updateArticle(idCommande: number, idLigneCommande: number, idArticle: number): Observable<CommandeClientDto> {
    return this.http.patch<CommandeClientDto>(`${this.apiUrl}/update/article/${idCommande}/${idLigneCommande}/${idArticle}`, null);
  }

  updateClient(idCommande: number, idClient: number): Observable<CommandeClientDto> {
    return this.http.patch<CommandeClientDto>(`${this.apiUrl}/update/client/${idCommande}/${idClient}`, null);
  }

  updateEtatCommande(idCommande: number, etatCommande: EtatCommande): Observable<CommandeClientDto> {
    return this.http.patch<CommandeClientDto>(`${this.apiUrl}/update/etat/${idCommande}/${etatCommande}`, null);
  }

  updateQuantiteCommande(idCommande: number, idLigneCommande: number, quantite: number): Observable<CommandeClientDto> {
    return this.http.patch<CommandeClientDto>(`${this.apiUrl}/update/quantite/${idCommande}/${idLigneCommande}/${quantite}`, null);
  }

  findAll(): Observable<CommandeClientDto[]> {
    return this.http.get<CommandeClientDto[]>(`${this.apiUrl}/all`);
  }

  findAllLigneCommandeClient(idCommande: number): Observable<LigneCommandeClientDto[]> {
    return this.http.get<LigneCommandeClientDto[]>(`${this.apiUrl}/lignesCommande/${idCommande}`);
  }

  delete(idCommandeClient: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${idCommandeClient}`);
  }

  deleteArticle(idCommande: number, idLigneCommande: number): Observable<CommandeClientDto> {
    return this.http.delete<CommandeClientDto>(`${this.apiUrl}/delete/article/${idCommande}/${idLigneCommande}`);
  }
}
