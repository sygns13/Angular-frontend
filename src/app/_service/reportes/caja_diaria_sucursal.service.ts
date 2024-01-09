import { Injectable } from '@angular/core';
//import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
//import { IngresoSalidaCaja } from '../_model/ingreso_salida_caja';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CajaSucursalDTO } from 'src/app/_model/cajasucursal_dto';
import { FiltroGeneral } from 'src/app/_util/filtro_general';


@Injectable({
  providedIn: 'root'
})
export class CajaDiariaSucursalService {

  cajaSucursalDTO = new Subject<CajaSucursalDTO[]>();

  protected url: string = `${environment.HOST}/api/backend/caja_reportes`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
  }

  getCajaDiaria(fecha:String, almacen_id:number){
    return this.http.get<CajaSucursalDTO>(`${this.url}/get-caja-diaria?almacen_id=${almacen_id}&fecha=${fecha}`);
  }

  getResumenCaja(filtro: FiltroGeneral) {
    return this.http.post<CajaSucursalDTO>(`${this.url}/get_resumen_caja`, filtro);
  }
}
