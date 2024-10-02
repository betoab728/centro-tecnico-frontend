
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { Position } from '../models/position.interface';
import { tap, catchError,retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Endpoints } from '../../../../api/endpoints';


@Injectable({
  providedIn: 'root'
})

export class PositionsService {

  private apiUrl = Endpoints.cargos;  // URL API Spring Boot para pedidos

  private positionsSubject = new BehaviorSubject<Position[]>([]);
  positions$ = this.positionsSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  getPositions(): Observable<Position[]> {
    return this.http.get<Position[]>(this.apiUrl).pipe(
      retry(3), // Reintenta 3 veces en caso de errores transitorios
      tap((positions) => this.positionsSubject.next(positions)),
      catchError((error) => this.handleError(error))
    );
  }
  
  getPositionById(id: number): Observable<Position> {
    return this.http.get<Position>(`${this.apiUrl}/${id}`).pipe(
      retry(3), // Reintenta solo en errores transitorios
      catchError((error) => this.handleError(error))
    );
  }

  addPosition(position: Position): Observable<Position> {
    return this.http.post<Position>(this.apiUrl, position).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  updatePosition(id: number, position: Position): Observable<Position> {
    return this.http.put<Position>(`${this.apiUrl}/${id}`, position).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  deletePosition(id: number): Observable<string> {
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