import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ProjetService } from '../../../../tools/services/api/projet.service';
import { CategorieService } from '../../../../tools/services/api/categorie.service';
import { Router } from '@angular/router';
import { Categorie } from '../../../../models/categorie.model';
import { Display3dService } from '../../../../tools/services/other/display-3d.service';
import { Modele3dService } from '../../../../tools/services/api/modele-3d.service';
import { imgType } from '../../../../tools/validators/imgType.validator';
import { valid3DFileType } from '../../../../tools/validators/valid3DFileType.validator';
import { imageSize } from '../../../../tools/validators/imageSize.validator';
import { validImageType } from '../../../../tools/validators/validImageType.validator';
import { file3DSize } from '../../../../tools/validators/valid3DSize.validator';

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
    max3DFileSize: number = 50 * 1024 * 1024; // 50 MB
    errorMessage: string = '';
    threeDErrorMessage: string = '';

    @ViewChild('imageInput') imageInput!: ElementRef;
    @ViewChild('threeContainer') threeContainer!: ElementRef;

    constructor(
        private fb: FormBuilder,
        private projetService: ProjetService,
        private modele3DService: Modele3dService,
        private categorieService: CategorieService,
        private router: Router,
        private display3dService: Display3dService
    ) {
        this.projetForm = this.fb.group({
            nom: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
            description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]],
            categorieId: ['', Validators.required],
            images: this.fb.array([], [Validators.required]),
            modeles3D: this.fb.array([], [Validators.required])
        });

    }

    ngOnInit(): void {
        this.categorieService.getAllCategorie().subscribe(categories => {
            this.categories = categories;
        });
    }

    get images(): FormArray {
        return this.projetForm.get('images') as FormArray;
    }

    get modeles3D(): FormArray {
        return this.projetForm.get('modeles3D') as FormArray;
    }

    onImageSelected(event: any): void {
        const files = Array.from(event.target.files) as File[];
        files.forEach(file => {
            const control = new FormControl(file, {
                validators: [imageSize(10)],
                asyncValidators: [validImageType()],
                updateOn: 'change'
            });

            // Observer les changements de statut
            control.statusChanges.subscribe(status => {
                if (status === 'VALID') {
                    this.errorMessage = '';
                    this.images.push(control);
                    this.selectedImages.push(file);

                    // Générer un aperçu
                    const reader = new FileReader();
                    reader.onload = (e: any) => this.imagePreviewUrls.push(e.target.result);
                    reader.readAsDataURL(file);
                } else if (status === 'INVALID') {
                    const errors = control.errors;
                    if (errors?.['fileSizeExceeded']) {
                        this.errorMessage = `L'image ${file.name} dépasse la taille autorisée de 10MB.`;
                    } else if (errors?.['invalidImageType']) {
                        this.errorMessage = `L'image ${file.name} est d'un type non supporté.`;
                    }
                }
            });

            control.updateValueAndValidity();
        });
    }




    on3DFileSelected(event: any): void {
        const files = Array.from(event.target.files) as File[];
        files.forEach(file => {
            // Créez un FormControl avec les validateurs de taille et de type de fichier 3D
            const control = new FormControl(file, {
                validators: [file3DSize(50), valid3DFileType()], // Taille maximale de 50MB et vérification de l'extension STL
                updateOn: 'change'
            });

            // Observer les changements de statut
            control.statusChanges.subscribe(status => {
                if (status === 'VALID') {
                    this.threeDErrorMessage = '';
                    // Ajouter le fichier validé au tableau
                    this.modeles3D.push(control);
                    this.selected3DFiles.push(file);
                } else if (status === 'INVALID') {
                    const errors = control.errors;
                    if (errors?.['fileSizeExceeded']) {
                        this.threeDErrorMessage = `Le fichier ${file.name} dépasse la taille autorisée de 50 MB.`;
                    } else if (errors?.['invalidFileType']) {
                        this.threeDErrorMessage = `Le fichier ${file.name} n'est pas un fichier STL valide.`;
                    }
                }
            });

            control.updateValueAndValidity(); // Forcer la validation
        });
    }


    removeImage(index: number): void {
        this.images.removeAt(index);
        this.selectedImages.splice(index, 1);
        this.imagePreviewUrls.splice(index, 1);
        this.closeModal();
    }

    remove3DFile(index: number): void {
        this.modeles3D.removeAt(index);
        this.selected3DFiles.splice(index, 1);
        this.close3DModal();
    }

    openImageModal(index: number): void {
        this.modalImageIndex = index;
        this.showModal = true;
    }

    closeModal(): void {
        this.showModal = false;
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
                    this.create3DFilesForProject(data.projet.id);
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
