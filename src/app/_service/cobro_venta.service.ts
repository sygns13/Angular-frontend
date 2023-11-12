import { CobroVenta } from './../_model/cobro_venta';
import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CobroVentaService extends GenericService<CobroVenta>{

  detalleMetodoPago = new Subject<CobroVenta[]>();

  protected url: string = `${environment.HOST}/api/backend/detalle-metodo-pago`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/api/backend/detalle-metodo-pago`);
  }

  altaBaja(id: number, valor: number) {
    return this.http.patch(`${this.url}/altabaja/${id}/${valor}`, null);
  }

  listarPageable(p: number, s:number, txtBuscar:String, metodos_pago_id: number, banco_id: number){
    return this.http.get<any>(`${this.url}?page=${p}&size=${s}&buscar=${txtBuscar}&metodos_pago_id=${metodos_pago_id}&banco_id=${banco_id}`);
  }

  listarAll(metodos_pago_id: number, banco_id: number){
    return this.http.get<CobroVenta[]>(`${this.url}/listar-all?metodos_pago_id=${metodos_pago_id}&banco_id=${banco_id}`);
  }
}
