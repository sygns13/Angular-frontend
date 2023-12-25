import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { AppBreadcrumbService } from '../../../menu/app.breadcrumb.service';
import { ConfigsService } from './../../../_service/configs.service';
import { switchMap } from 'rxjs/operators';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { Config } from './../../../_model/config';
import { LazyLoadEvent } from 'primeng/api';
import { LoginService } from 'src/app/_service/login.service';
import { PrinterService } from 'src/app/_service/printer.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit{


  vistaConfigsImpresion: boolean = false;

  vistaCarga: boolean = false;
  impresoras: any[] = [
    {name: 'Ninguno', code: 'Ninguno'},
  ];

  tipoImpresoraVentas: any = null;
  tipoImpresoraVouchersVentas: any = null;
  tipoImpresoraReportes: any = null;
  
  vistaConfigCajasEnabled: boolean = false;
  configCajasEnabled = new Config();
  configCajasEnabledStore = new Config();
  pk_cajasEnabled: string = "cajas_enabled";


  configsModify: Config[] = [];


  vistaConfigVistaPreviaComprobantesEnabled: boolean = false;
  configVistaPreviaComprobantesEnabled = new Config();
  configVistaPreviaComprobantesEnabledStore = new Config();
  pk_vistaPreviaComprobantesEnabled: string = "vista_previa_comp";

  vistaConfigTipoImpresoraVentas: boolean = false;
  configTipoImpresoraVentas = new Config();
  configTipoImpresoraVentasStore = new Config();
  pk_tipoImpresoraVentas: string = "type_impresora_vtas";

  vistaConfigCantCopiasEnabled: boolean = false;
  configCantCopiasEnabled = new Config();
  configCantCopiasEnabledStore = new Config();
  pk_cantCopiasEnabled: string = "cant_copias_comp";

  vistaConfigImpresoraVentas: boolean = false;
  configImpresoraVentas = new Config();
  configImpresoraVentasStore = new Config();
  pk_impresoraVentas: string = "impresora_ventas";

  vistaConfigImpresoraVouchersVentas: boolean = false;
  configImpresoraVouchersVentas = new Config();
  configImpresoraVouchersVentasStore = new Config();
  pk_impresoraVouchersVentas: string = "impresora_tikets";

  vistaConfigImpresoraReportes: boolean = false;
  configImpresoraReportes = new Config();
  configImpresoraReportesStore = new Config();
  pk_impresoraReportes: string = "impresora_reportes";


  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private configsService:ConfigsService,
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService,
    private loginService: LoginService,
    private printerService: PrinterService) {
    this.breadcrumbService.setItems([
    { label: 'Configuraciones' },
    { label: 'Settings', routerLink: ['/configs/settings'] }
    ]);

  }

  ngOnInit(): void {
    this.getConfigsMain();
    this.getImpresoras();
    //this.primengConfig.ripple = true;
    this.vistaCarga = false;
    //this.getPrinters();
  }

  getPrinters() {
    this.printerService
      .getPrinters()
      .then((printers) => {
        console.log('Impresoras disponibles:', printers);
      })
      .catch((error) => {
        console.error('Error al obtener las impresoras:', error);
      });
  }

  getImpresoras(): void{
    this.impresoras = [];
    let impNote = {name: 'Ninguno', code: 'Ninguno'};
    this.impresoras.push(impNote);

  }

  getConfigsMain(): void{
    this.getConfig1();
    this.getConfig2();
  }

  getConfig1(): void{
    this.configsService.listarPorIdStr(this.pk_cajasEnabled).subscribe(data => {
      this.configCajasEnabled = data;
      this.configCajasEnabledStore = structuredClone(data);
      this.vistaConfigCajasEnabled = true;
    });
  }

  getConfig2(): void{
    this.configsService.listarPorIdStr(this.pk_vistaPreviaComprobantesEnabled).subscribe(data => {
      this.configVistaPreviaComprobantesEnabled = data;
      this.configVistaPreviaComprobantesEnabledStore = structuredClone(data);
      this.vistaConfigVistaPreviaComprobantesEnabled = true;
    });

    this.configsService.listarPorIdStr(this.pk_tipoImpresoraVentas).subscribe(data => {
      this.configTipoImpresoraVentas = data;
      this.configTipoImpresoraVentasStore = structuredClone(data);
      this.vistaConfigTipoImpresoraVentas = true;

      
    });

    this.configsService.listarPorIdStr(this.pk_cantCopiasEnabled).subscribe(data => {
      this.configCantCopiasEnabled = data;
      this.configCantCopiasEnabledStore = structuredClone(data);
      this.vistaConfigCantCopiasEnabled = true;
    });

    this.configsService.listarPorIdStr(this.pk_impresoraVentas).subscribe(data => {
      this.configImpresoraVentas = data;
      this.configImpresoraVentasStore = structuredClone(data);
      this.vistaConfigImpresoraVentas = true;

      
      this.tipoImpresoraVentas = null;
      if(this.configImpresoraVentas.valor != null && this.configImpresoraVentas.valor != ""){
        this.tipoImpresoraVentas = {name: this.configImpresoraVentas.valor, code: this.configImpresoraVentas.valor};
      }
    });

    this.configsService.listarPorIdStr(this.pk_impresoraVouchersVentas).subscribe(data => {
      this.configImpresoraVouchersVentas = data;
      this.configImpresoraVouchersVentasStore = structuredClone(data);
      this.vistaConfigImpresoraVouchersVentas = true;

      this.tipoImpresoraVouchersVentas = null;
      if(this.configImpresoraVouchersVentas.valor != null && this.configImpresoraVouchersVentas.valor != ""){
        this.tipoImpresoraVouchersVentas = {name: this.configImpresoraVouchersVentas.valor, code: this.configImpresoraVouchersVentas.valor};
      }

    });

    this.configsService.listarPorIdStr(this.pk_impresoraReportes).subscribe(data => {
      this.configImpresoraReportes = data;
      this.configImpresoraReportesStore = structuredClone(data);
      this.vistaConfigImpresoraReportes = true;

      this.tipoImpresoraReportes = null;
      if(this.configImpresoraReportes.valor != null && this.configImpresoraReportes.valor != ""){
        this.tipoImpresoraReportes = {name: this.configImpresoraReportes.valor, code: this.configImpresoraReportes.valor};
      }
    });
  }

  //Configuracioens Generales
  cancelarConfigGen(): void{
    this.configCajasEnabled = structuredClone(this.configCajasEnabledStore);
  }

  modificarConfigGen(event: Event) {
    this.confirmationService.confirm({
        key: 'confirmDialog',
        target: event.target,
        message: '¿Está seguro de Modificar las Configuraciones Generales?',
        icon: 'pi pi-info-circle',
        header: 'Confirmación Modificacion Configuraciones Generales',
        accept: () => {
          //this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
         // this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have accepted'});
         this.editarConfirmadoConfigGen();
        },
        reject: () => {
         // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
    });
  }

  editarConfirmadoConfigGen(){
    this.vistaCarga = true;

    this.configsService.modificar(this.configCajasEnabled).subscribe({
      next: c => {
      this.vistaCarga = false;
      this.getConfig1();
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'Las Configuraciones Generales han sido modificadas con éxito.'});
    },
    error: error => {
      console.log('Error complete');
      this.vistaCarga = false;
    },
    complete: () => {
      this.vistaCarga = false;
      console.log('Request complete');
    }
  });
  }

  //Configuracioens Generales
  cancelarConfigImpresion(): void{
    this.configVistaPreviaComprobantesEnabled = structuredClone(this.configVistaPreviaComprobantesEnabledStore);
    this.configTipoImpresoraVentas = structuredClone(this.configTipoImpresoraVentasStore);
    this.configCantCopiasEnabled = structuredClone(this.configCantCopiasEnabledStore);
    this.configImpresoraVentas = structuredClone(this.configImpresoraVentasStore);
    this.configImpresoraVouchersVentas = structuredClone(this.configImpresoraVouchersVentasStore);
    this.configImpresoraReportes = structuredClone(this.configImpresoraReportesStore);
  }

  modificarConfigImpresion(event: Event) {
    this.confirmationService.confirm({
        key: 'confirmDialog',
        target: event.target,
        message: '¿Está seguro de Modificar las Configuraciones de Impresión?',
        icon: 'pi pi-info-circle',
        header: 'Confirmación Modificacion Configuraciones de Impresión',
        accept: () => {
          //this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
         // this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have accepted'});
         this.editarConfirmadoConfigImpresion();
        },
        reject: () => {
         // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        }
    });
  }

  editarConfirmadoConfigImpresion(){
    this.vistaCarga = true;

    this.configsModify = [];
    this.configImpresoraVentas.valor = this.tipoImpresoraVentas.code != null ? this.tipoImpresoraVentas.code : null;
    this.configImpresoraVouchersVentas.valor = this.tipoImpresoraVouchersVentas.code != null ? this.tipoImpresoraVouchersVentas.code : null;
    this.configImpresoraReportes.valor = this.tipoImpresoraReportes.code != null ? this.tipoImpresoraReportes.code : null;

    this.configsModify.push(this.configVistaPreviaComprobantesEnabled);
    this.configsModify.push(this.configTipoImpresoraVentas);
    this.configsModify.push(this.configCantCopiasEnabled);
    this.configsModify.push(this.configImpresoraVentas);
    this.configsModify.push(this.configImpresoraVouchersVentas);
    this.configsModify.push(this.configImpresoraReportes);

    this.configsService.modificarList(this.configsModify).subscribe({
      next: c => {
      this.vistaCarga = false;
      //this.getConfig1();
      this.messageService.add({severity:'success', summary:'Confirmado', detail: 'Las Configuraciones de Impresión han sido modificadas con éxito.'});
      this.configVistaPreviaComprobantesEnabledStore = structuredClone(this.configVistaPreviaComprobantesEnabled);
      this.configTipoImpresoraVentasStore = structuredClone(this.configTipoImpresoraVentas);
      this.configCantCopiasEnabledStore = structuredClone(this.configCantCopiasEnabled);
      this.configImpresoraVentasStore = structuredClone(this.configImpresoraVentas);
      this.configImpresoraVouchersVentasStore = structuredClone(this.configImpresoraVouchersVentas);
      this.configImpresoraReportesStore = structuredClone(this.configImpresoraReportes);
      },
      error: error => {
        console.log('Error complete');
        this.vistaCarga = false;
      },
      complete: () => {
        this.vistaCarga = false;
        console.log('Request complete');
      }
    });

    /*
    this.configsService.modificar(this.configVistaPreviaComprobantesEnabled).subscribe({
      next: c => {
      this.vistaCarga = false;
      //this.getConfig1();
      //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'Las Configuraciones Generales han sido modificadas con éxito.'});
      this.configVistaPreviaComprobantesEnabledStore = structuredClone(this.configVistaPreviaComprobantesEnabled);
    },
    error: error => {
      console.log('Error complete');
      this.vistaCarga = false;
    },
    complete: () => {
      this.vistaCarga = false;
      console.log('Request complete');
    }
  });

  this.configsService.modificar(this.configTipoImpresoraVentas).subscribe({
    next: c => {
    this.vistaCarga = false;
    //this.getConfig1();
    //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'Las Configuraciones Generales han sido modificadas con éxito.'});
    this.configTipoImpresoraVentasStore = structuredClone(this.configTipoImpresoraVentas);
  },
  error: error => {
    console.log('Error complete');
    this.vistaCarga = false;
  },
  complete: () => {
    this.vistaCarga = false;
    console.log('Request complete');
  }
  });

  this.configsService.modificar(this.configCantCopiasEnabled).subscribe({
    next: c => {
    this.vistaCarga = false;
    //this.getConfig1();
    //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'Las Configuraciones Generales han sido modificadas con éxito.'});
    this.configCantCopiasEnabledStore = structuredClone(this.configCantCopiasEnabled);
  },
  error: error => {
    console.log('Error complete');
    this.vistaCarga = false;
  },
  complete: () => {
    this.vistaCarga = false;
    console.log('Request complete');
  }
  });
  
  this.configsService.modificar(this.configImpresoraVentas).subscribe({
    next: c => {
    this.vistaCarga = false;
    //this.getConfig1();
    //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'Las Configuraciones Generales han sido modificadas con éxito.'});
    this.configImpresoraVentasStore = structuredClone(this.configImpresoraVentas);
  },
  error: error => {
    console.log('Error complete');
    this.vistaCarga = false;
  },
  complete: () => {
    this.vistaCarga = false;
    console.log('Request complete');
  }
  });

  this.configsService.modificar(this.configImpresoraVouchersVentas).subscribe({
    next: c => {
    this.vistaCarga = false;
    //this.getConfig1();
    //this.messageService.add({severity:'success', summary:'Confirmado', detail: 'Las Configuraciones Generales han sido modificadas con éxito.'});
    this.configImpresoraVouchersVentasStore = structuredClone(this.configImpresoraVouchersVentas);
  },
  error: error => {
    console.log('Error complete');
    this.vistaCarga = false;
  },
  complete: () => {
    this.vistaCarga = false;
    console.log('Request complete');
  }
  });

  this.configsService.modificar(this.configImpresoraReportes).subscribe({
    next: c => {
    this.vistaCarga = false;
    //this.getConfig1();
    this.messageService.add({severity:'success', summary:'Confirmado', detail: 'Las Configuraciones de Impresión han sido modificadas con éxito.'});
    this.configImpresoraReportesStore = structuredClone(this.configImpresoraReportes);
  },
  error: error => {
    console.log('Error complete');
    this.vistaCarga = false;
  },
  complete: () => {
    this.vistaCarga = false;
    console.log('Request complete');
  }
  });

  */


  }

}
