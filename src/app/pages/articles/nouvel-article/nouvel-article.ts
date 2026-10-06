import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nouvel-article',
  standalone: false,
  templateUrl: './nouvel-article.html',
  styleUrl: './nouvel-article.css',
})
export class NouvelArticle implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  cancel(): void {
    this.router.navigate(['dashboard','articles']);
  }
}
