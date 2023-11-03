import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { TipoComprobante } from '../_model/tipo_comprobante';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoComprobanteService extends GenericService<TipoComprobante> {

  tipoComprobantes = new Subject<TipoComprobante[]>();

  protected url: string = `${environment.HOST}/api/backend/tipocomprobantes`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/api/backend/tipocomprobantes`);
  }

  altaBaja(id: number, valor: number) {
    return this.http.get(`${this.url}/altabaja/${id}/${valor}`);
  }

  listarPageable(p: number, s:number, txtBuscar:String){
    return this.http.get<any>(`${this.url}?page=${p}&size=${s}&buscar=${txtBuscar}`);
  }

  listarAll(){
    return this.http.get<TipoComprobante[]>(`${this.url}/listar-all`);
  }
}
