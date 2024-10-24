export interface TrabajadorDTO {
    idTrabajador: number;
  }
  
  export interface ClienteDTO {
    idCliente: number;
  }
  
  export interface OrdenDTO {
    fecha: string;
    hora: string;
    trabajador: TrabajadorDTO;
    cliente: ClienteDTO;
    fechaEntrega: string;
    estadoOrden: string;
    estado: string;
    observacion: string;
    total: number;
  }
  
  export interface DetalleOrdenDTO {
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }
  
  export interface OrdenConDetallesDTO {
    orden: OrdenDTO;
    detalles: DetalleOrdenDTO[];
  }
  