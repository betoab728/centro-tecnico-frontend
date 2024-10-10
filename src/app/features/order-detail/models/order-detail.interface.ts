export interface OrderDetail {
    idDetalleOrden: number;
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    createdAt: Date;
    updatedAt: Date;
  }