import { Component, OnInit } from '@angular/core';
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
    isPasswordVisible: boolean = false; // État pour gérer la visibilité du mot de passe

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

    // Fonction pour basculer la visibilité du mot de passe
    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

    // Fonction soumise au moment de la connexion
    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.errorMessage = 'Le formulaire est invalide';
            return;
        }

        const { email, password } = this.loginForm.value;

        this.authService.login(email, password).subscribe({
            next: (response) => {
                console.log('Connexion réussie:', response);
                this.router.navigate(['/home']); // Redirection après la connexion
            },
            error: (err) => {
                console.error('Erreur de connexion:', err);
                this.errorMessage = 'Email ou mot de passe incorrect';
            },
        });
    }
}
