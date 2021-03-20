import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGaurd } from "./auth/auth.gaurd";
import { WelcomeComponent } from "./welcome/welcome.component";

const routes: Routes = [
    { path: '', component: WelcomeComponent},
    { path: 'training', loadChildren: () => import('./training/training.module').then(m => m.TrainingModule), canLoad: [ AuthGaurd ] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGaurd]
})
export class AppRoutingModule {}