import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { AppBreadcrumbService } from '../../../menu/app.breadcrumb.service';
import { ProductoService } from './../../../_service/producto.service';
import { switchMap } from 'rxjs/operators';
import { Producto } from './../../../_model/producto';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';
import { TipoProducto } from './../../../_model/tipo_producto';
import { Marca } from './../../../_model/marca';
import { Presentacion } from './../../../_model/presentacion';
import { InventarioDTO } from './../../../_model/inventario_dto';
import { InventarioService } from 'src/app/_service/inventario.service';
import { ExportsService } from './../../../_service/reportes/exports.service';
import { UnidadService } from './../../../_service/unidad.service';
import { FiltroProductosVenta } from 'src/app/_util/filtro_productos_venta'; 

@Component({
  selector: 'app-productosprecio',
  templateUrl: './productosprecio.component.html',
  styleUrls: ['./productosprecio.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class ProductosprecioComponent implements OnInit {

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

  filtroProductosVenta = new FiltroProductosVenta();

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

  unidads: any[] = [];
  clsUnidad: any = null;


  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private inventarioService: InventarioService, 
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService,
    private exportsService: ExportsService,
    private unidadService:UnidadService) {
    this.breadcrumbService.setItems([
      { label: 'Reportes' },
      { label: 'Productos' },
      { label: 'Listado de Precios de Productos', routerLink: ['/reporte/productos-precios'] }
    ]);

}

ngOnInit(): void {
  /* this.getTipoProductos();
  this.getMarcas();
  this.getPresentaciones(); */
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
  let first = true;

  this.inventarioService.getAlmacens().subscribe(data => {

    //this.almacens.push({name: "General - Todas", code: 0});
    //this.clsAlmacen = {name: "General - Todas", code: 0};
    data.forEach(almacen => {
      this.almacens.push({name: almacen.nombre, code: almacen.id});
      if(first){
        this.clsAlmacen = {name: almacen.nombre, code: almacen.id};
        this.filtroProductosVenta.almacenId =  this.clsAlmacen.code;
        first = false;
        this.getUnidads();
      }
    });

  });
}

getUnidads() {

  this.clsUnidad = null;
  this.unidads = [];

  this.unidadService.listarAll().subscribe(data => {
    data.forEach(unidad => {
      this.unidads.push({name: unidad.nombre, code: unidad.id});

      if(unidad.cantidad == 1){
        this.clsUnidad = {name: unidad.nombre, code: unidad.id};
        this.filtroProductosVenta.unidadId =  this.clsUnidad.code;
        this.listarPageMain(this.page, this.rows);
      }
    });
  });
}

listarPageMain(p: number, s:number) {

  this.filtroProductosVenta.page = p;
  this.filtroProductosVenta.size = s;

  this.loading = true;

  this.inventarioService.getProductoPrecios(this.filtroProductosVenta).subscribe(data => {
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

  this.filtroProductosVenta = new FiltroProductosVenta();

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

  this.filtroProductosVenta = new FiltroProductosVenta();

  if(this.clsAlmacen != null){
    this.filtroProductosVenta.almacenId = this.clsAlmacen.code;
  }
  else{
    this.filtroProductosVenta.almacenId = 0;
  }

  if(this.clsUnidad != null){
    this.filtroProductosVenta.unidadId = this.clsUnidad.code;
  }
  else{
    this.filtroProductosVenta.unidadId = 0;
  }

}

exportarXLSX(){

  this.exportsService.exportProductosPrecioXLSX(this.filtroProductosVenta.almacenId, this.filtroProductosVenta.unidadId).subscribe(data => {

    const file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileURL = URL.createObjectURL(file);

    const a = document.createElement('a');
    a.setAttribute('style', 'display:none');
    document.body.appendChild(a);
    a.href = fileURL;
    a.download = 'ProductoPreciosReporte.xlsx';
    a.click();
    //window.open(fileURL);
  });
}

exportarPDF(){

  this.exportsService.exportProductosPrecioPDF(this.filtroProductosVenta.almacenId, this.filtroProductosVenta.unidadId).subscribe(data => {

    const file = new Blob([data], { type: 'application/pdf' });  
    const fileURL = URL.createObjectURL(file);

    const a = document.createElement('a');
    a.setAttribute('style', 'display:none');
    document.body.appendChild(a);
    a.href = fileURL;
    a.download = 'ProductoPreciosReporte.pdf';
    a.click();

    //window.open(fileURL);
  });
  
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
