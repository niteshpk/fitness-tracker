import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class UIService {
    constructor(private snackBar: MatSnackBar) {}
    loadingStateChanged = new Subject<boolean>();
    
    showSnackbar(message, action, duration) {
        this.snackBar.open(message, action, { duration });
    }
}