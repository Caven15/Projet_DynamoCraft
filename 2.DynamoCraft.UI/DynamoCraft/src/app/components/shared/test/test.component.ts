import { Component } from '@angular/core';
import { ImageUtilisateurService } from '../../../tools/services/api/image-utilisateur.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjetService } from '../../../tools/services/api/projet.service';
import { Projet } from '../../../models/projet.model';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss']
})
export class TestComponent {
    projetForm: FormGroup;
    selectedFiles: File[] = [];

    constructor(private projetService: ProjetService, private fb: FormBuilder) {
        this.projetForm = this.fb.group({
            nom: ['', Validators.required],
            description: ['', Validators.required],
            categorieId: [null, Validators.required],
            utilisateurId: [null, Validators.required]
        });
    }

    ngOnInit(): void {
    }

    testGetAllProjets(): void {
        this.projetService.getAllProjets().subscribe({
            next: (projects) => console.log('Récupération de tous les projets:', projects),
            error: (error) => console.error('Erreur lors de la récupération de tous les projets:', error)
        });
    }

    testGetProjetById(id: number): void {
        this.projetService.getProjetById(id).subscribe({
            next: (project) => console.log(`Récupération du projet id=${id}:`, project),
            error: (error) => console.error(`Erreur lors de la récupération du projet id=${id}:`, error)
        });
    }

    onFileSelected(event: any): void {
        this.selectedFiles = Array.from(event.target.files);
    }

    testCreateProjet(): void {
        if (this.projetForm.invalid) {
            return;
        }

        const newProjet = new Projet(
            this.projetForm.value.nom,
            this.projetForm.value.description,
            false,
            'Commentaire admin',
            3,
            this.projetForm.value.categorieId,
            this.projetForm.value.utilisateurId
        );

        this.projetService.createProjet(newProjet, this.selectedFiles).subscribe({
            next: (response) => console.log('Projet créé avec succès:', response),
            error: (error) => console.error('Erreur lors de la création du projet:', error)
        });
    }

    testUpdateProjet(id: number): void {
        const updatedProjet = new Projet('Projet Mis à Jour', 'Description mise à jour', true, 'Commentaire admin mis à jour', 1, 1, 1, id);
        this.projetService.updateProjet(id, updatedProjet).subscribe({
            next: (response) => console.log(`Projet id=${id} mis à jour:`, response),
            error: (error) => console.error(`Erreur lors de la mise à jour du projet id=${id}:`, error)
        });
    }

    testDeleteProjet(id: number): void {
        this.projetService.deleteProjet(id).subscribe({
            next: (response) => console.log(`Projet id=${id} supprimé:`, response),
            error: (error) => console.error(`Erreur lors de la suppression du projet id=${id}:`, error)
        });
    }

    testGetTop10Liked(): void {
        this.projetService.getTop10Liked().subscribe({
            next: (projects) => console.log('Récupération des 10 projets les plus likés:', projects),
            error: (error) => console.error('Erreur lors de la récupération des 10 projets les plus likés:', error)
        });
    }

    testGetLastProjects(): void {
        this.projetService.getLastProjects().subscribe({
            next: (projects) => console.log('Récupération des derniers projets:', projects),
            error: (error) => console.error('Erreur lors de la récupération des derniers projets:', error)
        });
    }

    testGetProjectsByCategoryId(id: number): void {
        this.projetService.getProjectsByCategoryId(id).subscribe({
            next: (projects) => console.log(`Récupération des projets de la catégorie id=${id}:`, projects),
            error: (error) => console.error(`Erreur lors de la récupération des projets de la catégorie id=${id}:`, error)
        });
    }

    testGetProjectsByUserId(id: number): void {
        this.projetService.getProjectsByUserId(id).subscribe({
            next: (projects) => console.log(`Récupération des projets de l'utilisateur id=${id}:`, projects),
            error: (error) => console.error(`Erreur lors de la récupération des projets de l'utilisateur id=${id}:`, error)
        });
    }

    testIncrementLike(id: number): void {
        this.projetService.incrementLike(id).subscribe({
            next: (response) => console.log(`Nombre de likes incrémenté pour le projet id=${id}:`, response),
            error: (error) => console.error(`Erreur lors de l'incrémentation des likes pour le projet id=${id}:`, error)
        });
    }

    testIncrementDownload(id: number): void {
        this.projetService.incrementDownload(id).subscribe({
            next: (response) => console.log(`Nombre de téléchargements incrémenté pour le projet id=${id}:`, response),
            error: (error) => console.error(`Erreur lors de l'incrémentation des téléchargements pour le projet id=${id}:`, error)
        });
    }

    testSetValidProjet(id: number): void {
        this.projetService.setValidProjet(id).subscribe({
            next: (response) => console.log(`Le projet id=${id} a été mis à jour en "valide":`, response),
            error: (error) => console.error(`Erreur lors de la mise à jour du projet en valide id=${id}:`, error)
        });
    }

    testSetInvalidProjet(id: number): void {
        this.projetService.setInvalidProjet(id).subscribe({
            next: (response) => console.log(`Le projet id=${id} a été mis à jour en "invalide":`, response),
            error: (error) => console.error(`Erreur lors de la mise à jour du projet en invalide id=${id}:`, error)
        });
    }

    testSetPendingProjet(id: number): void {
        this.projetService.setPendingProjet(id).subscribe({
            next: (response) => console.log(`Le projet id=${id} a été mis à jour en "en attente":`, response),
            error: (error) => console.error(`Erreur lors de la mise à jour du projet en attente id=${id}:`, error)
        });
    }

    testGetValidProjet(): void {
        this.projetService.getValidProjet().subscribe({
            next: (projects) => console.log('Récupération des projets valides:', projects),
            error: (error) => console.error('Erreur lors de la récupération des projets valides:', error)
        });
    }

    testGetInvalidProjet(): void {
        this.projetService.getInvalidProjet().subscribe({
            next: (projects) => console.log('Récupération des projets invalides:', projects),
            error: (error) => console.error('Erreur lors de la récupération des projets invalides:', error)
        });
    }

    testGetPendingProjet(): void {
        this.projetService.getPendingProjet().subscribe({
            next: (projects) => console.log('Récupération des projets en attente:', projects),
            error: (error) => console.error('Erreur lors de la récupération des projets en attente:', error)
        });
    }

    testSearchProjects(keyword: string, page: number, limit: number): void {
        this.projetService.searchProjects(keyword, page, limit).subscribe({
            next: (results) => console.log(`Recherche des projets avec le mot-clé ${keyword}:`, results),
            error: (error) => console.error(`Erreur lors de la recherche des projets avec le mot-clé ${keyword}:`, error)
        });
    }
}