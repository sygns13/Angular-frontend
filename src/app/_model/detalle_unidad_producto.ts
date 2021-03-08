import { Unidad } from "./unidad";

export class DetalleUnidadProducto {
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