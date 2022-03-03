import { Component, OnInit, Input, Output, EventEmitter,  ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
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

import { AsignarUnidadService } from './../../../_service/asignar_unidad.service';
import { UnidadProducto } from './../../../_model/unidad_producto';

@Component({
  selector: 'app-asignarunidades',
  templateUrl: './asignarunidades.component.html',
  styleUrls: ['./asignarunidades.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class AsignarunidadesComponent implements OnInit {

  message: string = "valor1";
  vistaCarga: boolean = false;

  @Input() producto: Producto;
  @Output() cerrarFormAsignarUnidades = new EventEmitter<Producto>();


  @ViewChild('inputPrecioUnidad', { static: false }) inputPrecioUnidad: ElementRef;

  vistaRegistro: boolean = false;
  disabledBtnSave: boolean = true;

  almacens: any[] = [];
  detalleUnidades: any[] = [];

  clsAlmacen: any = null;

  nombre: string = '';
  cantidad: number = null;
  abreviatura: string = '';
  precioUnidad: number = null;
  precioCompra: number = null;
  codigoProducto: string = '';

  loading: boolean = true; 

  productos: any[] = [];

  detalleUnidad = new UnidadProducto();

  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private asignarUnidadService: AsignarUnidadService,
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService) {
      this.breadcrumbService.setItems([
        { label: 'Almacén' },
        { label: 'Gestión de Productos', routerLink: ['/almacen/productos'] }
        ]);
     }

  ngOnInit(): void {
    this.getAlmacens();
    this.primengConfig.ripple = true;
    this.vistaCarga = false;

    this.productos.push(this.producto);
  }
  /*
  sendMessage() {
    this.cerrarFormAsignarUnidades.emit(this.message)
  }*/

  //Carga de Data:
  getAlmacens() {

    this.clsAlmacen = null;
    this.almacens = [];

    this.asignarUnidadService.getAlmacens().subscribe(data => {

      this.almacens.push({name: "General - Todas", code: 0});
      this.clsAlmacen = {name: "General - Todas", code: 0};
      data.forEach(almacen => {
        this.almacens.push({name: almacen.nombre, code: almacen.id});
      });
      this.getDatosDetallesUnidad();

    });
  }

  getDatosDetallesUnidad(){

    if(this.clsAlmacen != null && this.clsAlmacen.code != null && this.producto!= null && this.producto.id != null){
      this.asignarUnidadService.listarGeneral(this.clsAlmacen.code, this.producto.id).subscribe(data => {
        this.detalleUnidades = data;
        this.loading = false;
      });
    }
    this.cancelFormulario();
  }

  setFocusPrecioVenta() {    

    this.changeDetectorRef.detectChanges();
    this.inputPrecioUnidad.nativeElement.focus();

  }

  //Funciones Crud

  cambioSucursal(e : any){
    this.getDatosDetallesUnidad();

  }

  cancelFormulario() : void {

    this.disabledBtnSave = true;
    this.nombre = '';
    this.cantidad = null;
    this.precioUnidad = null;
    this.precioCompra = null;
    this.codigoProducto = '';

  }

  cerrarFormulario(){
    this.cerrarFormAsignarUnidades.emit(this.producto);
  }

  editar(data: UnidadProducto){
    
    this.detalleUnidad = data;

    this.nombre = this.detalleUnidad.unidad.nombre;
    this.cantidad = this.detalleUnidad.unidad.cantidad;
    this.precioUnidad =  this.mostrarNumeroMethod(this.detalleUnidad.precio);
    this.precioCompra = this.mostrarNumeroMethod(this.detalleUnidad.costoCompra);
    this.codigoProducto = this.detalleUnidad.codigoUnidad;

    this.disabledBtnSave = false;

    this.setFocusPrecioVenta();
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

  eliminar(data:UnidadProducto, event: Event){
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

  eliminarConfirmado(data:UnidadProducto){
    this.vistaCarga = true;
    this.asignarUnidadService.eliminar(data.id).subscribe(() => {
      this.loading = true; 
      this.vistaCarga = false;
      this.getDatosDetallesUnidad();
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Código de Venta por Mayor y sus precios definidos se ha eliminado satisfactoriamente'});
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

  registrarConfirmado(){
    
    this.vistaCarga = true;

    let detalleUnidadEdit = new UnidadProducto();
    detalleUnidadEdit = JSON.parse(JSON.stringify(this.detalleUnidad));


    detalleUnidadEdit.almacenId = parseInt((this.clsAlmacen != null) ? this.clsAlmacen.code : null);
    detalleUnidadEdit.productoId = this.producto.id;
    detalleUnidadEdit.codigoUnidad = this.codigoProducto;
    detalleUnidadEdit.precio = this.mostrarNumeroMethod(this.precioUnidad);
    detalleUnidadEdit.costoCompra = this.mostrarNumeroMethod(this.precioCompra);

    this.asignarUnidadService.registrar(detalleUnidadEdit).subscribe(() => {
      this.vistaCarga = false;
      this.loading = true; 
      this.getDatosDetallesUnidad();
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Código de Venta por Mayor y sus precios definidos se han registrado satisfactoriamente'});
   });

  }
  

}
