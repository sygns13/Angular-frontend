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
import { DetalleMetodoPagoService } from '../../../_service/detalle_metodo_pago.service';
import { FiltroEntradaStock } from './../../../_util/filtro_entrada_stock';
import { EntradaStockServiceData } from './../../../_servicesdata/entrada_stock.service';
import { ProveedorService } from './../../../_service/proveedor.service';
import { TipoTarjetaService } from '../../../_service/tipo_tarjeta.service';
import { PagoProveedor } from './../../../_model/pago_proveedor';
import { MetodoPago } from '../../../_model/metodo_pago';
import { Proveedor } from './../../../_model/proveedor';
import { TipoDocumento } from './../../../_model/tipo_documento';
import * as moment from 'moment';

@Component({
  selector: 'app-pagar',
  templateUrl: './pagar.component.html',
  styleUrls: ['./pagar.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class PagarComponent implements OnInit{

  @ViewChild('inputTxtBuscar', { static: false }) inputTxtBuscar: ElementRef;
  @ViewChild('inputmontoAbonado', { static: false }) inputmontoAbonado: ElementRef;
  @ViewChild('inputBuscarDocCliente', { static: false }) inputBuscarDocCliente: ElementRef;
  @ViewChild('inputNombreClienteReg', { static: false }) inputNombreClienteReg: ElementRef;


  almacens: any[] = [];
  TipoComprobantes: any[] = [];
  usuarios: any[] = [];
  
  estadoPagados: any[] = [
    {name: 'TODAS', code: 'Z'},
    {name: 'Pagadas', code: '1'},
    {name: 'Por Pagar', code: '0'},
  ];


  clsAlmacen: any = null;
  //clsTipoComprobante: any = null;
  clsUsuario: any = null;
  clsEstadoPago: any = {name: 'TODAS', code: 'Z'};
  clsTipoEntradaStock: any = {name: 'TODAS', code: '0'};
  

  now: any = moment();
  fechaInicio: string = this.now.format('DD/MM/YYYY');
  fechaFinal: string = this.now.format('DD/MM/YYYY');
  txtBuscar: string = '';

  venta = new EntradaStock();

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
  verFrmEntradaStock: boolean = false;
  verFrmPagarEntradaStock: boolean = false;



  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private entradaStockService: EntradaStockService, 
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService,
    private almacenService: AlmacenService, private router: Router,
    private entradaStockServiceData: EntradaStockServiceData,
    private tipoComprobanteService: TipoComprobanteService,
    private metodoPagoService:MetodoPagoService,
    private bancoService: BancoService,
    private detalleMetodoPagoService: DetalleMetodoPagoService,
    private proveedorService: ProveedorService) {
    this.breadcrumbService.setItems([
      { label: 'Compras' },
      { label: 'Compras por Pagar', routerLink: ['/compras/pagar'] }
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
    this.evaluarFiltros();
  
    this.almacenService.listarAll().subscribe(data => {
  
      this.almacens.push({name: "General - Todas", code: 0});
      this.clsAlmacen = {name: "General - Todas", code: 0};
      data.forEach(almacen => {
        this.almacens.push({name: almacen.nombre, code: almacen.id});
      });
  
      
      this.filtroEntradaStock.almacenId =  this.clsAlmacen.code;

      this.evaluarFiltros();
      if(this.filtroEntradaStock.fechaInicio == null){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Inicio indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return;
      }
      if(this.filtroEntradaStock.fechaFinal == null){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha Final indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return;
      }
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
  
    this.entradaStockService.getEntradaStocksPorPagar(this.filtroEntradaStock, p ,s).subscribe(data => {
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

  setFocusMontoAbonado() {    
    this.changeDetectorRef.detectChanges();
    this.inputmontoAbonado.nativeElement.focus();
  }

  cambioFiltros(event: Event){
    this.evaluarFiltros();
      if(this.filtroEntradaStock.fechaInicio == null){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Inicio indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return;
      }
      if(this.filtroEntradaStock.fechaFinal == null){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha Final indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return;
      }
    this.listarPageMain(this.page, this.rows);
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


    if(this.clsEstadoPago != null && this.clsEstadoPago.code != "Z") {
      this.filtroEntradaStock.estadoPago = this.clsEstadoPago.code;
    }
    else{
      this.filtroEntradaStock.estadoPago = null;
    }

    if(this.txtBuscar != null && this.txtBuscar.trim().length > 0){
      this.filtroEntradaStock.buscarDatos = this.txtBuscar.trim();
    }else{
      this.filtroEntradaStock.buscarDatos = null;
    }
  }

  buscar(): void{
    this.actualizarEntradaStocks();
  }



  //Buttons Administratives
  actualizarEntradaStocks(): void{
    this.selectedEntradaStock  = null;
    this.evaluarFiltros();
      if(this.filtroEntradaStock.fechaInicio == null){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Inicio indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return;
      }
      if(this.filtroEntradaStock.fechaFinal == null){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha Final indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return;
      }
    this.listarPageMain(this.page, this.rows);
  }
  
  verEntradaStock(): void{
    this.verFrmPagarEntradaStock  = false;
    if(this.selectedEntradaStock == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Seleccione una EntradaStock haciendo click en su fila correspondiente'});

    }else{
      this.vistaCarga2 = false;
      this.verFrmEntradaStock  = true;
    }
  }
  
  pagarEntradaStock(): void{
    this.verFrmEntradaStock  = false;
    if(this.selectedEntradaStock == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Seleccione una EntradaStock haciendo click en su fila correspondiente'});

    }else{
      this.vistaCarga2 = false;
      this.verFrmPagarEntradaStock  = true;
    }
  }


  //Other Functions
  cerrarFormularioVerEntradaStock($event) {
    //productoCambiado: Producto = $event;
    this.loading = true;

    this.selectedEntradaStock  = null;
    this.verFrmEntradaStock  = false;
    this.verFrmPagarEntradaStock  = false;
    this.vistaCarga2 = true;
    this.actualizarEntradaStocks();
 }

 cerrarFormularioPagarEntradaStock($event) {
  //productoCambiado: Producto = $event;
  this.loading = true;

  this.selectedEntradaStock  = null;
  this.verFrmEntradaStock  = false;
  this.verFrmPagarEntradaStock  = false;
  this.vistaCarga2 = true;
  this.actualizarEntradaStocks();
}


}
