import { TipoDocumento } from './tipo_documento';

export class DatosUser {
    id: number;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    direccion: string;
    telefono: string;
    tipoDocumento: TipoDocumento;
    documento: string;
    email: string;
    userId: number;
    activo: number;
    borrado: number;
}