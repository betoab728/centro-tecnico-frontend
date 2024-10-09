import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../models/order.interface';
import { OrderDTO } from '../../models/orderDTO.interface';
//iconos para ver, editar y eliminar
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [ CommonModule, RouterModule, FontAwesomeModule ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent {

  //iconos
  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;

  constructor( private orderService: OrdersService  ) { }

      //mapeo de estados
  

  //cargo las ordenes
  orders: OrderDTO[] = [];

  mapStatus(estadoActual: string): string {
    switch (estadoActual) {
      case 'I':
        return 'Ingresado';
      case 'D':
        return 'Diagnosticado';
      case 'R':
        return 'En reparación';
      case 'C':
        return 'Reparado';
      case 'E':
        return 'Entregado';
      default:
        return 'Desconocido';
    }
  }

  ngOnInit(): void {
    this.orderService.orders$.subscribe(( orders ) => {
      this.orders = orders;
    });
    this.orderService.getOrders().subscribe();
  }

  //actualizar estado de la orden
  updateOrderStatus(id: number, estado: string): void {
    //se abre un modal para actualizar el estado de la orden con un select de los estados
    Swal.fire({
      title: 'Actualizar estado',
      input: 'select',
      inputOptions: {
        'I': 'Ingresado',
        'D': 'Diagnosticado',
        'R': 'En reparación',
        'C': 'Reparado',
        'E': 'Entregado'
      },
      inputPlaceholder: 'Selecciona un estado',
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (newStatus) => {
        return lastValueFrom(this.orderService.updateOrder(id, newStatus));
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Actualizado!',
          text: 'El estado de la orden ha sido actualizado.',
          icon: 'success'
        });
      }
    });
  }

  //eliminar orden

  deleteOrder(id: number): void {
    /* Swal.fire({
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
        this.orderService.deleteOrder(id).subscribe(() => {
          this.orderService.getOrders().subscribe();
        });
        Swal.fire(
          'Eliminado!',
          'La orden ha sido eliminada.',
          'success'
        );
      }
    }); */
  }


}
