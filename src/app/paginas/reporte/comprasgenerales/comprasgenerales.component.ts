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
import { EntradaStock } from './../../../_model/entrada_stock';
import { EntradaStockService } from './../../../_service/entrada_stock.service';
import { TipoComprobanteService } from '../../../_service/tipo_comprobante.service';
import { MetodoPagoService } from '../../../_service/metodo_pago.service';
import { BancoService } from '../../../_service/banco.service';
import { FiltroEntradaStock } from './../../../_util/filtro_entrada_stock';
import { EntradaStockServiceData } from './../../../_servicesdata/entrada_stock.service';
import { ProveedorService } from './../../../_service/proveedor.service';
import { TipoTarjetaService } from '../../../_service/tipo_tarjeta.service';
import { PagoProveedor } from './../../../_model/pago_proveedor';
import { MetodoPago } from '../../../_model/metodo_pago';
import { Proveedor } from './../../../_model/proveedor';
import { TipoDocumento } from './../../../_model/tipo_documento';
import { FacturaProveedor } from './../../../_model/factura_proveedor';
import { UserService } from 'src/app/_service/user.service';
import { ExportsService } from './../../../_service/reportes/exports.service';
import { InventarioService } from './../../../_service/inventario.service';
import * as moment from 'moment';


@Component({
  selector: 'app-comprasgenerales',
  templateUrl: './comprasgenerales.component.html',
  styleUrls: ['./comprasgenerales.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class ComprasgeneralesComponent implements OnInit{

  @ViewChild('inputTxtBuscar', { static: false }) inputTxtBuscar: ElementRef;
  @ViewChild('inputmontoAbonado', { static: false }) inputmontoAbonado: ElementRef;
  @ViewChild('inputBuscarDocProveedor', { static: false }) inputBuscarDocProveedor: ElementRef;
  @ViewChild('inputNombreProveedorReg', { static: false }) inputNombreProveedorReg: ElementRef;
  @ViewChild('inputserieComprobanteF', { static: false }) inputserieComprobanteF: ElementRef;


  almacens: any[] = [];
  TipoComprobantes: any[] = [];
  usuarios: any[] = [];
  //proveedors: any[] = [];
  
  estadoCompras: any[] = [
    {name: 'TODAS', code: 'Z'},
    {name: 'Anuladas', code: '0'},
    {name: 'Iniciadas', code: '1'},
    {name: 'Facturada No Pagada', code: '2'},
    {name: 'Facturada Pagada Parcialmente', code: '3'},
    {name: 'Facturada Pagada Total', code: '4'},
  ];

  facturados: any[] = [
    {name: 'TODOS', code: 'Z'},
    {name: 'Facturada', code: '1'},
    {name: 'No Facturada', code: '0'}
  ];

  actualizados: any[] = [
    {name: 'TODOS', code: 'Z'},
    {name: 'Actualizada en Stocks', code: '1'},
    {name: 'No Actualizada  en Stocks', code: '0'}
  ];

  clsAlmacen: any = null;
  //clsTipoComprobante: any = null;
  clsUsuario: any = null;
  clsProveedor: any = null;
  clsEstadoCompra: any = {name: 'TODAS', code: 'Z'};
  clsTipoCompra: any = {name: 'TODAS', code: '0'};

  fechaInicio: string = '';
  fechaFinal: string = '';
  txtBuscar: string = '';

  clsFacturado: any = {name: "TODOS", code: 'Z'};
  clsActualizado: any = {name: "TODOS", code: 'Z'};
  

  entradaStock = new EntradaStock();

  entradaStocks: any[] = [];

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

  filtroEntradaStock = new FiltroEntradaStock();
  selectedEntradaStock: EntradaStock;

  vistaCarga2: boolean = true;

  verFrmCompra: boolean = false;

   //Pago Proveedor
   pagoProveedor: PagoProveedor = new PagoProveedor();
   ImporteTotal: string = '';

  //Cobrar
  displayConfirmarPago : boolean = false;
  facturado: any[] = [
    {name: 'Si', code: '1'},
    {name: 'No', code: '0'}
  ];
  //clsFacturado = {name: "Si", code: '1'};

  actualizado: any[] = [
    {name: 'Si', code: '1'},
    {name: 'No', code: '0'}
  ];
  //clsActualizado = {name: "Si", code: '1'};

  serieComprobante : string = '';
  fechaComprobante : string = '';
  numeroComprobante : string = '';
  observacionesComprobante : string = '';

  tipoComprobantes: any[] = [];
  clsTipoComprobante: any = null;
  serieFacturaProveedors: any[] = [];
  clsSerieFacturaProveedor: any = null;
  clsMetodoPago: any = null;
  metodoPagos: any[] = [];

  bancos: any[] = [];
  clsBanco: any = null;

  //numeroCuentas: any[] = [];
  //clsNumeroCuenta: any = null;
  numeroCuenta: string = '';
  numeroOperacion: string = '';

  tipoTarjetas: any[] = [];
  clsTipoTarjeta: any = null;
  numeroTarjeta: string = '';
  numeroCheque: string = '';
  
  //numeroCelulares: any[] = [];
  //clsNumeroCelular: any = null;
  numeroCelular: string = '';
  //initFacturaProveedors: InitFacturaProveedor[] = [];

  montoEntradaStock: string = null;
  montoAbonado: number = null;
  montoVuelto: string = null;

   //Generar Comprobante
   displayGenerateComprobante : boolean = false;
   nombreDocIdentidad: string = '';
   txtBuscarDocProveedor: string = '';
   txtBuscarProveedor: String = '';
   displayProveedor : boolean = false;

   selectedProveedor: Proveedor;

  pageProveedors: number = 0;
  firstProveedors: number = 0;
  lastProveedors: number = 0;
  rowsProveedors: number = 10;
  isFirstProveedors: boolean = true;
  isLastProveedors: boolean = false;
  totalRecordsProveedors: number = 0;
  numberElementsProveedors: number = 0;
  loadingProveedors: boolean = true; 
  vistaRegistroProveedor : boolean = false;
  proveedors: any[] = [];
  vistaBotonRegistroProveedor : boolean = false;
  vistaBotonEdicionProveedor : boolean = false;
  vistaCargaProveedor : boolean = true;
  tipoFrmProveedor: String = 'Nuevo Proveedor';

  newProveedor = new Proveedor();
  clsTipoDocumentoProveedor: any = null;
  nombreProveedor: string = '';
  tipo_documento_idProveedor: number = null;
  documentoProveedor: string = '';
  direccionProveedor: string = '';
  telefonoProveedor: string = '';
  anexo: string = '';
  celular: string = '';
  responsable: string = '';
  tipoDocumentosProveedor: any[] = [];

  //Facturar
  displayFacturarComra : boolean = false;

  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private entradaStockService: EntradaStockService, 
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService,
    private almacenService: AlmacenService, private router: Router,
    private entradaStockServiceData: EntradaStockServiceData,
    private tipoComprobanteService: TipoComprobanteService,
    private metodoPagoService:MetodoPagoService,
    private bancoService: BancoService,
    private proveedorService: ProveedorService,
    private tipoTarjetaService: TipoTarjetaService,
    private userService: UserService,
    private exportsService: ExportsService,
    private inventarioService: InventarioService) {
    this.breadcrumbService.setItems([
      { label: 'Reportes' },
      { label: 'Reporte de Compras de Productos', routerLink: ['/reporte/compras-generales'] }
    ]);

  }

  ngOnInit(): void {
    /* this.getTipoProductos();
    this.getMarcas();
    this.getPresentaciones(); */
    this.getAlmacens();
    this.getTipoDocumentos();
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

  setFocusBuscar() {    

    this.changeDetectorRef.detectChanges();
    this.inputTxtBuscar.nativeElement.focus();
  
  }

  setFocusBuscarDocProveedor() {    
    this.changeDetectorRef.detectChanges();
    this.inputBuscarDocProveedor.nativeElement.focus();
  }

  setFocusNombreProveedor() {    
    this.changeDetectorRef.detectChanges();
    this.inputNombreProveedorReg.nativeElement.focus();
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
  
      this.filtroEntradaStock.almacenId =  this.clsAlmacen.code;
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
  
      this.filtroEntradaStock.idUser =  this.clsUsuario.code;
      //this.listarPageMain(this.page, this.rows);
      this.getProveedores();
  
    });
  }

  getProveedores() {

    this.clsProveedor = null;
    this.proveedors = [];
  
    this.proveedorService.listarAll().subscribe(data => {
  
      this.proveedors.push({name: "Todos", code: 0});
      this.clsProveedor = {name: "Todos", code: 0};
      data.forEach(proveedor => {
        this.proveedors.push({name: proveedor.nombre + " - " +  proveedor.tipoDocumento.tipo + " " + proveedor.documento, code: proveedor.id});
      });
  
      this.filtroEntradaStock.idUser =  this.clsProveedor.code;
      this.listarPageMain(this.page, this.rows);
  
    });
  }

  getTipoDocumentos() {

    this.clsTipoDocumentoProveedor = null;
    this.tipoDocumentosProveedor = [];
  
    this.proveedorService.getTipoDocumentos().subscribe(data => {
      data.forEach(tipoDoc => {
        this.tipoDocumentosProveedor.push({name: tipoDoc.tipo, code: tipoDoc.id});
      });
    });
  }

  getTipoComprobantes() {

    this.clsTipoComprobante = null;
    this.tipoComprobantes = [];

    this.tipoComprobanteService.listarAll().subscribe(data => {
      data.forEach(tipoComprobante => {
        this.tipoComprobantes.push({name: tipoComprobante.nombre, code: tipoComprobante.id});
          this.clsTipoComprobante = {name: tipoComprobante.nombre, code: tipoComprobante.id};
      });
    });
  }

  getMetodoPagos() {
  
    this.clsMetodoPago = null;
    this.metodoPagos = [];
    let isFirst = true;

    this.clsFacturado = {name: "Si", code: '1'};
    this.clsActualizado = {name: "Si", code: '1'};
    this.serieComprobante = "";
    this.numeroComprobante = "";
    this.numeroComprobante = '';
    this.observacionesComprobante = '';

    this.numeroCuenta = "";
    this.numeroOperacion = "";
    this.numeroTarjeta = "";
    this.numeroCelular = "";
    this.numeroCheque = "";

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
          this.clsBanco = {name: banco.nombre, code: banco.id};
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
  
    this.entradaStockService.getEntradaStocks(this.filtroEntradaStock, p ,s).subscribe(data => {
      this.entradaStocks = data.content;
      this.isFirst = data.first;
      this.isLast = data.last;
      this.numberElements = data.numberOfElements;
      this.first = (p * s);
      this.last = (p * s) + this.numberElements;
      this.totalRecords = data.totalElements;
      this.loading = false;
    });
  }

  setFocusTipoComprobanteF() {    
    this.changeDetectorRef.detectChanges();
    this.inputserieComprobanteF.nativeElement.focus();
  }
  setFocusMontoAbonado() {    
    this.changeDetectorRef.detectChanges();
    this.inputmontoAbonado.nativeElement.focus();
  }

  cambioFiltros(event: Event){
    this.evaluarFiltros();
    this.listarPageMain(this.page, this.rows);
  }

  exportarPDF(): void{
    this.evaluarFiltros();
    this.printPDF();
  }

  exportarExcel(): void{
    this.evaluarFiltros();
    this.printXLS();
  }

  printPDF(): void{
    this.exportsService.exportComprasGeneralesPDF(this.filtroEntradaStock).subscribe(data => {
  
      const file = new Blob([data], { type: 'application/pdf' });  
      const fileURL = URL.createObjectURL(file);
  
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = fileURL;
      a.download = 'ComprasGeneral.pdf';
      a.click();
  
      //window.open(fileURL);
    });
  }

  printXLS(): void{
    this.exportsService.exportComprasGeneralesXLSX(this.filtroEntradaStock).subscribe(data => {
  
      const file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileURL = URL.createObjectURL(file);
  
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = fileURL;
      a.download = 'ComprasGeneral.xlsx';
      a.click();
      //window.open(fileURL);
    });
  }
  

  evaluarFiltros(){

    this.filtroEntradaStock = new FiltroEntradaStock();
  
    if(this.clsAlmacen != null){
      this.filtroEntradaStock.almacenId = this.clsAlmacen.code;
    }
    else{
      this.filtroEntradaStock.almacenId = 0;
    }

    if(this.fechaInicio != null && this.fechaFinal != null && this.fechaInicio.length == 10 && this.fechaFinal.length == 10){
      const fechaIni = moment(this.fechaInicio, 'DD/MM/YYYY');
      const fechaFin = moment(this.fechaFinal, 'DD/MM/YYYY');
      if(fechaIni.isValid && fechaFin.isValid){
        this.filtroEntradaStock.fechaInicio = fechaIni.format('YYYY-MM-DD');
        this.filtroEntradaStock.fechaFinal = fechaFin.format('YYYY-MM-DD');
      }
      else{
        this.filtroEntradaStock.fechaInicio = null;
        this.filtroEntradaStock.fechaFinal = null;
      }
    } else{
      this.filtroEntradaStock.fechaInicio = null;
      this.filtroEntradaStock.fechaFinal = null;
    }


    if(this.clsEstadoCompra != null && this.clsEstadoCompra.code != "Z") {
      this.filtroEntradaStock.estado = this.clsEstadoCompra.code;
    }
    else{
      this.filtroEntradaStock.estado = null;
    }

    if(this.txtBuscar != null && this.txtBuscar.trim().length > 0){
      this.filtroEntradaStock.buscarDatos = this.txtBuscar.trim();
    }else{
      this.filtroEntradaStock.buscarDatos = null;
    }

    //Nuevos
    if(this.clsUsuario != null && this.clsUsuario.code != "0") {
      this.filtroEntradaStock.idUser = this.clsUsuario.code;
      this.filtroEntradaStock.nameUser = this.clsUsuario.label;
    }
    else{
      this.filtroEntradaStock.idUser = null;
      this.filtroEntradaStock.nameUser = null;
    }

    if(this.clsProveedor != null && this.clsProveedor.code != "0") {
      this.filtroEntradaStock.idProveedor = this.clsProveedor.code;
    }
    else{
      this.filtroEntradaStock.idProveedor = null;
    }

    if(this.clsFacturado != null && this.clsFacturado.code != "Z") {
      this.filtroEntradaStock.facturado = this.clsFacturado.code;
    } else{
      this.filtroEntradaStock.facturado = null;
    }

    if(this.clsActualizado != null && this.clsActualizado.code != "Z") {
      this.filtroEntradaStock.actualizado = this.clsActualizado.code;
    } else{
      this.filtroEntradaStock.actualizado = null;
    }
  }

  buscar(): void{
    this.actualizarCompras();
  }

  confirmarRevActualizacion(): void{
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Confirma que desea revertir el ingreso de los Productos de la Compra al Stock?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Reversión de Actualización de Stocks de Compra',
      accept: () => {
       this.confirmarRevActualizacionConfirmado();
      },
      reject: () => {
      }
    });
  }

  confirmarRevActualizacionConfirmado(): void{
 
    this.entradaStockService.revActualizacionEntradaStock(this.selectedEntradaStock).subscribe({
      next: (data) => {
        if(data != null && data.id != null){
          //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Proveedor se ha registrado satisfactoriamente'});
          this.messageService.add({severity:'success', summary:'Confirmado', detail: 'Se ha revertido el ingreso de los Productos de la compra a los Stocks Exitosamente'});
          this.actualizarCompras();
        }
      },
      error: (err) => {
        console.log(err);
      }        
   });

  }

  confirmarActualizacion(): void{
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Confirma que desea Ingresar los Productos de la Compra al Stock?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Actualización de Stocks de Compra',
      accept: () => {
       this.confirmarActualizacionConfirmado();
      },
      reject: () => {
      }
    });
  }

  confirmarActualizacionConfirmado(): void{
 
    this.entradaStockService.actualizarEntradaStock(this.selectedEntradaStock).subscribe({
      next: (data) => {
        if(data != null && data.id != null){
          //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Proveedor se ha registrado satisfactoriamente'});
          this.messageService.add({severity:'success', summary:'Confirmado', detail: 'Se han ingresado los Productos de la compra a los Stocks Exitosamente'});
          this.actualizarCompras();
        }
      },
      error: (err) => {
        console.log(err);
      }        
   });

  }

  confirmarRevFactura(): void{
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Confirma que desea eliminar la Factura de la Compra?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Eliminación de Facturación de Compra',
      accept: () => {
       this.confirmarRevFacturaConfirmado();
      },
      reject: () => {
      }
    });
  }

  confirmarRevFacturaConfirmado(): void{
 
    this.entradaStockService.revFacturaEntradaStock(this.selectedEntradaStock).subscribe({
      next: (data) => {
        if(data != null && data.id != null){
          //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Proveedor se ha registrado satisfactoriamente'});
          this.messageService.add({severity:'success', summary:'Confirmado', detail: 'La Facturación de la Compra se ha eliminado Exitosamente'});
          this.actualizarCompras();
        }
      },
      error: (err) => {
        console.log(err);
      }        
   });

  }

  confirmarFactura(): void{
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Confirma que desea registrar la Factura de la Compra?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Facturación de Compra',
      accept: () => {
       this.confirmarFacturaConfirmado();
      },
      reject: () => {
      }
    });
  }

  confirmarFacturaConfirmado(): void{
    let entradaStockUse = new EntradaStock();
    entradaStockUse = structuredClone(this.selectedEntradaStock);

    //Facturado

    let facturaProveedor = new FacturaProveedor();
    let tipoComprobante = new TipoComprobante();

    facturaProveedor.serie = this.serieComprobante;
    facturaProveedor.numero = this.numeroComprobante;
    facturaProveedor.observaciones = this.observacionesComprobante;
    let tipoComprobanteId = parseInt((this.clsTipoComprobante != null) ? this.clsTipoComprobante.code : "0");
    
    const fechaComp = moment(this.fechaComprobante, 'DD/MM/YYYY');
      if(!fechaComp.isValid){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Comprobante indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return;
      }
    facturaProveedor.fecha = fechaComp.format('YYYY-MM-DD');

    tipoComprobante.id = tipoComprobanteId;
    facturaProveedor.tipoComprobante = tipoComprobante;
    facturaProveedor.almacen = entradaStockUse.almacen;

    entradaStockUse.facturaProveedor = facturaProveedor;

    this.entradaStockService.facturarEntradaStock(entradaStockUse).subscribe({
      next: (data) => {
        if(data != null && data.id != null){
          //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Proveedor se ha registrado satisfactoriamente'});
          this.messageService.add({severity:'success', summary:'Confirmado', detail: 'La Compra se ha Facturado Exitosamente'});
          this.displayFacturarComra = false;
          this.actualizarCompras();
        }
      },
      error: (err) => {
        console.log(err);
      }        
   });

  }


  confirmarPago(): void{
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Confirma que desea realizar el Pago de la Compra?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Pago de Compra',
      accept: () => {
       this.confirmarPagoConfirmado();
      },
      reject: () => {
      }
    });
  }

  confirmarPagoConfirmado(): void{
    this.pagoProveedor = new PagoProveedor();
    let metodoPago = new MetodoPago();

    let metodoPagoId = parseInt((this.clsMetodoPago != null) ? this.clsMetodoPago.code : "0");
    let tipoId = this.clsMetodoPago != null ? this.clsMetodoPago.tipoId : "";
    let metodoPagoName = this.clsMetodoPago != null ? this.clsMetodoPago.name : "";

    metodoPago.id = metodoPagoId;
    metodoPago.tipoId = tipoId;
    metodoPago.nombre = metodoPagoName;

    this.pagoProveedor.entradaStock = structuredClone(this.selectedEntradaStock);
    this.pagoProveedor.montoPago = this.montoAbonado;

    let tipoTarjeta = this.clsTipoTarjeta != null ? this.clsTipoTarjeta.name : "";
    let siglaTarjeta = this.clsTipoTarjeta != null ? this.clsTipoTarjeta.sigla : "";

    let banco = this.clsBanco != null ? this.clsBanco.name : "";

    let tipoComprobanteId = parseInt((this.clsTipoComprobante != null) ? this.clsTipoComprobante.code : "0");

    this.pagoProveedor.tipoTarjeta = tipoTarjeta;
    this.pagoProveedor.siglaTarjeta = siglaTarjeta;
    this.pagoProveedor.numeroTarjeta = this.numeroTarjeta;
    this.pagoProveedor.banco = banco;
    this.pagoProveedor.numeroCuenta = this.numeroCuenta;
    this.pagoProveedor.numeroCelular = this.numeroCelular;
    this.pagoProveedor.numeroCheque = this.numeroCheque;
    this.pagoProveedor.codigoOperacion = this.numeroOperacion;
    this.pagoProveedor.tipoComprobanteId = tipoComprobanteId;
    this.pagoProveedor.metodoPago = metodoPago;

    //Facturado
    let facturado = parseInt((this.clsFacturado != null) ? this.clsFacturado.code : "0");
    this.pagoProveedor.entradaStock.facturado = facturado;

    let facturaProveedor = new FacturaProveedor();
    let tipoComprobante = new TipoComprobante();

    if(this.pagoProveedor.entradaStock.facturado == 1){
      facturaProveedor.serie = this.serieComprobante;
      facturaProveedor.numero = this.numeroComprobante;
      facturaProveedor.observaciones = this.observacionesComprobante;
      
      const fechaComp = moment(this.fechaComprobante, 'DD/MM/YYYY');
        if(!fechaComp.isValid){
          this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Comprobante indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
          return;
        }
      facturaProveedor.fecha = fechaComp.format('YYYY-MM-DD');

      tipoComprobante.id = tipoComprobanteId;
      facturaProveedor.tipoComprobante = tipoComprobante;
      facturaProveedor.almacen = this.pagoProveedor.entradaStock.almacen;

      this.pagoProveedor.entradaStock.facturaProveedor = facturaProveedor;
    }

    //Actualizado
    let actualizado = parseInt((this.clsActualizado != null) ? this.clsActualizado.code : "0");
    this.pagoProveedor.entradaStock.actualizado = actualizado;

    this.entradaStockService.pagarEntradaStock(this.pagoProveedor).subscribe({
      next: (data) => {
        if(data != null && data.id != null){
          //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Proveedor se ha registrado satisfactoriamente'});
          this.messageService.add({severity:'success', summary:'Confirmado', detail: 'La Compra se ha Registrado Exitosamente'});
          this.pagoProveedor = data;
          this.displayConfirmarPago = false;
          this.actualizarCompras();
        }
      },
      error: (err) => {
        console.log(err);
      }        
   });

  }

  buscarDocProveedor() {

    this.proveedorService.getByDocument(this.txtBuscarDocProveedor).subscribe({
      next: (data) => {        
            this.entradaStock.proveedor = data;
            this.entradaStockService.modificarProveedor(this.entradaStock).subscribe({
              next: (dataUdpProveedor) => {
                if(dataUdpProveedor != null && dataUdpProveedor.id != null){

                  this.entradaStock.proveedor = dataUdpProveedor.proveedor;
                  
                  this.txtBuscarProveedor = "";
                  this.txtBuscarDocProveedor = "";
                  this.displayProveedor = false;
                  this.nombreDocIdentidad = data.tipoDocumento.tipo;
                }
              },
              error: (errUdpProveedor) => {
                console.log(errUdpProveedor);
              }        
          });       
      },
      error: (err) => {
        this.txtBuscarDocProveedor = "";
        this.setFocusBuscarDocProveedor();
      }
    });
  }

  buscarProveedor(): void{
    this.displayProveedor = false;
    this.displayProveedor = true;
    this.selectedProveedor = null;
    this.setFocusBuscar();
    this.buscarProveedors();
  }

  buscarProveedors(): void{
    this.cerrarProveedor();
    this.pageProveedors = 0;
    this.listarPageProveedors(this.pageProveedors , this.rowsProveedors);
  }


  listarPageProveedors(p: number, s:number) {

    this.proveedorService.listarPageable(p, s, this.txtBuscarProveedor).subscribe(data => {
      this.proveedors = data.content;
      this.isFirstProveedors = data.first;
      this.isLastProveedors = data.last;
      this.numberElementsProveedors = data.numberOfElements;
      this.firstProveedors = (p * s);
      this.lastProveedors = (p * s) + this.numberElementsProveedors;
      this.totalRecordsProveedors = data.totalElements;
      this.loadingProveedors = false;
    });
  }

  loadDataProveedors(event: LazyLoadEvent) { 
    this.loadingProveedors = true; 
    this.rowsProveedors = event.rows;
    this.pageProveedors = event.first / this.rows;
  
    this.listarPageProveedors(this.pageProveedors, this.rowsProveedors);
  
  }

  
  isLastPageProveedors(): boolean {
      //return this.bancos ? this.first > (this.bancos.length - this.rows): true;
      return this.isLastProveedors;
  }
  
  isFirstPageProveedors(): boolean {
      return this.isFirstProveedors;
  }

  nuevoProveedor(): void{
    this.vistaBotonRegistroProveedor = true;
    this.vistaBotonEdicionProveedor = false;
    
    this.tipoFrmProveedor = 'Nuevo Proveedor' 
    this.vistaRegistroProveedor = true;

  this.cancelarProveedor();
  }

  cancelarProveedor() {

    this.newProveedor = new Proveedor();
  
    this.clsTipoDocumentoProveedor = null;
    this.nombreProveedor = '';
    this.tipo_documento_idProveedor = null;
    this.documentoProveedor = '';
    this.direccionProveedor = '';
    this.telefonoProveedor = '';
    this.anexo = '';
    this.celular = '';
    this.responsable = '';
  
    this.setFocusNombreProveedor();
    
  }

  cerrarProveedor(){
    this.vistaRegistroProveedor = false;
  }

  registrarProveedor(event: Event) {
    this.confirmationService.confirm({
        key: 'confirmDialog',
        target: event.target,
        message: '¿Está seguro de Registrar al Proveedor?',
        icon: 'pi pi-info-circle',
        header: 'Confirmación Registro',
        accept: () => {
          //this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
         // this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have accepted'});
          this.registrarConfirmadoProveedor();
        },
        reject: () => {
         // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
    });
  }

  registrarConfirmadoProveedor(){
    
    this.vistaCargaProveedor = true;
    let tipoDocumentoBase = new TipoDocumento();
    tipoDocumentoBase.id = parseInt((this.clsTipoDocumentoProveedor != null) ? this.clsTipoDocumentoProveedor.code : "0");

    this.newProveedor.nombre = this.nombreProveedor.toString().trim();
    this.newProveedor.tipoDocumento = tipoDocumentoBase;
    this.newProveedor.documento = this.documentoProveedor;
    this.newProveedor.direccion = this.direccionProveedor;
    this.newProveedor.telefono = this.telefonoProveedor;
    this.newProveedor.anexo = this.anexo;
    this.newProveedor.celular = this.celular;
    this.newProveedor.responsable = this.responsable;
      
      
    this.proveedorService.registrarRetProveedor(this.newProveedor).subscribe(data => {
      if(data != null){

        this.entradaStock.proveedor = data;
        this.entradaStockService.modificarProveedor(this.entradaStock).subscribe({
          next: (dataUdpProveedor) => {
            if(dataUdpProveedor != null && dataUdpProveedor.id != null){

              this.entradaStock.proveedor = dataUdpProveedor.proveedor;
              this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Proveedor se ha registrado satisfactoriamente'});
              this.txtBuscarProveedor = "";
              this.txtBuscarDocProveedor = "";
              this.displayProveedor = false;
              this.nombreDocIdentidad = data.tipoDocumento.tipo;
            }
          },
          error: (errUdpProveedor) => {
            console.log(errUdpProveedor);
          }        
        });
      }
    });

  }

  aceptarProveedor(registro){
    if(registro != null){
        this.entradaStock.proveedor = registro;
        this.entradaStockService.modificarProveedor(this.entradaStock).subscribe({
          next: (dataUdpProveedor) => {
            if(dataUdpProveedor != null && dataUdpProveedor.id != null){

              this.entradaStock.proveedor = dataUdpProveedor.proveedor;
              
              this.txtBuscarProveedor = "";
              this.txtBuscarDocProveedor = "";
              this.displayProveedor = false;
              this.nombreDocIdentidad = registro.tipoDocumento.tipo;
            }
          },
          error: (errUdpProveedor) => {
            console.log(errUdpProveedor);
          }        
       });     
    }
  }


  confirmarAnularCompra(): void{

    this.entradaStockService.anular(this.selectedEntradaStock.id).subscribe(() => {
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'La Compra se ha anulado satisfactoriamente'});
      this.actualizarCompras();
   });

  }

  confirmarEliminarCompra(): void{

    this.entradaStockService.eliminar(this.selectedEntradaStock.id).subscribe(() => {
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'La Compra se ha eliminado satisfactoriamente'});
      this.actualizarCompras();
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
      //this.buscarCelulares();
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
          isFirst = false;
        }
      });
    });
  }

  calcularMontos(event: Event): void {
    let importe = this.floor10(this.entradaStock.totalMonto, -2);
    let vuelto =  this.montoAbonado - importe;
    this.montoVuelto = vuelto.toFixed(2);
  }



  //Buttons Administratives
  actualizarCompras(): void{
    this.selectedEntradaStock  = null;
    this.evaluarFiltros();
    this.listarPageMain(this.page, this.rows);
  }
  
  nuevaCompra(): void{
    this.entradaStockServiceData.setEntradaStockStore(null);
    this.router.navigateByUrl('/compras/compra');
  }
  
  verCompra(): void{
    if(this.selectedEntradaStock == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Seleccione una Compra haciendo click en su fila correspondiente'});

    }else{
      this.vistaCarga2 = false;
      this.verFrmCompra  = true;
    }
  }

  printCompra(): void{

  }

  edittCompra(): void{
    if(this.selectedEntradaStock == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Seleccione una Compra haciendo click en su fila correspondiente'});
      return;
    }
    if(this.selectedEntradaStock.estado == 0){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede editar una Compra Anulada'});
      return;
    }
    if(this.selectedEntradaStock.estado == 2){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede editar una Compra Facturada No Pagada'});
      return;
    }
    if(this.selectedEntradaStock.estado == 3){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede editar una Compra Facturada Pagada Parcialmente'});
      return;
    }
    if(this.selectedEntradaStock.estado == 4){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede editar una Compra Facturada Pagada Total'});
      return;
    }
    this.entradaStockServiceData.setEntradaStockStore(this.selectedEntradaStock);
    this.router.navigateByUrl('/compras/compra');
  }

  cobrarCompra(): void{
    if(this.selectedEntradaStock == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Seleccione una Compra haciendo click en su fila correspondiente'});
      return;
    }
    if(this.selectedEntradaStock.estado == 0){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede pagar una Compra Anulada'});
      return;
    }
    if(this.selectedEntradaStock.estado == 2){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede pagar una Compra Facturada No Pagada'});
      return;
    }
    if(this.selectedEntradaStock.estado == 3){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede pagar una Compra Facturada Pagada Parcialmente'});
      return;
    }
    if(this.selectedEntradaStock.estado == 4){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede pagar una Compra Facturada Pagada Total'});
      return;
    }

    if(this.selectedEntradaStock.totalMonto == null || this.selectedEntradaStock.totalMonto == 0){
      this.messageService.add({severity:'error', summary:'Error', detail: 'No se puede pagar un monto de compra igual a cero'});
      return;
    }

    this.ImporteTotal = this.selectedEntradaStock.totalMonto.toFixed(2);
    this.montoAbonado = this.selectedEntradaStock.totalMonto;
    this.montoVuelto = "0.00";
    this.numeroCheque = "";

    this.getTipoComprobantes();
    this.getMetodoPagos();

    this.displayConfirmarPago = false;
    this.displayConfirmarPago = true;

    this.setFocusMontoAbonado();
  }

  anularCompra(): void{
    if(this.selectedEntradaStock == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Seleccione una Compra haciendo click en su fila correspondiente'});
      return;
    }
    if(this.selectedEntradaStock.estado == 0){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'La Compra ya se encuentra Anulada'});
      return;
    }
    if(this.selectedEntradaStock.estado == 1){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede Anular una Compra que aun no fue pagada y que no se ha generado ningún comprobante'});
      return;
    }

    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Confirma que desea Anular la Compra? - Este proceso no podrá ser revertido',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Anulación de Compra',
      accept: () => {
       this.confirmarAnularCompra();
      },
      reject: () => {
      }
    });

  }

  eliminarCompra(): void{
    if(this.selectedEntradaStock == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Seleccione una Compra haciendo click en su fila correspondiente'});
      return;
    }
    if(this.selectedEntradaStock.estado == 0){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede eliminar una Compra Anulada'});
      return;
    }

    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Confirma que desea Eliminar la Compra? - Este proceso no podrá ser revertido',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Eliminación de Compra',
      accept: () => {
       this.confirmarEliminarCompra();
      },
      reject: () => {
      }
    });

  }

  

  facturarCompra(): void{
    if(this.selectedEntradaStock == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Seleccione una Compra haciendo click en su fila correspondiente'});
      return;
    }
    if(this.selectedEntradaStock.estado == 0){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede facturar una Compra Anulada'});
      return;
    }
    if(this.selectedEntradaStock.estado == 1){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede Facturar una Compra que aun no fue pagada'});
      return;
    }
    if(this.selectedEntradaStock.facturado == 1){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'La Compra ya se encuentra Facturada'});
      return;
    }

    this.ImporteTotal = this.selectedEntradaStock.totalMonto.toFixed(2);
    this.montoAbonado = this.selectedEntradaStock.totalMonto;
    this.montoVuelto = "0.00";
    this.numeroCheque = "";

    this.getTipoComprobantes();
    //this.getMetodoPagos();

    this.displayFacturarComra = false;
    this.displayFacturarComra = true;

    this.setFocusTipoComprobanteF();

  }

  actualizarCompra(): void{
    if(this.selectedEntradaStock == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Seleccione una Compra haciendo click en su fila correspondiente'});
      return;
    }
    if(this.selectedEntradaStock.estado == 0){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede ingresar a los Stocks los Productos de una Compra Anulada'});
      return;
    }
    if(this.selectedEntradaStock.estado == 1){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede ingresar a los Stocks los Productos de una Compra que aun no fue pagada'});
      return;
    }
    if(this.selectedEntradaStock.actualizado == 1){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Los Productos de la Compra ya se encuentran ingresadas al Stock'});
      return;
    }

    this.confirmarActualizacion();

  }

  revFacturarCompra(): void{
    if(this.selectedEntradaStock == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Seleccione una Compra haciendo click en su fila correspondiente'});
      return;
    }
    if(this.selectedEntradaStock.estado == 0){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede eliminar la facturación de una Compra Anulada'});
      return;
    }
    if(this.selectedEntradaStock.estado == 1){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede eliminar la facturación de una Compra que aun no fue pagada'});
      return;
    }
    if(this.selectedEntradaStock.facturado == 0){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'La Compra no cuenta con Facturación para eliminar'});
      return;
    }

    this.confirmarRevFactura();
  }

  revActualizarCompra(): void{
    if(this.selectedEntradaStock == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Seleccione una Compra haciendo click en su fila correspondiente'});
      return;
    }
    if(this.selectedEntradaStock.estado == 0){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede revertir el ingreso de los Productos de una Compra Anulada'});
      return;
    }
    if(this.selectedEntradaStock.estado == 1){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'No se puede revertir el ingreso de los Productos de una Compra que aun no fue pagada'});
      return;
    }
    if(this.selectedEntradaStock.actualizado == 0){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Los Productos de la Compra no han ingresado a los Stocks para revertir'});
      return;
    }

    this.confirmarRevActualizacion();
  }

  //Other Functions
  cerrarFormularioVerCompra($event) {

    
    //productoCambiado: Producto = $event;
    this.loading = true;

    this.selectedEntradaStock  = null;
    this.verFrmCompra  = false;
    this.vistaCarga2 = true;
    this.actualizarCompras();
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
