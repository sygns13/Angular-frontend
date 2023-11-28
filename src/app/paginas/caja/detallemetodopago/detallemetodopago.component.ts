import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import { DetalleMetodoPagoService } from '../../../_service/detalle_metodo_pago.service';
import { BancoService } from '../../../_service/banco.service';
import { TipoTarjetaService } from '../../../_service/tipo_tarjeta.service';
import { MetodoPagoService } from '../../../_service/metodo_pago.service';
import { switchMap } from 'rxjs/operators';
import { ConfirmationService, MessageService} from 'primeng/api';
import { Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { DetalleMetodoPago } from '../../../_model/detalle_metodo_pago';
import { Banco } from '../../../_model/banco';
import { MetodoPago } from '../../../_model/metodo_pago';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-detallemetodopago',
  templateUrl: './detallemetodopago.component.html',
  styleUrls: ['./detallemetodopago.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetallemetodopagoComponent {
  @ViewChild('inputnumeroCuenta', { static: false }) inputnumeroCuenta: ElementRef;
  @ViewChild('inputnumeroCelular', { static: false }) inputnumeroCelular: ElementRef;

  vistaRegistro: boolean = false;


  numeroCuenta: string = '';
  numeroCelular: string = '';

  clsBanco: any = null;
  clsMetodoPago: any = null;

  clsEstado: any = null;

  estados: any[] = [
      {name: 'Activo', code: '1'},
      {name: 'Inactivo', code: '0'}
  ];


  detalleMetodoPago = new DetalleMetodoPago();

  page: number = 0;
  first: number = 0;
  last: number = 0;
  rows: number = 10;

  isFirst: boolean = true;
  isLast: boolean = false;
  totalRecords: number = 0;
  numberElements: number = 0;

  detalleMetodoPagos: DetalleMetodoPago[] = [];

  msgs: Message[] = [];
  position: string;

  tipoFrm: String = 'Nuevo Método de Pago';
  vistaBotonRegistro : boolean = false;
  vistaBotonEdicion : boolean = false;
  vistaCarga : boolean = true;

  loading: boolean = true; 
  txtBuscar: String = '';

  banco_id: number = 0;
  metodos_pago_id: number = 0;

  bancos: any[] = [];
  metodoPagos: any[] = [];

  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService,
    private detalleMetodoPagoService: DetalleMetodoPagoService, private bancoService: BancoService,
    private metodoPagoService:MetodoPagoService) {
      this.breadcrumbService.setItems([
      { label: 'Caja' },
      { label: 'Config Métodos de Pago', routerLink: ['/caja/metodos-pagos'] }
      ]);
    }

    ngOnInit(): void {
      this.getBancos();
      this.getMetodoPagos();
      this.listarPageMain(this.page, this.rows, this.metodos_pago_id, this.banco_id);
      this.primengConfig.ripple = true;
      this.vistaCarga = false;
    }
  
    next() {
      this.page++;
      this.listarPageMain(this.page, this.rows, this.metodos_pago_id, this.banco_id);
    }
  
    prev() {
        this.page--;
        this.listarPageMain(this.page, this.rows, this.metodos_pago_id, this.banco_id);
    }
  
    reset() {
        this.first = 0;
        this.listarPageMain(this.page, this.rows, this.metodos_pago_id, this.banco_id);
    }
  
    isLastPage(): boolean {
        //return this.bancos ? this.first > (this.bancos.length - this.rows): true;
        return this.isLast;
    }
  
    isFirstPage(): boolean {
        return this.isFirst;
    }
  
    setFocusNumeroCuenta() {    
      this.changeDetectorRef.detectChanges();
      this.inputnumeroCuenta.nativeElement.focus();
    }

    setFocusNumeroCelular() {    
      this.changeDetectorRef.detectChanges();
      this.inputnumeroCelular.nativeElement.focus();
    }
  
    //Carga de Data
    /*
    listarMain() {
  
      this.bancoService.listar().subscribe(data => {
        
        this.bancos = data;
      });
    }*/
  
    getBancos() {
  
      this.clsBanco = null;
      this.bancos = [];
  
      this.bancoService.listarAll().subscribe(data => {
        data.forEach(banco => {
          this.bancos.push({name: banco.nombre, code: banco.id});
        });
      });
    }
    getMetodoPagos() {
  
      this.clsMetodoPago = null;
      this.metodoPagos = [];
  
      //this.metodoPagos.push({name: 'GENERAL (TODOS LOS LOCALES)', code: 0});
  
      this.metodoPagoService.listarAll().subscribe(data => {
        data.forEach(metodoPago => {
          if(metodoPago.tipoId == 'WT' || metodoPago.tipoId == 'EW'){
            this.metodoPagos.push({name: metodoPago.nombre, code: metodoPago.id, tipoId: metodoPago.tipoId});
          }
        });
      });
    }
  
    loadData(event: LazyLoadEvent) { 
      this.loading = true; 
      this.rows = event.rows;
      this.page = event.first / this.rows;
  
      this.listarPageMain(this.page, this.rows, this.metodos_pago_id, this.banco_id);
  
    }
  
    listarPageMain(p: number, s:number, metodos_pago_id:number, banco_id:number) {
  
      this.detalleMetodoPagoService.listarPageable(p, s, this.txtBuscar, metodos_pago_id, banco_id).subscribe(data => {
        this.detalleMetodoPagos = data.content;
        this.isFirst = data.first;
        this.isLast = data.last;
        this.numberElements = data.numberOfElements;
        this.first = (p * s);
        this.last = (p * s) + this.numberElements;
        this.totalRecords = data.totalElements;
        this.loading = false;
      });
    }
  
    buscar(){
      this.page = 0;
      this.listarPageMain(this.page , this.rows, this.metodos_pago_id, this.banco_id);
    }
  
    //Funciones crud
  
  
    nuevo() {
  
      this.vistaBotonRegistro = true;
      this.vistaBotonEdicion = false;
      this.tipoFrm = 'Nuevo Método de Pago' 
      this.vistaRegistro = true;
  
      this.cancelar();
    }
  
    cancelar() {
  
      this.detalleMetodoPago = new DetalleMetodoPago();

      this.numeroCuenta = '';
      this.numeroCelular = '';

      this.clsBanco = null;
      this.clsMetodoPago = null;
  
      this.clsEstado = null;
  
      //this.setFocusLetraSerie();
      
    }
  
    cerrar(){
      this.vistaRegistro = false;
    }
  
    editar(data:DetalleMetodoPago){
      this.detalleMetodoPago = data;
  
      this.vistaBotonRegistro = false;
      this.vistaBotonEdicion = true;
      this.numeroCuenta = this.detalleMetodoPago.numeroCuenta;
      this.numeroCelular = this.detalleMetodoPago.numeroCelular;
  
      this.clsBanco = {name: this.detalleMetodoPago.banco.nombre, code: this.detalleMetodoPago.banco.id};
      this.clsMetodoPago = {name: this.detalleMetodoPago.metodoPago.nombre, code: this.detalleMetodoPago.metodoPago.id, tipoId: this.detalleMetodoPago.metodoPago.tipoId};
  
      //console.log(this.detalleMetodoPago);
  
      this.clsEstado =  (this.detalleMetodoPago.activo === 1) ?  {name: "Activo", code: this.detalleMetodoPago.activo} : {name: "Inactivo", code: this.detalleMetodoPago.activo};
      this.tipoFrm = 'Editar Método de Pago' 
      this.vistaRegistro = true;
  
      //this.setFocusLetraSerie();
      //console.log(this.clsMetodoPago);
    }
  
    eliminar(data:DetalleMetodoPago, event: Event){
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
  
  
    registrar(event: Event) {
      this.confirmationService.confirm({
          key: 'confirmDialog',
          target: event.target,
          message: '¿Está seguro de Registrar?',
          icon: 'pi pi-info-circle',
          header: 'Confirmación Registro',
          accept: () => {
            //this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
           // this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have accepted'});
           this.registrarConfirmado();
          },
          reject: () => {
           // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
          }
      });
    }
  
    modificar(event: Event) {
      this.confirmationService.confirm({
          key: 'confirmDialog',
          target: event.target,
          message: '¿Está seguro de Editar?',
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
  
  
    registrarConfirmado(){
      
      this.vistaCarga = true;
  
      let bancoBase = new Banco();
      let metodoPagoBase = new MetodoPago();

      //console.log(this.clsMetodoPago);
      //console.log(this.clsMetodoPago != null);
  
      bancoBase.id = parseInt(this.clsBanco != null && this.clsBanco.code != null ? this.clsBanco.code : "0");
      metodoPagoBase.id = parseInt(this.clsMetodoPago != null && this.clsMetodoPago.code != null ? this.clsMetodoPago.code : "0");
      metodoPagoBase.tipoId = this.clsMetodoPago != null && this.clsMetodoPago.tipoId != null ? this.clsMetodoPago.tipoId : "";
  
      this.detalleMetodoPago.banco = bancoBase;
      this.detalleMetodoPago.metodoPago = metodoPagoBase;
  
      this.detalleMetodoPago.bancoId = bancoBase.id;
      this.detalleMetodoPago.numeroCuenta = this.numeroCuenta != null ? this.numeroCuenta.toString().trim() : '';
      this.detalleMetodoPago.numeroCelular = this.numeroCelular != null ? this.numeroCelular.toString().trim() : '';
  
  
      this.detalleMetodoPago.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");
  
     this.detalleMetodoPagoService.registrar(this.detalleMetodoPago).subscribe({
      next: c => {
        this.vistaCarga = false;
        this.loading = true; 
        this.cancelar();
        this.cerrar();
        this.listarPageMain(this.page, this.rows, this.metodos_pago_id, this.banco_id);
        this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Método de Pago se ha registrado satisfactoriamente'});
      },
      error: error => {
        //console.log('Error complete');
        this.vistaCarga = false;
      },
      complete: () => {
        this.vistaCarga = false;
        //console.log('Request complete');
      }
    });
    }
  
    editarConfirmado(){
      this.vistaCarga = true;
  
      let detalleMetodoPagoEdit = new DetalleMetodoPago();
      detalleMetodoPagoEdit = JSON.parse(JSON.stringify(this.detalleMetodoPago));
  
      let bancoBase = new Banco();
      let metodoPagoBase = new MetodoPago();
  
      bancoBase.id = parseInt(this.clsBanco != null && this.clsBanco.code != null ? this.clsBanco.code : "0");
      metodoPagoBase.id = parseInt(this.clsMetodoPago != null && this.clsMetodoPago.code != null ? this.clsMetodoPago.code : "0");
      metodoPagoBase.tipoId = this.clsMetodoPago != null && this.clsMetodoPago.tipoId != null ? this.clsMetodoPago.tipoId : "";
  
      detalleMetodoPagoEdit.banco = bancoBase;
      detalleMetodoPagoEdit.metodoPago = metodoPagoBase;

      detalleMetodoPagoEdit.bancoId = bancoBase.id;

      detalleMetodoPagoEdit.numeroCuenta = this.numeroCuenta != null ? this.numeroCuenta.toString().trim() : '';
      detalleMetodoPagoEdit.numeroCelular = this.numeroCelular != null ? this.numeroCelular.toString().trim() : '';
  
      detalleMetodoPagoEdit.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");
  
  
      this.detalleMetodoPagoService.modificar(detalleMetodoPagoEdit).subscribe({
        next: c => {
        this.loading = true; 
        this.vistaCarga = false;
        this.cancelar();
        this.cerrar();
        this.listarPageMain(this.page, this.rows, this.metodos_pago_id, this.banco_id);
        this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Método de Pago se ha editado satisfactoriamente'});
      },
      error: error => {
        //console.log('Error complete');
        this.vistaCarga = false;
      },
      complete: () => {
        this.vistaCarga = false;
        //console.log('Request complete');
      }
    });
    }
  
    eliminarConfirmado(data:DetalleMetodoPago){
      this.vistaCarga = true;
      /* this.bancoService.eliminar(data.id).subscribe(() => {
        this.loading = true; 
        this.vistaCarga = false;
        if(this.numberElements <= 1 && this.page > 0){
          this.page--;
        }
        this.listarPageMain(this.page, this.rows);
        this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Banco se ha eliminado satisfactoriamente'});
     }); */
     this.detalleMetodoPagoService.eliminar(data.id).subscribe({
      next: c => {
        this.loading = true; 
        this.vistaCarga = false;
        if(this.numberElements <= 1 && this.page > 0){
          this.page--;
        }
        this.listarPageMain(this.page, this.rows, this.metodos_pago_id, this.banco_id);
        this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Método de Pago se ha eliminado satisfactoriamente'});
      },
      error: error => {
        this.vistaCarga = false;
      },
      complete: () => {
        this.vistaCarga = false;
        //console.log('Request complete');
      }
    });
    }
    
  
    alta(data:DetalleMetodoPago, event: Event){
      this.confirmationService.confirm({
        key: 'confirmDialog',
        target: event.target,
        message: '¿Está seguro de Activar el Método de Pago?',
        icon: 'pi pi-exclamation-triangle',
        header: 'Confirmación Activación',
        accept: () => {
          let msj : string = 'El Método de Pago se ha activado satisfactoriamente';
          let valor: number = 1;
          this.altaBaja(data, valor, msj);
          },
          reject: () => {
          }
      });
      
    }
  
    baja(data:DetalleMetodoPago, event: Event){
      this.confirmationService.confirm({
        key: 'confirmDialog',
        target: event.target,
        message: '¿Está seguro de Desactivar el Método de Pago?',
        icon: 'pi pi-exclamation-triangle',
        header: 'Confirmación Desactivación',
        accept: () => {
          let msj : string = 'El Método de Pago se ha desactivado satisfactoriamente';
          let valor: number = 0;
          this.altaBaja(data, valor, msj);
          },
          reject: () => {
          }
      });
      
    }
  
    /*
    altaBaja(data:Banco, valor: number, msj: string){
      //this.vistaCarga = true;
      
      this.bancoService.altaBaja(data.id, valor).pipe(switchMap(() => {
        return this.bancoService.listar();
      })).subscribe(data => {
        this.messageService.add({severity:'success', summary:'Confirmado', detail: msj});
        this.bancos = data;
        //this.vistaCarga = false;
      });
  
    }*/
  
    altaBaja(data:DetalleMetodoPago, valor: number, msj: string){
      this.vistaCarga = true;
      this.detalleMetodoPagoService.altaBaja(data.id, valor).subscribe({
        next: c => {
         this.loading = true; 
         this.vistaCarga = false;
         this.listarPageMain(this.page, this.rows, this.metodos_pago_id, this.banco_id);
         this.messageService.add({severity:'success', summary:'Confirmado', detail: msj});
        },
        error: error => {
          this.vistaCarga = false;
        },
        complete: () => {
          this.vistaCarga = false;
          //console.log('Request complete');
        }
      });
  
    }


}
