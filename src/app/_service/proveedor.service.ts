import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { Proveedor } from './../_model/proveedor';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoDocumento } from './../_model/tipo_documento';


@Injectable({
  providedIn: 'root'
})
export class ProveedorService extends GenericService<Proveedor>{

  proveedors = new Subject<Proveedor[]>();

  protected url: string = `${environment.HOST}/api/backend/proveedors`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/api/backend/proveedors`);
  }

  altaBaja(id: number, valor: number) {
    return this.http.get(`${this.url}/altabaja/${id}/${valor}`);
  }

  listarPageable(p: number, s:number, txtBuscar:String){
    return this.http.get<any>(`${this.url}?page=${p}&size=${s}&buscar=${txtBuscar}`);
  }

  getTipoDocumentos(){
    return this.http.get<any>(`${this.url}/tipodocumentos`);
  }

  getByDocument(document:String){
    return this.http.get<Proveedor>(`${this.url}/getbydoc/${document}`);
  }

  registrarRetProveedor(proveedor: Proveedor) {
    return this.http.post<Proveedor>(this.url, proveedor);
  }
}
