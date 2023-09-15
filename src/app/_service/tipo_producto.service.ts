import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { TipoProducto } from '../_model/tipo_producto';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoProductoService extends GenericService<TipoProducto> {

  tipoProductos = new Subject<TipoProducto[]>();

  protected url: string = `${environment.HOST}/api/backend/tipoproductos`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/api/backend/tipoproductos`);
  }

  altaBaja(id: number, valor: number) {
    return this.http.get(`${this.url}/altabaja/${id}/${valor}`);
  }

  listarPageable(p: number, s:number, txtBuscar:String){
    return this.http.get<any>(`${this.url}?page=${p}&size=${s}&buscar=${txtBuscar}`);
  }

  listarAll(){
    return this.http.get<TipoProducto[]>(`${this.url}/listar-all`);
  }
}
