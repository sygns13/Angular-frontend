export class Almacen {
    id: number;
    nombre: string;
    direccion: string;
    distritoId: number;
    codigo: string;
    activo: number;
    pais: {id: number, nombre: string, inicial: string };
    departamento: {id: number, nombre: string };
    provincia: {id: number, nombre: string };
    distrito: {id: number, nombre: string };
}