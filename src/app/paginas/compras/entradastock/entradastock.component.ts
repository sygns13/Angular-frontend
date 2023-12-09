import { PagoProveedorService } from './../../../_service/pago_proveedor.service';
import { ProductoService } from './../../../_service/producto.service';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { AppBreadcrumbService } from '../../../menu/app.breadcrumb.service';
import { AppComponent } from 'src/app/app.component';

import { switchMap } from 'rxjs/operators';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';

import { GestionloteService } from 'src/app/_service/gestionlote.service';
import { ProveedorService } from './../../../_service/proveedor.service';
import { EntradaStockService } from './../../../_service/entrada_stock.service';
import { UnidadService } from '../../../_service/unidad.service';
import { StockService } from '../../../_service/stock.service';
import { TipoComprobanteService } from '../../../_service/tipo_comprobante.service';
import { MetodoPagoService } from '../../../_service/metodo_pago.service';
import { BancoService } from '../../../_service/banco.service';
import { TipoTarjetaService } from '../../../_service/tipo_tarjeta.service';
import { EntradaStockServiceData } from './../../../_servicesdata/entrada_stock.service';

import { Proveedor } from './../../../_model/proveedor';
import { TipoDocumento } from './../../../_model/tipo_documento';
import { EntradaStock } from './../../../_model/entrada_stock';
import { Almacen } from 'src/app/_model/almacen';
import { FacturaProveedor } from './../../../_model/factura_proveedor';
import { DetalleEntradaStock } from './../../../_model/detalle_entrada_stock';
import { DetalleUnidadProducto } from 'src/app/_model/detalle_unidad_producto';
import { TipoComprobante } from '../../../_model/tipo_comprobante';
import { MetodoPago } from '../../../_model/metodo_pago';
import { PagoProveedor } from './../../../_model/pago_proveedor';

import { ProductoVentas } from 'src/app/_model/producto_ventas';
import { FiltroProductosVenta } from 'src/app/_util/filtro_productos_venta';
import { Unidad } from '../../../_model/unidad';

import * as moment from 'moment';
import { ProductoAddEntradaStock } from './../../../_model/producto_add_entrada_stock';
import { Lote } from 'src/app/_model/lote';

