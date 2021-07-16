import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { Cliente } from './../_model/cliente';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoDocumento } from './../_model/tipo_documento';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends GenericService<Cliente>  {

  clientes = new Subject<Cliente[]>();

  protected url: string = `${environment.HOST}/clientes`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/clientes`);
  }

  altaBaja(id: number, valor: number) {
    return this.http.get(`${this.url}/altabaja/${id}/${valor}`);
  }

  listarPageable(p: number, s:number, txtBuscar:String){
    return this.http.get<any>(`${this.url}?page=${p}&size=${s}&buscar=${txtBuscar}`);
  }

  getTipoDocumentos(){
    return this.http.get<any>(`${this.url}/tipodocumentos`);
  }
}
