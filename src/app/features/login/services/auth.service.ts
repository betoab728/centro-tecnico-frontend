import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Login } from '../models/login.model';
import { Endpoints } from '../../../../api/endpoints';


@Injectable({
  providedIn: 'root'
})


export class AuthService {

  private apiUrl = Endpoints.login; // URL API Spring Boot para usuarios
  
  constructor(private http: HttpClient , private router: Router ) { }

  login(credentials: Login): Observable<any> {
    console.log('Iniciando login...');
    console.log('Credenciales enviadas:', credentials);

    return this.http.post<any>(this.apiUrl, credentials, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

   // Manejar errores HTTP
   private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de red
      console.error('Ocurrió un error:', error.error.message);
    } else {
      // El backend retornó un código de error
      console.error(
        `Backend retornó el código ${error.status}, ` +
        `cuerpo fue: ${error.error}`);
    }
    return throwError(() => new Error('Ocurrió un error; por favor intenta nuevamente.'));
  }

  // Obtener el token del localStorage
  getToken(): string | null {
    return localStorage.getItem('token'); // Aquí es donde guardas tu token
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;  // No hay token, por lo tanto, no está autenticado
    }

    // Verificar si el token está expirado (opcional)
    const payload = this.getPayloadFromToken(token);
    if (payload && payload.exp) {
      const currentTime = Math.floor(new Date().getTime() / 1000);  // Obtener el tiempo actual en segundos
      return payload.exp > currentTime;  // Comparar si el token no ha expirado
    }

    return false;  // Si no hay expiración o no es válido, no está autenticado
  }

  // Método para decodificar el payload del token (JWT)
  private getPayloadFromToken(token: string): any {
    if (token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    }
    return null;
  }

  //metodo para redirigir al login
  redirectToLogin(): void {
    // Redirigir al login o a la página de acceso
    this.router.navigate(['/login']);
    console.log('Redirigiendo al login...');
  }
  
}
