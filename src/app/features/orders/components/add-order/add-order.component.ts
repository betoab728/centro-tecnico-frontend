import {  FormArray, FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
//importamos la interfaz cliente y el servicio de clientes
import { Client } from './../../../clients/models/client.interface';
import { ClientsService } from './../../../clients/services/clients.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Subject, debounceTime, switchMap, startWith, tap } from 'rxjs';

@Component({
  selector: 'app-add-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,NgSelectModule,InfiniteScrollDirective],
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.css'
})
export class AddOrderComponent implements OnInit {

  ordenForm: FormGroup;
  clients: Client[] = []; // Listado de clientes
  page = 1;  // Para paginación
  size = 10; 
  loading = false;  // Indicador de carga
  searchTerm = new Subject<string>(); // Subject para los términos de búsqueda

 
  constructor(private fb: FormBuilder , private clientsService: ClientsService) {
    this.ordenForm = this.fb.group({
      cliente: ['', Validators.required],
      descripcion: ['', Validators.required],
      items: this.fb.array([]), // Inicializamos el array de ítems
    });
  }


  //al cargar el componente
  ngOnInit(): void {
    //obtener los clientes
    this.clientsService.clients$.subscribe((clients) => {
      this.clients = clients;
    });
    this.clientsService.getClients().subscribe();
  }

  cargarClientes(): void {
    this.loading = true;
    this.clientsService.getClients(this.page).subscribe((newClients) => {
      this.clients = [...this.clients, ...newClients.map((client) => ({
        ...client,
        nombreCompleto: `${client.nombre} ${client.apellidoPaterno} ${client.apellidoMaterno}`,
      }))];
      this.loading = false;
    });
  }

  onScroll(): void {
    if (!this.loading) {
      this.page++;
      this.cargarClientes();
    }
  }
    // Configura la búsqueda reactiva
    configurarBusqueda() {
      this.searchTerm
        .pipe(
          startWith(''), // Comenzar con un string vacío
          debounceTime(300), // Esperar 300ms después de que el usuario deje de escribir
          switchMap((term) => this.clientsService.getClients(this.page, this.size)) // Cambia a la nueva búsqueda
        )
        .subscribe((clients) => {
          this.clients = clients;
        });
    }

  // Método para cargar más clientes al hacer scroll
  cargarMasClientes() {
    this.page++;
    this.cargarClientes();
  }

  // Método para actualizar la búsqueda
  buscar(term: string) {
    this.searchTerm.next(term);
  }


 // Getter para el FormArray de ítems
 get items(): FormArray {
  return this.ordenForm.get('items') as FormArray;
}

  // Método para agregar un nuevo ítem
  agregarItem() {
    const itemForm = this.fb.group({
      descripcion: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0)]],
    });
    this.items.push(itemForm);
  }

   // Método para eliminar un ítem por índice
   eliminarItem(index: number) {
    this.items.removeAt(index);
  }

  get itemsControls(): FormGroup[] {
    return this.items.controls as FormGroup[];
  }

    // Método para calcular el subtotal de un ítem
    calcularSubtotal(item: any): number {
      return item.cantidad * item.precio;
    }

      // Método para calcular el total de la orden
  get total(): number {
    return this.items.controls.reduce(
      (acc, item) => acc + this.calcularSubtotal(item.value),
      0
    );
  }
   // Método para manejar la acción de envío del formulario
   agregarOrden() {
    if (this.ordenForm.valid) {
      console.log('Orden:', this.ordenForm.value);
      // Aquí puedes enviar la orden al backend
      this.ordenForm.reset();
      this.items.clear();
    } else {
      console.log('Formulario no válido');
    }
  }

}
