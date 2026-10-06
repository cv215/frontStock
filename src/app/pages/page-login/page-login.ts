import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { User } from '../../services/user/user';
import { Router } from '@angular/router';
import { AuthentificationRequest } from '../../api/models';
import { switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-page-login',
  standalone: false,
  templateUrl: './page-login.html',
  styleUrl: './page-login.css',
})
export class PageLogin {
  authenticationRequest: AuthentificationRequest = {};
  errorMessage = '';
  showPassword = false;
  rememberMe = false;
  isSubmitting = false;

  constructor(
    private userService: User,
    private router : Router
  ){}
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    const email = this.authenticationRequest.email?.trim().toLowerCase();
    const password = this.authenticationRequest.password;
    this.errorMessage = '';

    if (!email || !password) {
      this.errorMessage = 'Veuillez saisir votre adresse e-mail et votre mot de passe.';
      return;
    }

    this.isSubmitting = true;
    this.userService.login({ email, password }).pipe(
      switchMap(response => {
        if (!response.accessToken) {
          return throwError(() => new Error('Le serveur n’a pas retourné de jeton de connexion.'));
        }
        this.userService.setConnectedUser(response);
        return this.userService.getUserByEmail(email);
      })
    ).subscribe({
      next: utilisateur => {
        this.userService.setUtilisateur(utilisateur);
        this.router.navigate(['/dashboard']);
      },
      error: error => {
        this.userService.clearSession();
        this.errorMessage = this.getErrorMessage(error);
        this.isSubmitting = false;
      }
    });
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const response = error.error as { message?: string; errors?: string[] } | null;
      return response?.errors?.join(' ') || response?.message || 'Une erreur est survenue lors de la connexion.';
    }
    return error instanceof Error ? error.message : 'Une erreur est survenue lors de la connexion.';
  }
}
