import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Worker } from '../../models/worker.interface';
import { WorkersService } from '../../services/workers.service'; 
import Swal from 'sweetalert2';


@Component({
  selector: 'app-workers-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './workers-list.component.html',
  styleUrl: './workers-list.component.css'
})
export class WorkersListComponent {

   //array de  trabajadores
    workers: Worker[] = [];

    //constructor
    constructor(private workersService: WorkersService) { }

    //al cargar el componente
    ngOnInit(): void {
        //obtener los trabajadores
        this.workersService.workers$.subscribe((workers) => {
            this.workers = workers;
        });
        this.workersService.getWorkers().subscribe();
    }

    //función para eliminar trabajador
  eliminarTrabajador(id:number): void {

    // Preguntar al usuario si está seguro de eliminar el trabajador
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar'
  }).then((result) => {
      if (result.isConfirmed) {
          // Si el usuario confirma la eliminación, se elimina el trabajador
          this.workersService.deleteWorker(id).subscribe(() => {
              // Se actualiza la lista de trabajadores
              this.workersService.getWorkers().subscribe();
          });
          // Se muestra un mensaje de éxito
          Swal.fire(
              'Eliminado!',
              'El trabajador ha sido eliminado.',
              'success'
          );
      }
  });
 
  }

}
