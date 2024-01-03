import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { User } from './../_model/user';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoDocumento } from './../_model/tipo_documento';

@Injectable({
  providedIn: 'root'
})
export class UserService extends GenericService<User>  {

  users = new Subject<User[]>();

  protected url: string = `${environment.HOST}/api/backend/users`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) { 
    super(http, `${environment.HOST}/api/backend/users`);
  }

  altaBaja(id: number, valor: number) {
    return this.http.get(`${this.url}/altabaja/${id}/${valor}`);
  }

  listarPageable(p: number, s:number, txtBuscar:String){
    return this.http.get<any>(`${this.url}?page=${p}&size=${s}&buscar=${txtBuscar}`);
  }

  listarAll(){
    return this.http.get<any>(`${this.url}/listar_all`);
  }

  getTipoDocumentos(){
    return this.http.get<any>(`${this.url}/tipodocumentos`);
  }

  getByDocument(document:String){
    return this.http.get<User>(`${this.url}/getbydoc/${document}`);
  }

  registrarRetUser(user: User) {
    return this.http.post<User>(this.url, user);
  }
}
