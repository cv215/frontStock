import { Component } from '@angular/core';
import { User } from '../../services/user/user';
import { isClientUser } from '../../utils/user-roles';

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
    return isClientUser(this.userService.getConnectedUser());
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
