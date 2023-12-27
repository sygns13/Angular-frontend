import { Component, OnInit, Input, Output, EventEmitter,  ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Venta } from './../../../_model/venta';
import { VentaService } from './../../../_service/venta.service';
import { AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import { ConfirmationService, MessageService} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';
import { PassfechavistaPipe } from './../../../_pipes/passfechavista.pipe';
import { OnlydecimalesPipe } from './../../../_pipes/onlydecimales.pipe';

@Component({
  selector: 'app-verventa',
  templateUrl: './verventa.component.html',
  styleUrls: ['./verventa.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class VerventaComponent implements OnInit{

  message: string = "valor1";
  vistaCarga: boolean = false;

  @Input() venta: Venta;
  @Output() cerrarFormVerVenta = new EventEmitter<Venta>();

  billData: any[];
  billCols: any[];

  productData: any[];

  productCols: any[];

  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private ventaService: VentaService, 
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService,
    private onlydecimalesPipe: OnlydecimalesPipe, private currencyPipe:CurrencyPipe, private passfechavistaPipe: PassfechavistaPipe) {
    this.breadcrumbService.setItems([
      { label: 'Ventas' },
      { label: 'Ventas Realizadas', routerLink: ['/ventas/venta_realizada'] }
    ]);

  }

  ngOnInit(): void {
    /* this.getTipoProductos();
    this.getMarcas();
    this.getPresentaciones(); */
    this.getVenta();
    this.primengConfig.ripple = true;
    this.vistaCarga = false;
    //this.setFocusBuscar();
  }

  //Carga de Data
  getVenta(): void {
    this.ventaService.listarPorId(this.venta.id).subscribe(data => {
      if(data != null && data.id != null){
        this.venta = data;
        console.log(this.venta);
        this.renderHeaders();
        this.renderProducts();
      }
    });
  }

  renderHeaders(): void{
    this.billData = [
      {
          'cliente': this.venta.cliente != null ? this.venta.cliente.nombre : "",
          'documento': this.venta.cliente != null ? this.venta.cliente.tipoDocumento.tipo + ": " + this.venta.cliente.documento  : "",
          'comprobante': this.venta.comprobante != null ? this.venta.comprobante.initComprobante.tipoComprobante.nombre + " " + this.venta.comprobante.serie + "-" + this.venta.comprobante.numero : "",
          'fecha': this.passfechavistaPipe.transform(this.venta.fecha),
          'hora': this.venta.hora,
      }
  ];

  this.billCols = [
      { field: 'cliente', header: 'Cliente' },
      { field: 'documento', header: 'Documento de Identidad' },
      { field: 'comprobante', header: 'Comprobante' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'hora', header: 'Hora' },
  ];
  }

  renderProducts(): void{
    /* this.productData = [
      {
          'description': 'License A',
          'quantity': '4',
          'price': '$99.00',
          'total': '$396.00'
      },
      {
          'description': 'License B',
          'quantity': '1',
          'price': '$790.00',
          'total': '$790.00'
      },
      {
          'description': 'License C',
          'quantity': '2',
          'price': '$59.00',
          'total': '$118.00'
      }
  ]; */

  this.productData = [];

  if(this.venta.detalleVentas != null){
    this.venta.detalleVentas.forEach((detalleVenta, index) => {
      let detalle = {
        'numero': index + 1,
        'codigo': detalleVenta.producto.codigoProducto,
        'producto': detalleVenta.producto.presentacion.presentacion + ' ' + detalleVenta.producto.nombre + ' ' + detalleVenta.producto.marca.nombre,
        'unidad': detalleVenta.unidad,
        'lote': detalleVenta.lote.id != null ? detalleVenta.lote.nombre : 'No Aplica',
        //'fechaVencimiento': detalleVenta.lote.id != null && detalleVenta.lote.fechaVencimiento != null ? detalleVenta.lote.fechaVencimiento : 'No Aplica',
        'cantidad': detalleVenta.cantidad,
        'precioUnitario': this.currencyPipe.transform(detalleVenta.precioVenta, "PEN" , "S/."),
        'descuento': detalleVenta.tipDescuento == 2 ? this.currencyPipe.transform(detalleVenta.descuento, "PEN" , "S/.") : detalleVenta.tipDescuento == 1 ? this.onlydecimalesPipe.transform(detalleVenta.descuento) : '',
        'total': this.currencyPipe.transform(detalleVenta.precioTotal, "PEN" , "S/."),
      };

      this.productData.push(detalle);
    });
  }

  this.productCols = [
      { field: 'numero', header: 'N°' },
      { field: 'codigo', header: 'Código del Producto' },
      { field: 'producto', header: 'Descripción del Producto' },
      { field: 'unidad', header: 'Unidad' },
      { field: 'lote', header: 'Lote' },
      //{ field: 'fechaVencimiento', header: 'Fecha de Vencimiento' },
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'precioUnitario', header: 'Precio Unitario' },
      { field: 'descuento', header: 'Descuento' },
      { field: 'total', header: 'Importe de Venta' }
  ];
  }



  print(): void{
    window.print();
  }

  cerrarFormulario(){
    this.cerrarFormVerVenta.emit(this.venta);
  }

}
