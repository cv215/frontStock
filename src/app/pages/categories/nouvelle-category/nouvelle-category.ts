import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nouvelle-category',
  standalone: false,
  templateUrl: './nouvelle-category.html',
  styleUrl: './nouvelle-category.css',
})
export class NouvelleCategory implements OnInit {

  constructor(
    private router: Router
  ) { }
  ngOnInit(): void {
  }
  cancel(): void {
    this.router.navigate(['dashboard','categories']);
  }
}
