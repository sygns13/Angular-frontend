import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import {AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import { AppComponent } from 'src/app/app.component';

import { switchMap } from 'rxjs/operators';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';

import { GestionloteService } from 'src/app/_service/gestionlote.service';
import { ClienteService } from './../../../_service/cliente.service';
import { Cliente } from './../../../_model/cliente';
import { TipoDocumento } from './../../../_model/tipo_documento';
import { Venta } from './../../../_model/venta';
import { Almacen } from 'src/app/_model/almacen';
import { Comprobante } from 'src/app/_model/comprobante';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class VentaComponent implements OnInit {

  vistaCarga : boolean = true;
  verFrmVenta : boolean = false;
  verFrmAlmacen : boolean = false;

  almacens: any[] = [];
  clsAlmacen: any = null;

  venta: Venta = new Venta();

  
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

  constructor(public app: AppComponent, private gestionloteService: GestionloteService, private messageService: MessageService) { }

  ngOnInit(): void {

    this.getAlmacens();
    this.vistaCarga = false;
    this.verFrmAlmacen = true;

    //inicializar subclases de venta
    this.venta.cliente = new Cliente();
    this.venta.comprobante = new Comprobante();
    this.venta.almacen = new Almacen();
    
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

  getAlmacens() {

    this.clsAlmacen = null;
    this.almacens = [];

  
    this.gestionloteService.getAlmacens().subscribe(data => {
      if(data.length > 0){
        this.clsAlmacen = {name: data[0].nombre, code: data[0].id};
      }
      data.forEach(almacen => {
        this.almacens.push({name: almacen.nombre, code: almacen.id});
      });
    });
  }

  seleccionarLocal(): void{

    if(this.clsAlmacen != null){
      this.venta.cliente = new Cliente();
      this.venta.comprobante = new Comprobante();
      this.venta.almacen = new Almacen();
      this.venta.almacen.id = this.clsAlmacen.code;
      this.venta.almacen.nombre = this.clsAlmacen.name;

      this.verFrmVenta = true;
      this.vistaCarga = false;
      this.verFrmAlmacen = false;
    }
    else{
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'No ha seleccionado un Local o Sucursal Válido'});
    }
    
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

      this.verFrmAlmacen = true;
      this.verFrmVenta = false;
      this.vistaCarga = false;
    
  }

}
