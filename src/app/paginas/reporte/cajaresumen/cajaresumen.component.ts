import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { AppBreadcrumbService} from '../../../menu/app.breadcrumb.service';
import { IngresoSalidaCajaService } from '../../../_service/ingreso_salida_caja.service';
import { switchMap } from 'rxjs/operators';
import { ConfirmationService, MessageService} from 'primeng/api';
import { Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { IngresoSalidaCaja } from '../../../_model/ingreso_salida_caja';
import { LazyLoadEvent } from 'primeng/api';
import { Almacen } from 'src/app/_model/almacen';
import { AlmacenService } from '../../../_service/almacen.service';
import { GestionloteService } from 'src/app/_service/gestionlote.service';
import { CajaSucursalDTO } from 'src/app/_model/cajasucursal_dto';
import { CajaDiariaSucursalService } from 'src/app/_service/reportes/caja_diaria_sucursal.service';
import * as moment from 'moment';
import { FiltroGeneral } from 'src/app/_util/filtro_general';
import { ExportsService } from './../../../_service/reportes/exports.service';

@Component({
  selector: 'app-cajaresumen',
  templateUrl: './cajaresumen.component.html',
  styleUrls: ['./cajaresumen.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class CajaresumenComponent implements OnInit{


  clsAlmacen: any = {name: 'GENERAL (TODOS LOS LOCALES)', code: 0};
  almacens: any[] = [];

  fechaBD: string = '';
  //horaBD: string = '';
  fechaInicio: string = '';
  fechaFinal: string = '';

  vistaCarga : boolean = true;

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

  FiltroGeneral: FiltroGeneral = new FiltroGeneral();

  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef , private ingresoSalidaCajaService:IngresoSalidaCajaService,
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService, 
    private almacenService: AlmacenService,
    private gestionloteService: GestionloteService,
    private cajaDiariaSucursalService: CajaDiariaSucursalService,
    private exportsService: ExportsService) {
    this.breadcrumbService.setItems([
      { label: 'Reportes' },
      { label: 'Resumen de Caja', routerLink: ['/reporte/resumen-caja'] }
    ]);
  }


  ngOnInit(): void {
    this.getAlmacenes();
    this.primengConfig.ripple = true;
    this.vistaCarga = false;
  }

  getAlmacenes() {

    this.almacens = [];
    this.almacens.push({name: 'GENERAL (TODOS LOS LOCALES)', code: 0});
    this.clsAlmacen = {name: 'GENERAL (TODOS LOS LOCALES)', code: 0};
    this.gestionloteService.getAlmacensDate().subscribe(data => {
      this.fechaBD = data.fecha;

      //const fechaFormat = moment(this.fechaBD, 'YYYY-MM-DD');
      this.fechaVista = this.fechaBD;
      this.fechaInicio = this.fechaBD;
      this.fechaFinal = this.fechaBD;

      data.almacens.forEach(almacen => {
        this.almacens.push({name: almacen.nombre, code: almacen.id});
      });

      this.evaluarFiltros();
    if(this.FiltroGeneral.fechaInicio == null){
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Inicio indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
      return;
    }
    if(this.FiltroGeneral.fechaFinal == null){
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha Final indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
      return;
    }
      this.getMainData();
    });
  }

  getMainData(){

   this.cajaDiariaSucursalService.getResumenCaja(this.FiltroGeneral).subscribe(data => {
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
    this.evaluarFiltros();
    if(this.FiltroGeneral.fechaInicio == null){
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Inicio indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
      return;
    }
    if(this.FiltroGeneral.fechaFinal == null){
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha Final indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
      return;
    }
    this.getMainData();
  }

  evaluarFiltros(){

    this.FiltroGeneral = new FiltroGeneral();
  
    if(this.clsAlmacen != null){
      this.FiltroGeneral.almacenId = this.clsAlmacen.code;
    }
    else{
      this.FiltroGeneral.almacenId = 0;
    }

    if(this.fechaInicio != null && this.fechaFinal != null && this.fechaInicio.length == 10 && this.fechaFinal.length == 10){
      const fechaIni = moment(this.fechaInicio, 'DD/MM/YYYY');
      const fechaFin = moment(this.fechaFinal, 'DD/MM/YYYY');
      if(fechaIni.isValid && fechaFin.isValid){
        this.FiltroGeneral.fechaInicio = fechaIni.format('YYYY-MM-DD');
        this.FiltroGeneral.fechaFinal = fechaFin.format('YYYY-MM-DD');
      }
      else{
        this.FiltroGeneral.fechaInicio = null;
        this.FiltroGeneral.fechaFinal = null;
      }
    } else{
      this.FiltroGeneral.fechaInicio = null;
      this.FiltroGeneral.fechaFinal = null;
    }
  }


  exportarPDF(): void{
    this.evaluarFiltros();
    if(this.FiltroGeneral.fechaInicio == null){
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Inicio indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
      return;
    }
    if(this.FiltroGeneral.fechaFinal == null){
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha Final indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
      return;
    }
    this.printPDF();
  }

  exportarExcel(): void{
    this.evaluarFiltros();
    if(this.FiltroGeneral.fechaInicio == null){
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Inicio indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
      return;
    }
    if(this.FiltroGeneral.fechaFinal == null){
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha Final indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
      return;
    }
    this.printXLS();
  }

  printPDF(): void{
    this.exportsService.exportCajaResumenPDF(this.FiltroGeneral).subscribe(data => {
  
      const file = new Blob([data], { type: 'application/pdf' });  
      const fileURL = URL.createObjectURL(file);
  
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = fileURL;
      a.download = 'ResumenCaja.pdf';
      a.click();
  
      //window.open(fileURL);
    });
  }

  printXLS(): void{
    this.exportsService.exportCajaResumenXLSX(this.FiltroGeneral).subscribe(data => {
  
      const file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileURL = URL.createObjectURL(file);
  
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = fileURL;
      a.download = 'ResumenCaja.xlsx';
      a.click();
      //window.open(fileURL);
    });
  }

  actualizar(){
    this.evaluarFiltros();
    if(this.FiltroGeneral.fechaInicio == null){
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha de Inicio indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
      return;
    }
    if(this.FiltroGeneral.fechaFinal == null){
      this.messageService.add({severity:'error', summary:'Alerta', detail: 'La fecha Final indicada no corresponde a una fecha válida, por favor ingrese una fecha correcta'});
      return;
    }
    this.getMainData();
  }

  printDetallado(){

  }

  printResumen(){

  }

  verIngresosVentas(){

  }
  verIngresosOtros(){

  }
  verEgresosCompras(){

  }
  verEgresosOtros(){

  }

}
