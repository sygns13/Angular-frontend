import { EntradaStock } from './entrada_stock';
import { MetodoPago } from './metodo_pago';

export class PagoProveedor {
    id: number;
    entradaStock: EntradaStock;
    fecha: string;
    metodoPago: MetodoPago;
    montoPago: number;
    montoReal: number;
    tipoPago: number;
    tipoTarjeta: string;
    siglaTarjeta: string;
    numeroTarjeta: string;
    banco: string;
    numeroCuenta: string;
    numeroCelular: string;
    numeroCheque: string;
    codigoOperacion: string;
    tipoComprobanteId: number;
    activo: number;
    borrado: number;
}