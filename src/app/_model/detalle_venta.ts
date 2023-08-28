import { Lote } from './lote';
import { Producto } from './producto';

export class DetalleVenta {
    id: number;
    ventaId: number;
    producto: Producto;
    precioVenta: number;
    precioCompra: number;
    cantidad: number;
    almacenId: number;
    esGrabado: number;
    descuento: number;
    tipDescuento: number;
    cantidadReal: number;
    unidad: string;
    Lote: Lote;
    activo: number;
    borrado: number;    
}