import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent {

  errorMessage: string = 'Error inesperado. Por favor intente más tarde.';

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Obtener el mensaje de error de los parámetros de consulta
    this.route.queryParams.subscribe(params => {
      this.errorMessage = params['message'] || this.errorMessage;
    });
  }

  volver(): void {
    this.router.navigate(['/']); // Navega a la página principal o cualquier otra ruta
  }

}
