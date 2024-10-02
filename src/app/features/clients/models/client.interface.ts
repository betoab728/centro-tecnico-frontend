export interface Client {
    idCliente: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    dni: string;
    telefono: string;
    direccion: string;
    correo: string;
    estado: string; // 'a' para activo, 'i' para inactivo
    createdAt: Date;
    updatedAt: Date;
  }