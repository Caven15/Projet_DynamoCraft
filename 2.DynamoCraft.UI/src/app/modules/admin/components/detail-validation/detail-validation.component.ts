import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Projet } from '../../../../models/projet.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjetService } from '../../../../tools/services/api/projet.service';
import { environment } from '../../../../../environments/environment.dev';
import { Modele3D } from '../../../../models/modele-3d.model';
import { Display3dService } from '../../../../tools/services/other/display-3d.service';
import { Modele3dService } from '../../../../tools/services/api/modele-3d.service';

@Component({
    selector: 'app-detail-validation',
    templateUrl: './detail-validation.component.html',
    styleUrls: ['./detail-validation.component.scss']
})
export class DetailValidationComponent implements OnInit {
    @ViewChild('threeContainer', { static: false }) threeContainer!: ElementRef;

    projet!: Projet;
    url: string = `${environment.apiUrl}/uploads/`;

    activeIndex: number = 0;
    active3DModelIndex: number = 0;
    selected3DFiles: Modele3D[] = [];
    showEnlargeIcon: boolean = false;

    isImageValid: boolean | null = null;
    isModel3DValid: boolean | null = null;
    isDescriptionValid: boolean | null = null;

    finalDecision: number = 3; // 1: Valide, 2: Invalide, 3: En attente
    commentaireValidation: string = '';
    validatedCount: number = 0;  // Ajout de la propriété validatedCount

    constructor(
        private projetService: ProjetService,
        private display3dService: Display3dService,
        private modele3dService: Modele3dService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        const projetId = this.route.snapshot.params['id'];
        this.loadProjet(projetId);
        this.loadModeles3D(projetId);
    }

    loadProjet(id: number): void {
        this.projetService.getProjetById(id).subscribe(projet => {
            this.projet = projet;
            this.projet.imageProjet = this.projet.imageProjet || [];
            this.updateFinalDecision(); // Mettre à jour la décision finale en fonction des validations
        });
    }

    loadModeles3D(projetId: number): void {
        this.modele3dService.getModeles3DByProjetId(projetId).subscribe(modeles3D => {
            this.selected3DFiles = modeles3D;

            if (this.selected3DFiles.length > 0) {
                this.setActive3DModel(0);
                this.load3DModelInContainer(0);
            }
        });
    }

    setActiveImage(index: number): void {
        this.activeIndex = index;
    }

    setActive3DModel(index: number): void {
        this.active3DModelIndex = index;
    }

    load3DModelInContainer(index: number): void {
        const url = `${this.url}${this.selected3DFiles[index].nom}`;
        setTimeout(() => {
            this.display3dService.initThree([this.threeContainer]);
            this.display3dService.chargerModele(url, 0);
        }, 300);
    }

    navigateImages(direction: number): void {
        const newIndex = this.activeIndex + direction;
        if (newIndex >= 0 && newIndex < this.projet.imageProjet!.length) {
            this.setActiveImage(newIndex);
        }
    }

    navigate3DModel(direction: number): void {
        const newIndex = this.active3DModelIndex + direction;
        if (newIndex >= 0 && newIndex < this.selected3DFiles.length) {
            this.setActive3DModel(newIndex);
            this.load3DModelInContainer(newIndex);
        }
    }

    toggleValidation(section: string, isValid: boolean): void {
        switch (section) {
            case 'image':
                this.isImageValid = isValid;
                break;
            case 'model3D':
                this.isModel3DValid = isValid;
                break;
            case 'description':
                this.isDescriptionValid = isValid;
                break;
            default:
                break;
        }
        this.updateFinalDecision();
    }

    updateFinalDecision(): void {
        let validCount = 0;
        if (this.isImageValid !== null) validCount++;
        if (this.isModel3DValid !== null) validCount++;
        if (this.isDescriptionValid !== null) validCount++;

        this.validatedCount = validCount;

        if (this.isImageValid === false || this.isModel3DValid === false || this.isDescriptionValid === false) {
            this.finalDecision = 2; // Invalide
        } else if (validCount === 3 && this.isImageValid && this.isModel3DValid && this.isDescriptionValid) {
            this.finalDecision = 1; // Valide
        } else {
            this.finalDecision = 3; // En attente
        }
    }

    getStatutText(): string {
        switch (this.finalDecision) {
            case 1:
                return 'Valide';
            case 2:
                return 'Invalide';
            case 3:
            default:
                return 'En attente';
        }
    }

    getValidationClass(isValid: boolean | null): string {
        if (isValid === true) {
            return 'border-success text-success';
        } else if (isValid === false) {
            return 'border-danger text-danger';
        } else {
            return 'bg-dc';
        }
    }

    canFinalize(): boolean {
        return this.commentaireValidation.trim().length > 0;
    }

    submitFinalDecision(): void {
        if (this.canFinalize()) {
            console.log('Décision finale soumise:', this.finalDecision);
            this.router.navigate(['/projet/validation-summary']);
        }
    }
}
