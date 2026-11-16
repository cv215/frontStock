import { Injectable } from '@angular/core';
import { AuthentificationService } from '../authentification/authentification-service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthentificationRequest, AuthentificationResponse, UtilisateurDto } from '../../api/models';
import { UtilisateurService } from '../utilisateur/utilisateur-service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class User {
  constructor(
    private authenticationService: AuthentificationService,
    private utilisateurService: UtilisateurService,
    private router: Router
  ){}

  login(authenticationRequest: AuthentificationRequest): Observable<AuthentificationResponse> {
    return this.authenticationService.authenticate(authenticationRequest);
  }

  getUserByEmail(email: string): Observable<UtilisateurDto> {
    return this.utilisateurService.findByEmail(email);
  }

  setConnectedUser(user: AuthentificationResponse): void {
    if (user.accessToken) {
      localStorage.setItem('accessToken', user.accessToken);
    }
  }

  setUtilisateur(utilisateur: UtilisateurDto): void {
    localStorage.setItem('connectedUser', JSON.stringify(utilisateur));
  }

  getConnectedUser(): UtilisateurDto | null {
    const user = localStorage.getItem('connectedUser');
    if (!user) {
      return null;
    }
    try {
      return JSON.parse(user) as UtilisateurDto;
    } catch {
      localStorage.removeItem('connectedUser');
      return null;
    }
  }

  /** Vrai si le jeton est absent, illisible ou expiré (avec 10 s de marge). */
  isTokenExpired(token: string | null): boolean {
    if (!token) {
      return true;
    }
    try {
      const { exp } = jwtDecode<{ exp?: number }>(token);
      return typeof exp === 'number' && exp * 1000 <= Date.now() + 10_000;
    } catch {
      return true;
    }
  }

  clearSession(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('connectedUser');
    localStorage.removeItem('authenticationResponse');
  }

  isUserLoggedAccessTokenvalid(): boolean {
    const user = localStorage.getItem('connectedUser');
    const accessToken = localStorage.getItem('accessToken');
    if (user && accessToken && !this.isTokenExpired(accessToken)) {
      return true;
    }
    this.clearSession();
    this.router.navigate(['/login']);
    return false;
  }
}
