import { TipoDocumento } from './tipo_documento';

export class Cliente {
    id: number;
    nombre: string;
    tipoDocumento: TipoDocumento;
    documento: string;
    direccion: string;
    telefono: string;
    correo1: string;
    correo2: string;
    activo: number;
    borrado: number;
}