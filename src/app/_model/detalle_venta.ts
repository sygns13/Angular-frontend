import { Lote } from './lote';
import { Producto } from './producto';

export class DetalleVenta {
    id: number;
    ventaIdReference: number;
    producto: Producto;
    precioVenta: number;
    precioCompra: number;
    cantidad: number;
    almacenId: number;
    esGrabado: number;
    esIsc: number;
    descuento: number;
    tipDescuento: number;
    cantidadReal: number;
    unidad: string;
    precioTotal: number;
    lote: Lote;
    activo: number;
    borrado: number;    
}