import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CommandeClientDto } from '../../api/models';
import { Observable } from 'rxjs';

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

  updateArticle(idCommande: number,idLigneCommande: number,idArticle: number): Observable<CommandeClientDto> {
    return this.http.get<CommandeClientDto>(`${this.apiUrl}/update/article/${idCommande}/${idLigneCommande}/${idArticle}`);
  }

  findByCode(codeCommandeClient: string): Observable<CommandeClientDto> {
    return this.http.get<CommandeClientDto>(`${this.apiUrl}/${codeCommandeClient}`);
  }

  updateClient(idCommande: number,idClient: number): Observable<CommandeClientDto> {
    return this.http.get<CommandeClientDto>(`${this.apiUrl}/update/client/${idCommande}/${idClient}`);
  }

  updateEtatCommande(idCommande: number,etatCommande: 'EN_COURS' | 'VALIDE' | 'LIVREE'): Observable<CommandeClientDto> {
    return this.http.get<CommandeClientDto>(`${this.apiUrl}/update/etat/${idCommande}/${etatCommande}`);
  }

  updateQuantiteCommande(idCommande: number,idLigneCommande: number,quantite: number): Observable<CommandeClientDto> {
    return this.http.get<CommandeClientDto>(`${this.apiUrl}/update/quantite/${idCommande}/${idLigneCommande}/${quantite}`);
  }

  findAll(): Observable<CommandeClientDto[]> {
    return this.http.get<CommandeClientDto[]>(`${this.apiUrl}/all`);
  }

   findAllLigneCommandeClient(idCommande: number): Observable<CommandeClientDto[]> {
    return this.http.get<CommandeClientDto[]>(`${this.apiUrl}/lignesCommande/${idCommande}`);
  }

  delete(idCommandeClient: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${idCommandeClient}`);
  }

   deleteArticle(idCommande: number,idLigneCommande: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/article/${idCommande}/${idLigneCommande}`);
  }
}
