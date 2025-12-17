import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { AppBreadcrumbService } from '../../../menu/app.breadcrumb.service';
import { UnidadService } from '../../../_service/unidad.service';
import { switchMap } from 'rxjs/operators';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { Unidad } from '../../../_model/unidad';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-unidad',
  templateUrl: './unidad.component.html',
  styleUrls: ['./unidad.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class UnidadComponent implements OnInit {

  @ViewChild('inputNombre', { static: false }) inputNombre: ElementRef;

  vistaRegistro: boolean = false;


  nombre: String = '';
  cantidad: number = null;
  abreviatura: string = '';
  clsEstado: any = null;

  estados: any[] = [
    { name: 'Activo', code: '1' },
    { name: 'Inactivo', code: '0' }
  ];


  unidad = new Unidad();

  page: number = 0;
  first: number = 0;
  last: number = 0;
  rows: number = 10;

  isFirst: boolean = true;
  isLast: boolean = false;
  totalRecords: number = 0;
  numberElements: number = 0;

  unidads: any[] = [];

  msgs: Message[] = [];
  position: string;

  tipoFrm: String = 'Nueva Unidad';
  vistaBotonRegistro: boolean = false;
  vistaBotonEdicion: boolean = false;
  vistaCarga: boolean = true;

  loading: boolean = true;
  txtBuscar: String = '';


  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef, private unidadService: UnidadService,
    private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig, private messageService: MessageService) {
    this.breadcrumbService.setItems([
      { label: 'Tablas Base' },
      { label: 'Gestión de Unidades', routerLink: ['/tablas/unidades'] }
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

  setFocusTipo(): void {

    this.changeDetectorRef.detectChanges();
    this.inputNombre.nativeElement.focus();

  }

  soloNumeros(e: { charCode: any; preventDefault: () => void; }): boolean {

    let key = e.charCode;
    if ((key >= 48 && key <= 57) || (key == 8) || (key == 35) || (key == 34) || (key == 46)) {
      return true;
    }
    else {
      e.preventDefault();
    }
  }

  //Carga de Data
  /*
    listarMain() {
  
      this.unidadService.listar().subscribe(data => {
        
        this.unidads = data;
      });
    }*/

  loadData(event: LazyLoadEvent) {
    this.loading = true;
    this.rows = event.rows;
    this.page = event.first / this.rows;

    this.listarPageMain(this.page, this.rows);

  }

  listarPageMain(p: number, s: number) {

    this.unidadService.listarPageable(p, s, this.txtBuscar).subscribe(data => {
      this.unidads = data.content;
      this.isFirst = data.first;
      this.isLast = data.last;
      this.numberElements = data.numberOfElements;
      this.first = (p * s);
      this.last = (p * s) + this.numberElements;
      this.totalRecords = data.totalElements;
      this.loading = false;
    });
  }

  buscar() {
    this.page = 0;
    this.listarPageMain(this.page, this.rows);
  }

  //Funciones crud


  nuevo() {

    this.vistaBotonRegistro = true;
    this.vistaBotonEdicion = false;

    this.tipoFrm = 'Nueva Unidad'
    this.vistaRegistro = true;

    this.cancelar();
  }

  cancelar() {

    this.unidad = new Unidad();

    this.nombre = '';
    this.cantidad = null;
    this.abreviatura = '';
    this.clsEstado = null;

    this.setFocusTipo();

  }

  cerrar() {
    this.vistaRegistro = false;

  }

  editar(data: Unidad) {
    this.unidad = data;

    this.vistaBotonRegistro = false;
    this.vistaBotonEdicion = true;

    this.nombre = this.unidad.nombre;
    this.cantidad = this.unidad.cantidad;
    this.abreviatura = this.unidad.abreviatura;
    this.clsEstado = (this.unidad.activo === 1) ? { name: "Activo", code: this.unidad.activo } : { name: "Inactivo", code: this.unidad.activo };

    this.tipoFrm = 'Editar Unidad'

    this.vistaRegistro = true;

    this.setFocusTipo();
  }

  eliminar(data: Unidad, event: Event) {
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


  registrarConfirmado() {

    this.vistaCarga = true;

    this.unidad.nombre = this.nombre.toString().trim();
    this.unidad.cantidad = +this.cantidad;
    this.unidad.abreviatura = this.abreviatura.toString().trim();
    this.unidad.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");

    this.unidadService.registrar(this.unidad).subscribe({
      next: (data) => {
        this.vistaCarga = false;
        this.loading = true;
        this.cancelar();
        this.listarPageMain(this.page, this.rows);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'La Unidad se ha registrado satisfactoriamente' });
      },
      error: (err) => {
        this.vistaCarga = false;
        console.log(err);
      }
    });


  }

  editarConfirmado() {
    this.vistaCarga = true;

    let unidadEdit = new Unidad();
    unidadEdit = structuredClone(this.unidad);

    unidadEdit.nombre = this.nombre.toString().trim();
    unidadEdit.cantidad = +this.cantidad;
    unidadEdit.abreviatura = this.abreviatura.toString().trim();
    unidadEdit.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");

    this.unidadService.modificar(unidadEdit).subscribe({
      next: (data) => {
        this.loading = true;
        this.vistaCarga = false;
        this.cancelar();
        this.cerrar();
        this.listarPageMain(this.page, this.rows);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'a Unidad se ha editado satisfactoriamente' });
      },
      error: (err) => {
        this.vistaCarga = false;
        console.log(err);
      }
    });

  }

  eliminarConfirmado(data: Unidad) {
    this.vistaCarga = true;
    this.unidadService.eliminar(data.id).subscribe({
      next: (data) => {
        this.loading = true;
        this.vistaCarga = false;
        if (this.numberElements <= 1 && this.page > 0) {
          this.page--;
        }
        this.listarPageMain(this.page, this.rows);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'La Unidad se ha eliminado satisfactoriamente' });
      },
      error: (err) => {
        this.vistaCarga = false;
        console.log(err);
      }
    });

  }


  alta(data: Unidad, event: Event) {
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Está seguro de Activar la unidad?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Activación',
      accept: () => {
        let msj: string = 'La Unidad se ha activado satisfactoriamente';
        let valor: number = 1;
        this.altaBaja(data, valor, msj);
      },
      reject: () => {
      }
    });

  }

  baja(data: Unidad, event: Event) {
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Está seguro de Desactivar la unidad?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Desactivación',
      accept: () => {
        let msj: string = 'La Unidad se ha desactivado satisfactoriamente';
        let valor: number = 0;
        this.altaBaja(data, valor, msj);
      },
      reject: () => {
      }
    });

  }

  altaBaja(data: Unidad, valor: number, msj: string) {
    this.vistaCarga = true;

    this.unidadService.altaBaja(data.id, valor).subscribe({
      next: (data) => {
        this.loading = true;
        this.vistaCarga = false;
        this.listarPageMain(this.page, this.rows);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: msj });
      },
      error: (err) => {
        this.vistaCarga = false;
        console.log(err);
      }
    });

  }

}
