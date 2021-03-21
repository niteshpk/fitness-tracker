import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
@Injectable()
export class AuthGaurd implements CanActivate, CanLoad {

    constructor(
        private store: Store<fromRoot.State>
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.store.select(fromRoot.getIsAuthenticated);
    }

    canLoad(route: Route) {
        return this.store.select(fromRoot.getIsAuthenticated);
    }
}