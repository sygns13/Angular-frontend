import { Comprobante } from './comprobante';
import { Cliente } from "./cliente";
import { Almacen } from './almacen';
import { DetalleVenta } from './detalle_venta';

export class Venta {
    id: number;
    fecha: string;
    cliente: Cliente;
    comprobante: Comprobante;
    subtotalInafecto: number;
    subtotalAfecto: number;
    subtotalExonerado: number;
    totalMonto: number;
    totalAfectoIsc: number;
    igv: number;
    isc: number;
    estado: number;
    estadoStr: string;
    pagado: number;
    hora: string;
    tipo: number;
    almacen: Almacen;
    activo: number;
    borrado: number;
    numeroVenta: string;
    detalleVentas: DetalleVenta[];
    cantidadIcbper: number;
    montoIcbper: number;
    initComprobanteId: number;
    importeTotal: number;
    montoCobrado: number;
    montoPorCobrar: number;
}