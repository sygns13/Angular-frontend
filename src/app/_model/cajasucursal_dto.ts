import { Almacen } from './almacen';

export class CajaSucursalDTO {
    cajaInicial: number;
    cajaTotal: number;
    
    ingresosVentas: number;
    ingresosOtros: number;

    ingresosTotal: number;

    egresosCompras: number;
    egresosOtros: number;

    egresosTotal: number;

    almacen: Almacen;
}