import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { Presentacion } from './../_model/presentacion';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PresentacionService extends GenericService<Presentacion> {

  protected url: string = `${environment.HOST}/api/backend/presentacions`
  mensajeCambio = new Subject<string>();

  presentacions = new Subject<Presentacion[]>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/api/backend/presentacions`);
  }

  altaBaja(id: number, valor: number) {
    return this.http.get(`${this.url}/altabaja/${id}/${valor}`);
  }

  listarPageable(p: number, s:number, txtBuscar:String){
    return this.http.get<any>(`${this.url}?page=${p}&size=${s}&buscar=${txtBuscar}`);
  }

  listarAll(){
    return this.http.get<Presentacion[]>(`${this.url}/listar-all`);
  }
}
