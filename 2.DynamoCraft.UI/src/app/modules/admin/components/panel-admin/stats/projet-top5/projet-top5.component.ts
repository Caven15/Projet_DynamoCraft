import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { StatistiqueService } from '../../../../../../tools/services/api/statistique.service';

@Component({
    selector: 'app-projet-top5',
    templateUrl: './projet-top5.component.html',
    styleUrls: ['./projet-top5.component.scss']
})
export class ProjetTop5Component implements OnInit {

    constructor(private statistiqueService: StatistiqueService) {
        Chart.register(...registerables);
    }

    ngOnInit(): void {
        this.loadTopDownloadsChart();
    }

    loadTopDownloadsChart(): void {
        this.statistiqueService.getTop5DownloadedProjets().subscribe(data => {
            const labels = data.map((item: any) => item.nom);
            const counts = data.map((item: any) => item.statistique.nombreTelechargement);
            new Chart('topDownloadsChart', {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Top 5 des Téléchargements',
                        data: counts,
                        backgroundColor: 'rgb(227, 178, 0)',
                        borderColor: '#333',
                        borderWidth: 2,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y', 
                    scales: {
                        x: { beginAtZero: true },
                        y: { beginAtZero: true }
                    },
                    plugins: {
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            titleColor: '#E3B200',
                            bodyColor: '#E3B200',
                            borderColor: '#E3B200',
                            borderWidth: 1,
                        }
                    }
                }
            });
        });
    }
}
