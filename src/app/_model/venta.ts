import { Comprobante } from './comprobante';
import { Cliente } from "./cliente";
import { Almacen } from './almacen';

export class Venta {
    id: number;
    fecha: string;
    cliente: Cliente;
    comprobante: Comprobante;
    subtotalInafecto: number;
    subtotalAfecto: number;
    igv: number;
    estado: number;
    pagado: number;
    hora: string;
    tipo: number;
    almacen: Almacen;
    activo: number;
    borrado: number;
    numero: number;
}