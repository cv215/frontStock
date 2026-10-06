import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-fournisseur',
  standalone: false,
  templateUrl: './page-fournisseur.html',
  styleUrl: './page-fournisseur.css',
})
export class PageFournisseur implements OnInit {
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  nouveauFournisseur(): void {
    this.router.navigate(['dashboard', 'nouveaufournisseur']);
  }
}
