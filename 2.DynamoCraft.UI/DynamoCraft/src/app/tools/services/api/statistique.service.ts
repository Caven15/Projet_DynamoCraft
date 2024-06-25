import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable, tap } from 'rxjs';
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
            tap((newStat: Statistique) => console.log(`Statistique créée avec l'id=${newStat.id}`))
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
            tap(() => console.log(`Statistique id=${id} mise à jour`))
        );
    }

    /**
     * Récupérer les totaux des appréciations et téléchargements
     * @returns Observable contenant les totaux
     */
    getTotalsStatistique(): Observable<any> {
        return this.get<any>('statistique/totals').pipe(
            tap(() => console.log('Récupération des totaux'))
        );
    }
}
