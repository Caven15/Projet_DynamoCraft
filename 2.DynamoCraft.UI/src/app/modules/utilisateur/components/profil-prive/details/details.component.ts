import { Component, ElementRef, ViewChild } from '@angular/core';
import { Utilisateur } from '../../../../../models/utilisateur.model';
import { AuthService } from '../../../../../tools/services/api/auth.service';
import { ImageUtilisateurService } from '../../../../../tools/services/api/image-utilisateur.service';
import { UtilisateurService } from '../../../../../tools/services/api/utilisateur.service';
import { environment } from '../../../../../../environments/environment.dev';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
    utilisateur: Utilisateur | null = null;
    url: string = `${environment.apiUrl}/uploads/`;
    @ViewChild('fileInput') fileInput!: ElementRef;
    isSaving: boolean = false;
    selectedImage: File | null = null; // Image sélectionnée
    imagePreviewUrl: string | null = null; // URL pour l'aperçu de l'image

    constructor(
        private authService: AuthService,
        private imageUtilisateurService: ImageUtilisateurService,
        private utilisateurService: UtilisateurService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => {
            this.utilisateur = user;
        });
    }

    getProfileImageUrl(): string {
        return this.imagePreviewUrl || (this.utilisateur?.imageUtilisateur
            ? `${this.url}${this.utilisateur.imageUtilisateur.nom}`
            : 'assets/png/logo.png');
    }

    openImageUpload(): void {
        this.fileInput.nativeElement.click();
    }

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            this.selectedImage = file; // Stocker l'image sélectionnée
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreviewUrl = reader.result as string; // Mettre à jour l'URL d'aperçu de l'image
            };
            reader.readAsDataURL(file); // Lire le fichier pour obtenir l'URL de l'aperçu
        }
    }

    confirmChanges(): void {
        if (this.utilisateur && !this.isSaving) {
            if (!this.utilisateur.pseudo || !this.utilisateur.email) {
                alert("Pseudo et Email sont requis.");
                return;
            }
            this.isSaving = true;
            const formData = new FormData();
            formData.append('pseudo', this.utilisateur.pseudo || '');
            formData.append('biographie', this.utilisateur.biographie || '');
            formData.append('centreInterets', this.utilisateur.centreInterets || '');
            formData.append('email', this.utilisateur.email || '');

            if (this.selectedImage) {
                formData.append('image', this.selectedImage);
            }

            this.utilisateurService.updateUtilisateur(this.utilisateur.id!, formData).subscribe(() => {
                console.log('Profil mis à jour');
                this.isSaving = false; // Réinitialiser l'état de sauvegarde
                this.router.navigate(['/utilisateur/profil/', this.utilisateur?.id]);

            });
        }
    }

    resetPassword(): void {
        this.router.navigate(['/auth/reset-password']);
    }

    deleteAccount(): void {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.");
        if (confirmation) {
            this.utilisateurService.deleteUtilisateur(this.utilisateur!.id!).subscribe({
                complete: () => {
                    this.authService.logout();
                    this.router.navigate(['/home']);
                }
            });
        }
    }
}
