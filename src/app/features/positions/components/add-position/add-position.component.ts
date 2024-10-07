import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Position } from '../../models/position.interface';
import { PositionsService } from '../../services/positions.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-position',
  standalone: true,
  imports: [ FormsModule, CommonModule , RouterModule],
  templateUrl: './add-position.component.html',
  styleUrl: './add-position.component.css'
})
export class AddPositionComponent {

  //posicion
  position: Position = {
    id: 0,
    nombre: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  //mensaje de error
  errorMessage: string = '';

  //constructor
  constructor(private positionsService: PositionsService ,private router: Router ) { }

  //al cargar el componente
  ngOnInit(): void {
  }

  //agregar posicion
  agregarCargo(): void {

    //console.log(this.position);

    //if de validacion
    if (!this.position.nombre ) {
      this.errorMessage = 'Todos los campos son requeridos';
      return;
    }

    //si las validaciones son correctas
    this.confirmarAgregarCargo();
    

  }

  //confirmar agregar posicion
  confirmarAgregarCargo(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de agregar este cargo?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, agregar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.positionsService.addPosition(this.position).subscribe({
          next: (position) => {
            Swal.fire('Cargo agregado', 'Cargo agregado correctamente', 'success');
            this.router.navigate(['/admin/cargos']);
          },
          error: (error) => {
            console.error('Error al agregar cargo', error);
            Swal.fire('Error', 'Ocurrió un error al agregar el cargo', 'error');
          }
        });
      }
    });
  }



}
