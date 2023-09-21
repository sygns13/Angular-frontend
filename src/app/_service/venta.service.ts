import { Venta } from './../_model/venta';
import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { Cliente } from './../_model/cliente';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DetalleVenta } from '../_model/detalle_venta';
import { ProductoAddVenta } from '../_model/producto_add_venta';

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
}
