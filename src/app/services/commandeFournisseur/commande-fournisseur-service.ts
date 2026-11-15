import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommandeFournisseurDto } from '../../api/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommandeFournisseurService {
  private readonly apiUrl = `${environment.apiUrl}/commandesfournisseurs`;

  constructor(private readonly http: HttpClient) {}

  save(commande: CommandeFournisseurDto): Observable<CommandeFournisseurDto> {
    return this.http.post<CommandeFournisseurDto>(`${this.apiUrl}/create`, commande);
  }

  findById(id: number): Observable<CommandeFournisseurDto> {
    return this.http.get<CommandeFournisseurDto>(`${this.apiUrl}/${id}`);
  }

  findAll(): Observable<CommandeFournisseurDto[]> {
    return this.http.get<CommandeFournisseurDto[]>(`${this.apiUrl}/all`);
  }

  updateEtatCommande(id: number, etat: 'EN_COURS' | 'VALIDE' | 'LIVREE'): Observable<CommandeFournisseurDto> {
    return this.http.get<CommandeFournisseurDto>(`${this.apiUrl}/update/etat/${id}/${etat}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
