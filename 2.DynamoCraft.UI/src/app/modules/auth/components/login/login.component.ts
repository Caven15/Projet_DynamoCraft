import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../tools/services/api/auth.service';
import { email } from '../../../../tools/validators/email.validator';  // Custom email validator
import { password } from '../../../../tools/validators/password.validator';  // Custom password validator

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    errorMessage: string = '';
    isPasswordVisible: boolean = false;

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
            email: ['', [Validators.required, Validators.email, email(2)]],
            password: ['', [Validators.required, Validators.minLength(8), password()]],
        });
    }

    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.errorMessage = "Le formulaire est invalide.";
            return;
        }

        const { email, password } = this.loginForm.value;

        this.authService.login(email, password).subscribe({
            next: (response) => {
                console.log('Connexion réussie:', response);
                this.router.navigate(['/home']);
            },
            error: (err) => {
                console.error('Erreur de connexion:', err);
                this.errorMessage = err;
            },
        });
    }

    onResendActivationLink(): void {
        const email = this.loginForm.get('email')?.value;
        if (!email) {
            this.errorMessage = 'Veuillez entrer votre adresse email pour renvoyer le lien d\'activation.';
            return;
        }

        this.authService.resendActivationLink(email).subscribe({
            next: () => {
                this.errorMessage = '';
                alert("Lien d'activation renvoyé avec succès. Vérifiez votre boîte mail.");
            },
            error: (err) => {
                this.errorMessage = 'Erreur lors de l\'envoi du lien d\'activation.';
                console.error('Erreur de renvoi du lien d\'activation:', err);
            }
        });
    }
}
