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
}
