export interface OrderDetail {
    idDetalleOrden: number;
    orden: any; // Puedes definir una interfaz específica para Orden si es necesario
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    createdAt: Date;
    updatedAt: Date;
  }