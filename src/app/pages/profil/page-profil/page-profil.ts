import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-profil',
  standalone: false,
  templateUrl: './page-profil.html',
  styleUrl: './page-profil.css',
})
export class PageProfil implements OnInit {
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  modifierMotDePasse() {
    this.router.navigate(['dashboard','changermotdepasse']);
  }
}
