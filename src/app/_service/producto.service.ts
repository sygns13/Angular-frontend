import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Producto } from './../_model/producto';
import { TipoProducto } from './../_model/tipo_producto';
import { Marca } from './../_model/marca';
import { Presentacion } from './../_model/presentacion';
import { FiltroGeneral } from '../_util/filtro_general';

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends GenericService<Producto> {

  productos = new Subject<Producto[]>();

  private urlGetProducto: string = `${environment.HOST}/api/backend/productos/tipos`
  private urlGetMarca: string = `${environment.HOST}/api/backend/productos/marcas`
  private urlGetPresentacion: string = `${environment.HOST}/api/backend/productos/presentaciones`

  protected url: string = `${environment.HOST}/api/backend/productos`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/api/backend/productos`);
  }

  altaBaja(id: number, valor: number) {
    return this.http.get(`${this.url}/altabaja/${id}/${valor}`);
  }

  getTipoProductos() {
    return this.http.get<TipoProducto[]>(`${this.urlGetProducto}`);
  }

  getMarcas() {
    return this.http.get<Marca[]>(`${this.urlGetMarca}`);
  }

  getPresentaciones() {
    return this.http.get<Presentacion[]>(`${this.urlGetPresentacion}`);
  }

  listarPageable(p: number, s:number, txtBuscar:String){
    return this.http.get<any>(`${this.url}?page=${p}&size=${s}&buscar=${txtBuscar}`);
  }

  getProductosBajoStock(filtros: FiltroGeneral) {
    return this.http.post<any>(`${this.url}/productosbajostock`, filtros);
  }

  getProductosVencidos(filtros: FiltroGeneral) {
    return this.http.post<any>(`${this.url}/productosvencidos`, filtros);
  }

}
