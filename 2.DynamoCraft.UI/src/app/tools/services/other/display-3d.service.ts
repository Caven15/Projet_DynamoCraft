import { Injectable, NgZone, ElementRef, HostListener } from '@angular/core';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

@Injectable({
    providedIn: 'root'
})
export class Display3dService {
    private rendus: THREE.WebGLRenderer[] = [];
    private scenes: THREE.Scene[] = [];
    private cameras: THREE.PerspectiveCamera[] = [];
    private modeles: (THREE.Mesh | undefined)[] = [];
    private vitesseRotation: number = 0.001; // Vitesse de rotation par défaut

    // Constantes pour les paramètres de la scène
    private readonly POSITION_CAMERA = { x: 0, y: 0, z: 70 };
    private readonly POSITION_LUMIERE_DIRECTIONNELLE = { x: 5, y: 10, z: 7.5 };
    private readonly INTENSITE_LUMIERE_DIRECTIONNELLE = 1;
    private readonly INTENSITE_LUMIERE_AMBIANTE = 0x404040;
    private readonly ROTATION_MODELE = { x: Math.PI / 1.6, y: 97.4 };
    private readonly ZOOM_DELTA = 10;
    private readonly DEPLACEMENT_DELTA = 8;
    private readonly DEPLACEMENT_SOURIS = 0.8;

    private isDragging = false;
    private previousMousePosition = { x: 0, y: 0 };

    constructor(private ngZone: NgZone) {
        window.addEventListener('resize', () => this.onWindowResize());
    }

