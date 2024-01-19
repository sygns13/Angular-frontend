import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import { IngresoSalidaCajaService } from '../../../_service/ingreso_salida_caja.service';
import { switchMap } from 'rxjs/operators';
import { ConfirmationService, MessageService} from 'primeng/api';
import { Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { IngresoSalidaCaja } from '../../../_model/ingreso_salida_caja';
import { LazyLoadEvent } from 'primeng/api';
import { Almacen } from 'src/app/_model/almacen';
import { AlmacenService } from '../../../_service/almacen.service';
import { GestionloteService } from 'src/app/_service/gestionlote.service';
import * as moment from 'moment';
import { FiltroGeneral } from 'src/app/_util/filtro_general';
import { ExportsService } from './../../../_service/reportes/exports.service';

@Component({
  selector: 'app-egresosotros',
  templateUrl: './egresosotros.component.html',
  styleUrls: ['./egresosotros.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class EgresosotrosComponent implements OnInit {

  @ViewChild('inputMonto', { static: false }) inputMonto: ElementRef;

  vistaRegistro: boolean = false;


  monto: number = null;
  concepto: string = '';
  comprobante: string = '';
  fecha: string = '';
  hora: string = '';
  clsTipo: any = {name: 'Ingreso', code: '1'};

  tipos: any[] = [
      {name: 'Ingreso', code: '1'},
      {name: 'Salida', code: '0'}
  ];

  clsAlmacen: any = {name: 'GENERAL (TODOS LOS LOCALES)', code: 0};
  clsAlmacen_registro: any = null;
  clsTipoComprobante: any =  {name: 'TODOS', code: 'Z'};

  tipoComprobantes: any[] = [
    {name: 'TODOS', code: 'Z'},
    {name: 'Movimiento Libre', code: '0'},
    {name: 'Factura', code: '1'},
    {name: 'Boleta', code: '2'},
    {name: 'Recibo por Honorarios', code: '3'},
  ];

  almacens: any[] = [];
  almacens_registo: any[] = [];


  ingresoSalidaCaja = new IngresoSalidaCaja();

  page: number = 0;
  first: number = 0;
  last: number = 0;
  rows: number = 10;

  isFirst: boolean = true;
  isLast: boolean = false;
  totalRecords: number = 0;
  numberElements: number = 0;

  ingresoSalidaCajas: any[] = [];

  msgs: Message[] = [];
  position: string;

  tipoFrm: string = 'Nuevo Movimiento de Dinero';
  vistaBotonRegistro : boolean = false;
  vistaBotonEdicion : boolean = false;
  vistaCarga : boolean = true;

  loading: boolean = true; 
  txtBuscar: string = '';
  
  //Init Almacen
  //almacen_id: number = 0;
  fechaBD: string = '';
  horaBD: string = '';

  fechaInicio: string = '';
  fechaFinal: string = '';

  filtroGeneral: FiltroGeneral = new FiltroGeneral();

  montoTotal: number = 0;


  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private ingresoSalidaCajaService:IngresoSalidaCajaService,
                private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService, 
                private almacenService: AlmacenService,
                private gestionloteService: GestionloteService,
                private exportsService: ExportsService) {
    this.breadcrumbService.setItems([
      { label: 'Reportes' },
      { label: 'Reporte de Egresos por Otros Conceptos', routerLink: ['/reporte/egresos-otros'] }
    ]);

}

  ngOnInit(): void {
    this.getAlmacenes();
    this.primengConfig.ripple = true;
    this.vistaCarga = false;
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
      //return this.ingresoSalidaCajas ? this.first > (this.ingresoSalidaCajas.length - this.rows): true;
      return this.isLast;
  }

  isFirstPage(): boolean {
      return this.isFirst;
  }

  setFocusMonto() {    

    this.changeDetectorRef.detectChanges();
    this.inputMonto.nativeElement.focus();

  }

  //Carga de Data
  /*
  listarMain() {

    this.ingresoSalidaCajaService.listar().subscribe(data => {
      
      this.ingresoSalidaCajas = data;
    });
  }*/

  getAlmacenes() {

    this.clsAlmacen_registro = null;
    this.almacens = [];
    this.almacens_registo = [];

    this.almacens.push({name: 'GENERAL (TODOS LOS LOCALES)', code: 0});
    this.clsAlmacen = {name: 'GENERAL (TODOS LOS LOCALES)', code: 0};

    this.gestionloteService.getAlmacensDate().subscribe(data => {

      this.fechaBD= data.fecha;
      //this.horaBD= data.hora;

      this.fechaInicio = data.fecha;
      this.fechaFinal = data.fecha;

      data.almacens.forEach(almacen => {
        this.almacens.push({name: almacen.nombre, code: almacen.id});
        this.almacens_registo.push({name: almacen.nombre, code: almacen.id});
      });

      this.evaluarFiltros();
      if(this.filtroGeneral.fechaInicio == null){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Inicio indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return;
      }
      if(this.filtroGeneral.fechaFinal == null){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha Final indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return;
      }
      this.listarPageMain(this.page, this.rows, this.clsAlmacen.code);
    });
  }


  cambioFiltros(event: Event){
    this.evaluarFiltros();
      if(this.filtroGeneral.fechaInicio == null){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Inicio indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return;
      }
      if(this.filtroGeneral.fechaFinal == null){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha Final indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return;
      }
    this.listarPageMain(this.page, this.rows, this.clsAlmacen.code);
  }

  evaluarFiltros(){

    this.filtroGeneral = new FiltroGeneral();
  
    if(this.clsAlmacen != null){
      this.filtroGeneral.almacenId = this.clsAlmacen.code;
    }
    else{
      this.filtroGeneral.almacenId = 0;
    }

    if(this.fechaInicio != null && this.fechaFinal != null && this.fechaInicio.length == 10 && this.fechaFinal.length == 10){
      const fechaIni = moment(this.fechaInicio, 'DD/MM/YYYY');
      const fechaFin = moment(this.fechaFinal, 'DD/MM/YYYY');
      if(fechaIni.isValid && fechaFin.isValid){
        this.filtroGeneral.fechaInicio = fechaIni.format('YYYY-MM-DD');
        this.filtroGeneral.fechaFinal = fechaFin.format('YYYY-MM-DD');
      }
      else{
        this.filtroGeneral.fechaInicio = null;
        this.filtroGeneral.fechaFinal = null;
      }
    } else{
      this.filtroGeneral.fechaInicio = null;
      this.filtroGeneral.fechaFinal = null;
    }

    if(this.clsTipoComprobante != null && this.clsTipoComprobante.code != "Z") {
      this.filtroGeneral.tipoComprobanteOtros = this.clsTipoComprobante.code;
    }
    else{
      this.filtroGeneral.tipoComprobanteOtros = null;
    }
  }

  loadData(event: LazyLoadEvent) { 
    this.loading = true; 
    this.rows = event.rows;
    this.page = event.first / this.rows;

    this.listarPageMain(this.page, this.rows, this.clsAlmacen.code);

  }

  listarPageMain(p: number, s:number, almacen_id: number = 0) {

    this.filtroGeneral.page = p;
    this.filtroGeneral.size = s;

    this.ingresoSalidaCajaService.getEgresosCaja(this.filtroGeneral).subscribe(data => {
      this.ingresoSalidaCajas = data.egresos.content;
      this.isFirst = data.egresos.first;
      this.isLast = data.egresos.last;
      this.numberElements = data.egresos.numberOfElements;
      this.first = (p * s);
      this.last = (p * s) + this.numberElements;
      this.totalRecords = data.egresos.totalElements;
      this.loading = false;

      this.montoTotal = data.montoTotal;
    });
  }

  exportarPDF(): void{
    this.evaluarFiltros();
      if(this.filtroGeneral.fechaInicio == null){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Inicio indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return;
      }
      if(this.filtroGeneral.fechaFinal == null){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha Final indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return;
      }
    this.printPDF();
  }

  exportarExcel(): void{
    this.evaluarFiltros();
      if(this.filtroGeneral.fechaInicio == null){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Inicio indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return;
      }
      if(this.filtroGeneral.fechaFinal == null){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha Final indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return;
      }
    this.printXLS();
  }

  printPDF(): void{
    this.exportsService.exportEgresosOtrosPDF(this.filtroGeneral).subscribe(data => {
  
      const file = new Blob([data], { type: 'application/pdf' });  
      const fileURL = URL.createObjectURL(file);
  
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = fileURL;
      a.download = 'EgresosOtros.pdf';
      a.click();
  
      //window.open(fileURL);
    });
  }

  printXLS(): void{
    this.exportsService.exportEgresosOtrosXLSX(this.filtroGeneral).subscribe(data => {
  
      const file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileURL = URL.createObjectURL(file);
  
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = fileURL;
      a.download = 'EgresosOtros.xlsx';
      a.click();
      //window.open(fileURL);
    });
  }



















  buscar(){
    this.page = 0;
    this.listarPageMain(this.page , this.rows, this.clsAlmacen.code);
  }

  //Funciones crud


  nuevo() {

    this.vistaBotonRegistro = true;
    this.vistaBotonEdicion = false;
    this.tipoFrm = 'Nuevo Movimiento de Dinero';
    this.vistaRegistro = true;

    this.cancelar();
  }

  cancelar() {

    this.ingresoSalidaCaja = new IngresoSalidaCaja();

    this.monto = null;
    this.concepto = '';
    this.comprobante= '';
    this.fecha = this.fechaBD;
    this.hora = this.horaBD;
    this.clsTipo = {name: 'Ingreso', code: '1'};

    this.clsAlmacen_registro = null;
    this.clsTipoComprobante =  {name: 'Movimiento Libre', code: '0'};

    this.setFocusMonto();
    
  }

  cerrar(){
    this.vistaRegistro = false;
  }

  /*
  {name: 'Ingreso', code: '1'},
      {name: 'Salida', code: '0'}


      {name: 'Movimiento Libre', code: '0'},
    {name: 'Factura', code: '1'},
    {name: 'Boleta', code: '2'},
    {name: 'Recibo por Honorarios', code: '3'},

      */

  editar(data:IngresoSalidaCaja){
    this.ingresoSalidaCaja = structuredClone(data);

    this.vistaBotonRegistro = false;
    this.vistaBotonEdicion = true;
    this.monto = this.ingresoSalidaCaja.monto;
    this.concepto = this.ingresoSalidaCaja.concepto;
    this.comprobante = this.ingresoSalidaCaja.comprobante;
    this.hora = this.ingresoSalidaCaja.hora;
    this.clsTipo =  (this.ingresoSalidaCaja.tipo === 1) ?  {name: "Ingreso", code: this.ingresoSalidaCaja.tipo} : {name: "Salida", code: this.ingresoSalidaCaja.tipo};

    if(this.ingresoSalidaCaja.tipoComprobante === 0){
      this.clsTipoComprobante = {name: "Movimiento Libre", code: this.ingresoSalidaCaja.tipoComprobante};
    }
    if(this.ingresoSalidaCaja.tipoComprobante === 1){
      this.clsTipoComprobante = {name: "Factura", code: this.ingresoSalidaCaja.tipoComprobante};
    }
    if(this.ingresoSalidaCaja.tipoComprobante === 2){
      this.clsTipoComprobante = {name: "Boleta", code: this.ingresoSalidaCaja.tipoComprobante};
    }
    if(this.ingresoSalidaCaja.tipoComprobante === 3){
      this.clsTipoComprobante = {name: "Recibo por Honorarios", code: this.ingresoSalidaCaja.tipoComprobante};
    }

    if(this.ingresoSalidaCaja.fecha != null){
      const fechaFormat = moment(this.ingresoSalidaCaja.fecha, 'YYYY-MM-DD');
      this.fecha = fechaFormat.format('DD/MM/YYYY');
    }

    this.clsAlmacen_registro =  (this.ingresoSalidaCaja.almacen != null) ?  {name: this.ingresoSalidaCaja.almacen.nombre, code: this.ingresoSalidaCaja.almacen.id} : null;


    this.tipoFrm = 'Editar Movimiento de Dinero';
    this.vistaRegistro = true;

    this.setFocusMonto();
  }

  eliminar(data:IngresoSalidaCaja, event: Event){
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
    this.ingresoSalidaCaja = new IngresoSalidaCaja();

    this.ingresoSalidaCaja.monto = this.monto;
    this.ingresoSalidaCaja.concepto = this.concepto.toString().trim();
    this.ingresoSalidaCaja.comprobante = this.comprobante.toString().trim();
    this.ingresoSalidaCaja.tipo = parseInt((this.clsTipo != null) ? this.clsTipo.code : null);
    this.ingresoSalidaCaja.tipoComprobante = parseInt((this.clsTipoComprobante != null) ? this.clsTipoComprobante.code : null);
    this.ingresoSalidaCaja.hora = this.hora;

    if(this.fecha != null &&  this.fecha.length == 10){
      const fechaFormatBD = moment(this.fecha, 'DD/MM/YYYY');
      if(!fechaFormatBD.isValid){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        this.vistaCarga = false;
        return false;
      }
      this.ingresoSalidaCaja.fecha = fechaFormatBD.format('YYYY-MM-DD');

      if(this.ingresoSalidaCaja.fecha == null || this.ingresoSalidaCaja.fecha.length != 10){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        this.vistaCarga = false;
        return false;
      }
    }
    else{
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        this.vistaCarga = false;
        return false;
    }

    let almacen = new Almacen();
    almacen.id = parseInt((this.clsAlmacen_registro != null) ? this.clsAlmacen_registro.code : null);
    this.ingresoSalidaCaja.almacen = almacen;

    /* this.ingresoSalidaCajaService.registrar(this.ingresoSalidaCaja).subscribe(() => {
      this.vistaCarga = false;
      this.loading = true; 
      this.cancelar();
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El IngresoSalidaCaja se ha registrado satisfactoriamente'});
   }); */
   this.ingresoSalidaCajaService.registrar(this.ingresoSalidaCaja).subscribe({
    next: c => {
      this.vistaCarga = false;
      this.loading = true; 
      this.cancelar();
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Movimiento de Dinero se ha registrado satisfactoriamente'});
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

  editarConfirmado(){
    this.vistaCarga = true;

    let ingresoSalidaCajaEdit = new IngresoSalidaCaja();
    ingresoSalidaCajaEdit = structuredClone(this.ingresoSalidaCaja);

    ingresoSalidaCajaEdit.monto = this.monto;
    ingresoSalidaCajaEdit.concepto = this.concepto.toString().trim();
    ingresoSalidaCajaEdit.comprobante = this.comprobante.toString().trim();
    ingresoSalidaCajaEdit.tipo = parseInt((this.clsTipo != null) ? this.clsTipo.code : null);
    ingresoSalidaCajaEdit.tipoComprobante = parseInt((this.clsTipoComprobante != null) ? this.clsTipoComprobante.code : null);
    ingresoSalidaCajaEdit.hora = this.hora;

    if(this.fecha != null &&  this.fecha.length == 10){
      const fechaFormatBD = moment(this.fecha, 'DD/MM/YYYY');
      if(!fechaFormatBD.isValid){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return false;
      }
      ingresoSalidaCajaEdit.fecha = fechaFormatBD.format('YYYY-MM-DD');

      if(ingresoSalidaCajaEdit.fecha == null || ingresoSalidaCajaEdit.fecha.length != 10){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return false;
      }
    }
    else{
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return false;
    }

    let almacen = new Almacen();
    almacen.id = parseInt((this.clsAlmacen_registro != null) ? this.clsAlmacen_registro.code : null);
    ingresoSalidaCajaEdit.almacen = almacen;

    this.ingresoSalidaCajaService.modificar(ingresoSalidaCajaEdit).subscribe({
      next: c => {
      this.loading = true; 
      this.vistaCarga = false;
      this.cancelar();
      this.cerrar();
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Movimiento de Dinero se ha editado satisfactoriamente'});
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

  eliminarConfirmado(data:IngresoSalidaCaja){
    this.vistaCarga = true;
    /* this.ingresoSalidaCajaService.eliminar(data.id).subscribe(() => {
      this.loading = true; 
      this.vistaCarga = false;
      if(this.numberElements <= 1 && this.page > 0){
        this.page--;
      }
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El IngresoSalidaCaja se ha eliminado satisfactoriamente'});
   }); */
   this.ingresoSalidaCajaService.eliminar(data.id).subscribe({
    next: c => {
      this.loading = true; 
      this.vistaCarga = false;
      if(this.numberElements <= 1 && this.page > 0){
        this.page--;
      }
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Movimiento de Dinero se ha eliminado satisfactoriamente'});
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