import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import {AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';

import { switchMap } from 'rxjs/operators';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';

import { ProveedorService } from './../../../_service/proveedor.service';
import { Proveedor } from './../../../_model/proveedor';
import { TipoDocumento } from './../../../_model/tipo_documento';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProveedorComponent implements OnInit {

  @ViewChild('inputNombre', { static: false }) inputNombre: ElementRef;

  vistaRegistro: boolean = false;
  tipoDocumentos: any[] = [];

  clsTipoDocumento: any = null;
  nombre: string = '';
  tipo_documento_id: number = null;
  documento: string = '';
  direccion: string = '';
  telefono: string = '';
  anexo: string = '';
  celular: string = '';
  responsable: string = '';

  proveedor = new Proveedor();

  proveedors: any[] = [];

  page: number = 0;
  first: number = 0;
  last: number = 0;
  rows: number = 10;

  isFirst: boolean = true;
  isLast: boolean = false;
  totalRecords: number = 0;
  numberElements: number = 0;

  msgs: Message[] = [];
  position: string;

  tipoFrm: String = 'Nuevo Proveedor';
  vistaBotonRegistro : boolean = false;
  vistaBotonEdicion : boolean = false;
  vistaCarga : boolean = true;

  loading: boolean = true; 
  txtBuscar: String = '';

  //selectedProveedor: Proveedor;

  message:string;

  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private proveedorService: ProveedorService,
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService) {
    this.breadcrumbService.setItems([
    { label: 'Ventas' },
    { label: 'Registro de Proveedors', routerLink: ['/ventas/proveedors'] }
    ]);

}

ngOnInit(): void {
  this.getTipoDocumentos();
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

setFocusNombre() {    

  this.changeDetectorRef.detectChanges();
  this.inputNombre.nativeElement.focus();

}

//Carga de Data

getTipoDocumentos() {

  this.clsTipoDocumento = null;
  this.tipoDocumentos = [];

  this.proveedorService.getTipoDocumentos().subscribe(data => {
    data.forEach(tipoDoc => {
      this.tipoDocumentos.push({name: tipoDoc.tipo, code: tipoDoc.id});
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

  this.proveedorService.listarPageable(p, s, this.txtBuscar).subscribe(data => {
    this.proveedors = data.content;
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

nuevo() {

  this.vistaBotonRegistro = true;
  this.vistaBotonEdicion = false;
  
  this.tipoFrm = 'Nuevo Proveedor' 
  this.vistaRegistro = true;

  this.cancelar();
}

cancelar() {

  this.proveedor = new Proveedor();

  this.clsTipoDocumento = null;
  this.nombre = '';
  this.tipo_documento_id = null;
  this.documento = '';
  this.direccion = '';
  this.telefono = '';
  this.anexo = '';
  this.celular = '';
  this.responsable = '';

  this.setFocusNombre();
  
}

cerrar(){
  this.vistaRegistro = false;

}

editar(data: Proveedor, event: Event){
  this.proveedor = data;

  this.vistaBotonRegistro = false;
  this.vistaBotonEdicion = true;

  this.clsTipoDocumento = {name: this.proveedor.tipoDocumento.tipo, code: this.proveedor.tipoDocumento.id};

  this.nombre = this.proveedor.nombre;
  this.documento = this.proveedor.documento;
  this.direccion = this.proveedor.direccion;
  this.telefono = this.proveedor.telefono;
  this.anexo = this.proveedor.anexo;
  this.celular = this.proveedor.celular;
  this.responsable = this.proveedor.responsable;


  this.tipoFrm = 'Editar Proveedor' 

  this.vistaRegistro = true;

  this.setFocusNombre();

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

eliminar(data:Proveedor, event: Event){
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

registrarConfirmado(){
    
  this.vistaCarga = true;

  let tipoDocumentoBase = new TipoDocumento();

  tipoDocumentoBase.id = parseInt((this.clsTipoDocumento != null) ? this.clsTipoDocumento.code : "0");


  this.proveedor.nombre = this.nombre.toString().trim();
  this.proveedor.tipoDocumento = tipoDocumentoBase;
  this.proveedor.documento = this.documento;
  this.proveedor.direccion = this.direccion;
  this.proveedor.telefono = this.telefono;
  this.proveedor.anexo = this.anexo;
  this.proveedor.celular = this.celular;
  this.proveedor.responsable = this.responsable;


  this.proveedorService.registrar(this.proveedor).subscribe({
    next: (data) => {
    this.vistaCarga = false;
    this.loading = true; 
    this.cancelar();
    this.listarPageMain(this.page, this.rows);
    this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Proveedor se ha registrado satisfactoriamente'});
  },
  error: (err) => {
    this.vistaCarga = false;
    console.log(err);
  }        
});

}

editarConfirmado(){
  this.vistaCarga = true;

  let proveedorEdit = new Proveedor();
  proveedorEdit = structuredClone(this.proveedor);

  let tipoDocumentoBase = new TipoDocumento();

  tipoDocumentoBase.id = parseInt((this.clsTipoDocumento != null) ? this.clsTipoDocumento.code : "0");

  proveedorEdit.nombre = this.nombre.toString().trim();
  proveedorEdit.tipoDocumento = tipoDocumentoBase;
  proveedorEdit.documento = this.documento;
  proveedorEdit.direccion = this.direccion;
  proveedorEdit.telefono = this.telefono;
  proveedorEdit.anexo = this.anexo;
  proveedorEdit.celular = this.celular;
  proveedorEdit.responsable = this.responsable;

  this.proveedorService.modificar(proveedorEdit).subscribe({
    next: (data) => {
    this.loading = true; 
    this.vistaCarga = false;
    this.cancelar();
    this.cerrar();
    this.listarPageMain(this.page, this.rows);
    this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Proveedor se ha editado satisfactoriamente'});
  },
  error: (err) => {
    this.vistaCarga = false;
    console.log(err);
  }        
});
}

eliminarConfirmado(data:Proveedor){
  this.vistaCarga = true;
  this.proveedorService.eliminar(data.id).subscribe({
    next: (data) => {
    this.loading = true; 
    this.vistaCarga = false;
    if(this.numberElements <= 1 && this.page > 0){
      this.page--;
    }
    this.listarPageMain(this.page, this.rows);
    this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Proveedor se ha eliminado satisfactoriamente'});
  },
  error: (err) => {
    this.vistaCarga = false;
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

mostrarNumeroMethod(value: any){  
  if(value != null && value != undefined){
    value=parseFloat(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "");
  }
  return value;
}

mostrarNumeroMethodconComas(value: any){  
  if(value != null && value != undefined){
    value=parseFloat(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return value;
}




}
