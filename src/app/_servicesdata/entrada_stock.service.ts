import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EntradaStock } from './../_model/entrada_stock';

@Injectable({
  providedIn: 'root'
})
export class EntradaStockServiceData {

  private entradaStock$ = new BehaviorSubject<EntradaStock>(null);

  setEntradaStockStore(venta: EntradaStock) {
    this.entradaStock$.next(venta);
  }

  getEntradaStockStore() {
    return this.entradaStock$.asObservable();
  }

  constructor() { }
}
