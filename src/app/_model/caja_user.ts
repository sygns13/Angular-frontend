import { Caja } from './caja';
import { User } from './user';

export class CajaUser {
    id: number;
    caja: Caja;
    user: User;
    fechaRegistro: string;
    fechaFin: string;
    activo: number;
    borrado: number;
}