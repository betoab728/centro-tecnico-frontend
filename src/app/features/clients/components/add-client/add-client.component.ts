import { Component } from '@angular/core';
import { Router, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client } from '../../models/client.interface';
import { ClientsService } from '../../services/clients.service';
import Swal from 'sweetalert2';  

@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.css'
})
export class AddClientComponent {

  //cliente
  cliente: Client = {
    idCliente: 0,
    dni: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    direccion: '',
    telefono: '',
    correo: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    estado: 'a'
  };

  //mensaje de error
  errorMessage: string = '';

  //constructor
  constructor(private clientsService: ClientsService ,private router: Router ) { }

  //al cargar el componente
  ngOnInit(): void {
  }

  //agregar cliente
  agregarCliente(): void {

    console.log(this.cliente);

    //if de validacion
    if (!this.cliente.dni || !this.cliente.nombre || !this.cliente.apellidoPaterno || !this.cliente.apellidoMaterno || !this.cliente.direccion || !this.cliente.telefono || !this.cliente.correo) {
      this.errorMessage = 'Todos los campos son requeridos';
      return;
    }

    //agregar cliente
    this.clientsService.addClient(this.cliente).subscribe((client) => {
      Swal.fire('Cliente agregado', 'Cliente agregado correctamente', 'success');
      this.router.navigate(['/clientes']);
    });

  }

}
