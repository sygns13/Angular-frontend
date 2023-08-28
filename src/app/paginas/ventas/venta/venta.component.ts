import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import {AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import { AppComponent } from 'src/app/app.component';

import { switchMap } from 'rxjs/operators';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';

import { GestionloteService } from 'src/app/_service/gestionlote.service';
import { ClienteService } from './../../../_service/cliente.service';
import { VentaService } from './../../../_service/venta.service';
import { Cliente } from './../../../_model/cliente';
import { TipoDocumento } from './../../../_model/tipo_documento';
import { Venta } from './../../../_model/venta';
import { Almacen } from 'src/app/_model/almacen';
import { Comprobante } from 'src/app/_model/comprobante';
import { DetalleVenta } from 'src/app/_model/detalle_venta';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class VentaComponent implements OnInit {

  @ViewChild('inputBuscar', { static: false }) inputBuscar: ElementRef;
  @ViewChild('inputBuscarDocCliente', { static: false }) inputBuscarDocCliente: ElementRef;
  @ViewChild('inputNombreClienteReg', { static: false }) inputNombreClienteReg: ElementRef;

  vistaCarga : boolean = true;
  verFrmVenta : boolean = false;
  verFrmAlmacen : boolean = false;
  displayClient : boolean = false;
  vistaRegistroCliente : boolean = false;

  almacens: any[] = [];
  clsAlmacen: any = null;

  venta: Venta = new Venta();

  
  codigoProducto: string = '';
  txtBuscarProducto: string = '';
  txtBuscarDocCliente: string = '';
  nombreDocIdentidad: string = '';

  detalleVentas: DetalleVenta[] = [];

  page: number = 0;
  first: number = 0;
  rows: number = 10;

  OpGravada: string = '';
  OpExonerada: string = '';
  OpInafecta: string = '';
  TotalISC: string = '';
  TotalIGV: string = '';
  TotalICBPER: string = '';
  ImporteTotal: string = '';


  txtBuscarCliente: String = '';
  clientes: any[] = [];

  pageClientes: number = 0;
  firstClientes: number = 0;
  lastClientes: number = 0;
  rowsClientes: number = 10;
  isFirstClientes: boolean = true;
  isLastClientes: boolean = false;
  totalRecordsClientes: number = 0;
  numberElementsClientes: number = 0;
  loadingClientes: boolean = true; 

  selectedClient: Cliente;

  //Reg Cliente

  tipoDocumentosCliente: any[] = [];

  clsTipoDocumentoCliente: any = null;
  nombreCliente: string = '';
  tipo_documento_idCliente: number = null;
  documentoCliente: string = '';
  direccionCliente: string = '';
  telefonoCliente: string = '';
  correo1Cliente: string = '';
  correo2Cliente: string = '';

  tipoFrmCliente: String = 'Nuevo Cliente';
  vistaBotonRegistroCliente : boolean = false;
  vistaBotonEdicionCliente : boolean = false;
  vistaCargaCliente : boolean = true;

  newCliente = new Cliente();

  constructor(public app: AppComponent, private gestionloteService: GestionloteService, private messageService: MessageService, private clienteService: ClienteService,
              private changeDetectorRef: ChangeDetectorRef, private confirmationService: ConfirmationService , private ventaService: VentaService) { }

  ngOnInit(): void {

    this.getAlmacens();
    this.vistaCarga = false;
    this.verFrmAlmacen = true;

    //inicializar subclases de venta
    this.venta.cliente = new Cliente();
    this.venta.comprobante = new Comprobante();
    this.venta.almacen = new Almacen();
    this.getTipoDocumentos();
    
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
      return this.detalleVentas ? this.first === (this.detalleVentas.length - this.rows): true;
  }

  isFirstPage(): boolean {
      return this.detalleVentas ? this.first === 0 : true;
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
    });
  }

  seleccionarLocal(): void{

    if(this.clsAlmacen != null){
      this.venta.almacen = new Almacen();
      this.venta.almacen.id = this.clsAlmacen.code;
      this.venta.almacen.nombre = this.clsAlmacen.name;
      this.venta.subtotalInafecto = 0;
      this.venta.subtotalAfecto = 0;
      this.venta.igv = 0;

      this.venta.cliente = null;
      this.venta.comprobante = null;

      this.txtBuscarDocCliente = "";
      this.txtBuscarCliente = "";
      this.displayClient = false;
      this.nombreDocIdentidad = "";

      this.ventaService.registrarRetVenta(this.venta).subscribe({
        next: (data) => {
          if(data != null && data.id != null){
            //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Cliente se ha registrado satisfactoriamente'});
            this.venta.id = data.id;
            this.venta.fecha = data.fecha;
            this.venta.subtotalInafecto = data.subtotalInafecto;
            this.venta.subtotalAfecto = data.subtotalAfecto;
            this.venta.igv = data.igv;
            this.venta.estado = data.estado;
            this.venta.pagado = data.pagado;
            this.venta.hora = data.hora;
            this.venta.tipo = data.tipo;
            this.venta.numeroVenta = data.numeroVenta;

            this.venta.cliente = new Cliente();
            this.venta.comprobante = new Comprobante();
            this.detalleVentas = [];
            this.venta.detalleVentas = this.detalleVentas;
  
            this.verFrmVenta = true;
            this.vistaCarga = false;
            this.verFrmAlmacen = false;
          }
        },
        error: (err) => {
          console.log(err);
        }        
     });

      
    }
    else{
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'No ha seleccionado un Local o Sucursal Válido'});
    }
    
  }


  //Seccion CLientes
  getTipoDocumentos() {

    this.clsTipoDocumentoCliente = null;
    this.tipoDocumentosCliente = [];
  
    this.clienteService.getTipoDocumentos().subscribe(data => {
      data.forEach(tipoDoc => {
        this.tipoDocumentosCliente.push({name: tipoDoc.tipo, code: tipoDoc.id});
      });
    });
  }

  buscarCliente(): void{
    this.displayClient = true;
    this.setFocusBuscar();
    this.buscarClientes();
  }

  buscarClientes(): void{
    this.cerrarCliente();
    this.pageClientes = 0;
    this.listarPageClientes(this.pageClientes , this.rowsClientes);
  }

  listarPageClientes(p: number, s:number) {

    this.clienteService.listarPageable(p, s, this.txtBuscarCliente).subscribe(data => {
      this.clientes = data.content;
      this.isFirstClientes = data.first;
      this.isLastClientes = data.last;
      this.numberElementsClientes = data.numberOfElements;
      this.firstClientes = (p * s);
      this.lastClientes = (p * s) + this.numberElementsClientes;
      this.totalRecordsClientes = data.totalElements;
      this.loadingClientes = false;
    });
  }

  loadDataClientes(event: LazyLoadEvent) { 
    this.loadingClientes = true; 
    this.rowsClientes = event.rows;
    this.pageClientes = event.first / this.rows;
  
    this.listarPageClientes(this.pageClientes, this.rowsClientes);
  
  }

  nextClientes() {
    this.pageClientes++;
    this.listarPageClientes(this.pageClientes, this.rowsClientes);
  }
  
  prevClientes() {
      this.pageClientes--;
      this.listarPageClientes(this.pageClientes, this.rowsClientes);
  }
  
  resetClientes() {
      this.firstClientes = 0;
      this.listarPageClientes(this.pageClientes, this.rowsClientes);
  }
  
  isLastPageClientes(): boolean {
      //return this.bancos ? this.first > (this.bancos.length - this.rows): true;
      return this.isLastClientes;
  }
  
  isFirstPageClientes(): boolean {
      return this.isFirstClientes;
  }

  setFocusBuscar() {    
    this.changeDetectorRef.detectChanges();
    this.inputBuscar.nativeElement.focus();
  }

  setFocusBuscarDocCliente() {    
    this.changeDetectorRef.detectChanges();
    this.inputBuscarDocCliente.nativeElement.focus();
  }

  setFocusNombreCliente() {    
    this.changeDetectorRef.detectChanges();
    this.inputNombreClienteReg.nativeElement.focus();
  }

  aceptarCliente(registro){
    //console.log(registro);
    if(registro != null){

      this.venta.cliente = registro;
        this.ventaService.modificarCliente(this.venta).subscribe({
          next: (dataUdpCliente) => {
            if(dataUdpCliente != null && dataUdpCliente.id != null){

              this.venta.cliente = dataUdpCliente.cliente;
              
              this.txtBuscarCliente = "";
              this.txtBuscarDocCliente = "";
              this.displayClient = false;
              this.nombreDocIdentidad = registro.tipoDocumento.tipo;
              console.log(this.nombreDocIdentidad);
            }
          },
          error: (errUdpCliente) => {
            console.log(errUdpCliente);
          }        
       });
    }
  }

  buscarDocCliente() {

    //this.messageService.add({severity:'warn', summary:'Confirmado', detail: 'El Producto se ha editado satisfactoriamente'});
    /* this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Warn', detail: 'Message Content' }); */

    this.clienteService.getByDocument(this.txtBuscarDocCliente).subscribe({
      
      next: (data) => {

        this.venta.cliente = data;
        this.ventaService.modificarCliente(this.venta).subscribe({
          next: (dataUdpCliente) => {
            if(dataUdpCliente != null && dataUdpCliente.id != null){

              this.venta.cliente = dataUdpCliente.cliente;
              
              this.txtBuscarCliente = "";
              this.txtBuscarDocCliente = "";
              this.displayClient = false;
              this.nombreDocIdentidad = data.tipoDocumento.tipo;
            }
          },
          error: (errUdpCliente) => {
            console.log(errUdpCliente);
          }        
       });

       
      },
      error: (err) => {
        this.txtBuscarDocCliente = "";
        this.setFocusBuscarDocCliente();
      }
    });
  }

  nuevoCliente(): void{
    this.vistaBotonRegistroCliente = true;
    this.vistaBotonEdicionCliente = false;
    
    this.tipoFrmCliente = 'Nuevo Cliente' 
    this.vistaRegistroCliente = true;

  this.cancelarCliente();
  }

  cancelarCliente() {

    this.newCliente = new Cliente();
  
    this.clsTipoDocumentoCliente = null;
    this.nombreCliente = '';
    this.tipo_documento_idCliente = null;
    this.documentoCliente = '';
    this.direccionCliente = '';
    this.telefonoCliente = '';
    this.correo1Cliente = '';
    this.correo2Cliente = '';
  
    this.setFocusNombreCliente();
    
  }

  cerrarCliente(){
    this.vistaRegistroCliente = false;
  }

  registrarCliente(event: Event) {
    this.confirmationService.confirm({
        key: 'confirmDialog',
        target: event.target,
        message: '¿Está seguro de Registrar al Cliente?',
        icon: 'pi pi-info-circle',
        header: 'Confirmación Registro',
        accept: () => {
          //this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
         // this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have accepted'});
          this.registrarConfirmadoCliente();
        },
        reject: () => {
         // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
    });
  }

  registrarConfirmadoCliente(){
    
    this.vistaCargaCliente = true;
  
    let tipoDocumentoBase = new TipoDocumento();
  
    tipoDocumentoBase.id = parseInt((this.clsTipoDocumentoCliente != null) ? this.clsTipoDocumentoCliente.code : "0");
  
  
    this.newCliente.nombre = this.nombreCliente.toString().trim();
    this.newCliente.tipoDocumento = tipoDocumentoBase;
    this.newCliente.documento = this.documentoCliente;
    this.newCliente.direccion = this.direccionCliente;
    this.newCliente.telefono = this.telefonoCliente;
    this.newCliente.correo1 = this.correo1Cliente;
    this.newCliente.correo2 = this.correo2Cliente;
  
  
    this.clienteService.registrarRetCliente(this.newCliente).subscribe(data => {
      if(data != null){

        this.venta.cliente = data;
        this.ventaService.modificarCliente(this.venta).subscribe({
          next: (dataUdpCliente) => {
            if(dataUdpCliente != null && dataUdpCliente.id != null){

              this.venta.cliente = dataUdpCliente.cliente;
              this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Cliente se ha registrado satisfactoriamente'});
              this.txtBuscarCliente = "";
              this.txtBuscarDocCliente = "";
              this.displayClient = false;
              this.nombreDocIdentidad = data.tipoDocumento.tipo;
            }
          },
          error: (errUdpCliente) => {
            console.log(errUdpCliente);
          }        
       });

      }
   });
  
  }



  buscarProducto(): void{
    
  }

  cobrarVenta(): void{
    
  }
  nuevaVenta(): void{
    
  }

  cancelarVenta(event: Event): void{
    
  }

  cerrarVenta(event: Event): void{

      this.verFrmAlmacen = true;
      this.verFrmVenta = false;
      this.vistaCarga = false;
    
  }

}
