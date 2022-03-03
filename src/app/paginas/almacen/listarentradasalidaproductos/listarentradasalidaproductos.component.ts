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
import { RetiroEntradaDTO } from './../../../_model/retiro_entrada_dto';
import { EntradaSalida } from './../../../_model/entrada_salida';
import { GestionloteService } from 'src/app/_service/gestionlote.service';
import { FiltroGeneral } from './../../../_util/filtro_general';
import { StockService } from './../../../_service/stock.service';
import { LoteService } from './../../../_service/lote.service';
import { EntradaSalidaService } from './../../../_service/entrada-salida.service';
import { Lote } from 'src/app/_model/lote';
import * as moment from 'moment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-listarentradasalidaproductos',
  templateUrl: './listarentradasalidaproductos.component.html',
  styleUrls: ['./listarentradasalidaproductos.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class ListarentradasalidaproductosComponent implements OnInit {

  movimientoProductos: any[] = [];

  almacens: any[] = [];
  tipos: any[] = [
    {name: 'Todos', code: null},
    {name: 'Ingreso de Productos', code: '1'},
    {name: 'Salida de Productos', code: '0'}
  ];

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
  clsTipo: any = {name: 'Todos', code: null};

  palabraClave: string = '';
  now: any = moment();
  fechaInicio: string = this.now.format('DD/MM/YYYY');
  fechaFinal: string = this.now.format('DD/MM/YYYY');

  filtroGeneral = new FiltroGeneral();

  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private productoService: ProductoService, private gestionloteService: GestionloteService,
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService, private entradaSalidaService: EntradaSalidaService,
    private router: Router) {
      this.breadcrumbService.setItems([
      { label: 'Almacén' },
      { label: 'Reporte de Salidas e Ingresos Libres de Productos', routerLink: ['/almacen/reporte_stocks'] }
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

  
    this.gestionloteService.getAlmacens().subscribe(data => {

      if(data.length > 0){
        this.clsAlmacen = {name: data[0].nombre, code: data[0].id};
      }

      data.forEach(almacen => {
        this.almacens.push({name: almacen.nombre, code: almacen.id});
      });
  
      this.filtroGeneral.almacenId =  this.clsAlmacen.code;
      this.eventoBuscar();
  
    });
  }

  listarPageMain(p: number, s:number) {

    this.filtroGeneral.page = p;
    this.filtroGeneral.size = s;

  
    this.loading = true;
  
    this.entradaSalidaService.getListaEntradaSalidaProductos(this.filtroGeneral).subscribe(data => {
      this.movimientoProductos = data.content;
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
    this.buscarPorFechas(null);
    
     
  }

  cambioTipos(event: Event){
    this.buscarPorFechas(null);
     
  }

  eventoBuscar(){
    this.buscarPorFechas(null);
     
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

    if(this.clsTipo.code != null){
      this.filtroGeneral.tipo = this.clsTipo.code;
    }

    
  }

  buscarPorFechas(event: Event) {

    this.evaluarFiltros();

    if(this.fechaInicio != null &&  this.fechaInicio.length == 10){
      const fechaIni = moment(this.fechaInicio, 'DD/MM/YYYY');
      if(!fechaIni.isValid){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Inicio indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return false;
      }
      this.filtroGeneral.fechaInicio = fechaIni.format('YYYY-MM-DD');

      if(this.filtroGeneral.fechaInicio == null || this.filtroGeneral.fechaInicio.length != 10){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Inicio indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return false;
      }
    }
    else{
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Inicio indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return false;
    }

    if(this.fechaFinal != null &&  this.fechaFinal.length == 10){
      const fechaFin = moment(this.fechaFinal, 'DD/MM/YYYY');
      if(!fechaFin.isValid){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha Final indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return false;
      }
      this.filtroGeneral.fechaFinal = fechaFin.format('YYYY-MM-DD');

      console.log(this.filtroGeneral.fechaFinal);

      if(this.filtroGeneral.fechaFinal == null || this.filtroGeneral.fechaFinal.length != 10){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha Final indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return false;
      }
    }
    else{
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha Final indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return false;
    }

    this.listarPageMain(this.page, this.rows);

  }


  //metodos transaccionales

  nuevoRegistro(){
    this.router.navigateByUrl('/almacen/gestion_stocks');
  }

  exportarInventarioXls(){

  }

  exportarInventarioPdf(){

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
