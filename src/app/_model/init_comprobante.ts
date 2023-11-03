import { TipoComprobante } from "./tipo_comprobante";
import { Almacen } from './almacen';

export class InitComprobante {
    id: number;
    numSerie: number;
    letraSerie: string;
    numero: number;
    numeroActual: number;
    cantidadDigitos: number;
    tipoComprobante: TipoComprobante;
    almacenId: number;
    activo: number;
    borrado: number;
    almacen: Almacen;
    letraSerieStr: string;
    numSerieStr: string;
    numeroStr: string;
    numeroActualStr: string;
}