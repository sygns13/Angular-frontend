import { InitComprobante } from "./init_comprobante";

export class Comprobante {
    id: number;
    serie: string;
    numero: string;
    cantidadDigitos: number;
    initComprobante: InitComprobante;
    estado: string;
    activo: number;
    borrado: number;
}