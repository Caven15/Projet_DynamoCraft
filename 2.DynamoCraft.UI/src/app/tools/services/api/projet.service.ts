import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Projet } from '../../../models/projet.model';

@Injectable({
    providedIn: 'root'
})
export class ProjetService extends BaseApiService {

    constructor(protected override httpClient: HttpClient) {
        super(httpClient);
    }

    /**
     * Récupérer tous les projets
     * @returns Observable contenant la liste des projets
     */
    getAllProjets(): Observable<Projet[]> {
        return this.getAll<Projet>('projets').pipe(
            tap({
                next: () => console.log('Récupération de tous les projets'),
                error: (error) => console.error('Erreur lors de la récupération de tous les projets :', error)
            }),
            catchError(this.handleError<Projet[]>('getAllProjets'))
        );
    }

    /**
     * Récupérer un projet par ID
     * @param id Identifiant du projet
     * @returns Observable contenant le projet
     */
    getProjetById(id: number): Observable<Projet> {
        return this.get<Projet>(`projet/${id}`).pipe(
            tap({
                next: () => console.log(`Récupération du projet id=${id}`),
                error: (error) => console.error(`Erreur lors de la récupération du projet id=${id} :`, error)
            }),
            catchError(this.handleError<Projet>('getProjetById'))
        );
    }

    /**
     * Créer un nouveau projet
     * @param projet Objet contenant les informations du projet
     * @param images Liste des fichiers d'image
     * @returns Observable indiquant le résultat de l'opération
     */
    createProjet(projet: Projet, images: File[]): Observable<any> {
        const formData = new FormData();
        formData.append('nom', projet.nom);
        formData.append('description', projet.description);
        formData.append('categorieId', projet.categorieId.toString());
        formData.append('utilisateurId', projet.utilisateurId.toString());

        images.forEach(image => formData.append('images', image, image.name));

        return this.post<any>('projet', formData).pipe(
            tap({
                next: () => console.log(`Projet créé avec succès`),
                error: (error) => console.error('Erreur lors de la création du projet :', error)
            }),
            catchError(this.handleError<any>('createProjet'))
        );
    }

    /**
     * Mettre à jour un projet par ID
     * @param id Identifiant du projet
     * @param projet Objet contenant les nouvelles informations du projet
     * @returns Observable indiquant le résultat de l'opération
     */
    updateProjet(id: number, projet: Projet): Observable<any> {
        return this.put<any>(`projet/${id}`, projet).pipe(
            tap({
                next: () => console.log(`Projet id=${id} mis à jour`),
                error: (error) => console.error(`Erreur lors de la mise à jour du projet id=${id} :`, error)
            }),
            catchError(this.handleError<any>('updateProjet'))
        );
    }

    /**
     * Supprimer un projet par ID
     * @param id Identifiant du projet
     * @returns Observable indiquant le résultat de l'opération
     */
    deleteProjet(id: number): Observable<any> {
        return this.delete<any>(`projet/${id}`).pipe(
            tap({
                next: () => console.log(`Projet id=${id} supprimé`),
                error: (error) => console.error(`Erreur lors de la suppression du projet id=${id} :`, error)
            }),
            catchError(this.handleError<any>('deleteProjet'))
        );
    }

