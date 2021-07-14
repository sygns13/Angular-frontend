import { Almacen } from './almacen';
import { Producto } from './producto';
import { Lote } from './lote';
import { RetiroEntradaProductos } from './retiro_entrada_producto';
import { User } from './user';

export class RetiroEntradaDTO {

    almacen: Almacen;
    producto: Producto;
    lote: Lote;
    retiroEntradaProductos: RetiroEntradaProductos;
    user: User;
}