    initThree(conteneurs: ElementRef[]): void {
        conteneurs.forEach((conteneur, index) => {
            console.log(`Initialisation de ThreeJS pour le conteneur index: ${index}`);
            const rendu = new THREE.WebGLRenderer({ antialias: true });
            rendu.setSize(conteneur.nativeElement.clientWidth, conteneur.nativeElement.clientHeight);
            rendu.shadowMap.enabled = true;
            conteneur.nativeElement.innerHTML = ''; // Nettoyer le conteneur avant d'ajouter un nouveau canevas
            conteneur.nativeElement.appendChild(rendu.domElement);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, conteneur.nativeElement.clientWidth / conteneur.nativeElement.clientHeight, 0.1, 1000);
            camera.position.set(this.POSITION_CAMERA.x, this.POSITION_CAMERA.y, this.POSITION_CAMERA.z);

            const lumiereDirectionnelle = new THREE.DirectionalLight(0xffffff, this.INTENSITE_LUMIERE_DIRECTIONNELLE);
            lumiereDirectionnelle.position.set(this.POSITION_LUMIERE_DIRECTIONNELLE.x, this.POSITION_LUMIERE_DIRECTIONNELLE.y, this.POSITION_LUMIERE_DIRECTIONNELLE.z);
            lumiereDirectionnelle.castShadow = true;
            scene.add(lumiereDirectionnelle);

            const lumiereAmbiante = new THREE.AmbientLight(this.INTENSITE_LUMIERE_AMBIANTE);
            scene.add(lumiereAmbiante);

            this.rendus[index] = rendu;
            this.scenes[index] = scene;
            this.cameras[index] = camera;

            this.addMouseControls(conteneur.nativeElement, index);

            // Exécuter l'animation en dehors de la zone Angular
            this.ngZone.runOutsideAngular(() => this.animer(index));
        });
    }

    chargerModele(url: string, index: number): Promise<void> {
        console.log(`Chargement du modèle: ${url} pour l'index: ${index}`);
        this.nettoyerScene(index);

        return new Promise((resolve, reject) => {
            const chargeur = new STLLoader();
            chargeur.load(url, (geometrie) => {
                const materiau = new THREE.MeshStandardMaterial({ color: 0xFFD700, flatShading: true });
                const modele = new THREE.Mesh(geometrie, materiau);
                modele.castShadow = true;
                modele.receiveShadow = true;
                modele.position.set(0, 0, 0);
                modele.geometry.center();

                modele.rotation.x = this.ROTATION_MODELE.x;
                modele.rotation.y = this.ROTATION_MODELE.y;

                console.log('Ajout du modèle à la scène', modele);
                this.modeles[index] = modele;
                this.scenes[index].add(this.modeles[index]!);
                this.cameras[index].position.z = this.POSITION_CAMERA.z;

                console.log(`Modèle chargé et ajouté à la scène pour l'index: ${index}`);
                resolve();
            }, undefined, (error) => {
                console.error(`Erreur lors du chargement du modèle 3D à partir de l'URL: ${url}`, error);
                reject(error);
            });
        });
    }

    nettoyerScene(index: number): void {
        if (this.modeles[index]) {
            console.log(`Nettoyage de la scène pour l'index: ${index}`);
            this.scenes[index].remove(this.modeles[index]!);
            (this.modeles[index] as THREE.Mesh).geometry.dispose();

            const materiau = (this.modeles[index] as THREE.Mesh).material;
            if (Array.isArray(materiau)) {
                materiau.forEach((material) => material.dispose());
            } else {
                materiau.dispose();
            }

            this.modeles[index] = undefined;
        }
    }

    animer(index: number): void {
        requestAnimationFrame(() => this.animer(index));
        if (this.modeles[index]) {
            this.modeles[index]!.rotation.z += this.vitesseRotation;
        }
        this.rendus[index].render(this.scenes[index], this.cameras[index]);
    }

    ajusterVitesseRotation(vitesse: number): void {
        this.vitesseRotation = vitesse;
    }

    zoomAvant(index: number): void {
        this.cameras[index].position.z -= this.ZOOM_DELTA;
    }

    zoomArriere(index: number): void {
        this.cameras[index].position.z += this.ZOOM_DELTA;
    }

    reinitialiserVue(index: number): void {
        this.cameras[index].position.set(this.POSITION_CAMERA.x, this.POSITION_CAMERA.y, this.POSITION_CAMERA.z);
    }

    deplacerHaut(index: number): void {
        if (this.modeles[index]) {
            this.modeles[index]!.position.y += this.DEPLACEMENT_DELTA;
        }
    }

    deplacerBas(index: number): void {
        if (this.modeles[index]) {
            this.modeles[index]!.position.y -= this.DEPLACEMENT_DELTA;
        }
    }

    deplacerGauche(index: number): void {
        if (this.modeles[index]) {
            this.modeles[index]!.position.x -= this.DEPLACEMENT_DELTA;
        }
    }

    deplacerDroite(index: number): void {
        if (this.modeles[index]) {
            this.modeles[index]!.position.x += this.DEPLACEMENT_DELTA;
        }
    }

    addMouseControls(element: HTMLElement, index: number): void {
        element.addEventListener('mousedown', (event) => {
            this.isDragging = true;
            this.previousMousePosition = { x: event.clientX, y: event.clientY };
        });

        element.addEventListener('mousemove', (event) => {
            if (this.isDragging && this.modeles[index]) {
                const deltaX = event.clientX - this.previousMousePosition.x;
                const deltaY = event.clientY - this.previousMousePosition.y;

                this.modeles[index]!.position.x += deltaX * this.DEPLACEMENT_SOURIS;
                this.modeles[index]!.position.y -= deltaY * this.DEPLACEMENT_SOURIS;

                this.previousMousePosition = { x: event.clientX, y: event.clientY };
            }
        });

        element.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        element.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });
    }

    onWindowResize(): void {
        this.rendus.forEach((rendu, index) => {
            const container = rendu.domElement.parentElement;
            if (container) {
                const width = container.clientWidth;
                const height = container.clientHeight;

                rendu.setSize(width, height);
                this.cameras[index].aspect = width / height;
                this.cameras[index].updateProjectionMatrix();
            }
        });
    }
}
