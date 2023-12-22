import { LoginService } from 'src/app/_service/login.service';
import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { Banco } from './../_model/banco';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { of, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class BancoService extends GenericService<Banco>  {

  bancos = new Subject<Banco[]>();

  protected url: string = `${environment.HOST}/api/backend/bancos`
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient,
              private loginService: LoginService) { 
    super(http, `${environment.HOST}/api/backend/bancos`);
  }

  altaBaja(id: number, valor: number) {
    return this.http.get(`${this.url}/altabaja/${id}/${valor}`);
  }

  listarPageable(p: number, s:number, txtBuscar:String){
  //async listarPageable(p: number, s:number, txtBuscar:String): Promise<Observable<any>>{

    /*
    let rpta = this.loginService.estaLogueado();
    if (!rpta) {
      this.loginService.cerrarSesion();
    } else{
      const helper = new JwtHelperService();
        let token = sessionStorage.getItem(environment.TOKEN_NAME);
        if (!helper.isTokenExpired(token)) {
          return this.http.get<any>(`${this.url}?page=${p}&size=${s}&buscar=${txtBuscar}`);
        }
        else{
          let refresh_token = sessionStorage.getItem(environment.REFRESH_TOKEN);

          await this.loginService.refreshToken(refresh_token).subscribe({

            next: (data) => {
              console.log("aqui");
              console.log(data);
              sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
              sessionStorage.setItem(environment.REFRESH_TOKEN, data.refresh_token);

              return this.http.get<any>(`${this.url}?page=${p}&size=${s}&buscar=${txtBuscar}`);
            },
            error: (error) => {
              console.log(error);
              this.loginService.cerrarSesion();
            }        
        }); 
        }
      
    }*/
    //await this.loginService.verificarSesion2();
    return this.http.get<any>(`${this.url}?page=${p}&size=${s}&buscar=${txtBuscar}`);
    
  }

  listarAll(){
    return this.http.get<Banco[]>(`${this.url}/listar-all`);
  }
}
