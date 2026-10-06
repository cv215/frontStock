import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot, UrlTree } from '@angular/router';
import { User } from '../user/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationGuard implements CanActivate {

  constructor(
    private userService: User
  ){}

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userService.isUserLoggedAccessTokenvalid(); // autorise seulement si l'utilisateur est connecté et que son token est valide
  }
}
