import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, switchMap, tap } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Projet } from '../../../models/projet.model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ProjetService extends BaseApiService {

    constructor(
        protected override httpClient: HttpClient,
        private authService: AuthService // Injecter AuthService
    ) {
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
     * @param Id Identifiant du projet
     * @returns Observable contenant le projet
     */
    getProjetById(Id: number): Observable<Projet> {
        return this.get<Projet>(`projet/${Id}`).pipe(
            tap({
                next: () => console.log(`Récupération du projet Id=${Id}`),
                error: (error) => console.error(`Erreur lors de la récupération du projet Id=${Id} :`, error)
            }),
            catchError(this.handleError<Projet>('getProjetById'))
        );
    }

    /**
     * Créer un nouveau projet
     * @param Projet Objet contenant les informations du projet
     * @param Images Liste des fichiers d'image
     * @returns Observable indiquant le résultat de l'opération
     */
    createProjet(Projet: Projet, Images: File[]): Observable<any> {
        const formData = new FormData();
        formData.append('nom', Projet.nom);
        formData.append('description', Projet.description);
        formData.append('categorieId', Projet.categorieId.toString());
        formData.append('utilisateurId', Projet.utilisateurId.toString());

        Images.forEach((Image, index) => formData.append('images', Image, Image.name));

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
     * @param Id Identifiant du projet
     * @param Projet Objet contenant les nouvelles informations du projet
     * @returns Observable indiquant le résultat de l'opération
     */
    updateProjet(Id: number, Projet: Projet): Observable<any> {
        return this.put<any>(`projet/${Id}`, Projet).pipe(
            tap({
                next: () => console.log(`Projet Id=${Id} mis à jour`),
                error: (error) => console.error(`Erreur lors de la mise à jour du projet Id=${Id} :`, error)
            }),
            catchError(this.handleError<any>('updateProjet'))
        );
    }

    /**
     * Supprimer un projet par ID
     * @param Id Identifiant du projet
     * @returns Observable indiquant le résultat de l'opération
     */
    deleteProjet(Id: number): Observable<any> {
        return this.delete<any>(`projet/${Id}`).pipe(
            tap({
                next: () => console.log(`Projet Id=${Id} supprimé`),
                error: (error) => console.error(`Erreur lors de la suppression du projet Id=${Id} :`, error)
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
                return projects.map(projet => {
                    // Vérifier si l'utilisateur est présent avant d'accéder à ses propriétés
                    if (projet.utilisateur) {
                        console.log("Utilisateur trouvé :", projet.utilisateur.pseudo);

                        if (projet.utilisateur.imageUtilisateur) {
                            console.log("Nom de l'image utilisateur :", projet.utilisateur.imageUtilisateur.nom);
                        }
                    } else {
                        console.warn("Utilisateur non trouvé pour le projet :", projet.nom);
                    }

                    // // Vérifier si ImageProjet est présent
                    // if (projet.imageProjet) {
                    //     console.log("Nom de l'image projet :", projet.imageProjet.nom);
                    // } else {
                    //     console.warn("ImageProjet non trouvée pour le projet :", projet.nom);
                    // }

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


    getLastProjects(): Observable<Projet[]> {
        return this.get<{ recentProjects: Projet[] }>('projet/last').pipe(
            map(response => {
                // Supprimer les doublons par identifiant
                const UniqueProjects = response.recentProjects.filter((Projet, index, self) =>
                    index === self.findIndex((t) => (
                        t.id === Projet.id
                    ))
                );

                return UniqueProjects.map(Projet => {
                    // Ne conserver qu'une seule image par projet
                    if (Projet.imageProjet && !Array.isArray(Projet.imageProjet)) {
                        Projet.imageProjet = [Projet.imageProjet];
                    }
                    if (Projet.imageProjet && Projet.imageProjet.length > 0) {
                        Projet.imageProjet = [Projet.imageProjet[0]];
                    }
                    return Projet;
                });
            }),
            tap({
                next: () => console.log('Récupération des derniers projets'),
                error: (error) => console.error('Erreur lors de la récupération des derniers projets :', error)
            })
        );
    }

    getProjectsByCategoryId(Id: number): Observable<Projet[]> {
        return this.getAll<Projet>(`projet/${Id}/categorie`).pipe(
            tap({
                next: () => console.log(`Récupération des projets de la catégorie Id=${Id}`),
                error: (error) => console.error(`Erreur lors de la récupération des projets de la catégorie Id=${Id} :`, error)
            }),
            catchError(this.handleError<Projet[]>('getProjectsByCategoryId'))
        );
    }

    getProjectsByUserId(Id: number): Observable<Projet[]> {
        return this.getAll<Projet>(`projet/${Id}/utilisateur`).pipe(
            map(realisations => {
                return realisations.map((projet: any) => {
                    // Vérification que imageProjet est un tableau
                    if (projet.imageProjet && !Array.isArray(projet.imageProjet)) {
                        projet.imageProjet = [projet.imageProjet];
                    }

                    // Si imageProjet contient au moins une image, ne garder que la première
                    if (projet.imageProjet && projet.imageProjet.length > 0) {
                        projet.imageProjet = [projet.imageProjet[0]];
                    } else {
                        // Si pas d'image, on peut ajouter une valeur par défaut (facultatif)
                        projet.imageProjet = [];
                    }

                    return projet;
                });
            }),
            tap({
                next: () => console.log(`Récupération des projets de l'utilisateur Id=${Id}`),
                error: (error) => console.error(`Erreur lors de la récupération des projets de l'utilisateur Id=${Id} :`, error)
            }),
            catchError(this.handleError<Projet[]>('getProjectsByUserId'))
        );
    }

    incrementLike(projetId: number): Observable<any> {
        return this.authService.currentUser$.pipe(
            switchMap((currentUser) => {
                if (!currentUser) {
                    throw new Error('Utilisateur non connecté');
                }

                // Envoyer l'ID de l'utilisateur connecté dans le body de la requête
                const body = { utilisateurId: currentUser.id, projetId };

                return this.put<any>(`projet/${projetId}/incrementLike`, body).pipe(
                    tap({
                        next: () => console.log(`Nombre de likes incrémenté pour le projet Id=${projetId}`),
                        error: (error) => console.error(`Erreur lors de l'incrémentation des likes pour le projet Id=${projetId} :`, error)
                    }),
                    catchError(this.handleError<any>('incrementLike'))
                );
            })
        );
    }

    incrementDownload(Id: number): Observable<any> {
        return this.put<any>(`projet/${Id}/incrementDownloads`, {}).pipe(
            tap({
                next: () => console.log(`Nombre de téléchargements incrémenté pour le projet Id=${Id}`),
                error: (error) => console.error(`Erreur lors de l'incrémentation des téléchargements pour le projet Id=${Id} :`, error)
            }),
            catchError(this.handleError<any>('incrementDownload'))
        );
    }

    setValidProjet(Id: number): Observable<any> {
        return this.put<any>(`projet/${Id}/valide`, {}).pipe(
            tap({
                next: () => console.log(`Le projet Id=${Id} a été mis à jour en "valide"`),
                error: (error) => console.error(`Erreur lors de la mise à jour du projet en valide Id=${Id} :`, error)
            }),
            catchError(this.handleError<any>('setValidProjet'))
        );
    }

    setInvalidProjet(Id: number): Observable<any> {
        return this.put<any>(`projet/${Id}/invalide`, {}).pipe(
            tap({
                next: () => console.log(`Le projet Id=${Id} a été mis à jour en "invalide"`),
                error: (error) => console.error(`Erreur lors de la mise à jour du projet en invalide Id=${Id} :`, error)
            }),
            catchError(this.handleError<any>('setInvalidProjet'))
        );
    }

    setPendingProjet(Id: number): Observable<any> {
        return this.put<any>(`projet/${Id}/attente`, {}).pipe(
            tap({
                next: () => console.log(`Le projet Id=${Id} a été mis à jour en "en attente"`),
                error: (error) => console.error(`Erreur lors de la mise à jour du projet en attente Id=${Id} :`, error)
            }),
            catchError(this.handleError<any>('setPendingProjet'))
        );
    }

    getValidProjet(): Observable<Projet[]> {
        return this.getAll<Projet>('projets/valide').pipe(
            tap({
                next: () => console.log('Récupération des projets valides'),
                error: (error) => console.error('Erreur lors de la récupération des projets valides :', error)
            }),
            catchError(this.handleError<Projet[]>('getValidProjet'))
        );
    }

    getInvalidProjet(): Observable<Projet[]> {
        return this.getAll<Projet>('projets/invalide').pipe(
            tap({
                next: () => console.log('Récupération des projets invalides'),
                error: (error) => console.error('Erreur lors de la récupération des projets invalides :', error)
            }),
            catchError(this.handleError<Projet[]>('getInvalidProjet'))
        );
    }

    getPendingProjet(): Observable<Projet[]> {
        return this.getAll<Projet>('projets/attente').pipe(
            tap({
                next: () => console.log('Récupération des projets en attente'),
                error: (error) => console.error('Erreur lors de la récupération des projets en attente :', error)
            }),
            catchError(this.handleError<Projet[]>('getPendingProjet'))
        );
    }

    searchProjects(Keyword: string, Page: number, Limit: number): Observable<any> {
        return this.get<any>(`projets/search/${Keyword}/${Page}/${Limit}`).pipe(
            map(response => {
                response.projects = response.projects.map((Projet: any) => {
                    if (Projet.imageProjet && !Array.isArray(Projet.imageProjet)) {
                        Projet.imageProjet = [Projet.imageProjet];
                    }

                    if (Projet.imageProjet && Projet.imageProjet.length > 0) {
                        Projet.imageProjet = [Projet.imageProjet[0]];
                    }

                    return Projet;
                });

                return response;
            }),
            tap({
                next: () => console.log(`Recherche des projets avec le mot-clé ${Keyword}`),
                error: (error) => console.error(`Erreur lors de la recherche des projets avec le mot-clé ${Keyword} :`, error)
            }),
            catchError(this.handleError<any>('searchProjects'))
        );
    }

    /**
     * Récupérer les projets téléchargés par l'utilisateur connecté
     * @returns Observable contenant la liste des projets téléchargés
     */
    getDownloadedProjects(): Observable<Projet[]> {
        return this.authService.currentUser$.pipe(
            switchMap(currentUser => {
                if (!currentUser) {
                    throw new Error('Utilisateur non connecté');
                }

                return this.getAll<Projet>(`projet/downloaded/${currentUser.id}/utilisateur`).pipe(
                    tap({
                        next: () => console.log(`Récupération des projets téléchargés par l'utilisateur Id=${currentUser.id}`),
                        error: (error) => console.error(`Erreur lors de la récupération des projets téléchargés par l'utilisateur Id=${currentUser.id} :`, error)
                    }),
                    catchError(this.handleError<Projet[]>('getDownloadedProjects'))
                );
            })
        );
    }
}
