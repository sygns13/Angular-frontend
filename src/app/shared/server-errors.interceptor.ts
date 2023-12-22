import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
//import { MatSnackBar } from '@angular/material/snack-bar';
import {MessageService} from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs'; 
import { tap, catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoginService } from '../_service/login.service';

@Injectable({
    providedIn: 'root'
})
export class ServerErrorsInterceptor implements HttpInterceptor {

    constructor(private router : Router,  private messageService: MessageService,
                private loginService: LoginService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        //console.log("stage 2 -> " + request.url);
        /*
        const url = request.url;
        const isSesion = !url.includes('api/security');
        if(!isSesion){
            return next.handle(request);
          }*/

        return next.handle(request).pipe(retry(environment.REINTENTOS))
            .pipe(tap(event => {
                if (event instanceof HttpResponse) {
                    if (event.body && event.body.error === true && event.body.errorMessage) {
                        //console.log("event");
                        //console.log(event.body);
                        throw new Error(event.body.errorMessage);
                    }/*else{
                        this.snackBar.open("EXITO", 'AVISO', { duration: 5000 });    
                    }*/
                }
            })).pipe(catchError((err) => {                
                //https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
                //console.log(err);

                if (err.status === 400) {
                    if(err != null && err.error != null && err.error.mensaje != undefined && err.error.mensaje != null){
                        this.messageService.add({severity:'error', summary:'Advertencia', detail: err.error.mensaje, key: 'toastInterceptor'});
                    }else{
                        this.messageService.add({severity:'error', summary:'Advertencia', detail: "No se enviaron los datos correctamente", key: 'toastInterceptor'});
                    }
                    
                    //this.snackBar.open(err.message, 'ERROR 400', { duration: 5000 });
                }
                else if (err.status === 404){
                    //this.snackBar.open('No existe el recurso', 'ERROR 404', { duration: 5000 });
                    if(err != null && err.error != null && err.error.mensaje != undefined && err.error.mensaje != null){
                        this.messageService.add({severity:'warn', summary:'Advertencia', detail: err.error.mensaje, key: 'toastInterceptor'});
                    }else{
                        this.messageService.add({severity:'warn', summary:'Advertencia', detail: "No se encontró el dato buscado", key: 'toastInterceptor'});
                    }
                }
                else if (err.status === 401) {

                   /*  //let respRefresh = await this.loginService.verificarSesion();
                    let refresh_token = sessionStorage.getItem(environment.REFRESH_TOKEN);
                    this.loginService.refreshToken(refresh_token).subscribe({
                        next: (data) => {
                          sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
                          sessionStorage.setItem(environment.REFRESH_TOKEN, data.refresh_token);
                        },
                        error: (error) => {
                          console.log(error);
                          if(err != null && err.error != null && err.error.mensaje != undefined && err.error.mensaje != null){
                            this.messageService.add({severity:'error', summary:'Sesión Caducada', detail: err.error.mensaje, key: 'toastInterceptor'});
                        }else{
                            this.messageService.add({severity:'error', summary:'Sesión Caducada', detail: "Vuelva a iniciar sesión", key: 'toastInterceptor'});
                        }
    
                        //this.snackBar.open(err.error.error_description, 'ERROR 403', { duration: 5000 });
                        sessionStorage.clear();
                        this.router.navigate(['/login']);
                        }        
                    });    */      
                    
                    if(err != null && err.error != null && err.error.mensaje != undefined && err.error.mensaje != null){
                        this.messageService.add({severity:'error', summary:'Sesión Caducada', detail: err.error.mensaje, key: 'toastInterceptor'});
                    }else{
                        this.messageService.add({severity:'error', summary:'Sesión Caducada', detail: "Vuelva a iniciar sesión", key: 'toastInterceptor'});
                    }

                    //this.snackBar.open(err.error.error_description, 'ERROR 403', { duration: 5000 });
                    sessionStorage.clear();
                    this.router.navigate(['/login']);
                }
                else if (err.status === 403) {

                    if(err != null && err.error != null && err.error.mensaje != undefined && err.error.mensaje != null){
                        this.messageService.add({severity:'error', summary:'Ingreso Prohibido', detail: err.error.mensaje, key: 'toastInterceptor'});
                    }else{
                        this.messageService.add({severity:'error', summary:'Ingreso Prohibido', detail: "Vuelva a iniciar sesión", key: 'toastInterceptor'});
                    }

                    //this.snackBar.open(err.error.error_description, 'ERROR 403', { duration: 5000 });
                    sessionStorage.clear();
                    this.router.navigate(['/login']);
                }
                else if (err.status === 500) {
                    //this.snackBar.open(err.error.mensaje, 'ERROR 500', { duration: 5000 });
                    if(err != null && err.error != null && err.error.mensaje != undefined && err.error.mensaje != null){
                        this.messageService.add({severity:'error', summary:'Error Interno', detail: err.error.mensaje, key: 'toastInterceptor'});
                    }else{
                        this.messageService.add({severity:'error', summary:'Error Interno', detail: "Error del servidor, pruebe nuevamente, si continúa por favor comuníquese con el administrador", key: 'toastInterceptor'});
                    }
                }
                else {
                    //this.snackBar.open(err.error.mensaje, 'ERROR', { duration: 5000 });
                    if(err != null && err.error != null && err.error.mensaje != undefined && err.error.mensaje != null){
                        this.messageService.add({severity:'error', summary:'Error Interno', detail: err.error.mensaje, key: 'toastInterceptor'});
                    }else{
                        this.messageService.add({severity:'error', summary:'Error Interno', detail: "Error del servidor, pruebe nuevamente, si continúa por favor comuníquese con el administrador", key: 'toastInterceptor'});
                    }
                }
                //return EMPTY;
                return throwError(() => err);
            }));
    }
}