import { TipoTarjeta } from './tipo_tarjeta';
import { Banco } from "./banco";
import { MetodoPago } from './metodo_pago';

export class DetalleMetodoPago {
    id: number;
    tipoTarjetaId: number;
    bancoId: number;
    numeroCuenta: string;
    numeroCelular: string;
    activo: number;
    borrado: number;
    banco: Banco;
    tipoTarjeta: TipoTarjeta;
    metodoPago: MetodoPago;
}