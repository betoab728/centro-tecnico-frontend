import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Client } from '../../models/client.interface';
import { ClientsService } from '../../services/clients.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-edit-client',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.css'
})
export class EditClientComponent  implements OnInit {

  //modelo client

  cliente: Client = {
    idCliente: 0,
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    dni: '',
    telefono: '',
    direccion: '',
    correo: '',
    estado: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

      //mensaje de error
      errorMessage: string = '';

  //constructor
  constructor(private clientsService: ClientsService, private router: Router, private activatedRoute: ActivatedRoute) { }

  //cargar el componente
  ngOnInit(): void {
     // Obtiene el ID del cliente de la URL
      const id =Number(this.activatedRoute.snapshot.paramMap.get('id'));

      // Obtiene client por ID
      this.clientsService.getClientById(id).subscribe(
        (client: Client) => {
          this.cliente = client;
        }
      );
  }

  //actualizar cliente, primero la validacion luego la confirmacion
  updateClient(): void {
  
    // Validación básica
    if (!this.cliente.nombre || !this.cliente.apellidoPaterno || !this.cliente.apellidoMaterno || !this.cliente.dni || !this.cliente.telefono ||
       !this.cliente.direccion || !this.cliente.correo || !this.cliente.estado) {
      this.errorMessage = 'Todos los campos son requeridos';
      return;
    }
  
    // Si las validaciones son correctas, proceder con la confirmación
    this.confirmarEditarCliente();
  }

  //confirmar editar cliente
  confirmarEditarCliente(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de editar este cliente?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, editar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientsService.updateClient(this.cliente.idCliente, this.cliente).subscribe({
          next: () => {
            Swal.fire('¡Éxito!', 'Cliente editado con éxito', 'success');
            this.router.navigate(['/admin/clientes']);
          },
          error: () => {
            Swal.fire('¡Error!', 'Ha ocurrido un error', 'error');
          }
        });
      }
    });
  }

}
