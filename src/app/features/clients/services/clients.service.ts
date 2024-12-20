import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { Client } from '../models/client.interface';
import { tap, catchError,retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Endpoints } from '../../../../api/endpoints';
import { Page } from '../models/page.interface';
import { HttpParams } from '@angular/common/http';




@Injectable({
  providedIn: 'root'
})

export class ClientsService {
  
  private apiUrl =Endpoints.clientes; // URL API Spring Boot para clientes

  private clientsSubject = new BehaviorSubject<Client[]>([]);
  clients$ = this.clientsSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl).pipe(
      retry(3), // Reintenta 3 veces en caso de errores transitorios
      tap((clients) => this.clientsSubject.next(clients)),
      catchError((error) => this.handleError(error))
    );
  }

    getClientsPage(
      texto: string = '', 
      page: number = 0, 
      size: number = 10
    ): Observable<Page<Client>> {
      const params = new HttpParams()
        .set('texto', texto)
        .set('page', page.toString())
        .set('size', size.toString());
    
      const url = `${this.apiUrl}/buscar`; // Ajusta el endpoint según corresponda
      console.log('URL de la llamada:', url); // Agrega este log para verificar la URL
      console.log('Parámetros:', params.toString()); // Log de parámetros
    
      return this.http.get<Page<Client>>(url, { params }).pipe(
        retry(3),
        tap((clients) => this.clientsSubject.next(clients.content)), // Envía solo los clientes desde `Page`
        catchError((error) => this.handleError(error))
      );
    }

  
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`).pipe(
      retry(3), // Reintenta solo en errores transitorios
      catchError((error) => this.handleError(error))
    );
  }

  addClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  deleteClient(id: number): Observable<string> {
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