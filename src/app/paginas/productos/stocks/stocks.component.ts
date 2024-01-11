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

import { UnidadProducto } from './../../../_model/unidad_producto';
import { StockService } from './../../../_service/stock.service';
import { LoteService } from './../../../_service/lote.service';

import { StockLoteDTO } from './../../../_model/stock_lote_dto';
import { Stock } from 'src/app/_model/stock';
import { Lote } from 'src/app/_model/lote';
import * as moment from 'moment';
import { Almacen } from './../../../_model/almacen';
import { LotesChangeOrden } from 'src/app/_model/lotes_change_orden';


@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class StocksComponent implements OnInit {

  message: string = "valor2";
  vistaCarga: boolean = false;

  @Input() producto: Producto;
  @Output() cerrarFormStocks = new EventEmitter<Producto>();

  @ViewChild('inputNombre', { static: false }) inputNombre: ElementRef;
  @ViewChild('inputStockGeneral', { static: false }) inputStockGeneral: ElementRef;

  vistaRegistro: boolean = false;
  disabledBtnSave: boolean = true;

  vistaBotonRegistro : boolean = false;
  vistaBotonEdicion : boolean = false;

  
  fechaIngresoBD: string = '';
  almacens: any[] = [];
  almacens_registo: any[] = [];
  stockLoteDTOs: any[] = [];
  cantidadTotal: number = null;

  clsAlmacen: any = null;
  clsAlmacen_registro: any = null;

  nombre: string = '';
  fechaIngreso: string = '';
  fechaVencimiento: string = '';
  cantidad: number = null;
 

  loading: boolean = true; 

  productos: any[] = [];

  stock = new Stock();
  lote = new Lote();

  stockLoteDTO = new StockLoteDTO;

  tipoFrm: String = 'Nuevo Lote de Producto';

  calcTotales: any[] = [];

  cantidadStock: number = null;


  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private stockService: StockService, private loteService: LoteService,
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService) {
      this.breadcrumbService.setItems([
        { label: 'Almacén' },
        { label: 'Gestión de Productos', routerLink: ['/almacen/productos'] }
        ]);
     }

     ngOnInit(): void {
      this.getDatosmain();
      this.primengConfig.ripple = true;
      this.vistaCarga = false;
  
      this.productos.push(this.producto);
    }

    setFocusNombre() {    

      this.changeDetectorRef.detectChanges();
      this.inputNombre.nativeElement.focus();
  
    }

    //Carga de Data:
    getDatosmain() {

    this.clsAlmacen = null;
    this.almacens = [];
    this.almacens_registo = [];

    this.stockService.getAlmacensProducts(this.producto.id).subscribe(data => {
      this.almacens.push({name: "General - Todas", code: 0});
      this.clsAlmacen = {name: "General - Todas", code: 0};

      this.fechaIngresoBD= data.fechaIngreso;

      data.almacens.forEach(almacen => {
        this.stockLoteDTOs = almacen.productosStocks.respuesta;
        this.cantidadTotal = almacen.productosStocks.cantidadTotal;
        let _total = this.calcularTotalesN(almacen);

        this.almacens.push({name: almacen.nombre, code: almacen.id});
        this.almacens_registo.push({name: almacen.nombre, code: almacen.id, codigo: almacen.codigo, stockLoteDTOs: this.stockLoteDTOs, cantidadTotal : this.cantidadTotal, calcTotales: _total, editar : 0});
        this.loading = false;
      });
      //this.getDatosmain();
      this.calcTotales = this.calcularTotalesN2(data.almacens);

    });
    this.cancelFormulario();
  }

  /* getDatosmain(){

      this.stockService.listarDTO(this.clsAlmacen.code, this.producto.id).subscribe(data => {
        this.stockLoteDTOs = data.respuesta;
        this.cantidadTotal = data.cantidadTotal;
        this.calcTotales = this.calcularTotales();
        this.loading = false;

      });
    this.cancelFormulario();

  } */

  cambioSucursal(event: Event){

  }

  calcularTotales() {

    let totales = [];


    if(this.producto.activoLotes == 1){
      this.almacens_registo.forEach(datoSucursal => {
      let total: number = 0;
       this.stockLoteDTOs.forEach(datoStock => {
         if(datoSucursal.code == datoStock.almacen.id){
           if(datoStock.lote.cantidad != null){
              total = total + datoStock.lote.cantidad;
            }
         }
         });
       totales.push({idAlmacen: datoSucursal.code, total: total});
     });
    }

    else{
      let total: number = 0;
      this.stockLoteDTOs.forEach(datoStock => {
            if(datoStock.stock.cantidad != null){
              total = total + datoStock.stock.cantidad;
            }
         });

       totales.push({label: 'Cantidad Total en Stock', total: total});

    }
    return totales;

 } 

  calcularTotalesN(almacen: any) {

    let totales = [];


    if(this.producto.activoLotes == 1){
      totales.push({idAlmacen: almacen.id, total: almacen.productosStocks.cantidadTotal});
    }
    return totales;

 } 

 calcularTotalesN2(almacens: any) {

  let totales = [];
  if(this.producto.activoLotes != 1){
    let total: number = 0;
    almacens.forEach(datoStock => {
          if(datoStock.productosStocks.cantidadTotal != null){
            total = total + datoStock.productosStocks.cantidadTotal;
          }
       });

     totales.push({label: 'Cantidad Total en Stock', total: total});
  }

  return totales;
 } 

  //Funciones Botones Lotes

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

  isValidDate(d: any) {
    return d instanceof Date;
  }

  registrarConfirmado(){
    
    
    //detalleUnidadEdit = structuredClone(this.detalleUnidad));

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

    lote.productoId = this.producto.id;
    lote.cantidad = this.cantidad;

    this.loteService.registrar(lote).subscribe({
      next: (data) => {
      this.vistaCarga = false;
      this.loading = true; 
      this.getDatosmain();
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Lote definido se han registrado satisfactoriamente, se actualizaron los stocks'});
    },
    error: (err) => {
      this.vistaCarga = false;
      console.log(err);
    }        
  });
  

  }

  cancelFormulario(){
    this.nombre='';
    this.fechaIngreso = this.fechaIngresoBD;
    this.fechaVencimiento = null; 
    this.cantidad = null;
    this.clsAlmacen_registro=null;

    this.disabledBtnSave = true;
    
  }
  nuevoFormulario(){

    this.vistaBotonRegistro = true;
    this.vistaBotonEdicion = false;

    this.nombre='';
    this.fechaIngreso = this.fechaIngresoBD;
    this.fechaVencimiento = null;
    this.cantidad = null;
    this.clsAlmacen_registro=null;

    this.disabledBtnSave = false;
    this.setFocusNombre();


  }
  cerrarFormulario(){
    this.cerrarFormStocks.emit(this.producto);
  }

  editar(data:StockLoteDTO){

    this.stockLoteDTO = data;

    this.vistaBotonRegistro = false;
    this.vistaBotonEdicion = true;

    this.nombre = this.stockLoteDTO.lote.nombre;

    if(this.stockLoteDTO.lote.fechaIngreso != null){
      const fechaIng = moment(this.stockLoteDTO.lote.fechaIngreso, 'YYYY-MM-DD');
      this.fechaIngreso = fechaIng.format('DD/MM/YYYY');
    }
    if(this.stockLoteDTO.lote.fechaVencimiento != null){
      const fechaVenc = moment(this.stockLoteDTO.lote.fechaVencimiento, 'YYYY-MM-DD');
      this.fechaVencimiento = fechaVenc.format('DD/MM/YYYY');
    }

    this.cantidad = this.stockLoteDTO.lote.cantidad;

    this.clsAlmacen_registro =  (this.stockLoteDTO.almacen != null) ?  {name: this.stockLoteDTO.almacen.nombre, code: this.stockLoteDTO.almacen.id} : null;
    this.tipoFrm = 'Editar Lote de Producto' 
    this.vistaRegistro = true;

    this.disabledBtnSave = false;
    this.setFocusNombre();

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

  editarConfirmado(){
    
    this.vistaCarga = true;
    //detalleUnidadEdit = structuredClone(this.detalleUnidad));

    let stockLotetDTOEdit = new StockLoteDTO();
    stockLotetDTOEdit = structuredClone(this.stockLoteDTO);

    let loteEdit = new Lote();

    loteEdit = stockLotetDTOEdit.lote;

    if(this.fechaIngreso != null &&  this.fechaIngreso.length == 10){
      const fechaIng = moment(this.fechaIngreso, 'DD/MM/YYYY');
      if(!fechaIng.isValid){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Ingreso indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return false;
      }
      loteEdit.fechaIngreso = fechaIng.format('YYYY-MM-DD');
      if(loteEdit.fechaIngreso == null || loteEdit.fechaIngreso.length != 10){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Ingreso indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return false;
      }
    }
    else{
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Ingreso indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return false;
    }
    
    

    loteEdit.almacenId = parseInt((this.clsAlmacen_registro != null) ? this.clsAlmacen_registro.code : null);
    loteEdit.nombre = this.nombre;
    

    if(this.fechaVencimiento != null &&  this.fechaVencimiento.length == 10){

      const fechaVenc = moment(this.fechaVencimiento, 'DD/MM/YYYY');
      if(!fechaVenc.isValid){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Vencimiento indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return false;
      }
      loteEdit.fechaVencimiento = fechaVenc.format('YYYY-MM-DD');
      loteEdit.activoVencimiento = 1;

      if(loteEdit.fechaVencimiento == null || loteEdit.fechaVencimiento.length != 10){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Vencimiento indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        return false;
      }

    }
    else{
      loteEdit.activoVencimiento = 0;
    }

    loteEdit.productoId = this.producto.id;
    loteEdit.cantidad = this.cantidad;

    this.loteService.modificar(loteEdit).subscribe({
      next: (data) => {
      this.vistaCarga = false;
      this.loading = true; 
      this.getDatosmain();
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Lote se ha editado satisfactoriamente'});
    },
    error: (err) => {
      this.vistaCarga = false;
      console.log(err);
    }        
  });
  }



    eliminar(data:StockLoteDTO, event: Event){
      this.confirmationService.confirm({
        key: 'confirmDialog',
        target: event.target,
        message: '¿Está seguro de Eliminar el Lote? - Nota: Este proceso no podrá ser revertido',
        icon: 'pi pi-exclamation-triangle',
        header: 'Confirmación Eliminación',
        accept: () => {
        this.eliminarConfirmado(data);
        },
        reject: () => {
        }
    });
      
    }

    eliminarConfirmado(data:StockLoteDTO){
      this.vistaCarga = true;
      this.loteService.eliminar(data.lote.id).subscribe({
        next: (data) => {
        this.loading = true; 
        this.vistaCarga = false;
        this.getDatosmain();
        this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Lote se ha eliminado satisfactoriamente'});
      },
      error: (err) => {
        this.vistaCarga = false;
        console.log(err);
      }        
    });
    }

    subirOrden(data:StockLoteDTO, index, key0, event: Event){
      this.confirmationService.confirm({
        key: 'confirmDialog',
        target: event.target,
        message: '¿Está seguro de Subir de orden el Lote?',
        icon: 'pi pi-exclamation-triangle',
        header: 'Confirmación Modificar Orden',
        accept: () => {

          let stockLotetDTOEdit = new LotesChangeOrden();
          stockLotetDTOEdit.lote1 = data.lote;
          let almacen = this.almacens_registo[key0];
          console.log(almacen);
          let stockLoteDTO = almacen.stockLoteDTOs[index - 1];
          console.log(stockLoteDTO);
          stockLotetDTOEdit.lote2 = stockLoteDTO.lote;
          this.modificarOrdenConfirmado(stockLotetDTOEdit);
        },
        reject: () => {
        }
      });
      
    }

    bajarOrden(data:StockLoteDTO, index, key0, event: Event){
      this.confirmationService.confirm({
        key: 'confirmDialog',
        target: event.target,
        message: '¿Está seguro de Subir de orden el Lote?',
        icon: 'pi pi-exclamation-triangle',
        header: 'Confirmación Modificar Orden',
        accept: () => {

          let stockLotetDTOEdit = new LotesChangeOrden();
          stockLotetDTOEdit.lote1 = data.lote;
          let almacen = this.almacens_registo[key0];
          let stockLoteDTO = almacen.stockLoteDTOs[index + 1];
          stockLotetDTOEdit.lote2 = stockLoteDTO.lote;
          this.modificarOrdenConfirmado(stockLotetDTOEdit);
        },
        reject: () => {
        }
      });
      
    }

    modificarOrdenConfirmado(data:LotesChangeOrden){
      this.vistaCarga = true;
      this.loteService.modificarOrden(data).subscribe({
        next: (data) => {
        this.loading = true; 
        this.vistaCarga = false;
        this.getDatosmain();
        this.messageService.add({severity:'success', summary:'Confirmado', detail: 'Se ha modificado el orden del Lote satisfactoriamente'});
      },
      error: (err) => {
        this.vistaCarga = false;
        console.log(err);
      }        
    });
    }






//Funciones Botones Stock
  editarStock(data:any){

    console.log(data);

    let stockLotetDTOEdit = new StockLoteDTO();
    stockLotetDTOEdit = structuredClone(data.stockLoteDTOs[0]);

    this.stock = stockLotetDTOEdit.stock;
    this.stock.almacenId = stockLotetDTOEdit.almacen.id;

    this.almacens_registo.forEach(almacens => {
      if(stockLotetDTOEdit.almacen.id == almacens.code){
        almacens.editar = 1;
      }
      else{
        almacens.editar = 0;
      }
    });

    this.cantidadStock = stockLotetDTOEdit.stock.cantidad;


    this.changeDetectorRef.detectChanges();
    this.inputStockGeneral.nativeElement.focus();

  }

  cancelEditStock(data:any){
    console.log(data);

    let stockLotetDTOEdit = new StockLoteDTO();
    stockLotetDTOEdit = structuredClone(data.stockLoteDTOs[0]);

    this.stock = stockLotetDTOEdit.stock;
    this.stock.almacenId = stockLotetDTOEdit.almacen.id;

    this.almacens_registo.forEach(almacens => {
      almacens.editar = 0;
    });

  }

  saveDatoGeneral(event: Event) {
    this.confirmationService.confirm({
      key: 'confirmDialog',
      target: event.target,
      message: '¿Está seguro de Actualizar el Stock?',
      icon: 'pi pi-info-circle',
      header: 'Confirmación Registro',
      accept: () => {
        //this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
       // this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have accepted'});
        this.registrarConfirmadoStock();
      },
      reject: () => {
       // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
  });
  }

  registrarConfirmadoStock(){
    this.vistaCarga = true;
    //detalleUnidadEdit = structuredClone(this.detalleUnidad));

    this.stock.cantidad = this.cantidadStock;
    this.stock.productoId = this.producto.id;


    this.stockService.registrar(this.stock).subscribe({
      next: (data) => {
      this.vistaCarga = false;
      this.loading = true; 
      this.getDatosmain();
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'El Stock ha sido actualizado satisfactoriamente'});
    },
    error: (err) => {
      this.vistaCarga = false;
      console.log(err);
    }        
  });
  }

  sendMessage() {
    this.cerrarFormStocks.emit(this.producto);
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
