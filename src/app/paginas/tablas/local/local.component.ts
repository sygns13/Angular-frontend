import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import {AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-local',
  templateUrl: './local.component.html',
  styleUrls: ['./local.component.scss']
})
export class LocalComponent implements OnInit {

 @ViewChild('inputNombre', { static: false }) inputNombre: ElementRef;

  vistaRegistro: boolean = false;

  clsDepartamento: any = null;
  clsProvincia: any = null;
  clsDistrito: any = null;
  nombre: String = '';
  codigo: String = '';
  direccion: String = '';
  clsEstado: any = null;

  states: any[] = [
      {name: 'Activo', code: '1'},
      {name: 'Inactivo', value: '0'}
  ];
  

  //customers: Customer[];
  first = 0;
  rows = 10;

  customers: any[] = [
    {id: 1, name: 'Juan', country: {name:'Peru', code:'1234'}, company:'Puerto Ballarta', date:'13/11/1995', status:'Activo', activity: 15, representative:{name:'Anna', image:'Fali'}},
];

  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef) {
    this.breadcrumbService.setItems([
        { label: 'Tablas Base' },
        { label: 'Gestión de Locales', routerLink: ['/tablas/locales'] }
    ]);
}

  ngOnInit(): void {
    //this.customerService.getCustomersLarge().then(customers => this.customers = customers);
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
    return this.customers ? this.first === (this.customers.length - this.rows): true;
}

isFirstPage(): boolean {
    return this.customers ? this.first === 0 : true;
}

setFocusNombre() {    

  this.changeDetectorRef.detectChanges();
  this.inputNombre.nativeElement.focus();

}

//Funciones crud


nuevo() {
  this.vistaRegistro = true;
  this.cancelar();
}

cancelar() {

  this.clsDepartamento = null;
  this.clsProvincia = null;
  this.clsDistrito = null;
  this.nombre = '';
  this.codigo = '';
  this.direccion = '';
  this.clsEstado = null;

  this.setFocusNombre();
}

cerrar(){
  this.vistaRegistro = false;
}


}
