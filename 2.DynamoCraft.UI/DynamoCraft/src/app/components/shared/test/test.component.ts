import { Component } from '@angular/core';
import { Statistique } from '../../../models/statistique.model';
import { StatistiqueService } from '../../../tools/services/api/statistique.service';
import { Utilisateur } from '../../../models/utilisateur.model';
import { UtilisateurService } from '../../../tools/services/api/utilisateur.service';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss']
})
export class TestComponent {
    utilisateurs: Utilisateur[] = [];
    utilisateur: Utilisateur | null = null;
    message: string = '';
    selectedFile: File | null = null;

    constructor(private utilisateurService: UtilisateurService) { }

    ngOnInit(): void {
        this.getAllUtilisateurs();
    }

    getAllUtilisateurs(): void {
        this.utilisateurService.getAllUtilisateurs().subscribe(
            (data) => this.utilisateurs = data,
            (error) => this.message = 'Erreur lors de la récupération des utilisateurs'
        );
    }

    getUtilisateurById(id: number): void {
        this.utilisateurService.getUtilisateurById(id).subscribe(
            (data) => {
                data.dateNaissance = new Date(data.dateNaissance);
                this.utilisateur = data;
            },
            (error) => this.message = 'Erreur lors de la récupération de l\'utilisateur'
        );
    }

    onFileSelected(event: any): void {
        this.selectedFile = event.target.files[0];
    }

    updateUtilisateur(id: number, utilisateur: Utilisateur): void {
        if (!utilisateur) {
            this.message = 'Utilisateur non trouvé';
            return;
        }

        const formData = new FormData();
        formData.append('pseudo', utilisateur.pseudo ?? '');
        formData.append('email', utilisateur.email ?? '');
        formData.append('dateNaissance', utilisateur.dateNaissance ? utilisateur.dateNaissance.toISOString() : '');
        formData.append('biographie', utilisateur.biographie ?? '');
        formData.append('password', utilisateur.password ?? '');
        formData.append('centreInterets', utilisateur.centreInterets ?? '');
        formData.append('statutCompte', utilisateur.statutCompte?.toString() ?? '');
        formData.append('roleId', utilisateur.roleId?.toString() ?? '');

        if (this.selectedFile) {
            formData.append('image', this.selectedFile);
        }

        this.utilisateurService.updateUtilisateur(id, formData).subscribe(
            () => this.message = `Utilisateur ${id} mis à jour avec succès !`,
            (error) => this.message = 'Erreur lors de la mise à jour de l\'utilisateur'
        );
    }

    deleteUtilisateur(id: number): void {
        this.utilisateurService.deleteUtilisateur(id).subscribe(
            () => {
                this.message = `Utilisateur ${id} supprimé avec succès !`;
                this.getAllUtilisateurs(); // Mettre à jour la liste des utilisateurs après suppression
            },
            (error) => this.message = 'Erreur lors de la suppression de l\'utilisateur'
        );
    }
}