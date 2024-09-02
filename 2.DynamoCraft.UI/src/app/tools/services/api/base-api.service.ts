import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.dev';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class BaseApiService {
    protected baseUrl: string = `${environment.apiUrl}/Api`;

    protected httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: false // Ne pas envoyer de cookies
    };

    constructor(protected httpClient: HttpClient, private router?: Router) { }

    /**
     * GET request
     * @param endpoint Endpoint de l'API
     * @returns Observable contenant les données de l'API
     */
    protected get<T>(endpoint: string): Observable<T> {
        return this.httpClient.get<T>(`${this.baseUrl}/${endpoint}`, this.httpOptions).pipe(
            catchError(this.handleError<T>('get'))
        );
    }

    /**
     * GET ALL request
     * @param endpoint Endpoint de l'API
     * @returns Observable contenant les données de l'API
     */
    protected getAll<T>(endpoint: string): Observable<T[]> {
        return this.httpClient.get<T | T[]>(`${this.baseUrl}/${endpoint}`, this.httpOptions).pipe(
            map(response => Array.isArray(response) ? response : [response]),
            catchError(this.handleError<T[]>('getAll', [])) // Retourne un tableau vide en cas d'erreur
        );
    }

    /**
     * POST request
     * @param endpoint Endpoint de l'API
     * @param data Données à envoyer
     * @returns Observable contenant les données de l'API
     */
    protected post<T>(endpoint: string, data: any): Observable<T> {
        // Utiliser des options différentes si les données sont un FormData
        const options = data instanceof FormData ? {} : this.httpOptions;
        return this.httpClient.post<T>(`${this.baseUrl}/${endpoint}`, data, options).pipe(
            catchError(this.handleError<T>('post'))
        );
    }

    /**
     * PUT request
     * @param endpoint Endpoint de l'API
     * @param data Données à envoyer
     * @returns Observable contenant les données de l'API
     */
    protected put<T>(endpoint: string, data: any): Observable<T> {
        // Utiliser des options différentes si les données sont un FormData
        const options = data instanceof FormData ? {} : this.httpOptions;
        return this.httpClient.put<T>(`${this.baseUrl}/${endpoint}`, data, options).pipe(
            catchError(this.handleError<T>('put'))
        );
    }

    /**
     * DELETE request
     * @param endpoint Endpoint de l'API
     * @returns Observable contenant les données de l'API
     */
    protected delete<T>(endpoint: string): Observable<T> {
        return this.httpClient.delete<T>(`${this.baseUrl}/${endpoint}`, this.httpOptions).pipe(
            catchError(this.handleError<T>('delete'))
        );
    }

/**
 * Gestion des erreurs HTTP
 * @param operation Nom de l'opération
 * @param result Résultat optionnel à retourner en cas d'erreur
 * @returns Observable contenant le résultat par défaut ou l'erreur
 */
protected handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
        let errorMessage = `${error.message}`;
        if (error.error && error.error.message) {
            errorMessage = `${error.error.message}`;
        }

        console.error(`${operation} failed: ${errorMessage}`);

        // Afficher des messages d'erreur spécifiques basés sur le code d'erreur HTTP
        switch (error.status) {
            case 400:
                console.error('Erreur 400: Mauvaise requête');
                break;
            case 401:
                console.error('Erreur 401: Non autorisé');
                break;
            case 403:
                console.error('Erreur 403: Accès refusé');
                break;
            case 404:
                console.error('Erreur 404: Ressource non trouvée');
                break;
            case 500:
                console.error('Erreur 500: Erreur interne du serveur');
                break;
            default:
                console.error('Erreur inconnue');
        }

        // Retourner une erreur observable avec le message d'erreur
        return throwError(() => new Error(errorMessage));
    };
}

}
