import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../services/user/user';
import { UtilisateurDto } from '../../api/models';
import { isClientUser } from '../../utils/user-roles';

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
    this.isClient = isClientUser(this.connectedUser);
    const email = this.connectedUser?.email;
    if (!email) {
      return;
    }

    this.userService.getUserByEmail(email).subscribe({
      next: user => {
        this.connectedUser = user;
        this.isClient = isClientUser(user);
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
