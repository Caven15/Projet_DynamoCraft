import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { GoogleCaptchaComponent } from './components/google-captcha/google-captcha.component';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { MotDePasseOublieComponent } from './components/mot-de-passe-oublie/mot-de-passe-oublie.component';
import { ResetMotDePasseOublieComponent } from './components/reset-mot-de-passe-oublie/reset-mot-de-passe-oublie.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ValidationCompteComponent } from './components/validation-compte/validation-compte.component';


@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        ResetPasswordComponent,
        GoogleCaptchaComponent,
        MotDePasseOublieComponent,
        ResetMotDePasseOublieComponent,
        ValidationCompteComponent,
    ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        RecaptchaModule,
        RecaptchaFormsModule,
        NgxCaptchaModule
    ],
    exports: [
        GoogleCaptchaComponent
    ]
})
export class AuthModule { }
