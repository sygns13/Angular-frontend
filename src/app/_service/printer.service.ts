import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  getPrinters(): Promise<any> {
    return new Promise((resolve, reject) => {
      if ('navigator' in window && 'printers' in navigator) {

         // navigator.printers
          //.enumerate()
          //.then((printers) => {
           // resolve(printers);
          //})
          //.catch((error) => {
           // reject(error);
          //});
      } else {
        reject('La API de impresoras no es compatible con este navegador.');
      }
    });
  }
}
