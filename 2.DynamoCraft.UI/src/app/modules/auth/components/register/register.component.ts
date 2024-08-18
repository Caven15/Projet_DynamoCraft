import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../tools/services/api/auth.service';

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
    isPasswordVisible: boolean = false;  // Pour basculer la visibilité du mot de passe
    defaultImage: string = 'assets/png/logo.png';  // Image par défaut

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // Initialisation du formulaire avec les validations
        this.registerForm = this.fb.group({
            pseudo: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            dateNaissance: ['', Validators.required],
            biographie: ['', Validators.maxLength(500)],
            password: ['', [Validators.required, Validators.minLength(6)]],
            centreInterets: [''],
            image: ['']
        });
    }

    // Méthode pour basculer la visibilité du mot de passe
    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

    // Méthode pour ouvrir la boîte de dialogue de fichier lorsque l'utilisateur clique sur le bouton "+" ou l'icône de mise à jour
    triggerFileInput(): void {
        const fileInputElement = document.getElementById('image') as HTMLInputElement;
        fileInputElement.click();
    }

    // Gestion de la sélection de fichier et de la prévisualisation de l'image
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

    onSubmit(): void {
        if (this.registerForm.invalid) {
            return;
        }

        // Création de FormData pour envoyer à l'API
        const formData = new FormData();
        formData.append('pseudo', this.registerForm.get('pseudo')?.value || '');
        formData.append('email', this.registerForm.get('email')?.value);
        formData.append('password', this.registerForm.get('password')?.value);

        // Convertir dateNaissance en objet Date et en chaîne ISO
        const dateNaissanceValue = this.registerForm.get('dateNaissance')?.value;
        const dateNaissance = dateNaissanceValue ? new Date(dateNaissanceValue).toISOString() : '';
        formData.append('dateNaissance', dateNaissance);

        formData.append('biographie', this.registerForm.get('biographie')?.value || '');
        formData.append('centreInterets', this.registerForm.get('centreInterets')?.value || '');

        if (this.selectedFile) {
            formData.append('image', this.selectedFile, this.selectedFile.name);
        }

        this.authService.register(formData).subscribe({
            next: () => {
                alert('Inscription réussie');
                this.router.navigate(['/login']);
            },
            error: (error) => {
                console.error('Erreur lors de l\'inscription:', error);
            }
        });
    }
}
