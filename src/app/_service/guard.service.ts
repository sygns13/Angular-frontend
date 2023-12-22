import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
//import { Menu } from '../_model/menu';
import { LoginService } from './login.service';
import { Observable } from 'rxjs';
//import { MenuService } from './menu.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  private url: string = `${environment.HOST}/oauth/token`

  constructor(private loginService: LoginService,
    private router: Router) { 
    
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return new Promise((resolve, reject) => {
      //1) VERIFICAR SI ESTA LOGUEADO
      let rpta = this.loginService.estaLogueado();
      if (!rpta) {
        this.loginService.cerrarSesion();
        resolve(false);
      } else {
        //2) VERIFICAR SI EL TOKEN NO HA EXPIRADO
        const helper = new JwtHelperService();
        let token = sessionStorage.getItem(environment.TOKEN_NAME);
        if (!helper.isTokenExpired(token)) {
          //3) VERIFICAR SI TIENES EL ROL NECESARIO PARA ACCEDER A ESA PAGINA  

          //url -> /consulta
          //let url = state.url;
          //const decodedToken = helper.decodeToken(token);

          resolve(true);

          /*
          return this.menuService.listarPorUsuario(decodedToken.user_name).pipe(map((data: Menu[]) => {
            this.menuService.setMenuCambio(data);

            let cont = 0;
            for (let m of data) {
              if (url.startsWith(m.url)) {
                cont++;
                break;
              }
            }

            if (cont > 0) {
              return true;
            } else {
              this.router.navigate(['/pages/not-403']);
              return false;
            }

          }));*/

        } else {

          let refresh_token = sessionStorage.getItem(environment.REFRESH_TOKEN);

          this.loginService.refreshToken(refresh_token).subscribe({
            next: (data) => {
              sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
              sessionStorage.setItem(environment.REFRESH_TOKEN, data.refresh_token);

              resolve(true);
            },
            error: (error) => {
              console.log(error);
              this.loginService.cerrarSesion();
              resolve(false);
            }        
        }); 
          
          
          
      /*         subscribe(data => {
            sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
            sessionStorage.setItem(environment.REFRESH_TOKEN, data.refresh_token);

            console.log(data);
            return true;
          }); */

          
        }
      }
    })
    

  }
}
