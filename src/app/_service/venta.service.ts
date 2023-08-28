import { Venta } from './../_model/venta';
import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { Cliente } from './../_model/cliente';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentaService extends GenericService<Venta>{

  Ventas = new Subject<Venta[]>();

  protected url: string = `${environment.HOST}/api/backend/ventas`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/api/backend/clientes`);
  }

  registrarRetVenta(venta: Venta) {
    return this.http.post<Venta>(this.url, venta);
  }

  modificarCliente(venta: Venta) {
    return this.http.put<Venta>(`${this.url}/updateclient`, venta);
  }
}
