import {Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import {AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import {switchMap } from 'rxjs/operators';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Message} from 'primeng/api';
import {PrimeNGConfig } from 'primeng/api';
import {Servicio } from '../../../_model/servicio';
import {LazyLoadEvent } from 'primeng/api';
import {ServicioService } from './../../../_service/servicio.service';


@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class CatalogoComponent implements OnInit {

  @ViewChild('inputNombre', { static: false }) inputNombre: ElementRef;

  vistaRegistro: boolean = false;

  nombre: String = '';
  descripcion: String = '';
  codigo: String = '';
  precioUnidad: number = null;
  afectoIsc: number = 0;
  tipoTasaIsc: any = null;
  tasaIsc: number = 1;
  afectoIgv: number = null;

  servicio = new Servicio();

  tiposISC: any[] = [
    {name: 'Porcentual % (0 a 100)', code: '1'},
    {name: 'Valor Fijo', code: '2'}
  ];

  page: number = 0;
  first: number = 0;
  last: number = 0;
  rows: number = 10;

  isFirst: boolean = true;
  isLast: boolean = false;
  totalRecords: number = 0;
  numberElements: number = 0;

  servicios: any[] = [];

  tipoFrm: String = 'Nuevo Servicio';
  vistaBotonRegistro : boolean = false;
  vistaBotonEdicion : boolean = false;
  vistaCarga : boolean = true;

  loading: boolean = true; 
  txtBuscar: String = '';

  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private servicioService:ServicioService,
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService) {
this.breadcrumbService.setItems([
{ label: 'Servicios' },
{ label: 'Catalogo', routerLink: ['/servicios/catalogo'] }
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

setFocusNombre() {    

  this.changeDetectorRef.detectChanges();
  this.inputNombre.nativeElement.focus();

}

loadData(event: LazyLoadEvent) { 
  this.loading = true; 
  this.rows = event.rows;
  this.page = event.first / this.rows;

  this.listarPageMain(this.page, this.rows);

}

listarPageMain(p: number, s:number) {

  this.servicioService.listarPageable(p, s, this.txtBuscar).subscribe(data => {
    this.servicios = data.content;
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
  this.tipoFrm = 'Nuevo Servicio' 
  this.vistaRegistro = true;

  this.cancelar();
}


cancelar() {

  this.servicio = new Servicio();

  this.nombre = '';
  this.descripcion = '';
  this.codigo = '';
  this.precioUnidad = null;
  this.afectoIsc = 0;
  this.tipoTasaIsc = null;
  this.tasaIsc = null;
  this.afectoIgv = 1;

  this.setFocusNombre();
  
}

cerrar(){
  this.vistaRegistro = false;
}

editar(data:Servicio){
  this.servicio = data;

  this.vistaBotonRegistro = false;
  this.vistaBotonEdicion = true;

  this.nombre = this.servicio.nombre;
  this.descripcion = this.servicio.descripcion;
  this.codigo = this.servicio.codigo;
  this.precioUnidad = this.servicio.precioUnidad;

  if(this.servicio.tipoTasaIsc == 1){
    this.tipoTasaIsc = {name: "Porcentual % (0 a 100)", code: this.servicio.tipoTasaIsc};
  }else if(this.servicio.tipoTasaIsc == 2){
    this.tipoTasaIsc = {name: "Valor Fijo", code: this.servicio.tipoTasaIsc};
  }else{
    this.tipoTasaIsc = null;
  }

  this.afectoIsc = this.servicio.afectoIsc;
  this.tasaIsc = this.servicio.tasaIsc;
  this.afectoIgv = this.servicio.afectoIgv;

  this.tipoFrm = 'Editar Servicio' 
  this.vistaRegistro = true;

  this.setFocusNombre();
}

eliminar(data:Servicio, event: Event){
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

  this.servicio.nombre = this.nombre.toString().trim();
  this.servicio.descripcion = this.descripcion.toString().trim();
  this.servicio.precioUnidad = this.mostrarNumeroMethod(this.precioUnidad);
  this.servicio.codigo = this.codigo.toString().trim();
  this.servicio.afectoIsc = this.afectoIsc;
  this.servicio.tipoTasaIsc = parseInt((this.tipoTasaIsc != null) ? this.tipoTasaIsc.code : 1);
  this.servicio.tasaIsc = this.tasaIsc;
  this.servicio.afectoIgv = this.afectoIgv;



  this.servicioService.registrar(this.servicio).subscribe({
    next: (data) => {
    this.vistaCarga = false;
    this.loading = true; 
    this.cancelar();
    this.listarPageMain(this.page, this.rows);
    this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Servicio se ha registrado satisfactoriamente'});
  },
  error: (err) => {
    this.vistaCarga = false;
    console.log(err);
  }        
});
}

editarConfirmado(){
  this.vistaCarga = true;

  let servicioEdit = new Servicio();
  servicioEdit = structuredClone(this.servicio);


  servicioEdit.nombre = this.nombre.toString().trim();
  servicioEdit.descripcion = this.descripcion.toString().trim();
  servicioEdit.precioUnidad = this.mostrarNumeroMethod(this.precioUnidad);
  servicioEdit.codigo = this.codigo.toString().trim();
  servicioEdit.afectoIsc = this.afectoIsc;
  servicioEdit.tipoTasaIsc = parseInt((this.tipoTasaIsc != null) ? this.tipoTasaIsc.code : 1);
  servicioEdit.tasaIsc = this.tasaIsc;
  servicioEdit.afectoIgv = this.afectoIgv;


  this.servicioService.modificar(servicioEdit).subscribe({
    next: (data) => {
    this.loading = true; 
    this.vistaCarga = false;
    this.cancelar();
    this.cerrar();
    this.listarPageMain(this.page, this.rows);
    this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Servicio se ha editado satisfactoriamente'});
  },
  error: (err) => {
    this.vistaCarga = false;
    console.log(err);
  }        
});

}

eliminarConfirmado(data:Servicio){
  this.vistaCarga = true;
  this.servicioService.eliminar(data.id).subscribe({
    next: (data) => {
    this.loading = true; 
    this.vistaCarga = false;
    if(this.numberElements <= 1 && this.page > 0){
      this.page--;
    }
    this.listarPageMain(this.page, this.rows);
    this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Servicio se ha eliminado satisfactoriamente'});
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
