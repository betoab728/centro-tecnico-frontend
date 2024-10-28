import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Endpoints } from '../../../../api/endpoints';
import { catchError, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  // URL API .NET para reportes
  private reporteUrl  = Endpoints.reporteOrdenes;

  constructor(private http: HttpClient,private router: Router) { }

  // Método para generar el reporte de órdenes
  generateReport (fechaInicio: string, fechaFin: string): Observable<Blob> {
    return this.http.get(`${this.reporteUrl}`, {
      params: { fechaInicio, fechaFin },
      responseType: 'blob' // Recibir como blob para PDF
    }).pipe(
      retry(3), // Reintenta 3 veces en caso de errores transitorios
      catchError((error) => this.handleError(error))
    );
  }
  
   // Manejo de errores
   private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error inesperado. Por favor intente más tarde.';

    if (error.status === 0) {
      // Error de red
      errorMessage = 'Error de conexión. Verifique su red.';
    } else {
      // Errores específicos del servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Error 400 - Solicitud incorrecta.';
          break;
        case 404:
          errorMessage = 'Error 404 - Recurso no encontrado.';
          break;
        case 500:
          errorMessage = 'Error 500 - Error interno del servidor.';
          break;
        default:
          errorMessage = `Error inesperado: ${error.message}`;
          break;
      }
    }

    console.error('Ocurrió un error:', error.message);

    // Redirige a la página de error con el mensaje de error
   this.router.navigate(['/error'], { queryParams: { message: errorMessage } });

    // Devuelve un Observable con un mensaje de error
    return throwError(() => new Error('Error en la solicitud; por favor intente nuevamente más tarde.'));
  }
  
}
