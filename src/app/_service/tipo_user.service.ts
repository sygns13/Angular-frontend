import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { TipoUser } from '../_model/tipo_user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoUserService extends GenericService<TipoUser> {

  tipoUsers = new Subject<TipoUser[]>();

  protected url: string = `${environment.HOST}/api/backend/tipousers`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/api/backend/tipousers`);
  }

  altaBaja(id: number, valor: number) {
    return this.http.get(`${this.url}/altabaja/${id}/${valor}`);
  }

  listarPageable(p: number, s:number, txtBuscar:String){
    return this.http.get<any>(`${this.url}?page=${p}&size=${s}&buscar=${txtBuscar}`);
  }

  listarAll(){
    return this.http.get<TipoUser[]>(`${this.url}/listar-all`);
  }
}
