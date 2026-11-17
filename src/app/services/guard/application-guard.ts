import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { User } from '../user/user';
import { can, Permission } from '../../utils/permissions';

@Injectable({
  providedIn: 'root',
})
export class ApplicationGuard implements CanActivate {

  constructor(
    private userService: User,
    private router: Router
  ){}

  /**
   * Autorise l'accès si l'utilisateur est connecté avec un jeton valide et, quand la route
   * déclare une permission (data.permission), s'il possède un rôle qui la donne.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (!this.userService.isUserLoggedAccessTokenvalid()) {
      return false;
    }
    const permission = route.data?.['permission'] as Permission | undefined;
    if (permission && !can(permission, this.userService.getConnectedUser())) {
      return this.router.createUrlTree(['/dashboard/ensemble']);
    }
    return true;
  }
}
