import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import {AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import { TipoProductoService } from '../../../_service/tipo_producto.service';
import { switchMap } from 'rxjs/operators';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { TipoProducto } from '../../../_model/tipo_producto';

@Component({
  selector: 'app-tipoproducto',
  templateUrl: './tipoproducto.component.html',
  styleUrls: ['./tipoproducto.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class TipoProductoComponent implements OnInit {

  @ViewChild('inputTipo', { static: false }) inputTipo: ElementRef;

  vistaRegistro: boolean = false;


  tipo: String = '';
  clsEstado: any = null;

  estados: any[] = [
      {name: 'Activo', code: '1'},
      {name: 'Inactivo', code: '0'}
  ];


  tipoProducto = new TipoProducto();

  first = 0;
  rows = 10;

  tipoProductos: any[] = [];

  msgs: Message[] = [];
  position: string;

  tipoFrm: String = 'Nuevo Tipo de Producto';
  vistaBotonRegistro : boolean = false;
  vistaBotonEdicion : boolean = false;
  vistaCarga : boolean = true;


  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private tipoProductoService: TipoProductoService,
                private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService) {
    this.breadcrumbService.setItems([
        { label: 'Tablas Base' },
        { label: 'Gestión de Tipos de Productos', routerLink: ['/tablas/tipoProducto'] }
    ]);

}

  ngOnInit(): void {
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
      return this.tipoProductos ? this.first > (this.tipoProductos.length - this.rows): true;
  }

  isFirstPage(): boolean {
      return this.tipoProductos ? this.first === 0 : true;
  }

  setFocusTipo() {    

    this.changeDetectorRef.detectChanges();
    this.inputTipo.nativeElement.focus();

  }

  //Carga de Data

  listarMain() {

    this.tipoProductoService.listar().subscribe(data => {
      
      this.tipoProductos = data;
    });
  }

  //Funciones crud


  nuevo() {

    this.vistaBotonRegistro = true;
    this.vistaBotonEdicion = false;
    
    this.tipoFrm = 'Nuevo Tipo de Producto' 
    this.vistaRegistro = true;

    this.cancelar();
  }

  cancelar() {

    this.tipoProducto = new TipoProducto();

    this.tipo = '';
    this.clsEstado = null;

    this.setFocusTipo();
    
  }

  cerrar(){
    this.vistaRegistro = false;

  }

  editar(data: TipoProducto){
    this.tipoProducto = data;

    this.vistaBotonRegistro = false;
    this.vistaBotonEdicion = true;

    this.tipo = this.tipoProducto.tipo;
    this.clsEstado =  (this.tipoProducto.activo === 1) ?  {name: "Activo", code: this.tipoProducto.activo} : {name: "Inactivo", code: this.tipoProducto.activo};

    this.tipoFrm = 'Editar Tipo de Producto' 

    this.vistaRegistro = true;

    this.setFocusTipo();
  }

  eliminar(data: TipoProducto, event: Event){
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

    this.tipoProducto.tipo = this.tipo.toString().trim();
    this.tipoProducto.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");

    this.tipoProductoService.registrar(this.tipoProducto).pipe(switchMap(() => {
      return this.tipoProductoService.listar();
    })).subscribe(data => {
      this.vistaCarga = false;
      //this.tipoProductoService.tipoProductos.next(data);
      this.messageService.add({severity:'success', summary:'Confirmado', detail:'El tipo de producto se ha registrado satisfactoriamente'});
      this.cancelar();
      this.tipoProductos = data;
    });

  }

  editarConfirmado(){
    this.vistaCarga = true;

    this.tipoProducto.tipo = this.tipo.toString().trim();
    this.tipoProducto.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");

    this.tipoProductoService.modificar(this.tipoProducto).pipe(switchMap(() => {
      return this.tipoProductoService.listar();
    })).subscribe(data => {
      this.vistaCarga = false;
      //this.tipoProductoService.tipoProductos.next(data);
      this.messageService.add({severity:'success', summary:'Confirmado', detail:'El tipo de producto se ha editado satisfactoriamente'});
      this.tipoProductos = data;
      this.cancelar();
      this.cerrar();
    });

  }

  eliminarConfirmado(data: TipoProducto){
    this.vistaCarga = true;
    this.tipoProductoService.eliminar(data.id).pipe(switchMap(() => {
      return this.tipoProductoService.listar();
    })).subscribe(data => {
      this.messageService.add({severity:'success', summary:'Confirmado', detail:'El tipo de producto se ha eliminado satisfactoriamente'});
      this.tipoProductos = data;
      this.vistaCarga = false;
    });

  }


  alta(data: TipoProducto, event: Event){
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Está seguro de Activar el tipo de producto?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Activación',
      accept: () => {
        let msj : string = 'El tipo de producto se ha activado satisfactoriamente';
        let valor: number = 1;
       this.altaBaja(data, valor, msj);
      },
      reject: () => {
      }
  });
    
  }

  baja(data: TipoProducto, event: Event){
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Está seguro de Desactivar el registro?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Desactivación',
      accept: () => {
        let msj : string = 'El tipo de producto se ha desactivado satisfactoriamente';
        let valor: number = 0;
        this.altaBaja(data, valor, msj);
      },
      reject: () => {
      }
  });
    
  }

  altaBaja(data: TipoProducto, valor: number, msj: string){
    //this.vistaCarga = true;
    
    this.tipoProductoService.altaBaja(data.id, valor).pipe(switchMap(() => {
      return this.tipoProductoService.listar();
    })).subscribe(data => {
      this.messageService.add({severity:'success', summary:'Confirmado', detail: msj});
      this.tipoProductos = data;
      //this.vistaCarga = false;
    });

  }

}
