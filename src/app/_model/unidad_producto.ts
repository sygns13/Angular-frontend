import { Unidad } from './unidad';

export class UnidadProducto {
    id: number;
    productoId: number;
    unidad: Unidad;
    codigoUnidad: string;
    precio: number;
    costoCompra: number;
    almacenId: number;
    activo: number;
    borrado: number;

}