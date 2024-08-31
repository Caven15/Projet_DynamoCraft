import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../tools/services/api/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-mot-de-passe-oublie',
    templateUrl: './mot-de-passe-oublie.component.html',
    styleUrl: './mot-de-passe-oublie.component.scss'
})
export class MotDePasseOublieComponent {
    forgotPasswordForm!: FormGroup;
    errorMessage: string = '';
    captchaValid: boolean = false;
    captchaResponse: string = '';

    constructor(private fb: FormBuilder, private authService: AuthService, private route : Router) { }

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
        this.forgotPasswordForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    onCaptchaResolved(captchaResponse: string | null): void {
        this.captchaResponse = captchaResponse || '';
        this.captchaValid = !!captchaResponse;
    }

    onSubmit(): void {
        if (this.forgotPasswordForm.invalid || !this.captchaValid) {
            this.errorMessage = 'Le formulaire est invalide ou le captcha n\'a pas été validé';
            return;
        }

        const { email } = this.forgotPasswordForm.value;

        this.authService.forgotPassword(email, this.captchaResponse).subscribe({
            next: () => {
                alert('Un email a été envoyé pour réinitialiser votre mot de passe.');
            },
            error: (err) => {
                console.error('Erreur lors de la demande de réinitialisation:', err);
                this.errorMessage = 'Erreur lors de la demande de réinitialisation';
            },
        });
    }
}
