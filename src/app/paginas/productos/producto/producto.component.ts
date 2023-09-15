import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import {AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import { ProductoService } from './../../../_service/producto.service';
import { MarcaService } from './../../../_service/marca.service';
import { TipoProductoService } from './../../../_service/tipo_producto.service';
import { PresentacionService } from './../../../_service/presentacion.service';
import { switchMap } from 'rxjs/operators';
import { Producto } from './../../../_model/producto';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';
import { TipoProducto } from './../../../_model/tipo_producto';
import { Marca } from './../../../_model/marca';
import { Presentacion } from './../../../_model/presentacion';


@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class ProductoComponent implements OnInit {

  @ViewChild('inputNombre', { static: false }) inputNombre: ElementRef;

  vistaRegistro: boolean = false;

  tipoProductos: any[] = [];
  marcas: any[] = [];
  presentaciones: any[] = [];
  estados: any[] = [
    {name: 'Activo', code: '1'},
    {name: 'Inactivo', code: '0'}
  ];

  prioridades: any[] = [
    {name: 'Alta', code: '1'},
    {name: 'Normal', code: '2'},
    {name: 'Baja', code: '3'}
  ];

  tiposISC: any[] = [
    {name: 'Porcentual % (0 a 100)', code: '1'},
    {name: 'Valor Fijo', code: '2'}
  ];

  clsTipoProducto: any = null;
  clsMarca: any = null;
  clsPresentacion: any = null;
  nombre: string = '';
  stockMinimo: number = null;
  precioUnidad: number = null;
  precioCompra: number = null;
  fecha: string = '';
  codigoUnidad: string = '';
  codigoProducto: string = '';
  composicion: string = '';
  prioridad: any =  {name: 'Normal', code: '2'};
  ubicacion: string = '';
  activoLotes: number = 1;
  afectoIsc: number = 0;
  tipoTasaIsc: any = null;
  tasaIsc: number = 1;
  afectoIgv: number = null;
  activo: any = null;

  producto = new Producto();

  productos: any[] = [];

  page: number = 0;
  first: number = 0;
  last: number = 0;
  rows: number = 10;

  isFirst: boolean = true;
  isLast: boolean = false;
  totalRecords: number = 0;
  numberElements: number = 0;

  msgs: Message[] = [];
  position: string;

  tipoFrm: String = 'Nuevo Producto';
  vistaBotonRegistro : boolean = false;
  vistaBotonEdicion : boolean = false;
  vistaCarga : boolean = true;

  loading: boolean = true; 
  txtBuscar: String = '';

  selectedProduct: Producto;
  verAsignarUnidad: boolean = false;
  verGestionStock: boolean = false;

  vistaCarga2: boolean = true;

  message:string;

  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private productoService: ProductoService,
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService, private marcaService: MarcaService,
    private tipoProductoService: TipoProductoService, private presentacionService: PresentacionService) {
    this.breadcrumbService.setItems([
    { label: 'Almacén' },
    { label: 'Gestión de Productos', routerLink: ['/almacen/productos'] }
    ]);

}

  ngOnInit(): void {
    this.getTipoProductos();
    this.getMarcas();
    this.getPresentaciones();
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

  getTipoProductos() {

    this.clsTipoProducto = null;
    this.tipoProductos = [];

    this.tipoProductoService.listarAll().subscribe(data => {
      data.forEach(tipoProd => {
        this.tipoProductos.push({name: tipoProd.tipo, code: tipoProd.id});
      });
    });
  }

  getMarcas() {

    this.clsMarca = null;
    this.marcas = [];

    this.marcaService.listarAll().subscribe(data => {
      data.forEach(marca => {
        this.marcas.push({name: marca.nombre, code: marca.id});
      });
    });
  }

  getPresentaciones() {

    this.clsPresentacion = null;
    this.presentaciones = [];

    this.presentacionService.listarAll().subscribe(data => {
      data.forEach(presentacion => {
        this.presentaciones.push({name: presentacion.presentacion, code: presentacion.id});
      });
    });
  }

  /*
  listarMain() {

    this.productoService.listar().subscribe(data => {
      
      this.productos = data;
    });
  }*/

  loadData(event: LazyLoadEvent) { 
    this.loading = true; 
    this.rows = event.rows;
    this.page = event.first / this.rows;

    this.listarPageMain(this.page, this.rows);

  }

  listarPageMain(p: number, s:number) {

    this.productoService.listarPageable(p, s, this.txtBuscar).subscribe(data => {
      this.productos = data.content;
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
    
    this.tipoFrm = 'Nuevo Producto' 
    this.vistaRegistro = true;

    this.cancelar();
  }

  cancelar() {

    this.producto = new Producto();

    this.clsTipoProducto= null;
    this.clsMarca= null;
    this.clsPresentacion= null;
    this.nombre = '';
    this.stockMinimo = null;
    this.precioUnidad = null;
    this.precioCompra = null;
    this.fecha = '';
    this.codigoUnidad = '';
    this.codigoProducto = '';
    this.composicion = '';
    this.prioridad = {name: 'Normal', code: '2'};
    this.ubicacion = '';
    this.activoLotes = 1;
    this.afectoIsc = 0;
    this.tipoTasaIsc = null;
    this.tasaIsc = null;
    this.afectoIgv = 1;
    this.activo= null;


    this.setFocusNombre();
    
  }

  cerrar(){
    this.vistaRegistro = false;

  }

  editar(data: Producto){
    this.producto = data;

    this.vistaBotonRegistro = false;
    this.vistaBotonEdicion = true;

    this.clsTipoProducto = {name: this.producto.tipoProducto.tipo, code: this.producto.tipoProducto.id};
    this.clsMarca = {name: this.producto.marca.nombre, code: this.producto.marca.id};
    this.clsPresentacion = {name: this.producto.presentacion.presentacion, code: this.producto.presentacion.id};

    this.nombre = this.producto.nombre;
    this.stockMinimo = this.producto.stockMinimo;
    this.precioUnidad = this.mostrarNumeroMethod(this.producto.precioUnidad);
    this.precioCompra = this.mostrarNumeroMethod(this.producto.precioCompra);
    this.fecha = this.producto.fecha;
    this.codigoUnidad = this.producto.codigoUnidad;
    this.codigoProducto = this.producto.codigoProducto;
    this.composicion = this.producto.composicion;

    if(this.producto.prioridad == "1"){
      this.prioridad = {name: "Alta", code: this.producto.prioridad};
    }else if(this.producto.prioridad == "2"){
      this.prioridad = {name: "Normal", code: this.producto.prioridad};
    }else if(this.producto.prioridad == "3"){
      this.prioridad = {name: "Baja", code: this.producto.prioridad};
    }else{
      this.prioridad = {name: "Normal", code: "2"};
    }

    if(this.producto.tipoTasaIsc == 1){
      this.tipoTasaIsc = {name: "Porcentual % (0 a 100)", code: this.producto.tipoTasaIsc};
    }else if(this.producto.tipoTasaIsc == 2){
      this.tipoTasaIsc = {name: "Valor Fijo", code: this.producto.tipoTasaIsc};
    }else{
      this.tipoTasaIsc = null;
    }


    this.ubicacion = this.producto.ubicacion;
    this.activoLotes = this.producto.activoLotes;
    this.afectoIsc = this.producto.afectoIsc;
    this.tasaIsc = this.producto.tasaIsc;
    this.afectoIgv = this.producto.afectoIgv;
    this.activo = this.producto.activo;


    this.activo =  (this.producto.activo === 1) ?  {name: "Activo", code: this.producto.activo} : {name: "Inactivo", code: this.producto.activo};

    this.tipoFrm = 'Editar Local' 

    this.vistaRegistro = true;

    this.setFocusNombre();

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

  eliminar(data:Producto, event: Event){
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

  registrarConfirmado(){
    
    this.vistaCarga = true;

    let tipoProductoBase = new TipoProducto();
    let marcaBase = new Marca();
    let presentacionBase = new Presentacion();

    tipoProductoBase.id = parseInt((this.clsTipoProducto != null) ? this.clsTipoProducto.code : "0");
    marcaBase.id =  parseInt((this.clsMarca != null) ? this.clsMarca.code : "0");
    presentacionBase.id =  parseInt((this.clsPresentacion != null) ? this.clsPresentacion.code : "0");

    this.producto.nombre = this.nombre.toString().trim();
    this.producto.tipoProducto = tipoProductoBase;
    this.producto.marca = marcaBase;
    this.producto.stockMinimo = this.stockMinimo;
    this.producto.precioUnidad = this.mostrarNumeroMethod(this.precioUnidad);
    this.producto.precioCompra = this.mostrarNumeroMethod(this.precioCompra);
    this.producto.fecha = this.fecha.toString().trim();
    this.producto.codigoUnidad = this.codigoProducto;
    this.producto.codigoProducto = this.codigoProducto;
    this.producto.presentacion = presentacionBase;
    this.producto.composicion = this.composicion.toString().trim();
    this.producto.prioridad = (this.prioridad != null) ? this.prioridad.code : "1";
    this.producto.ubicacion = this.ubicacion.toString().trim();
    this.producto.activoLotes = this.activoLotes;
    this.producto.afectoIsc = this.afectoIsc;
    this.producto.tipoTasaIsc = parseInt((this.tipoTasaIsc != null) ? this.tipoTasaIsc.code : 1);
    this.producto.tasaIsc = this.tasaIsc;
    this.producto.afectoIgv = this.afectoIgv;
    this.producto.activo = parseInt((this.activo != null) ? this.activo.code : "1");

    this.productoService.registrar(this.producto).subscribe(() => {
      this.vistaCarga = false;
      this.loading = true; 
      this.cancelar();
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Producto se ha registrado satisfactoriamente'});
   });

  }

  editarConfirmado(){
    this.vistaCarga = true;

    let tipoProductoEdit = new Producto();
    tipoProductoEdit = JSON.parse(JSON.stringify(this.producto));

    let tipoProductoBase = new TipoProducto();
    let marcaBase = new Marca();
    let presentacionBase = new Presentacion();

    tipoProductoBase.id = parseInt((this.clsTipoProducto != null) ? this.clsTipoProducto.code : "0");
    marcaBase.id =  parseInt((this.clsMarca != null) ? this.clsMarca.code : "0");
    presentacionBase.id =  parseInt((this.clsPresentacion != null) ? this.clsPresentacion.code : "0");


    tipoProductoEdit.nombre = this.nombre.toString().trim();
    tipoProductoEdit.tipoProducto = tipoProductoBase;
    tipoProductoEdit.marca = marcaBase;
    tipoProductoEdit.stockMinimo = this.stockMinimo;
    tipoProductoEdit.precioUnidad = this.mostrarNumeroMethod(this.precioUnidad);
    tipoProductoEdit.precioCompra = this.mostrarNumeroMethod(this.precioCompra);
    tipoProductoEdit.fecha = this.fecha.toString().trim();
    tipoProductoEdit.codigoUnidad = this.codigoProducto;
    tipoProductoEdit.codigoProducto = this.codigoProducto;
    tipoProductoEdit.presentacion = presentacionBase;
    tipoProductoEdit.composicion = this.composicion.toString().trim();
    tipoProductoEdit.prioridad = (this.prioridad != null) ? this.prioridad.code : "1";
    tipoProductoEdit.ubicacion = this.ubicacion.toString().trim();
    tipoProductoEdit.activoLotes = this.activoLotes;
    tipoProductoEdit.afectoIsc = this.afectoIsc;
    tipoProductoEdit.tipoTasaIsc = parseInt((this.tipoTasaIsc != null) ? this.tipoTasaIsc.code : 1);
    tipoProductoEdit.tasaIsc = this.tasaIsc;
    tipoProductoEdit.afectoIgv = this.afectoIgv;
    tipoProductoEdit.activo = parseInt((this.activo != null) ? this.activo.code : "1");


    this.productoService.modificar(tipoProductoEdit).subscribe(() => {
      this.loading = true; 
      this.vistaCarga = false;
      this.cancelar();
      this.cerrar();
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Producto se ha editado satisfactoriamente'});
   });
  }



  eliminarConfirmado(data:Producto){
    this.vistaCarga = true;
    this.productoService.eliminar(data.id).subscribe(() => {
      this.loading = true; 
      this.vistaCarga = false;
      if(this.numberElements <= 1 && this.page > 0){
        this.page--;
      }
      this.listarPageMain(this.page, this.rows);
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Producto se ha eliminado satisfactoriamente'});
   });
  }



  //Funciones Componentes Hijos
  gestionStocks(): void{

    if(this.selectedProduct == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Seleccione un producto haciendo click en su fila correspondiente para inicializar Stocks'});

    }else{
      this.vistaCarga2 = false;
      this.verGestionStock  = true;
    }

  }

  codigosVentaMayor(): void{
    if(this.selectedProduct == null){
      this.messageService.add({severity:'warn', summary:'Aviso', detail: 'Seleccione un producto haciendo click en su fila correspondiente para registrar códigos por unidades'});

    }else{
      this.vistaCarga2 = false;
      this.verAsignarUnidad  = true;
    }
  }

  cerrarFormularioUnidadsProducto($event) {

    
     //productoCambiado: Producto = $event;
     this.loading = true;

     this.selectedProduct  = null;
     this.verAsignarUnidad  = false;
     this.vistaCarga2 = true;
     this.listarPageMain(this.page, this.rows);
  }

  cerrarFormularioStocksProducto($event) {
    //productoCambiado: Producto = $event;
    this.loading = true;

    this.selectedProduct  = null;
    this.verGestionStock  = false;
    this.vistaCarga2 = true;
    this.listarPageMain(this.page, this.rows);
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
      value=parseFloat(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "");
    }
    return value;
  }

  mostrarNumeroMethodconComas(value: any){  
    if(value != null && value != undefined){
      value=parseFloat(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return value;
  }

}
