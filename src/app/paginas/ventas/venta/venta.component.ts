import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import {AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import { AppComponent } from 'src/app/app.component';

import { switchMap } from 'rxjs/operators';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';

import { ClienteService } from './../../../_service/cliente.service';
import { Cliente } from './../../../_model/cliente';
import { TipoDocumento } from './../../../_model/tipo_documento';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class VentaComponent implements OnInit {

  vistaCarga : boolean = true;

  nombreLocal: string = 'Nombre Local';

  nombreCliente: string = '';
  codigoProducto: string = '';
  txtBuscarProducto: string = '';
  txtBuscarDocCliente: string = '';
  nombreDocIdentidad: string = 'LIBRETA ELECTORAL O DNI';

  detalleVentas: any[] = [];

  page: number = 0;
  first: number = 0;
  rows: number = 10;

  OpGravada: string = '';
  OpExonerada: string = '';
  OpInafecta: string = '';
  TotalISC: string = '';
  TotalIGV: string = '';
  TotalICBPER: string = '';
  ImporteTotal: string = '';

  constructor(public app: AppComponent) { }

  ngOnInit(): void {

    this.vistaCarga = false;
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
      this.first = this.first - this.rows;
  }

  reset() {
      this.first = 0;
  }

  isLastPage(): boolean {
      return this.detalleVentas ? this.first === (this.detalleVentas.length - this.rows): true;
  }

  isFirstPage(): boolean {
      return this.detalleVentas ? this.first === 0 : true;
  }


  buscarCliente(): void{
    
  }

  buscarProducto(): void{
    
  }

  buscarDocCliente(): void{
    
  }

  cobrarVenta(): void{
    
  }
  nuevaVenta(): void{
    
  }

  cancelarVenta(event: Event): void{
    
  }

  cerrarVenta(event: Event): void{
    
  }

}
