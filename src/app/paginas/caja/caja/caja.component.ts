import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import {AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import {CajaService } from '../../../_service/caja.service';
import { switchMap } from 'rxjs/operators';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import {Caja } from '../../../_model/caja';
import { LazyLoadEvent } from 'primeng/api';
import { InventarioService } from '../../../_service/inventario.service';
import { Almacen } from 'src/app/_model/almacen';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class CajaComponent implements OnInit {

  @ViewChild('inputNombre', { static: false }) inputNombre: ElementRef;

  vistaRegistro: boolean = false;


  nombre: String = '';
  clsEstado: any = null;
  clsAlmacen: any = null;
  clsAlmacen_registro: any = null;

  estados: any[] = [
      {name: 'Activo', code: '1'},
      {name: 'Inactivo', code: '0'}
  ];
  almacens_registo: any[] = [];
  almacens: any[] = [];


  caja = new Caja();

  page: number = 0;
  first: number = 0;
  last: number = 0;
  rows: number = 10;

  isFirst: boolean = true;
  isLast: boolean = false;
  totalRecords: number = 0;
  numberElements: number = 0;

  cajas: any[] = [];

  msgs: Message[] = [];
  position: string;

  tipoFrm: String = 'Nueva Caja';
  vistaBotonRegistro : boolean = false;
  vistaBotonEdicion : boolean = false;
  vistaCarga : boolean = true;

  loading: boolean = true; 
  txtBuscar: String = '';


  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private cajaService:CajaService,
                private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService,
                private inventarioService: InventarioService) {
    this.breadcrumbService.setItems([
        { label: 'Caja' },
        { label: 'Registro de Cajas de Ventas', routerLink: ['/caja/cajas'] }
    ]);

}

  ngOnInit(): void {
    this.getAlmacens();
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
  getAlmacens() {

    this.clsAlmacen = null;
    this.almacens = [];
    this.almacens_registo = [];
  
    this.inventarioService.getAlmacens().subscribe(data => {

      this.almacens.push({name: "General - Todas", code: 0});
      this.clsAlmacen = {name: "General - Todas", code: 0};


      data.forEach(almacen => {
        this.almacens.push({name: almacen.nombre, code: almacen.id});
        this.almacens_registo.push({name: almacen.nombre, code: almacen.id});
      });

      this.listarPageMain(this.page, this.rows);
    
    });
  }

  cambioSucursal(event: Event){

  }

  loadData(event: LazyLoadEvent) { 
    this.loading = true; 
    this.rows = event.rows;
    this.page = event.first / this.rows;

    this.listarPageMain(this.page, this.rows);

  }

  listarPageMain(p: number, s:number) {

    let _idAlmacen = (this.clsAlmacen != null) ? this.clsAlmacen.code : 0;
    
    this.cajaService.listarAllByAlmacen(this.txtBuscar, _idAlmacen).subscribe(data => {
      this.cajas = data;

      this.almacens_registo.forEach(almacen => {
        let count = 0;
        this.cajas.forEach(caja => {
          if(caja.almacen.id == almacen.code){
            count++;
            caja.countIdx = count;
          }
        });
      });
      /* this.cajas = data.content;
      this.isFirst = data.first;
      this.isLast = data.last;
      this.numberElements = data.numberOfElements;
      this.first = (p * s);
      this.last = (p * s) + this.numberElements;
      this.totalRecords = data.totalElements; */
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
    
    this.tipoFrm = 'Nueva Caja' 
    this.vistaRegistro = true;

    this.cancelar();
  }

  cancelar() {

    this.caja = new Caja();

    this.nombre = '';
    this.clsEstado = null;
    this.clsAlmacen_registro = null;

    this.setFocusTipo();
    
  }

  cerrar(){
    this.vistaRegistro = false;

  }

  editar(data:Caja){
    this.caja = data;

    this.vistaBotonRegistro = false;
    this.vistaBotonEdicion = true;

    this.nombre = this.caja.nombre;
    this.clsEstado =  (this.caja.activo === 1) ?  {name: "Activo", code: this.caja.activo} : {name: "Inactivo", code: this.caja.activo};
    this.clsAlmacen_registro = {name: this.caja.almacen.nombre, code: this.caja.almacen.id};

    this.tipoFrm = 'Editar Caja' 

    this.vistaRegistro = true;

    this.setFocusTipo();
  }

  eliminar(data:Caja, event: Event){
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

    this.caja.nombre = this.nombre.toString().trim();
    this.caja.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");

    let _almacen = new Almacen();
    _almacen.id = parseInt((this.clsAlmacen_registro != null) ? this.clsAlmacen_registro.code : "0");
    this.caja.almacen = _almacen;

    this.cajaService.registrar(this.caja).subscribe({
      next: (data) => {
      this.vistaCarga = false;
      this.loading = true; 
      this.cancelar();
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'La Caja se ha registrado satisfactoriamente'});
    },
    error: (err) => {
      this.vistaCarga = false;
      console.log(err);
    }        
  });
  
    
    
    /*
    pipe(switchMap(() => {
      return this.cajaService.listar();
    })).subscribe(data => {
      this.vistaCarga = false;
      //this.cajaService.cajas.next(data);
      this.messageService.add({severity:'success', summary:'Confirmado', detail:'La Caja se ha registrado satisfactoriamente'});
      this.cancelar();
      this.cajas = data;
    });*/

  }

  editarConfirmado(){
    this.vistaCarga = true;

    let cajaEdit = new Caja();
    cajaEdit = structuredClone(this.caja);

    cajaEdit.nombre = this.nombre.toString().trim();
    cajaEdit.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");

    let _almacen = new Almacen();
    _almacen.id = parseInt((this.clsAlmacen_registro != null) ? this.clsAlmacen_registro.code : "0");
    cajaEdit.almacen = _almacen;

    this.cajaService.modificar(cajaEdit).subscribe({
      next: (data) => {
      this.loading = true; 
      this.vistaCarga = false;
      this.cancelar();
      this.cerrar();
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'La Caja se ha editado satisfactoriamente'});
    },
    error: (err) => {
      this.vistaCarga = false;
      console.log(err);
    }        
  });
  

  }

  eliminarConfirmado(data:Caja){
    this.vistaCarga = true;
    this.cajaService.eliminar(data.id).subscribe({
      next: (data) => {
      this.loading = true; 
      this.vistaCarga = false;
      if(this.numberElements <= 1 && this.page > 0){
        this.page--;
      }
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'La Caja se ha eliminado satisfactoriamente'});
    },
    error: (err) => {
      this.vistaCarga = false;
      console.log(err);
    }        
  });
  

  }


  alta(data:Caja, event: Event){
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Está seguro de Activar la caja?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Activación',
      accept: () => {
        let msj : string = 'La Caja se ha activado satisfactoriamente';
        let valor: number = 1;
       this.altaBaja(data, valor, msj);
      },
      reject: () => {
      }
  });
    
  }

  baja(data:Caja, event: Event){
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Está seguro de Desactivar la caja?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Desactivación',
      accept: () => {
        let msj : string = 'La Caja se ha desactivado satisfactoriamente';
        let valor: number = 0;
        this.altaBaja(data, valor, msj);
      },
      reject: () => {
      }
  });
    
  }

  altaBaja(data:Caja, valor: number, msj: string){
    this.vistaCarga = true;
    
    this.cajaService.altaBaja(data.id, valor).subscribe({
      next: (data) => {
      this.loading = true; 
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: msj});
    },
    error: (err) => {
      this.vistaCarga = false;
      console.log(err);
    }        
  });
  

  }

}
