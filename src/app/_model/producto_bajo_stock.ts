import { Almacen } from './almacen';
import { Stock } from './stock';
import { Producto } from './producto';

export class InventarioDTO {

    producto: Producto;
    almacen: Almacen;
    stock: Stock;
}   