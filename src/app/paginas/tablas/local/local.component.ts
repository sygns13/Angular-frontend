import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import {AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import { AlmacenService } from './../../../_service/almacen.service';
import { switchMap } from 'rxjs/operators';
import { Almacen } from './../../../_model/almacen';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-local',
  templateUrl: './local.component.html',
  styleUrls: ['./local.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class LocalComponent implements OnInit {

 @ViewChild('inputNombre', { static: false }) inputNombre: ElementRef;

  vistaRegistro: boolean = false;

  clsDepartamento: any = null;
  clsProvincia: any = null;
  clsDistrito: any = null;
  nombre: String = '';
  codigo: String = '';
  direccion: String = '';
  clsEstado: any = null;

  estados: any[] = [
      {name: 'Activo', code: '1'},
      {name: 'Inactivo', code: '0'}
  ];
  departamentos: any[] = [];
  provincias: any[] = [];
  distritos: any[] = [];

  almacen = new Almacen();

  first = 0;
  rows = 10;

  almacens: any[] = [];

  msgs: Message[] = [];
  position: string;

  tipoFrm: String = 'Nuevo Local';
  vistaBotonRegistro : boolean = false;
  vistaBotonEdicion : boolean = false;
  vistaCarga : boolean = true;


  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private almacenService: AlmacenService,
                private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService) {
    this.breadcrumbService.setItems([
        { label: 'Tablas Base' },
        { label: 'Gestión de Locales', routerLink: ['/tablas/locales'] }
    ]);

}

  ngOnInit(): void {
    this.getDepartamentos();
    this.listarMain();
    this.primengConfig.ripple = true;
    this.vistaCarga = false;
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
      this.first = this.first - this.rows;
  }

  reset() {
      this.first = 0;
  }

  isLastPage(): boolean {
      return this.almacens ? this.first > (this.almacens.length - this.rows): true;
  }

  isFirstPage(): boolean {
      return this.almacens ? this.first === 0 : true;
  }

  setFocusNombre() {    

    this.changeDetectorRef.detectChanges();
    this.inputNombre.nativeElement.focus();

  }

  //Carga de Data

  getDepartamentos() {

    this.clsProvincia = null;
    this.clsDistrito = null;
    this.provincias = [];
    this.distritos = [];

    this.almacenService.getDepartamentos(1).subscribe(data => {
      data.forEach(dep => {
        this.departamentos.push({name: dep.nombre, code: dep.id});
      });
    });
  }

  getProvincias() {

    if(this.clsDepartamento == null){
      this.provincias = [];
      this.distritos = [];
      this.clsProvincia = null;
      this.clsDistrito = null;
    }
    else{
      this.provincias = [];
      this.distritos = [];
      this.clsProvincia = null;
      this.clsDistrito = null;

      this.almacenService.getProvincias(this.clsDepartamento.code).subscribe(data => {
        data.forEach(dep => {
          this.provincias.push({name: dep.nombre, code: dep.id});
        });
      });
    }

  }

  getDistritos() {

    if(this.clsProvincia == null){
      this.distritos = [];
      this.clsDistrito = null;
    }
    else{
      this.distritos = [];
      this.clsDistrito = null;

      this.almacenService.getDistritos(this.clsProvincia.code).subscribe(data => {
        data.forEach(dep => {
          this.distritos.push({name: dep.nombre, code: dep.id});
        });
      });
    }

  }


  getProvinciasEd(dataAlmacen: Almacen){

    if(this.clsDepartamento == null){

      this.provincias = [];
      this.distritos = [];
      this.clsProvincia = null;
      this.clsDistrito = null;

    }
    else{
      this.provincias = [];
      this.distritos = [];
      this.clsProvincia = null;
      this.clsDistrito = null;

      this.almacenService.getProvincias(this.clsDepartamento.code).subscribe(data => {
        data.forEach(dep => {
          this.provincias.push({name: dep.nombre, code: dep.id});
        });
        this.clsProvincia = {name: dataAlmacen.provincia.nombre, code: dataAlmacen.provincia.id};
        this.getDistritosEd(dataAlmacen)
      });  
    }
  }

  getDistritosEd(dataAlmacen: Almacen) {

    if(this.clsProvincia == null){
      this.distritos = [];
      this.clsDistrito = null;
    }
    else{
      this.distritos = [];
      this.clsDistrito = null;

      this.almacenService.getDistritos(this.clsProvincia.code).subscribe(data => {
        data.forEach(dep => {
          this.distritos.push({name: dep.nombre, code: dep.id});
        });
        this.clsDistrito = {name: dataAlmacen.distrito.nombre, code: dataAlmacen.distrito.id};
      });

    }

  }

  listarMain() {

    this.almacenService.listar().subscribe(data => {
      
      this.almacens = data;
    });
  }

  //Funciones crud


  nuevo() {

    this.vistaBotonRegistro = true;
    this.vistaBotonEdicion = false;
    
    this.tipoFrm = 'Nuevo Local' 
    this.vistaRegistro = true;

    this.cancelar();
  }

  cancelar() {

    this.almacen = new Almacen();

    this.clsDepartamento = null;
    this.clsProvincia = null;
    this.clsDistrito = null;
    this.nombre = '';
    this.codigo = '';
    this.direccion = '';
    this.clsEstado = null;

    this.setFocusNombre();
    
  }

  cerrar(){
    this.vistaRegistro = false;

  }

  editar(data: Almacen){
    this.almacen = data;

    this.vistaBotonRegistro = false;
    this.vistaBotonEdicion = true;

    this.clsDepartamento = {name: this.almacen.departamento.nombre, code: this.almacen.departamento.id};
    this.clsProvincia = null;
    this.clsDistrito = null;
    this.nombre = this.almacen.nombre;
    this.codigo = this.almacen.codigo;
    this.direccion = this.almacen.direccion;
    this.clsEstado =  (this.almacen.activo === 1) ?  {name: "Activo", code: this.almacen.activo} : {name: "Inactivo", code: this.almacen.activo};

    this.tipoFrm = 'Editar Local' 

    this.getProvinciasEd(this.almacen);

    this.vistaRegistro = true;

    this.setFocusNombre();


  }

  eliminar(data: Almacen, event: Event){
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

    this.almacen.nombre = this.nombre.toString().trim();
    this.almacen.codigo = this.codigo.toString().trim();
    this.almacen.direccion = this.direccion.toString().trim();
    this.almacen.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");
    this.almacen.distritoId = parseInt((this.clsDistrito != null) ? this.clsDistrito.code: "");

    this.almacenService.registrar(this.almacen).pipe(switchMap(() => {
      return this.almacenService.listar();
    })).subscribe(data => {
      this.vistaCarga = false;
      //this.almacenService.almacens.next(data);
      this.messageService.add({severity:'success', summary:'Confirmado', detail:'El local se ha registrado satisfactoriamente'});
      this.cancelar();
      this.almacens = data;
    });

  }

  editarConfirmado(){
    this.vistaCarga = true;

    this.almacen.nombre = this.nombre.toString().trim();
    this.almacen.codigo = this.codigo.toString().trim();
    this.almacen.direccion = this.direccion.toString().trim();
    this.almacen.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");
    this.almacen.distritoId = parseInt((this.clsDistrito != null) ? this.clsDistrito.code: "");

    this.almacenService.modificar(this.almacen).pipe(switchMap(() => {
      return this.almacenService.listar();
    })).subscribe(data => {
      this.vistaCarga = false;
      //this.almacenService.almacens.next(data);
      this.messageService.add({severity:'success', summary:'Confirmado', detail:'El local se ha editado satisfactoriamente'});
      this.almacens = data;
      this.cancelar();
      this.cerrar();
    });

  }

  eliminarConfirmado(data: Almacen){
    this.vistaCarga = true;
    this.almacenService.eliminar(data.id).pipe(switchMap(() => {
      return this.almacenService.listar();
    })).subscribe(data => {
      this.messageService.add({severity:'success', summary:'Confirmado', detail:'El local se ha eliminado satisfactoriamente'});
      this.almacens = data;
      this.vistaCarga = false;
    });

  }

}
