import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utilisateur } from '../../../../models/utilisateur.model';
import { AuthService } from '../../../../tools/services/api/auth.service';
import { UtilisateurService } from '../../../../tools/services/api/utilisateur.service';
import { environment } from '../../../../../environments/environment.dev';

@Component({
    selector: 'app-profil',
    templateUrl: './profil.component.html',
    styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
    currentUser: Utilisateur | null = null;  // Utilisateur actuellement connecté
    utilisateur: Utilisateur | null = null;  // Utilisateur dont le profil est affiché
    url: string = `${environment.apiUrl}/uploads/`;

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private utilisateurService: UtilisateurService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // Abonnement à l'utilisateur connecté
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;

            // Si l'ID n'est pas fourni dans l'URL, charger le profil de l'utilisateur connecté
            this.route.paramMap.subscribe(params => {
                const userId = params.get('id');

                if (userId) {
                    this.loadUserProfile(parseInt(userId)); // Charger l'utilisateur par ID
                } else if (this.currentUser?.id !== undefined) {
                    this.loadUserProfile(this.currentUser.id); // Charger le profil de l'utilisateur connecté
                } else {
                    this.router.navigate(['/auth/login']); // Rediriger vers la connexion si non connecté
                }
            });
        });
    }

    navigateToUserProfile() {
        this.router.navigate(['utilisateur/profil-user']);
    }

    loadUserProfile(id: number): void {
        this.utilisateurService.getUtilisateurById(id).subscribe({
            next: (user) => {
                this.utilisateur = user;
                console.log(this.utilisateur);
            },
            error: () => {
                this.router.navigate(['/404']);
            }
        });
    }

    getProfileImageUrl(): string {
        return this.utilisateur?.imageUtilisateur?.nom
            ? `${this.url}${this.utilisateur.imageUtilisateur.nom}`
            : 'assets/png/logo.png';
    }

    // Vérifie si l'utilisateur connecté est le propriétaire du profil
    isCurrentUser(): boolean {
        return this.currentUser?.id === this.utilisateur?.id;
    }
}
