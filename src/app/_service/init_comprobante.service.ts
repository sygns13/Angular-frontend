import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { InitComprobante } from '../_model/init_comprobante';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InitComprobanteService extends GenericService<InitComprobante> {

  initComprobantes = new Subject<InitComprobante[]>();

  protected url: string = `${environment.HOST}/api/backend/init-comprobante`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/api/backend/init-comprobante`);
  }

  altaBaja(id: number, valor: number) {
    return this.http.patch(`${this.url}/altabaja/${id}/${valor}`, null);
  }

  listarPageable(p: number, s:number, txtBuscar:String, tipo_comprobante_id: number, almacen_id: number){
    return this.http.get<any>(`${this.url}?page=${p}&size=${s}&buscar=${txtBuscar}&tipo_comprobante_id=${tipo_comprobante_id}&almacen_id=${almacen_id}`);
  }

  listarAll(tipo_comprobante_id: number, almacen_id: number){
    return this.http.get<InitComprobante[]>(`${this.url}/listar-all?tipo_comprobante_id=${tipo_comprobante_id}&almacen_id=${almacen_id}`);
  }
}
