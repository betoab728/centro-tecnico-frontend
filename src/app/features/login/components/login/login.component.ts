import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Login } from '../../models/login.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { provideHttpClient }  from '@angular/common/http';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  credentials: Login = { nombre: '', clave: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
   
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log( "respuesta de la api :"+ response);
        // Guarda el token en localStorage o como desees manejarlo
        localStorage.setItem('token', response.token);
        // Redirige al dashboard o alguna página protegida
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.errorMessage = 'Usuario o clave incorrectos';
      }
    });
  }

}
