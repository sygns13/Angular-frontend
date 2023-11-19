import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Venta } from './../_model/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaServiceData {
  private ventaStore$ = new BehaviorSubject<Venta>(null);

  setVentaStore(venta: Venta) {
    this.ventaStore$.next(venta);
  }

  getVentaStore() {
    return this.ventaStore$.asObservable();
  }

  constructor() { }
}
