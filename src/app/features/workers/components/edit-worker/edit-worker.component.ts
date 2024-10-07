import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Worker } from '../../models/worker.interface';
import { WorkersService } from '../../services/workers.service';
import { Cargo } from '../../models/cargo.interface';
import { Position } from '../../../positions/models/position.interface';
import { PositionsService } from '../../../positions/services/positions.service';


@Component({
  selector: 'app-edit-worker',
  standalone: true,
  imports: [ FormsModule, CommonModule],
  templateUrl: './edit-worker.component.html',
  styleUrl: './edit-worker.component.css'
})
export class EditWorkerComponent  implements OnInit  {

  //modelo cargo

  cargo: Cargo = {
    id:0
  };

  //modelo worker con todos los campos
  worker: Worker = {
    idTrabajador: 0,
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    sexo: '',
    dni: '',
    fechaNacimiento: new Date(),
    telefono: '',
    direccion: '',
    correo: '',
    cargo: this.cargo,
    estado: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

 // Lista de cargos disponibles
 positions: Position[] = [];

    //constructor
    constructor(
      private workersService: WorkersService,
      private router: Router, 
      private activatedRoute: ActivatedRoute,
      private positionsService: PositionsService
   
    ) { }

  //mensaje de error
  errorMessage: string = '';

    // Método para cargar los cargos desde el servicio
   cargarCargos(): void {
    this.positionsService.getPositions().subscribe({
      next: (positions) => {
        this.positions = positions; // Asignar los cargos a la lista
      },
      error: (error) => {
        console.error('Error al cargar cargos', error);
      }
    });
  }
  //cargar el componente

  ngOnInit(): void {
     // Obtiene el ID del trabajador de la URL
      const id =Number(this.activatedRoute.snapshot.paramMap.get('id'));

      //se cargan los cargos
      this.cargarCargos();

      // Obtiene trabajador por ID
      this.workersService.getWorkerById(id).subscribe(
       
        (worker: Worker) => {
          console.log(worker);
          this.worker = worker;
            console.log(worker);
          // Formatear la fecha de nacimiento al formato yyyy-MM-dd
          if (this.worker.fechaNacimiento) {
            this.worker.fechaNacimiento = new Date(this.worker.fechaNacimiento).toISOString().split('T')[0] as unknown as Date;
          }
        }
      );

       // Selecciona el cargo actual del trabajador
       this.worker.cargo = this.positions.find(position => position.id === this.cargo.id) || this.cargo;
  }

  //actualizar trabajador, primero la validacion luego la confirmacion

  updateWorker(): void {
  
    // Validación básica
    if (!this.worker.nombre || !this.worker.apellidoPaterno || !this.worker.apellidoMaterno || !this.worker.sexo || 
      !this.worker.dni || !this.worker.telefono || !this.worker.direccion || !this.worker.correo ||
       !this.worker.cargo || !this.worker.estado) {
      this.errorMessage = 'Todos los campos son requeridos';
      return;
  
    }

    // Si las validaciones son correctas, proceder con la confirmación
    this.confirmarEditarTrabajador();

  }

   //confirmar editar trabajador
  confirmarEditarTrabajador(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de actualizar este trabajador?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.workersService.updateWorker(this.worker.idTrabajador, this.worker).subscribe({
          next: () => {
            Swal.fire('¡Éxito!', 'Trabajador actualizado con éxito', 'success');
            this.router.navigate(['/admin/trabajadores']);
          },
          error: () => {
            Swal.fire('¡Error!', 'Ha ocurrido un error', 'error');
          }
        });
      }
    });
  }




}
