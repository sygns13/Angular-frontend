import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import {AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';

import { switchMap } from 'rxjs/operators';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';

import { UserService } from './../../../_service/user.service';
import { TipoUserService } from 'src/app/_service/tipo_user.service';
import { GestionloteService } from 'src/app/_service/gestionlote.service';
import { User } from './../../../_model/user';
import { DatosUser } from './../../../_model/datos_user';
import { TipoDocumento } from './../../../_model/tipo_documento';
import { TipoUser } from 'src/app/_model/tipo_user';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class UsuariosComponent implements OnInit {

  @ViewChild('inputNombres', { static: false }) inputNombres: ElementRef;

  vistaRegistro: boolean = false;
  tipoDocumentos: any[] = [];
  tipoUsers: any[] = [];

  estados: any[] = [
    {name: 'Activo', code: '1'},
    {name: 'Inactivo', code: '0'}
  ];


  clsTipoUser: any = null;
  name: string = '';
  email: string = '';
  password: string = '';
  tipo_user_id: number = null;
  clsEstado: any = null;

  almacens: any[] = [];
  clsAlmacen: any = null;

  clsTipoDocumento: any = null;
  nombres: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  direccion: string = '';
  telefono: string = '';
  tipo_documento_id: number = null;
  documento: string = '';
  user_id: number = null;

  user = new User();

  modificarPasswords: any[] = [
    {name: 'Si', code: '1'},
    {name: 'No', code: '0'}
  ];
  clsModificarPassword: any = {name: 'No', code: '0'};

  users: any[] = [];

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

  tipoFrm: String = 'Nuevo User';
  vistaBotonRegistro : boolean = false;
  vistaBotonEdicion : boolean = false;
  vistaCarga : boolean = true;

  loading: boolean = true; 
  txtBuscar: String = '';

  //selectedUser: User;

  message:string;

  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private userService: UserService,
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService,
    private tipoUserService: TipoUserService, 
    private gestionloteService: GestionloteService) {
    this.breadcrumbService.setItems([
    { label: 'Configuraciones' },
    { label: 'Gestión de Usuarios', routerLink: ['/configs/usuarios'] }
    ]);

}

ngOnInit(): void {
  this.getTipoDocumentos();
  this.getTipoUsers();
  this.getAlmacens();

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

setFocusNombres() {    

  this.changeDetectorRef.detectChanges();
  this.inputNombres.nativeElement.focus();

}

//Carga de Data

getTipoDocumentos() {

  this.clsTipoDocumento = null;
  this.tipoDocumentos = [];

  this.userService.getTipoDocumentos().subscribe(data => {
    data.forEach(tipoDoc => {
      this.tipoDocumentos.push({name: tipoDoc.tipo, code: tipoDoc.id});
    });
  });
}

getAlmacens() {

  this.clsAlmacen = null;
  this.almacens = [];

  this.almacens.push({name: "General - Todas", code: 0});
  this.clsAlmacen = {name: "General - Todas", code: 0};


  this.gestionloteService.getAlmacens().subscribe(data => {
    data.forEach(almacen => {
      this.almacens.push({name: almacen.nombre, code: almacen.id});
    });
  });
}

getTipoUsers() {

  this.clsTipoUser = null;
  this.tipoUsers = [];

  this.tipoUserService.listarAll().subscribe(data => {
    data.forEach(tipoUser => {
      this.tipoUsers.push({name: tipoUser.nombre, code: tipoUser.id});
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

  this.userService.listarPageable(p, s, this.txtBuscar).subscribe(data => {
    this.users = data.content;
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
  
  this.tipoFrm = 'Nuevo Usuario' 
  this.vistaRegistro = true;

  this.cancelar();
}

cancelar() {

  this.user = new User();

  this.clsTipoUser = null;
  this.name = '';
  this.email = '';
  this.password = '';
  this.tipo_user_id = null;
  this.clsEstado = null;

  this.clsAlmacen = null;

  this.clsTipoDocumento = null;
  this.nombres = '';
  this.apellidoPaterno = '';
  this.apellidoMaterno = '';
  this.direccion = '';
  this.telefono = '';
  this.tipo_documento_id = null;
  this.documento = '';
  this.user_id = null;

  this.clsModificarPassword = {name: 'No', code: '0'};

  this.setFocusNombres();
  
}

cerrar(){
  this.vistaRegistro = false;

}

editar(data: User, event: Event){
  this.user = data;

  this.vistaBotonRegistro = false;
  this.vistaBotonEdicion = true;

  
  this.clsTipoUser = {name: this.user.tipoUser.nombre, code: this.user.tipoUser.id};
  this.name = this.user.name;
  this.email = this.user.email;
  this.password = '';
  this.tipo_user_id = this.user.tipoUser.id;
  this.clsEstado = (this.user.activo === 1) ?  {name: "Activo", code: this.user.activo} : {name: "Inactivo", code: this.user.activo};

  if (this.user.almacenId != null || this.user.almacenId == 0) {
    this.almacens.forEach(almacen => {
      if(almacen.code == this.user.almacenId){
        this.clsAlmacen = almacen;
      }
    });
  }

  this.clsTipoDocumento = {name: this.user.datos.tipoDocumento.tipo, code: this.user.datos.tipoDocumento.id};
  this.nombres = this.user.datos.nombres;
  this.apellidoPaterno = this.user.datos.apellidoPaterno;
  this.apellidoMaterno = this.user.datos.apellidoMaterno;
  this.direccion = this.user.datos.direccion;
  this.telefono = this.user.datos.telefono;
  this.tipo_documento_id = this.user.datos.tipoDocumento.id;
  this.documento =  this.user.datos.documento;
  this.user_id = this.user.datos.userId;


  this.tipoFrm = 'Editar Usuario' 

  this.vistaRegistro = true;

  this.setFocusNombres();

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

eliminar(data:User, event: Event){
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
  let tipoUserBase = new TipoUser();
  let datos = new DatosUser();

  tipoDocumentoBase.id = parseInt((this.clsTipoDocumento != null) ? this.clsTipoDocumento.code : "0");
  tipoUserBase.id = parseInt((this.clsTipoUser != null) ? this.clsTipoUser.code : "0");

  datos.nombres = this.nombres;
  datos.apellidoPaterno = this.apellidoPaterno;
  datos.apellidoMaterno = this.apellidoMaterno;
  datos.direccion = this.direccion;
  datos.telefono = this.telefono;
  datos.tipoDocumento = tipoDocumentoBase;
  datos.documento = this.documento;
  datos.email = this.email;

  this.user.name = this.name;
  this.user.email = this.email;
  this.user.password = this.password;
  this.user.tipoUser = tipoUserBase;
  this.user.almacenId = parseInt((this.clsAlmacen != null) ? this.clsAlmacen.code : "0");
  this.user.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "0");
  this.user.datos = datos;

  this.userService.registrar(this.user).subscribe({
    next: (data) => {
    this.vistaCarga = false;
    this.loading = true; 
    this.cancelar();
    this.cerrar();
    this.listarPageMain(this.page, this.rows);
    this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Usuario se ha registrado satisfactoriamente'});
  },
  error: (err) => {
    this.vistaCarga = false;
    console.log(err);
  }        
});


}

editarConfirmado(){
  this.vistaCarga = true;

  let userEdit = new User();
  userEdit = structuredClone(this.user);

  let tipoDocumentoBase = new TipoDocumento();
  let tipoUserBase = new TipoUser();

  tipoDocumentoBase.id = parseInt((this.clsTipoDocumento != null) ? this.clsTipoDocumento.code : "0");
  tipoUserBase.id = parseInt((this.clsTipoUser != null) ? this.clsTipoUser.code : "0");

  userEdit.datos.nombres = this.nombres;
  userEdit.datos.apellidoPaterno = this.apellidoPaterno;
  userEdit.datos.apellidoMaterno = this.apellidoMaterno;
  userEdit.datos.direccion = this.direccion;
  userEdit.datos.telefono = this.telefono;
  userEdit.datos.tipoDocumento = tipoDocumentoBase;
  userEdit.datos.documento = this.documento;
  userEdit.datos.email = this.email;

  userEdit.name = this.name;
  userEdit.email = this.email;
  userEdit.password = this.password;
  userEdit.tipoUser = tipoUserBase;
  userEdit.almacenId = parseInt((this.clsAlmacen != null) ? this.clsAlmacen.code : "0");
  userEdit.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "0");


  userEdit.modificarPassword = parseInt((this.clsModificarPassword != null) ? this.clsModificarPassword.code : "0");

  

  this.userService.modificar(userEdit).subscribe({
    next: (data) => {
    this.loading = true; 
    this.vistaCarga = false;
    this.cancelar();
    this.cerrar();
    this.listarPageMain(this.page, this.rows);
    this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Usuario se ha editado satisfactoriamente'});
  },
  error: (err) => {
    this.vistaCarga = false;
    console.log(err);
  }        
});
}

eliminarConfirmado(data:User){
  this.vistaCarga = true;
  this.userService.eliminar(data.id).subscribe({
    next: (data) => {
    this.loading = true; 
    this.vistaCarga = false;
    if(this.numberElements <= 1 && this.page > 0){
      this.page--;
    }
    this.listarPageMain(this.page, this.rows);
    this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Usuario se ha eliminado satisfactoriamente'});
  },
  error: (err) => {
    this.vistaCarga = false;
    console.log(err);
  }        
});
}

alta(data: User, event: Event){
  this.confirmationService.confirm({
    key: 'confirmDialog',
    target: event.target,
    message: '¿Está seguro de Activar el Usuario ',
    icon: 'pi pi-exclamation-triangle',
    header: 'Confirmación Activación',
    accept: () => {
      let msj : string = 'El Usuario se ha activado satisfactoriamente';
      let valor: number = 1;
     this.altaBaja(data, valor, msj);
    },
    reject: () => {
    }
});
  
}

baja(data: User, event: Event){
  this.confirmationService.confirm({
    key: 'confirmDialog',
    target: event.target,
    message: '¿Está seguro de Desactivar el registro?',
    icon: 'pi pi-exclamation-triangle',
    header: 'Confirmación Desactivación',
    accept: () => {
      let msj : string = 'El Usuario se ha desactivado satisfactoriamente';
      let valor: number = 0;
      this.altaBaja(data, valor, msj);
    },
    reject: () => {
    }
});
  
}

altaBaja(data: User, valor: number, msj: string){
  this.vistaCarga = true;
  
  this.userService.altaBaja(data.id, valor).subscribe({
    next: c => {
    this.loading = true; 
    this.vistaCarga = false;
    this.listarPageMain(this.page, this.rows);
    this.messageService.add({severity:'success', summary:'Confirmado', detail: msj});
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
