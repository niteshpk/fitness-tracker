import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";
import { User } from "./user.module";

@Injectable()
export class AuthService {
    user: User;
    authChange = new Subject<boolean>();

    constructor(private router: Router) {
        
    }

    registerUser(authData: AuthData) {
        this.user = {
            email: authData.email,
            userId: Math.round(Math.random() * 10000).toString(),
        };
        this.authSuccessfully();
    }

    login(authData: AuthData) {
        this.user = {
            email: authData.email,
            userId: Math.round(Math.random() * 10000).toString(),
        };
        this.authSuccessfully();
    }

    private authSuccessfully() {
        this.authChange.next(true);
        this.router.navigateByUrl('/training');
    }

    logout() {
        this.user = null;
        this.authChange.next(false);
        this.router.navigateByUrl('/login');
    }

    getUser() {
        return { ...this.user };
    }

    isAuth() {
        return !!(this.user);
    }
}