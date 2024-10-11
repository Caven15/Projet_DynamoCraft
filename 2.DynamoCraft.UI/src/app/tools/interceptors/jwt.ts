import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/api/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private authService!: AuthService; // Injection différée
    constructor(
        private injector: Injector, // Utilisation de l'Injector
        private router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Injection différée du AuthService
        if (!this.authService) {
            this.authService = this.injector.get(AuthService);
        }

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
                    if (navigator.onLine) {
                        // Laisser le composant gérer l'erreur, ne pas rediriger ici
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