    /**
     * Récupérer les 10 projets les plus likés
     * @returns Observable contenant la liste des 10 projets les plus likés
     */
    getTop10Liked(): Observable<Projet[]> {
        return this.get<Projet[]>('projet/top').pipe(
            map(projects => {
                console.log("Service - Projets récupérés:", projects[0].Utilisateur);
                console.log("Service - Projets récupérés:", projects[0].Utilisateur.ImageUtilisateur?.nom);

                return projects.map(projet => {
                    // Vérifier si `ImageProjet` est un tableau, sinon le transformer en tableau
                    if (projet.ImageProjet && !Array.isArray(projet.ImageProjet)) {
                        projet.ImageProjet = [projet.ImageProjet];
                    }

                    // Ne conserver qu'une seule image par projet (la première)
                    if (projet.ImageProjet && projet.ImageProjet.length > 0) {
                        projet.ImageProjet = [projet.ImageProjet[0]];
                    }

                    // Gérer l'image utilisateur
                    if (projet.Utilisateur) {
                        console.log(`Utilisateur trouvé : ${projet.Utilisateur.pseudo}`);

                        // Vérification pour accéder à l'image utilisateur avec la bonne propriété
                        const imageUtilisateur = projet.Utilisateur.ImageUtilisateur;

                        // Assurez-vous que `ImageUtilisateur` est un objet et a une propriété `nom`
                        if (imageUtilisateur && imageUtilisateur.nom) {
                            console.log("Nom de l'image utilisateur :", imageUtilisateur.nom);
                        } else {
                            console.log("Aucune image utilisateur trouvée.");
                        }
                    }

                    return projet;
                });
            }),
            tap({
                next: () => console.log('Récupération des 10 projets les plus likés terminée'),
                error: (error) => console.error('Erreur lors de la récupération des 10 projets les plus likés :', error)
            }),
            catchError(this.handleError<Projet[]>('getTop10Liked'))
        );
}


getLastProjects(): Observable < Projet[] > {
    return this.get<{ recentProjects: Projet[] }>('projet/last').pipe(
        map(response => {
            // Supprimer les doublons par identifiant
            const uniqueProjects = response.recentProjects.filter((projet, index, self) =>
                index === self.findIndex((t) => (
                    t.id === projet.id
                ))
            );

            return uniqueProjects.map(projet => {
                // Ne conserver qu'une seule image par projet
                if (projet.ImageProjet && !Array.isArray(projet.ImageProjet)) {
                    projet.ImageProjet = [projet.ImageProjet];
                }
                if (projet.ImageProjet && projet.ImageProjet.length > 0) {
                    projet.ImageProjet = [projet.ImageProjet[0]];
                }
                return projet;
            });
        }),
        tap({
            next: () => console.log('Récupération des derniers projets'),
            error: (error) => console.error('Erreur lors de la récupération des derniers projets :', error)
        })
    );
}

/**
 * Récupérer les projets par catégorie ID
 * @param id Identifiant de la catégorie
 * @returns Observable contenant la liste des projets
 */
getProjectsByCategoryId(id: number): Observable < Projet[] > {
    return this.getAll<Projet>(`projet/${id}/categorie`).pipe(
        tap({
            next: () => console.log(`Récupération des projets de la catégorie id=${id}`),
            error: (error) => console.error(`Erreur lors de la récupération des projets de la catégorie id=${id} :`, error)
        }),
        catchError(this.handleError<Projet[]>('getProjectsByCategoryId'))
    );
}

/**
 * Récupérer les projets par utilisateur ID
 * @param id Identifiant de l'utilisateur
 * @returns Observable contenant la liste des projets
 */
getProjectsByUserId(id: number): Observable < Projet[] > {
    return this.getAll<Projet>(`projet/${id}/utilisateur`).pipe(
        tap({
            next: () => console.log(`Récupération des projets de l'utilisateur id=${id}`),
            error: (error) => console.error(`Erreur lors de la récupération des projets de l'utilisateur id=${id} :`, error)
        }),
        catchError(this.handleError<Projet[]>('getProjectsByUserId'))
    );
}

/**
 * Incrémenter le nombre de likes pour un projet spécifique
 * @param id Identifiant du projet
 * @returns Observable indiquant le résultat de l'opération
 */
incrementLike(id: number): Observable < any > {
    return this.put<any>(`projet/${id}/incrementLike`, {}).pipe(
        tap({
            next: () => console.log(`Nombre de likes incrémenté pour le projet id=${id}`),
            error: (error) => console.error(`Erreur lors de l'incrémentation des likes pour le projet id=${id} :`, error)
        }),
        catchError(this.handleError<any>('incrementLike'))
    );
}

/**
 * Incrémenter le nombre de téléchargements pour un projet spécifique
 * @param id Identifiant du projet
 * @returns Observable indiquant le résultat de l'opération
 */
incrementDownload(id: number): Observable < any > {
    return this.put<any>(`projet/${id}/incrementDownloads`, {}).pipe(
        tap({
            next: () => console.log(`Nombre de téléchargements incrémenté pour le projet id=${id}`),
            error: (error) => console.error(`Erreur lors de l'incrémentation des téléchargements pour le projet id=${id} :`, error)
        }),
        catchError(this.handleError<any>('incrementDownload'))
    );
}

/**
 * Mettre à jour l'état d'un projet en "valide"
 * @param id Identifiant du projet
 * @returns Observable indiquant le résultat de l'opération
 */
setValidProjet(id: number): Observable < any > {
    return this.put<any>(`projet/${id}/valide`, {}).pipe(
        tap({
            next: () => console.log(`Le projet id=${id} a été mis à jour en "valide"`),
            error: (error) => console.error(`Erreur lors de la mise à jour du projet en valide id=${id} :`, error)
        }),
        catchError(this.handleError<any>('setValidProjet'))
    );
}

/**
 * Mettre à jour l'état d'un projet en "invalide"
 * @param id Identifiant du projet
 * @returns Observable indiquant le résultat de l'opération
 */
setInvalidProjet(id: number): Observable < any > {
    return this.put<any>(`projet/${id}/invalide`, {}).pipe(
        tap({
            next: () => console.log(`Le projet id=${id} a été mis à jour en "invalide"`),
            error: (error) => console.error(`Erreur lors de la mise à jour du projet en invalide id=${id} :`, error)
        }),
        catchError(this.handleError<any>('setInvalidProjet'))
    );
}

/**
 * Mettre à jour l'état d'un projet en "en attente"
 * @param id Identifiant du projet
 * @returns Observable indiquant le résultat de l'opération
 */
setPendingProjet(id: number): Observable < any > {
    return this.put<any>(`projet/${id}/attente`, {}).pipe(
        tap({
            next: () => console.log(`Le projet id=${id} a été mis à jour en "en attente"`),
            error: (error) => console.error(`Erreur lors de la mise à jour du projet en attente id=${id} :`, error)
        }),
        catchError(this.handleError<any>('setPendingProjet'))
    );
}

/**
 * Récupérer les projets valides
 * @returns Observable contenant la liste des projets valides
 */
getValidProjet(): Observable < Projet[] > {
    return this.getAll<Projet>('projets/valide').pipe(
        tap({
            next: () => console.log('Récupération des projets valides'),
            error: (error) => console.error('Erreur lors de la récupération des projets valides :', error)
        }),
        catchError(this.handleError<Projet[]>('getValidProjet'))
    );
}

/**
 * Récupérer les projets invalides
 * @returns Observable contenant la liste des projets invalides
 */
getInvalidProjet(): Observable < Projet[] > {
    return this.getAll<Projet>('projets/invalide').pipe(
        tap({
            next: () => console.log('Récupération des projets invalides'),
            error: (error) => console.error('Erreur lors de la récupération des projets invalides :', error)
        }),
        catchError(this.handleError<Projet[]>('getInvalidProjet'))
    );
}

/**
 * Récupérer les projets en attente
 * @returns Observable contenant la liste des projets en attente
 */
getPendingProjet(): Observable < Projet[] > {
    return this.getAll<Projet>('projets/attente').pipe(
        tap({
            next: () => console.log('Récupération des projets en attente'),
            error: (error) => console.error('Erreur lors de la récupération des projets en attente :', error)
        }),
        catchError(this.handleError<Projet[]>('getPendingProjet'))
    );
}

/**
 * Rechercher des projets par mot-clé avec pagination
 * @param keyword Mot-clé de recherche
 * @param page Numéro de la page
 * @param limit Nombre de résultats par page
 * @returns Observable contenant les résultats de la recherche
 */
searchProjects(keyword: string, page: number, limit: number): Observable < any > {
    return this.get<any>(`projets/search/${keyword}/${page}/${limit}`).pipe(
        tap({
            next: () => console.log(`Recherche des projets avec le mot-clé ${keyword}`),
            error: (error) => console.error(`Erreur lors de la recherche des projets avec le mot-clé ${keyword} :`, error)
        }),
        catchError(this.handleError<any>('searchProjects'))
    );
}
}
