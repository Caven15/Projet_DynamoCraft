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
        return this.utilisateur?.imageUtilisateur
            ? `${this.url}${this.utilisateur.imageUtilisateur.nom}`
            : 'assets/png/logo.png';
    }

    openImageUpload(): void {
        this.fileInput.nativeElement.click();
    }

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            this.selectedImage = file; // Stocker l'image sélectionnée
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

            // Si une image a été sélectionnée, l'ajouter à la requête
            if (this.selectedImage) {
                formData.append('image', this.selectedImage);
            }

            this.utilisateurService.updateUtilisateur(this.utilisateur.id!, formData).subscribe(() => {
                console.log('Profil mis à jour');
                this.isSaving = false; // Réinitialiser l'état de sauvegarde
                // Rediriger vers le profil public après mise à jour
                this.router.navigate(['/utilisateur', this.utilisateur?.id]);
            });
        }
    }

    resetPassword(): void {
        console.log('Réinitialisation du mot de passe demandée');
    }
}
