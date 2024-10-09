/*estos son los campos :   this.idOrden = idOrden;
        this.fecha = fecha;
        this.hora = hora;
        this.nombreCompletoCliente = nombreCompletoCliente;
        this.estadoOrden = estadoOrden;*/

export interface OrderDTO {
    idOrden: number;
    fecha: string;
    hora: string;
    nombreCompletoCliente: string;
    estadoOrden: string;
}