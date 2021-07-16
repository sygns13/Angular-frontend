import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import {AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';

import { switchMap } from 'rxjs/operators';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';

import { ClienteService } from './../../../_service/cliente.service';
import { Cliente } from './../../../_model/cliente';
import { TipoDocumento } from './../../../_model/tipo_documento';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ClienteComponent implements OnInit {

  @ViewChild('inputNombre', { static: false }) inputNombre: ElementRef;

  vistaRegistro: boolean = false;
  tipoDocumentos: any[] = [];

  clsTipoDocumento: any = null;
  nombre: string = '';
  tipo_documento_id: number = null;
  documento: string = '';
  direccion: string = '';
  telefono: string = '';
  correo1: string = '';
  correo2: string = '';

  cliente = new Cliente();

  clientes: any[] = [];

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

  tipoFrm: String = 'Nuevo Cliente';
  vistaBotonRegistro : boolean = false;
  vistaBotonEdicion : boolean = false;
  vistaCarga : boolean = true;

  loading: boolean = true; 
  txtBuscar: String = '';

  //selectedCliente: Cliente;

  message:string;

  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private clienteService: ClienteService,
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService) {
    this.breadcrumbService.setItems([
    { label: 'Ventas' },
    { label: 'Registro de Clientes', routerLink: ['/ventas/clientes'] }
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

  this.clienteService.getTipoDocumentos().subscribe(data => {
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

  this.clienteService.listarPageable(p, s, this.txtBuscar).subscribe(data => {
    this.clientes = data.content;
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
  
  this.tipoFrm = 'Nuevo Cliente' 
  this.vistaRegistro = true;

  this.cancelar();
}

cancelar() {

  this.cliente = new Cliente();

  this.clsTipoDocumento = null;
  this.nombre = '';
  this.tipo_documento_id = null;
  this.documento = '';
  this.direccion = '';
  this.telefono = '';
  this.correo1 = '';
  this.correo2 = '';

  this.setFocusNombre();
  
}

cerrar(){
  this.vistaRegistro = false;

}

editar(data: Cliente, event: Event){
  this.cliente = data;

  this.vistaBotonRegistro = false;
  this.vistaBotonEdicion = true;

  this.clsTipoDocumento = {name: this.cliente.tipoDocumento.tipo, code: this.cliente.tipoDocumento.id};

  this.nombre = this.cliente.nombre;
  this.documento = this.cliente.documento;
  this.direccion = this.cliente.direccion;
  this.telefono = this.cliente.telefono;
  this.correo1 = this.cliente.correo1;
  this.correo2 = this.cliente.correo2;


  this.tipoFrm = 'Editar Cliente' 

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

eliminar(data:Cliente, event: Event){
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


  this.cliente.nombre = this.nombre.toString().trim();
  this.cliente.tipoDocumento = tipoDocumentoBase;
  this.cliente.documento = this.documento;
  this.cliente.direccion = this.direccion;
  this.cliente.telefono = this.telefono;
  this.cliente.correo1 = this.correo1;
  this.cliente.correo2 = this.correo2;


  this.clienteService.registrar(this.cliente).subscribe(() => {
    this.vistaCarga = false;
    this.loading = true; 
    this.cancelar();
    this.listarPageMain(this.page, this.rows);
    this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Cliente se ha registrado satisfactoriamente'});
 });

}

editarConfirmado(){
  this.vistaCarga = true;

  let clienteEdit = new Cliente();
  clienteEdit = JSON.parse(JSON.stringify(this.cliente));

  let tipoDocumentoBase = new TipoDocumento();

  tipoDocumentoBase.id = parseInt((this.clsTipoDocumento != null) ? this.clsTipoDocumento.code : "0");

  clienteEdit.nombre = this.nombre.toString().trim();
  clienteEdit.tipoDocumento = tipoDocumentoBase;
  clienteEdit.documento = this.documento;
  clienteEdit.direccion = this.direccion;
  clienteEdit.telefono = this.telefono;
  clienteEdit.correo1 = this.correo1;
  clienteEdit.correo2 = this.correo2;

  this.clienteService.modificar(clienteEdit).subscribe(() => {
    this.loading = true; 
    this.vistaCarga = false;
    this.cancelar();
    this.cerrar();
    this.listarPageMain(this.page, this.rows);
    this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Cliente se ha editado satisfactoriamente'});
 });
}

eliminarConfirmado(data:Cliente){
  this.vistaCarga = true;
  this.clienteService.eliminar(data.id).subscribe(() => {
    this.loading = true; 
    this.vistaCarga = false;
    if(this.numberElements <= 1 && this.page > 0){
      this.page--;
    }
    this.listarPageMain(this.page, this.rows);
    this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Cliente se ha eliminado satisfactoriamente'});
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
