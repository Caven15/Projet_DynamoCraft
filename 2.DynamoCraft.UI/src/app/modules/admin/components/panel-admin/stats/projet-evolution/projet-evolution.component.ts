import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { StatistiqueService } from '../../../../../../tools/services/api/statistique.service';

@Component({
    selector: 'app-projet-evolution',
    templateUrl: './projet-evolution.component.html',
    styleUrls: ['./projet-evolution.component.scss']
})
export class ProjetEvolutionComponent implements OnInit, OnDestroy {
    selectedView: string = 'month'; // Vue par défaut
    chart: Chart | undefined; // Stockage de l'instance du graphique

    constructor(private statistiqueService: StatistiqueService) {
        Chart.register(...registerables);
    }

    ngOnInit(): void {
        this.loadDownloadsEvolutionChart();
    }

    ngOnDestroy(): void {
        // Détruire le graphique lors de la destruction du composant
        this.destroyChart();
    }

    loadDownloadsEvolutionChart(): void {
        if (this.selectedView === 'month') {
            this.loadByMonth();
        } else if (this.selectedView === 'week') {
            this.loadByWeek();
        } else if (this.selectedView === 'day') {
            this.loadByDay();
        }
    }

    loadByMonth(): void {
        this.statistiqueService.getDownloadsEvolutionByMonth().subscribe(data => {
            this.createChart(data, 'Mois', 'downloadsEvolutionChart', [
                'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
            ]);
        });
    }

    loadByWeek(): void {
        this.statistiqueService.getDownloadsEvolutionByWeek().subscribe(data => {
            this.createChart(data, 'Jour de la semaine', 'downloadsEvolutionChart', [
                'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'
            ]);
        });
    }

    loadByDay(): void {
        this.statistiqueService.getDownloadsEvolutionByDay().subscribe(data => {
            this.createChart(data, 'Heure', 'downloadsEvolutionChart',
                Array.from({ length: 24 }, (_, i) => `${i}h`)
            );
        });
    }

    createChart(data: any, labelPrefix: string, chartId: string, labelsOverride: string[] = []): void {
        const labels = labelsOverride.length ? labelsOverride : data.map((item: any) => `${labelPrefix} ${item.month}`);
        const counts = data.map((item: any) => item.totalDownloads);

        this.destroyChart();

        this.chart = new Chart(chartId, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Évolution des Téléchargements`,
                    data: counts,
                    backgroundColor: 'rgba(227, 178, 0, 0.2)',
                    borderColor: 'rgb(227, 178, 0)',
                    pointBackgroundColor: 'rgb(227, 178, 0)',
                    pointBorderColor: '#fff',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true }
                },
                plugins: {
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleColor: 'rgb(227, 178, 0)',
                        bodyColor: '#ffffff',
                        borderColor: 'rgb(227, 178, 0)',
                        borderWidth: 1,
                    }
                }
            }
        });
    }

    changeView(view: string): boolean {
        this.selectedView = view;
        this.loadDownloadsEvolutionChart();
        return false;
    }

    destroyChart(): void {
        if (this.chart) {
            this.chart.destroy();
        }
    }
}
