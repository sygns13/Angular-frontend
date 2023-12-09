import { TipoComprobante } from "./tipo_comprobante";
import { Almacen } from './almacen';

export class FacturaProveedor {
    id: number;
    serie: string;
    numero: string;
    fecha: string;
    tipoComprobante: TipoComprobante;
    almacen: Almacen;
    estado: string;
    observaciones: string;
    activo: number;
    borrado: number;
}