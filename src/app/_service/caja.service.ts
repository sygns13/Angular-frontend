import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { Caja } from './../_model/caja';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { of, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class CajaService extends GenericService<Caja>  {

  Cajas = new Subject<Caja[]>();

  protected url: string = `${environment.HOST}/api/backend/cajas`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/api/backend/cajas`);
  }

  altaBaja(id: number, valor: number) {
    return this.http.get(`${this.url}/altabaja/${id}/${valor}`);
  }

  listarPageable(p: number, s:number, txtBuscar:String, idAlmacen:number){
    return this.http.get<any>(`${this.url}?page=${p}&size=${s}&buscar=${txtBuscar}&almacen_id=${idAlmacen}`);
    
  }

  listarAllByAlmacen(txtBuscar:String, idAlmacen:number){
    return this.http.get<any>(`${this.url}/get_by_almacen?buscar=${txtBuscar}&almacen_id=${idAlmacen}`);
    
  }

  listarAll(){
    return this.http.get<Caja[]>(`${this.url}/listar-all`);
  }
}
