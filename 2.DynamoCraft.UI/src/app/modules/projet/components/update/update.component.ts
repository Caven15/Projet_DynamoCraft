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
import { imgType } from '../../../../tools/validators/imgType.validator';
import { environment } from '../../../../../environments/environment.dev';
import { forkJoin } from 'rxjs';

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
    max3DFileSize: number = 50 * 1024 * 1024; // 50 MB
    errorMessage: string = '';
    threeDErrorMessage: string = '';
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
            nom: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
            description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]],
            categorieId: ['', Validators.required],
        });
        this.projetId = this.route.snapshot.params['id'];
    }

    ngOnInit(): void {
        forkJoin({
            categories: this.categorieService.getAllCategorie(),
            projet: this.projetService.getProjetById(this.projetId)
        }).subscribe(({ categories, projet }) => {
            // Charger les catégories
            this.categories = categories;

            // Charger les données du projet et mettre à jour le formulaire
            if (projet) {
                console.log(projet);
                this.projetForm.patchValue({
                    nom: projet.nom,
                    description: projet.description,
                    categorieId: projet.categorie?.id,  // S'assurer que la catégorie est correctement assignée
                });
            }

            // Charger les images et les fichiers 3D du projet
            this.loadImagesAnd3DModels();
        });
    }

    loadImagesAnd3DModels(): void {
        this.imageService.getImagesByProjetId(this.projetId).subscribe(images => {
            this.selectedImages = images;
            this.imagePreviewUrls = images.map(image => `${this.url}${image.nom}`);
        });

        this.modele3DService.getModeles3DByProjetId(this.projetId).subscribe(modeles => {
            this.selected3DFiles = modeles;
        });
    }

    loadCategories(): void {
        this.categorieService.getAllCategorie().subscribe(categories => {
            console.log(categories);
            this.categories = categories;
            this.loadProjetData();
        });
    }


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

    onImageSelected(event: any): void {
        const files = Array.from(event.target.files) as File[];
        const validFiles: File[] = [];

        if (this.selectedImages.length + files.length > this.maxImages) {
            this.errorMessage = `Vous ne pouvez pas ajouter plus de ${this.maxImages} images.`;
            return;
        }

        files.forEach(file => {
            if (file.size <= this.maxSize && this.validateImageFile(file)) {
                validFiles.push(file);
            } else {
                this.errorMessage = `Le fichier ${file.name} n'est pas un type d'image valide ou dépasse la taille autorisée de 20 MB.`;
            }
        });

        validFiles.forEach(file => {
            this.selectedImages.push(file);
            const reader = new FileReader();
            reader.onload = (e: any) => this.imagePreviewUrls.push(e.target.result);
            reader.readAsDataURL(file);
        });

        if (validFiles.length > 0) {
            this.errorMessage = ''; // Réinitialiser le message d'erreur
        }
    }

    validateImageFile(file: File): boolean {
        const allowedExtensions = ['png', 'jpeg', 'jpg'];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        return allowedExtensions.includes(fileExtension || '');
    }

    on3DFileSelected(event: any): void {
        const files = Array.from(event.target.files) as File[];
        const valid3DFiles: File[] = [];

        files.forEach(file => {
            if (file.size <= this.max3DFileSize && this.validate3DFile(file)) {
                valid3DFiles.push(file);
            } else {
                this.threeDErrorMessage = `Le fichier 3D ${file.name} dépasse 50 MB ou n'est pas au format STL.`;
            }
        });

        valid3DFiles.forEach(file => {
            this.selected3DFiles.push(file);
        });

        if (valid3DFiles.length > 0) {
            this.threeDErrorMessage = ''; // Réinitialiser le message d'erreur si les fichiers sont valides
        }
    }

    validate3DFile(file: File): boolean {
        return file.name.split('.').pop()?.toLowerCase() === 'stl';
    }

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

    open3DModal(index: number): void {
        this.modal3DIndex = index;
        this.show3DModal = true;

        const file = this.selected3DFiles[index];
        const url = file instanceof File ? URL.createObjectURL(file) : `${this.url}${file.nom}`;

        setTimeout(() => {
            if (this.threeContainer?.nativeElement) {
                this.display3dService.initThree([this.threeContainer]);
                this.display3dService.chargerModele(url, 0);
            }
        }, 300);
    }

    close3DModal(): void {
        this.show3DModal = false;
        this.display3dService.nettoyerScene(0); // Nettoyer la scène Three.js après la fermeture
    }

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
                    this.router.navigate(['/projet/detail/', this.projetId]);
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
