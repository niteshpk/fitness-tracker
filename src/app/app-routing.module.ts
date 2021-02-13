import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGaurd } from "./auth/auth.gaurd";
import { AuthService } from "./auth/auth.service";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { TrainingComponent } from "./training/training.component";
import { WelcomeComponent } from "./welcome/welcome.component";

const routes: Routes = [
    { path: '', component: WelcomeComponent},
    { path: 'signup', component: SignupComponent},
    { path: 'login', component: LoginComponent},
    { path: 'training', component: TrainingComponent, canActivate: [AuthGaurd]},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGaurd]
})
export class AppRoutingModule {}