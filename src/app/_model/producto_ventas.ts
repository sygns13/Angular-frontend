import { Almacen } from './almacen';
import { Producto } from './producto';
import { Stock } from './stock';
import { DetalleUnidadProducto } from './detalle_unidad_producto';

export class ProductoVentas {

    producto: Producto;
    almacen: Almacen;
    stock: Stock;
    detalleUnidadProducto: DetalleUnidadProducto;
}   