import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
//import { MatSnackBar } from '@angular/material/snack-bar';
import {MessageService} from 'primeng/api';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs'; 
import { tap, catchError, retry } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ServerErrorsInterceptor implements HttpInterceptor {

    constructor(private router : Router,  private messageService: MessageService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(retry(environment.REINTENTOS))
            .pipe(tap(event => {
                if (event instanceof HttpResponse) {
                    if (event.body && event.body.error === true && event.body.errorMessage) {
                        throw new Error(event.body.errorMessage);
                    }/*else{
                        this.snackBar.open("EXITO", 'AVISO', { duration: 5000 });    
                    }*/
                }
            })).pipe(catchError((err) => {                
                //https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
                
                if (err.status === 400) {
                    console.log(err.error);
                    console.log(err.error.mensaje);
                    console.log("aqui");
                    this.messageService.add({severity:'warn', summary:'Advertencia', detail: err.error.mensaje});
                    //this.snackBar.open(err.message, 'ERROR 400', { duration: 5000 });
                }
                else if (err.status === 404){
                    //this.snackBar.open('No existe el recurso', 'ERROR 404', { duration: 5000 });
                    this.messageService.add({severity:'error', summary:'Error 404', detail: 'No existe el recurso'});
                }
                else if (err.status === 401) {
                    console.log(err);
                    this.messageService.add({severity:'error', summary:'Sesión Caducada', detail: 'Vuelva a iniciar sesión'});
                    //this.snackBar.open(err.error.error_description, 'ERROR 403', { duration: 5000 });
                    sessionStorage.clear();
                    this.router.navigate(['/login']);
                }
                else if (err.status === 403) {
                    console.log(err);
                    this.messageService.add({severity:'error', summary:'Ingreso Prohibido', detail: 'Vuelva a iniciar sesión'});
                    //this.snackBar.open(err.error.error_description, 'ERROR 403', { duration: 5000 });
                    sessionStorage.clear();
                    this.router.navigate(['/login']);
                }
                else if (err.status === 500) {
                    //this.snackBar.open(err.error.mensaje, 'ERROR 500', { duration: 5000 });
                    this.messageService.add({severity:'error', summary:'Error 500', detail: 'Error del servidor, pruebe nuevamente, si continúa por favor comuníquese con el administrador'});
                }
                else {
                    //this.snackBar.open(err.error.mensaje, 'ERROR', { duration: 5000 });
                    this.messageService.add({severity:'error', summary:'Error', detail: 'Error del servidor, pruebe nuevamente, si continúa por favor comuníquese con el administrador'});
                }
                return EMPTY;
            }));
    }
}