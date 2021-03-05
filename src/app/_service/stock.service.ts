import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Departamento } from '../_model/departamento';
import { Provincia } from './../_model/provincia';
import { Distrito } from './../_model/distrito';
import { Almacen } from './../_model/almacen';
import { StockLoteDTO } from './../_model/stock_lote_dto';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';
import { Stock } from '../_model/stock';


@Injectable({
  providedIn: 'root'
})
export class StockService extends GenericService<Stock> {

  departamentos = new Subject<Departamento[]>();
  provincias = new Subject<Provincia[]>();
  distritos = new Subject<Distrito[]>();
  almacens = new Subject<Almacen[]>();
  stockLoteDTOs = new Subject<StockLoteDTO[]>();

  mensajeCambio = new Subject<string>();

  protected url: string = `${environment.HOST}/stocks`

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/stocks`);
  }

  getAlmacens() {
    return this.http.get<any>(`${this.url}/almacens`);
  }
  listarDTO(idAlmacen: number, idProd: number){
    return this.http.get<any>(`${this.url}/${idAlmacen}/${idProd}`);
  }
}
