import { Almacen } from './almacen';
import { Producto } from './producto';
import { Lote } from './lote';
import { Unidad } from './unidad';

export class InventarioDTO {

    cantidadTotal: number;
    lote: Lote;
    unidad: Unidad;
    producto: Producto;
    almacen: Almacen;
}   