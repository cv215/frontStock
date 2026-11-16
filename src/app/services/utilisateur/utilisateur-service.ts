import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UtilisateurDto } from '../../api/models';
import { Observable } from 'rxjs';

export interface ChangerMotDePasseRequest {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
  confirmerMotDePasse: string;
}

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

  changerMotDePasse(request: ChangerMotDePasseRequest): Observable<UtilisateurDto> {
    return this.http.post<UtilisateurDto>(`${this.apiUrl}/update/password`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
