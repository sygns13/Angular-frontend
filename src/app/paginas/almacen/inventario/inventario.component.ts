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
import { InventarioService } from 'src/app/_service/inventario.service';
import { FiltroInventario } from './../../../_util/filtro_inventario';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class InventarioComponent implements OnInit {

  @ViewChild('inputNombre', { static: false }) inputNombre: ElementRef;

  vistaRegistro: boolean = false;

  tipoProductos: any[] = [];
  marcas: any[] = [];
  presentaciones: any[] = [];
  almacens: any[] = [];

  prioridades: any[] = [
    {name: 'Alta', code: '1'},
    {name: 'Normal', code: '2'},
    {name: 'Baja', code: '3'}
  ];

  clsTipoProducto: any = null;
  clsMarca: any = null;
  clsPresentacion: any = null;
  codigoProducto: string = '';
  nombre: string = '';
  composicion: string = '';
  prioridad: any =  {name: 'Normal', code: '2'};
  ubicacion: string = '';

  clsAlmacen: any = null;

  inventario = new InventarioDTO();

  inventarios: any[] = [];

  page: number = 0;
  first: number = 0;
  last: number = 0;
  rows: number = 10;

  isFirst: boolean = true;
  isLast: boolean = false;
  totalRecords: number = 0;
  numberElements: number = 0;

  msgs: Message[] = [];
  tipoFrm: String = 'Filtros de Búsqueda Avanzados';
  vistaCarga : boolean = true;

  loading: boolean = true; 

  filtroInventario = new FiltroInventario();

  selectedProduct: InventarioDTO;

  //Vista Filtros Opcionales
  usarFiltroConsulta: boolean = false;
  usarFiltroConsulta1: boolean = false;
  usarFiltroConsulta2: boolean = false;
  usarFiltroConsulta3: boolean = false;
  usarFiltroConsulta4: boolean = false;
  usarFiltroConsulta5: boolean = false;
  usarFiltroConsulta6: boolean = false;
  usarFiltroConsulta7: boolean = false;
  usarFiltroConsulta8: boolean = false;

  tipo_producto_idlabel: string = '';
  marca_idlabel: string = '';
  presentacion_idlabel: string = '';
  prioridad_idlabel: string = '';
  codigoProducto_idlabel: string = '';
  nombre_idlabel: string = '';
  composicion_idlabel: string = '';
  ubicacion_idlabel: string = '';


  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private inventarioService: InventarioService, 
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService) {
    this.breadcrumbService.setItems([
    { label: 'Almacén' },
    { label: 'Inventario', routerLink: ['/almacen/inventario'] }
    ]);

}

