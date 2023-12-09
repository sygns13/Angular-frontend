import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import {AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import {BancoService } from '../../../_service/banco.service';
import { switchMap } from 'rxjs/operators';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import {Banco } from '../../../_model/banco';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-banco',
  templateUrl: './banco.component.html',
  styleUrls: ['./banco.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BancoComponent implements OnInit {

  @ViewChild('inputNombre', { static: false }) inputNombre: ElementRef;

  vistaRegistro: boolean = false;


  nombre: String = '';
  dir: String = '';
  clsEstado: any = null;

  estados: any[] = [
      {name: 'Activo', code: '1'},
      {name: 'Inactivo', code: '0'}
  ];


  banco = new Banco();

  page: number = 0;
  first: number = 0;
  last: number = 0;
  rows: number = 10;

  isFirst: boolean = true;
  isLast: boolean = false;
  totalRecords: number = 0;
  numberElements: number = 0;

  bancos: any[] = [];

  msgs: Message[] = [];
  position: string;

  tipoFrm: String = 'Nuevo Banco';
  vistaBotonRegistro : boolean = false;
  vistaBotonEdicion : boolean = false;
  vistaCarga : boolean = true;

  loading: boolean = true; 
  txtBuscar: String = '';


  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private bancoService:BancoService,
                private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService) {
    this.breadcrumbService.setItems([
        { label: 'Tablas Base' },
        { label: 'Gestión de Bancos', routerLink: ['/tablas/bancos'] }
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
    this.inputNombre.nativeElement.focus();

  }

  //Carga de Data
  /*
  listarMain() {

    this.bancoService.listar().subscribe(data => {
      
      this.bancos = data;
    });
  }*/

  loadData(event: LazyLoadEvent) { 
    this.loading = true; 
    this.rows = event.rows;
    this.page = event.first / this.rows;

    this.listarPageMain(this.page, this.rows);

  }

  listarPageMain(p: number, s:number) {

    this.bancoService.listarPageable(p, s, this.txtBuscar).subscribe(data => {
      this.bancos = data.content;
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
    this.tipoFrm = 'Nuevo Banco' 
    this.vistaRegistro = true;

    this.cancelar();
  }

  cancelar() {

    this.banco = new Banco();

    this.nombre = '';
    this.dir = '';
    this.clsEstado = null;

    this.setFocusTipo();
    
  }

  cerrar(){
    this.vistaRegistro = false;
  }

  editar(data:Banco){
    this.banco = data;

    this.vistaBotonRegistro = false;
    this.vistaBotonEdicion = true;
    this.nombre = this.banco.nombre;
    this.dir = this.banco.dir;
    this.clsEstado =  (this.banco.activo === 1) ?  {name: "Activo", code: this.banco.activo} : {name: "Inactivo", code: this.banco.activo};
    this.tipoFrm = 'Editar Banco' 
    this.vistaRegistro = true;

    this.setFocusTipo();
  }

  eliminar(data:Banco, event: Event){
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

    this.banco.nombre = this.nombre.toString().trim();
    this.banco.dir = this.dir.toString().trim();
    this.banco.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");

    /* this.bancoService.registrar(this.banco).subscribe(() => {
      this.vistaCarga = false;
      this.loading = true; 
      this.cancelar();
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Banco se ha registrado satisfactoriamente'});
   }); */
   this.bancoService.registrar(this.banco).subscribe({
    next: c => {
      this.vistaCarga = false;
      this.loading = true; 
      this.cancelar();
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Banco se ha registrado satisfactoriamente'});
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

  editarConfirmado(){
    this.vistaCarga = true;

    let bancoEdit = new Banco();
    bancoEdit = structuredClone(this.banco);

    bancoEdit.nombre = this.nombre.toString().trim();
    bancoEdit.dir = this.dir.toString().trim();
    bancoEdit.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");
    this.bancoService.modificar(bancoEdit).subscribe({
      next: c => {
      this.loading = true; 
      this.vistaCarga = false;
      this.cancelar();
      this.cerrar();
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Banco se ha editado satisfactoriamente'});
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

  eliminarConfirmado(data:Banco){
    this.vistaCarga = true;
    /* this.bancoService.eliminar(data.id).subscribe(() => {
      this.loading = true; 
      this.vistaCarga = false;
      if(this.numberElements <= 1 && this.page > 0){
        this.page--;
      }
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Banco se ha eliminado satisfactoriamente'});
   }); */
   this.bancoService.eliminar(data.id).subscribe({
    next: c => {
      this.loading = true; 
      this.vistaCarga = false;
      if(this.numberElements <= 1 && this.page > 0){
        this.page--;
      }
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Banco se ha eliminado satisfactoriamente'});
    },
    error: error => {
      this.vistaCarga = false;
    },
    complete: () => {
      this.vistaCarga = false;
      console.log('Request complete');
    }
  });
  }
  

  alta(data:Banco, event: Event){
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Está seguro de Activar el banco?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Activación',
      accept: () => {
        let msj : string = 'El Banco se ha activado satisfactoriamente';
        let valor: number = 1;
        this.altaBaja(data, valor, msj);
        },
        reject: () => {
        }
    });
    
  }

  baja(data:Banco, event: Event){
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Está seguro de Desactivar el banco?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Desactivación',
      accept: () => {
        let msj : string = 'El Banco se ha desactivado satisfactoriamente';
        let valor: number = 0;
        this.altaBaja(data, valor, msj);
        },
        reject: () => {
        }
    });
    
  }

  /*
  altaBaja(data:Banco, valor: number, msj: string){
    //this.vistaCarga = true;
    
    this.bancoService.altaBaja(data.id, valor).pipe(switchMap(() => {
      return this.bancoService.listar();
    })).subscribe(data => {
      this.messageService.add({severity:'success', summary:'Confirmado', detail: msj});
      this.bancos = data;
      //this.vistaCarga = false;
    });

  }*/

  altaBaja(data:Banco, valor: number, msj: string){
    this.vistaCarga = true;
    this.bancoService.altaBaja(data.id, valor).subscribe({
      next: c => {
       this.loading = true; 
       this.vistaCarga = false;
       this.listarPageMain(this.page, this.rows);
       this.messageService.add({severity:'success', summary:'Confirmado', detail: msj});
      },
      error: error => {
        this.vistaCarga = false;
      },
      complete: () => {
        this.vistaCarga = false;
        console.log('Request complete');
      }
    });

  }

}