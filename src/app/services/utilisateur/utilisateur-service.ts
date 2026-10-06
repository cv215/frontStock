import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EntrepriseDto, UtilisateurDto } from '../../api/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilisateurService {
  private apiUrl = `${environment.apiUrl}/utilisateurs`;

  constructor(
    private http: HttpClient
  ) {}

  save(utilisateur: UtilisateurDto): Observable<UtilisateurDto> {
    return this.http.post<UtilisateurDto>(`${this.apiUrl}/inscription`, utilisateur);
  }

  findById(id: number): Observable<UtilisateurDto> {
    return this.http.get<UtilisateurDto>(`${this.apiUrl}/${id}`);
  }

  findByEmail(email: string): Observable<UtilisateurDto> {
    return this.http.get<UtilisateurDto>(`${this.apiUrl}/email/${encodeURIComponent(email)}`);
  }

  findAll(): Observable<UtilisateurDto[]> {
    return this.http.get<UtilisateurDto[]>(`${this.apiUrl}/all`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
