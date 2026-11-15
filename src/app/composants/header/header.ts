import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../services/user/user';
import { UtilisateurDto } from '../../api/models';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  connectedUser: UtilisateurDto | null = null;
  profileLoadError = '';
  isClient = false;
  readonly todayLabel = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  constructor(
    private userService: User
  ) { }
  ngOnInit(): void {
    this.connectedUser = this.userService.getConnectedUser();
    this.isClient = this.connectedUser?.roles?.libelle === 'CLIENT';
    const email = this.connectedUser?.email;
    if (!email) {
      return;
    }

    this.userService.getUserByEmail(email).subscribe({
      next: user => {
        this.connectedUser = user;
        this.isClient = user.roles?.libelle === 'CLIENT';
        this.userService.setUtilisateur(user);
      },
      error: error => {
        this.profileLoadError = error instanceof HttpErrorResponse && error.status === 0
          ? 'Le nom du compte n’a pas pu être chargé.'
          : 'Le profil est temporairement indisponible.';
      }
    });
  }
}
