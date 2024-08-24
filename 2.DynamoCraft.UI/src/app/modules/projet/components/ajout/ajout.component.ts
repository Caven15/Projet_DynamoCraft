import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjetService } from '../../../../tools/services/api/projet.service';
import { CategorieService } from '../../../../tools/services/api/categorie.service';
import { Router } from '@angular/router';
import { Categorie } from '../../../../models/categorie.model';
import { Display3dService } from '../../../../tools/services/other/display-3d.service';
import { Modele3dService } from '../../../../tools/services/api/modele-3d.service';

@Component({
    selector: 'app-ajout',
    templateUrl: './ajout.component.html',
    styleUrls: ['./ajout.component.scss']
})
export class AjoutComponent {
    projetForm: FormGroup;
    utilisateurId: number | undefined = 1;
    categories: Categorie[] = [];
    selectedImages: File[] = [];
    imagePreviewUrls: string[] = [];
    selected3DFiles: File[] = [];
    showModal: boolean = false;
    show3DModal: boolean = false;
    modalImageIndex: number = 0;
    modal3DIndex: number = 0;
    maxImages: number = 8;
    maxSize: number = 20 * 1024 * 1024; // 20 MB
    errorMessage: string = '';

    @ViewChild('imageInput') imageInput!: ElementRef;
    @ViewChild('threeContainer') threeContainer!: ElementRef;

    constructor(
        private fb: FormBuilder,
        private projetService: ProjetService,
        private modele3DService: Modele3dService, // Ajout du service de fichiers 3D
        private categorieService: CategorieService,
        private router: Router,
        private display3dService: Display3dService
    ) {
        this.projetForm = this.fb.group({
            nom: ['', Validators.required],
            description: ['', Validators.required],
            categorieId: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.categorieService.getAllCategorie().subscribe(categories => {
            this.categories = categories;
        });
    }

    onImageSelected(event: any): void {
        const files = Array.from(event.target.files) as File[];
        const validFiles: File[] = [];

        if (this.selectedImages.length + files.length > this.maxImages) {
            this.errorMessage = `Vous ne pouvez pas ajouter plus de ${this.maxImages} images.`;
            return;
        }

        files.forEach(file => {
            if (file.size <= this.maxSize) {
                validFiles.push(file);
            } else {
                this.errorMessage = `La taille de l'image ${file.name} dépasse 20 MB.`;
            }
        });

        this.selectedImages.push(...validFiles);
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e: any) => this.imagePreviewUrls.push(e.target.result);
            reader.readAsDataURL(file);
        });

        if (validFiles.length > 0) {
            this.errorMessage = ''; // Réinitialiser le message d'erreur si les fichiers sont valides
        }
    }

    removeImage(index: number): void {
        this.selectedImages.splice(index, 1);
        this.imagePreviewUrls.splice(index, 1);
        this.closeModal(); // Close the modal if the image is removed
    }

    openImageModal(index: number): void {
        this.modalImageIndex = index;
        this.showModal = true;
    }

    closeModal(): void {
        this.showModal = false;
    }

    on3DFileSelected(event: any): void {
        const files = Array.from(event.target.files) as File[];
        this.selected3DFiles.push(...files);
    }

    remove3DFile(index: number): void {
        this.selected3DFiles.splice(index, 1);
        this.close3DModal(); // Close the modal if the 3D file is removed
    }

    open3DModal(index: number): void {
        this.modal3DIndex = index;
        this.show3DModal = true;

        // Charger le modèle 3D dans la scène Three.js après l'ouverture de la modale
        const file = this.selected3DFiles[index];
        const url = URL.createObjectURL(file);

        // Initialiser ou mettre à jour la scène Three.js
        setTimeout(() => {
            this.display3dService.initThree([this.threeContainer]);
            this.display3dService.chargerModele(url, 0);
        }, 300);
    }

    close3DModal(): void {
        this.show3DModal = false;
        this.display3dService.nettoyerScene(0); // Nettoyer la scène Three.js après la fermeture
    }

    ajusterVitesseRotation(event: any): void {
        const speed = parseFloat(event.target.value);
        this.display3dService.ajusterVitesseRotation(speed);
    }

    zoomAvant(): void {
        this.display3dService.zoomAvant(0);
    }

    zoomArriere(): void {
        this.display3dService.zoomArriere(0);
    }

    reinitialiserVue(): void {
        this.display3dService.reinitialiserVue(0);
    }

    deplacerHaut(): void {
        this.display3dService.deplacerHaut(0);
    }

    deplacerBas(): void {
        this.display3dService.deplacerBas(0);
    }

    deplacerGauche(): void {
        this.display3dService.deplacerGauche(0);
    }

    deplacerDroite(): void {
        this.display3dService.deplacerDroite(0);
    }

    onSubmit(): void {
        console.log(this.projetForm.value);
        console.log(this.selectedImages);
        console.log(this.selected3DFiles);
        if (this.projetForm.valid) {
            const projetData = this.projetForm.value;
            projetData.utilisateurId = this.utilisateurId;

            // Créer le projet avec les images
            this.projetService.createProjet(projetData, this.selectedImages).subscribe({
                next: (data) => {
                    console.log('Projet créé avec succès');
                    // Appeler le service pour créer les fichiers 3D après la création du projet
                    this.create3DFilesForProject(data.projet.id); // Assurez-vous que l'ID du projet est renvoyé dans la réponse
                    this.router.navigate(['/home']);
                },
                error: (err) => console.error('Erreur lors de la création du projet :', err)
            });
        }
    }

    create3DFilesForProject(projetId: number): void {
        if (this.selected3DFiles.length > 0) {
            this.modele3DService.createModeles3D(projetId, this.selected3DFiles).subscribe({
                next: (modeles3D) => {
                    console.log('Fichiers 3D ajoutés avec succès', modeles3D);
                },
                error: (err) => console.error('Erreur lors de l\'ajout des fichiers 3D :', err)
            });
        }
    }
}
