import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportsService } from '../../services/reports.service';
//para usar ngif
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-list.component.html',
  styleUrl: './report-list.component.css'
})
export class ReportListComponent {

  pdfUrl: SafeResourceUrl | null = null;

  constructor(private reportsService: ReportsService, private sanitizer: DomSanitizer) { }

  generarReporte(fechaInicio: string, fechaFin: string): void {
    this.reportsService.generateReport(fechaInicio, fechaFin).subscribe(response => {
      const blob = new Blob([response], { type: 'application/pdf' });
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
    });
  }


}
