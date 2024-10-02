export interface User {
    usuarioId: number;
    nombre: string;
    clave: string;
    estado: string; // 'a' para activo, 'i' para inactivo
    createdAt: Date;
    updatedAt: Date;
  }