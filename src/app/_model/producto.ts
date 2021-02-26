import { Marca } from './marca';
import { TipoProducto } from './tipo_producto';
import { Presentacion } from './presentacion';

export class Producto {
    id: number;
    nombre: string;
    tipoProducto: TipoProducto;
    marca: Marca;
    stockMinimo: number;
    precioUnidad: number;
    precioCompra: number;
    fecha: string;
    codigoUnidad: string;
    codigoProducto: string;
    presentacion: Presentacion;
    composicion: string;
    prioridad: string;
    ubicacion: string;
    activoLotes: number;
    afectoIsc: number;
    tipoTasaIsc: number;
    tasaIsc: number;
    afectoIgv: number;
    activo: number;
    borrado: number;
}