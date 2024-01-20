import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { AppBreadcrumbService } from '../../../menu/app.breadcrumb.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class PrincipalComponent implements OnInit{

  overviewChartData1: any;
  overviewChartOptions: any;

  constructor(private breadcrumbService: AppBreadcrumbService, private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService , private primengConfig: PrimeNGConfig , private messageService: MessageService,
    public app: AppComponent) {
    this.breadcrumbService.setItems([
    { label: 'Principal' },
    ]);

  }

  ngOnInit(): void {
    /* this.getTipoProductos();
    this.getMarcas();
    this.getPresentaciones();
    this.listarPageMain(this.page, this.rows); */
    this.primengConfig.ripple = true;
    /* this.vistaCarga = false; */
    this.overviewChartData1 = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
      datasets: [
          {
              data: [50, 64, 32, 24, 18, 27, 20, 36, 30],
              borderColor: [
                  '#4DD0E1',
              ],
              backgroundColor: [
                  'rgba(77, 208, 225, 0.8)',
              ],
              borderWidth: 2,
              fill: true
          }
      ]
  };

  this.overviewChartOptions = {
    legend: {
        display: false
    },
    responsive: true,
    scales: {
        yAxes: [{
            display: false
        }],
        xAxes: [{
            display: false
        }]
    },
    tooltips: {
        enabled: false
    },
    elements: {
        point: {
            radius: 0
        }
    },
  };

  this.setOverviewColors();
  }

  setOverviewColors() {
    const { pinkBorderColor, pinkBgColor, tealBorderColor, tealBgColor } = this.getOverviewColors();

    this.overviewChartData1.datasets[0].borderColor[0] = tealBorderColor;
    this.overviewChartData1.datasets[0].backgroundColor[0] = tealBgColor;

    /* this.overviewChartData2.datasets[0].borderColor[0] = tealBorderColor;
    this.overviewChartData2.datasets[0].backgroundColor[0] = tealBgColor;

    this.overviewChartData3.datasets[0].borderColor[0] = pinkBorderColor;
    this.overviewChartData3.datasets[0].backgroundColor[0] = pinkBgColor;

    this.overviewChartData4.datasets[0].borderColor[0] = tealBorderColor;
    this.overviewChartData4.datasets[0].backgroundColor[0] = tealBgColor; */
  
  }

  getOverviewColors() {
    const isLight = this.app.layoutMode === 'light';
    return {
        pinkBorderColor: isLight ? '#E91E63' : '#EC407A',
        pinkBgColor: isLight ? '#F48FB1' : '#F8BBD0',
        tealBorderColor: isLight ? '#009688' : '#26A69A',
        tealBgColor: isLight ? '#80CBC4' : '#B2DFDB'
    }
}

}
