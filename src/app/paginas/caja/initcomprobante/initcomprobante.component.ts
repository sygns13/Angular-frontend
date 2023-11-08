import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import { InitComprobanteService } from '../../../_service/init_comprobante.service';
import { TipoComprobanteService } from '../../../_service/tipo_comprobante.service';
import { AlmacenService } from '../../../_service/almacen.service';
import { switchMap } from 'rxjs/operators';
import { ConfirmationService, MessageService} from 'primeng/api';
import { Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { InitComprobante } from '../../../_model/init_comprobante';
import { TipoComprobante } from '../../../_model/tipo_comprobante';
import { Almacen } from '../../../_model/almacen';
import { LazyLoadEvent } from 'primeng/api';


@Component({
  selector: 'app-initcomprobante',
  templateUrl: './initcomprobante.component.html',
  styleUrls: ['./initcomprobante.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InitcomprobanteComponent implements OnInit {
  @ViewChild('inputletraSerie', { static: false }) inputletraSerie: ElementRef;

  vistaRegistro: boolean = false;


  letraSerie: string = '';
  numSerie: number = 0;
  numero: number = 0;
  clsTipoComprobante: any = null;
  clsAlmacen: any = null;
  clsAlmacen_registro: any = null;

  clsEstado: any = null;

  estados: any[] = [
      {name: 'Activo', code: '1'},
      {name: 'Inactivo', code: '0'}
  ];


  initComprobante = new InitComprobante();

  page: number = 0;
  first: number = 0;
  last: number = 0;
  rows: number = 10;

  isFirst: boolean = true;
  isLast: boolean = false;
  totalRecords: number = 0;
  numberElements: number = 0;

  initComprobantes: InitComprobante[] = [];

  msgs: Message[] = [];
  position: string;

  tipoFrm: string = 'Nuevo Inicio de Comprobante';
  vistaBotonRegistro : boolean = false;
  vistaBotonEdicion : boolean = false;
  vistaCarga : boolean = true;

  loading: boolean = true; 
  txtBuscar: string = '';

  tipo_comprobante_id: number = 0;
  almacen_id: number = -1;

  tipoComprobantes: any[] = [];
  almacenes: any[] = [];


  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef,
                private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService,
                private tipoComprobanteService: TipoComprobanteService, private almacenService: AlmacenService,
                private initComprobanteService:InitComprobanteService) {
    this.breadcrumbService.setItems([
        { label: 'Caja' },
        { label: 'Iniciar Comprobantes', routerLink: ['/caja/init-comprobantes'] }
    ]);

}

  ngOnInit(): void {
    this.getTipoComprobantes();
    this.getAlmacenes();
    this.listarPageMain(this.page, this.rows, this.tipo_comprobante_id, this.almacen_id);
    this.primengConfig.ripple = true;
    this.vistaCarga = false;
  }

  next() {
    this.page++;
    this.listarPageMain(this.page, this.rows, this.tipo_comprobante_id, this.almacen_id);
  }

  prev() {
      this.page--;
      this.listarPageMain(this.page, this.rows, this.tipo_comprobante_id, this.almacen_id);
  }

  reset() {
      this.first = 0;
      this.listarPageMain(this.page, this.rows, this.tipo_comprobante_id, this.almacen_id);
  }

  isLastPage(): boolean {
      //return this.bancos ? this.first > (this.bancos.length - this.rows): true;
      return this.isLast;
  }

  isFirstPage(): boolean {
      return this.isFirst;
  }

  setFocusLetraSerie() {    

    this.changeDetectorRef.detectChanges();
    this.inputletraSerie.nativeElement.focus();

  }

  //Carga de Data
  /*
  listarMain() {

    this.bancoService.listar().subscribe(data => {
      
      this.bancos = data;
    });
  }*/

  getTipoComprobantes() {

    this.clsTipoComprobante = null;
    this.tipoComprobantes = [];

    this.tipoComprobanteService.listarAll().subscribe(data => {
      data.forEach(tipoComprobante => {
        this.tipoComprobantes.push({name: tipoComprobante.nombre, code: tipoComprobante.id});
      });
    });
  }
  getAlmacenes() {

    this.clsAlmacen_registro = null;
    this.almacenes = [];

    this.almacenes.push({name: 'GENERAL (TODOS LOS LOCALES)', code: 0});

    this.almacenService.listarAll().subscribe(data => {
      data.forEach(almacen => {
        this.almacenes.push({name: almacen.nombre, code: almacen.id});
      });
    });
  }

  loadData(event: LazyLoadEvent) { 
    this.loading = true; 
    this.rows = event.rows;
    this.page = event.first / this.rows;

    this.listarPageMain(this.page, this.rows, this.tipo_comprobante_id, this.almacen_id);

  }

  listarPageMain(p: number, s:number, tipo_comprobante_id:number, almacen_id:number) {

    this.initComprobanteService.listarPageable(p, s, this.txtBuscar, tipo_comprobante_id, almacen_id).subscribe(data => {
      this.initComprobantes = data.content;
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
    this.listarPageMain(this.page , this.rows, this.tipo_comprobante_id, this.almacen_id);
  }

  //Funciones crud


  nuevo() {

    this.vistaBotonRegistro = true;
    this.vistaBotonEdicion = false;
    this.tipoFrm = 'Nuevo Inicio de Comprobante' 
    this.vistaRegistro = true;

    this.cancelar();
  }

  cancelar() {

    this.initComprobante = new InitComprobante();

    this.numSerie = null;
    this.letraSerie = '';
    this.numero = null;
    this.clsTipoComprobante = null;
    this.clsAlmacen_registro = null;

    this.clsEstado = null;

    this.setFocusLetraSerie();
    
  }

  cerrar(){
    this.vistaRegistro = false;
  }

  editar(data:InitComprobante){
    this.initComprobante = data;

    this.vistaBotonRegistro = false;
    this.vistaBotonEdicion = true;
    this.numSerie = this.initComprobante.numSerie;
    this.letraSerie = this.initComprobante.letraSerie;
    this.numero = this.initComprobante.numero;

    this.clsTipoComprobante = {name: this.initComprobante.tipoComprobante.nombre, code: this.initComprobante.tipoComprobante.id};
    this.clsAlmacen_registro = {name: this.initComprobante.almacen.nombre, code: this.initComprobante.almacen.id};

    console.log(this.initComprobante);

    this.clsEstado =  (this.initComprobante.activo === 1) ?  {name: "Activo", code: this.initComprobante.activo} : {name: "Inactivo", code: this.initComprobante.activo};
    this.tipoFrm = 'Editar Inicio de Comprobante' 
    this.vistaRegistro = true;

    this.setFocusLetraSerie();
    console.log(this.clsAlmacen_registro);
  }

  eliminar(data:InitComprobante, event: Event){
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

    let tipoComprobanteBase = new TipoComprobante();
    let almacenBase = new Almacen();

    tipoComprobanteBase.id = parseInt((this.clsTipoComprobante != null) ? this.clsTipoComprobante.code : "0");
    almacenBase.id = parseInt((this.clsAlmacen_registro != null) ? this.clsTipoComprobante.code : "0");

    this.initComprobante.tipoComprobante = tipoComprobanteBase;
    this.initComprobante.almacen = almacenBase;

    this.initComprobante.almacenId = almacenBase.id;
    this.initComprobante.numSerie = this.numSerie;
    this.initComprobante.letraSerie = this.letraSerie.toString().trim();
    this.initComprobante.numero = this.numero;


    this.initComprobante.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");

   this.initComprobanteService.registrar(this.initComprobante).subscribe({
    next: c => {
      this.vistaCarga = false;
      this.loading = true; 
      this.cancelar();
      this.cerrar();
      this.listarPageMain(this.page, this.rows, this.tipo_comprobante_id, this.almacen_id);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Inicio de Comprobante se ha registrado satisfactoriamente'});
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

    let initComprobanteEdit = new InitComprobante();
    initComprobanteEdit = JSON.parse(JSON.stringify(this.initComprobante));

    let tipoComprobanteBase = new TipoComprobante();
    let almacenBase = new Almacen();

    tipoComprobanteBase.id = parseInt((this.clsTipoComprobante != null) ? this.clsTipoComprobante.code : "0");
    almacenBase.id = parseInt((this.clsAlmacen_registro != null) ? this.clsAlmacen_registro.code : "0");

    initComprobanteEdit.tipoComprobante = tipoComprobanteBase;
    initComprobanteEdit.almacen = almacenBase;

    initComprobanteEdit.almacenId = almacenBase.id;
    initComprobanteEdit.numSerie = this.numSerie;
    initComprobanteEdit.letraSerie = this.letraSerie.toString().trim();
    initComprobanteEdit.numero = this.numero;


    initComprobanteEdit.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");


    this.initComprobanteService.modificar(initComprobanteEdit).subscribe({
      next: c => {
      this.loading = true; 
      this.vistaCarga = false;
      this.cancelar();
      this.cerrar();
      this.listarPageMain(this.page, this.rows, this.tipo_comprobante_id, this.almacen_id);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Inicio de Comprobante se ha editado satisfactoriamente'});
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

  eliminarConfirmado(data:InitComprobante){
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
   this.initComprobanteService.eliminar(data.id).subscribe({
    next: c => {
      this.loading = true; 
      this.vistaCarga = false;
      if(this.numberElements <= 1 && this.page > 0){
        this.page--;
      }
      this.listarPageMain(this.page, this.rows, this.tipo_comprobante_id, this.almacen_id);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Inicio de Comprobante se ha eliminado satisfactoriamente'});
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
  

  alta(data:InitComprobante, event: Event){
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Está seguro de Activar el Inicio de Comprobante?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Activación',
      accept: () => {
        let msj : string = 'El Inicio de Comprobante se ha activado satisfactoriamente';
        let valor: number = 1;
        this.altaBaja(data, valor, msj);
        },
        reject: () => {
        }
    });
    
  }

  baja(data:InitComprobante, event: Event){
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Está seguro de Desactivar el Inicio de Comprobante?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Desactivación',
      accept: () => {
        let msj : string = 'El Inicio de Comprobante se ha desactivado satisfactoriamente';
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

  altaBaja(data:InitComprobante, valor: number, msj: string){
    this.vistaCarga = true;
    this.initComprobanteService.altaBaja(data.id, valor).subscribe({
      next: c => {
       this.loading = true; 
       this.vistaCarga = false;
       this.listarPageMain(this.page, this.rows, this.tipo_comprobante_id, this.almacen_id);
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
