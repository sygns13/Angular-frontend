import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { Caja } from './../_model/caja';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { of, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CajaUser } from '../_model/caja_user';
import { CajaInicioCierreDto } from '../_model/caja_inicio_cierre_dto';
import { CajaAccion } from '../_model/Caja_accion';

@Injectable({
  providedIn: 'root'
})
export class CajaService extends GenericService<Caja> {

  Cajas = new Subject<Caja[]>();

  protected url: string = `${environment.HOST}/api/backend/cajas`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/api/backend/cajas`);
  }

  altaBaja(id: number, valor: number) {
    return this.http.get(`${this.url}/altabaja/${id}/${valor}`);
  }

  listarPageable(p: number, s: number, txtBuscar: String, idAlmacen: number) {
    return this.http.get<any>(`${this.url}?page=${p}&size=${s}&buscar=${txtBuscar}&almacen_id=${idAlmacen}`);

  }

  listarAllByAlmacen(txtBuscar: String, idAlmacen: number) {
    return this.http.get<any>(`${this.url}/get_by_almacen?buscar=${txtBuscar}&almacen_id=${idAlmacen}`);
  }

  listarAllByAlmacenAndUser(txtBuscar: String, idAlmacen: number, idUsuario: number) {
    return this.http.get<any>(`${this.url}/get_all_by_almacen_and_user?buscar=${txtBuscar}&almacen_id=${idAlmacen}&user_id=${idUsuario}`);
  }

  listarByAlmacenUser(txtBuscar: String, idAlmacen: number) {
    return this.http.get<any>(`${this.url}/get_by_almacen_user?buscar=${txtBuscar}&almacen_id=${idAlmacen}`);
  }

  listarAll() {
    return this.http.get<Caja[]>(`${this.url}/listar-all`);
  }

  asignarCajaToUser(cajaUser: CajaUser) {
    return this.http.post<any>(`${this.url}/asignar_caja_to_user`, cajaUser);
  }

  eliminarAsignacionCajaToUser(cajaUser: CajaUser) {
    return this.http.post<any>(`${this.url}/eliminar_asignacion_caja_to_user`, cajaUser);
  }

  getLastMontoCaja(cajaInicioCierreDto: CajaInicioCierreDto) {
    return this.http.post<any>(`${this.url}/get_last_caja`, cajaInicioCierreDto);
  }

  getCajaIniciada() {
    return this.http.get<any>(`${this.url}/get_caja_iniciada`);
  }

  iniciarCaja(cajaInicioCierreDto: CajaInicioCierreDto) {
    return this.http.post<any>(`${this.url}/iniciar_caja`, cajaInicioCierreDto);
  }

  cerrarCaja(cajaInicioCierreDto: CajaInicioCierreDto) {
    return this.http.post<any>(`${this.url}/cierre_caja`, cajaInicioCierreDto);
  }

  accionCaja(cajaAccion: CajaAccion) {
    return this.http.post<any>(`${this.url}/caja_accion`, cajaAccion);
  }
}
