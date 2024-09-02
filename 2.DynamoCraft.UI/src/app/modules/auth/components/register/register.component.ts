import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../tools/services/api/auth.service';
import { imageSize } from '../../../../tools/validators/imageSize.validator';
import { email } from '../../../../tools/validators/email.validator';
import { dateOfBirth } from '../../../../tools/validators/dateOfBirth.validator';
import { password } from '../../../../tools/validators/password.validator';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    @ViewChild('fileInput') fileInput!: ElementRef;
    registerForm!: FormGroup;
    imagePreview: string | ArrayBuffer | null = null;
    selectedFile!: File | null;
    isPasswordVisible: boolean = false;
    defaultImage: string = 'assets/png/logo.png';
    passwordMismatch: boolean = false;
    captchaValid: boolean = false;
    captchaResponse: string = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            pseudo: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email, email(2)]],
            dateNaissance: ['', [Validators.required, dateOfBirth(15, 90)]],
            biographie: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]],
            password: ['', [Validators.required, Validators.minLength(8), password()]],
            confirmPassword: ['', Validators.required],
            centreInterets: ['', [Validators.required, Validators.minLength(50)]],
            image: ['', [imageSize(5)]]
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(formGroup: FormGroup): any {
        const password = formGroup.get('password')?.value;
        const confirmPassword = formGroup.get('confirmPassword')?.value;
        if (password && confirmPassword && password !== confirmPassword) {
            formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
        } else {
            formGroup.get('confirmPassword')?.setErrors(null);
        }
        return null;
    }

    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

    triggerFileInput(): void {
        const fileInputElement = document.getElementById('image') as HTMLInputElement;
        fileInputElement.click();
    }

    onFileSelected(event: Event): void {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
            this.selectedFile = fileInput.files[0];

            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result;
            };
            reader.readAsDataURL(this.selectedFile);
        }
    }

    onCaptchaResolved(captchaResponse: string | null): void {
        this.captchaResponse = captchaResponse || '';
        this.captchaValid = !!captchaResponse;
    }

    onSubmit(): void {
        if (this.registerForm.invalid || !this.captchaValid) {
            return;
        }

        if (this.registerForm.get('password')?.value !== this.registerForm.get('confirmPassword')?.value) {
            this.passwordMismatch = true;
            return;
        }

        const formData = new FormData();
        formData.append('pseudo', this.registerForm.get('pseudo')?.value || '');
        formData.append('email', this.registerForm.get('email')?.value);
        formData.append('password', this.registerForm.get('password')?.value);

        const dateNaissanceValue = this.registerForm.get('dateNaissance')?.value;
        const dateNaissance = dateNaissanceValue ? new Date(dateNaissanceValue).toISOString() : '';
        formData.append('dateNaissance', dateNaissance);

        formData.append('biographie', this.registerForm.get('biographie')?.value || '');
        formData.append('centreInterets', this.registerForm.get('centreInterets')?.value || '');

        if (this.selectedFile) {
            formData.append('image', this.selectedFile, this.selectedFile.name);
        }

        formData.append('recaptchaToken', this.captchaResponse); // Ajouter le token reCAPTCHA au formulaire

        this.authService.register(formData).subscribe({
            next: () => {
                alert('Inscription réussie');
                this.registerForm.reset();
                this.captchaValid = false; // Réinitialiser l'état du captcha après la soumission
                this.router.navigate(['auth/login']);
            },
            error: (error) => {
                console.error('Erreur lors de l\'inscription:', error);
                
            }
        });
    }
}
