import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { UnidadProducto } from '../_model/unidad_producto';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { Almacen } from './../_model/almacen';

@Injectable({
  providedIn: 'root'
})
export class AsignarUnidadService extends GenericService<UnidadProducto> {

  unidadProductos = new Subject<UnidadProducto[]>();

  protected url: string = `${environment.HOST}/detalleunidadproducto`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/detalleunidadproducto`);
  }

  getAlmacens() {
    return this.http.get<Almacen[]>(`${this.url}/almacens`);
  }


  listarGeneral(idAlmacen: number, idProducto: number) {
    return this.http.get<UnidadProducto[]>(`${this.url}/${idAlmacen}/${idProducto}`);
  }
/*
  altaBaja(id: number, valor: number) {
    return this.http.get(`${this.url}/altabaja/${id}/${valor}`);
  }

  listarPageable(p: number, s:number, txtBuscar:String){
    return this.http.get<any>(`${this.url}?page=${p}&size=${s}&buscar=${txtBuscar}`);
  }*/

  
}
