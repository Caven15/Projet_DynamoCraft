import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../tools/services/api/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    errorMessage: string = '';
    isPasswordVisible: boolean = false;
    captchaValid: boolean = false;
    captchaResponse: string = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

    onCaptchaResolved(captchaResponse: string | null): void {
        this.captchaResponse = captchaResponse || '';
        this.captchaValid = !!captchaResponse;
    }

    onSubmit(): void {
        if (this.loginForm.invalid || !this.captchaValid) {
            this.errorMessage = 'Le formulaire est invalide ou le captcha n\'a pas été validé';
            return;
        }

        const { email, password } = this.loginForm.value;

        this.authService.login(email, password, this.captchaResponse).subscribe({
            next: (response) => {
                console.log('Connexion réussie:', response);
                this.router.navigate(['/home']);
            },
            error: (err) => {
                console.error('Erreur de connexion:', err);
                this.errorMessage = err
            },
        });
    }
}
