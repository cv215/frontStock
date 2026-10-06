import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-client',
  standalone: false,
  templateUrl: './page-client.html',
  styleUrl: './page-client.css',
})
export class PageClient implements OnInit {
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  nouveauClient(): void {
    this.router.navigate(['dashboard', 'nouveauclient']);
  }
}
