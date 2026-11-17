import { Injectable } from '@angular/core';
import { EntrepriseDto } from '../../api/models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/** Entreprise telle que proposée dans le formulaire d'inscription (sans données sensibles). */
export interface EntreprisePublique {
  id: number;
  nom: string;
}

@Injectable({
  providedIn: 'root',
})
export class EntrepriseService {
  private apiUrl = `${environment.apiUrl}/entreprises`;

  constructor(
    private http: HttpClient
  ) {}

  sinscrire(entreprise: EntrepriseDto): Observable<EntrepriseDto> {
    return this.http.post<EntrepriseDto>(`${this.apiUrl}/create`, entreprise);
  }

  findAllPublic(): Observable<EntreprisePublique[]> {
    return this.http.get<EntreprisePublique[]>(`${this.apiUrl}/public`);
  }

  findById(id: number): Observable<EntrepriseDto> {
    return this.http.get<EntrepriseDto>(`${this.apiUrl}/${id}`);
  }

  findAll(): Observable<EntrepriseDto[]> {
    return this.http.get<EntrepriseDto[]>(`${this.apiUrl}/all`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
