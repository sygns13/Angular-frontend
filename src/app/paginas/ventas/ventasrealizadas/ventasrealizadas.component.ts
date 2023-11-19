import { TipoComprobante } from './../../../_model/tipo_comprobante';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import { ProductoService } from './../../../_service/producto.service';
import { AlmacenService } from './../../../_service/almacen.service';
import { switchMap } from 'rxjs/operators';
import { Producto } from './../../../_model/producto';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';
import { TipoProducto } from './../../../_model/tipo_producto';
import { Marca } from './../../../_model/marca';
import { Presentacion } from './../../../_model/presentacion';
import { Venta } from './../../../_model/venta';
import { VentaService } from './../../../_service/venta.service';
import { FiltroVenta } from './../../../_util/filtro_venta';
import { VentaServiceData } from './../../../_servicesdata/venta.service';
import * as moment from 'moment';

@Component({
  selector: 'app-ventasrealizadas',
  templateUrl: './ventasrealizadas.component.html',
  styleUrls: ['./ventasrealizadas.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VentasrealizadasComponent implements OnInit{

  @ViewChild('inputTxtBuscar', { static: false }) inputTxtBuscar: ElementRef;


  almacens: any[] = [];
  TipoComprobantes: any[] = [];
  usuarios: any[] = [];
  
  estadoVentas: any[] = [
    {name: 'TODAS', code: 'Z'},
    {name: 'Anuladas', code: '0'},
    {name: 'Iniciadas', code: '1'},
    {name: 'Facturada No Cobrada', code: '2'},
    {name: 'Facturada Cobrada Parcialmente', code: '3'},
    {name: 'Facturada Cobrada Total', code: '4'},
  ];

  tipoVentas: any[] = [
    {name: 'TODAS', code: '0'},
    {name: 'Ventas de Bienes', code: '1'},
    {name: 'Ventas de Servicios', code: '2'},
  ];

  clsAlmacen: any = null;
  clsTipoComprobante: any = null;
  clsUsuario: any = null;
  clsEstadoVenta: any = {name: 'TODAS', code: 'Z'};
  clsTipoVenta: any = {name: 'TODAS', code: '0'};

  fechaInicio: string = '';
  fechaFinal: string = '';
  txtBuscar: string = '';

  venta = new Venta();

  ventas: any[] = [];

  page: number = 0;
  first: number = 0;
  last: number = 0;
  rows: number = 10;

  isFirst: boolean = true;
  isLast: boolean = false;
  totalRecords: number = 0;
  numberElements: number = 0;

  msgs: Message[] = [];
  vistaCarga : boolean = true;
  loading: boolean = true; 

  filtroVenta = new FiltroVenta();
  selectedVenta: Venta;

  vistaCarga2: boolean = true;

  verFrmVenta: boolean = false;

  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private ventaService: VentaService, 
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService,
    private almacenService: AlmacenService, private router: Router,
    private ventaServiceData: VentaServiceData) {
    this.breadcrumbService.setItems([
      { label: 'Ventas' },
      { label: 'Ventas Realizadas', routerLink: ['/ventas/venta_realizada'] }
    ]);

  }

  ngOnInit(): void {
    /* this.getTipoProductos();
    this.getMarcas();
    this.getPresentaciones(); */
    this.getAlmacens()
    this.primengConfig.ripple = true;
    this.vistaCarga = false;
    this.setFocusBuscar();
  }

  next() {
    this.page++;
    this.listarPageMain(this.page, this.rows);
  }
  
  prev() {
      this.page--;
      this.listarPageMain(this.page, this.rows);
  }
  
  reset() {
      this.first = 0;
      this.listarPageMain(this.page, this.rows);
  }
  
  isLastPage(): boolean {
      //return this.bancos ? this.first > (this.bancos.length - this.rows): true;
      return this.isLast;
  }
  
  isFirstPage(): boolean {
      return this.isFirst;
  }

  setFocusBuscar() {    

    this.changeDetectorRef.detectChanges();
    this.inputTxtBuscar.nativeElement.focus();
  
  }
  
  //Carga de Data
  getAlmacens() {

    this.clsAlmacen = null;
    this.almacens = [];
  
    this.almacenService.listarAll().subscribe(data => {
  
      this.almacens.push({name: "General - Todas", code: 0});
      this.clsAlmacen = {name: "General - Todas", code: 0};
      data.forEach(almacen => {
        this.almacens.push({name: almacen.nombre, code: almacen.id});
      });
  
      this.filtroVenta.almacenId =  this.clsAlmacen.code;
      this.listarPageMain(this.page, this.rows);
  
    });
  }

  loadData(event: LazyLoadEvent) { 
    this.loading = true; 
    this.rows = event.rows;
    this.page = event.first / this.rows;
  
    this.listarPageMain(this.page, this.rows);
  
  }

  listarPageMain(p: number, s:number) {
 
    this.loading = true;
  
    this.ventaService.getVentas(this.filtroVenta, p ,s).subscribe(data => {
      this.ventas = data.content;
      this.isFirst = data.first;
      this.isLast = data.last;
      this.numberElements = data.numberOfElements;
      this.first = (p * s);
      this.last = (p * s) + this.numberElements;
      this.totalRecords = data.totalElements;
      this.loading = false;
    });
  }

  cambioFiltros(event: Event){
    this.evaluarFiltros();
    this.listarPageMain(this.page, this.rows);
  }

  evaluarFiltros(){

    this.filtroVenta = new FiltroVenta();
  
    if(this.clsAlmacen != null){
      this.filtroVenta.almacenId = this.clsAlmacen.code;
    }
    else{
      this.filtroVenta.almacenId = 0;
    }

    if(this.fechaInicio != null && this.fechaFinal != null && this.fechaInicio.length == 10 && this.fechaFinal.length == 10){
      const fechaIni = moment(this.fechaInicio, 'DD/MM/YYYY');
      const fechaFin = moment(this.fechaFinal, 'DD/MM/YYYY');
      if(fechaIni.isValid && fechaFin.isValid){
        this.filtroVenta.fechaInicio = fechaIni.format('YYYY-MM-DD');
        this.filtroVenta.fechaFinal = fechaFin.format('YYYY-MM-DD');
      }
      else{
        this.filtroVenta.fechaInicio = null;
        this.filtroVenta.fechaFinal = null;
      }
    } else{
      this.filtroVenta.fechaInicio = null;
      this.filtroVenta.fechaFinal = null;
    }

    if(this.clsTipoVenta != null) {
      this.filtroVenta.tipoVenta = this.clsTipoVenta.code;
    }
    else{
      this.filtroVenta.tipoVenta = null;
    }

    if(this.clsEstadoVenta != null && this.clsEstadoVenta.code != "Z") {
      this.filtroVenta.estadoVenta = this.clsEstadoVenta.code;
    }
    else{
      this.filtroVenta.estadoVenta = null;
    }

    if(this.txtBuscar != null && this.txtBuscar.trim().length > 0){
      this.filtroVenta.buscarDatos = this.txtBuscar.trim();
    }else{
      this.filtroVenta.buscarDatos = null;
    }
  }

  buscar(): void{
    this.actualizarVentas();
  }


  //Buttons Administratives
  actualizarVentas(): void{
    this.selectedVenta  = null;
    this.evaluarFiltros();
    this.listarPageMain(this.page, this.rows);
  }
  
  nuevaVenta(): void{
    this.ventaServiceData.setVentaStore(null);
    this.router.navigateByUrl('/ventas/venta');
  }
  
  verVenta(): void{
    if(this.selectedVenta == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Seleccione una Venta haciendo click en su fila correspondiente'});

    }else{
      this.vistaCarga2 = false;
      this.verFrmVenta  = true;
    }
  }

  printVenta(): void{

  }

  edittVenta(): void{
    if(this.selectedVenta == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Seleccione una Venta haciendo click en su fila correspondiente'});
      return;
    }
    if(this.selectedVenta.estado == 0){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede editar una Venta Anulada'});
      return;
    }
    if(this.selectedVenta.estado == 2){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede editar una Venta Facturada No Cobrada'});
      return;
    }
    if(this.selectedVenta.estado == 3){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede editar una Venta Facturada Cobrada Parcialmente'});
      return;
    }
    if(this.selectedVenta.estado == 4){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede editar una Venta Facturada Cobrada Total'});
      return;
    }
    this.ventaServiceData.setVentaStore(this.selectedVenta);
    this.router.navigateByUrl('/ventas/venta');
  }

  cobrarVenta(): void{

  }

  genComprobanteVenta(): void{

  }

  anularVenta(): void{

  }

  eliminarVenta(): void{

  }

  exportarPDF(): void{

  }

  exportarExcel(): void{

  }

  //Other Functions
  cerrarFormularioVerVenta($event) {

    
    //productoCambiado: Producto = $event;
    this.loading = true;

    this.selectedVenta  = null;
    this.verFrmVenta  = false;
    this.vistaCarga2 = true;
    this.actualizarVentas();
 }


}