@Component({
  selector: 'app-entradastock',
  templateUrl: './entradastock.component.html',
  styleUrls: ['./entradastock.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EntradastockComponent implements OnInit {

  @ViewChild('inputBuscar', { static: false }) inputBuscar: ElementRef;
  @ViewChild('inputBuscarDocProveedor', { static: false }) inputBuscarDocProveedor: ElementRef;
  @ViewChild('inputNombreProveedorReg', { static: false }) inputNombreProveedorReg: ElementRef;
  @ViewChild('inputBuscarProductos', { static: false }) inputBuscarProductos: ElementRef;
  @ViewChild('inputcantidadProductoLotes', { static: false }) inputcantidadProductoLotes: ElementRef;
  @ViewChild('inputcantidadProductoStocks', { static: false }) inputcantidadProductoStocks: ElementRef;
  /* @ViewChild('inputcodigoProducto', { static: false }) inputcodigoProducto: ElementRef; */
  @ViewChild('inputNombreLote', { static: false }) inputNombreLote: ElementRef;
  @ViewChild('inputPrecioUnitario', { static: false }) inputPrecioUnitario: ElementRef;

  @ViewChild('inputcantidadProductoStocksEd', { static: false }) inputcantidadProductoStocksEd: ElementRef;

  @ViewChild('inputNombreLoteEd', { static: false }) inputNombreLoteEd: ElementRef;
  @ViewChild('inputPrecioUnitarioEd', { static: false }) inputPrecioUnitarioEd: ElementRef;

  labelTitle: string = 'Registro de Compras';

  vistaCarga : boolean = true;
  verFrmEntradaStock : boolean = false;
  verFrmAlmacen : boolean = false;
  displayProveedor : boolean = false;
  vistaRegistroProveedor : boolean = false;
  displayProductsToEntradaStocks : boolean = false;
  displayAddProductsLotes : boolean = false;
  displayAddProductsNoLotes : boolean = false;
  activeProductLote: boolean = false;
  displayEditProductsLotes : boolean = false;
  displayEditProductsNoLotes : boolean = false;

  almacens: any[] = [];
  clsAlmacen: any = null;

  entradaStock: EntradaStock = new EntradaStock();
  pagoProveedor: PagoProveedor = new PagoProveedor();

  
  codigoProducto: string = '';
  txtBuscarDocProveedor: string = '';
  nombreDocIdentidad: string = '';
  cantIcbper: number = 0;

  detalleEntradaStocks: DetalleEntradaStock[] = [];

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


  txtBuscarProveedor: String = '';
  proveedors: any[] = [];

  pageProveedors: number = 0;
  firstProveedors: number = 0;
  lastProveedors: number = 0;
  rowsProveedors: number = 10;
  isFirstProveedors: boolean = true;
  isLastProveedors: boolean = false;
  totalRecordsProveedors: number = 0;
  numberElementsProveedors: number = 0;
  loadingProveedors: boolean = true; 

  selectedProveedor: Proveedor;

  //Reg Proveedor

  tipoDocumentosProveedor: any[] = [];

  clsTipoDocumentoProveedor: any = null;
  nombreProveedor: string = '';
  tipo_documento_idProveedor: number = null;
  documentoProveedor: string = '';
  direccionProveedor: string = '';
  telefonoProveedor: string = '';
  anexo: string = '';
  celular: string = '';
  responsable: string = '';

  tipoFrmProveedor: String = 'Nuevo Proveedor';
  vistaBotonRegistroProveedor : boolean = false;
  vistaBotonEdicionProveedor : boolean = false;
  vistaCargaProveedor : boolean = true;

  newProveedor = new Proveedor();

  //Estructuras de Productos

  productosEntradaStocks: any[] = [];
  filtroProductosVenta: FiltroProductosVenta = new FiltroProductosVenta();

  pageProductosToEntradaStocks: number = 0;
  firstProductosToEntradaStocks: number = 0;
  lastProductosToEntradaStocks: number = 0;
  rowsProductosToEntradaStocks: number = 10;
  isFirstProductosToEntradaStocks: boolean = true;
  isLastProductosToEntradaStocks: boolean = false;
  totalRecordsProductosToEntradaStocks: number = 0;
  numberElementsProductosToEntradaStocks: number = 0;
  loadingProductosToEntradaStocks: boolean = true; 

  txtBuscarProducto: string = '';

  selectedProductEntradaStock: ProductoVentas;

  unidads: any[] = [];
  clsUnidad: any = null;
  
  lotesProducto: any[] = [];
  //clsLote: any = null;
  nombreLote: string = '';
  fechaVencimiento: string = '';
  cantLote: number = null;
  cantUnitLote: number = null;


  lotesProductoBack: any[] = [];
  indexLote : number = 0;

  cantidadProductoLotes: number = 1;

  cantidadDescuento: number = 0;
  precioUnitario: number = null;
  precioTotal: string = null;
  
  cantStock: number = null;
  cantUnitStock: number = null;

  stocksProductoBack: any[] = [];
  
  cantidadProductoStocks: number = 1;
  cantidadDescuentoStock: number = 0;


  //Detalle EntradaStocks

  detalleEntradaStockGestion: DetalleEntradaStock = new DetalleEntradaStock();

  //Cobrar
  displayConfirmarPago : boolean = false;
  tipoComprobantes: any[] = [];
  clsTipoComprobante: any = null;
  serieFacturaProveedors: any[] = [];
  clsSerieFacturaProveedor: any = null;
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
  //initFacturaProveedors: InitFacturaProveedor[] = [];

  montoEntradaStock: string = null;
  montoAbonado: number = null;
  montoVuelto: string = null;
  
  //Edición de EntradaStocks
  idEntradaStockEdit: number = null;


  constructor(public app: AppComponent, private gestionloteService: GestionloteService, private messageService: MessageService, private proveedorService: ProveedorService,
              private changeDetectorRef: ChangeDetectorRef, private confirmationService: ConfirmationService , private entradaStockService: EntradaStockService,
              private productoService: ProductoService, private unidadService:UnidadService, private stockService: StockService, private breadcrumbService: AppBreadcrumbService,
              private tipoComprobanteService: TipoComprobanteService, private metodoPagoService:MetodoPagoService,
              private tipoTarjetaService: TipoTarjetaService, private bancoService: BancoService,
              private pagoProveedorService: PagoProveedorService, private entradaStockServiceData: EntradaStockServiceData) {
                this.breadcrumbService.setItems([
                  { label: 'Compras' },
                  { label: 'Compras a Proveedores', routerLink: ['/compras/compra'] }
                  ]);
               }

  ngOnInit(): void {

    this.getAlmacens();
    this.getUnidads();
    this.getTipoDocumentos();
    this.vistaCarga = false;
    this.verFrmAlmacen = true;

    //Verificar si hay entradaStock en curso
    this.entradaStockServiceData.getEntradaStockStore().subscribe((data) => {
      if(data != null){
        this.idEntradaStockEdit = data.id;
      }
    });

    //inicializar subclases de entradaStock
    if(this.idEntradaStockEdit == null){

      this.entradaStock = new EntradaStock();
      this.entradaStock.proveedor = new Proveedor();
      this.entradaStock.facturaProveedor = new FacturaProveedor();
      this.entradaStock.almacen = new Almacen();
    } else {
      this.editarEntradaStock();
      this.entradaStockServiceData.setEntradaStockStore(null);
      this.idEntradaStockEdit = null;
    }
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

    this.labelTitle = 'Registro de Compras';

    if(this.clsAlmacen != null){
      this.entradaStock.almacen = new Almacen();
      this.entradaStock.almacen.id = this.clsAlmacen.code;
      this.entradaStock.almacen.nombre = this.clsAlmacen.name;
      this.entradaStock.facturado = 0;
      this.entradaStock.actualizado = 0;
      this.entradaStock.totalMonto = 0;

      this.entradaStock.proveedor = null;
      this.entradaStock.facturaProveedor = null;

      this.txtBuscarDocProveedor = "";
      this.txtBuscarProveedor = "";
      this.displayProveedor = false;
      this.nombreDocIdentidad = "";
      this.displayProductsToEntradaStocks = false;

      this.verFrmEntradaStock = true;
      this.vistaCarga = false;
      this.verFrmAlmacen = false;

      this.entradaStock.proveedor = new Proveedor();
      this.entradaStock.facturaProveedor = new FacturaProveedor();

      //this.setFocusCodigoProducto();
      
    }
    else{
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'No ha seleccionado un Local o Sucursal Válido'});
    }
    
  }

/* iniciarEntradaStockT(): Promise<any>{
    return this.entradaStockService.registrarRetEntradaStock(this.entradaStock).toPromise()
    .then(response => response as EntradaStock)
    .catch();
} */

iniciarEntradaStockT2(): Promise<any>{
  return new Promise((resolve, reject) => {
    if(this.entradaStock.id == null){
      this.entradaStock.proveedor = null;
      this.entradaStock.facturaProveedor = null;
      this.entradaStockService.registrarRetEntradaStock(this.entradaStock).subscribe({
        next: (data) => {
          if(data != null && data.id != null){
            //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Proveedor se ha registrado satisfactoriamente'});
            this.entradaStock.id = data.id;
            this.entradaStock.fecha = data.fecha;
            this.entradaStock.facturado = data.facturado;
            this.entradaStock.actualizado = data.actualizado;
            this.entradaStock.totalMonto = data.totalMonto;

            this.entradaStock.estado = data.estado;
            this.entradaStock.hora = data.hora;
            this.entradaStock.ordenCompraId = data.ordenCompraId;
            this.entradaStock.numero = data.numero;


            //this.entradaStock.proveedor = new Proveedor();
            this.entradaStock.facturaProveedor = new FacturaProveedor();
            this.detalleEntradaStocks = [];
            this.entradaStock.detalleEntradaStock = this.detalleEntradaStocks;

            if(data.proveedor != null){
              this.entradaStock.proveedor = data.proveedor;
            } else {
              this.entradaStock.proveedor = new Proveedor();
            }
            resolve(this.entradaStock);
          }
        },
        error: (err) => {
          console.log(err);
        }        
     });
    }
    else{
      resolve(this.entradaStock);
    }
  });
}

  editarEntradaStock(): void{

    this.entradaStockService.listarPorId(this.idEntradaStockEdit).subscribe(data => {
      if(data != null && data.id != null){

        this.entradaStock = data;

        
        this.labelTitle = "Edición de Compras";
        this.clsAlmacen.code = this.entradaStock.almacen.id;
        this.clsAlmacen.name = this.entradaStock.almacen.nombre;

        
        
        this.entradaStock.id = data.id;
        this.entradaStock.fecha = data.fecha;
        this.entradaStock.facturado = data.facturado;
        this.entradaStock.actualizado = data.actualizado;
        this.entradaStock.totalMonto = data.totalMonto;

        this.entradaStock.estado = data.estado;
        this.entradaStock.hora = data.hora;
        this.entradaStock.ordenCompraId = data.ordenCompraId;
        this.entradaStock.numero = data.numero;

        if(data.proveedor != null){
          this.entradaStock.proveedor = data.proveedor;
          this.nombreDocIdentidad = this.entradaStock.proveedor.tipoDocumento.tipo;
        } else {
          this.entradaStock.proveedor = new Proveedor();
        }
        this.entradaStock.facturaProveedor = data.facturaProveedor;
        this.detalleEntradaStocks = data.detalleEntradaStock;
        this.entradaStock.detalleEntradaStock = this.detalleEntradaStocks;

        this.ImporteTotal = this.entradaStock.totalMonto.toFixed(2);

        this.codigoProducto = "";
        

        this.displayProveedor = false;
        this.displayProductsToEntradaStocks = false;

        this.verFrmEntradaStock = true;
        this.vistaCarga = false;
        this.verFrmAlmacen = false;

        //this.setFocusCodigoProducto();
      }
    });
    
  }


  //Seccion CLientes
  getTipoDocumentos() {

    this.clsTipoDocumentoProveedor = null;
    this.tipoDocumentosProveedor = [];
  
    this.proveedorService.getTipoDocumentos().subscribe(data => {
      data.forEach(tipoDoc => {
        this.tipoDocumentosProveedor.push({name: tipoDoc.tipo, code: tipoDoc.id});
      });
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

  setFocusBuscar() {    
    this.changeDetectorRef.detectChanges();
    this.inputBuscar.nativeElement.focus();
  }

  setFocusBuscarDocProveedor() {    
    this.changeDetectorRef.detectChanges();
    this.inputBuscarDocProveedor.nativeElement.focus();
  }

 /*  setFocusCodigoProducto() {    
    this.changeDetectorRef.detectChanges();
    this.inputcodigoProducto.nativeElement.focus();
  } */

  setFocusNombreProveedor() {    
    this.changeDetectorRef.detectChanges();
    this.inputNombreProveedorReg.nativeElement.focus();
  }

 /*  setFocusMontoAbonado() {    
    this.changeDetectorRef.detectChanges();
    this.inputmontoAbonado.nativeElement.focus();
  } */

  aceptarProveedor(registro){
    if(registro != null){

      /* if(this.entradaStock.id == null){
        this.iniciarEntradaStockT().then((v) => {
          
        });
      } */
      this.iniciarEntradaStockT2().then((v) => {
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
      });

      
    }
  }

  buscarDocProveedor() {

    this.iniciarEntradaStockT2().then((v) => {
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
    });
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

            this.iniciarEntradaStockT2().then((v) => {
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

            });

          }
      });
    
  
  }

  setFocusBuscarProducto() {    
    this.changeDetectorRef.detectChanges();
    this.inputBuscarProductos.nativeElement.focus();
  }


  buscarProducto() {

    this.filtroProductosVenta.almacenId = this.entradaStock.almacen.id;
    this.filtroProductosVenta.size = 10;

    this.displayProductsToEntradaStocks = false;
    this.displayProductsToEntradaStocks = true;
    this.selectedProductEntradaStock = null
    this.buscarProductos();
    this.setFocusBuscarProducto();
    
  }

  buscarProductos(): void{
    this.loadingProductosToEntradaStocks = true; 
    this.filtroProductosVenta.palabraClave = this.txtBuscarProducto;
    this.filtroProductosVenta.unidadId = parseInt((this.clsUnidad != null) ? this.clsUnidad.code : 0);
    this.filtroProductosVenta.page = 0;
    this.listarPageProductosToEntradaStocks();
  }


  loadDataProductosToEntradaStocks(event: LazyLoadEvent) { 
    this.loadingProductosToEntradaStocks = true; 
    this.filtroProductosVenta.size = event.rows;
    this.filtroProductosVenta.page = event.first / this.rows;
  
    this.listarPageProductosToEntradaStocks();
  
  }

  listarPageProductosToEntradaStocks() {

    this.productoService.getProductosVenta(this.filtroProductosVenta).subscribe(data => {
      this.productosEntradaStocks = data.content;
      this.isFirstProductosToEntradaStocks = data.first;
      this.isLastProductosToEntradaStocks = data.last;
      this.numberElementsProductosToEntradaStocks = data.numberOfElements;
      this.firstProductosToEntradaStocks = (this.filtroProductosVenta.page * this.filtroProductosVenta.size);
      this.lastProductosToEntradaStocks = (this.filtroProductosVenta.page * this.filtroProductosVenta.size) + this.numberElementsProductosToEntradaStocks;
      this.totalRecordsProductosToEntradaStocks = data.totalElements;
      this.loadingProductosToEntradaStocks = false;
    });
  }

  aceptarProducto(registro){
    this.selectedProductEntradaStock = registro;
    this.activeProductLote = registro.producto.activoLotes == 1;
    //this.lotesProducto = [];
    //this.clsLote = null;

    this.cantidadProductoLotes = 1;
    this.cantidadProductoStocks = 1;

    this.cantUnitLote = null;
    this.cantLote = null;


    if(this.activeProductLote){
      this.nombreLote = '';
      this.fechaVencimiento = '';
      this.displayAddProductsLotes = true;
        //this.setFocusCantProductos();
        
        let precioUnit = this.selectedProductEntradaStock.detalleUnidadProducto.costoCompra;
        this.precioUnitario = precioUnit;

        this.setFocusNombreLotes();
        this.calcularPreciosZ();
    }
    else{
      this.displayAddProductsNoLotes = true;

      let precioUnit = this.selectedProductEntradaStock.detalleUnidadProducto.costoCompra;
      this.precioUnitario = precioUnit;
      this.setFocusCantProductosStocks();
      this.calcularPreciosStocksZ();

    }

    /*
    this.stockService.listarStocksVentas(this.entradaStock.almacen.id, registro.producto.id).subscribe(data => {

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

        let precioUnit = this.selectedProductEntradaStock.detalleUnidadProducto.costoCompra;
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

        let precioUnit = this.selectedProductEntradaStock.detalleUnidadProducto.costoCompra;
        this.precioUnitario = precioUnit.toFixed(2);

      }
    });
    */
  }

  /*
  cambioLotes(): void{

    this.cantUnitLote = null;
    this.cantLote = null;

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
        this.cantLote = this.floor10(registroLote.lote.cantidad / this.selectedProductEntradaStock.detalleUnidadProducto.unidad.cantidad, -2);

        this.setFocusCantProductos();
        
        return;
      }
    });

  }*/

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

    
/*     if( this.nombreLote == null || this.nombreLote.trim() == ''){
      this.messageService.add({severity:'error', summary:'Aviso', detail: 'Ingrese un nombre de lote válido'});
      this.setFocusNombreLotes();
      return;
    }  */

    if( this.cantidadProductoLotes == null || this.cantidadProductoLotes < 0){
      this.messageService.add({severity:'error', summary:'Aviso', detail: 'Ingrese un valor numérico de cantidad válido'});
      this.setFocusCantProductos();
      return;
    }   

    if( this.precioUnitario == null || this.precioUnitario < 0){
      this.messageService.add({severity:'error', summary:'Aviso', detail: 'Ingrese un costo unitario válido'});
      this.setFocusPrecioUnitario();
      return;
    }   


    this.precioTotal = null;
    
    this.selectedProductEntradaStock.detalleUnidadProducto.costoCompra = this.precioUnitario;
    let precioTotal = this.selectedProductEntradaStock.detalleUnidadProducto.costoCompra * this.cantidadProductoLotes;

      
      this.precioTotal = precioTotal.toFixed(2); 
  }


  calcularPrecios(event: Event): void {

    if( this.cantidadProductoLotes == null || this.cantidadProductoLotes < 0){
      this.messageService.add({severity:'error', summary:'Aviso', detail: 'Ingrese un valor numérico de cantidad válido'});
      this.setFocusCantProductos();
      return;
    }  
    
    if( this.precioUnitario == null || this.precioUnitario < 0){
      this.messageService.add({severity:'error', summary:'Aviso', detail: 'Ingrese un costo unitario válido'});
      this.setFocusPrecioUnitario();
      return;
    }   

    this.precioTotal = null;
    
    this.selectedProductEntradaStock.detalleUnidadProducto.costoCompra = this.precioUnitario;
    let precioTotal = this.selectedProductEntradaStock.detalleUnidadProducto.costoCompra * this.cantidadProductoLotes;
      
    this.precioTotal = precioTotal.toFixed(2); 
  }

  calcularPreciosStocksZ(): void{
    this.precioTotal = null;

    if( this.cantidadProductoStocks == null || this.cantidadProductoStocks < 0){
      this.messageService.add({severity:'error', summary:'Aviso', detail: 'Ingrese un valor numérico de cantidad válido'});
      this.setFocusCantProductosStocks();
      return;
    }   

    if( this.precioUnitario == null || this.precioUnitario < 0){
      this.messageService.add({severity:'error', summary:'Aviso', detail: 'Ingrese un costo unitario válido'});
      this.setFocusPrecioUnitario();
      return;
    }
    
    this.selectedProductEntradaStock.detalleUnidadProducto.costoCompra = this.precioUnitario;
    let precioTotal = this.selectedProductEntradaStock.detalleUnidadProducto.costoCompra * this.cantidadProductoStocks;
    this.precioTotal = precioTotal.toFixed(2); 
  }

  calcularPreciosStocks(event: Event): void{
    this.precioTotal = null;

    if( this.cantidadProductoStocks == null || this.cantidadProductoStocks < 0){
      this.messageService.add({severity:'error', summary:'Aviso', detail: 'Ingrese un valor numérico de cantidad válido'});
      this.setFocusCantProductosStocks();
      return;
    }   

    if( this.precioUnitario == null || this.precioUnitario < 0){
      this.messageService.add({severity:'error', summary:'Aviso', detail: 'Ingrese un costo unitario válido'});
      this.setFocusPrecioUnitario();
      return;
    }
    
    this.selectedProductEntradaStock.detalleUnidadProducto.costoCompra = this.precioUnitario;
    let precioTotal = this.selectedProductEntradaStock.detalleUnidadProducto.costoCompra * this.cantidadProductoStocks;
      
    this.precioTotal = precioTotal.toFixed(2); 
  }

  changeTipoDescuentoStock(): void {
    this.cantidadDescuentoStock = 0;
    this.calcularPreciosStocksZ();
  }


  agregarProductoPorCodigo(): void{

    this.iniciarEntradaStockT2().then((v) => {
      let productoAddEntradaStock = new ProductoAddEntradaStock();

      productoAddEntradaStock.idEntradaStock = v.id;
      productoAddEntradaStock.codigoUnidad = this.codigoProducto;


      this.entradaStockService.agregarProductoAEntradaStockPorCodigo(productoAddEntradaStock).subscribe({
        next: (data) => {
          if(data != null && data.id != null){
            //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Proveedor se ha registrado satisfactoriamente'});
            this.entradaStock.id = data.id;
            this.entradaStock.fecha = data.fecha;
            this.entradaStock.facturado = data.facturado;
            this.entradaStock.actualizado = data.actualizado;
            this.entradaStock.totalMonto = data.totalMonto;

            this.entradaStock.estado = data.estado;
            this.entradaStock.hora = data.hora;
            this.entradaStock.ordenCompraId = data.ordenCompraId;
            this.entradaStock.numero = data.numero;

            if(data.proveedor != null){
              this.entradaStock.proveedor = data.proveedor;
            } else {
              this.entradaStock.proveedor = new Proveedor();
            }
            this.entradaStock.facturaProveedor = data.facturaProveedor;
            this.detalleEntradaStocks = data.detalleEntradaStock;
            this.entradaStock.detalleEntradaStock = this.detalleEntradaStocks;

            this.ImporteTotal = this.entradaStock.totalMonto.toFixed(2);

            this.codigoProducto = "";
            //this.setFocusCodigoProducto();

          }
        },
        error: (err) => {
          console.log(err);
        }        
    });
   });
  }

  agregarProducto(): void{

    /*
    if(this.clsLote == null){
      this.messageService.add({severity:'error', summary:'Aviso', detail: 'Seleccione un lote Disponible'});
      //this.setFocusLote();
      return;
    }
    */

    this.iniciarEntradaStockT2().then((v) => {

      this.calcularPreciosZ();
      this.detalleEntradaStockGestion = new DetalleEntradaStock();

      this.detalleEntradaStockGestion.entradaStockIdReference = this.entradaStock.id;
      this.detalleEntradaStockGestion.producto = this.selectedProductEntradaStock.producto;
      this.detalleEntradaStockGestion.costo = this.selectedProductEntradaStock.detalleUnidadProducto.costoCompra;
      this.detalleEntradaStockGestion.cantidad = this.cantidadProductoLotes;
      this.detalleEntradaStockGestion.almacenId = this.entradaStock.almacen.id;
      this.detalleEntradaStockGestion.cantreal = this.selectedProductEntradaStock.detalleUnidadProducto.unidad.cantidad;
      this.detalleEntradaStockGestion.unidad = this.selectedProductEntradaStock.detalleUnidadProducto.unidad.nombre;
      this.detalleEntradaStockGestion.costoTotal = +this.precioTotal;
      //this.detalleEntradaStockGestion.lote = this.lotesProductoBack[this.indexLote].lote;
      this.detalleEntradaStockGestion.activo = 1;
      this.detalleEntradaStockGestion.borrado = 0;

      let loteAdd = new Lote();
      loteAdd.id = 0;
      loteAdd.nombre = this.nombreLote;
      loteAdd.cantidad = this.cantidadProductoLotes;
      loteAdd.fechaVencimiento = this.fechaVencimiento;
      loteAdd.productoId = this.selectedProductEntradaStock.producto.id;
      loteAdd.almacenId = this.entradaStock.almacen.id;

      if(this.fechaVencimiento != null &&  this.fechaVencimiento.length == 10){

        const fechaVenc = moment(this.fechaVencimiento, 'DD/MM/YYYY');
        if(!fechaVenc.isValid){
          this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Vencimiento indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
          return false;
        }
        loteAdd.fechaVencimiento = fechaVenc.format('YYYY-MM-DD');
        loteAdd.activoVencimiento = 1;
  
        if(loteAdd.fechaVencimiento == null || loteAdd.fechaVencimiento.length != 10){
          this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Vencimiento indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
          return false;
        }
  
      }
      else{
        loteAdd.activoVencimiento = 0;
      }

      this.detalleEntradaStockGestion.lote = loteAdd;



      this.entradaStockService.agregarProductoAEntradaStock(this.detalleEntradaStockGestion).subscribe({
        next: (data) => {
          if(data != null && data.id != null){
            //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Proveedor se ha registrado satisfactoriamente'});
            this.entradaStock.id = data.id;
            this.entradaStock.fecha = data.fecha;
            this.entradaStock.facturado = data.facturado;
            this.entradaStock.actualizado = data.actualizado;
            this.entradaStock.totalMonto = data.totalMonto;

            this.entradaStock.estado = data.estado;
            this.entradaStock.hora = data.hora;
            this.entradaStock.ordenCompraId = data.ordenCompraId;
            this.entradaStock.numero = data.numero;

            if(data.proveedor != null){
              this.entradaStock.proveedor = data.proveedor;
            } else {
              this.entradaStock.proveedor = new Proveedor();
            }
            this.entradaStock.facturaProveedor = data.facturaProveedor;
            this.detalleEntradaStocks = data.detalleEntradaStock;
            this.entradaStock.detalleEntradaStock = this.detalleEntradaStocks;

            this.ImporteTotal = this.entradaStock.totalMonto.toFixed(2);

            this.displayProductsToEntradaStocks = false;
            this.displayAddProductsNoLotes = false;
            this.displayAddProductsLotes = false;

          }
        },
        error: (err) => {
          console.log(err);
        }        
    });
   });


  }

  agregarProductoStock(): void{

    
      //this.detalleEntradaStockGestion.entradaStock = this.entradaStock;

      this.iniciarEntradaStockT2().then((v) => {

      this.calcularPreciosStocksZ();
      this.detalleEntradaStockGestion = new DetalleEntradaStock();


      this.detalleEntradaStockGestion.entradaStockIdReference = this.entradaStock.id;
      this.detalleEntradaStockGestion.producto = this.selectedProductEntradaStock.producto;
      this.detalleEntradaStockGestion.costo = this.selectedProductEntradaStock.detalleUnidadProducto.costoCompra;
      this.detalleEntradaStockGestion.cantidad = this.cantidadProductoStocks;
      this.detalleEntradaStockGestion.almacenId = this.entradaStock.almacen.id;
      this.detalleEntradaStockGestion.cantreal = this.selectedProductEntradaStock.detalleUnidadProducto.unidad.cantidad;
      this.detalleEntradaStockGestion.unidad = this.selectedProductEntradaStock.detalleUnidadProducto.unidad.nombre;
      this.detalleEntradaStockGestion.costoTotal = +this.precioTotal;
      //this.detalleEntradaStockGestion.lote = this.lotesProductoBack[this.indexLote].lote;
      this.detalleEntradaStockGestion.activo = 1;
      this.detalleEntradaStockGestion.borrado = 0;


      this.entradaStockService.agregarProductoAEntradaStock(this.detalleEntradaStockGestion).subscribe({
        next: (data) => {
          if(data != null && data.id != null){
            //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Proveedor se ha registrado satisfactoriamente'});
            this.entradaStock.id = data.id;
            this.entradaStock.fecha = data.fecha;
            this.entradaStock.facturado = data.facturado;
            this.entradaStock.actualizado = data.actualizado;
            this.entradaStock.totalMonto = data.totalMonto;

            this.entradaStock.estado = data.estado;
            this.entradaStock.hora = data.hora;
            this.entradaStock.ordenCompraId = data.ordenCompraId;
            this.entradaStock.numero = data.numero;

            if(data.proveedor != null){
              this.entradaStock.proveedor = data.proveedor;
            } else {
              this.entradaStock.proveedor = new Proveedor();
            }
            this.entradaStock.facturaProveedor = data.facturaProveedor;
            this.detalleEntradaStocks = data.detalleEntradaStock;
            this.entradaStock.detalleEntradaStock = this.detalleEntradaStocks;

            this.ImporteTotal = this.entradaStock.totalMonto.toFixed(2);

            this.displayProductsToEntradaStocks = false;
            this.displayAddProductsNoLotes = false;
            this.displayAddProductsLotes = false;

          }
        },
        error: (err) => {
          console.log(err);
        }        
    });
   });
  }

  eliminarDV(detalleEntradaStock:DetalleEntradaStock, event: Event){
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Confirma que desea eliminar el producto seleccionado?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Eliminación',
      accept: () => {
       this.eliminarConfirmadoDV(detalleEntradaStock);
      },
      reject: () => {
      }
    });
  }

  eliminarConfirmadoDV(detalleEntradaStock:DetalleEntradaStock){

   detalleEntradaStock.entradaStockIdReference = this.entradaStock.id;


    this.entradaStockService.deleteProductoAEntradaStock(detalleEntradaStock).subscribe({
      next: (data) => {
        if(data != null && data.id != null){
          //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Proveedor se ha registrado satisfactoriamente'});
          this.entradaStock.id = data.id;
          this.entradaStock.fecha = data.fecha;
          this.entradaStock.facturado = data.facturado;
          this.entradaStock.actualizado = data.actualizado;
          this.entradaStock.totalMonto = data.totalMonto;

          this.entradaStock.estado = data.estado;
          this.entradaStock.hora = data.hora;
          this.entradaStock.ordenCompraId = data.ordenCompraId;
          this.entradaStock.numero = data.numero;

          if(data.proveedor != null){
            this.entradaStock.proveedor = data.proveedor;
          } else {
            this.entradaStock.proveedor = new Proveedor();
          }
          this.entradaStock.facturaProveedor = data.facturaProveedor;
          this.detalleEntradaStocks = data.detalleEntradaStock;
          this.entradaStock.detalleEntradaStock = this.detalleEntradaStocks;

          this.ImporteTotal = this.entradaStock.totalMonto.toFixed(2);

          this.displayProductsToEntradaStocks = false;
          this.displayAddProductsNoLotes = false;
          this.displayAddProductsLotes = false;


        }
      },
      error: (err) => {
        console.log(err);
      }        
   });
  }

  editarDV(detalleEntradaStock:DetalleEntradaStock, event: Event){

    //console.log(detalleEntradaStock);

    this.detalleEntradaStockGestion = new DetalleEntradaStock();
    this.detalleEntradaStockGestion = structuredClone(detalleEntradaStock);
    this.selectedProductEntradaStock = new ProductoVentas();
    let almacen = new Almacen();
    almacen.id = detalleEntradaStock.almacenId;

    let detalleUnidadProducto = new DetalleUnidadProducto();
    let unidad = new Unidad();

    detalleUnidadProducto.unidad = unidad;
    detalleUnidadProducto.unidad.nombre = detalleEntradaStock.unidad;
    detalleUnidadProducto.unidad.cantidad = detalleEntradaStock.cantreal;
    detalleUnidadProducto.costoCompra = detalleEntradaStock.costo;
    
    this.selectedProductEntradaStock.producto = detalleEntradaStock.producto;
    this.selectedProductEntradaStock.almacen = almacen;
    this.selectedProductEntradaStock.detalleUnidadProducto = detalleUnidadProducto;
    this.activeProductLote = detalleEntradaStock.producto.activoLotes == 1;
    this.lotesProducto = [];
    //this.clsLote = null;
    this.nombreLote = '';

    this.cantUnitLote = null;
    this.cantLote = null;

    this.cantidadProductoLotes = detalleEntradaStock.cantidad;
    this.cantidadProductoStocks = detalleEntradaStock.cantidad;
    

    let loteIdAdd = 0;
    if(this.activeProductLote){
      loteIdAdd = detalleEntradaStock.lote.id;
      this.detalleEntradaStockGestion.lote = detalleEntradaStock.lote;

      this.nombreLote = detalleEntradaStock.lote.nombre;
      this.fechaVencimiento = '';
      if(detalleEntradaStock.lote.fechaVencimiento != null){
        const fechaVenc = moment(detalleEntradaStock.lote.fechaVencimiento, 'YYYY-MM-DD');
        this.fechaVencimiento = fechaVenc.format('DD/MM/YYYY');
      }

      this.displayEditProductsLotes = true;
        //this.setFocusCantProductos();
        
        let precioUnit = detalleEntradaStock.costo;
        this.precioUnitario = precioUnit;

        this.setFocusNombreLotesEd();
        this.calcularPreciosZ();
    }
    else{
      this.displayEditProductsNoLotes = true;

      let precioUnit = detalleEntradaStock.costo;
      this.precioUnitario = precioUnit;
      this.setFocusCantProductosStocksEd();
      this.calcularPreciosStocksZ();

    }

    /*
    this.stockService.listarStocksVentasEdit(this.entradaStock.almacen.id, detalleEntradaStock.producto.id, loteIdAdd).subscribe(data => {

      if(this.activeProductLote){

        this.lotesProductoBack = data.respuesta;

        data.respuesta.forEach(registroLote => {
          this.lotesProducto.push({name: registroLote.lote.nombre, code: registroLote.lote.id});
  
          if(detalleEntradaStock.lote.id == registroLote.lote.id){
            this.clsLote = {name: registroLote.lote.nombre, code: registroLote.lote.id};
            if(registroLote.lote.activoVencimiento == 1){
              const fechaVenc = moment(registroLote.lote.fechaVencimiento, 'YYYY-MM-DD');
              this.fechaVencimiento = fechaVenc.format('DD/MM/YYYY');
            } else {
              this.fechaVencimiento = "NO APLICA";
            }

            registroLote.lote.cantidad = registroLote.lote.cantidad + (detalleEntradaStock.cantidad * detalleEntradaStock.cantreal);

            this.cantUnitLote = registroLote.lote.cantidad;
            this.cantLote = this.floor10(registroLote.lote.cantidad / detalleEntradaStock.cantreal, -2);
            
          }
        });

        this.displayEditProductsLotes = true;
        this.setFocusCantProductos();
        this.calcularPreciosZ();

        let precioUnit = this.selectedProductEntradaStock.detalleUnidadProducto.costoCompra;
        this.precioUnitario = precioUnit.toFixed(2);

      }

      else{

        this.stocksProductoBack = data.respuesta;

        data.respuesta.forEach(registroStock => {

          this.cantUnitStock = registroStock.stock.cantidad + (detalleEntradaStock.cantidad * detalleEntradaStock.cantreal);
          this.cantStock = this.floor10(registroStock.stock.cantidad / detalleEntradaStock.cantreal, -2);

        });

        this.displayEditProductsNoLotes = true;
        this.setFocusCantProductosStocks();
        this.calcularPreciosStocksZ();

        let precioUnit = this.selectedProductEntradaStock.detalleUnidadProducto.costoCompra;
        this.precioUnitario = precioUnit.toFixed(2);

      }
    });
    */
  }

  modificarProducto(): void{

    this.calcularPreciosZ();

    

    //this.detalleEntradaStockGestion.entradaStock = this.entradaStock;

    this.detalleEntradaStockGestion.entradaStockIdReference = this.entradaStock.id;
    this.detalleEntradaStockGestion.cantidad = this.cantidadProductoLotes;
    this.detalleEntradaStockGestion.almacenId = this.entradaStock.almacen.id;
    this.detalleEntradaStockGestion.costo = this.precioUnitario;
    this.detalleEntradaStockGestion.costoTotal = +this.precioTotal;
    //this.detalleEntradaStockGestion.lote = this.lotesProductoBack[this.indexLote].lote;
    this.detalleEntradaStockGestion.activo = 1;
    this.detalleEntradaStockGestion.borrado = 0;

    let loteEdd = new Lote();
      loteEdd.id = this.detalleEntradaStockGestion.lote.id;
      loteEdd.nombre = this.nombreLote;
      loteEdd.cantidad = this.cantidadProductoLotes;
      loteEdd.fechaVencimiento = this.fechaVencimiento;
      loteEdd.productoId = this.selectedProductEntradaStock.producto.id;
      loteEdd.almacenId = this.entradaStock.almacen.id;

      if(this.fechaVencimiento != null &&  this.fechaVencimiento.length == 10){

        const fechaVenc = moment(this.fechaVencimiento, 'DD/MM/YYYY');
        if(!fechaVenc.isValid){
          this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Vencimiento indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
          return;
        }
        loteEdd.fechaVencimiento = fechaVenc.format('YYYY-MM-DD');
        loteEdd.activoVencimiento = 1;
  
        if(loteEdd.fechaVencimiento == null || loteEdd.fechaVencimiento.length != 10){
          this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Vencimiento indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
          return;
        }
  
      }
      else{
        loteEdd.activoVencimiento = 0;
      }

      this.detalleEntradaStockGestion.lote = loteEdd;


    this.entradaStockService.modificarProductoAEntradaStock(this.detalleEntradaStockGestion).subscribe({
      next: (data) => {
        if(data != null && data.id != null){
          //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Proveedor se ha registrado satisfactoriamente'});
          this.entradaStock.id = data.id;
          this.entradaStock.fecha = data.fecha;
          this.entradaStock.facturado = data.facturado;
          this.entradaStock.actualizado = data.actualizado;
          this.entradaStock.totalMonto = data.totalMonto;

          this.entradaStock.estado = data.estado;
          this.entradaStock.hora = data.hora;
          this.entradaStock.ordenCompraId = data.ordenCompraId;
          this.entradaStock.numero = data.numero;

          if(data.proveedor != null){
            this.entradaStock.proveedor = data.proveedor;
          } else {
            this.entradaStock.proveedor = new Proveedor();
          }
          this.entradaStock.facturaProveedor = data.facturaProveedor;
          this.detalleEntradaStocks = data.detalleEntradaStock;
          this.entradaStock.detalleEntradaStock = this.detalleEntradaStocks;

          this.ImporteTotal = this.entradaStock.totalMonto.toFixed(2);

          this.displayEditProductsLotes = false;


        }
      },
      error: (err) => {
        console.log(err);
      }        
   });
  }

  modificarProductoStock(): void{
    this.calcularPreciosStocksZ();

    //this.detalleEntradaStockGestion = new DetalleEntradaStock();

    //this.detalleEntradaStockGestion.entradaStock = this.entradaStock;

    this.detalleEntradaStockGestion.entradaStockIdReference = this.entradaStock.id;
    this.detalleEntradaStockGestion.cantidad = this.cantidadProductoStocks;
    this.detalleEntradaStockGestion.almacenId = this.entradaStock.almacen.id;
    this.detalleEntradaStockGestion.costo = this.precioUnitario;
    this.detalleEntradaStockGestion.costoTotal = +this.precioTotal;
    this.detalleEntradaStockGestion.lote = null;


    this.entradaStockService.modificarProductoAEntradaStock(this.detalleEntradaStockGestion).subscribe({
      next: (data) => {
        if(data != null && data.id != null){
          //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Proveedor se ha registrado satisfactoriamente'});
          this.entradaStock.id = data.id;
          this.entradaStock.fecha = data.fecha;
          this.entradaStock.facturado = data.facturado;
          this.entradaStock.actualizado = data.actualizado;
          this.entradaStock.totalMonto = data.totalMonto;

          this.entradaStock.estado = data.estado;
          this.entradaStock.hora = data.hora;
          this.entradaStock.ordenCompraId = data.ordenCompraId;
          this.entradaStock.numero = data.numero;

          if(data.proveedor != null){
            this.entradaStock.proveedor = data.proveedor;
          } else {
            this.entradaStock.proveedor = new Proveedor();
          }
          this.entradaStock.facturaProveedor = data.facturaProveedor;
          this.detalleEntradaStocks = data.detalleEntradaStock;
          this.entradaStock.detalleEntradaStock = this.detalleEntradaStocks;

          this.ImporteTotal = this.entradaStock.totalMonto.toFixed(2);

          this.displayEditProductsNoLotes = false;


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


  setFocusNombreLotesEd() {    
    this.changeDetectorRef.detectChanges();
    //this.inputcantidadProductoLotes.nativeElement.focus();
    this.inputNombreLoteEd.nativeElement.select();
  }

  setFocusPrecioUnitarioEd() {    
    this.changeDetectorRef.detectChanges();
    //this.inputcantidadProductoLotes.nativeElement.focus();
    this.inputPrecioUnitarioEd.nativeElement.select();
  }

  setFocusNombreLotes() {    
    this.changeDetectorRef.detectChanges();
    //this.inputcantidadProductoLotes.nativeElement.focus();
    this.inputNombreLote.nativeElement.select();
  }

  setFocusPrecioUnitario() {    
    this.changeDetectorRef.detectChanges();
    //this.inputcantidadProductoLotes.nativeElement.focus();
    this.inputPrecioUnitario.nativeElement.select();
  }
  
  setFocusCantProductos() {    
    this.changeDetectorRef.detectChanges();
    //this.inputcantidadProductoLotes.nativeElement.focus();
    this.inputcantidadProductoLotes.nativeElement.select();
  }


  setFocusCantProductosStocksEd() {    
    this.changeDetectorRef.detectChanges();
    //this.inputcantidadProductoLotes.nativeElement.focus();
    this.inputcantidadProductoStocksEd.nativeElement.select();
  }
  setFocusCantProductosStocks() {    
    this.changeDetectorRef.detectChanges();
    //this.inputcantidadProductoLotes.nativeElement.focus();
    this.inputcantidadProductoStocks.nativeElement.select();
  }

  limpiarDatos(): void{
    this.activeProductLote = false;
    this.displayEditProductsLotes = false;
    this.displayEditProductsNoLotes = false;
  
    this.entradaStock = new EntradaStock();
  
    
    this.codigoProducto = '';
    this.txtBuscarDocProveedor = '';
    this.nombreDocIdentidad = '';
    this.cantIcbper = 0;
  
    this.detalleEntradaStocks = [];
  
    this.OpGravada = '';
    this.OpExonerada = '';
    this.OpInafecta = '';
    this.TotalISC = '';
    this.TotalIGV = '';
    this.TotalICBPER = '';
    this.ImporteTotal = '';
  
  
    this.txtBuscarProveedor = '';
    this.proveedors = [];
  
    this.pageProveedors = 0;
    this.firstProveedors = 0;
    this.lastProveedors = 0;
    this.rowsProveedors = 10;
    this.isFirstProveedors = true;
    this.isLastProveedors = false;
    this.totalRecordsProveedors = 0;
    this.numberElementsProveedors = 0;
    this.loadingProveedors = true; 
  
    this.selectedProveedor = null;
  
    //Reg Proveedor
  
    this.nombreProveedor = '';
    this.tipo_documento_idProveedor = null;
    this.documentoProveedor = '';
    this.direccionProveedor = '';
    this.telefonoProveedor = '';
    this.anexo = '';
    this.celular = '';
  
    this.newProveedor = new Proveedor();
  
    //Estructuras de Productos
  
    this.productosEntradaStocks = [];
    this.filtroProductosVenta = new FiltroProductosVenta();
  
    this.pageProductosToEntradaStocks = 0;
    this.firstProductosToEntradaStocks = 0;
    this.lastProductosToEntradaStocks = 0;
    this.rowsProductosToEntradaStocks = 10;
    this.isFirstProductosToEntradaStocks = true;
    this.isLastProductosToEntradaStocks = false;
    this.totalRecordsProductosToEntradaStocks = 0;
    this.numberElementsProductosToEntradaStocks = 0;
    this.loadingProductosToEntradaStocks = true; 
  
    this.txtBuscarProducto = '';
  
    this.selectedProductEntradaStock = null;
    
    this.lotesProducto = [];
    //this.clsLote = null;
    this.nombreLote = '';
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
  
  
    //Detalle EntradaStocks
  
    this.detalleEntradaStockGestion = new DetalleEntradaStock();

    //Cobro EntradaStock
    this.displayConfirmarPago = false;

    this.displayConfirmarPago = false;
    this.tipoComprobantes = [];
    this.clsTipoComprobante = null;
    this.serieFacturaProveedors = [];
    this.clsSerieFacturaProveedor = null;
    this.clsMetodoPago = null;
    this.metodoPagos = [];

    this.bancos = [];
    this.clsBanco = null;

    this.numeroCuentas = [];
    this.clsNumeroCuenta = null;
    this.numeroOperacion = '';

    this.tipoTarjetas = [];
    this.clsTipoTarjeta = null;
    this.numeroTarjeta = '';
    this.numeroCheque = '';
    
    this.numeroCelulares = [];
    this.clsNumeroCelular = null;
    //initFacturaProveedors: InitFacturaProveedor[] = [];

    this.montoEntradaStock = null;
    this.montoAbonado = null;
    this.montoVuelto = null;
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


  calcularMontos(event: Event): void {
    let importe = this.floor10(this.entradaStock.totalMonto, -2);
    let vuelto =  this.montoAbonado - importe;
    this.montoVuelto = vuelto.toFixed(2);
  }

  cobrarEntradaStock(): void{

    if(this.entradaStock.id == null){
      this.messageService.add({severity:'error', summary:'Error', detail: 'No se ha registrado la Compra'});
      return;
    }

    if(this.entradaStock.detalleEntradaStock == null || this.entradaStock.detalleEntradaStock.length == 0){
      this.messageService.add({severity:'error', summary:'Error', detail: 'No se ha agregado ningún producto a la Compra'});
      return;
    }

    if(this.entradaStock.totalMonto == null || this.entradaStock.totalMonto == 0){
      this.messageService.add({severity:'error', summary:'Error', detail: 'No se puede cobrar un monton de Compra igual a cero'});
      return;
    }


    this.ImporteTotal = this.entradaStock.totalMonto.toFixed(2);
    this.montoAbonado = this.entradaStock.totalMonto;
    this.montoVuelto = "0.00";
    this.numeroCheque = "";

    this.getTipoComprobantes();
    this.getMetodoPagos();

    this.displayConfirmarPago = false;
    this.displayConfirmarPago = true;

    //this.setFocusMontoAbonado();
    
  }
  nuevaEntradaStock(): void{
    //nueva entradaStock
    this.limpiarDatos();
    this.seleccionarLocal();
    
  }

  cancelarEntradaStock(event: Event): void{

    if(this.entradaStock.id != null){
      this.entradaStockService.resetEntradaStock(this.entradaStock).subscribe({
        next: (data) => {
          if(data != null && data.id != null){
            //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Proveedor se ha registrado satisfactoriamente'});
            this.entradaStock.id = data.id;
            this.entradaStock.fecha = data.fecha;
            this.entradaStock.facturado = data.facturado;
            this.entradaStock.actualizado = data.actualizado;
            this.entradaStock.totalMonto = data.totalMonto;

            this.entradaStock.estado = data.estado;
            this.entradaStock.hora = data.hora;
            this.entradaStock.ordenCompraId = data.ordenCompraId;
            this.entradaStock.numero = data.numero;

            this.entradaStock.proveedor = new Proveedor();
            this.entradaStock.facturaProveedor = data.facturaProveedor;
            this.detalleEntradaStocks = data.detalleEntradaStock;
            this.entradaStock.detalleEntradaStock = this.detalleEntradaStocks;

            this.ImporteTotal = this.entradaStock.totalMonto.toFixed(2);


            this.codigoProducto = "";
            //this.setFocusCodigoProducto();

          }
        },
        error: (err) => {
          console.log(err);
        }        
    });
    
    }
  }

  cerrarEntradaStock(event: Event): void{

      this.limpiarDatos();
      this.verFrmAlmacen = true;
      this.verFrmEntradaStock = false;
      this.vistaCarga = false;
    
  }

  confirmarPago(): void{
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Confirma que desea realizar el Cobro de la Compra?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Cobro de Compra',
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

    this.pagoProveedor.entradaStock = this.entradaStock;
    this.pagoProveedor.montoPago = this.montoAbonado;

    let tipoTarjeta = this.clsTipoTarjeta != null ? this.clsTipoTarjeta.name : "";
    let siglaTarjeta = this.clsTipoTarjeta != null ? this.clsTipoTarjeta.sigla : "";

    let banco = this.clsBanco != null ? this.clsBanco.name : "";
    let numeroCuenta = this.clsNumeroCuenta != null ? this.clsNumeroCuenta.name : "";
    let numeroCelular = this.clsNumeroCelular != null ? this.clsNumeroCelular.name : "";

    let tipoComprobanteId = parseInt((this.clsTipoComprobante != null) ? this.clsTipoComprobante.code : "0");

    this.pagoProveedor.tipoTarjeta = tipoTarjeta;
    this.pagoProveedor.siglaTarjeta = siglaTarjeta;
    this.pagoProveedor.numeroTarjeta = this.numeroTarjeta;
    this.pagoProveedor.banco = banco;
    this.pagoProveedor.numeroCuenta = numeroCuenta;
    this.pagoProveedor.numeroCelular = numeroCelular;
    this.pagoProveedor.numeroCheque = this.numeroCheque;
    this.pagoProveedor.codigoOperacion = this.numeroOperacion;
    this.pagoProveedor.tipoComprobanteId = tipoComprobanteId;
    this.pagoProveedor.metodoPago = metodoPago;

    this.entradaStockService.pagarEntradaStock(this.pagoProveedor).subscribe({
      next: (data) => {
        if(data != null && data.id != null){
          //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Proveedor se ha registrado satisfactoriamente'});
          this.messageService.add({severity:'success', summary:'Confirmado', detail: 'La Compra se ha Cobrado Exitosamente'});
          this.pagoProveedor = data;
          this.displayConfirmarPago = false;
          this.nuevaEntradaStock();
        }
      },
      error: (err) => {
        console.log(err);
      }        
   });

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
