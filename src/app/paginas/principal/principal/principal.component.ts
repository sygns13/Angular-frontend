import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppBreadcrumbService } from '../../../menu/app.breadcrumb.service';
import { PrimeNGConfig, MenuItem } from 'primeng/api';
import { AppComponent } from '../../../app.component';
import 'chart.js/auto';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PrincipalComponent implements OnInit {
  menuItems: MenuItem[] = [];
  spark1: any; spark2: any; spark3: any; spark4: any;
  sparkOpts: any; sparkOptsPink: any;
  orderGraph: any; orderGraphOpts: any;

  constructor(
    private breadcrumbService: AppBreadcrumbService,
    private primengConfig: PrimeNGConfig,
    public app: AppComponent
  ) {
    this.breadcrumbService.setItems([{ label: 'Principal' }]);
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.menuItems = [
      { label: 'Refresh', icon: 'pi pi-refresh' },
      { label: 'Export',  icon: 'pi pi-download' }
    ];

    this.spark1 = this.mkSpark([50,64,32,24,18,27,20,36,30], '#009688', 'rgba(0,150,136,.15)');
    this.spark2 = this.mkSpark([15,25,35,55,45,65,50,70,60], '#009688', 'rgba(0,150,136,.15)');
    this.spark3 = this.mkSpark([10,22,18,30,26,20,24,28,22], '#673ab7', 'rgba(103,58,183,.15)');
    this.spark4 = this.mkSpark([12,18,22,16,14,20,26,18,16], '#009688', 'rgba(0,150,136,.15)');
    this.sparkOpts = this.mkSparkOpts();
    this.sparkOptsPink = this.mkSparkOpts();

    this.orderGraph = {
      labels: ['January','February','March','April','May','June','July','August','September'],
      datasets: [
        { label: 'Nuevas Ventas', data: [30,22,70,30,60,25,60,30,45],
          fill: true, tension: 0.4, borderWidth: 2,
          borderColor: '#26c6da', backgroundColor: 'rgba(38,198,218,.25)' },
        { label: 'Ventas Frecuentes', data: [58,48,28,88,38,5,22,60,56],
          fill: false, tension: 0.4, borderWidth: 2, borderColor: '#3f51b5' }
      ]
    };
    this.orderGraphOpts = {
      plugins: { legend: { display: true }, tooltip: { enabled: true } },
      elements: { point: { radius: 3 } },
      scales: { x: { grid: { display: true } }, y: { grid: { display: true }, suggestedMin: 0, suggestedMax: 90 } }
    };
  }

  mkSpark(data: number[], stroke: string, fill: string) {
    return {
      labels: Array(data.length).fill(''),
      datasets: [{ data, borderColor: stroke, backgroundColor: fill, tension: 0.4, fill: true, borderWidth: 2 }]
    };
  }
  mkSparkOpts() {
    return {
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      responsive: false,
      elements: { point: { radius: 0 } },
      scales: { x: { display: false }, y: { display: false } }
    };
  }
}
