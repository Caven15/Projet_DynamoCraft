import { Component, ElementRef, OnInit, AfterViewInit, QueryList, ViewChildren, ViewChild, Inject, PLATFORM_ID, NgZone, ApplicationRef } from '@angular/core';
import { Modele3dService } from '../../../tools/services/api/modele-3d.service';
import { Modele3D } from '../../../models/modele-3d.model';
import { isPlatformBrowser } from '@angular/common';
import { Display3dService } from '../../../tools/services/other/display-3d.service';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit, AfterViewInit {
    @ViewChildren('rendererContainer') rendererContainers!: QueryList<ElementRef>;
    @ViewChild('fileInput') fileInput!: ElementRef;

    modeles3D: Modele3D[] = [];
    selectedFiles: File[] = [];
    projetId: number = 1;
    vitesseRotation: number = 0.001;
    indexActuel: number = 0;

    private rendererInitialized = false;
    private isLoadingModel = false;  // Drapeau pour éviter les appels multiples

    constructor(
        private modele3DService: Modele3dService,
        private display3dService: Display3dService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private ngZone: NgZone,
        private applicationRef: ApplicationRef
    ) {}

    ngOnInit(): void {
        this.getModeles3D();
    }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.rendererContainers.changes.subscribe(() => {
                if (this.rendererContainers.length > 0 && !this.rendererInitialized) {
                    console.log('Appel de initThree et chargerModeleActuel dans ngAfterViewInit');
                    this.ngZone.runOutsideAngular(() => {
                        this.display3dService.initThree(this.rendererContainers.toArray());
                        this.rendererInitialized = true;
                        this.chargerModeleActuel();
                    });
                }
            });
        }
    }

    getModeles3D(): void {
        this.modele3DService.getModeles3DByProjetId(this.projetId).subscribe(
            (data: Modele3D[]) => {
                this.modeles3D = data;
                this.verifierIndexActuel();
                if (isPlatformBrowser(this.platformId)) {
                    this.ngZone.runOutsideAngular(() => {
                        setTimeout(() => {
                            if (this.rendererContainers.length > 0) {
                                this.display3dService.initThree(this.rendererContainers.toArray());
                                this.chargerModeleActuel();
                            }
                        }, 50);
                    });
                }
            },
            (error) => {
                console.error('Erreur lors de la récupération des modèles 3D', error);
            }
        );
    }

    chargerModeleActuel(): void {
        if (this.isLoadingModel) return;

        this.isLoadingModel = true;
        if (this.modeles3D.length > 0 && this.indexActuel >= 0 && this.indexActuel < this.modeles3D.length) {
            const url = `http://localhost:3000/uploads/${this.modeles3D[this.indexActuel].nom}`;
            console.log(`Chargement du modèle actuel à l'index: ${this.indexActuel} avec l'URL: ${url}`);
            this.display3dService.chargerModele(url, 0).finally(() => {
                this.isLoadingModel = false;
            });
        } else {
            console.log('Aucun modèle à charger, scène vide');
            this.display3dService.nettoyerScene(0);
            this.isLoadingModel = false;
        }
    }

    verifierIndexActuel(): void {
        if (this.indexActuel >= this.modeles3D.length) {
            this.indexActuel = this.modeles3D.length - 1;
        }
        if (this.indexActuel < 0) {
            this.indexActuel = 0;
        }
    }

    onFileSelected(event: any): void {
        if (event.target.files && event.target.files.length > 0) {
            this.selectedFiles = Array.from(event.target.files);
        }
    }

    addModeles3D(): void {
        if (this.selectedFiles.length === 0) {
            console.error('Aucun fichier sélectionné');
            return;
        }

        this.modele3DService.createModeles3D(this.projetId, this.selectedFiles).subscribe(
            (response) => {
                console.log('Modèles 3D ajoutés avec succès', response);
                this.getModeles3D();
                this.modeleSuivant();
                this.resetFileInput();
            },
            (error) => {
                console.error('Erreur lors de l\'ajout des modèles 3D', error);
            }
        );

    }

    deleteModele3D(modele3DId: number): void {
        this.modele3DService.deleteModele3D(modele3DId).subscribe(
            (response) => {
                console.log('Modèle 3D supprimé avec succès', response);
                this.indexActuel = Math.max(0, this.indexActuel - 1);
                this.getModeles3D(); // Actualiser la liste des modèles 3D après suppression
                this.modeles3D = this.modeles3D.filter(element => element.id !== modele3DId);
                if (this.modeles3D.length < 1) this.display3dService.nettoyerScene(0);
                this.chargerModeleActuel(); // Charger le modèle après suppression
            },
            (error) => {
                console.error('Erreur lors de la suppression du modèle 3D', error);
            }
        );
        console.log(this.modeles3D);
    }

    ajusterVitesseRotation(event: any) {
        this.vitesseRotation = parseFloat(event.target.value);
        this.display3dService.ajusterVitesseRotation(this.vitesseRotation);
    }

    zoomAvant() {
        this.display3dService.zoomAvant(0);
    }

    zoomArriere() {
        this.display3dService.zoomArriere(0);
    }

    reinitialiserVue() {
        this.display3dService.reinitialiserVue(0);
    }

    deplacerHaut() {
        this.display3dService.deplacerHaut(0);
    }

    deplacerBas() {
        this.display3dService.deplacerBas(0);
    }

    deplacerGauche() {
        this.display3dService.deplacerGauche(0);
    }

    deplacerDroite() {
        this.display3dService.deplacerDroite(0);
    }

    modelePrecedent() {
        if (this.indexActuel > 0) {
            this.indexActuel--;
            this.chargerModeleActuel();
        }
    }

    modeleSuivant() {
        if (this.indexActuel < this.modeles3D.length - 1) {
            this.indexActuel++;
            this.chargerModeleActuel();
        }
    }

    private resetFileInput(): void {
        this.fileInput.nativeElement.value = '';
    }
}
