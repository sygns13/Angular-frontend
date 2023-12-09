import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import {AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import {PresentacionService } from '../../../_service/presentacion.service';
import { switchMap } from 'rxjs/operators';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import {Presentacion } from '../../../_model/presentacion';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class PresentacionComponent implements OnInit {

  @ViewChild('inputPresentacion', { static: false }) inputPresentacion: ElementRef;

  vistaRegistro: boolean = false;


  presentacion: String = '';
  clsEstado: any = null;

  estados: any[] = [
      {name: 'Activo', code: '1'},
      {name: 'Inactivo', code: '0'}
  ];


  presentacionClass = new Presentacion();

  page: number = 0;
  first: number = 0;
  last: number = 0;
  rows: number = 10;

  isFirst: boolean = true;
  isLast: boolean = false;
  totalRecords: number = 0;
  numberElements: number = 0;

  presentacions: any[] = [];

  msgs: Message[] = [];
  position: string;

  tipoFrm: String = 'Nueva Presentación';
  vistaBotonRegistro : boolean = false;
  vistaBotonEdicion : boolean = false;
  vistaCarga : boolean = true;

  loading: boolean = true; 
  txtBuscar: String = '';


  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private presentacionService:PresentacionService,
                private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService) {
    this.breadcrumbService.setItems([
        { label: 'Tablas Base' },
        { label: 'Gestión de Presentaciones de Productos', routerLink: ['/tablas/presentaciones'] }
    ]);

}

  ngOnInit(): void {
    this.listarPageMain(this.page, this.rows);
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
      //return this.bancos ? this.first > (this.bancos.length - this.rows): true;
      return this.isLast;
  }

  isFirstPage(): boolean {
      return this.isFirst;
  }

  setFocusTipo() {    

    this.changeDetectorRef.detectChanges();
    this.inputPresentacion.nativeElement.focus();

  }

  //Carga de Data
/*
  listarMain() {

    this.presentacionService.listar().subscribe(data => {
      
      this.presentacions = data;
    });
  }*/

  loadData(event: LazyLoadEvent) { 
    this.loading = true; 
    this.rows = event.rows;
    this.page = event.first / this.rows;

    this.listarPageMain(this.page, this.rows);

  }

  listarPageMain(p: number, s:number) {

    this.presentacionService.listarPageable(p, s, this.txtBuscar).subscribe(data => {
      this.presentacions = data.content;
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
    this.listarPageMain(this.page , this.rows);
  }

  //Funciones crud


  nuevo() {

    this.vistaBotonRegistro = true;
    this.vistaBotonEdicion = false;
    
    this.tipoFrm = 'Nueva Presentación' 
    this.vistaRegistro = true;

    this.cancelar();
  }

  cancelar() {

    this.presentacionClass = new Presentacion();

    this.presentacion = '';
    this.clsEstado = null;

    this.setFocusTipo();
    
  }

  cerrar(){
    this.vistaRegistro = false;

  }

  editar(data:Presentacion){
    this.presentacionClass = data;

    this.vistaBotonRegistro = false;
    this.vistaBotonEdicion = true;

    this.presentacion = this.presentacionClass.presentacion;
    this.clsEstado =  (this.presentacionClass.activo === 1) ?  {name: "Activo", code: this.presentacionClass.activo} : {name: "Inactivo", code: this.presentacionClass.activo};

    this.tipoFrm = 'Editar Presentación' 

    this.vistaRegistro = true;

    this.setFocusTipo();
  }

  eliminar(data:Presentacion, event: Event){
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

    this.presentacionClass.presentacion = this.presentacion.toString().trim();
    this.presentacionClass.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");

    this.presentacionService.registrar(this.presentacionClass).subscribe({
      next: (data) => {
      this.vistaCarga = false;
      this.loading = true; 
      this.cancelar();
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'La Presentación se ha registrado satisfactoriamente'});
    },
    error: (err) => {
      this.vistaCarga = false;
      console.log(err);
    }        
  });
  

  }

  editarConfirmado(){
    this.vistaCarga = true;

    let presentacionEdit = new Presentacion();
    presentacionEdit = structuredClone(this.presentacionClass);

    presentacionEdit.presentacion = this.presentacion.toString().trim();
    presentacionEdit.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");

    this.presentacionService.modificar(presentacionEdit).subscribe({
      next: (data) => {
      this.loading = true; 
      this.vistaCarga = false;
      this.cancelar();
      this.cerrar();
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'La Presentación se ha editado satisfactoriamente'});
    },
    error: (err) => {
      this.vistaCarga = false;
      console.log(err);
    }        
  });
  

  }

  eliminarConfirmado(data:Presentacion){
    this.vistaCarga = true;
    this.presentacionService.eliminar(data.id).subscribe({
      next: (data) => {
      this.loading = true; 
      this.vistaCarga = false;
      if(this.numberElements <= 1 && this.page > 0){
        this.page--;
      }
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'La Presentación se ha eliminado satisfactoriamente'});
    },
    error: (err) => {
      this.vistaCarga = false;
      console.log(err);
    }        
  });
  

  }


  alta(data:Presentacion, event: Event){
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Está seguro de Activar la presentación?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Activación',
      accept: () => {
        let msj : string = 'La Presentación se ha activado satisfactoriamente';
        let valor: number = 1;
       this.altaBaja(data, valor, msj);
      },
      reject: () => {
      }
  });
    
  }

  baja(data:Presentacion, event: Event){
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Está seguro de Desactivar la presentación?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Desactivación',
      accept: () => {
        let msj : string = 'La Presentación se ha desactivado satisfactoriamente';
        let valor: number = 0;
        this.altaBaja(data, valor, msj);
      },
      reject: () => {
      }
  });
    
  }

  altaBaja(data:Presentacion, valor: number, msj: string){
    this.vistaCarga = true;
    
    this.presentacionService.altaBaja(data.id, valor).subscribe({
      next: (data) => {
      this.loading = true; 
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: msj});
    },
    error: (err) => {
      this.vistaCarga = false;
      console.log(err);
    }        
  });
  

  }

}
