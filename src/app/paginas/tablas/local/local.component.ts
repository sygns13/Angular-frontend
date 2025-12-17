import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { AppBreadcrumbService } from '../../../menu/app.breadcrumb.service';
import { AlmacenService } from './../../../_service/almacen.service';
import { switchMap } from 'rxjs/operators';
import { Almacen } from './../../../_model/almacen';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-local',
  templateUrl: './local.component.html',
  styleUrls: ['./local.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
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
    { name: 'Activo', code: '1' },
    { name: 'Inactivo', code: '0' }
  ];
  departamentos: any[] = [];
  provincias: any[] = [];
  distritos: any[] = [];

  almacen = new Almacen();

  page: number = 0;
  first: number = 0;
  last: number = 0;
  rows: number = 10;

  isFirst: boolean = true;
  isLast: boolean = false;
  totalRecords: number = 0;
  numberElements: number = 0;

  almacens: any[] = [];

  msgs: Message[] = [];
  position: string;

  tipoFrm: String = 'Nuevo Local';
  vistaBotonRegistro: boolean = false;
  vistaBotonEdicion: boolean = false;
  vistaCarga: boolean = true;

  loading: boolean = true;
  txtBuscar: String = '';



  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef, private almacenService: AlmacenService,
    private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig, private messageService: MessageService) {
    this.breadcrumbService.setItems([
      { label: 'Tablas Base' },
      { label: 'Gestión de Locales', routerLink: ['/tablas/locales'] }
    ]);

  }

  ngOnInit(): void {
    this.getDepartamentos();
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

  getDepartamentos() {

    this.clsProvincia = null;
    this.clsDistrito = null;
    this.provincias = [];
    this.distritos = [];

    this.almacenService.getDepartamentos(1).subscribe(data => {
      data.forEach(dep => {
        this.departamentos.push({ name: dep.nombre, code: dep.id });
      });
    });
  }

  getProvincias() {

    if (this.clsDepartamento == null) {
      this.provincias = [];
      this.distritos = [];
      this.clsProvincia = null;
      this.clsDistrito = null;
    }
    else {
      this.provincias = [];
      this.distritos = [];
      this.clsProvincia = null;
      this.clsDistrito = null;

      this.almacenService.getProvincias(this.clsDepartamento.code).subscribe(data => {
        data.forEach(dep => {
          this.provincias.push({ name: dep.nombre, code: dep.id });
        });
      });
    }

  }

  getDistritos() {

    if (this.clsProvincia == null) {
      this.distritos = [];
      this.clsDistrito = null;
    }
    else {
      this.distritos = [];
      this.clsDistrito = null;

      this.almacenService.getDistritos(this.clsProvincia.code).subscribe(data => {
        data.forEach(dep => {
          this.distritos.push({ name: dep.nombre, code: dep.id });
        });
      });
    }

  }


  getProvinciasEd(dataAlmacen: Almacen) {

    if (this.clsDepartamento == null) {

      this.provincias = [];
      this.distritos = [];
      this.clsProvincia = null;
      this.clsDistrito = null;

    }
    else {
      this.provincias = [];
      this.distritos = [];
      this.clsProvincia = null;
      this.clsDistrito = null;

      this.almacenService.getProvincias(this.clsDepartamento.code).subscribe(data => {
        data.forEach(dep => {
          this.provincias.push({ name: dep.nombre, code: dep.id });
        });
        this.clsProvincia = { name: dataAlmacen.provincia.nombre, code: dataAlmacen.provincia.id };
        this.getDistritosEd(dataAlmacen)
      });
    }
  }

  getDistritosEd(dataAlmacen: Almacen) {

    if (this.clsProvincia == null) {
      this.distritos = [];
      this.clsDistrito = null;
    }
    else {
      this.distritos = [];
      this.clsDistrito = null;

      this.almacenService.getDistritos(this.clsProvincia.code).subscribe(data => {
        data.forEach(dep => {
          this.distritos.push({ name: dep.nombre, code: dep.id });
        });
        this.clsDistrito = { name: dataAlmacen.distrito.nombre, code: dataAlmacen.distrito.id };
      });

    }

  }
  /*
    listarMain() {
  
      this.almacenService.listar().subscribe(data => {
        
        this.almacens = data;
      });
    }*/

  loadData(event: LazyLoadEvent) {
    this.loading = true;
    this.rows = event.rows;
    this.page = event.first / this.rows;

    this.listarPageMain(this.page, this.rows);

  }

  listarPageMain(p: number, s: number) {

    this.almacenService.listarPageable(p, s, this.txtBuscar).subscribe(data => {
      this.almacens = data.content;
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

  cerrar() {
    this.vistaRegistro = false;

  }

  editar(data: Almacen) {
    this.almacen = data;

    this.vistaBotonRegistro = false;
    this.vistaBotonEdicion = true;

    this.clsDepartamento = { name: this.almacen.departamento.nombre, code: this.almacen.departamento.id };
    this.clsProvincia = null;
    this.clsDistrito = null;
    this.nombre = this.almacen.nombre;
    this.codigo = this.almacen.codigo;
    this.direccion = this.almacen.direccion;
    this.clsEstado = (this.almacen.activo === 1) ? { name: "Activo", code: this.almacen.activo } : { name: "Inactivo", code: this.almacen.activo };

    this.tipoFrm = 'Editar Local'

    this.getProvinciasEd(this.almacen);

    this.vistaRegistro = true;

    this.setFocusNombre();


  }

  eliminar(data: Almacen, event: Event) {
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

    this.almacen.nombre = this.nombre.toString().trim();
    this.almacen.codigo = this.codigo.toString().trim();
    this.almacen.direccion = this.direccion.toString().trim();
    this.almacen.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");
    this.almacen.distritoId = parseInt((this.clsDistrito != null) ? this.clsDistrito.code : "");

    this.almacenService.registrar(this.almacen).subscribe({
      next: (data) => {
        this.vistaCarga = false;
        this.loading = true;
        this.cancelar();
        this.listarPageMain(this.page, this.rows);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'El local se ha registrado satisfactoriamente' });
      },
      error: (err) => {
        this.vistaCarga = false;
        console.log(err);
      }
    });


    /*
        this.almacenService.registrar(this.almacen).pipe(switchMap(() => {
          return this.almacenService.listar();
        })).subscribe(data => {
          this.vistaCarga = false;
          //this.almacenService.almacens.next(data);
          this.messageService.add({severity:'success', summary:'Confirmado', detail:'El local se ha registrado satisfactoriamente'});
          this.cancelar();
          this.almacens = data;
        });*/

  }

  editarConfirmado() {
    this.vistaCarga = true;

    let almacenEdit = new Almacen();
    almacenEdit = structuredClone(this.almacen);

    almacenEdit.nombre = this.nombre.toString().trim();
    almacenEdit.codigo = this.codigo.toString().trim();
    almacenEdit.direccion = this.direccion.toString().trim();
    almacenEdit.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");
    almacenEdit.distritoId = parseInt((this.clsDistrito != null) ? this.clsDistrito.code : "");

    this.almacenService.modificar(almacenEdit).subscribe({
      next: (data) => {
        this.loading = true;
        this.vistaCarga = false;
        this.cancelar();
        this.cerrar();
        this.listarPageMain(this.page, this.rows);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'El local se ha editado satisfactoriamente' });
      },
      error: (err) => {
        this.vistaCarga = false;
        console.log(err);
      }
    });

  }

  eliminarConfirmado(data: Almacen) {
    this.vistaCarga = true;
    this.almacenService.eliminar(data.id).subscribe({
      next: (data) => {
        this.loading = true;
        this.vistaCarga = false;
        if (this.numberElements <= 1 && this.page > 0) {
          this.page--;
        }
        this.listarPageMain(this.page, this.rows);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'El local se ha eliminado satisfactoriamente' });
      },
      error: (err) => {
        this.vistaCarga = false;
        console.log(err);
      }
    });

  }


  alta(data: Almacen, event: Event) {
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Está seguro de Activar el local?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Activación',
      accept: () => {
        let msj: string = 'El local se ha activado satisfactoriamente';
        let valor: number = 1;
        this.altaBaja(data, valor, msj);
      },
      reject: () => {
      }
    });

  }

  baja(data: Almacen, event: Event) {
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Está seguro de Desactivar el registro?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Desactivación',
      accept: () => {
        let msj: string = 'El local se ha desactivado satisfactoriamente';
        let valor: number = 0;
        this.altaBaja(data, valor, msj);
      },
      reject: () => {
      }
    });

  }

  altaBaja(data: Almacen, valor: number, msj: string) {
    this.vistaCarga = true;

    this.almacenService.altaBaja(data.id, valor).subscribe({
      next: (data) => {
        this.vistaCarga = false;
        this.loading = true;
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