ngOnInit(): void {
  this.getTipoProductos();
  this.getMarcas();
  this.getPresentaciones();
  this.getAlmacens()
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

getTipoProductos() {

  this.clsTipoProducto = null;
  this.tipoProductos = [];

  this.inventarioService.getTipoProductos().subscribe(data => {
    data.forEach(tipoProd => {
      this.tipoProductos.push({name: tipoProd.tipo, code: tipoProd.id});
    });
  });
}

getMarcas() {

  this.clsMarca = null;
  this.marcas = [];

  this.inventarioService.getMarcas().subscribe(data => {
    data.forEach(marca => {
      this.marcas.push({name: marca.nombre, code: marca.id});
    });
  });
}

getPresentaciones() {

  this.clsPresentacion = null;
  this.presentaciones = [];

  this.inventarioService.getPresentaciones().subscribe(data => {
    data.forEach(presentacion => {
      this.presentaciones.push({name: presentacion.presentacion, code: presentacion.id});
    });
  });
}

loadData(event: LazyLoadEvent) { 
  this.loading = true; 
  this.rows = event.rows;
  this.page = event.first / this.rows;

  this.listarPageMain(this.page, this.rows);

}

getAlmacens() {

  this.clsAlmacen = null;
  this.almacens = [];

  this.inventarioService.getAlmacens().subscribe(data => {

    this.almacens.push({name: "General - Todas", code: 0});
    this.clsAlmacen = {name: "General - Todas", code: 0};
    data.forEach(almacen => {
      this.almacens.push({name: almacen.nombre, code: almacen.id});
    });

    this.filtroInventario.almacenId =  this.clsAlmacen.code;
    this.listarPageMain(this.page, this.rows);

  });
}

listarPageMain(p: number, s:number) {

  this.filtroInventario.page = p;
  this.filtroInventario.size = s;

  this.loading = true;

  this.inventarioService.getProductoInventario(this.filtroInventario).subscribe(data => {
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

  this.evaluarFiltros(this.usarFiltroConsulta);
  this.listarPageMain(this.page, this.rows);
  

}

verFiltros(){
  this.cancelFormulario();
  this.vistaRegistro = true;

}

cancelFormulario(){

  this.filtroInventario = new FiltroInventario();

  this.clsTipoProducto = null;
  this.clsMarca = null;
  this.clsPresentacion = null;
  this.codigoProducto = '';
  this.nombre = '';
  this.composicion = '';
  this.prioridad = null;
  this.ubicacion = '';
}

cerrarFiltros(){
  this.vistaRegistro = false;
  this.usarFiltroConsulta = false;
  this.cancelFormulario();
  this.listarPageMain(this.page, this.rows);
}

limpiarFiltros(){
  this.cancelFormulario();
}

buscarConFiltros(){
  this.usarFiltroConsulta = true;
  this.evaluarFiltros(this.usarFiltroConsulta);
  this.listarPageMain(this.page, this.rows);
}

evaluarFiltros(usarFiltroConsulta : boolean){

  this.filtroInventario = new FiltroInventario();

  if(this.clsAlmacen != null){
    this.filtroInventario.almacenId = this.clsAlmacen.code;
  }
  else{
    this.filtroInventario.almacenId = 0;
  }

  if(usarFiltroConsulta){

    if(this.clsTipoProducto != null) {
      this.filtroInventario.tipoProductoId = this.clsTipoProducto.code;
      this.tipo_producto_idlabel = this.clsTipoProducto.name;
    }
    else{
      this.tipo_producto_idlabel = 'TODOS';
    }

    if(this.clsMarca != null) {
      this.filtroInventario.marcaId = this.clsMarca.code;
      this.marca_idlabel = this.clsMarca.name;
    }
    else{
      this.marca_idlabel = 'TODAS';
    }

    if(this.clsPresentacion != null) {
      this.filtroInventario.presentacionId = this.clsPresentacion.code;
      this.presentacion_idlabel = this.clsPresentacion.name;
    }
    else{
      this.presentacion_idlabel = 'TODAS';
    }

    this.usarFiltroConsulta1 = true;
    this.usarFiltroConsulta2 = true;
    this.usarFiltroConsulta3 = true;

    if(this.codigoProducto.trim().length > 0){
      this.filtroInventario.codigo = this.codigoProducto.trim();
      this.codigoProducto_idlabel = this.codigoProducto;
      this.usarFiltroConsulta4 = true;
    }else{
      this.usarFiltroConsulta4 = false;
    }

    if(this.nombre.trim().length > 0){
      this.filtroInventario.nombre = this.nombre.trim();
      this.nombre_idlabel = this.nombre;
      this.usarFiltroConsulta5 = true;
    }else{
      this.usarFiltroConsulta5 = false;
    }

    if(this.composicion.trim().length > 0){
      this.filtroInventario.composicion = this.composicion.trim();
      this.composicion_idlabel = this.composicion;
      this.usarFiltroConsulta6 = true;
    }else{
      this.usarFiltroConsulta6 = false;
    }

    if(this.prioridad != null && this.prioridad !=''){
      this.filtroInventario.prioridad = this.prioridad.code;
      this.usarFiltroConsulta7 = true;

      console.log(this.prioridad);

      if(this.prioridad.code == '1'){
        this.prioridad_idlabel = this.prioridad.name;
      }

      if(this.prioridad.code == '2'){
        this.prioridad_idlabel = this.prioridad.name;
      }

      if(this.prioridad.code == '3'){
        this.prioridad_idlabel = this.prioridad.name;
      }
    }else{
      this.usarFiltroConsulta7 = false;
    }

    if(this.ubicacion.trim().length > 0){
      this.filtroInventario.ubicacion = this.ubicacion.trim();
      this.ubicacion_idlabel = this.ubicacion;
      this.usarFiltroConsulta8 = true;
    }else{
      this.usarFiltroConsulta8 = false;
    }
  }
}

exportarInventarioXls(){
  console.log(this.selectedProduct);

}
exportarInventarioPdf(){

}
exportarKardexXls(){

}
exportarKardexPdf(){

}


}
