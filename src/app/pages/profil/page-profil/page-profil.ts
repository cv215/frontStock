import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilisateurDto } from '../../../api/models';
import { User } from '../../../services/user/user';

@Component({
  selector: 'app-page-profil',
  standalone: false,
  templateUrl: './page-profil.html',
  styleUrl: './page-profil.css',
})
export class PageProfil implements OnInit {
  connectedUser: UtilisateurDto | null = null;

  constructor(
    private router: Router,
    private userService: User
  ) { }

  ngOnInit(): void {
    this.connectedUser = this.userService.getConnectedUser();
  }

  modifierMotDePasse(): void {
    this.router.navigate(['dashboard','changermotdepasse']);
  }
}
