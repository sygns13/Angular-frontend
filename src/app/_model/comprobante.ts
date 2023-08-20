import { TipoComprobante } from "./tipo_comprobante";

export class Comprobante {
    id: number;
    serie: string;
    numero: string;
    cantidadDigitos: number;
    tipoComprobante: TipoComprobante;
    estado: string;
    activo: number;
    borrado: number;
}