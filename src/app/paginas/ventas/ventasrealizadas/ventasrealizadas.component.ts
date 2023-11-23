import { TipoComprobante } from './../../../_model/tipo_comprobante';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppBreadcrumbService } from '../../../menu/app.breadcrumb.service';
import { ProductoService } from './../../../_service/producto.service';
import { AlmacenService } from './../../../_service/almacen.service';
import { switchMap } from 'rxjs/operators';
import { Producto } from './../../../_model/producto';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';
import { TipoProducto } from './../../../_model/tipo_producto';
import { Marca } from './../../../_model/marca';
import { Presentacion } from './../../../_model/presentacion';
import { Venta } from './../../../_model/venta';
import { VentaService } from './../../../_service/venta.service';
import { TipoComprobanteService } from '../../../_service/tipo_comprobante.service';
import { InitComprobanteService } from '../../../_service/init_comprobante.service';
import { MetodoPagoService } from '../../../_service/metodo_pago.service';
import { BancoService } from '../../../_service/banco.service';
import { DetalleMetodoPagoService } from '../../../_service/detalle_metodo_pago.service';
import { FiltroVenta } from './../../../_util/filtro_venta';
import { VentaServiceData } from './../../../_servicesdata/venta.service';
import { CobroVenta } from './../../../_model/cobro_venta';
import { MetodoPago } from '../../../_model/metodo_pago';
import * as moment from 'moment';

