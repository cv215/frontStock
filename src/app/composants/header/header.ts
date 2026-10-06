import { Component, OnInit } from '@angular/core';
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

  constructor(
    private userService: User
  ) { }
  ngOnInit(): void {
    this.connectedUser = this.userService.getConnectedUser();
  }
}
