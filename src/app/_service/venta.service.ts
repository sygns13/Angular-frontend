import { Venta } from './../_model/venta';
import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { Cliente } from './../_model/cliente';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DetalleVenta } from '../_model/detalle_venta';
import { ProductoAddVenta } from '../_model/producto_add_venta';
import { CobroVenta } from '../_model/cobro_venta';
import { FiltroVenta } from '../_util/filtro_venta';

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

  modificarVenta(venta: Venta) {
    return this.http.put<Venta>(`${this.url}`, venta);
  }

  modificarCliente(venta: Venta) {
    return this.http.put<Venta>(`${this.url}/updateclient`, venta);
  }

  agregarProductoAVenta(detalleVenta: DetalleVenta) {
    return this.http.post<Venta>(`${this.url}/add-detalle-venta`, detalleVenta);
  }

  agregarProductoAVentaPorCodigo(productoAddVenta: ProductoAddVenta) {
    return this.http.post<Venta>(`${this.url}/add-producto-venta`, productoAddVenta);
  }

  deleteProductoAVenta(detalleVenta: DetalleVenta) {
    return this.http.post<Venta>(`${this.url}/delete-detalle-venta`, detalleVenta);
  }

  modificarProductoAVenta(detalleVenta: DetalleVenta) {
    return this.http.post<Venta>(`${this.url}/modificar-detalle-venta`, detalleVenta);
  }

  resetVenta(venta: Venta) {
    return this.http.put<Venta>(`${this.url}/resetventa`, venta);
  }

  cobroVenta(cobroVenta: CobroVenta) {
    return this.http.post<CobroVenta>(`${this.url}/cobrarventa`, cobroVenta);
  }

  getVentas(filtro: FiltroVenta, p: number, s:number) {
    return this.http.post<any>(`${this.url}/get-ventas?page=${p}&size=${s}`, filtro);
  }

  generateComprobante(venta: Venta) {
    return this.http.put<Venta>(`${this.url}/generarcomprobante`, venta);
  }
}
