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
import { ClienteService } from './../../../_service/cliente.service';
import { TipoTarjetaService } from '../../../_service/tipo_tarjeta.service';
import { CobroVenta } from './../../../_model/cobro_venta';
import { MetodoPago } from '../../../_model/metodo_pago';
import { Cliente } from './../../../_model/cliente';
import { TipoDocumento } from './../../../_model/tipo_documento';
import { ExportsService } from './../../../_service/reportes/exports.service';
import { InventarioService } from './../../../_service/inventario.service';
import { UserService } from './../../../_service/user.service';
import { FiltroProductosVenta } from './../../../_util/filtro_productos_venta';
import * as moment from 'moment';

@Component({
  selector: 'app-ventasdetalladas',
  templateUrl: './ventasdetalladas.component.html',
  styleUrls: ['./ventasdetalladas.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class VentasdetalladasComponent implements OnInit{

  //@ViewChild('inputTxtBuscar', { static: false }) inputTxtBuscar: ElementRef;
  @ViewChild('inputmontoAbonado', { static: false }) inputmontoAbonado: ElementRef;
  @ViewChild('inputBuscarDocCliente', { static: false }) inputBuscarDocCliente: ElementRef;
  @ViewChild('inputNombreClienteReg', { static: false }) inputNombreClienteReg: ElementRef;
  @ViewChild('inputBuscarProductos', { static: false }) inputBuscarProductos: ElementRef;


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

  now: any = moment();
  fechaInicio: string = this.now.format('DD/MM/YYYY');
  fechaFinal: string = this.now.format('DD/MM/YYYY');
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

   //Generar Comprobante
   displayGenerateComprobante : boolean = false;
   nombreDocIdentidad: string = '';
   txtBuscarDocCliente: string = '';
   txtBuscarCliente: String = '';
   displayClient : boolean = false;

   selectedClient: Cliente;

   pageClientes: number = 0;
  firstClientes: number = 0;
  lastClientes: number = 0;
  rowsClientes: number = 10;
  isFirstClientes: boolean = true;
  isLastClientes: boolean = false;
  totalRecordsClientes: number = 0;
  numberElementsClientes: number = 0;
  loadingClientes: boolean = true; 
  vistaRegistroCliente : boolean = false;
  clientes: any[] = [];
  vistaBotonRegistroCliente : boolean = false;
  vistaBotonEdicionCliente : boolean = false;
  vistaCargaCliente : boolean = true;
  tipoFrmCliente: String = 'Nuevo Cliente';

  newCliente = new Cliente();
  clsTipoDocumentoCliente: any = null;
  nombreCliente: string = '';
  tipo_documento_idCliente: number = null;
  documentoCliente: string = '';
  direccionCliente: string = '';
  telefonoCliente: string = '';
  correo1Cliente: string = '';
  correo2Cliente: string = '';
  tipoDocumentosCliente: any[] = [];

  txtNombreCliente: string = '';

  txtBuscarProducto: string = '';
  txtBuscarProductoF: string = '';

  displayProductsToVentas : boolean = false;
  selectedProductVenta: Producto;

  filtroProductosVenta: FiltroProductosVenta = new FiltroProductosVenta();
  productosVentas: any[] = [];

  pageProductosToVentas: number = 0;
  firstProductosToVentas: number = 0;
  lastProductosToVentas: number = 0;
  rowsProductosToVentas: number = 10;
  isFirstProductosToVentas: boolean = true;
  isLastProductosToVentas: boolean = false;
  totalRecordsProductosToVentas: number = 0;
  numberElementsProductosToVentas: number = 0;
  loadingProductosToVentas: boolean = true; 

  unidads: any[] = [];
  clsUnidad: any = null;


  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private ventaService: VentaService, 
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService,
    private almacenService: AlmacenService, private router: Router,
    private ventaServiceData: VentaServiceData,
    private tipoComprobanteService: TipoComprobanteService,
    private initComprobanteService:InitComprobanteService,
    private metodoPagoService:MetodoPagoService,
    private bancoService: BancoService,
    private detalleMetodoPagoService: DetalleMetodoPagoService,
    private clienteService: ClienteService,
    private tipoTarjetaService: TipoTarjetaService,
    private exportsService: ExportsService,
    private inventarioService: InventarioService,
    private userService: UserService,
    private productoService: ProductoService) {
    this.breadcrumbService.setItems([
      { label: 'Reportes' },
      { label: 'Ventas Detalladas por Producto', routerLink: ['/reporte/ventas-detalladas'] }
    ]);

  }

  ngOnInit(): void {
    /* this.getTipoProductos();
    this.getMarcas();
    this.getPresentaciones(); */
    this.getAlmacens();
    //this.getTipoDocumentos();
    this.primengConfig.ripple = true;
    this.vistaCarga = false;
    //this.setFocusBuscar();
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

  /* setFocusBuscar() {    

    this.changeDetectorRef.detectChanges();
    this.inputTxtBuscar.nativeElement.focus();
  
  } */

  setFocusBuscarDocCliente() {    
    this.changeDetectorRef.detectChanges();
    this.inputBuscarDocCliente.nativeElement.focus();
  }

  setFocusNombreCliente() {    
    this.changeDetectorRef.detectChanges();
    this.inputNombreClienteReg.nativeElement.focus();
  }
  
  //Carga de Data
  getAlmacens() {

    this.clsAlmacen = null;
    this.almacens = [];
  
    this.inventarioService.getAlmacens().subscribe(data => {
  
      this.almacens.push({name: "General - Todas", code: 0});
      this.clsAlmacen = {name: "General - Todas", code: 0};
      data.forEach(almacen => {
        this.almacens.push({name: almacen.nombre, code: almacen.id});
      });
  
      this.filtroVenta.almacenId =  this.clsAlmacen.code;
      //this.listarPageMain(this.page, this.rows);
      this.getUsuarios();
  
    });
  }
  getUsuarios() {

    this.clsUsuario = null;
    this.usuarios = [];
  
    this.userService.listarAll().subscribe(data => {
  
      this.usuarios.push({name: "Todos", code: 0});
      this.clsUsuario = {name: "Todos", code: 0};
      data.forEach(user => {
        this.usuarios.push({name: user.name, code: user.id});
      });
  
      this.filtroVenta.idUser =  this.clsUsuario.code;
      //this.listarPageMain(this.page, this.rows);
      this.getTipoComprobantes();
  
    });
  }

  getTipoComprobantes() {

    
    this.tipoComprobantes = [];

    
    this.tipoComprobanteService.listarAll().subscribe(data => {

      this.tipoComprobantes.push({name: "TODOS", code: 0});
      this.clsTipoComprobante = {name: 'TODOS', code: 0};
      data.forEach(tipoComprobante => {
        this.tipoComprobantes.push({name: tipoComprobante.nombre, code: tipoComprobante.id});
      });

      this.evaluarFiltros();
      if(this.filtroVenta.fechaInicio == null){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Inicio indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return;
      }
      if(this.filtroVenta.fechaFinal == null){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha Final indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return;
      }
      this.listarPageMain(this.page, this.rows);
    });
  }

  getTipoDocumentos() {

    this.clsTipoDocumentoCliente = null;
    this.tipoDocumentosCliente = [];
  
    this.clienteService.getTipoDocumentos().subscribe(data => {
      data.forEach(tipoDoc => {
        this.tipoDocumentosCliente.push({name: tipoDoc.tipo, code: tipoDoc.id});
      });
    });
  }

  

  getTipoComprobantesGenComprobante() {

    this.clsTipoComprobante = null;
    this.tipoComprobantes = [];
    let isFirst = true;

    this.tipoComprobanteService.listarAll().subscribe(data => {
      data.forEach(tipoComprobante => {
        if(tipoComprobante.activo != 2){
          this.tipoComprobantes.push({name: tipoComprobante.nombre, code: tipoComprobante.id});
          if(isFirst){
            this.clsTipoComprobante = {name: tipoComprobante.nombre, code: tipoComprobante.id};
            this.buscarSeriesComprobantes();
            isFirst = false;
          }
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
  
    this.ventaService.getVentasDetallado(this.filtroVenta, p ,s).subscribe(data => {
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
    if(this.filtroVenta.fechaInicio == null){
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Inicio indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
      return;
    }
    if(this.filtroVenta.fechaFinal == null){
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha Final indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
      return;
    }
    this.listarPageMain(this.page, this.rows);
  }

  cambioFiltrosExec(){
    this.evaluarFiltros();
    if(this.filtroVenta.fechaInicio == null){
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Inicio indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
      return;
    }
    if(this.filtroVenta.fechaFinal == null){
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha Final indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
      return;
    }
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

    //Nuevos
    if(this.clsUsuario != null && this.clsUsuario.code != "0") {
      this.filtroVenta.idUser = this.clsUsuario.code;
      this.filtroVenta.nameUser = this.clsUsuario.label;
    }
    else{
      this.filtroVenta.idUser = null;
      this.filtroVenta.nameUser = null;
    }

    //console.log(this.selectedClient);
    if(this.selectedClient != null && this.selectedClient.id != null){
      this.filtroVenta.idCliente = this.selectedClient.id;
    } else{
      this.filtroVenta.idCliente = null;
    }

    if(this.clsTipoComprobante != null && this.clsTipoComprobante.code != "0") {
      this.filtroVenta.idTipoComprobante = this.clsTipoComprobante.code;
    }
    else{
      this.filtroVenta.idTipoComprobante = null;
    }

    if(this.selectedProductVenta != null && this.selectedProductVenta.id != null){
      this.filtroVenta.idProducto = this.selectedProductVenta.id;
    } else{
      this.filtroVenta.idProducto = null;
    }
  }

  buscarProducto() {

    /* this.filtroProductosVenta.almacenId = this.entradaStock.almacen.id;
    this.filtroProductosVenta.size = 10;

    this.displayProductsToVentas = false; */
    this.displayProductsToVentas = true;
    this.selectedProductVenta = null
    this.buscarProductos();
    this.setFocusBuscarProducto();
    
  }

  setFocusBuscarProducto() {    
    this.changeDetectorRef.detectChanges();
    this.inputBuscarProductos.nativeElement.focus();
  }

  buscarProductos(): void{
    this.loadingProductosToVentas = true; 
    this.filtroProductosVenta.palabraClave = this.txtBuscarProductoF;
    this.filtroProductosVenta.unidadId = parseInt((this.clsUnidad != null) ? this.clsUnidad.code : 0);
    this.filtroProductosVenta.page = 0;
    this.listarPageProductosToVentas();
  }

  listarPageProductosToVentas() {

    this.productoService.listarPageable(this.filtroProductosVenta.page, this.filtroProductosVenta.size, this.filtroProductosVenta.palabraClave).subscribe(data => {
      this.productosVentas = data.content;
      this.isFirstProductosToVentas = data.first;
      this.isLastProductosToVentas = data.last;
      this.numberElementsProductosToVentas = data.numberOfElements;
      this.firstProductosToVentas = (this.filtroProductosVenta.page * this.filtroProductosVenta.size);
      this.lastProductosToVentas = (this.filtroProductosVenta.page * this.filtroProductosVenta.size) + this.numberElementsProductosToVentas;
      this.totalRecordsProductosToVentas = data.totalElements;
      this.loadingProductosToVentas = false;
    });
  }

  aceptarProducto(registro){
    this.selectedProductVenta = registro;

    this.txtBuscarProducto = this.selectedProductVenta.nombre;
    this.displayProductsToVentas = false;
    this.cambioFiltrosExec();
  }

  cancelProducto(){
    this.selectedProductVenta = new Producto();
    this.txtBuscarProducto = '';
    this.displayProductsToVentas = false;
    this.cambioFiltrosExec();
  }

  loadDataProductosToVentas(event: LazyLoadEvent) { 
    this.loadingProductosToVentas = true; 
    this.filtroProductosVenta.size = event.rows;
    this.filtroProductosVenta.page = event.first / this.rows;
  
    this.listarPageProductosToVentas();
  
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

    this.cobroVenta.venta = structuredClone(this.selectedVenta);
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

  buscarDocCliente() {

      this.clienteService.getByDocument(this.txtBuscarDocCliente).subscribe({
        next: (data) => {        
              this.venta.cliente = data;
              this.ventaService.modificarCliente(this.venta).subscribe({
                next: (dataUdpCliente) => {
                  if(dataUdpCliente != null && dataUdpCliente.id != null){

                    this.venta.cliente = dataUdpCliente.cliente;
                    
                    this.txtBuscarCliente = "";
                    this.txtBuscarDocCliente = "";
                    this.displayClient = false;
                    this.nombreDocIdentidad = data.tipoDocumento.tipo;
                  }
                },
                error: (errUdpCliente) => {
                  console.log(errUdpCliente);
                }        
            });       
        },
        error: (err) => {
          this.txtBuscarDocCliente = "";
          this.setFocusBuscarDocCliente();
        }
      });
  }

  buscarCliente(): void{
    this.displayClient = false;
    this.displayClient = true;
    this.selectedClient = null;
    //this.setFocusBuscar();
    this.buscarClientes();
  }

  buscarClientes(): void{
    this.cerrarCliente();
    this.pageClientes = 0;
    this.listarPageClientes(this.pageClientes , this.rowsClientes);
  }


  listarPageClientes(p: number, s:number) {

    this.clienteService.listarPageable(p, s, this.txtBuscarCliente).subscribe(data => {
      this.clientes = data.content;
      this.isFirstClientes = data.first;
      this.isLastClientes = data.last;
      this.numberElementsClientes = data.numberOfElements;
      this.firstClientes = (p * s);
      this.lastClientes = (p * s) + this.numberElementsClientes;
      this.totalRecordsClientes = data.totalElements;
      this.loadingClientes = false;
    });
  }

  loadDataClientes(event: LazyLoadEvent) { 
    this.loadingClientes = true; 
    this.rowsClientes = event.rows;
    this.pageClientes = event.first / this.rows;
  
    this.listarPageClientes(this.pageClientes, this.rowsClientes);
  
  }

  
  isLastPageClientes(): boolean {
      //return this.bancos ? this.first > (this.bancos.length - this.rows): true;
      return this.isLastClientes;
  }
  
  isFirstPageClientes(): boolean {
      return this.isFirstClientes;
  }

  nuevoCliente(): void{
    this.vistaBotonRegistroCliente = true;
    this.vistaBotonEdicionCliente = false;
    
    this.tipoFrmCliente = 'Nuevo Cliente' 
    this.vistaRegistroCliente = true;

  this.cancelarCliente();
  }

  cancelarCliente() {

    this.newCliente = new Cliente();
  
    this.clsTipoDocumentoCliente = null;
    this.nombreCliente = '';
    this.tipo_documento_idCliente = null;
    this.documentoCliente = '';
    this.direccionCliente = '';
    this.telefonoCliente = '';
    this.correo1Cliente = '';
    this.correo2Cliente = '';
  
    this.setFocusNombreCliente();
    
  }

  cerrarCliente(){
    this.vistaRegistroCliente = false;
  }

  registrarCliente(event: Event) {
    this.confirmationService.confirm({
        key: 'confirmDialog',
        target: event.target,
        message: '¿Está seguro de Registrar al Cliente?',
        icon: 'pi pi-info-circle',
        header: 'Confirmación Registro',
        accept: () => {
          //this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
         // this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have accepted'});
          this.registrarConfirmadoCliente();
        },
        reject: () => {
         // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
    });
  }

  registrarConfirmadoCliente(){
    
    this.vistaCargaCliente = true;
    let tipoDocumentoBase = new TipoDocumento();
    tipoDocumentoBase.id = parseInt((this.clsTipoDocumentoCliente != null) ? this.clsTipoDocumentoCliente.code : "0");

    
  
  
        this.newCliente.nombre = this.nombreCliente.toString().trim();
        this.newCliente.tipoDocumento = tipoDocumentoBase;
        this.newCliente.documento = this.documentoCliente;
        this.newCliente.direccion = this.direccionCliente;
        this.newCliente.telefono = this.telefonoCliente;
        this.newCliente.correo1 = this.correo1Cliente;
        this.newCliente.correo2 = this.correo2Cliente;
      
      
      this.clienteService.registrarRetCliente(this.newCliente).subscribe(data => {
          if(data != null){

              this.venta.cliente = data;
              this.ventaService.modificarCliente(this.venta).subscribe({
                next: (dataUdpCliente) => {
                  if(dataUdpCliente != null && dataUdpCliente.id != null){

                    this.venta.cliente = dataUdpCliente.cliente;
                    this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Cliente se ha registrado satisfactoriamente'});
                    this.txtBuscarCliente = "";
                    this.txtBuscarDocCliente = "";
                    this.displayClient = false;
                    this.nombreDocIdentidad = data.tipoDocumento.tipo;
                  }
                },
                error: (errUdpCliente) => {
                  console.log(errUdpCliente);
                }        
              });
          }
      });
    
  
  }

  aceptarCliente(registro){
    if(registro != null){
      this.selectedClient = registro;

      this.txtNombreCliente = this.selectedClient.nombre;
      this.displayClient = false;
      this.cambioFiltrosExec();
    }
  }

  cancelCliente(){
    this.selectedClient = new Cliente();
    this.txtNombreCliente = '';
    this.displayClient = false;
    this.cambioFiltrosExec();
  }

  GenerarComprobante(): void{
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Confirma que desea generar el Comprobante de Pago de la Venta?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Generar Comprobante de Pago',
      accept: () => {
       this.confirmarGenerarComprobante();
      },
      reject: () => {
      }
    });
  }

  confirmarGenerarComprobante(): void{

    let initComprobanteId = parseInt((this.clsSerieComprobante != null) ? this.clsSerieComprobante.code : "0");
    this.venta.initComprobanteId = initComprobanteId;

    this.ventaService.generateComprobante(this.venta).subscribe({
      next: (data) => {
        if(data != null && data.id != null){
          this.messageService.add({severity:'success', summary:'Confirmado', detail: 'Se ha generado comprobante de la venta Exitosamente'});
          this.venta = data;
          this.displayGenerateComprobante = false;
          this.actualizarVentas();
        }
      },
      error: (err) => {
        console.log(err);
      }        
   });

  }

  confirmarAnularVenta(): void{

    this.ventaService.anular(this.selectedVenta.id).subscribe(() => {
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'La Venta se ha anulado satisfactoriamente'});
      this.actualizarVentas();
   });

  }

  confirmarEliminarVenta(): void{

    this.ventaService.eliminar(this.selectedVenta.id).subscribe(() => {
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'La Venta se ha eliminado satisfactoriamente'});
      this.actualizarVentas();
   });

  }

  getDataMetodosPagos(){

    if(this.clsMetodoPago.tipoId == 'WT' || this.clsMetodoPago.tipoId == 'CH'){
      this.buscarBancos();
      this.numeroCheque = "";
    }
    if(this.clsMetodoPago.tipoId == 'CC'){
      this.buscarTipoTarjetas();
    }
    if(this.clsMetodoPago.tipoId == 'EW'){
      this.buscarCelulares();
    }
  }



  buscarTipoTarjetas() {
  
    this.clsTipoTarjeta = null;
    this.tipoTarjetas = [];
    let isFirst = true;
    this.numeroTarjeta = '';

    this.tipoTarjetaService.listarAll().subscribe(data => {
      data.forEach(data => {
        this.tipoTarjetas.push({name: data.nombre, code: data.id, sigla: data.sigla});
        if(isFirst){
          this.clsTipoTarjeta = {name: data.nombre, code: data.id, sigla: data.sigla};
          //this.buscarCuentas();
          isFirst = false;
        }
      });
    });
  }


  buscarCelulares() {
  
    this.clsNumeroCelular = null;
    this.numeroCelulares = [];
    let isFirst = true;
    this.numeroOperacion = '';

    let metodos_pago_id = parseInt((this.clsMetodoPago != null) ? this.clsMetodoPago.code : "0");
    let banco_id = 0;

    this.detalleMetodoPagoService.listarAll(metodos_pago_id, banco_id).subscribe(data => {
      data.forEach(data => {
        this.numeroCelulares.push({name: data.numeroCelular, code: data.id});
        if(isFirst){
          this.clsNumeroCelular = {name: data.numeroCelular, code: data.id};
          isFirst = false;
        }
      });
    });
  }

  calcularMontos(event: Event): void {
    let importe = this.floor10(this.selectedVenta.totalMonto, -2);
    let vuelto =  this.montoAbonado - importe;
    this.montoVuelto = vuelto.toFixed(2);
  }



  //Buttons Administratives
  actualizarVentas(): void{
    this.selectedVenta  = null;
    this.evaluarFiltros();
    if(this.filtroVenta.fechaInicio == null){
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Inicio indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
      return;
    }
    if(this.filtroVenta.fechaFinal == null){
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha Final indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
      return;
    }
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
      this.messageService.add({severity:'error', summary:'Error', detail: 'No se puede cobrar un monto de venta igual a cero'});
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
    if(this.selectedVenta == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Seleccione una Venta haciendo click en su fila correspondiente'});
      return;
    }
    if(this.selectedVenta.estado == 0){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede generar Comprobante de una Venta Anulada'});
      return;
    }
    if(this.selectedVenta.estado == 1){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede generar Comprobante de una Venta Iniciada'});
      return;
    }

    if(this.selectedVenta.comprobante == null || this.selectedVenta.comprobante.id == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede generar Comprobante de una Venta que no tiene Comprobante'});
      return;
    }
    if(this.selectedVenta.comprobante.initComprobante == null || this.selectedVenta.comprobante.initComprobante.id == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede generar Comprobante de una Venta que no tiene Tipo de Comprobante'});
      return;
    }
    if(this.selectedVenta.comprobante.initComprobante.tipoComprobante == null || this.selectedVenta.comprobante.initComprobante.tipoComprobante.id == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede generar Comprobante de una Venta que no tiene Tipo de Comprobante'});
      return;
    }
    if(this.selectedVenta.comprobante.initComprobante.tipoComprobante.activo != 2){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede generar Comprobante de una Venta que ya tiene Comprobante. Seleccione solo ventas con Nota de Venta'});
      return;
    }

    this.venta = this.selectedVenta;

    if(this.venta.cliente != null){
      this.nombreDocIdentidad = this.venta.cliente.tipoDocumento.tipo;
    }

    this.getTipoComprobantesGenComprobante();

    this.displayGenerateComprobante = false;
    this.displayGenerateComprobante = true;

    //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'La Venta se ha Cobrado Exitosamente'});

  }

  anularVenta(): void{
    if(this.selectedVenta == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Seleccione una Venta haciendo click en su fila correspondiente'});
      return;
    }
    if(this.selectedVenta.estado == 0){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'La venta ya se encuentra Anulada'});
      return;
    }
    if(this.selectedVenta.estado == 1){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede Anular una venta que aun no fue pagada y que no se ha generado ningún comprobante'});
      return;
    }

    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Confirma que desea Anular la Venta? - Este proceso no podrá ser revertido',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Anulación de Venta',
      accept: () => {
       this.confirmarAnularVenta();
      },
      reject: () => {
      }
    });

  }

  eliminarVenta(): void{
    if(this.selectedVenta == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Seleccione una Venta haciendo click en su fila correspondiente'});
      return;
    }
    if(this.selectedVenta.estado == 0){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede eliminar una Venta Anulada'});
      return;
    }

    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Confirma que desea Eliminar la Venta? - Este proceso no podrá ser revertido',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Eliminación de Venta',
      accept: () => {
       this.confirmarEliminarVenta();
      },
      reject: () => {
      }
    });

  }

  exportarPDF(): void{
    this.evaluarFiltros();
    if(this.filtroVenta.fechaInicio == null){
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Inicio indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
      return;
    }
    if(this.filtroVenta.fechaFinal == null){
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha Final indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
      return;
    }
    this.printPDF();
  }

  exportarExcel(): void{
    this.evaluarFiltros();
    if(this.filtroVenta.fechaInicio == null){
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Inicio indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
      return;
    }
    if(this.filtroVenta.fechaFinal == null){
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha Final indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
      return;
    }
    this.printXLS();
  }

  printPDF(): void{
    this.exportsService.exportVentasDetalladasPDF(this.filtroVenta).subscribe(data => {
  
      const file = new Blob([data], { type: 'application/pdf' });  
      const fileURL = URL.createObjectURL(file);
  
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = fileURL;
      a.download = 'VentasDetalladas.pdf';
      a.click();
  
      //window.open(fileURL);
    });
  }

  printXLS(): void{
    this.exportsService.exportVentasDetalladasXLSX(this.filtroVenta).subscribe(data => {
  
      const file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileURL = URL.createObjectURL(file);
  
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = fileURL;
      a.download = 'VentasDetalladas.xlsx';
      a.click();
      //window.open(fileURL);
    });
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

  floor10 (value, exp): number{
  return this.decimalAdjust("floor", value, exp);
  }

  decimalAdjust(type, value, exp): number {
    type = String(type);
    if (!["round", "floor", "ceil"].includes(type)) {
      throw new TypeError(
        "The type of decimal adjustment must be one of 'round', 'floor', or 'ceil'.",
      );
    }
    exp = Number(exp);
    value = Number(value);
    if (exp % 1 !== 0 || Number.isNaN(value)) {
      return NaN;
    } else if (exp === 0) {
      return Math[type](value);
    }
    const [magnitude, exponent = 0] = value.toString().split("e");
    const adjustedValue = Math[type](`${magnitude}e${exponent - exp}`);
    // Shift back
    const [newMagnitude, newExponent = 0] = adjustedValue.toString().split("e");
    return Number(`${newMagnitude}e${+newExponent + exp}`);
  }


}
