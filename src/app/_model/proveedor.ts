import { TipoDocumento } from './tipo_documento';

export class Proveedor {
    id: number;
    nombre: string;
    tipoDocumento: TipoDocumento;
    documento: string;
    direccion: string;
    telefono: string;
    anexo: string;
    celular: string;
    responsable: string;

    activo: number;
    borrado: number;
}