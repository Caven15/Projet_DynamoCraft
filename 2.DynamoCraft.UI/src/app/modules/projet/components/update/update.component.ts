import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjetService } from '../../../../tools/services/api/projet.service';
import { CategorieService } from '../../../../tools/services/api/categorie.service';
import { Display3dService } from '../../../../tools/services/other/display-3d.service';
import { Modele3dService } from '../../../../tools/services/api/modele-3d.service';
import { ImageProjetService } from '../../../../tools/services/api/image-projet.service';
import { Projet } from '../../../../models/projet.model';
import { Modele3D } from '../../../../models/modele-3d.model';
import { Categorie } from '../../../../models/categorie.model';
import { ImageProjet } from '../../../../models/imageProjet.model';
import { environment } from '../../../../../environments/environment.dev';

@Component({
    selector: 'app-update',
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
    projetForm: FormGroup;
    projetId: number;
    categories: Categorie[] = [];
    selectedImages: (File | ImageProjet)[] = [];
    imagePreviewUrls: string[] = [];
    selected3DFiles: (File | Modele3D)[] = [];
    imagesToDelete: number[] = [];
    modelesToDelete: number[] = [];
    showModal: boolean = false;
    show3DModal: boolean = false;
    modalImageIndex: number = 0;
    modal3DIndex: number = 0;
    maxImages: number = 8;
    maxSize: number = 20 * 1024 * 1024; // 20 MB
    errorMessage: string = '';
    url: string = `${environment.apiUrl}/uploads/`;

    @ViewChild('threeContainer') threeContainer!: ElementRef;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private projetService: ProjetService,
        private categorieService: CategorieService,
        private modele3DService: Modele3dService,
        private imageService: ImageProjetService,
        private router: Router,
        private display3dService: Display3dService
    ) {
        this.projetForm = this.fb.group({
            nom: ['', Validators.required],
            description: ['', Validators.required],
            categorieId: ['', Validators.required],
        });
        this.projetId = this.route.snapshot.params['id'];
    }

    ngOnInit(): void {
        this.loadCategories();
    }

    loadCategories(): void {
        this.categorieService.getAllCategorie().subscribe(categories => {
            this.categories = categories;
            this.loadProjetData();
        });
    }

    // Récupère le nom du fichier
    getFileName(file: File | ImageProjet | Modele3D): string {
        return (file instanceof File) ? file.name : file.nom;
    }

    loadProjetData(): void {
        this.projetService.getProjetById(this.projetId).subscribe((projet: Projet) => {
            if (projet) {
                this.projetForm.patchValue({
                    nom: projet.nom,
                    description: projet.description,
                    categorieId: projet.categorieId,
                });
            }

            // Charger les images associées au projet
            this.imageService.getImagesByProjetId(this.projetId).subscribe(images => {
                this.selectedImages = images;
                this.imagePreviewUrls = images.map(image => `${this.url}${image.nom}`);
            });

            // Charger les fichiers 3D associés au projet
            this.modele3DService.getModeles3DByProjetId(this.projetId).subscribe(modeles => {
                this.selected3DFiles = modeles;
            });
        });
    }

    // Sélection et validation des images
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
            this.errorMessage = ''; // Réinitialiser le message d'erreur
        }
    }

    // Sélection des fichiers 3D
    on3DFileSelected(event: any): void {
        const files = Array.from(event.target.files) as File[];
        this.selected3DFiles.push(...files);
    }

    // Supprimer une image
    removeImage(index: number): void {
        const image = this.selectedImages[index];
        if (!(image instanceof File)) {
            this.imagesToDelete.push(image.id); // Ajouter l'ID de l'image à la liste des images à supprimer
        }
        this.selectedImages.splice(index, 1);
        this.imagePreviewUrls.splice(index, 1);
    }

    remove3DFile(index: number): void {
        const file = this.selected3DFiles[index];
        if (!(file instanceof File)) {
            this.modelesToDelete.push((file as Modele3D).id);  // Ajouter l'ID du modèle 3D à supprimer
        }
        this.selected3DFiles.splice(index, 1);  // Supprimer du tableau de fichiers sélectionnés
    }

    closeModal(): void {
        this.showModal = false;
    }

    openImageModal(index: number): void {
        this.modalImageIndex = index;
        this.showModal = true;
    }

    // Ouverture de la modale 3D
    open3DModal(index: number): void {
        this.modal3DIndex = index;
        this.show3DModal = true;

        const file = this.selected3DFiles[index];
        const url = file instanceof File ? URL.createObjectURL(file) : `${this.url}${file.nom}`;

        // Affichage de la modale et chargement du modèle 3D
        setTimeout(() => {
            if (this.threeContainer?.nativeElement) {
                this.display3dService.initThree([this.threeContainer]);
                this.display3dService.chargerModele(url, 0);
            }
        }, 300);
    }

    // Fermeture de la modale 3D
    close3DModal(): void {
        this.show3DModal = false;
        this.display3dService.nettoyerScene(0); // Nettoyer la scène Three.js après la fermeture
    }

    // Soumission du formulaire pour mettre à jour le projet, images et fichiers 3D
    onSubmit(): void {
        if (this.projetForm.valid) {
            const updatedProjet = this.projetForm.value;

            this.projetService.updateProjet(this.projetId, updatedProjet).subscribe({
                next: () => {
                    console.log('Projet mis à jour avec succès');

                    // Mettre à jour les images
                    if (this.selectedImages.length > 0 || this.imagesToDelete.length > 0) {
                        console.log('Mise à jour des images...');
                        this.imageService.updateImages(this.projetId, this.selectedImages.filter(image => image instanceof File) as File[], this.imagesToDelete).subscribe({
                            next: (res) => console.log('Images mises à jour avec succès', res),
                            error: err => console.error('Erreur lors de la mise à jour des images', err)
                        });
                    }

                    // Mise à jour des fichiers 3D
                    const new3DFiles = this.selected3DFiles.filter(file => file instanceof File) as File[];
                    console.log('Mise à jour des fichiers 3D...');
                    this.modele3DService.updateModeles3DByProjetId(this.projetId, new3DFiles, this.modelesToDelete).subscribe({
                        next: (res) => console.log('Fichiers 3D mis à jour avec succès', res),
                        error: err => console.error('Erreur lors de la mise à jour des fichiers 3D', err)
                    });

                    // Navigation après mise à jour
                    console.log('Navigation vers la page des projets');
                    this.router.navigate(['/projets']);
                },
                error: err => console.error('Erreur lors de la mise à jour du projet', err)
            });
        }
    }


    // Méthodes de manipulation 3D
    zoomAvant(): void { this.display3dService.zoomAvant(0); }
    zoomArriere(): void { this.display3dService.zoomArriere(0); }
    deplacerHaut(): void { this.display3dService.deplacerHaut(0); }
    deplacerBas(): void { this.display3dService.deplacerBas(0); }
    deplacerGauche(): void { this.display3dService.deplacerGauche(0); }
    deplacerDroite(): void { this.display3dService.deplacerDroite(0); }
    reinitialiserVue(): void { this.display3dService.reinitialiserVue(0); }
}
