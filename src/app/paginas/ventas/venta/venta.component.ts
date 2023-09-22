import { ProductoService } from './../../../_service/producto.service';
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
import { VentaService } from './../../../_service/venta.service';
import { UnidadService } from '../../../_service/unidad.service';
import { StockService } from '../../../_service/stock.service';

import { Cliente } from './../../../_model/cliente';
import { TipoDocumento } from './../../../_model/tipo_documento';
import { Venta } from './../../../_model/venta';
import { Almacen } from 'src/app/_model/almacen';
import { Comprobante } from 'src/app/_model/comprobante';
import { DetalleVenta } from 'src/app/_model/detalle_venta';
import { DetalleUnidadProducto } from 'src/app/_model/detalle_unidad_producto';

import { ProductoVentas } from 'src/app/_model/producto_ventas';
import { FiltroProductosVenta } from 'src/app/_util/filtro_productos_venta';
import {Unidad } from '../../../_model/unidad';

import * as moment from 'moment';
import { ProductoAddVenta } from 'src/app/_model/producto_add_venta';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class VentaComponent implements OnInit {

  @ViewChild('inputBuscar', { static: false }) inputBuscar: ElementRef;
  @ViewChild('inputBuscarDocCliente', { static: false }) inputBuscarDocCliente: ElementRef;
  @ViewChild('inputNombreClienteReg', { static: false }) inputNombreClienteReg: ElementRef;
  @ViewChild('inputBuscarProductos', { static: false }) inputBuscarProductos: ElementRef;
  @ViewChild('inputcantidadProductoLotes', { static: false }) inputcantidadProductoLotes: ElementRef;
  @ViewChild('inputcantidadDescuento', { static: false }) inputcantidadDescuento: ElementRef;
  @ViewChild('inputcantidadProductoStocks', { static: false }) inputcantidadProductoStocks: ElementRef;
  @ViewChild('inputcantidadDescuentoStock', { static: false }) inputcantidadDescuentoStock: ElementRef;
  @ViewChild('inputcodigoProducto', { static: false }) inputcodigoProducto: ElementRef;

  vistaCarga : boolean = true;
  verFrmVenta : boolean = false;
  verFrmAlmacen : boolean = false;
  displayClient : boolean = false;
  vistaRegistroCliente : boolean = false;
  displayProductsToVentas : boolean = false;
  displayAddProductsLotes : boolean = false;
  displayAddProductsNoLotes : boolean = false;
  activeProductLote: boolean = false;
  displayEditProductsLotes : boolean = false;
  displayEditProductsNoLotes : boolean = false;

  almacens: any[] = [];
  clsAlmacen: any = null;

  venta: Venta = new Venta();

  
  codigoProducto: string = '';
  txtBuscarDocCliente: string = '';
  nombreDocIdentidad: string = '';
  cantIcbper: number = 0;

  detalleVentas: DetalleVenta[] = [];

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


  txtBuscarCliente: String = '';
  clientes: any[] = [];

  pageClientes: number = 0;
  firstClientes: number = 0;
  lastClientes: number = 0;
  rowsClientes: number = 10;
  isFirstClientes: boolean = true;
  isLastClientes: boolean = false;
  totalRecordsClientes: number = 0;
  numberElementsClientes: number = 0;
  loadingClientes: boolean = true; 

  selectedClient: Cliente;

  //Reg Cliente

  tipoDocumentosCliente: any[] = [];

  clsTipoDocumentoCliente: any = null;
  nombreCliente: string = '';
  tipo_documento_idCliente: number = null;
  documentoCliente: string = '';
  direccionCliente: string = '';
  telefonoCliente: string = '';
  correo1Cliente: string = '';
  correo2Cliente: string = '';

  tipoFrmCliente: String = 'Nuevo Cliente';
  vistaBotonRegistroCliente : boolean = false;
  vistaBotonEdicionCliente : boolean = false;
  vistaCargaCliente : boolean = true;

  newCliente = new Cliente();

  //Estructuras de Productos

  productosVentas: any[] = [];
  filtroProductosVenta: FiltroProductosVenta = new FiltroProductosVenta();

  pageProductosToVentas: number = 0;
  firstProductosToVentas: number = 0;
  lastProductosToVentas: number = 0;
  rowsProductosToVentas: number = 10;
  isFirstProductosToVentas: boolean = true;
  isLastProductosToVentas: boolean = false;
  totalRecordsProductosToVentas: number = 0;
  numberElementsProductosToVentas: number = 0;
  loadingProductosToVentas: boolean = true; 

  txtBuscarProducto: string = '';

  selectedProductVenta: ProductoVentas;

  unidads: any[] = [];
  clsUnidad: any = null;
  
  lotesProducto: any[] = [];
  clsLote: any = null;
  fechaVencimiento: string = '';
  cantLote: number = null;
  cantUnitLote: number = null;


  lotesProductoBack: any[] = [];
  indexLote : number = 0;

  cantidadProductoLotes: number = 1;
  
  tiposDescuento: any[] = [
    {name: '% (0 a 100)', code: '1'},
    {name: 'Valor Fijo', code: '2'}
  ];
  
  clsTiposDescuento: any = null;
  cantidadDescuento: number = 0;
  precioUnitario: string = null;
  precioTotal: string = null;
  
  cantStock: number = null;
  cantUnitStock: number = null;

  stocksProductoBack: any[] = [];
  
  cantidadProductoStocks: number = 1;
  cantidadDescuentoStock: number = 0;


  //Detalle Ventas

  detalleVentaGestion: DetalleVenta = new DetalleVenta();
  


  constructor(public app: AppComponent, private gestionloteService: GestionloteService, private messageService: MessageService, private clienteService: ClienteService,
              private changeDetectorRef: ChangeDetectorRef, private confirmationService: ConfirmationService , private ventaService: VentaService,
              private productoService: ProductoService, private unidadService:UnidadService, private stockService: StockService) { }

  ngOnInit(): void {

    this.getAlmacens();
    this.getUnidads();
    this.vistaCarga = false;
    this.verFrmAlmacen = true;

    //inicializar subclases de venta
    this.venta.cliente = new Cliente();
    this.venta.comprobante = new Comprobante();
    this.venta.almacen = new Almacen();
    this.getTipoDocumentos();
    
  }
/* 
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
  } */

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

  getUnidads() {

    this.clsUnidad = null;
    this.unidads = [];

    this.unidadService.listarAll().subscribe(data => {
      data.forEach(unidad => {
        this.unidads.push({name: unidad.nombre, code: unidad.id});

        if(unidad.cantidad == 1){
          this.clsUnidad = {name: unidad.nombre, code: unidad.id};
        }
      });
    });
  }

  seleccionarLocal(): void{

    if(this.clsAlmacen != null){
      this.venta.almacen = new Almacen();
      this.venta.almacen.id = this.clsAlmacen.code;
      this.venta.almacen.nombre = this.clsAlmacen.name;
      this.venta.subtotalInafecto = 0;
      this.venta.subtotalAfecto = 0;
      this.venta.subtotalExonerado = 0;
      this.venta.totalMonto = 0;
      this.venta.totalAfectoIsc = 0;
      this.venta.igv = 0;
      this.venta.isc = 0;

      this.venta.cliente = null;
      this.venta.comprobante = null;

      this.txtBuscarDocCliente = "";
      this.txtBuscarCliente = "";
      this.displayClient = false;
      this.nombreDocIdentidad = "";
      this.displayProductsToVentas = false;
      this.venta.cantidadIcbper = 0;

      console.log("aca1");

      this.ventaService.registrarRetVenta(this.venta).subscribe({
        next: (data) => {
          if(data != null && data.id != null){
            //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Cliente se ha registrado satisfactoriamente'});
            this.venta.id = data.id;
            this.venta.fecha = data.fecha;
            this.venta.subtotalInafecto = data.subtotalInafecto;
            this.venta.subtotalAfecto = data.subtotalAfecto;
            this.venta.subtotalExonerado = data.subtotalExonerado;
            this.venta.totalMonto = data.totalMonto;
            this.venta.totalAfectoIsc = data.totalAfectoIsc;
            this.venta.igv = data.igv;
            this.venta.isc = data.isc;
            this.venta.estado = data.estado;
            this.venta.pagado = data.pagado;
            this.venta.hora = data.hora;
            this.venta.tipo = data.tipo;
            this.venta.numeroVenta = data.numeroVenta;
            this.venta.montoIcbper = data.montoIcbper;
            this.venta.cantidadIcbper = data.cantidadIcbper;

            this.TotalICBPER = (this.venta.montoIcbper * this.venta.cantidadIcbper).toFixed(2);

            this.venta.cliente = new Cliente();
            this.venta.comprobante = new Comprobante();
            this.detalleVentas = [];
            this.venta.detalleVentas = this.detalleVentas;
  
            this.verFrmVenta = true;
            this.vistaCarga = false;
            this.verFrmAlmacen = false;

            this.setFocusCodigoProducto();
          }
        },
        error: (err) => {
          console.log(err);
        }        
     });

      
    }
    else{
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'No ha seleccionado un Local o Sucursal Válido'});
    }
    
  }


  //Seccion CLientes
  getTipoDocumentos() {

    this.clsTipoDocumentoCliente = null;
    this.tipoDocumentosCliente = [];
  
    this.clienteService.getTipoDocumentos().subscribe(data => {
      data.forEach(tipoDoc => {
        this.tipoDocumentosCliente.push({name: tipoDoc.tipo, code: tipoDoc.id});
      });
    });
  }

  buscarCliente(): void{
    this.displayClient = false;
    this.displayClient = true;
    this.selectedClient = null;
    this.setFocusBuscar();
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

 /*  nextClientes() {
    this.pageClientes++;
    this.listarPageClientes(this.pageClientes, this.rowsClientes);
  }
  
  prevClientes() {
      this.pageClientes--;
      this.listarPageClientes(this.pageClientes, this.rowsClientes);
  }
  
  resetClientes() {
      this.firstClientes = 0;
      this.listarPageClientes(this.pageClientes, this.rowsClientes);
  } */
  
  isLastPageClientes(): boolean {
      //return this.bancos ? this.first > (this.bancos.length - this.rows): true;
      return this.isLastClientes;
  }
  
  isFirstPageClientes(): boolean {
      return this.isFirstClientes;
  }

  setFocusBuscar() {    
    this.changeDetectorRef.detectChanges();
    this.inputBuscar.nativeElement.focus();
  }

  setFocusBuscarDocCliente() {    
    this.changeDetectorRef.detectChanges();
    this.inputBuscarDocCliente.nativeElement.focus();
  }

  setFocusCodigoProducto() {    
    this.changeDetectorRef.detectChanges();
    this.inputcodigoProducto.nativeElement.focus();
  }

  setFocusNombreCliente() {    
    this.changeDetectorRef.detectChanges();
    this.inputNombreClienteReg.nativeElement.focus();
  }

  aceptarCliente(registro){
    //console.log(registro);
    if(registro != null){

      this.venta.cliente = registro;
        this.ventaService.modificarCliente(this.venta).subscribe({
          next: (dataUdpCliente) => {
            if(dataUdpCliente != null && dataUdpCliente.id != null){

              this.venta.cliente = dataUdpCliente.cliente;
              
              this.txtBuscarCliente = "";
              this.txtBuscarDocCliente = "";
              this.displayClient = false;
              this.nombreDocIdentidad = registro.tipoDocumento.tipo;
              console.log(this.nombreDocIdentidad);
            }
          },
          error: (errUdpCliente) => {
            console.log(errUdpCliente);
          }        
       });
    }
  }

  modificarCantidadICBPER(event: Event){
    //console.log(registro);
    if(this.venta != null){
        this.ventaService.modificarVenta(this.venta).subscribe({
          next: (data) => {
            if(data != null && data.id != null){

              this.venta.id = data.id;
              this.venta.fecha = data.fecha;
              this.venta.subtotalInafecto = data.subtotalInafecto;
              this.venta.subtotalAfecto = data.subtotalAfecto;
              this.venta.subtotalExonerado = data.subtotalExonerado;
              this.venta.totalMonto = data.totalMonto;
              this.venta.totalAfectoIsc = data.totalAfectoIsc;
              this.venta.igv = data.igv;
              this.venta.isc = data.isc;
              this.venta.estado = data.estado;
              this.venta.pagado = data.pagado;
              this.venta.hora = data.hora;
              this.venta.tipo = data.tipo;
              this.venta.numeroVenta = data.numeroVenta;

              this.venta.cliente = data.cliente;
              this.venta.comprobante = data.comprobante;
              this.detalleVentas = data.detalleVentas;
              this.venta.detalleVentas = this.detalleVentas;


              let opGrabada = this.venta.subtotalAfecto - this.venta.igv
              this.OpGravada = opGrabada.toFixed(2);
              this.OpExonerada = this.venta.subtotalExonerado.toFixed(2);
              this.OpInafecta = this.venta.subtotalInafecto.toFixed(2);
              this.TotalISC = this.venta.isc.toFixed(2);
              this.TotalIGV = this.venta.igv.toFixed(2);
              this.ImporteTotal = this.venta.totalMonto.toFixed(2);

              this.venta.montoIcbper = data.montoIcbper;
              this.venta.cantidadIcbper = data.cantidadIcbper;
              this.TotalICBPER = (this.venta.montoIcbper * this.venta.cantidadIcbper).toFixed(2);
            }
          },
          error: (errUdpCliente) => {
            console.log(errUdpCliente);
          }        
       });
    }
  }

  buscarDocCliente() {

    //this.messageService.add({severity:'warn', summary:'Confirmado', detail: 'El Producto se ha editado satisfactoriamente'});
    /* this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Warn', detail: 'Message Content' }); */

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

  setFocusBuscarProducto() {    
    this.changeDetectorRef.detectChanges();
    this.inputBuscarProductos.nativeElement.focus();
  }


  buscarProducto() {

    this.filtroProductosVenta.almacenId = this.venta.almacen.id;
    this.filtroProductosVenta.size = 10;

    this.displayProductsToVentas = false;
    this.displayProductsToVentas = true;
    this.selectedProductVenta = null
    this.buscarProductos();
    this.setFocusBuscarProducto();
    
  }

  buscarProductos(): void{
    this.cerrarProducto();
    this.loadingProductosToVentas = true; 
    this.filtroProductosVenta.palabraClave = this.txtBuscarProducto;
    this.filtroProductosVenta.unidadId = parseInt((this.clsUnidad != null) ? this.clsUnidad.code : 0);
    this.filtroProductosVenta.page = 0;
    this.listarPageProductosToVentas();
  }

  cerrarProducto(){
    //this.vistaRegistroCliente = false;
    console.log("aqui");
  }

  loadDataProductosToVentas(event: LazyLoadEvent) { 
    this.loadingProductosToVentas = true; 
    this.filtroProductosVenta.size = event.rows;
    this.filtroProductosVenta.page = event.first / this.rows;
  
    this.listarPageProductosToVentas();
  
  }

  listarPageProductosToVentas() {

    this.productoService.getProductosVenta(this.filtroProductosVenta).subscribe(data => {
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
    console.log(registro);
    this.selectedProductVenta = registro;
    this.activeProductLote = registro.producto.activoLotes == 1;
    this.lotesProducto = [];
    this.clsLote = null;

    this.cantidadProductoLotes = 1;
    this.cantidadProductoStocks = 1;
    this.clsTiposDescuento = {name: "% (0 a 100)", code: '1'};;
    this.cantidadDescuento = 0;
    this.cantidadDescuentoStock = 0;

    this.stockService.listarStocksVentas(this.venta.almacen.id, registro.producto.id).subscribe(data => {
      console.log(data);

      if(this.activeProductLote){

        this.lotesProductoBack = data.respuesta;

        let isFirst = true;
        data.respuesta.forEach(registroLote => {
          this.lotesProducto.push({name: registroLote.lote.nombre, code: registroLote.lote.id});
  
          if(isFirst){
            this.clsLote = {name: registroLote.lote.nombre, code: registroLote.lote.id};
            if(registroLote.lote.activoVencimiento == 1){
              const fechaVenc = moment(registroLote.lote.fechaVencimiento, 'YYYY-MM-DD');
              this.fechaVencimiento = fechaVenc.format('DD/MM/YYYY');
            } else {
              this.fechaVencimiento = "NO APLICA";
            }

            this.cantUnitLote = registroLote.lote.cantidad;
            this.cantLote = this.floor10(registroLote.lote.cantidad / registro.detalleUnidadProducto.unidad.cantidad, -2);
            
            isFirst = false;
          }
        });

        this.displayAddProductsLotes = true;
        this.setFocusCantProductos();
        this.calcularPreciosZ();

        let precioUnit = this.selectedProductVenta.detalleUnidadProducto.precio;
        this.precioUnitario = precioUnit.toFixed(2);

      }

      else{

        this.stocksProductoBack = data.respuesta;

        data.respuesta.forEach(registroStock => {

          this.cantUnitStock = registroStock.stock.cantidad;
          this.cantStock = this.floor10(registroStock.stock.cantidad / registro.detalleUnidadProducto.unidad.cantidad, -2);

        });

        this.displayAddProductsNoLotes = true;
        this.setFocusCantProductosStocks();
        this.calcularPreciosStocksZ();

        let precioUnit = this.selectedProductVenta.detalleUnidadProducto.precio;
        this.precioUnitario = precioUnit.toFixed(2);

      }
    });
  }

  cambioLotes(): void{

    this.lotesProductoBack.forEach((registroLote, index) => {

      if(registroLote.lote.id == this.clsLote.code){

        this.indexLote = index;

        if(registroLote.lote.activoVencimiento == 1){
          const fechaVenc = moment(registroLote.lote.fechaVencimiento, 'YYYY-MM-DD');
          this.fechaVencimiento = fechaVenc.format('DD/MM/YYYY');
        } else {
          this.fechaVencimiento = "NO APLICA";
        }

        this.cantUnitLote = registroLote.lote.cantidad;
        this.cantLote = this.floor10(registroLote.lote.cantidad / this.selectedProductVenta.detalleUnidadProducto.unidad.cantidad, -2);

        this.setFocusCantProductos();
        
        return;
      }
    });

  }

  changeTipoDescuento(): void {
    this.cantidadDescuento = 0;
    this.cantidadDescuentoStock = 0;
    this.calcularPreciosZ();
    this.calcularPreciosStocksZ();
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


  calcularPreciosZ(): void {
    //console.log("entra calculos");

    this.precioTotal = null;

    if( this.cantidadProductoLotes == null || this.cantidadProductoLotes < 0){
      this.messageService.add({severity:'error', summary:'Aviso', detail: 'Ingrese un valor numérico de cantidad válido'});
      this.setFocusCantProductos();
      return;
    }   
    
    let precioTotal = this.selectedProductVenta.detalleUnidadProducto.precio * this.cantidadProductoLotes;

    if(this.clsTiposDescuento.code == '1'){
      if(this.cantidadDescuento == null || this.cantidadDescuento < 0 || this.cantidadDescuento > 100){
          this.messageService.add({severity:'error', summary:'Aviso', detail: 'Ingrese un valor numérico de descuento porcentual: entre 0 a 100'});
          this.setFocusCantidadDescuento();
          return;
      }

      precioTotal = precioTotal - (precioTotal * this.cantidadDescuento / 100);

    }

    if(this.clsTiposDescuento.code == '2'){
      if(this.cantidadDescuento == null || this.cantidadDescuento < 0 || this.cantidadDescuento > precioTotal){
          this.messageService.add({severity:'error', summary:'Aviso', detail: 'Ingrese un valor numérico de descuento fijo válido: entre 0 a ' + precioTotal.toFixed(2)});
          this.setFocusCantidadDescuento();
          return;
      }

      precioTotal = precioTotal - this.cantidadDescuento;

    }
      
      this.precioTotal = precioTotal.toFixed(2); 
  }


  calcularPrecios(event: Event): void {
    //console.log("entra calculos");

    this.precioTotal = null;

    if( this.cantidadProductoLotes == null || this.cantidadProductoLotes < 0){
      this.messageService.add({severity:'error', summary:'Aviso', detail: 'Ingrese un valor numérico de cantidad válido'});
      this.setFocusCantProductos();
      return;
    }   
    
    let precioTotal = this.selectedProductVenta.detalleUnidadProducto.precio * this.cantidadProductoLotes;

    if(this.clsTiposDescuento.code == '1'){
      if(this.cantidadDescuento == null || this.cantidadDescuento < 0 || this.cantidadDescuento > 100){
          this.messageService.add({severity:'error', summary:'Aviso', detail: 'Ingrese un valor numérico de descuento porcentual: entre 0 a 100'});
          this.setFocusCantidadDescuento();
          return;
      }

      precioTotal = precioTotal - (precioTotal * this.cantidadDescuento / 100);

    }

    if(this.clsTiposDescuento.code == '2'){
      if(this.cantidadDescuento == null || this.cantidadDescuento < 0 || this.cantidadDescuento > precioTotal){
          this.messageService.add({severity:'error', summary:'Aviso', detail: 'Ingrese un valor numérico de descuento fijo válido: entre 0 a ' + precioTotal.toFixed(2)});
          this.setFocusCantidadDescuento();
          return;
      }

      precioTotal = precioTotal - this.cantidadDescuento;

    }
      
      this.precioTotal = precioTotal.toFixed(2); 
  }

  calcularPreciosStocksZ(): void{
    this.precioTotal = null;

    if( this.cantidadProductoStocks == null || this.cantidadProductoStocks < 0){
      this.messageService.add({severity:'error', summary:'Aviso', detail: 'Ingrese un valor numérico de cantidad válido'});
      this.setFocusCantProductosStocks();
      return;
    }   
    
    let precioTotal = this.selectedProductVenta.detalleUnidadProducto.precio * this.cantidadProductoStocks;

    if(this.clsTiposDescuento.code == '1'){
      if(this.cantidadDescuentoStock == null || this.cantidadDescuentoStock < 0 || this.cantidadDescuentoStock > 100){
          this.messageService.add({severity:'error', summary:'Aviso', detail: 'Ingrese un valor numérico de descuento porcentual: entre 0 a 100'});
          this.setFocusCantidadDescuentoStocks();
          return;
      }

      precioTotal = precioTotal - (precioTotal * this.cantidadDescuentoStock / 100);

    }

    if(this.clsTiposDescuento.code == '2'){
      if(this.cantidadDescuentoStock == null || this.cantidadDescuentoStock < 0 || this.cantidadDescuentoStock > precioTotal){
          this.messageService.add({severity:'error', summary:'Aviso', detail: 'Ingrese un valor numérico de descuento fijo válido: entre 0 a ' + precioTotal.toFixed(2)});
          this.setFocusCantidadDescuentoStocks();
          return;
      }

      precioTotal = precioTotal - this.cantidadDescuentoStock;

    }
      
      this.precioTotal = precioTotal.toFixed(2); 
  }

  calcularPreciosStocks(event: Event): void{
    this.precioTotal = null;

    if( this.cantidadProductoStocks == null || this.cantidadProductoStocks < 0){
      this.messageService.add({severity:'error', summary:'Aviso', detail: 'Ingrese un valor numérico de cantidad válido'});
      this.setFocusCantProductosStocks();
      return;
    }   
    
    let precioTotal = this.selectedProductVenta.detalleUnidadProducto.precio * this.cantidadProductoStocks;

    if(this.clsTiposDescuento.code == '1'){
      if(this.cantidadDescuentoStock == null || this.cantidadDescuentoStock < 0 || this.cantidadDescuentoStock > 100){
          this.messageService.add({severity:'error', summary:'Aviso', detail: 'Ingrese un valor numérico de descuento porcentual: entre 0 a 100'});
          this.setFocusCantidadDescuentoStocks();
          return;
      }

      precioTotal = precioTotal - (precioTotal * this.cantidadDescuentoStock / 100);

    }

    if(this.clsTiposDescuento.code == '2'){
      if(this.cantidadDescuentoStock == null || this.cantidadDescuentoStock < 0 || this.cantidadDescuentoStock > precioTotal){
          this.messageService.add({severity:'error', summary:'Aviso', detail: 'Ingrese un valor numérico de descuento fijo válido: entre 0 a ' + precioTotal.toFixed(2)});
          this.setFocusCantidadDescuentoStocks();
          return;
      }

      precioTotal = precioTotal - this.cantidadDescuentoStock;

    }
      
      this.precioTotal = precioTotal.toFixed(2); 
  }

  changeTipoDescuentoStock(): void {
    this.cantidadDescuentoStock = 0;
    this.calcularPreciosStocksZ();
  }


  agregarProductoPorCodigo(): void{

    let productoAddVenta = new ProductoAddVenta();

    productoAddVenta.idVenta = this.venta.id;
    productoAddVenta.codigoUnidad = this.codigoProducto;


    this.ventaService.agregarProductoAVentaPorCodigo(productoAddVenta).subscribe({
      next: (data) => {
        if(data != null && data.id != null){
          //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Cliente se ha registrado satisfactoriamente'});
          this.venta.id = data.id;
          this.venta.fecha = data.fecha;
          this.venta.subtotalInafecto = data.subtotalInafecto;
          this.venta.subtotalAfecto = data.subtotalAfecto;
          this.venta.subtotalExonerado = data.subtotalExonerado;
          this.venta.totalMonto = data.totalMonto;
          this.venta.totalAfectoIsc = data.totalAfectoIsc;
          this.venta.igv = data.igv;
          this.venta.isc = data.isc;
          this.venta.estado = data.estado;
          this.venta.pagado = data.pagado;
          this.venta.hora = data.hora;
          this.venta.tipo = data.tipo;
          this.venta.numeroVenta = data.numeroVenta;

          this.venta.cliente = data.cliente;
          this.venta.comprobante = data.comprobante;
          this.detalleVentas = data.detalleVentas;
          this.venta.detalleVentas = this.detalleVentas;


          let opGrabada = this.venta.subtotalAfecto - this.venta.igv
          this.OpGravada = opGrabada.toFixed(2);
          this.OpExonerada = this.venta.subtotalExonerado.toFixed(2);
          this.OpInafecta = this.venta.subtotalInafecto.toFixed(2);
          this.TotalISC = this.venta.isc.toFixed(2);
          this.TotalIGV = this.venta.igv.toFixed(2);
          this.ImporteTotal = this.venta.totalMonto.toFixed(2);

          this.venta.montoIcbper = data.montoIcbper;
          this.venta.cantidadIcbper = data.cantidadIcbper;
          this.TotalICBPER = (this.venta.montoIcbper * this.venta.cantidadIcbper).toFixed(2);

          this.codigoProducto = "";
          this.setFocusCodigoProducto();

        }
      },
      error: (err) => {
        console.log(err);
      }        
   });
  }

  agregarProducto(): void{

    this.calcularPreciosZ();

    this.detalleVentaGestion = new DetalleVenta();

    //this.detalleVentaGestion.venta = this.venta;

    this.detalleVentaGestion.ventaIdReference = this.venta.id;
    this.detalleVentaGestion.producto = this.selectedProductVenta.producto;
    this.detalleVentaGestion.precioVenta = this.selectedProductVenta.detalleUnidadProducto.precio;
    this.detalleVentaGestion.precioCompra = this.selectedProductVenta.detalleUnidadProducto.costoCompra;
    this.detalleVentaGestion.cantidad = this.cantidadProductoLotes;
    this.detalleVentaGestion.almacenId = this.venta.almacen.id;
    this.detalleVentaGestion.esGrabado = this.selectedProductVenta.producto.afectoIgv;
    this.detalleVentaGestion.esIsc = this.selectedProductVenta.producto.afectoIsc;
    this.detalleVentaGestion.descuento = this.cantidadDescuento;
    this.detalleVentaGestion.tipDescuento = this.clsTiposDescuento.code;
    this.detalleVentaGestion.cantidadReal = this.selectedProductVenta.detalleUnidadProducto.unidad.cantidad;
    this.detalleVentaGestion.unidad = this.selectedProductVenta.detalleUnidadProducto.unidad.nombre;
    this.detalleVentaGestion.precioTotal = +this.precioTotal;
    this.detalleVentaGestion.lote = this.lotesProductoBack[this.indexLote].lote;
    this.detalleVentaGestion.activo = 1;
    this.detalleVentaGestion.borrado = 0;

    console.log(this.detalleVentaGestion);

    this.ventaService.agregarProductoAVenta(this.detalleVentaGestion).subscribe({
      next: (data) => {
        if(data != null && data.id != null){
          //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Cliente se ha registrado satisfactoriamente'});
          this.venta.id = data.id;
          this.venta.fecha = data.fecha;
          this.venta.subtotalInafecto = data.subtotalInafecto;
          this.venta.subtotalAfecto = data.subtotalAfecto;
          this.venta.subtotalExonerado = data.subtotalExonerado;
          this.venta.totalMonto = data.totalMonto;
          this.venta.totalAfectoIsc = data.totalAfectoIsc;
          this.venta.igv = data.igv;
          this.venta.isc = data.isc;
          this.venta.estado = data.estado;
          this.venta.pagado = data.pagado;
          this.venta.hora = data.hora;
          this.venta.tipo = data.tipo;
          this.venta.numeroVenta = data.numeroVenta;

          this.venta.cliente = data.cliente;
          this.venta.comprobante = data.comprobante;
          this.detalleVentas = data.detalleVentas;
          this.venta.detalleVentas = this.detalleVentas;


          let opGrabada = this.venta.subtotalAfecto - this.venta.igv
          this.OpGravada = opGrabada.toFixed(2);
          this.OpExonerada = this.venta.subtotalExonerado.toFixed(2);
          this.OpInafecta = this.venta.subtotalInafecto.toFixed(2);
          this.TotalISC = this.venta.isc.toFixed(2);
          this.TotalIGV = this.venta.igv.toFixed(2);
          this.ImporteTotal = this.venta.totalMonto.toFixed(2);

          this.venta.montoIcbper = data.montoIcbper;
          this.venta.cantidadIcbper = data.cantidadIcbper;
          this.TotalICBPER = (this.venta.montoIcbper * this.venta.cantidadIcbper).toFixed(2);

          this.displayProductsToVentas = false;
          this.displayAddProductsNoLotes = false;
          this.displayAddProductsLotes = false;

          console.log(this.detalleVentas);

        }
      },
      error: (err) => {
        console.log(err);
      }        
   });


  }

  agregarProductoStock(): void{

    this.calcularPreciosStocksZ();

    this.detalleVentaGestion = new DetalleVenta();

    //this.detalleVentaGestion.venta = this.venta;

    this.detalleVentaGestion.ventaIdReference = this.venta.id;
    this.detalleVentaGestion.producto = this.selectedProductVenta.producto;
    this.detalleVentaGestion.precioVenta = this.selectedProductVenta.detalleUnidadProducto.precio;
    this.detalleVentaGestion.precioCompra = this.selectedProductVenta.detalleUnidadProducto.costoCompra;
    this.detalleVentaGestion.cantidad = this.cantidadProductoStocks;
    this.detalleVentaGestion.almacenId = this.venta.almacen.id;
    this.detalleVentaGestion.esGrabado = this.selectedProductVenta.producto.afectoIgv;
    this.detalleVentaGestion.esIsc = this.selectedProductVenta.producto.afectoIsc;
    this.detalleVentaGestion.descuento = this.cantidadDescuentoStock;
    this.detalleVentaGestion.tipDescuento = this.clsTiposDescuento.code;
    this.detalleVentaGestion.cantidadReal = this.selectedProductVenta.detalleUnidadProducto.unidad.cantidad;
    this.detalleVentaGestion.unidad = this.selectedProductVenta.detalleUnidadProducto.unidad.nombre;
    this.detalleVentaGestion.precioTotal = +this.precioTotal;
    this.detalleVentaGestion.lote = null;
    this.detalleVentaGestion.activo = 1;
    this.detalleVentaGestion.borrado = 0;

    console.log(this.detalleVentaGestion);

    this.ventaService.agregarProductoAVenta(this.detalleVentaGestion).subscribe({
      next: (data) => {
        if(data != null && data.id != null){
          //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Cliente se ha registrado satisfactoriamente'});
          this.venta.id = data.id;
          this.venta.fecha = data.fecha;
          this.venta.subtotalInafecto = data.subtotalInafecto;
          this.venta.subtotalAfecto = data.subtotalAfecto;
          this.venta.subtotalExonerado = data.subtotalExonerado;
          this.venta.totalMonto = data.totalMonto;
          this.venta.totalAfectoIsc = data.totalAfectoIsc;
          this.venta.igv = data.igv;
          this.venta.isc = data.isc;
          this.venta.estado = data.estado;
          this.venta.pagado = data.pagado;
          this.venta.hora = data.hora;
          this.venta.tipo = data.tipo;
          this.venta.numeroVenta = data.numeroVenta;

          this.venta.cliente = data.cliente;
          this.venta.comprobante = data.comprobante;
          this.detalleVentas = data.detalleVentas;
          this.venta.detalleVentas = this.detalleVentas;


          let opGrabada = this.venta.subtotalAfecto - this.venta.igv
          this.OpGravada = opGrabada.toFixed(2);
          this.OpExonerada = this.venta.subtotalExonerado.toFixed(2);
          this.OpInafecta = this.venta.subtotalInafecto.toFixed(2);
          this.TotalISC = this.venta.isc.toFixed(2);
          this.TotalIGV = this.venta.igv.toFixed(2);
          this.ImporteTotal = this.venta.totalMonto.toFixed(2);

          this.venta.montoIcbper = data.montoIcbper;
          this.venta.cantidadIcbper = data.cantidadIcbper;
          this.TotalICBPER = (this.venta.montoIcbper * this.venta.cantidadIcbper).toFixed(2);

          this.displayProductsToVentas = false;
          this.displayAddProductsNoLotes = false;
          this.displayAddProductsLotes = false;

          console.log(this.detalleVentas);

        }
      },
      error: (err) => {
        console.log(err);
      }        
   });
  }

  eliminarDV(detalleVenta:DetalleVenta, event: Event){
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Confirma que desea eliminar el producto seleccionado?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Eliminación',
      accept: () => {
       this.eliminarConfirmadoDV(detalleVenta);
      },
      reject: () => {
      }
    });
  }

  eliminarConfirmadoDV(detalleVenta:DetalleVenta){

   detalleVenta.ventaIdReference = this.venta.id;

    console.log(detalleVenta);

    this.ventaService.deleteProductoAVenta(detalleVenta).subscribe({
      next: (data) => {
        if(data != null && data.id != null){
          //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Cliente se ha registrado satisfactoriamente'});
          this.venta.id = data.id;
          this.venta.fecha = data.fecha;
          this.venta.subtotalInafecto = data.subtotalInafecto;
          this.venta.subtotalAfecto = data.subtotalAfecto;
          this.venta.subtotalExonerado = data.subtotalExonerado;
          this.venta.totalMonto = data.totalMonto;
          this.venta.totalAfectoIsc = data.totalAfectoIsc;
          this.venta.igv = data.igv;
          this.venta.isc = data.isc;
          this.venta.estado = data.estado;
          this.venta.pagado = data.pagado;
          this.venta.hora = data.hora;
          this.venta.tipo = data.tipo;
          this.venta.numeroVenta = data.numeroVenta;

          this.venta.cliente = data.cliente;
          this.venta.comprobante = data.comprobante;
          this.detalleVentas = data.detalleVentas;
          this.venta.detalleVentas = this.detalleVentas;


          let opGrabada = this.venta.subtotalAfecto - this.venta.igv
          this.OpGravada = opGrabada.toFixed(2);
          this.OpExonerada = this.venta.subtotalExonerado.toFixed(2);
          this.OpInafecta = this.venta.subtotalInafecto.toFixed(2);
          this.TotalISC = this.venta.isc.toFixed(2);
          this.TotalIGV = this.venta.igv.toFixed(2);
          this.ImporteTotal = this.venta.totalMonto.toFixed(2);

          this.venta.montoIcbper = data.montoIcbper;
          this.venta.cantidadIcbper = data.cantidadIcbper;
          this.TotalICBPER = (this.venta.montoIcbper * this.venta.cantidadIcbper).toFixed(2);

          this.displayProductsToVentas = false;
          this.displayAddProductsNoLotes = false;
          this.displayAddProductsLotes = false;

          console.log(this.detalleVentas);

        }
      },
      error: (err) => {
        console.log(err);
      }        
   });
  }

  editarDV(detalleVenta:DetalleVenta, event: Event){

    console.log(detalleVenta);
    this.detalleVentaGestion = new DetalleVenta();
    this.detalleVentaGestion = detalleVenta;
    this.selectedProductVenta = new ProductoVentas();
    let almacen = new Almacen();
    almacen.id = detalleVenta.almacenId;

    let detalleUnidadProducto = new DetalleUnidadProducto();
    let unidad = new Unidad();

    detalleUnidadProducto.unidad = unidad;
    detalleUnidadProducto.unidad.nombre = detalleVenta.unidad;
    detalleUnidadProducto.unidad.cantidad = detalleVenta.cantidadReal;
    detalleUnidadProducto.precio = detalleVenta.precioVenta;
    
    this.selectedProductVenta.producto = detalleVenta.producto;
    this.selectedProductVenta.almacen = almacen;
    this.selectedProductVenta.detalleUnidadProducto = detalleUnidadProducto;
    this.activeProductLote = detalleVenta.producto.activoLotes == 1;
    this.lotesProducto = [];
    this.clsLote = null;

    this.cantidadProductoLotes = detalleVenta.cantidad;
    this.cantidadProductoStocks = detalleVenta.cantidad;
    
    this.cantidadDescuento = detalleVenta.descuento;
    this.cantidadDescuentoStock = detalleVenta.descuento;

    if(detalleVenta.tipDescuento == 1){
      this.clsTiposDescuento = {name: "% (0 a 100)", code: '1'};
    }

    if(detalleVenta.tipDescuento == 2){
      this.clsTiposDescuento = {name: 'Valor Fijo', code: '2'};
    }

    let loteIdAdd = 0;
    if(this.activeProductLote){
      loteIdAdd = detalleVenta.lote.id;
    }

    this.stockService.listarStocksVentasEdit(this.venta.almacen.id, detalleVenta.producto.id, loteIdAdd).subscribe(data => {
      console.log(data);

      if(this.activeProductLote){

        this.lotesProductoBack = data.respuesta;

        data.respuesta.forEach(registroLote => {
          this.lotesProducto.push({name: registroLote.lote.nombre, code: registroLote.lote.id});
  
          if(detalleVenta.lote.id == registroLote.lote.id){
            this.clsLote = {name: registroLote.lote.nombre, code: registroLote.lote.id};
            if(registroLote.lote.activoVencimiento == 1){
              const fechaVenc = moment(registroLote.lote.fechaVencimiento, 'YYYY-MM-DD');
              this.fechaVencimiento = fechaVenc.format('DD/MM/YYYY');
            } else {
              this.fechaVencimiento = "NO APLICA";
            }

            registroLote.lote.cantidad = registroLote.lote.cantidad + (detalleVenta.cantidad * detalleVenta.cantidadReal);

            this.cantUnitLote = registroLote.lote.cantidad;
            this.cantLote = this.floor10(registroLote.lote.cantidad / detalleVenta.cantidadReal, -2);
            
          }
        });

        this.displayEditProductsLotes = true;
        this.setFocusCantProductos();
        this.calcularPreciosZ();

        let precioUnit = this.selectedProductVenta.detalleUnidadProducto.precio;
        this.precioUnitario = precioUnit.toFixed(2);

      }

      else{

        this.stocksProductoBack = data.respuesta;

        data.respuesta.forEach(registroStock => {

          this.cantUnitStock = registroStock.stock.cantidad + (detalleVenta.cantidad * detalleVenta.cantidadReal);
          this.cantStock = this.floor10(registroStock.stock.cantidad / detalleVenta.cantidadReal, -2);

        });

        this.displayEditProductsNoLotes = true;
        this.setFocusCantProductosStocks();
        this.calcularPreciosStocksZ();

        let precioUnit = this.selectedProductVenta.detalleUnidadProducto.precio;
        this.precioUnitario = precioUnit.toFixed(2);

      }
    });
  }

  modificarProducto(): void{

    this.calcularPreciosZ();

    

    //this.detalleVentaGestion.venta = this.venta;

    this.detalleVentaGestion.ventaIdReference = this.venta.id;
    this.detalleVentaGestion.cantidad = this.cantidadProductoLotes;
    this.detalleVentaGestion.almacenId = this.venta.almacen.id;
    this.detalleVentaGestion.descuento = this.cantidadDescuento;
    this.detalleVentaGestion.tipDescuento = this.clsTiposDescuento.code;
    this.detalleVentaGestion.precioTotal = +this.precioTotal;
    this.detalleVentaGestion.lote = this.lotesProductoBack[this.indexLote].lote;
    this.detalleVentaGestion.activo = 1;
    this.detalleVentaGestion.borrado = 0;

    console.log(this.detalleVentaGestion);

    this.ventaService.modificarProductoAVenta(this.detalleVentaGestion).subscribe({
      next: (data) => {
        if(data != null && data.id != null){
          //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Cliente se ha registrado satisfactoriamente'});
          this.venta.id = data.id;
          this.venta.fecha = data.fecha;
          this.venta.subtotalInafecto = data.subtotalInafecto;
          this.venta.subtotalAfecto = data.subtotalAfecto;
          this.venta.subtotalExonerado = data.subtotalExonerado;
          this.venta.totalMonto = data.totalMonto;
          this.venta.totalAfectoIsc = data.totalAfectoIsc;
          this.venta.igv = data.igv;
          this.venta.isc = data.isc;
          this.venta.estado = data.estado;
          this.venta.pagado = data.pagado;
          this.venta.hora = data.hora;
          this.venta.tipo = data.tipo;
          this.venta.numeroVenta = data.numeroVenta;

          this.venta.cliente = data.cliente;
          this.venta.comprobante = data.comprobante;
          this.detalleVentas = data.detalleVentas;
          this.venta.detalleVentas = this.detalleVentas;


          let opGrabada = this.venta.subtotalAfecto - this.venta.igv
          this.OpGravada = opGrabada.toFixed(2);
          this.OpExonerada = this.venta.subtotalExonerado.toFixed(2);
          this.OpInafecta = this.venta.subtotalInafecto.toFixed(2);
          this.TotalISC = this.venta.isc.toFixed(2);
          this.TotalIGV = this.venta.igv.toFixed(2);
          this.ImporteTotal = this.venta.totalMonto.toFixed(2);

          this.venta.montoIcbper = data.montoIcbper;
          this.venta.cantidadIcbper = data.cantidadIcbper;
          this.TotalICBPER = (this.venta.montoIcbper * this.venta.cantidadIcbper).toFixed(2);

          //this.displayProductsToVentas = false;
          this.displayEditProductsLotes = false;
          //this.displayAddProductsLotes = false;

          console.log(this.detalleVentas);

        }
      },
      error: (err) => {
        console.log(err);
      }        
   });
  }

  modificarProductoStock(): void{
    this.calcularPreciosStocksZ();

    //this.detalleVentaGestion = new DetalleVenta();

    //this.detalleVentaGestion.venta = this.venta;

    this.detalleVentaGestion.ventaIdReference = this.venta.id;
    this.detalleVentaGestion.cantidad = this.cantidadProductoStocks;
    this.detalleVentaGestion.almacenId = this.venta.almacen.id;
    this.detalleVentaGestion.descuento = this.cantidadDescuentoStock;
    this.detalleVentaGestion.tipDescuento = this.clsTiposDescuento.code;
    this.detalleVentaGestion.precioTotal = +this.precioTotal;
    this.detalleVentaGestion.lote = null;

    console.log(this.detalleVentaGestion);

    this.ventaService.modificarProductoAVenta(this.detalleVentaGestion).subscribe({
      next: (data) => {
        if(data != null && data.id != null){
          //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Cliente se ha registrado satisfactoriamente'});
          this.venta.id = data.id;
          this.venta.fecha = data.fecha;
          this.venta.subtotalInafecto = data.subtotalInafecto;
          this.venta.subtotalAfecto = data.subtotalAfecto;
          this.venta.subtotalExonerado = data.subtotalExonerado;
          this.venta.totalMonto = data.totalMonto;
          this.venta.totalAfectoIsc = data.totalAfectoIsc;
          this.venta.igv = data.igv;
          this.venta.isc = data.isc;
          this.venta.estado = data.estado;
          this.venta.pagado = data.pagado;
          this.venta.hora = data.hora;
          this.venta.tipo = data.tipo;
          this.venta.numeroVenta = data.numeroVenta;

          this.venta.cliente = data.cliente;
          this.venta.comprobante = data.comprobante;
          this.detalleVentas = data.detalleVentas;
          this.venta.detalleVentas = this.detalleVentas;


          let opGrabada = this.venta.subtotalAfecto - this.venta.igv
          this.OpGravada = opGrabada.toFixed(2);
          this.OpExonerada = this.venta.subtotalExonerado.toFixed(2);
          this.OpInafecta = this.venta.subtotalInafecto.toFixed(2);
          this.TotalISC = this.venta.isc.toFixed(2);
          this.TotalIGV = this.venta.igv.toFixed(2);
          this.ImporteTotal = this.venta.totalMonto.toFixed(2);

          this.venta.montoIcbper = data.montoIcbper;
          this.venta.cantidadIcbper = data.cantidadIcbper;
          this.TotalICBPER = (this.venta.montoIcbper * this.venta.cantidadIcbper).toFixed(2);

          //this.displayProductsToVentas = false;
          this.displayEditProductsNoLotes = false;

          console.log(this.detalleVentas);

        }
      },
      error: (err) => {
        console.log(err);
      }        
   });
  }

  round10(value, exp): number{
    return this.decimalAdjust("round", value, exp);
  }

  floor10 (value, exp): number{
    return this.decimalAdjust("floor", value, exp);
  }

  ceil10 (value, exp): number{
    return this.decimalAdjust("ceil", value, exp);
  }


  setFocusCantProductos() {    
    this.changeDetectorRef.detectChanges();
    //this.inputcantidadProductoLotes.nativeElement.focus();
    this.inputcantidadProductoLotes.nativeElement.select();
  }

  
  setFocusCantidadDescuento() {    
    this.changeDetectorRef.detectChanges();
    //this.inputcantidadProductoLotes.nativeElement.focus();
    this.inputcantidadDescuento.nativeElement.select();
  }

  setFocusCantProductosStocks() {    
    this.changeDetectorRef.detectChanges();
    //this.inputcantidadProductoLotes.nativeElement.focus();
    this.inputcantidadProductoStocks.nativeElement.select();
  }

  
  setFocusCantidadDescuentoStocks() {    
    this.changeDetectorRef.detectChanges();
    //this.inputcantidadProductoLotes.nativeElement.focus();
    this.inputcantidadDescuentoStock.nativeElement.select();
  }



  /* buscarProducto(): void{
    
  } */

  limpiarDatos(): void{
    this.activeProductLote = false;
    this.displayEditProductsLotes = false;
    this.displayEditProductsNoLotes = false;
  
    this.venta = new Venta();
  
    
    this.codigoProducto = '';
    this.txtBuscarDocCliente = '';
    this.nombreDocIdentidad = '';
    this.cantIcbper = 0;
  
    this.detalleVentas = [];
  
    this.OpGravada = '';
    this.OpExonerada = '';
    this.OpInafecta = '';
    this.TotalISC = '';
    this.TotalIGV = '';
    this.TotalICBPER = '';
    this.ImporteTotal = '';
  
  
    this.txtBuscarCliente = '';
    this.clientes = [];
  
    this.pageClientes = 0;
    this.firstClientes = 0;
    this.lastClientes = 0;
    this.rowsClientes = 10;
    this.isFirstClientes = true;
    this.isLastClientes = false;
    this.totalRecordsClientes = 0;
    this.numberElementsClientes = 0;
    this.loadingClientes = true; 
  
    this.selectedClient = null;
  
    //Reg Cliente
  
    this.nombreCliente = '';
    this.tipo_documento_idCliente = null;
    this.documentoCliente = '';
    this.direccionCliente = '';
    this.telefonoCliente = '';
    this.correo1Cliente = '';
    this.correo2Cliente = '';
  
    this.newCliente = new Cliente();
  
    //Estructuras de Productos
  
    this.productosVentas = [];
    this.filtroProductosVenta = new FiltroProductosVenta();
  
    this.pageProductosToVentas = 0;
    this.firstProductosToVentas = 0;
    this.lastProductosToVentas = 0;
    this.rowsProductosToVentas = 10;
    this.isFirstProductosToVentas = true;
    this.isLastProductosToVentas = false;
    this.totalRecordsProductosToVentas = 0;
    this.numberElementsProductosToVentas = 0;
    this.loadingProductosToVentas = true; 
  
    this.txtBuscarProducto = '';
  
    this.selectedProductVenta = null;
    
    this.lotesProducto = [];
    this.clsLote = null;
    this.fechaVencimiento = '';
    this.cantLote = null;
    this.cantUnitLote = null;
  
  
    this.lotesProductoBack= [];
    this.indexLote = 0;
  
    this.cantidadProductoLotes = 1;
  
    this.cantidadDescuento = 0;
    this.precioUnitario = null;
    this.precioTotal = null;
    
    this.cantStock = null;
    this.cantUnitStock = null;
  
    this.stocksProductoBack = [];
    
    this.cantidadProductoStocks = 1;
    this.cantidadDescuentoStock = 0;
  
  
    //Detalle Ventas
  
    this.detalleVentaGestion = new DetalleVenta();
  }

  cobrarVenta(): void{
    
  }
  nuevaVenta(): void{
    //nueva venta
    this.limpiarDatos();
    this.seleccionarLocal();
    
  }

  cancelarVenta(event: Event): void{

    this.ventaService.resetVenta(this.venta).subscribe({
      next: (data) => {
        if(data != null && data.id != null){
          //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Cliente se ha registrado satisfactoriamente'});
          this.venta.id = data.id;
          this.venta.fecha = data.fecha;
          this.venta.subtotalInafecto = data.subtotalInafecto;
          this.venta.subtotalAfecto = data.subtotalAfecto;
          this.venta.subtotalExonerado = data.subtotalExonerado;
          this.venta.totalMonto = data.totalMonto;
          this.venta.totalAfectoIsc = data.totalAfectoIsc;
          this.venta.igv = data.igv;
          this.venta.isc = data.isc;
          this.venta.estado = data.estado;
          this.venta.pagado = data.pagado;
          this.venta.hora = data.hora;
          this.venta.tipo = data.tipo;
          this.venta.numeroVenta = data.numeroVenta;

          this.venta.cliente = new Cliente();
          this.venta.comprobante = data.comprobante;
          this.detalleVentas = data.detalleVentas;
          this.venta.detalleVentas = this.detalleVentas;


          let opGrabada = this.venta.subtotalAfecto - this.venta.igv
          this.OpGravada = opGrabada.toFixed(2);
          this.OpExonerada = this.venta.subtotalExonerado.toFixed(2);
          this.OpInafecta = this.venta.subtotalInafecto.toFixed(2);
          this.TotalISC = this.venta.isc.toFixed(2);
          this.TotalIGV = this.venta.igv.toFixed(2);
          this.ImporteTotal = this.venta.totalMonto.toFixed(2);

          this.venta.montoIcbper = data.montoIcbper;
          this.venta.cantidadIcbper = data.cantidadIcbper;
          this.TotalICBPER = (this.venta.montoIcbper * this.venta.cantidadIcbper).toFixed(2);

          this.codigoProducto = "";
          this.setFocusCodigoProducto();

        }
      },
      error: (err) => {
        console.log(err);
      }        
   });
  
  }

  cerrarVenta(event: Event): void{

      this.limpiarDatos();
      this.verFrmAlmacen = true;
      this.verFrmVenta = false;
      this.vistaCarga = false;
    
  }



  //Utilitarios
  soloNumeros(e : any): boolean {
    let key=e.charCode; 
        if((key >= 48 && key <= 57) || (key==8) || (key==35) || (key==34) || (key==46)){
            return true;
        }
        else{
            e.preventDefault();
        }
  }

  soloNumerosNaturales(event: any) {
    const tecla = event.key;
    const soloNumeros = /^[0-9]+$/;

    if (!soloNumeros.test(tecla) && tecla !== "Backspace" && tecla !== "Delete" && tecla !== "ArrowLeft" && tecla !== "ArrowRight") {
        event.preventDefault();
    }
}

permitirNumerosConDecimales(event: KeyboardEvent, input: number): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  const valor = String(input);

  // Verificar si ya hay un punto decimal en el valor
  const tieneDecimal = valor.includes('.');

  if (charCode === 46 && !tieneDecimal) {
      // Permitir el punto decimal si no hay uno ya
      return true;
  } else if (charCode >= 48 && charCode <= 57) {
      // Permitir números del 0 al 9
      return true;
  } else if (charCode === 8 || charCode === 9 || charCode === 37 || charCode === 39 || charCode === 46) {
      // Permitir teclas de control como backspace, tab, flechas y delete
      return true;
  }

  event.preventDefault();
  return false;
}

}
