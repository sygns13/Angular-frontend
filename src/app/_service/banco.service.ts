import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { Banco } from './../_model/banco';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { of, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class BancoService extends GenericService<Banco>  {

  bancos = new Subject<Banco[]>();

  protected url: string = `${environment.HOST}/api/backend/bancos`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/api/backend/bancos`);
  }

  altaBaja(id: number, valor: number) {
    return this.http.get(`${this.url}/altabaja/${id}/${valor}`);
  }

  listarPageable(p: number, s:number, txtBuscar:String){
    return this.http.get<any>(`${this.url}?page=${p}&size=${s}&buscar=${txtBuscar}`);
    
  }

  listarAll(){
    return this.http.get<Banco[]>(`${this.url}/listar-all`);
  }
}
