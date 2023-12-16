import { Almacen } from './almacen';

export class IngresoSalidaCaja {
    id: number;
    monto: number;
    concepto: string;
    comprobante: string;
    fecha: string;
    hora: string;
    almacen: Almacen;
    tipo: number;
    tipoComprobante: number;

    activo: number;
    borrado: number;
}