import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthentificationRequest, AuthentificationResponse } from '../../api/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  authenticate(request: AuthentificationRequest): Observable<AuthentificationResponse> {
    return this.http.post<AuthentificationResponse>(`${this.apiUrl}/connexion`, request);
  }

  /** Demande de réinitialisation : la réponse est identique que le compte existe ou non. */
  demanderReinitialisationMotDePasse(email: string): Observable<{ message?: string }> {
    return this.http.post<{ message?: string }>(`${this.apiUrl}/mot-de-passe-oublie`, null, {
      params: { email }
    });
  }
}
