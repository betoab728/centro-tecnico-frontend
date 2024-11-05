
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
//para usar ngfor, ngif, etc
import { CommonModule } from '@angular/common';
import { Chart,registerables  } from 'chart.js';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {

  dashboardData: any;
  labels: string[] = [];
  dataValues: number[] = [];
  chart: any;

  mapStatus(status: string) {
    switch (status) {
      case 'I':
        return 'Ingresado';
      case 'D':
        return 'Diagnosticado';
      case 'R':
        return 'En reparación';
      case 'C':
        return 'Reparación completada';
      case 'E':
        return 'Entregado';
      default:
        return 'Desconocido';
    }
  }

  constructor(private dashboardService: DashboardService) {
    Chart.register(...registerables);
   }

 ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe(data => {
      this.dashboardData = data;
     // console.log(this.dashboardData); // Para verificar en la consola
      // Ahora que dashboardData ha sido asignado, puedes inicializar labels y dataValues
      this.labels = this.dashboardData.ingresosPorMes.map(
        (item: { mes: number; anio: number }) => `${item.mes}/${item.anio}`
      );
      this.dataValues = this.dashboardData.ingresosPorMes.map(
        (item: { total: number }) => item.total
      );
      this.renderChart();
    });
  }

  renderChart() {

    if (!this.dashboardData || !this.dashboardData.ingresosPorMes) {
      return;
    }

    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const labels = this.dashboardData.ingresosPorMes.map(
      (item: { mes: number; anio: number }) => `${monthNames[item.mes - 1]} ${item.anio}`
    );
    const dataValues = this.dashboardData.ingresosPorMes.map(
      (item: { total: number }) => item.total
    );

    // Verifica si ya existe un gráfico y destrúyelo para evitar duplicados
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart("myChart", {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Ingresos por Mes',
          data: dataValues,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    console.log("Gráfico creado con éxito:", this.chart);
  }
}


