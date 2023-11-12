import { MetodoPago } from './metodo_pago';
import { Venta } from "./venta";

export class CobroVenta {
    id: number;
    venta: Venta;
    fecha: string;
    metodoPago: MetodoPago;
    importe: number;
    tipoTarjeta: string;
    siglaTarjeta: string;
    numeroTarjeta: string;
    banco: string;
    numeroCuenta: string;
    numeroCelular: string;
    numeroCheque: string;
    codigoOperacion: string;
    initComprobanteId: number;
    activo: number;
    borrado: number;
}