export interface Worker {
    idTrabajador: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    sexo: string; // 'm' para masculino, 'f' para femenino
    dni: string;
    fechaNacimiento: Date;
    telefono: string;
    direccion: string;
    correo: string;
    position: any; // Puedes definir una interfaz específica para Cargo si es necesario
    estado: string; // 'a' para activo, 'i' para inactivo
    createdAt: Date;
    updatedAt: Date;
  }