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

  generatePasswordResetToken(email: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/token`, null, {
      params: { username: email },
      responseType: 'text'
    });
  }
}
