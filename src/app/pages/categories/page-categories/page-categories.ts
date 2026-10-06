import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-categories',
  standalone: false,
  templateUrl: './page-categories.html',
  styleUrl: './page-categories.css',
})
export class PageCategories implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  nouvelCategory(): void {
    this.router.navigate(['dashboard','nouvellecategorie']);
  }

}

