import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/api/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Récupérer le token à partir du service AuthService
        const token = this.authService.getToken();

        // Vérifier si le token existe et si la requête est destinée à l'API
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        // Continuer à traiter la requête avec gestion des erreurs 401 et 403
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 || error.status === 403) {
                    // Vérifier si l'utilisateur est en ligne
                    if (navigator.onLine) {
                        // Ne pas rediriger mais laisser le composant gérer l'erreur
                        // Retourner l'erreur complète pour être gérée par le composant
                        return throwError(error);
                    } else {
                        // Rediriger vers la page accès non autorisé en cas de 403
                    this.router.navigate(['/acces-non-autoriser'], { skipLocationChange: true });
                    }
                }
                // Pour les autres erreurs, retourner l'erreur complète
                return throwError(error);
            })
        );
    }
}
