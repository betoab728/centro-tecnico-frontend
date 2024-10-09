import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Client } from '../../models/client.interface';
import { ClientsService } from '../../services/clients.service';
//importamos sweetalert
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent {

  //array de  trabajadores
  clients: Client[] = [];

  //constructor
  constructor(private clientsService: ClientsService) { }

  //al cargar el componente
  ngOnInit(): void {
      //obtener los trabajadores
      this.clientsService.clients$.subscribe(( clients ) => {
          this.clients = clients; ;
      });
      this.clientsService.getClients().subscribe();
  }

  eliminarCliente(id:number): void {
        // Preguntar al usuario si está seguro de eliminar el trabajador con sweetalert
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
                this.clientsService.deleteClient(id).subscribe(() => {
                    // Se actualiza la lista de trabajadores
                    this.clientsService.getClients().subscribe();
                });
                // Se muestra un mensaje de éxito con sweetalert
                Swal.fire(
                    'Eliminado!',
                    'El trabajador ha sido eliminado.',
                    'success'
                );
            }
        });
      
     }

}
