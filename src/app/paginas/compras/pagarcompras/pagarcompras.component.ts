import { Component, OnInit, Input, Output, EventEmitter,  ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { EntradaStock } from './../../../_model/entrada_stock';
import { EntradaStockService } from './../../../_service/entrada_stock.service';
import { MetodoPagoService } from '../../../_service/metodo_pago.service';
import { BancoService } from '../../../_service/banco.service';
import { TipoTarjetaService } from '../../../_service/tipo_tarjeta.service';
import { PagoProveedorService } from './../../../_service/pago_proveedor.service';
import { AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import { ConfirmationService, MessageService} from 'primeng/api';
import { Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';
import { PassfechavistaPipe } from './../../../_pipes/passfechavista.pipe';
import { OnlydecimalesPipe } from './../../../_pipes/onlydecimales.pipe';
import { PagoProveedor } from './../../../_model/pago_proveedor';
import { MetodoPago } from '../../../_model/metodo_pago';
import * as moment from 'moment';

@Component({
  selector: 'app-pagarcompras',
  templateUrl: './pagarcompras.component.html',
  styleUrls: ['./pagarcompras.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PagarcomprasComponent implements OnInit{

  @Input() entradaStock: EntradaStock;
  @Output() cerrarFormPagarEntradaStock = new EventEmitter<EntradaStock>();

  @ViewChild('inputmontoAbonado', { static: false }) inputmontoAbonado: ElementRef;

  message: string = "valor1";
  vistaCarga: boolean = false;
  displayConfirmarPago: boolean = false;

  billData: any[];
  billCols: any[];

  pagosEntradaStock: any[] = [];

  page: number = 0;
  first: number = 0;
  last: number = 0;
  rows: number = 10;

  isFirst: boolean = true;
  isLast: boolean = false;
  totalRecords: number = 0;
  numberElements: number = 0;

  msgs: Message[] = [];
  loading: boolean = true; 

  //Nuevo Pago
  tipoFrm: String = 'Registro de Pago';
  vistaBotonRegistro : boolean = false;
  vistaBotonEdicion : boolean = false;

  pagoProveedor: PagoProveedor = new PagoProveedor();
  serieComprobante : string = '';
  fechaComprobante : string = '';
  numeroComprobante : string = '';
  observacionesComprobante : string = '';

  fecha : string = '';
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


  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private entradaStockService: EntradaStockService, 
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService,
    private onlydecimalesPipe: OnlydecimalesPipe, private currencyPipe:CurrencyPipe, private passfechavistaPipe: PassfechavistaPipe,
    private metodoPagoService:MetodoPagoService,
    private bancoService: BancoService,
    private pagoProveedorService: PagoProveedorService,
    private tipoTarjetaService: TipoTarjetaService) {
    this.breadcrumbService.setItems([
      { label: 'Compras' },
      { label: 'Compras por Pagar', routerLink: ['/compras/pagar'] }
    ]);
  }

  ngOnInit(): void {
    /* this.getTipoProductos();
    this.getMarcas();
    this.getPresentaciones(); */
    //this.getEntradaStock()
    this.primengConfig.ripple = true;
    this.vistaCarga = false;
    //this.setFocusBuscar();
    this.getEntradaStock();
    this.listarPageMain(this.page, this.rows);
  }

  cerrarFormulario(){
    this.cerrarFormPagarEntradaStock.emit(this.entradaStock);
  }

  //Carga de Data
  getEntradaStock(): void {
    this.entradaStockService.listarPorId(this.entradaStock.id).subscribe(data => {
      if(data != null && data.id != null){
        this.entradaStock = data;
        this.renderHeaders();
      }
    });
  }

  renderHeaders(): void{
    this.billData = [
      {
          'proveedor': this.entradaStock.proveedor != null ? this.entradaStock.proveedor.nombre : "",
          'documento': this.entradaStock.proveedor != null ? this.entradaStock.proveedor.tipoDocumento.tipo + ": " + this.entradaStock.proveedor.documento  : "",
          'facturaProveedor': this.entradaStock.facturaProveedor != null ? this.entradaStock.facturaProveedor.tipoComprobante.nombre + " " + this.entradaStock.facturaProveedor.serie + "-" + this.entradaStock.facturaProveedor.numero : "",
          'fecha': this.passfechavistaPipe.transform(this.entradaStock.fecha) + " - " + this.entradaStock.hora,
          'importe': this.currencyPipe.transform(this.entradaStock.importeTotal, "PEN" , "S/."),
      }
    ];

  this.billCols = [
      { field: 'proveedor', header: 'Proveedor' },
      { field: 'documento', header: 'Documento de Identidad' },
      { field: 'facturaProveedor', header: 'Comprobante' },
      { field: 'fecha', header: 'Fecha y hora' },
      { field: 'importe', header: 'Importe de Compra' },
    ];
  }

  loadData(event: LazyLoadEvent) { 
    this.loading = true; 
    this.rows = event.rows;
    this.page = event.first / this.rows;
  
    this.listarPageMain(this.page, this.rows);
  
  }

  listarPageMain(p: number, s:number) {
 
    this.loading = true;
  
    this.entradaStockService.getPagosEntradaStocks(this.entradaStock.id, p ,s).subscribe(data => {
      this.pagosEntradaStock = data.content;
      this.isFirst = data.first;
      this.isLast = data.last;
      this.numberElements = data.numberOfElements;
      this.first = (p * s);
      this.last = (p * s) + this.numberElements;
      this.totalRecords = data.totalElements;
      this.loading = false;
    });
  }

  getMetodoPagos() {
  
    this.clsMetodoPago = null;
    this.metodoPagos = [];
    let isFirst = true;

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
          isFirst = false;
        }
      });
    });
  }

  setFocusMontoAbonado() {    
    this.changeDetectorRef.detectChanges();
    this.inputmontoAbonado.nativeElement.focus();
  }

  nuevo(): void{

    this.vistaBotonRegistro = true;
    this.vistaBotonEdicion = false;
    this.tipoFrm = 'Registro de Pago' 
    this.displayConfirmarPago = false;
    this.displayConfirmarPago = true;

    this.cancelar();
    
  }

  cancelar() {
    const fechaMoment = moment();

    this.montoAbonado = this.entradaStock.montoPorPagar;
    this.fecha = fechaMoment.format('DD/MM/YYYY');
    this.numeroCheque = "";
    this.getMetodoPagos();
    this.setFocusMontoAbonado();
    
  }

  confirmarPago(event: Event): void{
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Confirma que desea registrar el Pago?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación de Registro',
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

    const fechaMoment = moment(this.fecha, 'DD/MM/YYYY');
      if(!fechaMoment.isValid){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return;
      }
      this.pagoProveedor.fecha = fechaMoment.format('YYYY-MM-DD');

    this.vistaCarga = true;
    this.pagoProveedorService.registrar(this.pagoProveedor).subscribe({
      next: c => {
        this.vistaCarga = false;
        this.loading = true; 
        this.cancelar();
        this.displayConfirmarPago = false;
        this.listarPageMain(this.page, this.rows);
        this.getEntradaStock();
        this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Pago se ha registrado satisfactoriamente'});
      },
      error: error => {
        console.log('Error complete');
        this.vistaCarga = false;
      },
      complete: () => {
        this.vistaCarga = false;
        console.log('Request complete');
      }
    });

  }


  editar(data:PagoProveedor): void{

    this.pagoProveedor = data;
    this.clsMetodoPago = null;
    this.metodoPagos = [];

    this.metodoPagoService.listarAll().subscribe(data => {
      data.forEach(metodoPago => {
          this.metodoPagos.push({name: metodoPago.nombre, code: metodoPago.id, tipoId: metodoPago.tipoId});
      });

      this.clsMetodoPago =  (this.pagoProveedor.metodoPago != null) ?  {name: this.pagoProveedor.metodoPago.nombre, code: this.pagoProveedor.metodoPago.id, tipoId: this.pagoProveedor.metodoPago.tipoId} : null;

      let metodos_pago_id = parseInt((this.clsMetodoPago != null) ? this.clsMetodoPago.code : "0");

      this.clsBanco = null;
      this.bancos = [];
      this.numeroOperacion = '';

      this.bancoService.listarAll().subscribe(data => {
        data.forEach(banco => {
          this.bancos.push({name: banco.nombre, code: banco.id});

          if(this.pagoProveedor.banco != null && banco.nombre == this.pagoProveedor.banco){
                this.clsBanco = {name: banco.nombre, code: banco.id};
                this.numeroCuenta = null;
                this.numeroCuenta = this.pagoProveedor.numeroCuenta; 
            } 
        });
      });

      
        this.tipoTarjetas = [];
        this.tipoTarjetaService.listarAll().subscribe(data => {
          data.forEach(data => {
            this.tipoTarjetas.push({name: data.nombre, code: data.id, sigla: data.sigla});
            if(this.pagoProveedor.tipoTarjeta != null && data.nombre == this.pagoProveedor.tipoTarjeta){
              this.clsTipoTarjeta = {name: data.nombre, code: data.id, sigla: data.sigla};
            }
          });
        });
      

      if(this.pagoProveedor.numeroTarjeta != null && this.pagoProveedor.numeroTarjeta != ""){
        this.numeroTarjeta = this.pagoProveedor.numeroTarjeta;
      }

      if(this.pagoProveedor.numeroCheque != null && this.pagoProveedor.numeroCheque != ""){
        this.numeroCheque = this.pagoProveedor.numeroCheque;
      }

      if(this.pagoProveedor.codigoOperacion != null && this.pagoProveedor.codigoOperacion != ""){
        this.numeroOperacion = this.pagoProveedor.codigoOperacion;
      }

      if(this.pagoProveedor.numeroCelular != null && this.pagoProveedor.numeroCelular != ""){
        this.numeroCelular = this.pagoProveedor.numeroCelular;
      }

    });

    

    if(this.pagoProveedor.fecha != null){
      const fechaMoment = moment(this.pagoProveedor.fecha, 'YYYY-MM-DD');
      this.fecha = fechaMoment.format('DD/MM/YYYY');
    }

    if(this.pagoProveedor.montoPago != null){
      this.montoAbonado = this.pagoProveedor.montoPago;
    }


    
    this.vistaBotonRegistro = false;
    this.vistaBotonEdicion = true;
    this.tipoFrm = 'Modificación de Pago' 
    this.displayConfirmarPago = false;
    this.displayConfirmarPago = true;

    this.setFocusMontoAbonado();
    
  }

  modificar(event: Event) {
    this.confirmationService.confirm({
        key: 'confirmDialog',
        target: event.target,
        message: '¿Está seguro de Editar el Pago?',
        icon: 'pi pi-info-circle',
        header: 'Confirmación Edición',
        accept: () => {
          //this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
         // this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have accepted'});
         this.editarConfirmado();
        },
        reject: () => {
         // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
    });
  }

  editarConfirmado(){
    
    this.vistaCarga = true;
    //detalleUnidadEdit = structuredClone(this.detalleUnidad));

    let cobrarEntradaStockEdit = new PagoProveedor();
    cobrarEntradaStockEdit = structuredClone(this.pagoProveedor);

    let metodoPago = new MetodoPago();

    let metodoPagoId = parseInt((this.clsMetodoPago != null) ? this.clsMetodoPago.code : "0");
    let tipoId = this.clsMetodoPago != null ? this.clsMetodoPago.tipoId : "";
    let metodoPagoName = this.clsMetodoPago != null ? this.clsMetodoPago.name : "";

    metodoPago.id = metodoPagoId;
    metodoPago.tipoId = tipoId;
    metodoPago.nombre = metodoPagoName;

    cobrarEntradaStockEdit.entradaStock = this.entradaStock;
    cobrarEntradaStockEdit.montoPago = this.montoAbonado;

    let tipoTarjeta = this.clsTipoTarjeta != null ? this.clsTipoTarjeta.name : "";
    let siglaTarjeta = this.clsTipoTarjeta != null ? this.clsTipoTarjeta.sigla : "";

    let banco = this.clsBanco != null ? this.clsBanco.name : "";

    let tipoComprobanteId = parseInt((this.clsTipoComprobante != null) ? this.clsTipoComprobante.code : "0");

    cobrarEntradaStockEdit.tipoTarjeta = tipoTarjeta;
    cobrarEntradaStockEdit.siglaTarjeta = siglaTarjeta;
    cobrarEntradaStockEdit.numeroTarjeta = this.numeroTarjeta;
    cobrarEntradaStockEdit.banco = banco;
    cobrarEntradaStockEdit.numeroCuenta = this.numeroCuenta;
    cobrarEntradaStockEdit.numeroCelular = this.numeroCelular;
    cobrarEntradaStockEdit.numeroCheque = this.numeroCheque;
    cobrarEntradaStockEdit.codigoOperacion = this.numeroOperacion;
    cobrarEntradaStockEdit.tipoComprobanteId = tipoComprobanteId;
    cobrarEntradaStockEdit.metodoPago = metodoPago;

    const fechaMoment = moment(this.fecha, 'DD/MM/YYYY');
      if(!fechaMoment.isValid){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return;
      }
      cobrarEntradaStockEdit.fecha = fechaMoment.format('YYYY-MM-DD');

    this.vistaCarga = true;
    this.pagoProveedorService.modificar(cobrarEntradaStockEdit).subscribe({
      next: c => {
        this.vistaCarga = false;
        this.loading = true; 
        this.cancelar();
        this.displayConfirmarPago = false;
        this.listarPageMain(this.page, this.rows);
        this.getEntradaStock();
        this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Pago se ha modificado satisfactoriamente'});
      },
      error: error => {
        console.log('Error complete');
        this.vistaCarga = false;
      },
      complete: () => {
        this.vistaCarga = false;
        console.log('Request complete');
      }
    });

    

  }

  eliminar(data:PagoProveedor, event: Event){
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Está seguro de Eliminar el registro? - Nota: Este proceso no podrá ser revertido',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Eliminación',
      accept: () => {
       this.eliminarConfirmado(data);
      },
      reject: () => {
      }
  });
    
  }

  eliminarConfirmado(data:PagoProveedor){
    this.vistaCarga = true;
   this.pagoProveedorService.eliminar(data.id).subscribe({
    next: c => {
      this.loading = true; 
      this.vistaCarga = false;
      if(this.numberElements <= 1 && this.page > 0){
        this.page--;
      }
      this.listarPageMain(this.page, this.rows);
      this.getEntradaStock();
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Pago se ha eliminado satisfactoriamente'});
    },
    error: error => {
      this.vistaCarga = false;
    },
    complete: () => {
      this.vistaCarga = false;
      console.log('Request complete');
    }
  });
  }

}
