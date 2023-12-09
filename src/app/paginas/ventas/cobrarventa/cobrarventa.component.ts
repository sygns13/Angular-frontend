import { Component, OnInit, Input, Output, EventEmitter,  ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Venta } from './../../../_model/venta';
import { VentaService } from './../../../_service/venta.service';
import { MetodoPagoService } from '../../../_service/metodo_pago.service';
import { BancoService } from '../../../_service/banco.service';
import { TipoTarjetaService } from '../../../_service/tipo_tarjeta.service';
import { DetalleMetodoPagoService } from '../../../_service/detalle_metodo_pago.service';
import { CobroVentaService } from '../../../_service/cobro_venta.service';
import { AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import { ConfirmationService, MessageService} from 'primeng/api';
import { Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';
import { PassfechavistaPipe } from './../../../_pipes/passfechavista.pipe';
import { OnlydecimalesPipe } from './../../../_pipes/onlydecimales.pipe';
import { CobroVenta } from './../../../_model/cobro_venta';
import { MetodoPago } from '../../../_model/metodo_pago';
import * as moment from 'moment';

@Component({
  selector: 'app-cobrarventa',
  templateUrl: './cobrarventa.component.html',
  styleUrls: ['./cobrarventa.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CobrarventaComponent implements OnInit{

  @Input() venta: Venta;
  @Output() cerrarFormCobrarVenta = new EventEmitter<Venta>();

  @ViewChild('inputmontoAbonado', { static: false }) inputmontoAbonado: ElementRef;

  message: string = "valor1";
  vistaCarga: boolean = false;

  billData: any[];
  billCols: any[];

  pagosVenta: any[] = [];

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

  cobroVenta: CobroVenta = new CobroVenta();
  fecha: string = '';
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

  montoAbonado: number = null;


  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private ventaService: VentaService, 
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService,
    private onlydecimalesPipe: OnlydecimalesPipe, private currencyPipe:CurrencyPipe, private passfechavistaPipe: PassfechavistaPipe,
    private metodoPagoService:MetodoPagoService,
    private bancoService: BancoService,
    private detalleMetodoPagoService: DetalleMetodoPagoService,
    private cobroVentaService: CobroVentaService,
    private tipoTarjetaService: TipoTarjetaService) {
    this.breadcrumbService.setItems([
      { label: 'Ventas' },
      { label: 'Cuentas por Cobrar', routerLink: ['/ventas/cobrar'] }
    ]);
  }

  ngOnInit(): void {
    /* this.getTipoProductos();
    this.getMarcas();
    this.getPresentaciones(); */
    //this.getVenta()
    this.primengConfig.ripple = true;
    this.vistaCarga = false;
    //this.setFocusBuscar();
    this.getVenta();
    this.listarPageMain(this.page, this.rows);
  }

  cerrarFormulario(){
    this.cerrarFormCobrarVenta.emit(this.venta);
  }

  //Carga de Data
  getVenta(): void {
    this.ventaService.listarPorId(this.venta.id).subscribe(data => {
      if(data != null && data.id != null){
        this.venta = data;
        this.renderHeaders();
      }
    });
  }

  renderHeaders(): void{
    this.billData = [
      {
          'cliente': this.venta.cliente != null ? this.venta.cliente.nombre : "",
          'documento': this.venta.cliente != null ? this.venta.cliente.tipoDocumento.tipo + ": " + this.venta.cliente.documento  : "",
          'comprobante': this.venta.comprobante != null ? this.venta.comprobante.initComprobante.tipoComprobante.nombre + " " + this.venta.comprobante.serie + "-" + this.venta.comprobante.numero : "",
          'fecha': this.passfechavistaPipe.transform(this.venta.fecha) + " - " + this.venta.hora,
          'importe': this.currencyPipe.transform(this.venta.importeTotal, "PEN" , "S/."),
      }
    ];

  this.billCols = [
      { field: 'cliente', header: 'Cliente' },
      { field: 'documento', header: 'Documento de Identidad' },
      { field: 'comprobante', header: 'Comprobante' },
      { field: 'fecha', header: 'Fecha y hora' },
      { field: 'importe', header: 'Importe de Venta' },
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
  
    this.ventaService.getPagosVentas(this.venta.id, p ,s).subscribe(data => {
      this.pagosVenta = data.content;
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
      this.buscarCelulares();
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
        if(isFirst){
          this.clsBanco = {name: banco.nombre, code: banco.id};
          this.buscarCuentas();
          isFirst = false;
        }
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

    this.montoAbonado = this.venta.montoPorCobrar;
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
    this.cobroVenta = new CobroVenta();
    let metodoPago = new MetodoPago();

    let metodoPagoId = parseInt((this.clsMetodoPago != null) ? this.clsMetodoPago.code : "0");
    let tipoId = this.clsMetodoPago != null ? this.clsMetodoPago.tipoId : "";
    let metodoPagoName = this.clsMetodoPago != null ? this.clsMetodoPago.name : "";

    metodoPago.id = metodoPagoId;
    metodoPago.tipoId = tipoId;
    metodoPago.nombre = metodoPagoName;

    this.cobroVenta.venta = this.venta;
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
    this.cobroVenta.fecha = this.fecha;

    const fechaMoment = moment(this.fecha, 'DD/MM/YYYY');
      if(!fechaMoment.isValid){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return;
      }
      this.cobroVenta.fecha = fechaMoment.format('YYYY-MM-DD');

    this.vistaCarga = true;
    this.cobroVentaService.registrar(this.cobroVenta).subscribe({
      next: c => {
        this.vistaCarga = false;
        this.loading = true; 
        this.cancelar();
        this.displayConfirmarPago = false;
        this.listarPageMain(this.page, this.rows);
        this.getVenta();
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


  editar(data:CobroVenta): void{

    this.cobroVenta = data;
    this.clsMetodoPago = null;
    this.metodoPagos = [];

    this.metodoPagoService.listarAll().subscribe(data => {
      data.forEach(metodoPago => {
          this.metodoPagos.push({name: metodoPago.nombre, code: metodoPago.id, tipoId: metodoPago.tipoId});
      });

      this.clsMetodoPago =  (this.cobroVenta.metodoPago != null) ?  {name: this.cobroVenta.metodoPago.nombre, code: this.cobroVenta.metodoPago.id, tipoId: this.cobroVenta.metodoPago.tipoId} : null;

      let metodos_pago_id = parseInt((this.clsMetodoPago != null) ? this.clsMetodoPago.code : "0");

      this.clsBanco = null;
      this.bancos = [];
      this.numeroOperacion = '';

      this.bancoService.listarAll().subscribe(data => {
        data.forEach(banco => {
          this.bancos.push({name: banco.nombre, code: banco.id});

          if(this.cobroVenta.banco != null && banco.nombre == this.cobroVenta.banco){
                this.clsBanco = {name: banco.nombre, code: banco.id};
                this.clsNumeroCuenta = null;
                this.numeroCuentas = [];
                let banco_id = parseInt((this.clsBanco != null) ? this.clsBanco.code : "0");
  
                this.detalleMetodoPagoService.listarAll(metodos_pago_id, banco_id).subscribe(data => {
                  data.forEach(numeroCuenta => {
                    this.numeroCuentas.push({name: numeroCuenta.numeroCuenta, code: numeroCuenta.id});
                    if(this.cobroVenta.numeroCuenta != null && numeroCuenta.numeroCuenta == this.cobroVenta.numeroCuenta){
                      this.clsNumeroCuenta = {name: numeroCuenta.numeroCuenta, code: numeroCuenta.id};
                    }
                  });
                }); 
            } 
        });
      });

      
        this.tipoTarjetas = [];
        this.tipoTarjetaService.listarAll().subscribe(data => {
          data.forEach(data => {
            this.tipoTarjetas.push({name: data.nombre, code: data.id, sigla: data.sigla});
            if(this.cobroVenta.tipoTarjeta != null && data.nombre == this.cobroVenta.tipoTarjeta){
              this.clsTipoTarjeta = {name: data.nombre, code: data.id, sigla: data.sigla};
            }
          });
        });
      

      if(this.cobroVenta.numeroTarjeta != null){
        this.numeroTarjeta = this.cobroVenta.numeroTarjeta;
      }

      if(this.cobroVenta.numeroCheque != null){
        this.numeroCheque = this.cobroVenta.numeroCheque;
      }

      if(this.cobroVenta.codigoOperacion != null){
        this.numeroOperacion = this.cobroVenta.codigoOperacion;
      }

      this.numeroCelulares = [];
      this.detalleMetodoPagoService.listarAll(metodos_pago_id, 0).subscribe(data => {
        data.forEach(data => {
          this.numeroCelulares.push({name: data.numeroCelular, code: data.id});
          if(this.cobroVenta.numeroCelular != null && data.numeroCelular == this.cobroVenta.numeroCelular){
            this.clsNumeroCelular = {name: data.numeroCelular, code: data.id};
          }
        });
      });

    });

    

    if(this.cobroVenta.fecha != null){
      const fechaMoment = moment(this.cobroVenta.fecha, 'YYYY-MM-DD');
      this.fecha = fechaMoment.format('DD/MM/YYYY');
    }

    if(this.cobroVenta.importe != null){
      this.montoAbonado = this.cobroVenta.importe;
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

    let cobrarVentaEdit = new CobroVenta();
    cobrarVentaEdit = structuredClone(this.cobroVenta);

    let metodoPago = new MetodoPago();

    let metodoPagoId = parseInt((this.clsMetodoPago != null) ? this.clsMetodoPago.code : "0");
    let tipoId = this.clsMetodoPago != null ? this.clsMetodoPago.tipoId : "";
    let metodoPagoName = this.clsMetodoPago != null ? this.clsMetodoPago.name : "";

    metodoPago.id = metodoPagoId;
    metodoPago.tipoId = tipoId;
    metodoPago.nombre = metodoPagoName;

    cobrarVentaEdit.venta = this.venta;
    cobrarVentaEdit.importe = this.montoAbonado;

    let tipoTarjeta = this.clsTipoTarjeta != null ? this.clsTipoTarjeta.name : "";
    let siglaTarjeta = this.clsTipoTarjeta != null ? this.clsTipoTarjeta.sigla : "";

    let banco = this.clsBanco != null ? this.clsBanco.name : "";
    let numeroCuenta = this.clsNumeroCuenta != null ? this.clsNumeroCuenta.name : "";
    let numeroCelular = this.clsNumeroCelular != null ? this.clsNumeroCelular.name : "";

    let initComprobanteId = parseInt((this.clsSerieComprobante != null) ? this.clsSerieComprobante.code : "0");

    cobrarVentaEdit.tipoTarjeta = tipoTarjeta;
    cobrarVentaEdit.siglaTarjeta = siglaTarjeta;
    cobrarVentaEdit.numeroTarjeta = this.numeroTarjeta;
    cobrarVentaEdit.banco = banco;
    cobrarVentaEdit.numeroCuenta = numeroCuenta;
    cobrarVentaEdit.numeroCelular = numeroCelular;
    cobrarVentaEdit.numeroCheque = this.numeroCheque;
    cobrarVentaEdit.codigoOperacion = this.numeroOperacion;
    cobrarVentaEdit.initComprobanteId = initComprobanteId;
    cobrarVentaEdit.metodoPago = metodoPago;
    cobrarVentaEdit.fecha = this.fecha;

    const fechaMoment = moment(this.fecha, 'DD/MM/YYYY');
      if(!fechaMoment.isValid){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return;
      }
      cobrarVentaEdit.fecha = fechaMoment.format('YYYY-MM-DD');

    this.vistaCarga = true;
    this.cobroVentaService.modificar(cobrarVentaEdit).subscribe({
      next: c => {
        this.vistaCarga = false;
        this.loading = true; 
        this.cancelar();
        this.displayConfirmarPago = false;
        this.listarPageMain(this.page, this.rows);
        this.getVenta();
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

  eliminar(data:CobroVenta, event: Event){
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

  eliminarConfirmado(data:CobroVenta){
    this.vistaCarga = true;
   this.cobroVentaService.eliminar(data.id).subscribe({
    next: c => {
      this.loading = true; 
      this.vistaCarga = false;
      if(this.numberElements <= 1 && this.page > 0){
        this.page--;
      }
      this.listarPageMain(this.page, this.rows);
      this.getVenta();
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
