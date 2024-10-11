import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../tools/services/api/auth.service';
import { imageSize } from '../../../../tools/validators/imageSize.validator';
import { email } from '../../../../tools/validators/email.validator';
import { dateOfBirth } from '../../../../tools/validators/dateOfBirth.validator';
import { password } from '../../../../tools/validators/password.validator';
import { noWhitespace } from '../../../../tools/validators/noWhitespace.validator';
import { validImageType } from '../../../../tools/validators/validImageType.validator';

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
    errorMessage: string = ''; // Ajout d'un message d'erreur global

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            pseudo: ['', [Validators.required, Validators.minLength(3), noWhitespace]],
            email: ['', [Validators.required, Validators.email, email(2), noWhitespace]],
            dateNaissance: ['', [Validators.required, dateOfBirth(15, 90)]],
            biographie: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500), noWhitespace]],
            password: ['', [Validators.required, Validators.minLength(8), password()]],
            confirmPassword: ['', Validators.required],
            centreInterets: ['', [Validators.required, Validators.minLength(50), noWhitespace]],
            image: ['', imageSize(5)]
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

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        const control = new FormControl(file, {
            validators: [imageSize(5)],
            asyncValidators: [validImageType()],
            updateOn: 'change'
        });

        control.statusChanges.subscribe(status => {
            if (status === 'VALID') {
                this.errorMessage = '';
                this.selectedFile = file;

                // Générer un aperçu de l'image
                const reader = new FileReader();
                reader.onload = (e: any) => this.imagePreview = e.target.result;
                reader.readAsDataURL(file);
            } else if (status === 'INVALID') {
                const errors = control.errors;
                if (errors?.['fileSizeExceeded']) {
                    console.log("trop grand");
                    this.errorMessage = `L'image ${file.name} dépasse la taille autorisée de 5MB.`;
                } else if (errors?.['invalidImageType']) {
                    this.errorMessage = `L'image ${file.name} est d'un type non supporté.`;
                }
            }
        });

        control.updateValueAndValidity();
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

        formData.append('recaptchaToken', this.captchaResponse);

        this.authService.register(formData).subscribe({
            next: () => {
                alert('Inscription réussie : Consultez votre boite mail pour activation');
                this.registerForm.reset();
                this.captchaValid = false;
                this.router.navigate(['auth/login']);
            },
            error: (error) => {
                this.errorMessage = error.error.message || 'Erreur lors de l\'inscription';
                console.error('Erreur lors de l\'inscription:', error);
            }
        });
    }
}
