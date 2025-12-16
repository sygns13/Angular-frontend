import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { AppBreadcrumbService } from '../../../menu/app.breadcrumb.service';
import { IngresoSalidaCajaService } from '../../../_service/ingreso_salida_caja.service';
import { switchMap } from 'rxjs/operators';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { IngresoSalidaCaja } from '../../../_model/ingreso_salida_caja';
import { LazyLoadEvent } from 'primeng/api';
import { Almacen } from 'src/app/_model/almacen';
import { AlmacenService } from '../../../_service/almacen.service';
import { GestionloteService } from 'src/app/_service/gestionlote.service';
import { CajaSucursalDTO } from 'src/app/_model/cajasucursal_dto';
import { CajaDiariaSucursalService } from 'src/app/_service/reportes/caja_diaria_sucursal.service';
import * as moment from 'moment';

@Component({
  selector: 'app-caja-diaria',
  templateUrl: './caja-diaria.component.html',
  styleUrls: ['./caja-diaria.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class CajaDiariaComponent implements OnInit {


  clsAlmacen: any = { name: 'GENERAL (TODOS LOS LOCALES)', code: 0 };
  almacens: any[] = [];

  fechaBD: string = '';
  //horaBD: string = '';

  vistaCarga: boolean = true;

  cajaInicial: string = "0.00";
  cajaTotal: string = "0.00";

  ingresoVentas: string = "0.00";
  ingresoOtros: string = "0.00";

  ingresoTotal: string = "0.00";

  egresoCompras: string = "0.00";
  egresoOtros: string = "0.00";

  egresoTotal: string = "0.00";

  fechaVista: string = '27/12/2023';

  cajaSucursalDTO: CajaSucursalDTO = new CajaSucursalDTO();

  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef, private ingresoSalidaCajaService: IngresoSalidaCajaService,
    private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig, private messageService: MessageService,
    private almacenService: AlmacenService,
    private gestionloteService: GestionloteService,
    private cajaDiariaSucursalService: CajaDiariaSucursalService) {
    this.breadcrumbService.setItems([
      { label: 'Tesorería Sucursal' },
      { label: 'Caja Diaria por  Sucursal', routerLink: ['/tesoreria/caja-diaria'] }
    ]);
  }


  ngOnInit(): void {
    this.getAlmacenes();
    this.primengConfig.ripple = true;
    this.vistaCarga = false;
  }

  getAlmacenes() {

    this.almacens = [];

    this.almacens.push({ name: 'GENERAL (TODOS LOS LOCALES)', code: 0 });
    //this.clsAlmacen = {name: 'GENERAL (TODOS LOS LOCALES)', code: 0};

    this.gestionloteService.getAlmacensDate().subscribe(data => {
      this.fechaBD = data.fecha;

      //const fechaFormat = moment(this.fechaBD, 'YYYY-MM-DD');
      this.fechaVista = this.fechaBD;

      data.almacens.forEach(almacen => {
        this.almacens.push({ name: almacen.nombre, code: almacen.id });
      });

      this.getMainData();
    });
  }

  getMainData() {
    const fechaFormatBD = moment(this.fechaVista, 'DD/MM/YYYY');

    /*
    if(!fechaFormatBD.isValid){
        this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
        this.vistaCarga = false;
        return false;
      }
    */
    let fecha = fechaFormatBD.format('YYYY-MM-DD');

    this.cajaDiariaSucursalService.getCajaDiaria(fecha, this.clsAlmacen.code).subscribe(data => {
      this.cajaSucursalDTO = data;

      this.cajaInicial = this.cajaSucursalDTO.cajaInicial.toFixed(2);
      this.cajaTotal = this.cajaSucursalDTO.cajaTotal.toFixed(2);

      this.ingresoVentas = this.cajaSucursalDTO.ingresosVentas.toFixed(2);
      this.ingresoOtros = this.cajaSucursalDTO.ingresosOtros.toFixed(2);

      this.ingresoTotal = this.cajaSucursalDTO.ingresosTotal.toFixed(2);

      this.egresoCompras = this.cajaSucursalDTO.egresosCompras.toFixed(2);
      this.egresoOtros = this.cajaSucursalDTO.egresosOtros.toFixed(2);

      this.egresoTotal = this.cajaSucursalDTO.egresosTotal.toFixed(2);
    });
  }

  cambioSucursal(event: any) {
    this.getMainData();
  }

  actualizar() {
    this.getMainData();
  }

  printDetallado() {

  }

  printResumen() {

  }

  verIngresosVentas() {

  }
  verIngresosOtros() {

  }
  verEgresosCompras() {

  }
  verEgresosOtros() {

  }

}
