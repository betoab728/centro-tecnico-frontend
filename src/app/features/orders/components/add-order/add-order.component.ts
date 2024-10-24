import {  FormArray, FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from './../../../clients/models/client.interface';
import { ClientsService } from './../../../clients/services/clients.service';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import {  debounceTime, switchMap, tap } from 'rxjs';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { WorkersService } from '../../../workers/services/workers.service';
import { Worker } from '../../../workers/models/worker.interface';
import Swal from 'sweetalert2';
//importamos orders.service
import { OrdersService } from '../../services/orders.service';
import { OrdenConDetallesDTO } from '../../models/ordenConDetalleDTO.interface';

@Component({
  selector: 'app-add-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,InfiniteScrollDirective,NgLabelTemplateDirective,
     NgOptionTemplateDirective, NgSelectComponent,FontAwesomeModule],
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.css'
})
export class AddOrderComponent implements OnInit {

  ordenForm: FormGroup;
  clients: Client[] = []; // Listado de clientes
  page = 0;  // Para paginación
  size = 10; 
  loading = false;  // Indicador de carga
  searchTerm = new BehaviorSubject<string>('');// Subject para los términos de búsqueda
  items: any[] = [];  //array de items
  total = 0;  // Total de la orden
  faTrash = faTrash;

  //array de  trabajadores
  workers: Worker[] = [];
 
  selectedClient: any;
 
  constructor(
    private fb: FormBuilder 
    , private clientsService: ClientsService,
     private workersService: WorkersService
    , private ordenService: OrdersService) 
     {
    this.ordenForm = this.fb.group({
      cliente: [null, Validators.required], 
      descripcion: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      fechaEntrega: [null, Validators.required],
      trabajador: [null, Validators.required],
      observaciones: ['', Validators.maxLength(500)],
    
    });
  
  }

  //al cargar el componente
  ngOnInit(): void {
    this.configurarBusquedaReactiva();
    this.ordenForm.controls['trabajador'].setValue(''); // Valor por defecto
    this.listarTrabajadores();
  
  }

  listarTrabajadores(): void {
    //obtener los trabajadores
    this.workersService.workers$.subscribe((workers) => {
      this.workers = workers;
  });
  this.workersService.getWorkers().subscribe();
  }


  configurarBusquedaReactiva(): void {
    this.searchTerm
      .pipe(
        debounceTime(300), // Espera 300 ms antes de ejecutar la búsqueda
        switchMap((term) => {
          if (!term) {
            // Si no hay término, devolvemos un Observable vacío
            return of({ content: [] });
          }
          this.loading = true; // Activa el indicador de carga
          return this.clientsService.getClientsPage(term, this.page, this.size);
        }),
        tap(() => (this.loading = false)) // Desactiva el indicador de carga
      )
      .subscribe({
        next: (page) => {
          this.clients = page.content.map((client) => ({
            ...client,
            nombreCompleto: `${client.nombre} ${client.apellidoPaterno} ${client.apellidoMaterno}`,
          }));
        },
        error: (err) => {
          console.error('Error al buscar clientes:', err);
          this.loading = false;
        },
      });
  }

  onSearch(event: { term: string; items: any[] }): void {
    const term = event.term.trim(); // Extrae el término de búsqueda
    this.searchTerm.next(term); // Actualiza el Subject con el término
  }

  onSelectClient(client: Client): void {
    console.log('Cliente seleccionado:', client);
    this.ordenForm.get('cliente')?.setValue(client.idCliente);
  }

  // Método para agregar un nuevo ítem
  agregarItem() {
    const { descripcion, cantidad, precio } = this.ordenForm.value;
    // Añadir el ítem al array
    this.items.push({ descripcion, cantidad, precio, subtotal: cantidad * precio });
    // Actualizar el total
    this.calcularTotal();
    // Resetear los campos de entrada
    this.ordenForm.patchValue({ descripcion: '', cantidad: 1, precio: 0 });
  }

  eliminarItem(index: number) {
    this.items.splice(index, 1);  // Eliminar ítem del array
    this.calcularTotal();  // Recalcular el total
  }

  calcularTotal() {
    this.total = this.items.reduce((acc, item) => acc + item.subtotal, 0);
  }


  formatearPrecio(): void {
    const precioControl = this.ordenForm.get('precio');
    if (precioControl && precioControl.value != null) {
      const valor = parseFloat(precioControl.value);
      if (!isNaN(valor)) {
        precioControl.setValue(valor.toFixed(2)); // Formato con 2 decimales
      } else {
        precioControl.setValue(''); // Limpia el campo si el valor no es válido
      }
    }
  }

  
   // Método para manejar la acción de envío del formulario
   agregarOrden() {
    //sweet alert para validar que el cliente seleccionado no sea nulo
   
    // Verificar si hay un cliente seleccionado
    if (!this.ordenForm.value.cliente) {
      this.mostrarErrorCliente();
      return;
    }

    // Confirmación de la orden
    this.mostrarConfirmacionOrden();

  }

   // Función para mostrar la confirmación de la orden
   mostrarConfirmacionOrden(): void {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Estás seguro de Registrar la orden?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        const ordenConDetallesDTO = this.construirOrdenConDetallesDTO(); // Llama a la función que construye el DTO
        this.enviarOrden(ordenConDetallesDTO); // Envía la orden
      }
    });
  }

   // Función para mostrar el mensaje de error cuando no hay cliente
   mostrarErrorCliente(): void {
    Swal.fire({
      title: 'Error',
      text: 'Debes seleccionar un cliente para la orden.',
      icon: 'error',
      confirmButtonText: 'Cerrar',
    });
  }

  // Función para enviar la orden al backend
  enviarOrden(ordenConDetallesDTO: any): void {
    this.ordenService.addOrder(ordenConDetallesDTO).subscribe({
      next: (response) => {
        console.log('Orden registrada exitosamente:', response);
        this.mostrarExitoRegistro();
      },
      error: (err) => {
        console.error('Error al registrar la orden:', err);
        this.mostrarErrorRegistro();
      },
    });
  }

   // Función para mostrar mensaje de éxito
   mostrarExitoRegistro(): void {
    Swal.fire({
      title: 'Éxito',
      text: 'La orden ha sido registrada correctamente.',
      icon: 'success',
      confirmButtonText: 'Cerrar',
    });
  }

   // Función para mostrar mensaje de error en el registro
   mostrarErrorRegistro(): void {
    Swal.fire({
      title: 'Error',
      text: 'Ocurrió un error al registrar la orden. Inténtalo de nuevo.',
      icon: 'error',
      confirmButtonText: 'Cerrar',
    });
  }

    // Función para construir el DTO de la orden con detalles
    construirOrdenConDetallesDTO(): OrdenConDetallesDTO  {
      return {
        orden: {
          fecha: new Date().toISOString().split('T')[0], // Fecha actual
          hora: new Date().toLocaleTimeString('en-US', { hour12: false }), // Hora actual en formato 24h
          trabajador: {
            idTrabajador: this.ordenForm.value.trabajador,
          },
          cliente: {
            idCliente: this.ordenForm.value.cliente,
          },
          fechaEntrega: this.ordenForm.value.fechaEntrega,
          estadoOrden: 'I', // Estado ingresado
          estado: 'e', // Estado efectuado
          observacion: this.ordenForm.value.observaciones,
          total: this.total,
        },
        detalles: this.items.map(item => ({
          descripcion: item.descripcion,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
          subtotal: item.subtotal,
        })),
      };
    }



}
