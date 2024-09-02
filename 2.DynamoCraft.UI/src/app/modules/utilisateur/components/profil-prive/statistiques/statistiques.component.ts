import { Component, OnInit } from '@angular/core';
import { Projet } from '../../../../../models/projet.model';
import { Commentaire } from '../../../../../models/commentaire.model';
import { CommentaireService } from '../../../../../tools/services/api/commentaire.service';
import { ProjetService } from '../../../../../tools/services/api/projet.service';
import { AuthService } from '../../../../../tools/services/api/auth.service';
import { Router } from '@angular/router';
import { UtilisateurService } from '../../../../../tools/services/api/utilisateur.service';

@Component({
    selector: 'app-user-statistiques',
    templateUrl: './statistiques.component.html',
    styleUrls: ['./statistiques.component.scss']
})
export class StatistiquesComponent implements OnInit {
    totalModelsAdded: number | undefined = 0;
    totalModelsDownloaded: number | undefined = 0;
    totalComments: number | undefined = 0;
    totalLikesReceived: number | undefined = 0;
    totalLikesGiven: number | undefined = 0;

    recentDownloadedProjects: Projet[] = [];
    recentComments: Commentaire[] = [];

    // Variables pour le tri
    downloadedSortColumn: string = 'nom';
    downloadedSortDirection: 'asc' | 'desc' = 'asc';

    commentsSortColumn: string = 'dateCreation';
    commentsSortDirection: 'asc' | 'desc' = 'asc';

    constructor(
        private projetService: ProjetService,
        private utilisateurService: UtilisateurService,
        private commentaireService: CommentaireService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => {
            if (user && user.id) {
                this.loadUserStatistics(user.id);
                this.loadRecentDownloadedProjects(user.id);
                this.loadRecentComments(user.id);
            }
        });
    }

    loadUserStatistics(userId: number): void {
        this.utilisateurService.getUtilisateurById(userId).subscribe(user => {
            this.totalModelsAdded = user.totalUploads;
            this.totalModelsDownloaded = user.totalDownloads;
            this.totalLikesReceived = user.totalLikes;
            this.totalLikesGiven = user.totalLikesGiven;
            this.totalComments = user.totalComments;

            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            // this.modelsDownloadedLast7Days = user.projet.reduce((acc, project) => {
            //     const dateModification = new Date(project.statistique?.dateModification ?? '1970-01-01T00:00:00Z');
            //     if (dateModification > sevenDaysAgo && project.statistique?.nombreTelechargement) {
            //         return acc + project.statistique.nombreTelechargement;
            //     }
            //     return acc;
            // }, 0);
        });
    }

    loadRecentDownloadedProjects(userId: number): void {
        this.projetService.getDownloadedProjects().subscribe(projects => {
            this.recentDownloadedProjects = projects.slice(0, 5);
            this.sortData('statistique.datePublication', 'recentDownloadedProjects');
        });
    }

    loadRecentComments(userId: number): void {
        this.commentaireService.getCommentairesByUtilisateurId().subscribe(comments => {
            this.recentComments = comments.slice(0, 5);
            this.sortData('dateCreation', 'recentComments');
        });
    }

    viewProject(projectId: number): void {
        this.router.navigate(['/projet/detail', projectId]);
    }

    viewComment(projectId: number, commentId: number | undefined): void {
        this.router.navigate(['/projet/detail', projectId], {
            queryParams: { commentId }
        });
    }

    sortData(column: string, listType: 'recentDownloadedProjects' | 'recentComments'): void {
        let sortColumn: string;
        let sortDirection: 'asc' | 'desc';
        let listToSort: any[];

        if (listType === 'recentDownloadedProjects') {
            sortColumn = this.downloadedSortColumn;
            sortDirection = this.downloadedSortDirection;
            listToSort = this.recentDownloadedProjects;
        } else {
            sortColumn = this.commentsSortColumn;
            sortDirection = this.commentsSortDirection;
            listToSort = this.recentComments;
        }

        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }

        listToSort.sort((a, b) => {
            let valueA = this.getNestedValue(a, column);
            let valueB = this.getNestedValue(b, column);

            if (column === 'dateCreation' || column === 'statistique.datePublication') {
                valueA = valueA ? new Date(valueA).getTime() : 0;
                valueB = valueB ? new Date(valueB).getTime() : 0;
            } else if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }

            if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        if (listType === 'recentDownloadedProjects') {
            this.recentDownloadedProjects = [...listToSort];
            this.downloadedSortColumn = sortColumn;
            this.downloadedSortDirection = sortDirection;
        } else {
            this.recentComments = [...listToSort];
            this.commentsSortColumn = sortColumn;
            this.commentsSortDirection = sortDirection;
        }
    }

    getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    getSortIcon(column: string, listType: 'recentDownloadedProjects' | 'recentComments'): string {
        let sortColumn: string;
        let sortDirection: 'asc' | 'desc';

        if (listType === 'recentDownloadedProjects') {
            sortColumn = this.downloadedSortColumn;
            sortDirection = this.downloadedSortDirection;
        } else {
            sortColumn = this.commentsSortColumn;
            sortDirection = this.commentsSortDirection;
        }

        if (sortColumn === column) {
            return sortDirection === 'asc' ? 'bi-sort-up' : 'bi-sort-down';
        }
        return 'bi-sort';
    }
}
