import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import {AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';

import { switchMap } from 'rxjs/operators';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';

import { ClienteService } from './../../../_service/cliente.service';
import { Cliente } from './../../../_model/cliente';
import { TipoDocumento } from './../../../_model/tipo_documento';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class VentaComponent implements OnInit {

  vistaCarga : boolean = true;

  constructor() { }

  ngOnInit(): void {

    this.vistaCarga = false;
  }

}