@Component({
  selector: 'app-ventasrealizadas',
  templateUrl: './ventasrealizadas.component.html',
  styleUrls: ['./ventasrealizadas.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VentasrealizadasComponent implements OnInit{

  @ViewChild('inputTxtBuscar', { static: false }) inputTxtBuscar: ElementRef;
  @ViewChild('inputmontoAbonado', { static: false }) inputmontoAbonado: ElementRef;


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
  //clsTipoComprobante: any = null;
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

   //Cobrar
   cobroVenta: CobroVenta = new CobroVenta();
   ImporteTotal: string = '';

   displayConfirmarPago : boolean = false;
   tipoComprobantes: any[] = [];
   clsTipoComprobante: any = null;
   serieComprobantes: any[] = [];
   clsSerieComprobante: any = null;
   clsMetodoPago: any = null;
   metodoPagos: any[] = [];
 
   bancos: any[] = [];
   clsBanco: any = null;
 
   numeroCuentas: any[] = [];
   clsNumeroCuenta: any = null;
   numeroOperacion: string = '';
 
   tipoTarjetas: any[] = [];
   clsTipoTarjeta: any = null;
   numeroTarjeta: string = '';
   numeroCheque: string = '';
   
   numeroCelulares: any[] = [];
   clsNumeroCelular: any = null;
   //initComprobantes: InitComprobante[] = [];
 
   montoVenta: string = null;
   montoAbonado: number = null;
   montoVuelto: string = null;

  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private ventaService: VentaService, 
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService,
    private almacenService: AlmacenService, private router: Router,
    private ventaServiceData: VentaServiceData,
    private tipoComprobanteService: TipoComprobanteService,
    private initComprobanteService:InitComprobanteService,
    private metodoPagoService:MetodoPagoService,
    private bancoService: BancoService,
    private detalleMetodoPagoService: DetalleMetodoPagoService) {
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

  getTipoComprobantes() {

    this.clsTipoComprobante = null;
    this.tipoComprobantes = [];
    let isFirst = true;

    this.tipoComprobanteService.listarAll().subscribe(data => {
      data.forEach(tipoComprobante => {
        this.tipoComprobantes.push({name: tipoComprobante.nombre, code: tipoComprobante.id});
        if(isFirst){
          this.clsTipoComprobante = {name: tipoComprobante.nombre, code: tipoComprobante.id};
          this.buscarSeriesComprobantes();
          isFirst = false;
        }
      });
    });
  }

  buscarSeriesComprobantes() {

    this.clsSerieComprobante = null;
    this.serieComprobantes = [];
    let isFirst = true;

    let tipo_comprobante_id = parseInt((this.clsTipoComprobante != null) ? this.clsTipoComprobante.code : "0");

    this.initComprobanteService.listarAll(tipo_comprobante_id, this.selectedVenta.almacen.id).subscribe(data => {
      data.forEach(initComprobantes => {
        this.serieComprobantes.push({name: initComprobantes.letraSerieStr + initComprobantes.numSerieStr, code: initComprobantes.id});
        if(isFirst){
          this.clsSerieComprobante = {name: initComprobantes.letraSerieStr + initComprobantes.numSerieStr, code: initComprobantes.id};
          isFirst = false;
        }
      });
    });
  }

  getMetodoPagos() {
  
    this.clsMetodoPago = null;
    this.metodoPagos = [];
    let isFirst = true;

    //this.metodoPagos.push({name: 'GENERAL (TODOS LOS LOCALES)', code: 0});

    this.metodoPagoService.listarAll().subscribe(data => {
      data.forEach(metodoPago => {
          this.metodoPagos.push({name: metodoPago.nombre, code: metodoPago.id, tipoId: metodoPago.tipoId});
          if(isFirst){
            this.clsMetodoPago = {name: metodoPago.nombre, code: metodoPago.id, tipoId: metodoPago.tipoId};
            this.buscarBancos();
            isFirst = false;
          }
      });
    });
  }

  buscarBancos() {
  
    this.clsBanco = null;
    this.bancos = [];
    let isFirst = true;
    this.numeroOperacion = '';

    this.bancoService.listarAll().subscribe(data => {
      data.forEach(banco => {
        this.bancos.push({name: banco.nombre, code: banco.id});
        if(isFirst){
          this.clsBanco = {name: banco.nombre, code: banco.id};
          this.buscarCuentas();
          isFirst = false;
        }
      });
    });
  }

  buscarCuentas() {
  
    this.clsNumeroCuenta = null;
    this.numeroCuentas = [];
    let isFirst = true;

    let metodos_pago_id = parseInt((this.clsMetodoPago != null) ? this.clsMetodoPago.code : "0");
    let banco_id = parseInt((this.clsBanco != null) ? this.clsBanco.code : "0");

    this.detalleMetodoPagoService.listarAll(metodos_pago_id, banco_id).subscribe(data => {
      data.forEach(numeroCuenta => {
        this.numeroCuentas.push({name: numeroCuenta.numeroCuenta, code: numeroCuenta.id});
        if(isFirst){
          this.clsNumeroCuenta = {name: numeroCuenta.numeroCuenta, code: numeroCuenta.id};
          isFirst = false;
        }
      });
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

  setFocusMontoAbonado() {    
    this.changeDetectorRef.detectChanges();
    this.inputmontoAbonado.nativeElement.focus();
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

  confirmarPago(): void{
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Confirma que desea realizar el Cobro de la Venta?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Cobro de Venta',
      accept: () => {
       this.confirmarPagoConfirmado();
      },
      reject: () => {
      }
    });
  }

  confirmarPagoConfirmado(): void{
    this.cobroVenta = new CobroVenta();
    let metodoPago = new MetodoPago();

    let metodoPagoId = parseInt((this.clsMetodoPago != null) ? this.clsMetodoPago.code : "0");
    let tipoId = this.clsMetodoPago != null ? this.clsMetodoPago.tipoId : "";
    let metodoPagoName = this.clsMetodoPago != null ? this.clsMetodoPago.name : "";

    metodoPago.id = metodoPagoId;
    metodoPago.tipoId = tipoId;
    metodoPago.nombre = metodoPagoName;

    this.cobroVenta.venta = this.selectedVenta;
    this.cobroVenta.importe = this.montoAbonado;

    let tipoTarjeta = this.clsTipoTarjeta != null ? this.clsTipoTarjeta.name : "";
    let siglaTarjeta = this.clsTipoTarjeta != null ? this.clsTipoTarjeta.sigla : "";

    let banco = this.clsBanco != null ? this.clsBanco.name : "";
    let numeroCuenta = this.clsNumeroCuenta != null ? this.clsNumeroCuenta.name : "";
    let numeroCelular = this.clsNumeroCelular != null ? this.clsNumeroCelular.name : "";

    let initComprobanteId = parseInt((this.clsSerieComprobante != null) ? this.clsSerieComprobante.code : "0");

    this.cobroVenta.tipoTarjeta = tipoTarjeta;
    this.cobroVenta.siglaTarjeta = siglaTarjeta;
    this.cobroVenta.numeroTarjeta = this.numeroTarjeta;
    this.cobroVenta.banco = banco;
    this.cobroVenta.numeroCuenta = numeroCuenta;
    this.cobroVenta.numeroCelular = numeroCelular;
    this.cobroVenta.numeroCheque = this.numeroCheque;
    this.cobroVenta.codigoOperacion = this.numeroOperacion;
    this.cobroVenta.initComprobanteId = initComprobanteId;
    this.cobroVenta.metodoPago = metodoPago;

    this.ventaService.cobroVenta(this.cobroVenta).subscribe({
      next: (data) => {
        if(data != null && data.id != null){
          this.messageService.add({severity:'success', summary:'Confirmado', detail: 'La Venta se ha Cobrado Exitosamente'});
          this.cobroVenta = data;
          this.displayConfirmarPago = false;
          this.actualizarVentas();
        }
      },
      error: (err) => {
        console.log(err);
      }        
   });

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
    if(this.selectedVenta == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Seleccione una Venta haciendo click en su fila correspondiente'});
      return;
    }
    if(this.selectedVenta.estado == 0){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede cobrar una Venta Anulada'});
      return;
    }
    if(this.selectedVenta.estado == 2){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede cobrar una Venta Facturada No Cobrada'});
      return;
    }
    if(this.selectedVenta.estado == 3){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede cobrar una Venta Facturada Cobrada Parcialmente'});
      return;
    }
    if(this.selectedVenta.estado == 4){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede cobrar una Venta Facturada Cobrada Total'});
      return;
    }

    if(this.selectedVenta.totalMonto == null || this.selectedVenta.totalMonto == 0){
      this.messageService.add({severity:'error', summary:'Error', detail: 'No se puede cobrar un monton de venta igual a cero'});
      return;
    }

    this.ImporteTotal = this.selectedVenta.totalMonto.toFixed(2);
    this.montoAbonado = this.selectedVenta.totalMonto;
    this.montoVuelto = "0.00";
    this.numeroCheque = "";

    this.getTipoComprobantes();
    this.getMetodoPagos();

    this.displayConfirmarPago = false;
    this.displayConfirmarPago = true;

    this.setFocusMontoAbonado();
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
