import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';
import { Lote } from './../_model/lote';
import { LotesChangeOrden } from '../_model/lotes_change_orden';


@Injectable({
  providedIn: 'root'
})
export class LoteService extends GenericService<Lote> {

  lotes = new Subject<Lote[]>();

  mensajeCambio = new Subject<string>();

  protected url: string = `${environment.HOST}/api/backend/lotes`
 
  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/api/backend/lotes`);
  }

  registrarNuevoLote(t: Lote) {
    return this.http.post(`${this.url}/ingresolote`, t);
  }
  modificarOrden(t: LotesChangeOrden) {
    return this.http.post(`${this.url}/modificarorden`, t);
  }
}
