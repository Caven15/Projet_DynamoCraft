import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../tools/services/api/auth.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    resetPasswordForm!: FormGroup;
    errorMessage: string = '';
    isOldPasswordVisible: boolean = false;
    isNewPasswordVisible: boolean = false;
    isConfirmPasswordVisible: boolean = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
        this.resetPasswordForm = this.fb.group({
            oldPassword: ['', [Validators.required]],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, {
            validators: this.passwordMatchValidator
        });
    }

    // Fonction pour valider la correspondance des mots de passe
    passwordMatchValidator(formGroup: FormGroup): null | { passwordMismatch: true } {
        const newPassword = formGroup.get('newPassword')?.value;
        const confirmPassword = formGroup.get('confirmPassword')?.value;
        return newPassword === confirmPassword ? null : { passwordMismatch: true };
    }

    // Fonction pour basculer la visibilité de l'ancien mot de passe
    toggleOldPasswordVisibility(): void {
        this.isOldPasswordVisible = !this.isOldPasswordVisible;
    }

    // Fonction pour basculer la visibilité du nouveau mot de passe
    toggleNewPasswordVisibility(): void {
        this.isNewPasswordVisible = !this.isNewPasswordVisible;
    }

    // Fonction pour basculer la visibilité de la confirmation du nouveau mot de passe
    toggleConfirmPasswordVisibility(): void {
        this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    }

    // Fonction soumise au moment de la réinitialisation du mot de passe
    onSubmit(): void {
        if (this.resetPasswordForm.invalid) {
            this.errorMessage = 'Le formulaire est invalide';
            return;
        }

        const { oldPassword, newPassword } = this.resetPasswordForm.value;

        this.authService.resetPassword(oldPassword, newPassword).subscribe({
            next: () => {
                alert('Mot de passe réinitialisé avec succès');
                this.router.navigate(['/login']); // Redirection après la réinitialisation
            },
            error: (err) => {
                console.error('Erreur lors de la réinitialisation:', err);
                this.errorMessage = 'Erreur lors de la réinitialisation du mot de passe';
            },
        });
    }
}
