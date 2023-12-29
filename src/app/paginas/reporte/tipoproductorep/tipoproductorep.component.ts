import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import {AppBreadcrumbService } from '../../../menu/app.breadcrumb.service';
import { TipoProductoService } from '../../../_service/tipo_producto.service';
import { ExportsService } from './../../../_service/reportes/exports.service';
import { switchMap } from 'rxjs/operators';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { TipoProducto } from '../../../_model/tipo_producto';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-tipoproductorep',
  templateUrl: './tipoproductorep.component.html',
  styleUrls: ['./tipoproductorep.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class TipoproductorepComponent implements OnInit {

  @ViewChild('inputTipo', { static: false }) inputTipo: ElementRef;

  vistaRegistro: boolean = false;


  tipo: String = '';
  clsEstado: any = null;

  estados: any[] = [
      {name: 'Activo', code: '1'},
      {name: 'Inactivo', code: '0'}
  ];


  tipoProducto = new TipoProducto();

  page: number = 0;
  first: number = 0;
  last: number = 0;
  rows: number = 10;

  isFirst: boolean = true;
  isLast: boolean = false;
  totalRecords: number = 0;
  numberElements: number = 0;

  tipoProductos: any[] = [];

  msgs: Message[] = [];
  position: string;

  tipoFrm: String = 'Nuevo Tipo de Producto';
  vistaBotonRegistro : boolean = false;
  vistaBotonEdicion : boolean = false;
  vistaCarga : boolean = true;

  loading: boolean = true; 
  txtBuscar: String = '';


  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private tipoProductoService: TipoProductoService,
                private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService,
                private exportsService: ExportsService) {
    this.breadcrumbService.setItems([
      { label: 'Reportes' },
      { label: 'Tipos de Productos', routerLink: ['/reporte/tipo-productos'] }
    ]);

}

  ngOnInit(): void {
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

  setFocusTipo() {    

    this.changeDetectorRef.detectChanges();
    this.inputTipo.nativeElement.focus();

  }

  //Carga de Data
/*
  listarMain() {

    this.tipoProductoService.listar().subscribe(data => {
      
      this.tipoProductos = data;
    });
  }*/

  loadData(event: LazyLoadEvent) { 
    this.loading = true; 
    this.rows = event.rows;
    this.page = event.first / this.rows;

    this.listarPageMain(this.page, this.rows);

  }

  listarPageMain(p: number, s:number) {

    this.tipoProductoService.listarPageable(p, s, this.txtBuscar).subscribe(data => {
      this.tipoProductos = data.content;
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

  exportarXLSX(){

    this.exportsService.exportTipoProductosXLSX().subscribe(data => {
  
      const file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileURL = URL.createObjectURL(file);
  
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = fileURL;
      a.download = 'TipoProductosReporte.xlsx';
      a.click();
      //window.open(fileURL);
    });
  }
  
  exportarPDF(){
  
    this.exportsService.exportTipoProductosPDF().subscribe(data => {
  
      const file = new Blob([data], { type: 'application/pdf' });  
      const fileURL = URL.createObjectURL(file);
  
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = fileURL;
      a.download = 'TipoProductosReporte.pdf';
      a.click();
  
      //window.open(fileURL);
    });
    
  }



}
