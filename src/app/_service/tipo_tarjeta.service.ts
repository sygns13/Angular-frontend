import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { TipoTarjeta } from '../_model/tipo_tarjeta';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TipoTarjetaService extends GenericService<TipoTarjeta>{

  tipoTarjetas = new Subject<TipoTarjeta[]>();

  protected url: string = `${environment.HOST}/api/backend/tipotarjetas`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/api/backend/tipotarjetas`);
  }

  altaBaja(id: number, valor: number) {
    return this.http.patch(`${this.url}/altabaja/${id}/${valor}`, null);
  }

  listarPageable(p: number, s:number, txtBuscar:String){
    return this.http.get<any>(`${this.url}?page=${p}&size=${s}&buscar=${txtBuscar}`);
  }

  listarAll(){
    return this.http.get<TipoTarjeta[]>(`${this.url}/listar-all`);
  }
}
