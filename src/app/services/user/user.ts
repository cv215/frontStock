import { Injectable } from '@angular/core';
import { AuthentificationService } from '../authentification/authentification-service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthentificationRequest, AuthentificationResponse, UtilisateurDto } from '../../api/models';
import { UtilisateurService } from '../utilisateur/utilisateur-service';

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
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  clearSession(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('connectedUser');
    localStorage.removeItem('authenticationResponse');
  }

  isUserLoggedAccessTokenvalid(): boolean {
    const user = localStorage.getItem('connectedUser');
    const accessToken = localStorage.getItem('accessToken');
    if (user && accessToken) {
      return true;
    }
    this.clearSession();
    this.router.navigate(['/login']);
    return false;
  }
}
