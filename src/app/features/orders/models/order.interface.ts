export interface Order {
    idOrden: number;
    fecha: string; // LocalDate se puede representar como string en formato 'YYYY-MM-DD'
    hora: string; // LocalTime se puede representar como string en formato 'HH:mm:ss'
    trabajador: any; // Puedes definir una interfaz específica para Trabajador si es necesario
    cliente: any; // Puedes definir una interfaz específica para Cliente si es necesario
    fechaEntrega: string; // LocalDate se puede representar como string en formato 'YYYY-MM-DD'
    estadoOrden: string; // EnumType.STRING se puede representar como string
    estado: string; // 'e' para efectuado, 'a' para anulado, etc.
    observacion: string;
    total: number;
    createdAt: Date;
    updatedAt: Date;
  }