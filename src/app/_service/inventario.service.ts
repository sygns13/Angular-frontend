import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Producto } from './../_model/producto';
import { TipoProducto } from './../_model/tipo_producto';
import { Marca } from './../_model/marca';
import { Presentacion } from './../_model/presentacion';
import { InventarioDTO } from './../_model/inventario_dto';
import { FiltroInventario } from '../_util/filtro_inventario';
import { FiltroProductosVenta } from '../_util/filtro_productos_venta';
import { Almacen } from '../_model/almacen';

@Injectable({
  providedIn: 'root'
})
export class InventarioService extends GenericService<InventarioDTO>  {

  inventario = new Subject<InventarioDTO[]>();

  private urlGetProducto: string = `${environment.HOST}/api/backend/productos/tipos`
  private urlGetMarca: string = `${environment.HOST}/api/backend/productos/marcas`
  private urlGetPresentacion: string = `${environment.HOST}/api/backend/productos/presentaciones`
  protected urlAlmacen: string = `${environment.HOST}/api/backend/detalleunidadproducto`

  protected url: string = `${environment.HOST}/api/backend/productos`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/api/backend/productos`);
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


  getProductoInventario(filtros: FiltroInventario) {
    return this.http.post<any>(`${this.url}/productoinventario`, filtros);
  }

  getAlmacens() {
    return this.http.get<Almacen[]>(`${this.urlAlmacen}/almacens`);
  }

  getProductoPrecios(filtros: FiltroProductosVenta) {
    return this.http.post<any>(`${this.url}/productoprecio`, filtros);
  }

}
