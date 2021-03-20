import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";
import { User } from "./user.module";
import { AngularFireAuth } from "@angular/fire/auth";
import { TrainingService } from "../training/training.service";
import { UIService } from "../shared/ui.service";

@Injectable()
export class AuthService {
    user: User;
    private isAuthenticated = false;
    authChange = new Subject<boolean>();

    constructor(
        private router: Router, 
        private afAuth: AngularFireAuth,
        private trainingService: TrainingService,
        private uiService: UIService) {
    }

    initAuthListener() {
        this.afAuth.authState.subscribe((user) => {
            if (user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigateByUrl('/training');
            } else {
                this.trainingService.cancelSubscriptions();
                this.isAuthenticated = false;
                this.authChange.next(false);
                this.router.navigateByUrl('/login');
            }
        });
    }

    registerUser(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
            this.uiService.loadingStateChanged.next(false);
        })
        .catch(error => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar(error.message, null, { duration: 3000});
        })
    }

    login(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        this.afAuth.signInWithEmailAndPassword(authData.email, authData.password)
        .then(result => { 
            this.uiService.loadingStateChanged.next(false);
        })
        .catch(error => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar(error.message, null, { duration: 3000});
        })
    }

    logout() {
        this.afAuth.signOut();
    }

    isAuth() {
        return this.isAuthenticated;
    }
}