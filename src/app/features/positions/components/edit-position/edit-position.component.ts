import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PositionsService } from '../../services/positions.service';
import { Position } from '../../models/position.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-position',
  standalone: true,
  imports: [FormsModule, CommonModule ],
  templateUrl: './edit-position.component.html',
  styleUrl: './edit-position.component.css'
})
export class EditPositionComponent implements OnInit {

    //mensaje de error
    errorMessage: string = '';


  //modelo position

  position: Position = {
    id: 0,
    nombre: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  //constructor
  constructor(private positionsService: PositionsService, private router: Router, private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {
     // Obtiene el ID del alumno de la URL
      const id =Number(this.activatedRoute.snapshot.paramMap.get('id'));

      // Obtiene position por ID
      this.positionsService.getPositionById(id).subscribe(
        (position: Position) => {
          this.position = position;
        }
      );
  }

  //actualizar posicion
  updatePosition(): void {
  
    // Validación básica
    if (!this.position.nombre) {
      this.errorMessage = 'Todos los campos son requeridos';
      return;
    }
  
    // Si las validaciones son correctas, proceder con la confirmación
    this.confirmarEditarCargo();
  }

  confirmarEditarCargo(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de Actualizar este cargo?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, Actualizar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamada al servicio de edición
        this.positionsService.updatePosition(this.position.id, this.position).subscribe({
          next: (updatedPosition) => {
            Swal.fire('Cargo actualizado', 'El cargo fue actualizado correctamente', 'success');
            this.router.navigate(['/admin/cargos']); // Redirige a la lista de cargos
          },
          error: (error) => {
            console.error('Error al editar cargo', error);
            Swal.fire('Error', 'Ocurrió un error al editar el cargo', 'error');
          }
        });
      }
    });
  }
}
