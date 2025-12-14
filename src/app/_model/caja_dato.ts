import { Caja } from './caja';

export class CajaDato{
    id: number;
    caja: Caja;
    fecha: string;
    fechaInicio: string;
    fechaFinal: string;
    montoInicio: number;
    montoFinal: number;
    montoTemporal: number;
    lastUserId: number;
    accessCount: number;
    estado: number;
}