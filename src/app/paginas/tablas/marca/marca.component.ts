import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import {AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import {MarcaService } from '../../../_service/marca.service';
import { switchMap } from 'rxjs/operators';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import {Marca } from '../../../_model/marca';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styleUrls: ['./marca.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class MarcaComponent implements OnInit {

  @ViewChild('inputNombre', { static: false }) inputNombre: ElementRef;

  vistaRegistro: boolean = false;


  nombre: String = '';
  clsEstado: any = null;

  estados: any[] = [
      {name: 'Activo', code: '1'},
      {name: 'Inactivo', code: '0'}
  ];


  marca = new Marca();

  page: number = 0;
  first: number = 0;
  last: number = 0;
  rows: number = 10;

  isFirst: boolean = true;
  isLast: boolean = false;
  totalRecords: number = 0;
  numberElements: number = 0;

  marcas: any[] = [];

  msgs: Message[] = [];
  position: string;

  tipoFrm: String = 'Nueva Marca';
  vistaBotonRegistro : boolean = false;
  vistaBotonEdicion : boolean = false;
  vistaCarga : boolean = true;

  loading: boolean = true; 
  txtBuscar: String = '';


  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private marcaService:MarcaService,
                private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService) {
    this.breadcrumbService.setItems([
        { label: 'Tablas Base' },
        { label: 'Gestión de Marcas', routerLink: ['/tablas/marca'] }
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
      return this.isLast;
  }

  isFirstPage(): boolean {
      return this.isFirst;
  }

  setFocusTipo() {    

    this.changeDetectorRef.detectChanges();
    this.inputNombre.nativeElement.focus();

  }

  //Carga de Data
/*
  listarMain() {

    this.marcaService.listar().subscribe(data => {
      
      this.marcas = data;
    });
  }*/

  loadData(event: LazyLoadEvent) { 
    this.loading = true; 
    this.rows = event.rows;
    this.page = event.first / this.rows;

    this.listarPageMain(this.page, this.rows);

  }

  listarPageMain(p: number, s:number) {

    this.marcaService.listarPageable(p, s, this.txtBuscar).subscribe(data => {
      this.marcas = data.content;
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
    
    this.tipoFrm = 'Nueva Marca' 
    this.vistaRegistro = true;

    this.cancelar();
  }

  cancelar() {

    this.marca = new Marca();

    this.nombre = '';
    this.clsEstado = null;

    this.setFocusTipo();
    
  }

  cerrar(){
    this.vistaRegistro = false;

  }

  editar(data:Marca){
    this.marca = data;

    this.vistaBotonRegistro = false;
    this.vistaBotonEdicion = true;

    this.nombre = this.marca.nombre;
    this.clsEstado =  (this.marca.activo === 1) ?  {name: "Activo", code: this.marca.activo} : {name: "Inactivo", code: this.marca.activo};

    this.tipoFrm = 'Editar Marca' 

    this.vistaRegistro = true;

    this.setFocusTipo();
  }

  eliminar(data:Marca, event: Event){
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

    this.marca.nombre = this.nombre.toString().trim();
    this.marca.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");

    this.marcaService.registrar(this.marca).subscribe(() => {
      this.vistaCarga = false;
      this.loading = true; 
      this.cancelar();
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'La Marca se ha registrado satisfactoriamente'});
   });
    
    
    /*
    pipe(switchMap(() => {
      return this.marcaService.listar();
    })).subscribe(data => {
      this.vistaCarga = false;
      //this.marcaService.marcas.next(data);
      this.messageService.add({severity:'success', summary:'Confirmado', detail:'La Marca se ha registrado satisfactoriamente'});
      this.cancelar();
      this.marcas = data;
    });*/

  }

  editarConfirmado(){
    this.vistaCarga = true;

    let marcaEdit = new Marca();
    marcaEdit = JSON.parse(JSON.stringify(this.marca));

    marcaEdit.nombre = this.nombre.toString().trim();
    marcaEdit.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");

    this.marcaService.modificar(marcaEdit).subscribe(() => {
      this.loading = true; 
      this.vistaCarga = false;
      this.cancelar();
      this.cerrar();
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'La Marca se ha editado satisfactoriamente'});
   });

  }

  eliminarConfirmado(data:Marca){
    this.vistaCarga = true;
    this.marcaService.eliminar(data.id).subscribe(() => {
      this.loading = true; 
      this.vistaCarga = false;
      if(this.numberElements <= 1 && this.page > 0){
        this.page--;
      }
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'La Marca se ha eliminado satisfactoriamente'});
   });

  }


  alta(data:Marca, event: Event){
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Está seguro de Activar la marca?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Activación',
      accept: () => {
        let msj : string = 'La Marca se ha activado satisfactoriamente';
        let valor: number = 1;
       this.altaBaja(data, valor, msj);
      },
      reject: () => {
      }
  });
    
  }

  baja(data:Marca, event: Event){
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Está seguro de Desactivar la marca?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Desactivación',
      accept: () => {
        let msj : string = 'La Marca se ha desactivado satisfactoriamente';
        let valor: number = 0;
        this.altaBaja(data, valor, msj);
      },
      reject: () => {
      }
  });
    
  }

  altaBaja(data:Marca, valor: number, msj: string){
    //this.vistaCarga = true;
    
    this.marcaService.altaBaja(data.id, valor).subscribe(() => {
      this.loading = true; 
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: msj});
   });

  }

}
