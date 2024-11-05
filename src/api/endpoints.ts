import { environment } from './environment'; 


export const Endpoints = {
    clientes: `${environment.apiUrl}/clientes`,
    trabajadores: `${environment.apiUrl}/trabajadores`,
    login: `${environment.apiUrl}/auth/login`,
    cargos: `${environment.apiUrl}/cargos`,
    ordenes: `${environment.apiUrl}/ordenes`,
    detalleOrdenes: `${environment.apiUrl}/detalleOrden`,
    usuarios: `${environment.apiUrl}/usuarios`,
    reporteOrdenes: `${environment.apiUrlReportes}/reporteOrdenes`,
    dashboad: `${environment.apiUrl}/ordenes/dashboard`,
  };