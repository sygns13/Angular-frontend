import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';
import { Lote } from './../_model/lote';


@Injectable({
  providedIn: 'root'
})
export class LoteService extends GenericService<Lote> {

  lotes = new Subject<Lote[]>();

  mensajeCambio = new Subject<string>();

  protected url: string = `${environment.HOST}/lotes`
 
  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/lotes`);
  }

  registrarNuevoLote(t: Lote) {
    return this.http.post(`${this.url}/ingresolote`, t);
  }
}
