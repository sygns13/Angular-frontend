import { Component, OnInit, Input, Output, EventEmitter,  ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { EntradaStock } from './../../../_model/entrada_stock';
import { EntradaStockService } from './../../../_service/entrada_stock.service';
import { AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import { ConfirmationService, MessageService} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';
import { PassfechavistaPipe } from './../../../_pipes/passfechavista.pipe';
import { OnlydecimalesPipe } from './../../../_pipes/onlydecimales.pipe';

@Component({
  selector: 'app-vercompra',
  templateUrl: './vercompra.component.html',
  styleUrls: ['./vercompra.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class VercompraComponent implements OnInit{

  message: string = "valor1";
  vistaCarga: boolean = false;

  @Input() entradaStock: EntradaStock;
  @Output() cerrarFormVerCompra = new EventEmitter<EntradaStock>();

  billData: any[];
  billCols: any[];

  productData: any[];

  productCols: any[];

  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private entradaStockService: EntradaStockService, 
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService,
    private onlydecimalesPipe: OnlydecimalesPipe, private currencyPipe:CurrencyPipe, private passfechavistaPipe: PassfechavistaPipe) {
    this.breadcrumbService.setItems([
      { label: 'Compras' },
      { label: 'Compras Realizadas', routerLink: ['/compras/compra_realizada'] }
    ]);

  }

  ngOnInit(): void {
    /* this.getTipoProductos();
    this.getMarcas();
    this.getPresentaciones(); */
    this.getEntradaStocks();
    this.primengConfig.ripple = true;
    this.vistaCarga = false;
    //this.setFocusBuscar();
  }

  //Carga de Data
  getEntradaStocks(): void {
    this.entradaStockService.listarPorId(this.entradaStock.id).subscribe(data => {
      if(data != null && data.id != null){
        this.entradaStock = data;
        console.log(this.entradaStock);
        this.renderHeaders();
        this.renderProducts();
      }
    });
  }

  renderHeaders(): void{
    this.billData = [
      {
          'proveedor': this.entradaStock.proveedor != null ? this.entradaStock.proveedor.nombre : "",
          'documento': this.entradaStock.proveedor != null ? this.entradaStock.proveedor.tipoDocumento.tipo + ": " + this.entradaStock.proveedor.documento  : "",
          'facturaProveedor': this.entradaStock.facturaProveedor != null ? this.entradaStock.facturaProveedor.tipoComprobante.nombre + " " + this.entradaStock.facturaProveedor.serie + "-" + this.entradaStock.facturaProveedor.numero : "",
          'fecha': this.passfechavistaPipe.transform(this.entradaStock.fecha),
          'hora': this.entradaStock.hora,
      }
  ];

  this.billCols = [
      { field: 'proveedor', header: 'Proveedor' },
      { field: 'documento', header: 'Documento de Identidad' },
      { field: 'facturaProveedor', header: 'Comprobante' },
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

  if(this.entradaStock.detalleEntradaStock != null){
    this.entradaStock.detalleEntradaStock.forEach((detalleEntrada, index) => {
      let detalle = {
        'numero': index + 1,
        'codigo': detalleEntrada.producto.codigoProducto,
        'producto': detalleEntrada.producto.presentacion.presentacion + ' ' + detalleEntrada.producto.nombre + ' ' + detalleEntrada.producto.marca.nombre,
        'unidad': detalleEntrada.unidad,
        'lote': detalleEntrada.lote.id != null ? detalleEntrada.lote.nombre : 'No Aplica',
        //'fechaVencimiento': detalleEntrada.lote.id != null && detalleEntrada.lote.fechaVencimiento != null ? detalleEntrada.lote.fechaVencimiento : 'No Aplica',
        'cantidad': detalleEntrada.cantidad,
        'precioUnitario': this.currencyPipe.transform(detalleEntrada.costo, "PEN" , "S/."),
        'total': this.currencyPipe.transform(detalleEntrada.costoTotal, "PEN" , "S/."),
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
      { field: 'total', header: 'Importe de Venta' }
  ];
  }



  print(): void{
    window.print();
  }

  cerrarFormulario(){
    this.cerrarFormVerCompra.emit(this.entradaStock);
  }

}
