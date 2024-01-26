import { Almacen } from './almacen';

export class Caja {
    id: number;
    nombre: string;
    almacen: Almacen;
    lockedBy: number;
    lastBalanced: string;
    lastBalancedBy: number;
    lastSettled: string;
    lastSettledBy: number;
    lastUsed: string;
    lastUsedBy: number;
    estado: number;
    isCreatedBy: number;
    isBalanced: number;
    lastSystemSettled: string;
    currencyCode: string;
    activo: number;
    borrado: number;
}