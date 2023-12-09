import { Lote } from './lote';
import { Producto } from './producto';

export class DetalleEntradaStock {
    id: number;
    entradaStockIdReference: number;
    producto: Producto;
    cantidad: number;
    costo: number;
    almacenId: number;
    cantreal: number;
    unidad: string;
    costoTotal: number;
    lote: Lote; 
    activo: number;
    borrado: number;    
}