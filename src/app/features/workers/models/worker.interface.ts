import { Cargo } from "./cargo.interface";

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
    cargo: Cargo; 
    estado: string; 
    createdAt: Date;
    updatedAt: Date;
  }