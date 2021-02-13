import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGaurd implements CanActivate {

    constructor(private router: Router, private authService: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.isAuth()) {
            return true;
        }

        this.router.navigateByUrl('/login');
    }
}