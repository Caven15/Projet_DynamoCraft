import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../tools/services/api/auth.service';
import { Utilisateur } from '../../models/utilisateur.model';
import { environment } from '../../../environments/environment.dev';
import { Router, NavigationEnd } from '@angular/router';
import { CategorieService } from '../../tools/services/api/categorie.service';
import { Categorie } from '../../models/categorie.model';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
    categories: Categorie[] = [];
    currentUser: Utilisateur | null = null;
    userLinks: { label: string, url: string }[] = [];
    adminLinks: { label: string, url: string }[] = []; // Nouvelle propriété pour les liens d'administration
    url: string = `${environment.apiUrl}/uploads/`;
    activeLink: string = '';

    constructor(private authService: AuthService, private router: Router, private categorieService: CategorieService) { }

    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
            this.updateUserLinks();
        });

        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.activeLink = event.urlAfterRedirects;
            }
        });

        this.categorieService.getAllCategorie().subscribe({
            next: (data) => {
                this.categories = data;
            },
            error: (error) => {
                console.error("Erreur lors de la récupération des catégories :", error);
            }
        });
    }

    updateUserLinks(): void {
        this.userLinks = [
            { label: 'Mon Profil', url: '/utilisateur/profil' },
            { label: 'Ajouter un projet', url: '/projet/ajout' },
            { label: 'Tout mes projets', url: '/utilisateur/realisations/' + this.currentUser!.id },
            { label: 'Informations personnelles', url: '/utilisateur/profil-user' },
            { label: 'Details', url: '/utilisateur/informations' },
            { label: 'Statistiques', url: '/utilisateur/statistiques' },
            { label: 'Bibliothèques', url: '/utilisateur/bibliotheques' },
        ];

        if (this.isModerator() || this.isAdmin()) {
            this.adminLinks = [
                { label: 'Panel gestion', url: '/admin/panel' },
                { label: 'Utilisateur', url: '/admin/utilisateurs' },
                { label: 'Projets', url: '/admin/projets' },
                { label: 'Statistiques', url: '/admin/statistiques' }
            ];
        }
    }

    getIconForLink(url: string): string {
        switch (url) {
            case '/utilisateur/profil':
                return 'bi bi-person-circle';
            case '/projet/ajout':
                return 'bi bi-plus-circle';
            case '/utilisateur/realisations':
                return 'bi bi-folder';
            case '/utilisateur/profil-user':
                return 'bi bi-info-circle';
            case '/utilisateur/informations':
                return 'bi bi-file-earmark-text';
            case '/utilisateur/statistiques':
                return 'bi bi-bar-chart';
            case '/utilisateur/bibliotheques':
                return 'bi bi-collection';
            case '/admin/panel':
                return 'bi bi-sliders';
            case '/admin/utilisateurs':
                return 'bi bi-people';
            case '/admin/projets':
                return 'bi bi-folder2-open';
            case '/admin/statistiques':
                return 'bi bi-graph-up';
            default:
                return 'bi bi-link';
        }
    }

    isConnected(): boolean {
        return !!this.currentUser;
    }

    isAdmin(): boolean {
        return this.currentUser?.roleId === 3;
    }

    isModerator(): boolean {
        return this.currentUser?.roleId === 2;
    }

    setActiveLink(link: string): void {
        this.activeLink = link;
    }

    isActive(link: string): boolean {
        return this.activeLink === link;
    }

    navigateToSearch(categorieNom: string): void {
        this.router.navigate(['/recherche'], { queryParams: { categorie: categorieNom } });
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }
}


