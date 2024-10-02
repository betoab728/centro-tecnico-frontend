import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { OrderDetail } from '../models/order-detail.interface';
import { tap, catchError,retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Endpoints } from '../../../../api/endpoints';


@Injectable({
  providedIn: 'root'
})

export class OrderDetailService {

  private apiUrl = Endpoints.detalleOrdenes; // URL API Spring Boot para detalles de pedidos

  private orderDetailsSubject = new BehaviorSubject<OrderDetail[]>([]);
  orderDetails$ = this.orderDetailsSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  getOrderDetails(): Observable<OrderDetail[]> {
    return this.http.get<OrderDetail[]>(this.apiUrl).pipe(
      retry(3), // Reintenta 3 veces en caso de errores transitorios
      tap((orderDetails) => this.orderDetailsSubject.next(orderDetails)),
      catchError((error) => this.handleError(error))
    );
  }
  
  getOrderDetailById(id: number): Observable<OrderDetail> {
    return this.http.get<OrderDetail>(`${this.apiUrl}/${id}`).pipe(
      retry(3), // Reintenta solo en errores transitorios
      catchError((error) => this.handleError(error))
    );
  }

  addOrderDetail(orderDetail: OrderDetail): Observable<OrderDetail> {
    return this.http.post<OrderDetail>(this.apiUrl, orderDetail).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  updateOrderDetail(id: number, orderDetail: OrderDetail): Observable<OrderDetail> {
    return this.http.put<OrderDetail>(`${this.apiUrl}/${id}`, orderDetail).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  deleteOrderDetail(id: number): Observable<string> {
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