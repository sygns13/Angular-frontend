import { DatosUser } from './datos_user';
import { TipoUser } from './tipo_user';

export class User {
    id: number;
    name: string;
    email: string;
    password: string;
    tipoUser: TipoUser;
    almacenId: number;
    activo: number;
    borrado: number;
    datos: DatosUser;

    modificarPassword: number;
}