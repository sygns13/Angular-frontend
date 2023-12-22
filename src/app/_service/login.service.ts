import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
//import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url: string = `${environment.HOST}/api/security/oauth/token`

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(usuario: string, contrasena: string) {

    const body = `grant_type=${environment.GRANT_TYPE_PASSWORD}&username=${encodeURIComponent(usuario)}&password=${encodeURIComponent(contrasena)}`;

    return this.http.post<any>(this.url, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8').set('Authorization', 'Basic ' + btoa(environment.TOKEN_AUTH_USERNAME + ':' + environment.TOKEN_AUTH_PASSWORD))
    });
  }

  refreshToken(refresh_token: string) {

    const body = `grant_type=${environment.GRANT_TYPE_REFRESH_TOKEN}&refresh_token=${refresh_token}`;

    return this.http.post<any>(this.url, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8').set('Authorization', 'Basic ' + btoa(environment.TOKEN_AUTH_USERNAME + ':' + environment.TOKEN_AUTH_PASSWORD))
    });
  }

  estaLogueado() {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    return token != null;
  }

  /*cerrarSesion() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }*/

  verificarSesion(): Observable<boolean>{

     //1) VERIFICAR SI ESTA LOGUEADO
      let rpta = this.estaLogueado();
      if (!rpta) {
        this.cerrarSesion();
        return of(false);
      } else {
        //2) VERIFICAR SI EL TOKEN NO HA EXPIRADO
        const helper = new JwtHelperService();
        let token = sessionStorage.getItem(environment.TOKEN_NAME);
        if (!helper.isTokenExpired(token)) {
          return of(true);
        } else {
          let refresh_token = sessionStorage.getItem(environment.REFRESH_TOKEN);
          this.refreshToken(refresh_token).subscribe({
            next: (data) => {
              sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
              sessionStorage.setItem(environment.REFRESH_TOKEN, data.refresh_token);

              return of(true);
            },
            error: (error) => {
              //console.log(error);
              this.cerrarSesion();
              return of(false);
            }        
        });          
        }
      }
  }

  async verificarSesion2(): Promise<boolean>{

    return new Promise((resolve, reject) => {
     //1) VERIFICAR SI ESTA LOGUEADO
      let rpta = this.estaLogueado();
      if (!rpta) {
        this.cerrarSesion();
        return resolve(false);
      } else {
        //2) VERIFICAR SI EL TOKEN NO HA EXPIRADO
        const helper = new JwtHelperService();
        let token = sessionStorage.getItem(environment.TOKEN_NAME);
        if (!helper.isTokenExpired(token)) {
          return resolve(true);
        } else {
          let refresh_token = sessionStorage.getItem(environment.REFRESH_TOKEN);
          this.refreshToken(refresh_token).subscribe({
            next: (data) => {
              sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
              sessionStorage.setItem(environment.REFRESH_TOKEN, data.refresh_token);

              return resolve(true);
            },
            error: (error) => {
              //console.log(error);
              this.cerrarSesion();
              return resolve(false);
            }        
        });          
        }
      }
    })
  }

  cerrarSesion() {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);

    if (token) {
      this.http.get(`${environment.HOST}/api/security/tokens/anular/${token}`).subscribe(() => {
        sessionStorage.clear();
        this.router.navigate(['login']);
      });
    } else {
      sessionStorage.clear();
      this.router.navigate(['login']);
    }
  }

  enviarCorreo(correo: string) {
    return this.http.post<number>(`${environment.HOST}/api/security/login/enviarCorreo`, correo, {
      headers: new HttpHeaders().set('Content-Type', 'text/plain')
    });
  }

  verificarTokenReset(token: string) {
    return this.http.get<number>(`${environment.HOST}/api/security/login/restablecer/verificar/${token}`);
  }

  restablecer(token: string, clave: string) {
    return this.http.post(`${environment.HOST}/api/security/login/restablecer/${token}`, clave, {
      headers: new HttpHeaders().set('Content-Type', 'text/plain')
    });
  }

}
