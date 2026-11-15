import { Component } from '@angular/core';
import { User } from '../../services/user/user';

@Component({
  selector: 'app-page-dashboard',
  standalone: false,
  templateUrl: './page-dashboard.html',
  styleUrl: './page-dashboard.css',
})
export class PageDashboard {
  readonly currentYear = new Date().getFullYear();

  constructor(private readonly userService: User) {}

  get isClient(): boolean {
    return this.userService.getConnectedUser()?.roles?.libelle === 'CLIENT';
  }

  get connectedUserName(): string {
    const user = this.userService.getConnectedUser();
    return user?.prenom || user?.nom || user?.email || 'Client';
  }

  get userInitials(): string {
    const user = this.userService.getConnectedUser();
    const first = user?.prenom?.trim().charAt(0) || user?.nom?.trim().charAt(0) || 'C';
    const second = user?.nom?.trim().charAt(0);
    return `${first}${second && second.toLocaleLowerCase() !== first.toLocaleLowerCase() ? second : ''}`.toUpperCase();
  }
}
