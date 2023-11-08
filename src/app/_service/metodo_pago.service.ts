import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { MetodoPago } from '../_model/metodo_pago';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService extends GenericService<MetodoPago>{

  metodoPago = new Subject<MetodoPago[]>();

  protected url: string = `${environment.HOST}/api/backend/metodopagos`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/api/backend/metodopagos`);
  }

  altaBaja(id: number, valor: number) {
    return this.http.patch(`${this.url}/altabaja/${id}/${valor}`, null);
  }

  listarPageable(p: number, s:number, txtBuscar:String){
    return this.http.get<any>(`${this.url}?page=${p}&size=${s}&buscar=${txtBuscar}`);
  }

  listarAll(){
    return this.http.get<MetodoPago[]>(`${this.url}/listar-all`);
  }
}
