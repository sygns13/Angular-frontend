import { Producto } from './producto';

export class TopProductosVendidosDTO {
    producto: Producto;
    cantidad: number;
    ventas: number;
    importe: number;
}