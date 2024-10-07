import { Component,OnInit } from '@angular/core';
import { Router, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Worker } from '../../models/worker.interface';
import { Position } from '../../../positions/models/position.interface';
import { WorkersService } from '../../services/workers.service';
//importar positions o cargos
import { PositionsService } from '../../../positions/services/positions.service';
import Swal from 'sweetalert2';
import { Cargo } from '../../models/cargo.interface';

@Component({
  selector: 'app-add-worker',
  standalone: true,
  imports: [ FormsModule, CommonModule, RouterModule],
  templateUrl: './add-worker.component.html',
  styleUrl: './add-worker.component.css'
})
export class AddWorkerComponent implements OnInit {

  //objeto cargo

  cargo: Cargo = {
    id: 0
  };

   // Lista de cargos disponibles
   positions: Position[] = [];



    // Trabajador
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
      createdAt: new Date(),
      updatedAt: new Date(),
      estado: 'a'

    };

  //mensaje de error
  errorMessage: string = '';

  //constructor
  constructor(
    private workersService: WorkersService ,
    private positionsService: PositionsService,
    private router: Router
   ) { }

  //al cargar el componente

  ngOnInit(): void {
    //cargar posiciones
    this.cargarCargos(); 
  }

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

  //agregar trabajador
  agregarTrabajador(): void {

  

    console.log('nombre: '+ this.worker);

    //if de validacion
    if (!this.worker.nombre || !this.worker.apellidoPaterno || !this.worker.apellidoMaterno || !this.worker.sexo || 
      !this.worker.dni || !this.worker.fechaNacimiento || !this.worker.telefono || !this.worker.direccion || !this.worker.correo ||
       !this.worker.cargo || !this.worker.cargo.id) {
      this.errorMessage = 'Todos los campos son requeridos';
      return;
    }

    //si las validaciones son correctas
    this.confirmarAgregarTrabajador();
  
  }

  //confirmar agregar trabajador


  //confirmar agregar cliente

  confirmarAgregarTrabajador(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de agregar este cliente?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, agregar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.workersService.addWorker(this.worker).subscribe({
          next: (worker) => {
            Swal.fire('¡Trabajador agregado!', `Trabajador ${worker.nombre} ${worker.apellidoPaterno} agregado con éxito`, 'success');
            this.router.navigate(['/admin/trabajadores']);
          },
          error: (error) => {
            Swal.fire('¡Error!', 'Ha ocurrido un error al agregar el trabajador', 'error');
          }
        });
       
      }
    });
  }


}
