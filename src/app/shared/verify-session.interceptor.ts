import { LoginService } from 'src/app/_service/login.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { of,  Observable, EMPTY, tap, catchError, throwError, switchMap  } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable()
export class VerifySessionInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService,
              private router : Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    //console.log("url -> " + request.url);
    const url = request.url;
    const isSesion = !url.includes('api/security');

    if(!isSesion){
      return next.handle(request);
    }

    let rpta = this.loginService.estaLogueado();
    if (!rpta) {
      this.loginService.cerrarSesion();
          sessionStorage.clear();
          this.router.navigate(['/login']);
          return EMPTY;
    } else {
      //2) VERIFICAR SI EL TOKEN NO HA EXPIRADO
      const helper = new JwtHelperService();
      let token = sessionStorage.getItem(environment.TOKEN_NAME);
      if (!helper.isTokenExpired(token)) {
        return next.handle(request);
      } else {
        let refresh_token = sessionStorage.getItem(environment.REFRESH_TOKEN);


        return this.loginService.refreshToken(refresh_token).pipe(
          switchMap((data) => {
            sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
            sessionStorage.setItem(environment.REFRESH_TOKEN, data.refresh_token);
            return next.handle(request.clone({ setHeaders: { authorization: `Bearer ${data.access_token}`  } 
              })
            );
          }),
        );
      }
      }
  }

}



/*
        this.loginService.refreshToken(refresh_token).pipe(tap(event => {
          if (event instanceof HttpResponse) {

            sessionStorage.setItem(environment.TOKEN_NAME, event.body.access_token);
            sessionStorage.setItem(environment.REFRESH_TOKEN, event.body.refresh_token);
            return next.handle(request.clone({ setHeaders: { authorization: `Bearer ${event.body.access_token}`  } 
            }));

          }
      })).pipe(catchError((err) => {   
          sessionStorage.clear();
          this.router.navigate(['/login']);
          return throwError(() => err);
      }));

      */
      
      
      /*
        this.loginService.refreshToken(refresh_token).subscribe({
          next: (data) => {
            sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
            sessionStorage.setItem(environment.REFRESH_TOKEN, data.refresh_token);
            return next.handle(request.clone({ setHeaders: { authorization: `Bearer ${data.access_token}`  } 
            }));
          },
          error: (error) => {
            //console.log(error);
            sessionStorage.clear();
            this.router.navigate(['/login']);
            return throwError(() => error);
          }        
      });   */       
