import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Producto } from './../_model/producto';
import { TipoProducto } from './../_model/tipo_producto';
import { Marca } from './../_model/marca';
import { Presentacion } from './../_model/presentacion';
import { EntradaSalida } from './../_model/entrada_salida';
import { FiltroGeneral } from '../_util/filtro_general';
import { Almacen } from '../_model/almacen';
import { RetiroEntradaDTO } from '../_model/retiro_entrada_dto';


@Injectable({
  providedIn: 'root'
})
export class EntradaSalidaService extends GenericService<EntradaSalida> {

  EntradaSalida = new Subject<EntradaSalida[]>();

  protected url: string = `${environment.HOST}/retiroentradaproducto`;
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/retiroentradaproducto`);
  }

  getListaEntradaSalidaProductos(filtros: FiltroGeneral) {
    return this.http.post<any>(`${this.url}/listar`, filtros);
  }
}
