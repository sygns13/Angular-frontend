import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { IngresoSalidaCaja } from '../_model/ingreso_salida_caja';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FiltroGeneral } from '../_util/filtro_general';

@Injectable({
  providedIn: 'root'
})
export class IngresoSalidaCajaService extends GenericService<IngresoSalidaCaja>  {

  ingresoSalidaCajas = new Subject<IngresoSalidaCaja[]>();

  protected url: string = `${environment.HOST}/api/backend/ingreso_salida_cajas`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/api/backend/ingreso_salida_cajas`);
  }

/*   altaBaja(id: number, valor: number) {
    return this.http.get(`${this.url}/altabaja/${id}/${valor}`);
  } */

  listarPageable(p: number, s:number, txtBuscar:String, almacen_id:number){
    return this.http.get<any>(`${this.url}?page=${p}&size=${s}&almacen_id=${almacen_id}&buscar=${txtBuscar}`);
  }

  listarAll(){
    return this.http.get<IngresoSalidaCaja[]>(`${this.url}/listar-all`);
  }

  getIngresosCaja(filtros: FiltroGeneral) {
    return this.http.post<any>(`${this.url}/ingresos_otros`, filtros);
  }
}
