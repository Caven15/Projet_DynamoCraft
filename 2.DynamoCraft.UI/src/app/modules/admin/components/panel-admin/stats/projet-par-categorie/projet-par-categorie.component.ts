import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { StatistiqueService } from '../../../../../../tools/services/api/statistique.service';

@Component({
    selector: 'app-projet-par-categorie',
    templateUrl: './projet-par-categorie.component.html',
    styleUrls: ['./projet-par-categorie.component.scss']
})
export class ProjetParCategorieComponent implements OnInit {

    constructor(private statistiqueService: StatistiqueService) {
        Chart.register(...registerables);
    }

    ngOnInit(): void {
        this.loadCategoryChart();
    }

    loadCategoryChart(): void {
        this.statistiqueService.getProjetsByCategorie().subscribe(data => {
            const labels = data.map((item: any) => item.categorie.nom);
            const counts = data.map((item: any) => item.count);
            new Chart('categoryChart', {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Projets par Catégorie',
                        data: counts,
                        backgroundColor: 'rgb(227, 178, 0)',
                        borderColor: '#333',
                        borderWidth: 2,
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
                            titleColor: '#FFD700',
                            bodyColor: '#E3B200',
                            borderColor: '#FFD700',
                            borderWidth: 1,
                        }
                    }
                }
            });
        });
    }
}
