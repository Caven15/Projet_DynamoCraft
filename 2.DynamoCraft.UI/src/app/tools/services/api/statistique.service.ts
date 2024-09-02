import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable, tap, catchError } from 'rxjs';
import { Statistique } from '../../../models/statistique.model';

@Injectable({
    providedIn: 'root'
})
export class StatistiqueService extends BaseApiService {

    constructor(protected override httpClient: HttpClient) {
        super(httpClient);
    }

    /**
     * Créer une nouvelle statistique
     * @param statistique Objet contenant les informations de la nouvelle statistique
     * @returns Observable contenant la statistique créée
     */
    postStatistique(statistique: Statistique): Observable<Statistique> {
        return this.post<Statistique>('statistique', statistique).pipe(
            tap({
                next: (newStat: Statistique) => console.log(`Statistique créée avec l'id=${newStat.id}`),
                error: (error) => console.error('Erreur lors de la création de la statistique :', error)
            }),
            catchError(this.handleError<Statistique>('postStatistique'))
        );
    }

    /**
     * Mettre à jour une statistique par ID
     * @param id Identifiant de la statistique
     * @param statistique Objet contenant les nouvelles informations de la statistique
     * @returns Observable indiquant le résultat de l'opération
     */
    updateStatistique(id: number, statistique: Statistique): Observable<any> {
        return this.put<any>(`statistique/${id}`, statistique).pipe(
            tap({
                next: () => console.log(`Statistique id=${id} mise à jour`),
                error: (error) => console.error(`Erreur lors de la mise à jour de la statistique id=${id} :`, error)
            }),
            catchError(this.handleError<any>('updateStatistique'))
        );
    }

    /**
     * Récupérer les totaux des appréciations et téléchargements
     * @returns Observable contenant les totaux
     */
    getTotalsStatistique(): Observable<any> {
        return this.get<any>('statistique/totals').pipe(
            tap({
                next: () => console.log('Récupération des totaux'),
                error: (error) => console.error('Erreur lors de la récupération des totaux :', error)
            }),
            catchError(this.handleError<any>('getTotalsStatistique'))
        );
    }

    /**
     * Récupérer les projets par statut
     * @returns Observable contenant les projets groupés par statut
     */
    getProjetsByStatut(): Observable<any> {
        return this.get<any>('statistique/projets/statut').pipe(
            tap({
                next: () => console.log('Récupération des projets par statut'),
                error: (error) => console.error('Erreur lors de la récupération des projets par statut :', error)
            }),
            catchError(this.handleError<any>('getProjetsByStatut'))
        );
    }

    /**
     * Récupérer les projets par catégorie
     * @returns Observable contenant les projets groupés par catégorie
     */
    getProjetsByCategorie(): Observable<any> {
        return this.get<any>('statistique/projets/categorie').pipe(
            tap({
                next: () => console.log('Récupération des projets par catégorie'),
                error: (error) => console.error('Erreur lors de la récupération des projets par catégorie :', error)
            }),
            catchError(this.handleError<any>('getProjetsByCategorie'))
        );
    }

    /**
     * Récupérer le nombre moyen de téléchargements par projet
     * @returns Observable contenant le nombre moyen de téléchargements
     */
    getAverageDownloads(): Observable<any> {
        return this.get<any>('statistique/average-downloads').pipe(
            tap({
                next: () => console.log('Récupération du nombre moyen de téléchargements'),
                error: (error) => console.error('Erreur lors de la récupération du nombre moyen de téléchargements :', error)
            }),
            catchError(this.handleError<any>('getAverageDownloads'))
        );
    }

    /**
     * Récupérer le nombre moyen de likes par projet
     * @returns Observable contenant le nombre moyen de likes
     */
    getAverageLikes(): Observable<any> {
        return this.get<any>('statistique/average-likes').pipe(
            tap({
                next: () => console.log('Récupération du nombre moyen de likes'),
                error: (error) => console.error('Erreur lors de la récupération du nombre moyen de likes :', error)
            }),
            catchError(this.handleError<any>('getAverageLikes'))
        );
    }

    /**
     * Récupérer le top 5 des projets les plus téléchargés
     * @returns Observable contenant le top 5 des projets les plus téléchargés
     */
    getTop5DownloadedProjets(): Observable<any> {
        return this.get<any>('statistique/top5-downloads').pipe(
            tap({
                next: () => console.log('Récupération du top 5 des projets les plus téléchargés'),
                error: (error) => console.error('Erreur lors de la récupération du top 5 des projets les plus téléchargés :', error)
            }),
            catchError(this.handleError<any>('getTop5DownloadedProjets'))
        );
    }

    /**
     * Récupérer l'évolution des téléchargements par mois
     * @returns Observable contenant l'évolution des téléchargements par mois
     */
    getDownloadsEvolutionByMonth(): Observable<any> {
        return this.get<any>('statistique/downloads-evolution').pipe(
            tap({
                next: () => console.log('Récupération de l\'évolution des téléchargements par mois'),
                error: (error) => console.error('Erreur lors de la récupération de l\'évolution des téléchargements :', error)
            }),
            catchError(this.handleError<any>('getDownloadsEvolutionByMonth'))
        );
    }

    /**
     * Récupérer l'évolution des téléchargements par semaine
     * @returns Observable contenant l'évolution des téléchargements par semaine
     */
    getDownloadsEvolutionByWeek(): Observable<any> {
        return this.get<any>('statistique/downloads-evolution/week').pipe(
            tap({
                next: () => console.log('Récupération de l\'évolution des téléchargements par semaine'),
                error: (error) => console.error('Erreur lors de la récupération des téléchargements par semaine :', error)
            }),
            catchError(this.handleError<any>('getDownloadsEvolutionByWeek'))
        );
    }

    /**
     * Récupérer l'évolution des téléchargements par jour
     * @returns Observable contenant l'évolution des téléchargements par jour
     */
    getDownloadsEvolutionByDay(): Observable<any> {
        return this.get<any>('statistique/downloads-evolution/day').pipe(
            tap({
                next: () => console.log('Récupération de l\'évolution des téléchargements par jour'),
                error: (error) => console.error('Erreur lors de la récupération des téléchargements par jour :', error)
            }),
            catchError(this.handleError<any>('getDownloadsEvolutionByDay'))
        );
    }

    /**
     * Récupérer les projets les plus commentés
     * @returns Observable contenant les projets les plus commentés
     */
    getMostCommentedProjets(): Observable<any> {
        return this.get<any>('statistique/most-commented').pipe(
            tap({
                next: () => console.log('Récupération des projets les plus commentés'),
                error: (error) => console.error('Erreur lors de la récupération des projets les plus commentés :', error)
            }),
            catchError(this.handleError<any>('getMostCommentedProjets'))
        );
    }
}
