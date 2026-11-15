import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deconnexion',
  standalone: false,
  templateUrl: './deconnexion.html',
  styleUrl: './deconnexion.css',
})
export class Deconnexion implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  deconnexion() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('connectedUser');
    localStorage.removeItem('authenticationResponse');
    this.router.navigate(['/login']);
  }
}
