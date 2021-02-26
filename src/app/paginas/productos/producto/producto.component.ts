import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import {AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import { ProductoService } from './../../../_service/producto.service';
import { switchMap } from 'rxjs/operators';
import { Producto } from './../../../_model/producto';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
  providers: [ConfirmationService, MessageService]
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
  prioridad: string = '';
  ubicacion: string = '';
  activoLotes: number = null;
  afectoIsc: number = null;
  tipoTasaIsc: number = null;
  tasaIsc: number = null;
  afectoIgv: number = null;
  activo: any = null;

  producto = new Producto();

  productos: any[] = [];

  first = 0;
  rows = 10;

  msgs: Message[] = [];
  position: string;

  tipoFrm: String = 'Nuevo Producto';
  vistaBotonRegistro : boolean = false;
  vistaBotonEdicion : boolean = false;
  vistaCarga : boolean = true;

  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private productoService: ProductoService,
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService) {
    this.breadcrumbService.setItems([
    { label: 'Almacén' },
    { label: 'Gestión de Productos', routerLink: ['/almacen/productos'] }
    ]);

}

  ngOnInit(): void {
    this.getTipoProductos();
    this.getMarcas();
    this.getPresentaciones();
    this.listarMain();
    this.primengConfig.ripple = true;
    this.vistaCarga = false;
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
      this.first = this.first - this.rows;
  }

  reset() {
      this.first = 0;
  }

  isLastPage(): boolean {
      return this.productos ? this.first > (this.productos.length - this.rows): true;
  }

  isFirstPage(): boolean {
      return this.productos ? this.first === 0 : true;
  }

  setFocusNombre() {    

    this.changeDetectorRef.detectChanges();
    this.inputNombre.nativeElement.focus();

  }

  //Carga de Data

  getTipoProductos() {

    this.clsTipoProducto = null;
    this.tipoProductos = [];

    this.productoService.getTipoProductos().subscribe(data => {
      data.forEach(tipoProd => {
        this.tipoProductos.push({name: tipoProd.tipo, code: tipoProd.id});
      });
    });
  }

  getMarcas() {

    this.clsMarca = null;
    this.marcas = [];

    this.productoService.getMarcas().subscribe(data => {
      data.forEach(marca => {
        this.marcas.push({name: marca.nombre, code: marca.id});
      });
    });
  }

  getPresentaciones() {

    this.clsPresentacion = null;
    this.presentaciones = [];

    this.productoService.getPresentaciones().subscribe(data => {
      data.forEach(presentacion => {
        this.presentaciones.push({name: presentacion.presentacion, code: presentacion.id});
      });
    });
  }

  listarMain() {

    this.productoService.listar().subscribe(data => {
      
      this.productos = data;
    });
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
    this.prioridad = '';
    this.ubicacion = '';
    this.activoLotes = null;
    this.afectoIsc = null;
    this.tipoTasaIsc = null;
    this.tasaIsc = null;
    this.afectoIgv = null;
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
    this.precioUnidad = this.producto.precioUnidad;
    this.precioCompra = this.producto.precioCompra;
    this.fecha = this.producto.fecha;
    this.codigoUnidad = this.producto.codigoUnidad;
    this.codigoProducto = this.producto.codigoProducto;
    this.composicion = this.producto.composicion;
    this.prioridad = this.producto.prioridad;
    this.ubicacion = this.producto.ubicacion;
    this.activoLotes = this.producto.activoLotes;
    this.afectoIsc = this.producto.afectoIsc;
    this.tipoTasaIsc = this.producto.tipoTasaIsc;
    this.tasaIsc = this.producto.tasaIsc;
    this.afectoIgv = this.producto.afectoIgv;
    this.activo = this.producto.activo;



    this.activo =  (this.producto.activo === 1) ?  {name: "Activo", code: this.producto.activo} : {name: "Inactivo", code: this.producto.activo};

    this.tipoFrm = 'Editar Local' 

    this.vistaRegistro = true;

    this.setFocusNombre();

  }

  eliminar(data: Producto, event: Event){
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Está seguro de Eliminar el registro? - Nota: Este proceso no podrá ser revertido',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirmación Eliminación',
      accept: () => {
       //this.eliminarConfirmado(data);
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
        // this.registrarConfirmado();
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
        // this.editarConfirmado();
        },
        reject: () => {
         // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
    });
  }
/*
  registrarConfirmado(){
    
    this.vistaCarga = true;

    this.producto.nombre = this.nombre.toString().trim();
    this.producto.codigo = this.codigo.toString().trim();
    this.producto.direccion = this.direccion.toString().trim();
    this.producto.activo = parseInt((this.clsEstado != null) ? this.clsEstado.code : "1");
    this.producto.distritoId = parseInt((this.clsDistrito != null) ? this.clsDistrito.code: "");

    this.productoService.registrar(this.producto).pipe(switchMap(() => {
      return this.productoService.listar();
    })).subscribe(data => {
      this.vistaCarga = false;
      //this.productoService.productos.next(data);
      this.messageService.add({severity:'success', summary:'Confirmado', detail:'El Producto se ha registrado satisfactoriamente'});
      this.cancelar();
      this.productos = data;
    });

  }*/

}
