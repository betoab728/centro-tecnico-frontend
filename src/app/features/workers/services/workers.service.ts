import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { Worker } from '../models/worker.interface';
import { tap, catchError,retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Endpoints } from '../../../../api/endpoints';


@Injectable({
  providedIn: 'root'
})

export class WorkersService {

  private apiUrl = Endpoints.trabajadores;  // URL API Spring Boot para pedidos

  private workersSubject = new BehaviorSubject<Worker[]>([]);
  workers$ = this.workersSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  getWorkers(): Observable<Worker[]> {
    return this.http.get<Worker[]>(this.apiUrl).pipe(
      retry(3), // Reintenta 3 veces en caso de errores transitorios
      tap((workers) => this.workersSubject.next(workers)),
      catchError((error) => this.handleError(error))
    );
  }
  
  getWorkerById(id: number): Observable<Worker> {
    return this.http.get<Worker>(`${this.apiUrl}/${id}`).pipe(
      retry(3), // Reintenta solo en errores transitorios
      catchError((error) => this.handleError(error))
    );
  }

  addWorker(worker: Worker): Observable<Worker> {
    console.log( 'datos del trabajador a registrar', worker);
    return this.http.post<Worker>(this.apiUrl, worker).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  updateWorker(id: number, worker: Worker): Observable<Worker> {
    return this.http.put<Worker>(`${this.apiUrl}/${id}`, worker).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  deleteWorker(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`).pipe(
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