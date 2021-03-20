import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGaurd implements CanActivate, CanLoad {

    constructor(private router: Router, private authService: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.isAuth()) {
            return true;
        }

        this.router.navigateByUrl('/login');
    }

    canLoad(route: Route) {
        if (this.authService.isAuth()) {
            return true;
        }

        this.router.navigateByUrl('/login');
    }
}