import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { Marca } from './../_model/marca';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarcaService extends GenericService<Marca> {

  marcas = new Subject<Marca[]>();

  protected url: string = `${environment.HOST}/api/backend/marcas`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/api/backend/marcas`);
  }

  altaBaja(id: number, valor: number) {
    return this.http.get(`${this.url}/altabaja/${id}/${valor}`);
  }

  listarPageable(p: number, s:number, txtBuscar:String){
    return this.http.get<any>(`${this.url}?page=${p}&size=${s}&buscar=${txtBuscar}`);
  }
}
