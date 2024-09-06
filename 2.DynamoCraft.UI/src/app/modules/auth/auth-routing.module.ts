import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ResetMotDePasseOublieComponent } from './components/reset-mot-de-passe-oublie/reset-mot-de-passe-oublie.component';
import { MotDePasseOublieComponent } from './components/mot-de-passe-oublie/mot-de-passe-oublie.component';
import { ValidationCompteComponent } from './components/validation-compte/validation-compte.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'mot-de-passe-oublie', component: MotDePasseOublieComponent },
    { path: 'reset-mot-de-passe-oublie/:token', component: ResetMotDePasseOublieComponent },
    { path: 'activate/:token', component: ValidationCompteComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
