import { Almacen } from './almacen';
import { Stock } from './stock';
import { Producto } from './producto';
import { DetalleUnidadProducto } from './detalle_unidad_producto';

export class InventarioDTO {

    producto: Producto;
    almacen: Almacen;
    stock: Stock;
    detalleUnidadProducto: DetalleUnidadProducto
}   