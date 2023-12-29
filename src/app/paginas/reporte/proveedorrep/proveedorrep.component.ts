import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';

import { switchMap } from 'rxjs/operators';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';

import { ProveedorService } from './../../../_service/proveedor.service';
import { ExportsService } from './../../../_service/reportes/exports.service';
import { Proveedor } from './../../../_model/proveedor';
import { TipoDocumento } from './../../../_model/tipo_documento';

@Component({
  selector: 'app-proveedorrep',
  templateUrl: './proveedorrep.component.html',
  styleUrls: ['./proveedorrep.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class ProveedorrepComponent implements OnInit {

  @ViewChild('inputNombre', { static: false }) inputNombre: ElementRef;

  vistaRegistro: boolean = false;
  tipoDocumentos: any[] = [];

  clsTipoDocumento: any = null;
  nombre: string = '';
  tipo_documento_id: number = null;
  documento: string = '';
  direccion: string = '';
  telefono: string = '';
  correo1: string = '';
  correo2: string = '';

  proveedor = new Proveedor();

  proveedors: any[] = [];

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

  tipoFrm: String = 'Nuevo Proveedor';
  vistaBotonRegistro : boolean = false;
  vistaBotonEdicion : boolean = false;
  vistaCarga : boolean = true;

  loading: boolean = true; 
  txtBuscar: String = '';

  //selectedProveedor: Proveedor;

  message:string;

  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private proveedorService: ProveedorService,
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService,
    private exportsService: ExportsService) {
    this.breadcrumbService.setItems([
    { label: 'Reportes' },
    { label: 'Proveedores', routerLink: ['/reporte/proveedores'] }
    ]);

}

ngOnInit(): void {
  this.getTipoDocumentos();
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

getTipoDocumentos() {

  this.clsTipoDocumento = null;
  this.tipoDocumentos = [];

  this.proveedorService.getTipoDocumentos().subscribe(data => {
    data.forEach(tipoDoc => {
      this.tipoDocumentos.push({name: tipoDoc.tipo, code: tipoDoc.id});
    });
  });
}

loadData(event: LazyLoadEvent) { 
  this.loading = true; 
  this.rows = event.rows;
  this.page = event.first / this.rows;

  this.listarPageMain(this.page, this.rows);

}

listarPageMain(p: number, s:number) {

  this.proveedorService.listarPageable(p, s, this.txtBuscar).subscribe(data => {
    this.proveedors = data.content;
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


exportarXLSX(){

  this.exportsService.exportProveedoresXLSX().subscribe(data => {

    const file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileURL = URL.createObjectURL(file);

    const a = document.createElement('a');
    a.setAttribute('style', 'display:none');
    document.body.appendChild(a);
    a.href = fileURL;
    a.download = 'ProveedorReporte.xlsx';
    a.click();
    //window.open(fileURL);
  });
}

exportarPDF(){

  this.exportsService.exportProveedoresPDF().subscribe(data => {

    const file = new Blob([data], { type: 'application/pdf' });  
    const fileURL = URL.createObjectURL(file);

    const a = document.createElement('a');
    a.setAttribute('style', 'display:none');
    document.body.appendChild(a);
    a.href = fileURL;
    a.download = 'ProveedorReporte.pdf';
    a.click();

    //window.open(fileURL);
  });
  
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
