import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import {AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import { ProductoService } from './../../../_service/producto.service';
import { switchMap } from 'rxjs/operators';
import { Producto } from './../../../_model/producto';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';
import { TipoProducto } from './../../../_model/tipo_producto';
import { Marca } from './../../../_model/marca';
import { Presentacion } from './../../../_model/presentacion';
import { InventarioDTO } from './../../../_model/inventario_dto';
import { EntradaSalida } from './../../../_model/entrada_salida';
import { GestionloteService } from 'src/app/_service/gestionlote.service';
import { FiltroGeneral } from './../../../_util/filtro_general';
import { StockService } from './../../../_service/stock.service';
import { LoteService } from './../../../_service/lote.service';
import { EntradaSalidaService } from './../../../_service/entrada-salida.service';
import { Lote } from 'src/app/_model/lote';
import * as moment from 'moment';

@Component({
  selector: 'app-gestionlotes',
  templateUrl: './gestionlotes.component.html',
  styleUrls: ['./gestionlotes.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class GestionlotesComponent implements OnInit {

  @ViewChild('inputPalabraClave', { static: false }) inputPalabraClave: ElementRef;

  @ViewChild('inputNombre', { static: false }) inputNombre: ElementRef;

  @ViewChild('inputCantidad', { static: false }) inputCantidad: ElementRef;

  vistaRegistro: boolean = false;
  tipoFrm: string = 'Registro de Ingreso o Salida de Productos';
  tipoCantidad: string = 'Cantidad de Unidades que Ingresan';
  labelCantidadTotal: string = 'Cantidad Total Actual de Unidades del Lote';
  labelCantidadTotalFinal: string = 'Cantidad Total Final de Unidades del Lote';
  labelFechavencimientoLote: string = 'Fecha de Vencimiento';
  labelMotivo: string = 'Motivo de Ingreso';

  trabajaLotes: string = 'Si';

  palabraClave: string = '';

  prioridades: any[] = [
    {name: 'Alta', code: '1'},
    {name: 'Normal', code: '2'},
    {name: 'Baja', code: '3'}
  ];

  inventario = new InventarioDTO();

  inventarios: any[] = [];
  almacens: any[] = [];
  almacens_registo: any[] = [];
  stockLoteDTOs: any[] = [];

  page: number = 0;
  first: number = 0;
  last: number = 0;
  rows: number = 10;

  isFirst: boolean = true;
  isLast: boolean = false;
  totalRecords: number = 0;
  numberElements: number = 0;

  msgs: Message[] = [];
  vistaCarga : boolean = true;
  loading: boolean = true; 

  clsAlmacen: any = null;

  cantidadTotal: number = null;

  //datos registro
  clsAlmacen_registro: any = null;
  tipos: any[] = [
    {name: 'Ingreso Libre de Productos', code: '1'},
    {name: 'Salida Libre de Productos', code: '0'}
  ];
  tipo: any = {name: 'Ingreso Libre de Productos', code: '1'};
  lotes: any[] = [];
  clsLote: any = null;
  nombre: string = '';
  fechaIngreso: string = '';
  fechaVencimiento: string = '';
  cantidad: number = null;
  cantidadTotalLote: number = null;
  cantidadTotalProcesado: number = null;
  motivo: string = '';

  divNuevoLote : boolean = false;
  divLote : boolean = false;
  disabledInput : boolean = true;
  



  filtroGeneral = new FiltroGeneral();

  selectedProduct: InventarioDTO;

  entradaSalida = new EntradaSalida();

  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private gestionloteService: GestionloteService,  private entradaSalidaService: EntradaSalidaService,
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService , private stockService: StockService, private loteService: LoteService) {
    this.breadcrumbService.setItems([
    { label: 'Almacén' },
    { label: 'Gestión de Salida e Ingreso de Productos', routerLink: ['/almacen/gestion_stocks'] }
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
      //return this.bancos ? this.first > (this.bancos.length - this.rows): true;
      return this.isLast;
  }
  
  isFirstPage(): boolean {
      return this.isFirst;
  }
  
  setFocusNombre() {    
  
    this.changeDetectorRef.detectChanges();
    this.inputPalabraClave.nativeElement.focus();
  
  }

  setFocusNombreLote() {    

    this.changeDetectorRef.detectChanges();
    this.inputNombre.nativeElement.focus();

  }

  setFocusCantidad() {    

    this.changeDetectorRef.detectChanges();
    this.inputCantidad.nativeElement.focus();

  }


  //Carga de Data

  loadData(event: LazyLoadEvent) { 
    this.loading = true; 
    this.rows = event.rows;
    this.page = event.first / this.rows;
  
    this.listarPageMain(this.page, this.rows);
  
  }

  getAlmacens() {

    this.clsAlmacen = null;
    this.almacens = [];

    this.almacens_registo = [];
  
    this.gestionloteService.getAlmacens().subscribe(data => {
  
      this.almacens.push({name: "General - Todas", code: 0});
      this.clsAlmacen = {name: "General - Todas", code: 0};
      data.forEach(almacen => {
        this.almacens.push({name: almacen.nombre, code: almacen.id});
        this.almacens_registo.push({name: almacen.nombre, code: almacen.id});
      });
  
      this.filtroGeneral.almacenId =  this.clsAlmacen.code;
      this.listarPageMain(this.page, this.rows);
  
    });
  }

  listarPageMain(p: number, s:number) {

    this.filtroGeneral.page = p;
    this.filtroGeneral.size = s;
  
    this.loading = true;
  
    this.gestionloteService.getProductoGestionLotes(this.filtroGeneral).subscribe(data => {
      this.inventarios = data.content;
      this.isFirst = data.first;
      this.isLast = data.last;
      this.numberElements = data.numberOfElements;
      this.first = (p * s);
      this.last = (p * s) + this.numberElements;
      this.totalRecords = data.totalElements;
      this.loading = false;
    });
  }

  cambioSucursal(event: Event){
    this.evaluarFiltros();
    this.listarPageMain(this.page, this.rows);
     
  }

  eventoBuscar(){
    this.evaluarFiltros();
    this.listarPageMain(this.page, this.rows);
     
  }

  evaluarFiltros(){

    this.filtroGeneral = new FiltroGeneral();
    if(this.clsAlmacen != null){
      this.filtroGeneral.almacenId = this.clsAlmacen.code;
    }
    else{
      this.filtroGeneral.almacenId = 0;
    }

    if(this.palabraClave.trim().length > 0){
      this.filtroGeneral.palabraClave = this.palabraClave.trim();
    }
  
  }


  //metodos transaccionales
  onSelectFila(event: Event){
    this.cancelFormulario();
    this.vistaRegistro = false;
    
  }
  cargarRegistro(): void{

    if(this.selectedProduct == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Seleccione un producto haciendo click en su fila correspondiente para registrar el Ingreso o Salida de unidades'});

    }else{
      this.vistaRegistro = true;

      if(this.selectedProduct.producto.activoLotes == 1){
        this.labelCantidadTotal = 'Cantidad Total Actual de Unidades del Lote';
        this.labelCantidadTotalFinal = 'Cantidad Total Final de Unidades del Lote';
        this.labelMotivo = 'Motivo de Ingreso';
        this.trabajaLotes = 'Si';   
        this.divLote = true;    
      }
      else if(this.selectedProduct.producto.activoLotes == 0){
        this.labelCantidadTotal = 'Cantidad Total Actual de Unidades';
        this.labelCantidadTotalFinal = 'Cantidad Total Final de Unidades';
        this.labelMotivo = 'Motivo de Salida';
        this.trabajaLotes = 'No'; 
        this.divLote = false;

      }
    }
  }

  cancelCargarRegistro(): void{
    this.vistaRegistro = false;
    this.selectedProduct  = null;
    this.cancelFormulario();
  }

  cancelFormulario(){
    //this.nombre='';
    //this.fechaIngreso = this.fechaIngresoBD;
    //this.fechaVencimiento = null; 
    //this.cantidad = null;
    this.tipo = {name: 'Ingreso Libre de Productos', code: '1'};
    this.clsAlmacen_registro = null;
    this.divNuevoLote = false;
    this.divLote = false;

    this.cantidadTotalLote = null;
    this.cantidad = null;
    this.cantidadTotalProcesado = null;
    this.fechaVencimiento = '';
    this.fechaIngreso = '';
    this.nombre = '';
    this.motivo = '';
    this.clsLote = null;

    //this.disabledBtnSave = true;
    
  }

  cambioLocal(event: Event){
    if(this.clsAlmacen_registro != null && this.clsAlmacen_registro.code != 0){
      this.stockService.listarDTO(this.clsAlmacen_registro.code, this.selectedProduct.producto.id).subscribe(data => {
        this.stockLoteDTOs = data.respuesta;
        this.cantidadTotal = data.cantidadTotal;
        //this.calcTotales = this.calcularTotales();
        //this.loading = false;
        console.log(this.stockLoteDTOs);
        console.log(this.cantidadTotal);
        console.log(this.selectedProduct);

        if(this.selectedProduct.producto.activoLotes == 1){
          this.llenarComboLotes();

          this.cantidadTotalLote = null;
          this.cantidad = null;
          this.cantidadTotalProcesado = null;
          this.fechaVencimiento = '';
          this.fechaIngreso = '';
          this.nombre = '';
          this.motivo = '';
          this.clsLote = null;


        }
        else if(this.selectedProduct.producto.activoLotes == 0){

          this.cantidadTotalLote = null;
          this.cantidad = null;
          this.cantidadTotalProcesado = null;
          this.cargarCant();

          this.cambioCantidadNoEvent();

        setTimeout(() => {
          this.setFocusCantidad();
          }, 100);
        }
        
      });

    }
    else{
      this.lotes = [];
      this.clsLote = null;
    }
     
  }

  cambioTipoRegistro(event: Event){

    if(this.tipo != null && this.tipo.code == '1'){
      this.tipoCantidad = 'Cantidad de Unidades de Ingreso';
      this.labelMotivo = 'Motivo de Ingreso';
    }
    else{
      this.tipoCantidad = 'Cantidad de Unidades de Salida';
      this.labelMotivo = 'Motivo de Salida';
    }


    if(this.clsAlmacen_registro != null && this.clsAlmacen_registro.code != 0){

        if(this.selectedProduct.producto.activoLotes == 1){
          this.llenarComboLotes();
        }
        else if(this.selectedProduct.producto.activoLotes == 0){
          this.cargarCant();
        }
    }

    this.cambioCantidadNoEvent();
     
  }
  
  llenarComboLotes(){
    
    this.cantidadTotal = 0;
    this.lotes = [];
    
    if(this.tipo != null && this.tipo.code == '1'){
      this.lotes.push({name: 'AGREGAR NUEVO LOTE', code: 0});
      this.tipoCantidad = 'Cantidad de Unidades de Ingreso';
      this.labelMotivo = 'Motivo de Ingreso';
    }
    else{
      this.tipoCantidad = 'Cantidad de Unidades de Salida';
      this.labelMotivo = 'Motivo de Salida';
    }
    
    this.stockLoteDTOs.forEach(datoStock => {
      if(this.clsAlmacen_registro.code == datoStock.almacen.id){
        if(datoStock.lote.cantidad != null){
          this.cantidadTotal = this.cantidadTotal + datoStock.lote.cantidad;
          this.lotes.push({name: datoStock.lote.nombre, code: datoStock.lote.id});
        }
      }
    });
    
  }
  
  cambioLote(event: Event){
    if(this.clsLote != null && this.clsLote.code == 0){
        this.divNuevoLote = true;
        this.tipoCantidad = 'Cantidad de Unidades del Lote';
        this.labelFechavencimientoLote = 'Fecha de Vencimiento (Deje en blanco si no aplica)';

          this.cantidadTotalLote = null;
          this.cantidad = null;
          this.cantidadTotalProcesado = null;
          this.fechaVencimiento = '';
          this.fechaIngreso = '';
          this.nombre = '';
          this.motivo = '';

        setTimeout(() => {
          this.setFocusNombreLote();
          }, 100);

        //this.setFocusNombreLote();
    }
    else{
      this.labelFechavencimientoLote = 'Fecha de Vencimiento del Lote';
        this.divNuevoLote = false;
        if(this.tipo != null && this.tipo.code == '1'){
          this.tipoCantidad = 'Cantidad de Unidades de Ingreso';
          this.labelMotivo = 'Motivo de Ingreso';
        }
        else{
          this.tipoCantidad = 'Cantidad de Unidades de Salida';
          this.labelMotivo = 'Motivo de Salida';
        }

        this.stockLoteDTOs.forEach(datoStock => {
          if(this.clsLote.code == datoStock.lote.id){

            if(datoStock.lote.fechaIngreso != null){
              const fechaIng = moment(datoStock.lote.fechaIngreso, 'YYYY-MM-DD');
              this.fechaIngreso = fechaIng.format('DD/MM/YYYY');
            }
            if(datoStock.lote.fechaVencimiento != null){
              const fechaVenc = moment(datoStock.lote.fechaVencimiento, 'YYYY-MM-DD');
              this.fechaVencimiento = fechaVenc.format('DD/MM/YYYY');
            }
            this.cantidadTotalLote = datoStock.lote.cantidad;
            this.cantidadTotalProcesado = datoStock.lote.cantidad;
          }
        });

        this.cambioCantidadNoEvent();

        setTimeout(() => {
          this.setFocusCantidad();
          }, 100);


        
    }
     
  }

  cambioCantidad(event: Event){
    //console.log(event);
    let number: number = +event;
    if(!isNaN(number) && this.cantidadTotalLote != null && this.cantidadTotalLote > 0){

      if(this.tipo != null && this.tipo.code == '1'){
        this.cantidadTotalProcesado = number + this.cantidadTotalLote;
      }
      else{
        this.cantidadTotalProcesado =  this.cantidadTotalLote - number;
      }

    }
  }

  cambioCantidadNoEvent(){
    //console.log(event);
    if(!isNaN(this.cantidad) && this.cantidadTotalLote != null && this.cantidadTotalLote > 0){


      if(this.tipo != null && this.tipo.code == '1'){
        this.cantidadTotalProcesado = +this.cantidad + this.cantidadTotalLote;
      }
      else{
        this.cantidadTotalProcesado =  this.cantidadTotalLote - this.cantidad;
      }

    }
  }

  cargarCant(){
    this.cantidadTotal = 0;


    this.stockLoteDTOs.forEach(datoStock => {
      if(this.clsAlmacen_registro.code == datoStock.almacen.id){
        if(datoStock.stock.cantidad != null){
          this.cantidadTotal = this.cantidadTotal + datoStock.stock.cantidad;
          this.cantidadTotalLote = datoStock.stock.cantidad;
          this.cantidadTotalProcesado = datoStock.stock.cantidad;
          
         }
      }
      });

  }

  registrar(event: Event) {
    this.confirmationService.confirm({
        key: 'confirmDialog',
        target: event.target,
        message: '¿Está seguro de Registrar el Ingreso/Salida Libre del Producto Indicado?',
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

  registrarConfirmado(){
    
    if(this.selectedProduct.producto.activoLotes == 1){
      if(this.clsLote != null && this.clsLote.code == 0){
          this.registrarNuevoLote();
      }
      else{
          this.registrarIngresoSalidaCantLotes();
      }
    }
    else if(this.selectedProduct.producto.activoLotes == 0){
      this.registrarIngresoSalidaCantGeneral();
    }
  }


  registrarNuevoLote(){
    
    
    //detalleUnidadEdit = JSON.parse(JSON.stringify(this.detalleUnidad));

    let lote = new Lote();

    if(this.fechaIngreso != null &&  this.fechaIngreso.length == 10){
      const fechaIng = moment(this.fechaIngreso, 'DD/MM/YYYY');
      if(!fechaIng.isValid){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Ingreso indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return false;
      }
      lote.fechaIngreso = fechaIng.format('YYYY-MM-DD');

      if(lote.fechaIngreso == null || lote.fechaIngreso.length != 10){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Ingreso indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return false;
      }
    }
    else{
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Ingreso indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
      return false;
    }
    

    lote.almacenId = parseInt((this.clsAlmacen_registro != null) ? this.clsAlmacen_registro.code : null);
    lote.nombre = this.nombre;
    

    if(this.fechaVencimiento != null &&  this.fechaVencimiento.length == 10){

      const fechaVenc = moment(this.fechaVencimiento, 'DD/MM/YYYY');
      if(!fechaVenc.isValid){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Vencimiento indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return false;
      }
      lote.fechaVencimiento = fechaVenc.format('YYYY-MM-DD');
      lote.activoVencimiento = 1;

      if(lote.fechaVencimiento == null || lote.fechaVencimiento.length != 10){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Vencimiento indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return false;
      }
    }
    else{
      lote.activoVencimiento = 0;
    }

    this.vistaCarga = true;

    lote.productoId = this.selectedProduct.producto.id;
    lote.cantidad = this.cantidad;
    lote.motivo = this.motivo;

    this.loteService.registrarNuevoLote(lote).subscribe(() => {
      this.vistaCarga = false;
      this.loading = true; 
      this.evaluarFiltros();
      this.listarPageMain(this.page, this.rows);
      this.cancelCargarRegistro();
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Nuevo Lote definido se ha agregado satisfactoriamente, se actualizaron los stocks'});
   });

  }


  registrarIngresoSalidaCantLotes(){

    this.entradaSalida = new EntradaSalida();

    this.entradaSalida.motivo = this.motivo;
    this.entradaSalida.loteId = +this.clsLote.code;
    this.entradaSalida.cantidadReal = this.cantidad;
    this.entradaSalida.tipo =  +this.tipo.code;
    this.entradaSalida.almacenId =  +this.clsAlmacen_registro.code;
    this.entradaSalida.productoId =  this.selectedProduct.producto.id;

    let msj: string = '';
    if(this.entradaSalida.tipo == 1){
      msj = 'Se ha registrado el Ingreso de Productos satisfactoriamente, se actualizaron los stocks';
    }
    else{
      msj = 'Se ha registrado la Salida de Productos satisfactoriamente, se actualizaron los stocks';
    }

    this.entradaSalidaService.registrar(this.entradaSalida).subscribe(() => {
      this.vistaCarga = false;
      this.loading = true; 
      this.evaluarFiltros();
      this.listarPageMain(this.page, this.rows);
      this.cancelCargarRegistro();
      this.messageService.add({severity:'success', summary:'Confirmado', detail: msj});
   });


  }

  registrarIngresoSalidaCantGeneral(){

    this.entradaSalida = new EntradaSalida();

    this.entradaSalida.motivo = this.motivo;
    this.entradaSalida.loteId = 0;
    this.entradaSalida.cantidadReal = this.cantidad;
    this.entradaSalida.tipo =  +this.tipo.code;
    this.entradaSalida.almacenId =  +this.clsAlmacen_registro.code;
    this.entradaSalida.productoId =  this.selectedProduct.producto.id;

    let msj: string = '';
    if(this.entradaSalida.tipo == 1){
      msj = 'Se ha registrado el Ingreso de Productos satisfactoriamente, se actualizaron los stocks';
    }
    else{
      msj = 'Se ha registrado la Salida de Productos satisfactoriamente, se actualizaron los stocks';
    }

    this.entradaSalidaService.registrar(this.entradaSalida).subscribe(() => {
      this.vistaCarga = false;
      this.loading = true; 
      this.evaluarFiltros();
      this.listarPageMain(this.page, this.rows);
      this.cancelCargarRegistro();
      this.messageService.add({severity:'success', summary:'Confirmado', detail: msj});
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
      value=parseFloat(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return value;
  }


  



}
