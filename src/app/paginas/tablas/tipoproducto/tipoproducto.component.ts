import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import {AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import { TipoProductoService } from '../../../_service/tipo_producto.service';
import { switchMap } from 'rxjs/operators';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { TipoProducto } from '../../../_model/tipo_producto';
import { LazyLoadEvent } from 'primeng/api';

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

  page: number = 0;
  first: number = 0;
  last: number = 0;
  rows: number = 10;

  isFirst: boolean = true;
  isLast: boolean = false;
  totalRecords: number = 0;
  numberElements: number = 0;

  tipoProductos: any[] = [];

  msgs: Message[] = [];
  position: string;

  tipoFrm: String = 'Nuevo Tipo de Producto';
  vistaBotonRegistro : boolean = false;
  vistaBotonEdicion : boolean = false;
  vistaCarga : boolean = true;

  loading: boolean = true; 
  txtBuscar: String = '';


  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private tipoProductoService: TipoProductoService,
                private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService) {
    this.breadcrumbService.setItems([
        { label: 'Tablas Base' },
        { label: 'Gestión de Tipos de Productos', routerLink: ['/tablas/tipoProducto'] }
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
    this.inputTipo.nativeElement.focus();

  }

  //Carga de Data
/*
  listarMain() {

    this.tipoProductoService.listar().subscribe(data => {
      
      this.tipoProductos = data;
    });
  }*/

  loadData(event: LazyLoadEvent) { 
    this.loading = true; 
    this.rows = event.rows;
    this.page = event.first / this.rows;

    this.listarPageMain(this.page, this.rows);

  }

  listarPageMain(p: number, s:number) {

    this.tipoProductoService.listarPageable(p, s, this.txtBuscar).subscribe(data => {
      this.tipoProductos = data.content;
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

    this.tipoProductoService.registrar(this.tipoProducto).subscribe(() => {
      this.vistaCarga = false;
      this.loading = true; 
      this.cancelar();
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El tipo de producto se ha registrado satisfactoriamente'});
   });

  }

  editarConfirmado(){
    this.vistaCarga = true;

    let tipoProductoEdit = new TipoProducto();
    tipoProductoEdit = JSON.parse(JSON.stringify(this.tipoProducto));

    tipoProductoEdit.tipo = this.tipo.toString().trim();
    tipoProductoEdit.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");

    this.tipoProductoService.modificar(tipoProductoEdit).subscribe(() => {
      this.loading = true; 
      this.vistaCarga = false;
      this.cancelar();
      this.cerrar();
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El tipo de producto se ha editado satisfactoriamente'});
   });

  }

  eliminarConfirmado(data: TipoProducto){
    this.vistaCarga = true;
    this.tipoProductoService.eliminar(data.id).subscribe(() => {
      this.loading = true; 
      this.vistaCarga = false;
      if(this.numberElements <= 1 && this.page > 0){
        this.page--;
      }
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El tipo de producto se ha eliminado satisfactoriamente'});
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
    
    this.tipoProductoService.altaBaja(data.id, valor).subscribe(() => {
      this.loading = true; 
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: msj});
   });


  }

}
