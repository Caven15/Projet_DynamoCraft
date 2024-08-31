import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { StatistiqueService } from '../../../../../../tools/services/api/statistique.service';

@Component({
    selector: 'app-projet-par-statut',
    templateUrl: './projet-par-statut.component.html',
    styleUrls: ['./projet-par-statut.component.scss']
})
export class ProjetParStatutComponent implements OnInit {

    constructor(private statistiqueService: StatistiqueService) {
        Chart.register(...registerables);
    }

    ngOnInit(): void {
        this.loadStatusChart();
    }

    loadStatusChart(): void {
        this.statistiqueService.getProjetsByStatut().subscribe(data => {
            const labels = data.map((item: any) => item.statut.nom);
            const counts = data.map((item: any) => item.count);
            new Chart('statusChart', {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Projets par Statut',
                        data: counts,
                        backgroundColor: ['#FFD700', '#FF4500', '#00FF7F'],
                        borderColor: '#333',
                        borderWidth: 2,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            titleColor: '#FFD700',
                            bodyColor: '#ffffff',
                            borderColor: '#FFD700',
                            borderWidth: 1,
                        }
                    }
                }
            });
        });
    }
}
