import { Almacen } from './almacen';
import { Stock } from './stock';
import { Lote } from './lote';
import { Unidad } from './unidad';

export class StockLoteDTO {
    cantidadTotal: number;
    editar: number;
    almacen: Almacen;
    stock: Stock;
    lote: Lote;
    unidad: Unidad;
}