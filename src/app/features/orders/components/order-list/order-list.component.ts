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
import { OrderDetail } from '../../../order-detail/models/order-detail.interface';
import { OrderDetailService } from '../../../order-detail/services/order-detail.service';


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

  constructor( private orderService: OrdersService , private orderDetailService: OrderDetailService   ) { }

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
  updateOrderStatus(id: number): void {
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
        return lastValueFrom(this.orderService.updateOrderState(id, newStatus));
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Actualizado!',
          text: 'El estado de la orden ha sido actualizado.',
          icon: 'success'
        }).then(() => {
          this.orderService.getOrders().subscribe();

      });
    }
    });
  }

  //eliminar orden

  deleteOrder(id: number): void {
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
        this.orderService.deleteOrder(id).subscribe(() => {
          this.orderService.getOrders().subscribe();
        });
        Swal.fire(
          'Eliminado!',
          'La orden ha sido eliminada.',
          'success'
        );
      }
    }); 
  }

  //ver detalle de la orden
  viewOrderDetail(idOrden: number) {
    console.log('Ver detalles de la orden', idOrden);
    lastValueFrom(this.orderDetailService.getOrderDetailById(idOrden)).then(
      (detalles: OrderDetail[]) => {
        if (detalles.length === 0) {
          Swal.fire({
            title: 'Sin Detalles',
            text: 'No se encontraron detalles para esta orden.',
            icon: 'info',
            confirmButtonText: 'Cerrar',
          });
          return;
        }
  
        let detallesHtml = `
        <table class="divide-y divide-sky-300 min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-sky-300">
            ${detalles.map(detalle => `
              <tr>
                <td>${detalle.descripcion}</td>
                <td>${detalle.cantidad}</td>
                <td>${detalle.precioUnitario}</td>
                <td>${detalle.subtotal}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      
        Swal.fire({
          title: 'Detalle de la Orden',
          html: `
            ${detallesHtml}
          `,
          confirmButtonText: 'Cerrar',
        });
      }
    ).catch((error) => {
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los detalles de la orden. Intenta de nuevo más tarde.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
    });
  }
}
