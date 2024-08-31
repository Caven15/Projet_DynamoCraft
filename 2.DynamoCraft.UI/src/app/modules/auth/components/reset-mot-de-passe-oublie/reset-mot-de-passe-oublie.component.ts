import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../tools/services/api/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-reset-mot-de-passe-oublie',
    templateUrl: './reset-mot-de-passe-oublie.component.html',
    styleUrl: './reset-mot-de-passe-oublie.component.scss'
})
export class ResetMotDePasseOublieComponent {
    resetPasswordForm!: FormGroup;
    errorMessage: string = '';
    isPasswordVisible: boolean = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
        this.resetPasswordForm = this.fb.group({
            newPassword: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            ]],
            confirmPassword: ['', [Validators.required]]
        }, { validator: this.passwordsMatchValidator });
    }

    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

    passwordsMatchValidator(form: FormGroup): any {
        const newPassword = form.get('newPassword')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;
        return newPassword === confirmPassword ? null : { mismatch: true };
    }

    onSubmit(): void {
        if (this.resetPasswordForm.invalid) {
            this.errorMessage = 'Le formulaire est invalide';
            return;
        }

        const { newPassword } = this.resetPasswordForm.value;
        const token = this.route.snapshot.params['token'];

        this.authService.resetPasswordWithToken(token, newPassword).subscribe({
            next: () => {
                alert('Votre mot de passe a été réinitialisé avec succès.');
                this.router.navigate(['/login']);
            },
            error: (err) => {
                console.error('Erreur lors de la réinitialisation du mot de passe:', err);
                this.errorMessage = 'Erreur lors de la réinitialisation du mot de passe';
            },
        });
    }
}
