import { DetalleEntradaStock } from './detalle_entrada_stock';
import { Proveedor } from './proveedor';
import { FacturaProveedor } from './factura_proveedor';
import { Almacen } from './almacen';

export class EntradaStock {
    id: number;
    numero: string;
    fecha: string;
    hora: string;
    proveedor: Proveedor;
    ordenCompraId: number;
    facturado: number;
    actualizado: number;
    estado: number;
    totalMonto: number;
    facturaProveedor: FacturaProveedor;
    almacen: Almacen;
    detalleEntradaStock: DetalleEntradaStock[];
    estadoStr: string;
    
    importeTotal: number;
    montoPagado: number;
    montoPorPagar: number;   
    activo: number;
    borrado: number;  
}