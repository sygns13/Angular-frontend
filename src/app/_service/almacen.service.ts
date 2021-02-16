import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Departamento } from '../_model/departamento';
import { Provincia } from './../_model/provincia';
import { Distrito } from './../_model/distrito';
import { Almacen } from './../_model/almacen';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class AlmacenService extends GenericService<Almacen> {

  departamentos = new Subject<Departamento[]>();
  provincias = new Subject<Provincia[]>();
  distritos = new Subject<Distrito[]>();
  almacens = new Subject<Almacen[]>();

  mensajeCambio = new Subject<string>();

  protected url: string = `${environment.HOST}/almacens`
  private urlGetDepartamento: string = `${environment.HOST}/almacens/departamentos`
  private urlGetProvincia: string = `${environment.HOST}/almacens/provincias`
  private urlGetDistrito: string = `${environment.HOST}/almacens/distritos`

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/almacens`);
  }

  getDepartamentos(idPais: number) {
    return this.http.get<Departamento[]>(`${this.urlGetDepartamento}/${idPais}`);
  }

  getProvincias(idDep: number) {
    return this.http.get<Provincia[]>(`${this.urlGetProvincia}/${idDep}`);
  }

  getDistritos(idProv: number) {
    return this.http.get<Distrito[]>(`${this.urlGetDistrito}/${idProv}`);
  }

  altaBaja(id: number, valor: number) {
    return this.http.get(`${this.url}/altabaja/${id}/${valor}`);
  }
/*
  listar() {
    return this.http.get<Almacen[]>(this.url);
  }

   registrar(almacen: Almacen) {
    return this.http.post(this.url, almacen);
  } */
}
