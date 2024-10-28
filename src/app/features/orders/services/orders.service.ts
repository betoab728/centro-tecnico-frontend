import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { Order } from '../models/order.interface';
import { OrderDTO } from '../models/orderDTO.interface';
import { tap, catchError,retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Endpoints } from '../../../../api/endpoints';
import { OrderDetail } from '../../order-detail/models/order-detail.interface';
import { OrdenConDetallesDTO } from '../models/ordenConDetalleDTO.interface';


@Injectable({
  providedIn: 'root'
})

export class OrdersService {

  private apiUrl = Endpoints.ordenes;  // URL API Spring Boot para pedidos

  private ordersSubject = new BehaviorSubject<OrderDTO[]>([]);
  orders$ = this.ordersSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  getOrders(): Observable<OrderDTO[]> {
    return this.http.get<OrderDTO[]>(this.apiUrl).pipe(
      retry(3), // Reintenta 3 veces en caso de errores transitorios
      tap((orders) => this.ordersSubject.next(orders)),
      catchError((error) => this.handleError(error))
    );
  }
  
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`).pipe(
      retry(3), // Reintenta solo en errores transitorios
      catchError((error) => this.handleError(error))
    );
  }

  addOrder(ordenConDetalles: OrdenConDetallesDTO): Observable<number> {
    return this.http.post<number>(this.apiUrl, ordenConDetalles).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  updateOrder(id: number, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, order).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  //actualizar estado de la orden

  updateOrderState(id: number, estadoOrden: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/estadoOrden/${id}`, { estadoOrden }).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  deleteOrder(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  //para ver el detalle de la orden que recibe como parametro el id

  getOrderDetails(idOrden: number): Observable<OrderDetail[]> {
    return this.http.get<OrderDetail[]>(`${this.apiUrl}/detalleOrden/detalle/${idOrden}`).pipe(
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